import { pdApp } from "./index";

pdApp.controller("StatisticsCtrl", function ($scope, paldiService, $filter) {
	$scope.colors = [
		"#FA4351",
		"#FCA400",
		"#FDCB00",
		"#8FC428",
		"#2E75FF",
		"#4B0082",
		"#2BBBD7",
	];
	//============================= STACKED BARS CHART ============================
	$scope.stackedSalesChartOptions = {
		legend: {
			display: true,
			position: "bottom",
		},

		scales: {
			xAxes: [
				{
					stacked: true,
				},
			],
			yAxes: [
				{
					stacked: true,
				},
			],
		},
		tooltips: {
			callbacks: {
				afterLabel: function (t, d) {
					var amount =
						$scope.salesData.amounts[t.datasetIndex][t.index];
					return "Valor: " + $filter("currency")(amount, "$", 2);
				},
			},
		},
	};

	$scope.stackedProductTypeChartOptions = {
		legend: {
			display: true,
			position: "bottom",
		},

		scales: {
			xAxes: [
				{
					stacked: true,
				},
			],
			yAxes: [
				{
					stacked: true,
				},
			],
		},
		tooltips: {
			callbacks: {
				afterLabel: function (t, d) {
					var amount =
						$scope.productType.amounts[t.datasetIndex][t.index];
					return "Valor: " + $filter("currency")(amount, "$", 2);
				},
			},
		},
	};
	//============================= DOUGHNUT CHART ============================

	$scope.doughnutOriginChartOptions = {
		legend: { display: true, position: "bottom" },
		tooltips: {
			callbacks: {
				afterLabel: function (tooltipItem, data) {
					var amount = $scope.origin.amounts[tooltipItem.index];
					return "Valor: " + $filter("currency")(amount, "$", 2);
				},
			},
		},
	};

	$scope.doughnutLostChartOptions = {
		legend: { display: true, position: "bottom" },
		tooltips: {
			callbacks: {
				afterLabel: function (tooltipItem, data) {
					var amount = $scope.lost.amounts[tooltipItem.index];
					return "Valor: " + $filter("currency")(amount, "$", 2);
				},
			},
		},
	};

	$scope.doughnutStatusChartOptions = {
		legend: { display: true, position: "bottom" },
		tooltips: {
			callbacks: {
				afterLabel: function (tooltipItem, data) {
					var amount = $scope.status.amounts[tooltipItem.index];
					return "Valor: " + $filter("currency")(amount, "$", 2);
				},
			},
		},
	};
	//========================== DATEPICKER =========================
	$scope.startDate = moment().startOf("month").toDate();
	$scope.endDate = moment().endOf("day").toDate();

	$scope.startDateOptions = {
		formatYear: "yy",
		startingDay: 1,
		maxDate: new Date(),
	};

	$scope.endDateOptions = {
		formatYear: "yy",
		startingDay: 1,
		minDate: $scope.startDate,
		maxDate: new Date(),
	};

	$scope.openStartDate = function () {
		$scope.startDatePopup.opened = true;
	};

	$scope.openEndDate = function () {
		$scope.endDatePopup.opened = true;
	};

	$scope.format = "dd/MM/yyyy";
	$scope.altInputFormats = ["M!/d!/yyyy"];

	$scope.startDatePopup = {
		opened: false,
	};

	$scope.endDatePopup = {
		opened: false,
	};

	$scope.startDateChange = function () {
		$scope.endDateOptions.minDate = $scope.startDate;
		if ($scope.startDate > $scope.endDate) {
			$scope.endDate = angular.copy($scope.startDate);
			$scope.endDate.setHours(23, 59, 59, 999);
		}
	};

	$scope.clear = function () {
		$scope.startDate = null;
		$scope.endDate = null;
		$scope.city = null;
		clearData();
	};

	var clearData = function () {
		$scope.origin = null;
		$scope.lost = null;
		$scope.status = null;
		$scope.salesData = null;
		$scope.sellersData = null;
		$scope.efficiencyData = null;
		$scope.productType = null;
	};

	var proccessDoughnutData = function (data) {
		var processedData = [];
		var processedKeys = [];
		var processedAmounts = [];
		Object.keys(data).forEach(function (key) {
			dataObj = { count: data[key].count, amount: data[key].amount };
			processedData.push(dataObj.count);
			processedAmounts.push(
				!isNaN(dataObj.amount) ? dataObj.amount.toFixed(2) : 0
			);
			processedKeys.push(key);
		});

		return {
			data: processedData,
			amounts: processedAmounts,
			labels: processedKeys,
		};
	};

	var processBarData = function (data, type) {
		var processedData = [];
		var processedKeys = [];
		var processedAmounts = [];
		var orderedKeys = orderKeys(Object.keys(data), type);

		var series = [
			"Facebook",
			"Prospección",
			"Tienda",
			"Recomendación",
			"Cliente",
		];
		for (var i = 0; i < series.length; i++) {
			processedData[i] = [];
			processedAmounts[i] = [];
		}

		var i = 0;
		orderedKeys.forEach(function (key) {
			processedKeys.push(key);
			var j = 0;
			series.forEach(function (source) {
				processedData[j][i] = data[key][source]
					? data[key][source].count
					: 0;
				processedAmounts[j][i] = data[key][source]
					? data[key][source].amount
					: 0;
				j++;
			});
			i++;
		});

		return {
			data: processedData,
			labels: processedKeys,
			series: series,
			amounts: processedAmounts,
		};
	};

	var processSellersTableData = function (data) {
		var sellersData = [];
		var i = 0;
		Object.keys(data).forEach(function (key) {
			sellersData[i] = {
				name: key,
				nuevas: processSellerData(data[key].Nuevas),
				seguimiento: processSellerData(data[key].Seguimiento),
				cerradas: processSellerData(data[key].Cerradas),
				perdidas: processSellerData(data[key].Perdidas),
				canceladas: processSellerData(data[key].Canceladas),
			};
			i++;
		});
		sellersData.totals = getSellerTotals(sellersData, "sales");
		return sellersData;
	};

	var processSellerData = function (data) {
		return {
			amount: data && data.amount ? data.amount : 0,
			count: data && data.count ? data.count : 0,
		};
	};

	var processEfficiencyTableData = function (data) {
		var efficiencyData = [];
		var i = 0;
		Object.keys(data).forEach(function (key) {
			efficiencyData[i] = {
				name: key,
				facebook: processEfficiencyData(data[key].Facebook),
				prospeccion: processEfficiencyData(data[key].Prospección),
				tienda: processEfficiencyData(data[key].Tienda),
				recomendacion: processEfficiencyData(data[key].Recomendación),
				cliente: processEfficiencyData(data[key].Cliente),
			};
			i++;
		});
		efficiencyData.totals = getSellerTotals(efficiencyData, "efficiency");
		return efficiencyData;
	};

	var processEfficiencyData = function (data) {
		return {
			total: data && data.total ? data.total : 0,
			closed: data && data.closed ? data.closed : 0,
			efficiency:
				data && data.efficiency ? data.efficiency.toFixed(2) : 0,
		};
	};

	var getSellerTotals = function (data, type) {
		var totals = [];
		if (data.length > 0) {
			Object.keys(data[0]).forEach(function (key) {
				if (key != "name") {
					totals[key] = { amount: 0, count: 0 };
				}
			});

			if (type == "sales") {
				data.forEach(function (elem) {
					Object.keys(elem).forEach(function (key) {
						if (key != "name") {
							totals[key].amount += elem[key].amount;
							totals[key].count += elem[key].count;
						}
					});
				});
			}

			if (type == "efficiency") {
				data.forEach(function (elem) {
					Object.keys(elem).forEach(function (key) {
						if (key != "name") {
							totals[key].amount += elem[key].closed;
							totals[key].count += elem[key].total;
						}
					});
				});
			}
		}
		return totals;
	};

	var orderKeys = function (keys, type) {
		var orderedKeys = keys;
		var weekRegEx = /[A-Za-z]*\s([0-9]*)\s([0-9]*)/; //grupo 0 = semana, grupo 1 = año
		var monthRegEx = /([0-9]*)\/([0-9]*)/; //grupo 0 = mes, grupo 1 = año
		var regex = type == "WEEKLY" ? weekRegEx : monthRegEx;
		if (type) {
			orderedKeys = keys.sort(function (a, b) {
				var aMatch = regex.exec(a);
				var bMatch = regex.exec(b);

				aMatch[0] = parseInt(aMatch[0]);
				aMatch[1] = parseInt(aMatch[1]);

				bMatch[0] = parseInt(bMatch[0]);
				bMatch[1] = parseInt(bMatch[1]);

				if (aMatch[1] < bMatch[1]) {
					return -1;
				} else if (aMatch[1] > bMatch[1]) {
					return 1;
				} else {
					if (aMatch[0] < bMatch[0]) {
						return -1;
					} else if (aMatch[0] > bMatch[0]) {
						return 1;
					} else {
						return 0;
					}
				}
			});
		}
		return orderedKeys;
	};

	var weeklySales = null;
	var monthlySales = null;

	$scope.filter = function (form) {
		if (form.$valid) {
			clearData();
			$scope.city = $scope.city ? $scope.city : "";
			paldiService.statistics
				.getByDateRangeAndCity(
					$scope.city,
					$scope.startDate,
					$scope.endDate
				)
				.then(function (data) {
					$scope.lost = proccessDoughnutData(data.lost);
					$scope.origin = proccessDoughnutData(data.origin);
					$scope.status = proccessDoughnutData(data.status);
					weeklySales = processBarData(data.salesWeekly, "WEEKLY");
					monthlySales = processBarData(data.salesMonthly, "MONTHLY");
					$scope.changeBarChartType("WEEKLY");
					$scope.sellersData = processSellersTableData(
						data.salesSeller
					);
					$scope.efficiencyData = processEfficiencyTableData(
						data.efficiency
					);
					$scope.productType = processBarData(data.productType);
					form.$validated = false;
				});
		}
		form.$validated = true;
	};

	$scope.changeBarChartType = function (type) {
		if (type == "WEEKLY") {
			$scope.salesData = weeklySales;
		}
		if (type == "MONTHLY") {
			$scope.salesData = monthlySales;
		}
	};
});
