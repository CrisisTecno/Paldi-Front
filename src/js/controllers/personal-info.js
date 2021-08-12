import { pdApp } from "./index";

pdApp.controller(
	"PersonalInfoCtrl",
	function ($scope, $rootScope, paldiService, $filter) {
		$scope.isEditing = false;
		$scope.model = {};

		$scope.edit = function (model, form) {
			if ($scope.isEditing) {
				if (form.$valid) {
					editUser(model);
				} else {
					form.$validated = true;
				}
			} else {
				$scope.isEditing = true;
			}
		};

		$scope.cancel = function () {
			$scope.isEditing = false;
			load();
		};

		var editUser = function (model) {
			paldiService.users.update(model).then(
				function (user) {
					$scope.isEditing = false;
					swal({
						title: "Cambios realizados",
						text: "Cuenta editada",
						type: "success",
						confirmButtonText: "Aceptar",
					});
					load();
					$rootScope.$emit("user:mightBeAvailable");
				},
				function (error) {
					//console.log(error);
				}
			);
		};

		//============= Load Info =============
		var refreshModel = function (user) {
			$scope.model.id = user.id;
			$scope.model.name = user.name;
			$scope.model.lastName = user.lastName;
			$scope.model.email = user.email;
			$scope.model.phoneNumber = user.phoneNumber;
			$scope.model.role = user.role;
		};

		var load = function () {
			paldiService.users.whoAmI().then(function (user) {
				$scope.user = user;
				refreshModel(user);
			});
		};

		load();
	}
);
