import { pdApp } from "./index";

pdApp.controller(
	"ExchangeRateCtrl",
	function ($scope, $rootScope, paldiService, colorPriceService) {
		if ($scope.currentUser.role != "SUPERADMIN") {
			$state.go("console.personal-info");
		}

		$scope.changeRate = function (rate, form) {
			if (form.$valid) {
				colorPriceService
					.setExchangeRate({ rate: rate })
					.then(function (exchangeRate) {
						$rootScope.currentExchangeRate = exchangeRate;
						swal({
							title: "Tipo de cambio",
							text:
								"Se estableció el tipo de cambio en $" +
								exchangeRate,
							type: "success",
							confirmButtonText: "Aceptar",
						});
					});
			} else {
				form.$validated = true;
			}
		};
	}
);
