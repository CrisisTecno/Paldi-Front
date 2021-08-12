import { pdApp } from "./index";

pdApp.controller(
	"UserNewCtrl",
	function ($scope, $rootScope, $state, $timeout, paldiService) {
		$timeout(function () {
			if (!$scope.currentUser.canAdmin) {
				$state.go("console.quote-list");
			}
		}, 200);

		$scope.save = function (form, user) {
			if (form.$valid && $scope.passwordIsValid) {
				paldiService.users.save(user).then(
					function (user) {
						swal({
							title: "Usuario guardado exitosamente",
							type: "success",
							confirmButtonText: "Aceptar",
						});

						$state.go("console.user-list");
					},
					function (error) {
						if (error.status == 409) {
							swal({
								title: "Error",
								text:
									"Ya existe un usuario con el E-mail: " +
									user.email,
								type: "error",
								confirmButtonText: "Aceptar",
							});
						} else {
							swal({
								title: "Error",
								text: "Ocurrió un error: " + error.status,
								type: "error",
								confirmButtonText: "Aceptar",
							});
						}
						form.$validated = true;
					}
				);
			} else {
				form.$validated = true;
			}
		};

		$scope.checkPassword = function checkPassword(str) {
			// al menos un número, una mayúscula y una minúscula, 8 caracteres mínimo
			// solo letras y números
			var re =
				/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!()-._`~@])[0-9a-zA-Z!()-._`~@]{8,}$/;
			$scope.passwordIsValid = re.test(str);
		};

		var init = function () {
			paldiService.warehouses.getList().then(function (data) {
				$scope.warehouses = data;
				$scope.warehouses.splice(0, 0, { name: "", id: "" });
				$scope.user = { warehouseId: "" };
			});
		};

		init();
	}
);
