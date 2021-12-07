import { orders } from "../../utils/swal/messages";

const pipe = (...args) => args.reduce((acc, el) => el(acc));

const SHIPPING_PRICES = {
  maxPiecesDefault: 4,
  smallOrderPrice: 27,
  defaultPrice: 7,
  overWidth: 100
}

export const getShippingCost = (products) => {
  if (products?.length <= 0)
    return 0
  
  const productQuantity = pipe(
    products,
    (products) => products.map(product => isNaN(product.quantity) ? 0 : product.quantity),
    (quantities) => quantities.reduce((prev, curr) => prev + curr, 0)
  )
  
  const prices = products.map(product => {
    product.quantity = isNaN(product.quantity) ? 0 : product.quantity
    // The rules for calculating the shipping prices are defined below
    if (product?.width >= 1000) {
      return SHIPPING_PRICES.overWidth * product.quantity
    }
  
    if (productQuantity <= SHIPPING_PRICES.maxPiecesDefault) {
      // Because an item that is below the 4 items order mark may be +1000 inches in width,
      // We calculate the remaining cost based on the remaining items
      // ex: 100 + (27/4) * 3 
      return (SHIPPING_PRICES.smallOrderPrice / SHIPPING_PRICES.maxPiecesDefault) * product.quantity
    }
    return SHIPPING_PRICES.defaultPrice * product.quantity
  })

  const subTotal = prices.reduce((p, c) => p + c, 0)
  
  // Solve the edge case where the amount of items to ship is less than maxPiecesDefault
  // ex: 3 items
  // subTotal = (27/4) * 3  which is not 27, this fixes that case while not overriding if the cost is more than 27.
  let total = subTotal
  if (productQuantity <= SHIPPING_PRICES.maxPiecesDefault && total < SHIPPING_PRICES.smallOrderPrice) {
    total = SHIPPING_PRICES.smallOrderPrice
  }
  return total
}