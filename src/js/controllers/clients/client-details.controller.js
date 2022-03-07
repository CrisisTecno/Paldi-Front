import { pdApp } from "../index";
pdApp.controller(
	"ClientDetailsCtrl",
	function ($scope, $state, $stateParams, paldiService) {
		$scope.loadClient = function () {
			var id = $stateParams.clientId;

			paldiService.clients.get(id).then(
				function (client) {
					$scope.client = client;
					$scope.step = client ? "loaded" : "empty";
				},
				function (error) {
					$scope.step = "empty";
					// console.log(error);
				}
			);
		};
		//-----------------------------------------------------------------------------
		$scope.edit = function (form, client) {
			if (form.$valid) {
				paldiService.clients.update(client).then(
					function (client) {
						swal({
							title: "Cliente modificado exitosamente",
							type: "success",
							confirmButtonText: "Aceptar",
						});

						$state.go("console.client-list");
					},
					function (error) {
						// console.log(error);
						swal({
							title: "Error",
							text:
								"Ya existe un cliente con el E-mail: " +
								client.email,
							type: "error",
							confirmButtonText: "Aceptar",
						});
					}
				);
			} else {
				form.$validated = true;
			}
		};
		//-----------------------------------------------------------------------------
		$scope.step = "loading";
		$scope.loadClient();
	}
);
