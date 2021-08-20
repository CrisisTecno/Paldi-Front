import { getCycleDays } from "../../date/order/getCycleDays"
import { getDPFCDays } from "../../date/order/getDPFCDays"
import { getProductionDays } from "../../date/order/getProductionDays"
import { getTransitDays } from "../../date/order/getTransitDays"
import { getDefaultInitialLoadOrderObject } from "../defaults"

export const buildGetOrderObject = (paldiService) => {
  const loadMixedOrder = buildLoadMixedOrder(paldiService)

  const getOrderObject = async (id, sortedProducts) => {
    const order = await paldiService.orders.get(id)

    return {
      order: order,
      quoteStatus: order.quoteStatus,
      quoteSubStatus: order.quoteSubStatus,
      products: order.products,
      isSubOrder: false,
      isMaster: order.type === 'Mixta',
      mixedLabel: order.mixedLabel ?? "Mixta",
      isSubOrder: order.orderParent,
      ...(order.type === "Mixta" ? await loadMixedOrder(order.id, order, sortedProducts) : loadNormalOrder(order, sortedProducts)),
      ...buildMoments(order)
    }

  }
  return getOrderObject
}

const buildMoments = (order) => {
  const keys = [
    ['cycleStartDate', 'cycleStartDate'],
    ['cycleFinishDate', 'cycleFinishDate'],
    ['commitmentDate', 'commitmentDate'],
    ['productionStartDate', 'productionDate'],
    ['productionFinishDate', 'productionFinishDate'],
    ['productionLimitDate', 'productionLimitDate'],
    ['transitStartDate', 'transitDate'],
    ['transitFinishDate', 'transitFinishDate'],
    ['transitLimitDate', 'transitLimitDate']
  ]
  let result = {
    currentDate: moment(),
  }

  keys.forEach(([scopeKey, key]) => { result[scopeKey] = order[key] ? moment(order[key]) : null })
  result = {
    ...result,
    cycleDays: getCycleDays(order.currentDate, order.cycleStartDate, order.cycleFinishDate),
    transitDays: getTransitDays(order.currentDate, order.transitStartDate, order.transitFinishDate, order.transitLimitDate),
    ...getDPFCDays(order.cycleStartDate, order.commitmentDate, order.cycleFinishDate),
    ...getProductionDays(order.productionStartDate, order.productionLimitDate, order.productionFinishDate)
  }
}

const loadNormalOrder = (order, sortedProducts) => {
  order.products?.forEach(product => addProduct(product, order, sortedProducts))
}

const buildLoadMixedOrder = (paldiService) => async (id, order, sortedProducts) => {
  const rawSubOrders = await paldiService.orders.getByOrderParent(id)
  const subOrders = [...rawSubOrders]
  rawSubOrders.forEach(subOrder => subOrder.products?.forEach(product => addProduct(product, order, sortedProducts)))
  return {
    suborders: subOrders
  }
}

/// SIDE EFFECTS !!! -> Edits $scope.sortedProducts
const addProduct = (product, order, sortedProducts) => {
  const isMixedWithPersianasAndFiltrasol = order.mixedLabel != undefined &&
    order.mixedLabel.indexOf("Persianas") != -1 &&
    order.mixedLabel.indexOf("Filtrasol") != -1

  const isEnrollableOrFiltrasol = product.productType == "Enrollable" || product.productType == "Filtrasol"

  const finder = (isMixedWithPersianasAndFiltrasol && isEnrollableOrFiltrasol)
    ? ({ type }) => type === "Persiana o Filtrasol"
    : ({ type }) => type === product.productType

  let pos = sortedProducts.findIndex(finder)
  product.item = getComposedLength(sortedProducts) + 1;
  sortedProducts[pos].products.push(product);
};

const getComposedLength = (sortedProducts) => sortedProducts.reduce((prev, { products }) => prev + products.length, 0)