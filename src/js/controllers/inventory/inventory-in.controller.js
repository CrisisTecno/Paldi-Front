import { pdApp } from "../index";

pdApp.controller(
	"InventoryInCtrl",
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

		$scope.entryTypes = [
			{ value: "piso", label: "Pisos" },
			{ value: "plus", label: "Molduras/Adicionales" },
		];

		function capitalize(string) {
			return (
				string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
			);
		}

		$scope.typeChange = function (entryType) {
			$scope.selectedType = entryType;
			$scope.selectedTypeCap = capitalize(entryType);
			$scope.movementObj = {};
		};

		$scope.typeChange("piso");

		$scope.movements = [];
		paldiService.warehouses.getAll("", "", "").then(function (data) {
			$scope.warehouses = data.content;
		});

		$scope.updateType = function (product, model) {
			if (model.type) {
				colorPriceService.getColors(product, model);
				
			}
		};

		$scope.updateWarehouse = function (warehouse) {
			$scope.selectedWarehouse = angular.fromJson(warehouse);
		};

		//=================== Movements ===================//

		$scope.addMovementForm = function () {
			$scope.dialog = ngDialog.open({
				scope: $scope,
				template: "js/controllers/inventory/inventory-in-add.html",
				showClose: false,
				width: "70%",
			});
		};

		$scope.addMovement = function (model, form) {
			form.$validated = true;
			if (form.$valid) {
				delete model.colors;
				model.product = model.color.value;
				if (!model.product.code)
					model.product.code = model.product.name;
				model.product.productType = $scope.selectedType.toUpperCase();
				$scope.movements.push(model);
				$scope.dialog.close();
			}
		};

		$scope.removeMovement = function (index) {
			$scope.movements.splice(index, 1);
		};

		//=================== Save ===================//

		$scope.saveInventory = function () {
			$scope.validated = true;

			if (!$scope.selectedWarehouse) {
				return 0;
			}

			for (var i = 0; i < $scope.movements.length; i++) {
				$scope.movements[i].type = "IN";
				$scope.movements[i].warehouse = $scope.selectedWarehouse;
			}

			paldiService.inventory.addMovements($scope.movements).then(
				function (data) {
					$scope.dialog.close();

					swal(
						{
							title: "Entradas registradas exitosamente",
							type: "success",
							confirmButtonText: "Aceptar",
						},
						function () {
							$state.reload();
						}
					);

					$scope.movements = [];
				},
				function (error) {
					swal({
						title: "Ocurrió un error",
						type: "error",
						confirmButtonText: "Aceptar",
					});
				}
			);
		};

		$timeout(function () {
			if (
				!$scope.currentUser.canAdmin &&
				$scope.currentUser.role != "MANAGER" &&
				$scope.currentUser.role != "BUYER"
			) {
				$state.go("console.order-list");
			}
		}, 200);
	}
);
