import { pdApp } from "./index";
import { globals } from "./index";

pdApp.controller(
	"PaymentsCtrl",
	function (
		$rootScope,
		$state,
		$scope,
		$compile,
		$timeout,
		paldiService,
		$filter,
		DTOptionsBuilder,
		DTColumnDefBuilder,
		DTColumnBuilder,
		ngDialog
	) {
		$timeout(function () {
			if (
				!$scope.currentUser.canAdmin &&
				$scope.currentUser.role != "SALES_MANAGER"
			) {
				$state.go("console.quote-list");
			}
		}, 200);
		$scope.isEmpty = true;
		$scope.isPaying = false;

		var start;
		var end;

		var setDates = function (date) {
			$scope.month = moment(date).date(1).toDate();
			$scope.past = moment(date).date(1).subtract(1, "months").toDate();
			$scope.next = moment(date).date(1).add(1, "months").toDate();
			$scope.currentLabel =
				$scope.pretty("month", moment($scope.month).format("MMMM")) +
				" - " +
				$scope.month.getFullYear();
			start = moment($scope.month)
				.set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
				.toDate();
			end = moment(start)
				.add(1, "months")
				.subtract(1, "seconds")
				.toDate();
			$scope.downloadLink = paldiService.payments.getPaymentsDownloadLink(
				start.toJSON(),
				end.toJSON(),
				"Pagos_" + $scope.currentLabel
			);
			if ($scope.next > new Date()) {
				$scope.next = null;
			}
		};

		setDates(new Date());

		$scope.goto = function (date) {
			setDates(date);
			var datatable = $("#payment-table").dataTable().api();
			datatable.draw();
		};

		var prettyPaymentStatus = function (status) {
			switch (status) {
				case "ADVANCE":
					return "Anticipo";
				case "PAYMENT":
					return "Pago";
				case "LIQUIDATED":
					return "Liquidación";
				case "DISCOUNT":
					return "Descuento sobre venta";
			}
			return status;
		};

		//============= Data tables =============
		function createdRow(row, data, dataIndex) {
			$compile(angular.element(row).contents())($scope);
		}

		var serverData = function (sSource, aoData, fnCallback, oSettings) {
			var sear = aoData[5].value.value;
			var draw = aoData[0].value;
			var sort =
				aoData[1].value[aoData[2].value[0].column].name +
				"," +
				aoData[2].value[0].dir;
			var size = aoData[4].value;
			var page = aoData[3].value / size;

			var processResult = function (data, fnCallback) {
				var result = {
					draw: draw,
					recordsTotal: data.numberOfElements,
					recordsFiltered: data.totalElements,
					data: data.content,
				};
				fnCallback(result);
				$scope.isEmpty = result.recordsTotal > 0 ? false : true;
			};

			paldiService.payments
				.getPayments(page, start, end, size, sort)
				.then(function (data) {
					processResult(data, fnCallback);
				});
		};

		$scope.tableOptions = DTOptionsBuilder.newOptions()
			.withLanguageSource("lang/table_lang.json")
			.withFnServerData(serverData)
			.withOption("processing", true)
			.withOption("serverSide", true)
			.withOption("order", [0, "desc"])
			.withDisplayLength(15)
			.withDOM("tp")
			.withOption("createdRow", createdRow);

		$scope.tableColumns = [
			DTColumnBuilder.newColumn(null)
				.withOption("name", "date")
				.withTitle("Fecha")
				.renderWith(function (data) {
					return (
						'<a href="#/console/order/' +
						data.orderId +
						'">' +
						$filter("date")(data.date, "dd/MM/yyyy") +
						"</a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "orderNo")
				.withTitle("No. de Orden")
				.renderWith(function (data) {
					return (
						'<a href="#/console/order/' +
						data.orderId +
						'">' +
						data.orderNo +
						"</a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "folio")
				.withTitle("No. de Recibo")
				.renderWith(function (data) {
					return (
						'<a href="#/console/order/' +
						data.orderId +
						'">' +
						data.folio +
						"</a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("orderable", false)
				.withTitle("Vendedor")
				.renderWith(function (data) {
					var name = " - ";
					if (data.seller) {
						name = data.seller.name + " " + data.seller.lastName;
					}
					return (
						'<a href="#/console/order/' +
						data.orderId +
						'">' +
						name +
						"</a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("orderable", false)
				.withTitle("Cobró")
				.renderWith(function (data) {
					var name = " - ";
					if (data.user) {
						name = data.user.name + " " + data.user.lastName;
					}
					return (
						'<a href="#/console/order/' +
						data.orderId +
						'">' +
						name +
						"</a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "paymentStatus")
				.withTitle("Tipo de pago")
				.renderWith(function (data) {
					return (
						'<a href="#/console/order/' +
						data.orderId +
						'">' +
						prettyPaymentStatus(data.paymentStatus) +
						"</a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "advance")
				.withTitle("Monto")
				.renderWith(function (data) {
					return (
						'<a href="#/console/order/' +
						data.orderId +
						'">' +
						$filter("currency")(data.advance) +
						"</a>"
					);
				}),
			DTColumnBuilder.newColumn(null).renderWith(function (data) {
				var link =
					globals.apiURL +
					"/quotes/orders/" +
					data.orderId +
					"/receipt/" +
					data.id +
					"/recibo_" +
					data.folio +
					".pdf";
				return (
					'<a class="btn btn-xs btn-info pull-right" href="' +
					link +
					'" download="Recibo_' +
					data.folio +
					'.pdf">Descargar Recibo</a>'
				);
			}),
			DTColumnBuilder.newColumn(null).renderWith(function (data) {
				var id = "&#39;" + data.id + "&#39;";
				if (data.cancelled) {
					return "<b>CANCELADO</b>";
				} else {
					return (
						'<a ng-if="currentUser.canAdmin && ' +
						!data.cancelled +
						'" class="btn btn-xs btn-danger pull-right" ng-click="cancelPaymentDialog(' +
						id +
						')">Cancelar pago</a>'
					);
				}
			}),
		];

		$scope.cancelPaymentDialog = function (paymentId) {
			$scope.paymentId = paymentId;
			$scope.dialog = ngDialog.open({
				template: "partials/views/console/payment-cancel.html",
				scope: $scope,
				showClose: false,
			});
		};

		$scope.cancelPayment = function (form, notes) {
			if (form.$valid) {
				swal(
					{
						title: "¿Seguro que desea cancelar el Pago?",
						type: "warning",
						showCancelButton: true,
						confirmButtonColor: "#DD6B55",
						confirmButtonText: "Aceptar",
						cancelButtonText: "Cancelar",
						closeOnConfirm: false,
						closeOnCancel: false,
					},
					function (isConfirm) {
						if (isConfirm && !$scope.isPaying) {
							$scope.isPaying = true;
							var cancelRequest = {
								user: $scope.currentUser,
								paymentId: $scope.paymentId,
								notes: notes,
							};
							paldiService.payments.cancel(cancelRequest).then(
								function () {
									swal({
										title: "Pago cancelado",
										type: "success",
										confirmButtonText: "Aceptar",
									});
									$("#payment-table")
										.dataTable()
										.api()
										.draw();
									$scope.dialog.close();
									$scope.isPaying = false;
								},
								function (error) {
									// //console.log(error);
									$scope.isPaying = false;
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
			} else {
				form.$validated = true;
			}
		};
		//---------------------------------------------------
	}
);
