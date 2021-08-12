import { pdApp } from "./index";

pdApp.controller(
	"UserDetailsCtrl",
	function (
		$scope,
		$rootScope,
		$state,
		$timeout,
		$stateParams,
		paldiService
	) {
		$scope.loadUser = function () {
			$scope.step = "loading";
			var id = $stateParams.userId;

			$timeout(function () {
				if (!$scope.currentUser.canAdmin) {
					$state.go("console.quote-list");
				}
				$scope.sameUser = id == $scope.currentUser.id;
			}, 200);

			paldiService.users.get(id).then(
				function (user) {
					$scope.user = user;
					$scope.user.warehouseId = user.warehouse
						? user.warehouse.id
						: "";
					$scope.step = user ? "loaded" : "empty";
				},
				function (error) {
					$scope.step = "empty";
					//console.log(error);
				}
			);
		};

		$scope.loadUser();

		//================= ACTIONS =================
		$scope.edit = function (form, user) {
			if (form.$valid) {
				paldiService.users.update(user).then(
					function (user) {
						swal({
							title: "Usuario modificado exitosamente",
							type: "success",
							confirmButtonText: "Aceptar",
						});

						$state.go("console.user-list");
					},
					function (error) {
						//console.log(error);
					}
				);
			} else {
				form.$validated = true;
			}
		};

		$scope.delete = function () {
			swal(
				{
					title: "¿Seguro que deseas eliminar al usuario?",
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
						paldiService.users.delete($scope.user.id).then(
							function (user) {
								swal({
									title: "Usuario borrado exitosamente",
									type: "success",
									confirmButtonText: "Aceptar",
								});
								$state.go("console.user-list");
							},
							function (error) {
								$scope.step = "empty";
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
					title: "¿Seguro que deseas activar al usuario?",
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
						paldiService.users.activate($scope.user.id).then(
							function (user) {
								$scope.loadUser();
								swal({
									title: "Usuario activado exitosamente",
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
					title: "¿Seguro que deseas desactivar al usuario?",
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
						paldiService.users.deactivate($scope.user.id).then(
							function (user) {
								$scope.loadUser();
								swal({
									title: "Usuario desactivado exitosamente",
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

		var init = function () {
			paldiService.warehouses.getList().then(function (data) {
				$scope.warehouses = data;
				$scope.warehouses.splice(0, 0, { name: "", id: "" });
			});
		};

		init();
	}
);
