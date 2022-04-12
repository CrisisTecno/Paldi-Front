import { pdApp } from "./index";
pdApp.factory("sessionHelper", function ($rootScope, permissionsHelper) {
	var service = {
		getMovementsStatusLists: function () {
			var inStatusList = [
				"LINE",
				"BACKORDER",
				"PRODUCTION",
				"TRANSIT",
				"FINISHED",
				"PROGRAMMED",
				"INSTALLED",
				"INSTALLED_INCOMPLETE",
				"INSTALLED_NONCONFORM",
			];
			var outStatusList = [
				"INSTALLED",
				"INSTALLED_INCOMPLETE",
				"INSTALLED_NONCONFORM",
			];
			var invStatusList = ["PROGRAMMED", "FINISHED"];

			return {
				inStatusList: inStatusList,
				outStatusList: outStatusList,
				invStatusList: invStatusList,
			};
		},

		getBillsStatusList: function () {
			var billsStatusList = [
				"LINE",
				"BACKORDER",
				"PRODUCTION",
				"TRANSIT",
				"FINISHED",
				"PROGRAMMED",
				"INSTALLED",
				"INSTALLED_INCOMPLETE",
				"INSTALLED_NONCONFORM",
			];

			return billsStatusList;
		},

		initMovementStatusList: function () {
			var inStatusList = [
				"LINE",
				"BACKORDER",
				"PRODUCTION",
				"TRANSIT",
				"FINISHED",
				"PROGRAMMED",
				"INSTALLED",
				"INSTALLED_INCOMPLETE",
				"INSTALLED_NONCONFORM",
			];
			var outStatusList = [
				"INSTALLED",
				"INSTALLED_INCOMPLETE",
				"INSTALLED_NONCONFORM",
			];
			var invStatusList = ["PROGRAMMED", "FINISHED"];

			$rootScope.movementsInList = [];
			inStatusList.forEach(function (status) {
				$rootScope.movementsInList.push({ id: status });
			});

			$rootScope.movementsOutList = [];
			outStatusList.forEach(function (status) {
				$rootScope.movementsOutList.push({ id: status });
			});

			$rootScope.movementsInvList = [];
			invStatusList.forEach(function (status) {
				$rootScope.movementsInvList.push({ id: status });
			});
		},

		initBillStatusList: function () {
			var billsStatusList = [
				"LINE",
				"BACKORDER",
				"PRODUCTION",
				"TRANSIT",
				"FINISHED",
				"PROGRAMMED",
				"INSTALLED",
				"INSTALLED_INCOMPLETE",
				"INSTALLED_NONCONFORM",
			];

			$rootScope.billsList = [];
			billsStatusList.forEach(function (status) {
				$rootScope.billsList.push({ id: status });
			});
		},

		initOrderStatusList: function (role) {
			$rootScope.orderStatusList = [];
			
			permissionsHelper.getStatusList(role).forEach(function (status) {
				$rootScope.orderStatusList.push({ id: status });
			});
		},

		initQuoteStatusList: function () {
			$rootScope.quoteStatusList = [];
			permissionsHelper.getStatusList("QUOTE").forEach(function (status) {
				console.log("STATUS")
				$rootScope.quoteStatusList.push({ id: status });
			});
		},
	};

	return service;
});
