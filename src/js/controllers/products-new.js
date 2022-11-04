import { pdApp } from "./index";

pdApp.controller(
	"ProductNewCtrl",
	function (
		$rootScope,
		$state,
		$stateParams,
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
		$scope.productType = $stateParams.productType;
		$scope.products = [];
		$scope.productLabel = $scope.pretty("pluralForm", $scope.productType);

		$scope.productTypes = [
			{ value: "pisos", label: "Pisos", service: "colors" },
			{
				value: "moldings",
				label: "Molduras/Adicionales",
				service: "plus",
			},
		];

		var typeObj = $scope.productTypes.filter(function (object) {
			return object.value === $scope.productType;
		});
		$scope.productService = typeObj[0].service;

		//=============================================
		$scope.addProductDialog = function () {
			$scope.dialog = ngDialog.open({
				scope: $scope,
				template:
					"js/controllers/order/products/" +
					$scope.pretty("singularForm", $scope.productType) +
					".html",
				showClose: false,
				width: "70%",
			});
		};

		$scope.addProduct = function (model, form) {
			if (form.$valid) {
				model.type = $scope.type;
				model.disponible = model.disponible ? true:false
				$scope.products.push(model);
				$scope.dialog.close();
			}
		};

		$scope.removeProduct = function (index) {
			$scope.products.splice(index, 1);
		};

		$scope.saveProducts = function () {
			if ($scope.products.length > 0) {
				colorPriceService
					.addProduct(
						$scope.productService,
						$scope.productType,
						$scope.products
					)
					.then(
						function (data) {
							$scope.dialog.close();
							swal({
								title:
									"Se agregaron " +
									$scope.productLabel +
									" exitosamente",
								type: "success",
								confirmButtonText: "Aceptar",
							});
							$scope.products = [];
						},
						function (error) {
							if (error.status === 409) {
								swal({
									title: "Ya existe un producto con ese nombre",
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
			}
		};
	}
);
