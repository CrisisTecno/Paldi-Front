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
				$scope.currentUser.role != "BUYER" &&
				$scope.currentUser.role != "PROVIDER"
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
			var prov = ""
			if($scope.currentUser.role=="PROVIDER")
				prov=$scope.currentUser.id
			
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
						paldiService.deadlines.getDeadlinesDownloadLink(i,prov);
				}
				i++;
			}
		};

		//=========================================================================
		function createdRow(row, data, dataIndex) {
		
			$compile(angular.element(row).contents())($scope);
			
		}

		var transitData = function (sSource, aoData, fnCallback, oSettings) {
			// console.log("aoData",aoData)
			// console.log("fnCallback",fnCallback)
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
			var prov = ""
			var startDate = $filter('date')($scope.dateRange.start, 'yyyy-MM-dd');
    		var endDate = $filter('date')($scope.dateRange.end, 'yyyy-MM-dd');
			if($scope.currentUser.role=="PROVIDER")
				prov=$scope.currentUser.id
			if ($scope.type == "PAST") {
				paldiService.deadlines
					.getPastDeadlines("TRANSIT", page, size, sort,prov)
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
						sort,
						prov,
						startDate,
        				endDate
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
			// console.log("aoData",aoData)
			// console.log("fnCallback",fnCallback)
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
			var prov=''
			var startDate = $filter('date')($scope.dateRange.start, 'yyyy-MM-dd');
   			var endDate = $filter('date')($scope.dateRange.end, 'yyyy-MM-dd');
			if($scope.currentUser.role=="PROVIDER")
				prov=$scope.currentUser.id

			if ($scope.type == "PAST") {
				paldiService.deadlines
					.getPastDeadlines("PRODUCTION", page, size, sort,prov)
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
						sort,
						prov,
						startDate,
						endDate 
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
							'<a href="#/console/order/' + ($scope.currentUser.role=="PROVIDER"?"provider/" :"" )+
							data.id +
							'">' +
							data.no_l +
							"<a>"
						);
					} else {
						return (
							'<a href="#/console/order/' + ($scope.currentUser.role=="PROVIDER"?"provider/" :"" )+
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
					// console.log("transi register",data)
					return (
						'<a>' 
						+ data.clientName_txt +
						"</a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "providerId_s")
				.withTitle("ID_Proveedor")
				.renderWith(function (data) {
					var provider = data.id_proveedor
						? data.id_proveedor
						: " - ";
					return (
						'<a href="#/console/order/' + ($scope.currentUser.role=="PROVIDER"?"provider/" :"" )+
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
						+ (data.orderTransitInvoice ?? '-') +
						"</a>"
					);
					// return (
					// 	'<a>' 
					// 	+ data.dataB.orderTransitInvoice +
					// 	"</a>"
					// );
				}),
				DTColumnBuilder.newColumn(null)
				.withOption("refer1", "no_l")
				.withTitle("Guía de Rastreo")
				.renderWith(function (data) {
					
					
					if (Array.isArray(data.guides)) {
						return '<a>' + data.guides.join(', ') + '</a>';
					} else {
						// Manejar el caso en el que data.guides no es un arreglo
						return '<a>' + (data.guides??'-') + '</a>';
					}
					// return (
					// 	'<a href="https://paquetexpress.com.mx/rastreo/' +(data.dataB.guides &&data.dataB.guides.length>0 ? data.dataB.guides[0].trim() :"") + '">' 
					// 	+ (data.dataB.guides &&data.dataB.guides.length>0? data.dataB.guides[0] :"") +
					// 	"</a>"
					// );
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "transitDate_dt")
				.withTitle("Salida")
				.renderWith(function (data) {
					var date =
					data.endProductionDate_dt != null
						? data.endProductionDate_dt
						: "-";
				return (
					'<a href="#/console/order/' + ($scope.currentUser.role=="PROVIDER"?"provider/" :"" )+
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
						'<a href="#/console/order/' + ($scope.currentUser.role=="PROVIDER"?"provider/" :"" )+
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
					console.log("ptva",data)
					let iddata=data.id
					if($scope.currentUser.role=="PROVIDER") iddata=data.orderId
					
					if (!data.isSuborder_b) {
						return (
							'<a href="#/console/order/' + ($scope.currentUser.role=="PROVIDER"?"provider/" :"" )+
							data.orderId+
							'">' +
							data.orderNo +
							"<a>"
						);
					} else {
						return (
							'<a href="#/console/order/' + ($scope.currentUser.role=="PROVIDER"?"provider/" :"" )+
							data.orderId +
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
					// console.log("transi register",data)
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
					var provider = data.id_proveedor ? data.id_proveedor : " - ";
					return (
						'<a href="#/console/order/' + ($scope.currentUser.role=="PROVIDER"?"provider/" :"" )+
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
						'<a href="https://paquetexpress.com.mx/rastreo/' +(data.dataB.guides &&data.dataB.guides.length>0? data.dataB.guides[0].trim() :"") + '">' 
						+ (data.dataB.guides &&data.dataB.guides.length>0? data.dataB.guides[0] :"") +
						"</a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "startDate")
				.withTitle("Salida")
				.renderWith(function (data) {
					var date =
					data.endProductionDate_dt != null
						? data.endProductionDate_dt
						: "-";
				return (
					'<a href="#/console/order/' + ($scope.currentUser.role=="PROVIDER"?"provider/" :"" )+
					data.id +
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
						'<a href="#/console/order/' + ($scope.currentUser.role=="PROVIDER"?"provider/" :"" )+
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
						'<a href="#/console/order/' + ($scope.currentUser.role=="PROVIDER"?"provider/" :"" )+
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
					var date = data.arrivalDate_dt != null ? data.arrivalDate_dt : "-";
					return (
						'<a href="#/console/order/' + ($scope.currentUser.role=="PROVIDER"?"provider/" :"" )+
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
							'<a href="#/console/order/' + ($scope.currentUser.role=="PROVIDER"?"provider/" :"" )+
							data.id +
							'">' +
							data.no_l +
							"<a>"
						);
					} else {
						return (
							'<a href="#/console/order/' + ($scope.currentUser.role=="PROVIDER"?"provider/" :"" )+
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
				.withTitle("ID_Proveedor")
				.renderWith(function (data) {
					var provider = data.providerId_s
						? data.providerId_s
						: " - ";
					return (
						'<a href="#/console/order/' + ($scope.currentUser.role=="PROVIDER"?"provider/" :"" )+
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
						+ (data.orderTransitInvoice ?? '-') +
						"</a>"
					);
				}),
				DTColumnBuilder.newColumn(null)
				.withOption("refer1", "no_l")
				.withTitle("Guía de Rastreo")
				.renderWith(function (data) {
					
					
					
						if (Array.isArray(data.guides)) {
							return '<a>' + data.guides.join(', ') + '</a>';
						} else {
							// Manejar el caso en el que data.guides no es un arreglo
							return '<a>' + (data.guides??'-') + '</a>';
						}
				
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "productionDate_dt")
				.withTitle("Entrada")
				.renderWith(function (data) {
					// console.log("production date",data)
					var date =
					data.arrivalDate_dt != null ? data.arrivalDate_dt : "-";
				return (
					'<a href="#/console/order/' + ($scope.currentUser.role=="PROVIDER"?"provider/" :"" )+
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
						'<a href="#/console/order/' + ($scope.currentUser.role=="PROVIDER"?"provider/" :"" )+
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
					if (!data.isSuborder_b) {
						
						return (
							'<a href="#/console/order/' + ($scope.currentUser.role=="PROVIDER"?"provider/" :"" )+
							data.orderId+
							'">' +
							data.orderNo +
							"<a>"
						);
					} else {
						
						return (
							'<a href="#/console/order/' + ($scope.currentUser.role=="PROVIDER"?"provider/" :"" )+
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
						'<a href="#/console/order/' + ($scope.currentUser.role=="PROVIDER"?"provider/" :"" )+
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
						'<a href="https://paquetexpress.com.mx/rastreo/' +(data.dataB.guides &&data.dataB.guides.length>0? data.dataB.guides[0].trim() :"") + '">' 
						+ (data.dataB.guides &&data.dataB.guides.length>0? data.dataB.guides[0] :"") +
						"</a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "startDate")
				.withTitle("Entrada")
				.renderWith(function (data) {
					console.log("production data",data)
					var date =
					data.arrivalDate_dt != null ? data.arrivalDate_dt : "-";
				return (
					'<a href="#/console/order/' + ($scope.currentUser.role=="PROVIDER"?"provider/" :"" )+
					data.id +
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
						'<a href="#/console/order/' + ($scope.currentUser.role=="PROVIDER"?"provider/" :"" )+
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
						'<a href="#/console/order/' + ($scope.currentUser.role=="PROVIDER"?"provider/" :"" )+
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
						'<a href="#/console/order/' + ($scope.currentUser.role=="PROVIDER"?"provider/" :"" )+
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

		// $scope.changeDateDialog = function (dateType, orderId) {
		// 	$scope.dateModel = {};
		// 	$scope.startDate  = new Date();
		// 	$scope.currentOrderId = orderId;
		// 	$scope.dateType = dateType;
		// 	$scope.invisible=true;
		// 	$scope.dialog = ngDialog.open({
		// 		template: "partials/views/console/datepicker.html",
		// 		scope: $scope,
		// 		showClose: false,
		// 		data: {
		// 			hideSomeElements: false 
		// 		}
		// 	});
		// };
		
		// $scope.changeDate = function(newDate) {   
		// 	$scope.startDate = newDate;
		// };

		// Controlador AngularJS
// $scope.dateModel = {
//     startDate: null,
//     endDate: null,
//     startDateOpened: false,
//     endDateOpened: false
// };

// $scope.changeDateDialog = function (dateType, orderId) {
//     $scope.currentOrderId = orderId;
//     $scope.dateType = dateType;
//     $scope.invisible = true;

//     // Decidir cuál datepicker mostrar
//     if (dateType === 'start') {
//         $scope.dateModel.startDateOpened = true;
//     } else if (dateType === 'end') {
//         $scope.dateModel.endDateOpened = true;
//     }

//     // Abrir el diálogo de ngDialog con el scope actual
//     $scope.dialog = ngDialog.open({
//         template: "partials/views/console/datepicker.html",
//         scope: $scope,
//         showClose: false,
//         data: {
//             hideSomeElements: false 
//         }
//     });
// };

// // Función para manejar la actualización de fechas
// $scope.changeDate = function (dateType, newDate) {
//     if (dateType === 'start') {
//         $scope.dateModel.startDate = newDate;
//     } else if (dateType === 'end') {
//         $scope.dateModel.endDate = newDate;
//     }
// };
// JavaScript en tu controlador
$scope.dateRange = {
    start: null,
    end: null,
    startOpened: false,
    endOpened: false
};

$scope.openDateDialog = function (type, orderId) {
    if(type === 'start'){
        $scope.dateRange.startOpened = true;
    } else if(type === 'end'){
        $scope.dateRange.endOpened = true;
    }
    // Aquí puedes manejar la apertura del diálogo si es necesario
};

// $scope.updateDateRange = function (type, newDate) {
//     if(type === 'start'){
//         $scope.dateRange.start = newDate;
//     } else if(type === 'end'){
//         $scope.dateRange.end = newDate;
//     }
// 	var aoData = [
// 		{ name: "draw", value: 1 },
// 		{
// 			name: "columns",
// 			value: [
// 				{ data: null, name: 'no_l', searchable: true, orderable: true, search: { value: '', regex: false } },
// 				{ data: null, name: '', searchable: true, orderable: true, search: { value: '', regex: false } },
// 				{ data: null, name: 'providerId_s', searchable: true, orderable: true, search: { value: '', regex: false } },
// 				{ data: null, name: '', searchable: true, orderable: true, search: { value: '', regex: false } },
// 				{ data: null, name: '', searchable: true, orderable: true, search: { value: '', regex: false } },
// 				{ data: null, name: 'productionDate_dt', searchable: true, orderable: true, search: { value: '', regex: false } },
// 				{ data: null, name: 'endProductionDate_dt', searchable: true, orderable: true, search: { value: '', regex: false } },
// 				{ data: null, name: '', searchable: true, orderable: true, search: { value: '', regex: false } },
// 				{ data: null, name: 'providerId_s', searchable: true, orderable: true, search: { value: '', regex: false } },
// 			]
// 		},
// 		{
// 			name: "order",
// 			value: [
// 				{ column: 0, dir: 'asc' }
// 			]
// 		},
// 		{ name: "start", value: 0 },
// 		{ name: "length", value: 20 },
// 		{
// 			name: "search",
// 			value: { value: '', regex: false }
// 		}
// 	];
// 	// var startDateFormatted = $filter('date')($scope.dateRange.start, 'yyyy-MM-dd');
//     // var endDateFormatted = $filter('date')($scope.dateRange.end, 'yyyy-MM-dd');

//     // if ($scope.dateRange.start && $scope.dateRange.end) {
        
//     //     transitData(/* parámetros que normalmente pasas a transitData */);
//     //     productionData(/* parámetros que normalmente pasas a productionData */);
//     // }
// };
$scope.updateDateRange = function () {
    if ($scope.dateRange.start && $scope.dateRange.end) {
        // Establecer 'ready' a false ocultará las tablas y destruirá las instancias de DataTables
        $scope.ready = false;

        // Necesitamos esperar un ciclo de digest para que 'ng-if' procese el cambio
        $timeout(function () {
            // Ahora que las tablas han sido destruidas, establecemos 'ready' a true para recrearlas
            $scope.ready = true;

            // Debido a que las tablas se recrearán, DataTables hará nuevas llamadas al servidor
            // para obtener los datos con las fechas actualizadas que se configuraron en 'productionTableOptions' y 'transitTableOptions'
        });
    }
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