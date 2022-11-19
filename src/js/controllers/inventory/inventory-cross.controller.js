import { pdApp } from "../index";

pdApp.controller(
	"InventoryCrossCtrl",
	function (
		$rootScope,
		$scope,
		$compile,
		$filter,
		$location,
		$state,
		$timeout,
		paldiService,
		colorPriceService,
		ngDialog,
		DTOptionsBuilder,
		DTColumnDefBuilder,
		DTColumnBuilder
	) {
		//=================== Initialize ===================//

		function capitalize(string) {
			return (
				string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
			);
		}

		$scope.entryTypes = [
			{ value: "piso", label: "Pisos" },
			{ value: "plus", label: "Molduras/Adicionales" },
		];

		$scope.typeChange = function (entryType) {
			$scope.selectedType = entryType;
			$scope.selectedTypeCap = capitalize(entryType);
			$scope.movementObj = {};
		};

		$scope.typeChange("piso");

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

		$scope.updateSecondaryWarehouse = function (warehouse) {
			$scope.selectedSecondaryWarehouse = angular.fromJson(warehouse);
		};

		//=================== Movements ===================//

		$scope.addMovement = function (model, form) {
			$scope.validated = true;
			form.$validated = true;
			if (form.$valid) {
				delete model.colors;
				model.product = model.color.value;
				if (!model.product.code)
					model.product.code = model.product.name;
				model.product.productType = $scope.selectedType.toUpperCase();
				$scope.saveInventory(model);
			}
		};

		//=================== Save ===================//

		$scope.saveInventory = function (movement) {
			if (
				!$scope.selectedWarehouse ||
				!$scope.selectedSecondaryWarehouse
			) {
				return 0;
			}

			var movements = [];
			var movementOut = angular.copy(movement);
			var movementIn = angular.copy(movement);

			paldiService.inventory
				.loadInventory($scope.selectedWarehouse, movement.product)
				.then(function (success) {
					movementOut.cost = success.data.cost;
					movementOut.type = "CROSS_OUT";
					movementOut.warehouse = $scope.selectedWarehouse;
					movementOut.secondaryWarehouse =
						$scope.selectedSecondaryWarehouse;
					movements.push(movementOut);

					movementIn.cost = success.data.cost;
					movementIn.type = "CROSS_IN";
					movementIn.warehouse = $scope.selectedSecondaryWarehouse;
					movementIn.secondaryWarehouse = $scope.selectedWarehouse;
					movements.push(movementIn);

					paldiService.inventory.addMovements(movements).then(
						function (data) {
							swal(
								{
									title: "Traslado registrado exitosamente",
									type: "success",
									confirmButtonText: "Aceptar",
								},
								function () {
									$state.reload();
								}
							);

							movements = [];
						},
						function (error) {
							// // console.log(error);

							if (
								error.data.exception ==
								"io.lkmx.paldi.quote.components.error.InventoryNotEnoughException"
							) {
								swal({
									title: "No hay inventario suficiente",
									type: "error",
									confirmButtonText: "Aceptar",
								});
							} else {
								swal({
									title: "Ocurrió un error",
									type: "error",
									confirmButtonText: "Aceptar",
								});
							}
						}
					);
				});
		};

		$timeout(function () {
			if (
				!$scope.currentUser.canAdmin &&
				$scope.currentUser.role != "MANAGER"
			) {
				$state.go("console.order-list");
			}
		}, 200);
	}
);
