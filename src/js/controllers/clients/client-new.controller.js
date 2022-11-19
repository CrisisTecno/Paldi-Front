import { pdApp } from "../index";

pdApp.controller("ClientNewCtrl", function ($scope, $state, paldiService) {
	

	$scope.save = function (form, client) {
		if (!FEATURES.CITY) {
			$scope.client.city = "Tijuana"
		}
		
		if (form.$valid) {
			paldiService.clients.save(client).then(
				function (client) {
					swal({
						title: (EXECUTION_ENV=="EXTERNAL"?"Client Saved Succesfully" :"Cliente guardado exitosamente"),
						type: "success",
						confirmButtonText: (EXECUTION_ENV=="EXTERNAL"?"Accept" :"Aceptar"),
					});

					$state.go("console.client-list");
				},
				function (error) {
					// // console.log(error);
					swal({
						title: "Error",
						text:
						(EXECUTION_ENV=="EXTERNAL"?"There is already a client with the email" :"Ya existe un cliente con el E-mail: ") +
							client.email,
						type: "error",
						confirmButtonText: (EXECUTION_ENV=="EXTERNAL"?"Accept" :"Aceptar"),
					});
				}
			);
		} else {
			form.$validated = true;
		}
	};
});
