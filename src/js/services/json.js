import { pdApp } from "./index";
pdApp.factory("jsonService", function ($http, $q) {
	var service = {};

	service.products = {
		listEnrollables: function () {
			return $http.get("json/enrollables.json").then(function (response) {
				return response.data;
			});
		},

		listFiltrasoles: function () {
			return $http.get("json/filtrasoles.json").then(function (response) {
				return response.data;
			});
		},
	};

	return service;
});
