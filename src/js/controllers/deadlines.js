import { pdApp } from "./index";

pdApp.controller(
	"DeadlinesCtrl",
	function (
		$scope,
		$state,
		$rootScope,
		$compile,
		$filter,
		$timeout,
		paldiService,
		ngDialog,
		DTOptionsBuilder,
		DTColumnDefBuilder,
		DTColumnBuilder
	) {
		$scope.ready = false;

		$timeout(function () {
			if (
				$scope.currentUser.role != "SUPERADMIN" &&
				$scope.currentUser.role != "MANAGER" &&
				$scope.currentUser.role != "SALES_MANAGER" &&
				$scope.currentUser.role != "BUYER"
			) {
				$state.go("console.quote-list");
			}
		}, 200);

		$scope.getTypeTitle = function (type) {
			switch (type) {
				case "TODAY":
					return "Hoy";
				case "TOMORROW":
					return "Mañana";
				case "PAST":
					return "Vencidas";
			}
			return "";
		};

		var loadDays = function () {
			$scope.days = [];
			var ignoredDay = null;
			var i = 0;
			while ($scope.days.length < 7) {
				var day = moment();
				day.add(i, "days");
				if (day.isoWeekday() != 7) {
					$scope.days.push({ date: day.toDate(), value: i });
				} else {
					$scope.downloadLink =
						paldiService.deadlines.getDeadlinesDownloadLink(i);
				}
				i++;
			}
		};

		//=========================================================================
		function createdRow(row, data, dataIndex) {
		
			$compile(angular.element(row).contents())($scope);
		}

		var transitData = function (sSource, aoData, fnCallback, oSettings) {
			var sear = aoData[5].value.value;
			var draw = aoData[0].value;
			var sort =
				$scope.type == "PAST"
					? aoData[1].value[aoData[2].value[0].column].name +
					  "," +
					  aoData[2].value[0].dir
					: aoData[1].value[aoData[2].value[0].column].name +
					  " " +
					  aoData[2].value[0].dir;
			var size = aoData[4].value;
			var page = aoData[3].value / size;

			if ($scope.type == "PAST") {
				paldiService.deadlines
					.getPastDeadlines("TRANSIT", page, size, sort)
					.then(function (data) {
						var result = {
							draw: draw,
							recordsTotal: data.totalElements,
							recordsFiltered: data.totalElements,
							data: data.content,
						};
						fnCallback(result);
					});
			} else {
				paldiService.deadlines
					.getDeadlines(
						$scope.type,
						"TRANSIT",
						page * size,
						size,
						sort
					)
					.then(function (data) {
						var result = {
							draw: draw,
							recordsTotal: data.numFound,
							recordsFiltered: data.numFound,
							data: data.docs,
						};
						fnCallback(result);
					});
			}
		};

		var productionData = function (sSource, aoData, fnCallback, oSettings) {
			var sear = aoData[5].value.value;
			var draw = aoData[0].value;
			var sort =
				$scope.type == "PAST"
					? aoData[1].value[aoData[2].value[0].column].name +
					  "," +
					  aoData[2].value[0].dir
					: aoData[1].value[aoData[2].value[0].column].name +
					  " " +
					  aoData[2].value[0].dir;
			var size = aoData[4].value;
			var page = aoData[3].value / size;

			if ($scope.type == "PAST") {
				paldiService.deadlines
					.getPastDeadlines("PRODUCTION", page, size, sort)
					.then(function (data) {
						var result = {
							draw: draw,
							recordsTotal: data.totalElements,
							recordsFiltered: data.totalElements,
							data: data.content,
						};
						fnCallback(result);
					});
			} else {
				paldiService.deadlines
					.getDeadlines(
						$scope.type,
						"PRODUCTION",
						page * size,
						size,
						sort
					)
					.then(function (data) {
						var result = {
							draw: draw,
							recordsTotal: data.numFound,
							recordsFiltered: data.numFound,
							data: data.docs,
						};
						fnCallback(result);
					});
			}
		};

		$scope.transitTableOptions = DTOptionsBuilder.newOptions()
			.withLanguageSource("lang/table_lang.json")
			.withFnServerData(transitData)
			.withOption("processing", true)
			.withOption("serverSide", true)
			.withDisplayLength(20)
			.withDOM("tp")
			.withOption("createdRow", createdRow);

		var transitColumns = [
			DTColumnBuilder.newColumn(null)
				.withOption("name", "no_l")
				.withTitle("No. orden")
				.renderWith(function (data) {
					if (!data.isSuborder_b) {
						return (
							'<a href="#/console/order/' +
							data.id +
							'">' +
							data.no_l +
							"<a>"
						);
					} else {
						return (
							'<a href="#/console/order/' +
							data.id +
							'">' +
							data.suborderNo +
							"<a>"
						);
					}
				}),
				DTColumnBuilder.newColumn(null)
				.withOption("Id", "no_l")
				.withTitle("Nombre")
				.renderWith(function (data) {
					return (
						'<a>' 
						+ data.clientName_txt +
						"</a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "providerId_s")
				.withTitle("Proveedor")
				.renderWith(function (data) {
					var provider = data.providerId_s
						? data.providerId_s
						: " - ";
					return (
						'<a href="#/console/order/' +
						data.id +
						'">' +
						provider +
						"<a>"
					);
				}),
				DTColumnBuilder.newColumn(null)
				.withOption("refer", "no_l")
				.withTitle("Folio de Producción")
				.renderWith(function (data) {
					
					
					return (
						'<a>' 
						+ data.dataB.orderTransitInvoice +
						"</a>"
					);
				}),
				DTColumnBuilder.newColumn(null)
				.withOption("refer1", "no_l")
				.withTitle("Guía de Rastreo")
				.renderWith(function (data) {
					
					
					return (
						'<a href="https://paquetexpress.com.mx/rastreo/' +(data.dataB.guides? data.dataB.guides[0].trim() :"") + '">' 
						+ (data.dataB.guides? data.dataB.guides[0] :"") +
						"</a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "transitDate_dt")
				.withTitle("Embarque")
				.renderWith(function (data) {
					var date =
						data.transitDate_dt != null ? data.transitDate_dt : "-";
					return (
						'<a href="#/console/order/' +
						data.id +
						'">' +
						$filter("date")(date, "dd/MM/yyyy") +
						"<a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "arrivalDate_dt")
				.withTitle("Llegada")
				.renderWith(function (data) {
					var date =
						data.arrivalDate_dt != null ? data.arrivalDate_dt : "-";
					return (
						'<a href="#/console/order/' +
						data.id +
						'">' +
						$filter("date")(date, "dd/MM/yyyy") +
						"<a>"
					);
				}),
			DTColumnBuilder.newColumn(null).renderWith(function (data) {
				var id = "&#39;" + data.id + "&#39;";
				var dateType = "&#39;arrival&#39;";
				if (
					$scope.currentUser.role != "SALES_MANAGER" &&
					$scope.currentUser.role != "BUYER"
				) {
					return (
						'<button class="btn btn-xs btn-danger" ng-click="changeDateDialog(' +
						dateType +
						"," +
						id +
						')">Cambiar fecha</button>'
					);
				} else {
					return "";
				}
			}),
		];

		var transitColumnsPast = [
			DTColumnBuilder.newColumn(null)
				.withOption("name", "orderNo")
				.withTitle("No. orden")
				.renderWith(function (data) {
					if (!data.isSuborder_b) {
						return (
							'<a href="#/console/order/' +
							data.id +
							'">' +
							data.orderNo +
							"<a>"
						);
					} else {
						return (
							'<a href="#/console/order/' +
							data.id +
							'">' +
							data.suborderNo +
							"<a>"
						);
					}
				}),
				DTColumnBuilder.newColumn(null)
				.withOption("Id", "no_l")
				.withTitle("Nombre")
				.renderWith(function (data) {
					return (
						'<a>' 
						+ data.client +
						"</a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "providerId")
				.withTitle("Proveedor")
				.renderWith(function (data) {
					var provider = data.providerId ? data.providerId : " - ";
					return (
						'<a href="#/console/order/' +
						data.orderId +
						'">' +
						provider +
						"<a>"
					);
				}),
				DTColumnBuilder.newColumn(null)
				.withOption("refer", "no_l")
				.withTitle("Folio de Producción")
				.renderWith(function (data) {
					
					
					return (
						'<a>' 
						+ data.dataB.orderTransitInvoice +
						"</a>"
					);
				}),
				DTColumnBuilder.newColumn(null)
				.withOption("refer1", "no_l")
				.withTitle("Guía de Rastreo")
				.renderWith(function (data) {
					
					
					return (
						'<a href="https://paquetexpress.com.mx/rastreo/' +(data.dataB.guides? data.dataB.guides[0].trim() :"") + '">' 
						+ (data.dataB.guides? data.dataB.guides[0] :"") +
						"</a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "startDate")
				.withTitle("Embarque")
				.renderWith(function (data) {
					var date = data.startDate != null ? data.startDate : "-";
					return (
						'<a href="#/console/order/' +
						data.orderId +
						'">' +
						$filter("date")(date, "dd/MM/yyyy") +
						"<a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "originalEndDate")
				.withTitle("Ideal")
				.renderWith(function (data) {
					var date =
						data.originalEndDate != null
							? data.originalEndDate
							: "-";
					return (
						'<a href="#/console/order/' +
						data.orderId +
						'">' +
						$filter("date")(date, "dd/MM/yyyy") +
						"<a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "endDate")
				.withTitle("Programada")
				.renderWith(function (data) {
					var date = data.endDate != null ? data.endDate : "-";
					return (
						'<a href="#/console/order/' +
						data.orderId +
						'">' +
						$filter("date")(date, "dd/MM/yyyy") +
						"<a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "realDate")
				.withTitle("Llegada")
				.renderWith(function (data) {
					var date = data.realDate != null ? data.realDate : "-";
					return (
						'<a href="#/console/order/' +
						data.orderId +
						'">' +
						$filter("date")(date, "dd/MM/yyyy") +
						"<a>"
					);
				}),
			/*,
    DTColumnBuilder.newColumn(null).renderWith(function(data){
        var id = '&#39;' + data.orderId + '&#39;';
        var dateType = '&#39;arrival&#39;';
        return '<button class="btn btn-xs btn-danger" ng-click="changeDateDialog('+ dateType + ',' + id +')">Cambiar fecha</button>';
    })*/
		];

		$scope.productionTableOptions = DTOptionsBuilder.newOptions()
			.withLanguageSource("lang/table_lang.json")
			.withFnServerData(productionData)
			.withOption("processing", true)
			.withOption("serverSide", true)
			.withDisplayLength(20)
			.withDOM("tp")
			.withOption("createdRow", createdRow);

		var productionColumns = [
			DTColumnBuilder.newColumn(null)
				.withOption("name", "no_l")
				.withTitle("No. orden")
				.renderWith(function (data) {
					if (!data.isSuborder_b) {
						return (
							'<a href="#/console/order/' +
							data.id +
							'">' +
							data.no_l +
							"<a>"
						);
					} else {
						return (
							'<a href="#/console/order/' +
							data.id +
							'">' +
							data.suborderNo +
							"<a>"
						);
					}
				}),
				DTColumnBuilder.newColumn(null)
				.withOption("Id", "no_l")
				.withTitle("Nombre")
				.renderWith(function (data) {
					return (
						'<a>' 
						+ data.clientName_txt +
						"</a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "providerId_s")
				.withTitle("Proveedor")
				.renderWith(function (data) {
					var provider = data.providerId_s
						? data.providerId_s
						: " - ";
					return (
						'<a href="#/console/order/' +
						data.id +
						'">' +
						provider +
						"<a>"
					);
				}),
				DTColumnBuilder.newColumn(null)
				.withOption("refer", "no_l")
				.withTitle("Folio de Producción")
				.renderWith(function (data) {
				
					
					return (
						'<a>' 
						+ data.dataB.orderTransitInvoice +
						"</a>"
					);
				}),
				DTColumnBuilder.newColumn(null)
				.withOption("refer1", "no_l")
				.withTitle("Guía de Rastreo")
				.renderWith(function (data) {
					
					
					return (
						'<a href="https://paquetexpress.com.mx/rastreo/' +(data.dataB.guides? data.dataB.guides[0].trim() :"") + '">' 
						+ (data.dataB.guides? data.dataB.guides[0] :"") +
						"</a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "productionDate_dt")
				.withTitle("Entrada")
				.renderWith(function (data) {
					var date =
						data.productionDate_dt != null
							? data.productionDate_dt
							: "-";
					return (
						'<a href="#/console/order/' +
						data.id +
						'">' +
						$filter("date")(date, "dd/MM/yyyy") +
						"<a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "endProductionDate_dt")
				.withTitle("Salida")
				.renderWith(function (data) {
					var date =
						data.endProductionDate_dt != null
							? data.endProductionDate_dt
							: "-";
					return (
						'<a href="#/console/order/' +
						data.id +
						'">' +
						$filter("date")(date, "dd/MM/yyyy") +
						"<a>"
					);
				}),
			DTColumnBuilder.newColumn(null).renderWith(function (data) {
				var id = "&#39;" + data.id + "&#39;";
				var dateType = "&#39;endProduction&#39;";
				if (
					$scope.currentUser.role != "SALES_MANAGER" &&
					$scope.currentUser.role != "BUYER"
				) {
					return (
						'<button class="btn btn-xs btn-danger" ng-click="changeDateDialog(' +
						dateType +
						"," +
						id +
						')">Cambiar fecha</button>'
					);
				} else {
					return "";
				}
			}),
		];

		var productionColumnsPast = [
			DTColumnBuilder.newColumn(null)
				.withOption("name", "orderNo")
				.withTitle("No. orden")
				.renderWith(function (data) {
					return (
						'<a href="#/console/order/' +
						data.orderId +
						'">' +
						data.orderNo +
						"<a>"
					);
				}),

				DTColumnBuilder.newColumn(null)
				.withOption("Id", "no_l")
				.withTitle("Nombre")
				.renderWith(function (data) {
					
					return (
						'<a>' 
						+ data.client +
						"</a>"
					);
				}),
				
			DTColumnBuilder.newColumn(null)
				.withOption("name", "providerId")
				.withTitle("Proveedor")
				.renderWith(function (data) {
					var provider = data.providerId ? data.providerId : " - ";
					return (
						'<a href="#/console/order/' +
						data.orderId +
						'">' +
						provider +
						"<a>"
					);
				}),
				DTColumnBuilder.newColumn(null)
				.withOption("refer", "no_l")
				.withTitle("Folio de Producción")
				.renderWith(function (data) {
					
					
					return (
						'<a>' 
						+ data.dataB.orderTransitInvoice +
						"</a>"
					);
				}),
				DTColumnBuilder.newColumn(null)
				.withOption("refer1", "no_l")
				.withTitle("Guía de Rastreo")
				.renderWith(function (data) {
					
					
					return (
						'<a href="https://paquetexpress.com.mx/rastreo/' +(data.dataB.guides? data.dataB.guides[0].trim() :"") + '">' 
						+ (data.dataB.guides? data.dataB.guides[0] :"") +
						"</a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "startDate")
				.withTitle("Entrada")
				.renderWith(function (data) {
					var date = data.startDate != null ? data.startDate : "-";
					return (
						'<a href="#/console/order/' +
						data.orderId +
						'">' +
						$filter("date")(date, "dd/MM/yyyy") +
						"<a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "originalEndDate")
				.withTitle("Ideal")
				.renderWith(function (data) {
					var date =
						data.originalEndDate != null
							? data.originalEndDate
							: "-";
					return (
						'<a href="#/console/order/' +
						data.orderId +
						'">' +
						$filter("date")(date, "dd/MM/yyyy") +
						"<a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "endDate")
				.withTitle("Programada")
				.renderWith(function (data) {
					var date = data.endDate != null ? data.endDate : "-";
					return (
						'<a href="#/console/order/' +
						data.orderId +
						'">' +
						$filter("date")(date, "dd/MM/yyyy") +
						"<a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "realDate")
				.withTitle("Salida")
				.renderWith(function (data) {
					var date = data.realDate != null ? data.realDate : "-";
					return (
						'<a href="#/console/order/' +
						data.orderId +
						'">' +
						$filter("date")(date, "dd/MM/yyyy") +
						"<a>"
					);
				}),
		];

		$scope.typeChange = function (type) {
			if (type != $scope.type) {
				$scope.ready = false;
				$scope.type = type;
				if (type == "PAST") {
					$scope.transitColumns = transitColumnsPast;
					$scope.productionColumns = productionColumnsPast;
				} else {
					$scope.transitColumns = transitColumns;
					$scope.productionColumns = productionColumns;
				}
				var transitTable = angular.element(
					document.querySelector("#transit-table_wrapper")
				);
				transitTable.remove();
				var productionTable = angular.element(
					document.querySelector("#production-table_wrapper")
				);
				productionTable.remove();
				var datatable = $("#transit-table").dataTable().api();
				datatable.draw();
				datatable = $("#production-table").dataTable().api();
				datatable.draw();
				$timeout(function () {
					$scope.ready = true;
				}, 1000);
			}
		};

		$scope.changeDateDialog = function (dateType, orderId) {
			$scope.dateModel = {};
			$scope.date = new Date();
			$scope.currentOrderId = orderId;
			$scope.dateType = dateType;
			$scope.dialog = ngDialog.open({
				template: "partials/views/console/datepicker.html",
				scope: $scope,
				showClose: false,
			});
		};

		$scope.dateChanged = function (calendar) {
			$scope.date = calendar.date;
		};

		$scope.changeDate = function (model) {
			$scope.dialog.close();
			var message =
				$scope.dateType == "arrival"
					? "fecha de llegada"
					: "fecha de salida de producción";
			paldiService.orders
				.setDate(
					$scope.currentOrderId,
					$scope.dateType,
					$scope.date,
					model.notes
				)
				.then(function () {
					swal({
						title: "Fecha cambiada",
						text: "Se capturó la " + message,
						type: "success",
						confirmButtonText: "Aceptar",
					});
					$scope.typeChange($scope.type);
				});
		};

		//------
		loadDays();
		$scope.typeChange("0");
	}
);
