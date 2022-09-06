import { pdApp } from "../index";

pdApp.controller(
	"ChangePasswordCtrl",
	function ($scope, $state, $rootScope, paldiService) {
		$scope.changePassword = function (model, form) {
			if (form.$valid) {
				if (model.repeatPassword == model.newPassword) {
					form.repeatPassword.$error.match = false;
				} else {
					form.repeatPassword.$error.match = true;
				}

				if (
					$scope.newPasswordIsValid == true &&
					form.repeatPassword.$error.match == false
				) {
					paldiService.password
						.changePassword(model, $rootScope.currentUser.id)
						.then(
							function () {
								model.oldPassword = "";
								model.newPassword = "";
								model.repeatPassword = "";
								form.$validated = false;

								swal({
									title: EXECUTION_ENV=="EXTERNAL"?"Updated Pasword":"Contraseña actualizada",
									type: "success",
									confirmButtonText: EXECUTION_ENV=="EXTERNAL"?"Accept":"Aceptar",
								});
								$rootScope.$emit("user:mightBeAvailable");
								let next =$scope.currentUser.role=="PROVIDER"?"console.provider-list":"console.order-list"
								$state.go(next);
							},
							function (error) {
								form.$validated = true;
								if (
									error.data.exception ==
									"io.lkmx.paldi.quote.components.error.WrongPasswordException"
								) {
									form.oldPassword.$error.wrongPassword = true;
								}

								if (
									error.data.exception ==
									"io.lkmx.paldi.quote.components.error.SamePasswordException"
								) {
									form.newPassword.$error.samePassword = true;
								}

								if (
									error.data.exception ==
									"io.lkmx.paldi.quote.components.error.RecentPasswordException"
								) {
									form.newPassword.$error.recentPassword = true;
								}
							}
						);
				} else {
					form.$validated = true;
				}
			}
		};

		$scope.checkPassword = function checkPassword(str) {
			// al menos un número, una mayúscula y una minúscula, 8 caracteres mínimo
			// solo letras y números
			var re =
				/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!()-._`~@])[0-9a-zA-Z!()-._`~@]{8,}$/;
			$scope.newPasswordIsValid = re.test(str);
		};
	}
);
