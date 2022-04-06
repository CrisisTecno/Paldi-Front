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
							title:  (EXECUTION_ENV=="EXTERNAL"?"Client Modified Successfully" :"Cliente modificado exitosamente"),
							type: "success",
							confirmButtonText: (EXECUTION_ENV=="EXTERNAL"?"Accept":"Aceptar"),
						});

						$state.go("console.client-list");
					},
					function (error) {
						// console.log(error);
						swal({
							title: "Error",
							text:
							(EXECUTION_ENV=="EXTERNAL"?"There is already a client with the E-mail: ":"Ya existe un cliente con el E-mail: ") +
								client.email,
							type: "error",
							confirmButtonText: (EXECUTION_ENV=="EXTERNAL"?"Accept":"Aceptar"),
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
