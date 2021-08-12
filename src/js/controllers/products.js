import { pdApp } from "./index";

pdApp.controller(
	"ProductsCtrl",
	function (
		$rootScope,
		$state,
		$scope,
		$compile,
		$timeout,
		colorPriceService,
		$filter,
		ngDialog,
		DTOptionsBuilder,
		DTColumnDefBuilder,
		DTColumnBuilder
	) {
		$timeout(function () {
			if (
				!$scope.currentUser.canAdmin &&
				$scope.currentUser.role != "MANAGER"
			) {
				$state.go("console.quote-list");
			}
		}, 200);

		$scope.ready = false;

		$scope.dtInstanceCallback = function (instance) {
			$scope.dtInstance = instance;
		};

		$scope.productTypes = [
			{ value: "pisos", label: "Pisos", service: "colors" },
			{
				value: "moldings",
				label: "Molduras/Adicionales",
				service: "plus",
			},
		];

		var drawTable = function (type) {
			var datatable = $("#products-table").dataTable().api();
			datatable.draw();

			if ($scope.dtInstance != null) {
				$scope.dtInstance.DataTable.column(2).visible(
					type !== "moldings"
				); //Code column
				$scope.dtInstance.DataTable.column(3).visible(
					type !== "moldings"
				); //Line column
				$scope.dtInstance.DataTable.column(4).visible(
					type === "moldings"
				); //PriceType column
				$scope.dtInstance.DataTable.column(5).visible(
					type === "moldings"
				); //Price column
				$scope.dtInstance.DataTable.column(6).visible(
					type === "moldings"
				); //Currency column
			}
		};

		var addButtonLabel = function (type) {
			switch (type) {
				case "pisos":
					return "piso";
				case "enrollables":
					return "persiana";
				case "filtrasoles":
					return "filtrasol";
				case "balances":
					return "balance";
				case "shutters":
					return "shutter";
				case "toldos":
					return "producto para el exterior";
				case "moldings":
					return "moldura/adicional";
			}
			return "producto";
		};

		$scope.typeChange = function (type) {
			$scope.ready = false;
			$scope.selectedType = type;
			var typeObj = $scope.productTypes.filter(function (object) {
				return object.value === $scope.selectedType;
			});
			$scope.productService = typeObj[0].service;
			$scope.addButtonLabel = addButtonLabel(type);
			$scope.ready = true;
			drawTable(type);
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
			};
			colorPriceService
				.getAllProducts(
					$scope.productService,
					$scope.selectedType,
					page,
					size,
					sort
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
			.withDOM("tp")
			.withOption("createdRow", createdRow)
			.withDisplayLength(20);

		$scope.tableColumns = [
			DTColumnBuilder.newColumn(null)
				.withOption("name", "type")
				.withTitle("Tipo")
				.renderWith(function (data) {
					return (
						'<a href="#/console/' +
						$scope.selectedType +
						"/details/" +
						data.id +
						'">' +
						data.type +
						"<a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "name")
				.withTitle("Nombre")
				.renderWith(function (data) {
					return (
						'<a href="#/console/' +
						$scope.selectedType +
						"/details/" +
						data.id +
						'">' +
						data.name +
						"<a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "code")
				.withTitle("Código")
				.withOption("visible", true)
				.renderWith(function (data) {
					return (
						'<a href="#/console/' +
						$scope.selectedType +
						"/details/" +
						data.id +
						'">' +
						data.code +
						"<a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "line")
				.withTitle("Línea")
				.withOption("visible", true)
				.renderWith(function (data) {
					return (
						'<a href="#/console/' +
						$scope.selectedType +
						"/details/" +
						data.id +
						'">' +
						data.line +
						"<a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "priceType")
				.withTitle("Unidad de Medida")
				.withOption("visible", false)
				.renderWith(function (data) {
					var priceType = $scope.pretty(
						"plusPriceType",
						data.priceType
					);
					return (
						'<a href="#/console/' +
						$scope.selectedType +
						"/details/" +
						data.id +
						'">' +
						priceType +
						"<a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "price")
				.withTitle("Precio")
				.withOption("visible", false)
				.renderWith(function (data) {
					var price = $filter("currency")(data.price);
					return (
						'<a href="#/console/' +
						$scope.selectedType +
						"/details/" +
						data.id +
						'">' +
						price +
						"<a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "currency")
				.withTitle("Tipo de moneda")
				.withOption("visible", false)
				.renderWith(function (data) {
					var currency = data.currency ? data.currency : "MXN";
					return (
						'<a href="#/console/' +
						$scope.selectedType +
						"/details/" +
						data.id +
						'">' +
						currency +
						"<a>"
					);
				}),
		];

		//=============================================
		$scope.addProduct = function () {
			$state.go("console.product-new", {
				productType: $scope.selectedType,
			});
		};

		$scope.typeChange("pisos");
	}
);
