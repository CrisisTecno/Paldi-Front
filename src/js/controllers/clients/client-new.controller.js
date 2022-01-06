import { pdApp } from "../index";

pdApp.controller("ClientNewCtrl", function ($scope, $state, paldiService) {
	$scope.save = function (form, client) {
		if (form.$valid) {
			paldiService.clients.save(client).then(
				function (client) {
					swal({
						title: "Cliente guardado exitosamente",
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
});
