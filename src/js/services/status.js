import { pdApp } from "./index";
pdApp.factory("statusHelper", function ($state, paldiService) {
	var changeToRejected = function (order) {};

	var changeToPending = function (order) {};

	var changeToLine = function (order) {};

	var changeToBackorder = function (order) {
		swal(
			{
				title: "¿Seguro que deseas marcar la orden como pendiente?",
				type: "warning",
				showCancelButton: true,
				confirmButtonColor: "#DD6B55",
				confirmButtonText: "Aceptar",
				cancelButtonText: "Cancelar",
				closeOnConfirm: false,
				closeOnCancel: false,
			},
			function (isConfirm) {
				if (isConfirm) {
					swal(
						{
							title: "Observaciones",
							type: "input",
							inputType: "text",
							showCancelButton: true,
							confirmButtonColor: "#DD6B55",
							confirmButtonText: "Siguiente",
							cancelButtonText: "Cancelar",
							closeOnConfirm: false,
							closeOnCancel: false,
						},
						function (notes) {
							var updatedOrder = order;
							updatedOrder.statusNotes = notes;
							paldiService.orders
								.updateStatus(updatedOrder, "BACKORDER")
								.then(function (order) {
									swal({
										title: "Orden Pendiente",
										text: "Se marcó la orden como pendiente",
										type: "success",
										confirmButtonText: "Aceptar",
									});
									$state.reload();
								});
						}
					);
				} else {
					swal({
						title: "Cancelado",
						type: "error",
						confirmButtonText: "Aceptar",
					});
				}
			}
		);
	};

	var changeToProduction = function (order) {};

	var changeToTransit = function (order) {};

	var changeToFinished = function (order) {};

	var changeToInstalled = function (order) {};

	var changeToIncomplete = function (order) {};

	var changeToNonConform = function (order) {};

	var service = {
		changeOrderTo: function (action, order) {
			switch (action) {
				case "rejected":
					changeToRejected(order);
					break;
				case "pending":
					changeToPending(order);
					break;
				case "line":
					changeToLine(order);
					break;
				case "backorder":
					changeToBackorder(order);
					break;
				case "production":
					changeToProduction(order);
					break;
				case "transit":
					changeToTransit(order);
					break;
				case "finished":
					changeToFinished(order);
					break;
				case "installed":
					changeToInstalled(order);
					break;
				case "incomplete":
					changeToIncomplete(order);
					break;
				case "nonConform":
					changeToNonConform(order);
					break;
				default:
					break;
			}
		},
	};

	return service;
});
