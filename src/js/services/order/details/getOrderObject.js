import { getCycleDays } from "../../date/order/getCycleDays";
import { getDPFCDays } from "../../date/order/getDPFCDays";
import { getProductionDays } from "../../date/order/getProductionDays";
import { getTransitDays } from "../../date/order/getTransitDays";
import { getDefaultInitialLoadOrderObject } from "../defaults";

export const buildGetOrderObject = (paldiService) => {
	const loadMixedOrder = buildLoadMixedOrder(paldiService);

	const getOrderObject = async (id, sortedProducts) => {
		let order;
		try {
			order = await paldiService.orders.get(id);
		} catch {
			return { step: "empty" };
		}

		const datesObject = buildMoments(order);

		return {
			order: {
				...order,
				pdfLink: paldiService.orders.getPdfLink(order),
				pdfOrderLink: await paldiService.orders.getPdfOrderLink(order),
				pdfInstallationSheetLink:
					await paldiService.orders.getPdfInstallationSheetLink(
						order
					),
				events: await paldiService.orders.getLog(id),
				installationPlusTotal: order.installationPlusTotal
					? order.installationPlusTotal
					: 0,
				payments: order.payments
					? await paldiService.orders.getReceiptLinks(order)
					: undefined,
			},
			installationSheet: {
				pdfLink: await paldiService.orders.getPdfInstallationSheetLink(
					order
				),
			},
			quoteStatus: order.quoteStatus,
			quoteSubStatus: order.quoteSubStatus,
			products: order.products,
			isSubOrder: false,
			isMaster: order.type === "Mixta",
			mixedLabel: order.mixedLabel ?? "Mixta",
			isSubOrder: order.orderParent,
			client: order.client,
			step: order ? "loaded" : "empty",
			productType: order.type,
			...(order.type === "Mixta"
				? await loadMixedOrder(order.id, order, sortedProducts)
				: loadNormalOrder(order, sortedProducts)),
			...datesObject,
		};
	};
	return getOrderObject;
};

const buildMoments = (order) => {
	const keys = [
		["cycleStartDate", "cycleStartDate"],
		["cycleFinishDate", "cycleFinishDate"],
		["commitmentDate", "commitmentDate"],
		["productionStartDate", "productionDate"],
		["productionFinishDate", "productionFinishDate"],
		["productionLimitDate", "productionLimitDate"],
		["transitStartDate", "transitDate"],
		["transitFinishDate", "transitFinishDate"],
		["transitLimitDate", "transitLimitDate"],
	];
	let result = {
		currentDate: moment(),
	};

	keys.forEach(([scopeKey, key]) => {
		result[scopeKey] = order[key] ? moment(order[key]) : null;
	});
	result = {
		...result,
		cycleDays: getCycleDays(
			result.currentDate,
			result.cycleStartDate,
			result.cycleFinishDate
		),
		transitDays: getTransitDays(
			result.currentDate,
			result.transitStartDate,
			result.transitFinishDate,
			result.transitLimitDate
		),
		...getDPFCDays(
			result.cycleStartDate,
			result.commitmentDate,
			result.cycleFinishDate
		),
		...getProductionDays(
			result.productionStartDate,
			result.productionLimitDate,
			result.productionFinishDate
		),
	};

	return result;
};

const loadNormalOrder = (order, sortedProducts) => {
	order.products?.forEach((product) =>
		addProduct(product, order, sortedProducts)
	);
};

const buildLoadMixedOrder =
	(paldiService) => async (id, order, sortedProducts) => {
		const rawSubOrders = await paldiService.orders.getByOrderParent(id);
		const subOrders = [...rawSubOrders];
		rawSubOrders.forEach((subOrder) =>
			subOrder.products?.forEach((product) =>
				addProduct(product, order, sortedProducts)
			)
		);
		return {
			suborders: subOrders,
		};
	};

/// SIDE EFFECTS !!! -> Edits $scope.sortedProducts
/// AN ALTERNATIVE IS REQUIRED
/// IDK WHAT TO DO
const addProduct = (product, order, sortedProducts) => {
	const isMixedWithPersianasAndFiltrasol =
		order.mixedLabel != undefined &&
		order.mixedLabel.indexOf("Persianas") != -1 &&
		order.mixedLabel.indexOf("Filtrasol") != -1;

	const isEnrollableOrFiltrasol =
		product.productType == "Enrollable" ||
		product.productType == "Filtrasol";

	const finder =
		isMixedWithPersianasAndFiltrasol && isEnrollableOrFiltrasol
			? ({ type }) => type === "Persiana o Filtrasol"
			: ({ type }) => type === product.productType;

	let pos = sortedProducts.findIndex(finder);
	product.item = getComposedLength(sortedProducts) + 1;
	sortedProducts[pos].products.push(product);
};

const getComposedLength = (sortedProducts) =>
	sortedProducts.reduce((prev, { products }) => prev + products.length, 0);
