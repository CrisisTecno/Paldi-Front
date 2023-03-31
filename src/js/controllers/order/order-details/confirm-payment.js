import { showSwal } from "../../../utils/swal/show";
import { showCreateInstallationSheetDialog } from "./installation-sheet/create";

const getAdvance = (model) =>
	model.currency === "DOLLARS"
		? parseFloat(model.advance * model.exchangeRate).toFixed(2)
		: model.advance;
const getAdvanceDollars = (model) =>
	model.currency == "DOLLARS" ? model.advance : null;
const getExchangeRate = (model) =>
	model.currency == "DOLLARS" ? model.exchangeRate : null;
const getBankPaymentType = (model) =>
	model.type == "BANK" ? model.bankType : null;

const getProps = (model) => ({
	title: `${EXECUTION_ENV=="EXTERNAL"?"Do you want do sent the order with ":"¿Seguro que deseas enviar la orden con"} $${model.advance} ${
		model.currency == "PESOS" ? "M.N." : "Dlls"
	}?`,
	type: "warning",
	showCancelButton: true,
	confirmButtonColor: "#DD6B55",
	confirmButtonText: "Aceptar",
	cancelButtonText: "Cancelar",
	closeOnConfirm: true,
	closeOnCancel: false,
});

const getPaymentInfo = ($scope, model) => ({
	advance: getAdvance(model),
	advanceDollars: getAdvanceDollars(model),
	notes: model.notes,
	currency: model.currency,
	exchangeRate: getExchangeRate(model),
	paymentType: model.type,
	bankPaymentType: getBankPaymentType(model),
	date: new Date(),
	user: $scope.currentUser,
	isDiscountPayment: model.isDiscountPayment ?? false,
	sendToClient: model.sendToClient ?? false,
});

const performPayment = async (context, $scope, updatedOrder) => {
	const payment = updatedOrder.payment;
	try {
		const result = await context.paldiService.payments.pay($scope.order.id, payment);

		showSwal("messages.payment.success");
    context.loadOrder();
	} catch {
		showSwal("messages.error");
    $scope.isPaying = false;
	}
};

const performCustomAdvance = (context, $scope, updatedOrder) => {
	$scope.dateDialog("commitment");
	$scope.updatedCustomOrder = updatedOrder;
};

const updateOrder = async function (context, $scope,$timeout, updatedOrder, model) {

	try {
		
		const callback = async function () {
			
			const order = await context.paldiService.orders.updateStatus(
				updatedOrder,
				"LINE"
			).catch(e=>{
				const callbacks = () => {
					$scope.isPaying = false;
					context.loadOrder();
				  }
				  
				if (
					e.data?.exception ===
					"io.lkmx.paldi.quote.components.error.InventoryNotEnoughException"
				) {
					showSwal("messages.orders.notEnoughInventory", callbacks);
				} else {
					showSwal("messages.error", callbacks);
				}
			})

			if(order){
			showSwal("messages.orders.fromQuote");
			if (order.type === "Mixta") {
				context.createSuborders(model, order);
				context.$state.go("console.order-list");
			}
		
			
      $scope.isPaying = false;
      context.loadOrder();
		}
		};
		
		await showCreateInstallationSheetDialog($scope,$timeout, callback);
	} catch (error) {
	 
    const callback = () => {
      $scope.isPaying = false;
      context.loadOrder();
    }
		if (
			error?.data?.exception ===
			"io.lkmx.paldi.quote.components.error.InventoryNotEnoughException"
		) {
			showSwal("messages.orders.notEnoughInventory", callback);
		} else {
			showSwal("messages.error", callback);
		}
	}
};

const perfomAdvance = async (context, $scope,$timeout, updatedOrder, model) => {
	if ($scope.productType == "Custom")
		return performCustomAdvance(context, $scope, updatedOrder, model);

	const order = await context.paldiService.orders.get(updatedOrder.id);
	if (order.quote) {
		
		await updateOrder(context, $scope,$timeout, updatedOrder, model);
	} else {
		context.loadOrder();
		context.$timeout(() => showSwal("messages.error"), 400);
	}
};

const processPayment = (context, $scope,$timeout, model) => {
	$scope.isPaying = true;
	let updatedOrder = $scope.order;
	
	updatedOrder.payment = getPaymentInfo($scope, model);

	if ($scope.paymentType === "payment")
		performPayment(context, $scope, updatedOrder, model);
	if ($scope.paymentType == "advance")
		perfomAdvance(context, $scope,$timeout, updatedOrder, model);
	$scope.paymentType = "";
};


export const getConfirmPayment = (context, $scope,$timeout, model) => {
	function paymentSwalHandler (model, confirm) {
		context = $scope;
		if ($scope.isPaying || !confirm) {
			$scope.paymentType = "";
			showSwal("messages.cancel");
			return;
		}
		processPayment(context, $scope,$timeout, model);
		$scope.paymentType = "";
	};

	return (model) => {
		swal(getProps(model), function (confirm) {
			paymentSwalHandler(model, confirm);
		});
	};
};
