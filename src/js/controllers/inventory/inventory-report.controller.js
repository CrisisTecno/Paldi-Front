import { pdApp } from "../index";
pdApp.controller(
	"InventoryReportCtrl",
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
		var cleanWarehouseList = [];
		$scope.warehouseList = [];

		var getDownloadLink = function () {
			$scope.downloadLink =
				paldiService.inventory.getEntriesDownloadLink(
					cleanWarehouseList
				);
		};

		$scope.entryTypes = [
			{ value: "piso", label: "Pisos" },
			{ value: "plus", label: "Molduras/Adicionales" },
		];

		//============= Data tables =============

		$scope.drawTable = function () {
			var datatable = $("#report-table").dataTable().api();
			datatable.draw();
			getDownloadLink();
		};
		//+$scope.drawTable();

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
				if (cleanWarehouseList.length == 0) {
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
				.getEntriesByType(
					$scope.selectedType.toUpperCase(),
					page,
					size,
					sort,
					cleanWarehouseList
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
			.withDisplayLength(10)
			.withDOM("tp")
			.withOption("createdRow", createdRow);

		$scope.tableColumns = [
			DTColumnBuilder.newColumn(null)
				.withOption("orderable", false)
				.withTitle("Tipo")
				.renderWith(function (data) {
					return data.product.type;
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("orderable", false)
				.withTitle("Código")
				.renderWith(function (data) {
					return data.product.code;
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("orderable", false)
				.withTitle("Color")
				.renderWith(function (data) {
					return data.product.name;
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "date")
				.withTitle("Último movimiento")
				.renderWith(function (data) {
					return $filter("date")(data.lastUpdated, "dd/MM/yyyy");
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("orderable", false)
				.withTitle("Ubicación")
				.renderWith(function (data) {
					return data.warehouse.name;
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "quantity")
				.withTitle("Cantidad")
				.renderWith(function (data) {
					return data.quantity;
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "cost")
				.withTitle("Costo por unidad")
				.renderWith(function (data) {
					return $filter("currency")(data.cost);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "quantityAfter")
				.withTitle("Costo Total")
				.renderWith(function (data) {
					return $filter("currency")(data.quantity * data.cost);
				}),
		];

		//=============================== DROPDOWN =========================
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

		$scope.warehouseDropdownTranslations = {
			checkAll: "Seleccionar Todos",
			uncheckAll: "Deseleccionar Todos",
			buttonDefaultText: "Almacenes",
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

		init();
	}
);
