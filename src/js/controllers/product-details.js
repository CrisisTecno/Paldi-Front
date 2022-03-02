import { pdApp } from "./index";

pdApp.controller(
	"ProductDetailsCtrl",
	function (
		$rootScope,
		$scope,
		$state,
		$stateParams,
		$timeout,
		$uibModal,
		DTOptionsBuilder,
		DTColumnDefBuilder,
		colorPriceService,
		paldiService,
		permissionsHelper,
		ngDialog
	) {
		var id = $stateParams.productId;

		var loadProduct = function () {
			$scope.step = "loading";
			colorPriceService.getPisoColor(id).then(
				function (color) {
					$scope.product = color;
					colorPriceService
						.getPisoColorPrice(color.type, color.code)
						.then(function (price) {
							$scope.product.price = price.price;
							$scope.product.priceType = price.priceType;
							$scope.product.installationPrice =
								price.installationPrice;
							$scope.product.m2Box = price.m2Box;
						});
					$scope.step = color ? "loaded" : "empty";
				},
				function (error) {
					$scope.step = "empty";
					// //console.log(error);
				}
			);
		};
		loadProduct();

		$scope.delete = function () {
			paldiService.inventory
				.hasExistencies(id)
				.then(function (hasExistences) {
					if (hasExistences.data) {
						swal({
							title: "No se puede eliminar el producto, sigue disponible en inventario",
							type: "error",
							confirmButtonText: "Aceptar",
						});
					} else {
						swal(
							{
								title: "¿Seguro que deseas eliminar el producto?",
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
									colorPriceService
										.deleteProduct(
											"pisos",
											$scope.product.id
										)
										.then(
											function (data) {
												swal({
													title: "Producto borrado exitosamente",
													type: "success",
													confirmButtonText:
														"Aceptar",
												});
												$state.go("console.products");
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
					}
				});
		};

		$scope.editProductDialog = function () {
			$scope.pisoObj = angular.copy($scope.product);
			$scope.dialog = ngDialog.open({
				scope: $scope,
				template: "js/controllers/order/products/piso.html",
				showClose: false,
			});
		};

		$scope.addProduct = function (model, form) {
			model.textil = model.line;
			if (form.$valid) {
				colorPriceService.editPiso($scope.product.id, model).then(
					function (data) {
						$scope.dialog.close();
						swal({
							title: "Producto modificado exitosamente",
							type: "success",
							confirmButtonText: "Aceptar",
						});
						loadProduct();
					},
					function (error) {
						swal({
							title: "Ocurrió un error",
							type: "error",
							confirmButtonText: "Aceptar",
						});
					}
				);
			}
		};
	}
);
