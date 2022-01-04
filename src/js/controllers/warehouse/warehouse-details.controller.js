import { pdApp } from "../index";

pdApp.controller(
	"WarehouseDetailsCtrl",
	function (
		$rootScope,
		$scope,
		$state,
		$stateParams,
		$timeout,
		$uibModal,
		DTOptionsBuilder,
		DTColumnDefBuilder,
		paldiService,
		permissionsHelper,
		ngDialog
	) {
		var loadWarehouse = function () {
			var id = $stateParams.warehouseId;
			$scope.step = "loading";
			paldiService.warehouses.get(id).then(
				function (warehouse) {
					$scope.warehouse = warehouse;
					$scope.step = warehouse ? "loaded" : "empty";
				},
				function (error) {
					$scope.step = "empty";
					//console.log(error);
				}
			);
		};
		loadWarehouse();

		$scope.delete = function () {
			swal(
				{
					title: "¿Seguro que deseas eliminar el almacén?",
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
						paldiService.warehouses
							.delete($scope.warehouse.id)
							.then(
								function (data) {
									swal({
										title: "Almacén borrado exitosamente",
										type: "success",
										confirmButtonText: "Aceptar",
									});
									$state.go("console.warehouses");
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
		};

		$scope.activate = function () {
			swal(
				{
					title: "¿Seguro que deseas activar el almacén?",
					type: "warning",
					showCancelButton: true,
					confirmButtonColor: "#DD6B55",
					confirmButtonText: "Activar",
					cancelButtonText: "Cancelar",
					closeOnConfirm: false,
					closeOnCancel: false,
				},
				function (isConfirm) {
					if (isConfirm) {
						paldiService.warehouses
							.activate($scope.warehouse.id)
							.then(
								function (data) {
									loadWarehouse();
									swal({
										title: "Almacén activado exitosamente",
										type: "success",
										confirmButtonText: "Aceptar",
									});
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
		};

		$scope.deactivate = function () {
			swal(
				{
					title: "¿Seguro que deseas desactivar el almacén?",
					type: "warning",
					showCancelButton: true,
					confirmButtonColor: "#DD6B55",
					confirmButtonText: "Desactivar",
					cancelButtonText: "Cancelar",
					closeOnConfirm: false,
					closeOnCancel: false,
				},
				function (isConfirm) {
					if (isConfirm) {
						paldiService.warehouses
							.deactivate($scope.warehouse.id)
							.then(
								function (data) {
									loadWarehouse();
									swal({
										title: "Almacén desactivado exitosamente",
										type: "success",
										confirmButtonText: "Aceptar",
									});
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
		};

		$scope.editWarehouseDialog = function () {
			$scope.warehouseObj = angular.copy($scope.warehouse);
			$scope.dialog = ngDialog.open({
				scope: $scope,
				template: "partials/views/console/warehouse.html",
				showClose: false,
			});
		};

		$scope.addWarehouse = function (model, form) {
			if (form.$valid) {
				paldiService.warehouses.update(model).then(
					function (data) {
						$scope.dialog.close();
						swal({
							title: "Almacén modificado exitosamente",
							type: "success",
							confirmButtonText: "Aceptar",
						});
						loadWarehouse();
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
