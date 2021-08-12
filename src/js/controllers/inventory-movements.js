import { pdApp } from "./index";

pdApp.controller(
	"InventoryMovementsCtrl",
	function (
		$rootScope,
		$state,
		$scope,
		$compile,
		$timeout,
		paldiService,
		colorPriceService,
		$filter,
		ngDialog,
		DTOptionsBuilder,
		DTColumnDefBuilder,
		DTColumnBuilder
	) {
		//=================== Initialize ===================//
		$scope.ready = false;
		var cleanTypeList = [];
		var cleanWarehouseList = [];
		$scope.typeList = [];
		$scope.warehouseList = [];

		var getDownloadLink = function () {
			$scope.downloadLink =
				paldiService.inventory.getMovementsDownloadLink(
					$scope.startDate,
					$scope.endDate,
					cleanTypeList,
					cleanWarehouseList
				);
		};
		$scope.entryTypes = [
			{ value: "piso", label: "Pisos" },
			{ value: "plus", label: "Molduras/Adicionales" },
		];

		//============= Data tables =============

		$scope.drawTable = function () {
			var datatable = $("#movements-table").dataTable().api();
			datatable.draw();
			getDownloadLink();
		};

		$scope.typeChange = function (entryType) {
			$scope.selectedType = entryType;
			$scope.drawTable();
		};

		$scope.typeChange("piso");

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
				if (
					cleanTypeList.length == 0 ||
					cleanWarehouseList.length == 0
				) {
					var result = {
						draw: draw,
						recordsTotal: 0,
						recordsFiltered: 0,
						data: [],
					};
				} else {
					var result = {
						draw: draw,
						recordsTotal: data.numberOfElements,
						recordsFiltered: data.totalElements,
						data: data.content,
					};
				}
				$scope.isEmpty = result.recordsTotal > 0 ? false : true;
				fnCallback(result);
			};

			paldiService.inventory
				.getMovements(
					$scope.selectedType.toUpperCase(),
					page,
					size,
					sort,
					cleanTypeList,
					cleanWarehouseList,
					$scope.startDate,
					$scope.endDate
				)
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
			.withDOM("tp")
			.withOption("createdRow", createdRow)
			.withDisplayLength(15);

		$scope.tableColumns = [
			DTColumnBuilder.newColumn(null)
				.withOption("name", "date")
				.withTitle("Fecha")
				.renderWith(function (data) {
					return $filter("date")(data.date, "dd/MM/yyyy");
				}),
			DTColumnBuilder.newColumn(null)
				.withTitle("Tipo")
				.renderWith(function (data) {
					return data.product.type;
				}),
			DTColumnBuilder.newColumn(null)
				.withTitle("Código")
				.renderWith(function (data) {
					return data.product.code;
				}),
			DTColumnBuilder.newColumn(null)
				.withTitle("Color/Moldura")
				.renderWith(function (data) {
					return data.product.name;
				}),
			DTColumnBuilder.newColumn(null)
				.withTitle("Tipo de Transacción")
				.renderWith(function (data) {
					return $scope.pretty("movementType", data.type);
				}),
			DTColumnBuilder.newColumn(null)
				.withTitle("Ubicación")
				.renderWith(function (data) {
					return data.warehouse.name;
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "quantityBefore")
				.withTitle("Cantidad Antes")
				.renderWith(function (data) {
					return data.quantityBefore;
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "quantity")
				.withTitle("Cantidad")
				.renderWith(function (data) {
					return data.quantity;
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "quantityAfter")
				.withTitle("Cantidad Después")
				.renderWith(function (data) {
					return data.quantityAfter;
				}),
			DTColumnBuilder.newColumn(null)
				.withTitle("Descripción")
				.renderWith(function (data) {
					var description = data.description ? data.description : "";
					return description;
				}),
			DTColumnBuilder.newColumn(null)
				.withTitle("Referencia")
				.renderWith(function (data) {
					if (data.reference) {
						switch (data.type) {
							case "IN":
								return "No. Factura: " + data.reference;
							case "OUT":
								return (
									'<a href="#/console/order/' +
									data.reference +
									'">' +
									"Ver orden" +
									"</a>"
								);
							case "ADJUSTMENT":
								return "Ajuste No. " + data.reference;
						}
					} else return "";
				}),
		];

		//========================================== DATEPICKER ======================================
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

		//=============================== DROPDOWN ==========================
		$scope.typeDropdownEvents = {
			onInitDone: function () {
				typeChange();
			},

			onSelectionChanged: function () {
				typeChange();
			},
		};

		$scope.warehouseDropdownEvents = {
			onInitDone: function () {
				warehouseChange();
			},

			onSelectionChanged: function () {
				warehouseChange();
			},
		};

		$scope.dropdownSettings = {
			dynamicTitle: false,
			displayProp: "label",
			idProp: "value",
		};

		$scope.typeDropdownTranslations = {
			checkAll: "Seleccionar Todos",
			uncheckAll: "Deseleccionar Todos",
			buttonDefaultText: "Tipos de Movimientos",
		};

		$scope.warehouseDropdownTranslations = {
			checkAll: "Seleccionar Todos",
			uncheckAll: "Deseleccionar Todos",
			buttonDefaultText: "Almacenes",
		};

		var typeChange = function () {
			cleanTypeList = [];
			angular.forEach($scope.typeList, function (type) {
				cleanTypeList.push(type.id);
			});
			$scope.drawTable();
		};

		var warehouseChange = function () {
			cleanWarehouseList = [];
			angular.forEach($scope.warehouseList, function (warehouse) {
				cleanWarehouseList.push(warehouse.id);
			});
			$scope.drawTable();
		};

		//======================================================//
		var init = function () {
			$scope.availableTypesList = [
				{ label: $scope.pretty("movementType", "IN"), value: "IN" },
				{ label: $scope.pretty("movementType", "OUT"), value: "OUT" },
				{
					label: $scope.pretty("movementType", "CROSS_IN"),
					value: "CROSS_IN",
				},
				{
					label: $scope.pretty("movementType", "CROSS_OUT"),
					value: "CROSS_OUT",
				},
				{
					label: $scope.pretty("movementType", "ADJUSTMENT"),
					value: "ADJUSTMENT",
				},
			];

			$scope.typeList = [
				{ id: "IN" },
				{ id: "OUT" },
				{ id: "CROSS_IN" },
				{ id: "CROSS_OUT" },
				{ id: "ADJUSTMENT" },
			];

			$scope.availableWarehousesList = [];
			paldiService.warehouses.getList().then(function (data) {
				data.forEach(function (element) {
					$scope.availableWarehousesList.push({
						label: element.name,
						value: element.id,
					});
					$scope.warehouseList.push({ id: element.id });
				});

				$scope.ready = true;
			});
		};

		$timeout(function () {
			if (
				!$scope.currentUser.canAdmin &&
				$scope.currentUser.role != "MANAGER" &&
				$scope.currentUser.role != "BUYER"
			) {
				$state.go("console.order-list");
			}
			init();
		}, 200);
	}
);
