import { pdApp } from "./index";

pdApp.controller(
	"MoldingDetailsCtrl",
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
		permissionsHelper,
		ngDialog,
		paldiService
	) {
		var type = $stateParams.plus;
		var id = $stateParams.plusId;

		var loadProduct = function () {
			$scope.plusType = $scope.pretty("plusLabel", type);
			$scope.step = "loading";
			colorPriceService.getPlus(type, id).then(
				function (plus) {
					$scope.plus = plus;
					$scope.step = plus ? "loaded" : "empty";
				},
				function (error) {
					$scope.step = "empty";
				}
			);
		};
		loadProduct();

		$scope.delete = function () {
			paldiService.inventory.hasExistencies(id).then(function (response) {
				if (response.data) {
					swal({
						title: "No se puede eliminar el producto, sigue disponible en inventario",
						type: "error",
						confirmButtonText: "Aceptar",
					});
				} else {
					swal(
						{
							title: "¿Seguro que deseas eliminar moldura/adicional?",
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
									.deleteMolding(type, $scope.plus.id)
									.then(
										function (data) {
											swal({
												title: "Moldura/Adicional borrado exitosamente",
												type: "success",
												confirmButtonText: "Aceptar",
											});
											$state.go("console.products");
										},
										function (error) {
											//console.log(error);
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

		$scope.editPlusDialog = function () {
			$scope.moldingObj = angular.copy($scope.plus);
			$scope.dialog = ngDialog.open({
				scope: $scope,
				template: "partials/views/console/products/moldura.html",
				showClose: false,
			});
		};

		$scope.addProduct = function (model, form) {
			if (form.$valid) {
				colorPriceService.editPlus(type, $scope.plus.id, model).then(
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
						if (error.status === 409) {
							swal({
								title: "Ya existe una moldura/adicional con ese nombre",
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
