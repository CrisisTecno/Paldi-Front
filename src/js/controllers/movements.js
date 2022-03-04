import { pdApp } from "./index";

pdApp.controller(
	"MovementsCtrl",
	function (
		$rootScope,
		$scope,
		$compile,
		$filter,
		$location,
		$state,
		$timeout,
		paldiService,
		ngDialog,
		DTOptionsBuilder,
		DTColumnDefBuilder,
		DTColumnBuilder,
		sessionHelper
	) {
		var statusLists = sessionHelper.getMovementsStatusLists();
		var inStatusList = statusLists.inStatusList;
		var outStatusList = statusLists.outStatusList;
		var invStatusList = statusLists.invStatusList;

		var cleanStatusList = [];
		var cleanInStatusList = [];
		var cleanOutStatusList = [];
		var cleanInvStatusList = [];

		var search = "";
		$scope.availableStatusList = [];
		$scope.statusList = [];

		$scope.types = [
			{ value: "IN", label: "Entradas" },
			{ value: "OUT", label: "Salidas" },
			{ value: "INV", label: "Inventario" },
		];
		$scope.selectedType = "IN";
		$scope.ready = false;
		$scope.isEmpty = true;
		$scope.selectedOrderId = null;
		$scope.bills = [];
		$scope.startDate = "";
		$scope.endDate = "";

		var getDownloadLink = function () {
			$scope.downloadLink =
				paldiService.movements.getMovementsDownloadLink(
					search,
					$scope.startDate,
					$scope.endDate,
					cleanInStatusList,
					cleanOutStatusList,
					cleanInvStatusList
				);
		};

		$scope.typeChange = function (type) {
			$scope.type = false;
			$scope.selectedType = type;
			$scope.selectedOrderId = null;
			$scope.bills = [];
			switch (type) {
				case "IN":
					fillStatusList(inStatusList);
					break;
				case "OUT":
					fillStatusList(outStatusList);
					break;
				case "INV":
					fillStatusList(invStatusList);
					break;
			}
		};

		var statusChange = function () {
			cleanStatusList = [];

			angular.forEach($scope.statusList, function (status) {
				cleanStatusList.push(status.id);
			});
			switch ($scope.selectedType) {
				case "IN":
					$rootScope.movementsInList = $scope.statusList;
					cleanInStatusList = cleanStatusList;
					break;
				case "OUT":
					$rootScope.movementsOutList = $scope.statusList;
					cleanOutStatusList = cleanStatusList;
					break;
				case "INV":
					$rootScope.movementsInvList = $scope.statusList;
					cleanInvStatusList = cleanStatusList;
					break;
			}
			$scope.drawTable();
			$scope.ready = true;
		};

		var fillStatusList = function (list) {
			$scope.availableStatusList = [];
			switch ($scope.selectedType) {
				case "IN":
					$scope.statusList = $rootScope.movementsInList;
					break;
				case "OUT":
					$scope.statusList = $rootScope.movementsOutList;
					break;
				case "INV":
					$scope.statusList = $rootScope.movementsInvList;
					break;
			}
			angular.forEach(list, function (status) {
				$scope.availableStatusList.push({
					label: $scope.pretty("orderStatus", status),
					value: status,
				});
			});
			statusChange();
		};

		var cleanLists = function () {
			angular.forEach($rootScope.movementsInList, function (status) {
				cleanInStatusList.push(status.id);
			});
			angular.forEach($rootScope.movementsOutList, function (status) {
				cleanOutStatusList.push(status.id);
			});
			angular.forEach($rootScope.movementsInvList, function (status) {
				cleanInvStatusList.push(status.id);
			});
		};

		$scope.dropdownEvents = {
			onInitDone: function () {
				statusChange();
			},

			onSelectionChanged: function () {
				statusChange();
			},
		};

		$scope.dropdownSettings = {
			dynamicTitle: false,
			displayProp: "label",
			idProp: "value",
		};

		$scope.dropdownTranslations = {
			checkAll: "Seleccionar Todos",
			uncheckAll: "Deseleccionar Todos",
			buttonDefaultText: "Estados de Orden",
		};

		//============= Data tables =============

		$scope.drawTable = function () {
			var datatable = $("#table").dataTable().api();
			datatable.draw();
		};

		function createdRow(row, data, dataIndex) {
			$compile(angular.element(row).contents())($scope);
		}

		var serverData = function (sSource, aoData, fnCallback, oSettings) {
			var sear = aoData[5].value.value;
			var draw = aoData[0].value;
			var size = aoData[4].value;
			var page = aoData[3].value / size;
			var sort =
				aoData[1].value[aoData[2].value[0].column].name +
				" " +
				aoData[2].value[0].dir;

			search = sear;
			getDownloadLink();

			if (cleanStatusList.length == 0) {
				var result = {
					draw: draw,
					recordsTotal: 0,
					recordsFiltered: 0,
					data: [],
				};
				fnCallback(result);
				$scope.isEmpty = true;
			} else {
				paldiService.movements
					.getMovements(
						cleanStatusList,
						$scope.selectedType,
						sear,
						page * size,
						size,
						sort,
						$scope.startDate,
						$scope.endDate
					)
					.then(function (data) {
						var result = {
							draw: draw,
							recordsTotal: data.numFound,
							recordsFiltered: data.numFound,
							data: data.docs,
						};
						fnCallback(result);
						$scope.isEmpty = result.recordsTotal > 0 ? false : true;
					});
			}
		};

		$scope.tableOptions = DTOptionsBuilder.newOptions()
			.withLanguageSource("lang/table_lang.json")
			.withFnServerData(serverData)
			.withOption("processing", true)
			.withOption("serverSide", true)
			.withDisplayLength(20)
			.withDOM("ftp")
			.withOption("createdRow", createdRow)
			.withOption("order", [0, "desc"]);

		var inDateColumn = DTColumnBuilder.newColumn(null)
			.withOption("name", "inventoryInDate_dt")
			.withTitle("Fecha de Entrada a Inventario")
			.renderWith(function (data) {
				return (
					'<a href="#/console/order/' +
					data.id +
					'">' +
					$filter("date")(data.inventoryInDate_dt, "dd/MM/yyyy") +
					"</a>"
				);
			});
		var outDateColumn = DTColumnBuilder.newColumn(null)
			.withOption("name", "inventoryOutDate_dt")
			.withTitle("Fecha de Salida de Inventario")
			.renderWith(function (data) {
				return (
					'<a href="#/console/order/' +
					data.id +
					'">' +
					$filter("date")(data.inventoryOutDate_dt, "dd/MM/yyyy") +
					"</a>"
				);
			});
		$scope.tableColumns = [
			DTColumnBuilder.newColumn(null)
				.withOption("name", "date_dt")
				.withTitle("Fecha")
				.renderWith(function (data) {
					return (
						'<a href="#/console/order/' +
						data.id +
						'">' +
						$filter("date")(data.date_dt, "dd/MM/yyyy") +
						"</a>"
					);
				}),

			$scope.selectedType == "IN" ? inDateColumn : outDateColumn,

			DTColumnBuilder.newColumn(null)
				.withOption("name", "no_l")
				.withTitle("No. Orden")
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
				.withOption("name", "clientName_txt")
				.withTitle("Cliente")
				.renderWith(function (data) {
					return (
						'<a href="#/console/order/' +
						data.id +
						'">' +
						data.clientName_txt +
						"</a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "status_s")
				.withTitle("Estado")
				.renderWith(function (data) {
					return (
						'<a href="#/console/order/' +
						data.id +
						'" class="status-block ' +
						$rootScope.pretty("reverseOrderStatus", data.status_s) +
						'">' +
						data.status_s +
						"<a>"
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
				.withOption("name", "billFolios_txt")
				.withTitle("No. Factura")
				.renderWith(function (data) {
					return (
						'<a href="#/console/order/' +
						data.id +
						'">' +
						data.billFolios_txt +
						"<a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "cost_d")
				.withTitle("Subtotal")
				.renderWith(function (data) {
					return (
						'<a href="#/console/order/' +
						data.id +
						'">' +
						$filter("currency")(data.cost_d) +
						"<a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withTitle("")
				.renderWith(function (data) {
					var id = "&#39;" + data.id + "&#39;";
					var message = "Ver facturas";
					var buttonClass = "btn-secondary";
					if (data.id == $scope.selectedOrderId) {
						message = "Ocultar facturas";
						buttonClass = "btn-info";
					}
					return (
						'<a class="btn ' +
						buttonClass +
						'" ng-click="selectOrder(' +
						id +
						"," +
						data.no_l +
						')"> ' +
						message +
						" <a>"
					);
				}),
			DTColumnBuilder.newColumn(null).renderWith(function (data) {
				
				var id = "&#39;" + data.id + "&#39;";
				return (
					`<i ng-if="currentUser.canAdmin || currentUser.role =='MANAGER' "  class="btn fa fa-file-o" accept=".xml, application/xml" ng-click="uploadBillDialog(` +
					id +
					')"> Cargar factura</i>'
				);
			}),
		];

		//========================== DATEPICKER ====================

		/*$scope.startDate = moment().startOf('month').toDate();
    $scope.endDate = moment().endOf('day').toDate();*/

		$scope.startDateOptions = {
			formatYear: "yy",
			startingDay: 1,
			maxDate: new Date(),
		};

		$scope.endDateOptions = {
			formatYear: "yy",
			startingDay: 1,
			minDate: $scope.startDate,
			maxDate: new Date(),
		};

		$scope.openStartDate = function () {
			$scope.startDatePopup.opened = true;
		};

		$scope.openEndDate = function () {
			$scope.endDatePopup.opened = true;
		};

		$scope.format = "dd/MM/yyyy";
		$scope.altInputFormats = ["M!/d!/yyyy"];

		$scope.startDatePopup = {
			opened: false,
		};

		$scope.endDatePopup = {
			opened: false,
		};

		$scope.startDateChange = function () {
			$scope.endDateOptions.minDate = $scope.startDate;
			if ($scope.endDate && $scope.startDate > $scope.endDate) {
				$scope.endDate = angular.copy($scope.startDate);
			}
			$scope.drawTable();
		};

		$scope.endDateChange = function () {
			if ($scope.endDate) {
				$scope.endDate = moment($scope.endDate).endOf("day").toDate();
			}
			$scope.drawTable();
		};

		var loadBills = function (id) {
			paldiService.bills.getBillsByOrder(id).then(function (data) {
				$scope.bills = data;
				console.log(data)
				$scope.selectedOrderId = id;
				paldiService.bills.getBillLinks($scope.bills);
			});
		};

		$scope.selectOrder = function (id, orderNo) {
			if ($scope.selectedOrderId == id) {
				$scope.selectedOrderId = null;
				$scope.selectedOrderNo = null;
				$scope.bills = [];
			} else {
				$scope.selectedOrderNo = orderNo;
				loadBills(id);
			}
			$scope.drawTable();
		};

		var selectedOrderId = null;

		$scope.uploadBillDialog = function (id) {
			$scope.fd = null;
			selectedOrderId = id;
			$scope.dialog = ngDialog.open({
				scope: $scope,
				template: "partials/modals/upload-bill-file.html",
				showClose: false,
			});
		};

		$scope.selectFile = function (files) {
			$scope.fd = new FormData();
			$scope.fileValid = false;
			if (
				files[0].type == "text/xml" ||
				files[0].type == "application/xml"
			) {
				$scope.fd.append("file", files[0]);
				$scope.fileValid = true;
			}
			$scope.$apply();
		};

		$scope.uploadBill = function () {
			$scope.uploading = true;
			paldiService.bills.uploadBill(selectedOrderId, $scope.fd).then(
				function (data) {
					$scope.uploading = false;
					$scope.fd = null;
					if ($scope.selectedOrderId == selectedOrderId) {
						loadBills(selectedOrderId);
					}
					selectedOrderId = null;
					$timeout(function () {
						$scope.drawTable();
					}, 2000);
					$scope.dialog.close();
					swal({
						title: "Factura subida",
						text: "Se cargó la factura correctamente",
						type: "success",
						confirmButtonText: "Aceptar",
					});
				},
				function (error) {
					$scope.uploading = false;
					$scope.fd = null;
					selectedOrderId = null;
					$scope.dialog.close();
					swal({
						title: "Error",
						text: "Ocurrió un error",
						type: "error",
						confirmButtonText: "Aceptar",
					});
					// //console.log(error);
				}
			);
		};

		$scope.deleteBill = function (id) {
			swal(
				{
					title: "¿Seguro que deseas eliminar esta factura?",
					type: "warning",
					showCancelButton: true,
					confirmButtonColor: "#DD6B55",
					confirmButtonText: "Eliminar",
					cancelButtonText: "Cancelar",
					closeOnConfirm: false,
					closeOnCancel: false,
				},
				function (isConfirm) {
					if (isConfirm) {
						paldiService.bills.deleteBill(id).then(
							function (deleted) {
								swal({
									title: "Factura borrada exitosamente",
									type: "success",
									confirmButtonText: "Aceptar",
								});
								loadBills($scope.selectedOrderId);
								$timeout(function () {
									$scope.drawTable();
								}, 2000);
							},
							function (error) {
								// //console.log(error);
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

		$timeout(function () {
			if (
				!$scope.currentUser.canAdmin &&
				$scope.currentUser.role != "MANAGER" &&
				$scope.currentUser.role != "BUYER"
			) {
				$state.go("console.quote-list");
			}
			cleanLists();
			$scope.typeChange("IN");
		}, 200);
	}
);
