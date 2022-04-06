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
			let mod = angular.copy(model)
			if(EXECUTION_ENV=="EXTERNAL"){
				mod.role = $scope.user.realRole
			}
			paldiService.users.update(mod).then(
				
				function (user) {
					$scope.isEditing = false;
					swal({
						title: EXECUTION_ENV=="EXTERNAL"?"Changes performed":"Cambios realizados",
						text: EXECUTION_ENV=="EXTERNAL"?"Account Edited":"Cuenta editada",
						type: "success",
						confirmButtonText: EXECUTION_ENV=="EXTERNAL"?"Accept":"Aceptar",
					});
					load();
					$rootScope.$emit("user:mightBeAvailable");
				},
				function (error) {
					// console.log(error);
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
