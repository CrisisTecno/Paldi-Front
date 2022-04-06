import { pdApp } from "./index";
pdApp.factory("jsonService", function ($http, $q) {
	var service = {};

	service.products = {
		listEnrollables: function () {
			return $http.get(EXECUTION_ENV!="EXTERNAL"?"json/enrollables.json":"json/enrollables_en.json").then(function (response) {
				return response.data;
			});
		},

		listFiltrasoles: function () {
			return $http.get(EXECUTION_ENV!="EXTERNAL"?"json/filtrasoles.json":"json/filtrasoles_en.json").then(function (response) {
				return response.data;
			});
		},
	};

	return service;
});
