import { pdApp } from "./index";

pdApp.controller(
	"InventoryMovementNewCtrl",
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
		/**
		 * initilize
		 */
		$scope.products = [];
		$scope.warehouses = [];
		paldiService.warehouses.getAll("", "", "").then(function (data) {
			$scope.warehouses = data.content;
		});

		/**
		 * Add colors depending on the type
		 */
		$scope.updateType = function (product, model) {
			if (model.type) {
				colorPriceService.getColors(product, model);
			}
		};

		/**
		 * show the modal form
		 */
		$scope.addProductForm = function () {
			$scope.dialog = ngDialog.open({
				scope: $scope,
				template:
					"partials/views/console/inventory/inventory-form.html",
				showClose: false,
				width: "70%",
			});
		};

		/**
		 * add the new product to products array
		 */
		$scope.addProduct = function (model, form) {
			if (form.$valid) {
				model.warehouse = JSON.parse($scope.warehouse);
				delete model.colors;
				model.color.value.type = model.type;
				model.color = model.color.value;
				$scope.products.push(model);
				$scope.dialog.close();
			}
		};

		/**
		 * remove an element from products array
		 */
		$scope.removeProduct = function (index) {
			$scope.products.splice(index, 1);
		};

		/**
		 * save products
		 */
		$scope.saveProducts = function () {
			for (var i = 0; i < $scope.products.length; i++) {
				$scope.products[i].type = "IN";
			}
			colorPriceService.addProducts($scope.products).then(
				function (_data) {
					$scope.dialog.close();
					swal(
						{
							title: "Productos agregados exitosamente",
							type: "success",
							confirmButtonText: "Aceptar",
						},
						function () {
							document.location.href =
								"/#/console/inventory-movement";
						}
					);
					$scope.products = [];
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
				$scope.currentUser.role != "MANAGER"
			) {
				$state.go("console.order-list");
			}
		}, 200);
	}
);
