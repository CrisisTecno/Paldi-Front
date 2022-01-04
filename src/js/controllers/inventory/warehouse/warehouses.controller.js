import { pdApp } from "../../index";

pdApp.controller(
	"WarehousesCtrl",
	function (
		$rootScope,
		$state,
		$scope,
		$compile,
		$timeout,
		paldiService,
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

		var drawTable = function () {
			var datatable = $("#warehouses-table").dataTable().api();
			datatable.draw();
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
			paldiService.warehouses
				.getAll(page, size, sort)
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
				.withOption("name", "name")
				.withTitle("Nombre")
				.renderWith(function (data) {
					return (
						'<a href="#/console/warehouse/' +
						data.id +
						'">' +
						data.name +
						"<a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "city")
				.withTitle("Ciudad")
				.renderWith(function (data) {
					return (
						'<a href="#/console/warehouse/' +
						data.id +
						'">' +
						data.city +
						"<a>"
					);
				}),
		];

		//=============================================
		$scope.addWarehouseDialog = function () {
			$scope.dialog = ngDialog.open({
				scope: $scope,
				template: "partials/views/console/warehouse.html",
				showClose: false,
			});
		};

		$scope.addWarehouse = function (model, form) {
			if (form.$valid) {
				paldiService.warehouses.save(model).then(
					function (data) {
						$scope.dialog.close();
						swal({
							title: "Almacén agregado exitosamente",
							type: "success",
							confirmButtonText: "Aceptar",
						});
						drawTable();
					},
					function (error) {
						var errorMsg = "Ocurrió un error";
						if (
							error.data.exception ==
							"io.lkmx.paldi.quote.components.error.DuplicatedWarehouseException"
						) {
							errorMsg =
								"Ya existe un almacén con el nombre: " +
								model.name;
						}
						swal({
							title: errorMsg,
							type: "error",
							confirmButtonText: "Aceptar",
						});
					}
				);
			}
		};
	}
);
