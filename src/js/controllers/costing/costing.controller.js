import { pdApp } from "../index";

pdApp.controller(
	"CostingCtrl",
	function (
		$rootScope,
		$scope,
		$compile,
		$filter,
		$location,
		$state,
		$timeout,
		paldiService,
		permissionsHelper,
		DTOptionsBuilder,
		DTColumnDefBuilder,
		DTColumnBuilder
	) {
		$timeout(function () {
			if (
				!$scope.currentUser.canAdmin &&
				$scope.currentUser.role != "MANAGER"
			) {
				$state.go("console.quote-list");
			}
		}, 200);

		var statusList = [
			"LINE",
			"BACKORDER",
			"PRODUCTION",
			"TRANSIT",
			"FINISHED",
			"PROGRAMMED",
			"INSTALLED",
			"INSTALLED_NONCONFORM",
			"INSTALLED_INCOMPLETE",
			"ORDER_CANCELED",
		];
		$scope.stats = { min: null, max: null, mean: null };
		//============= Data tables =============

		$scope.drawTable = function () {
			var datatable = $("#table").dataTable().api();
			datatable.draw();
		};

		function createdRow(row, data, dataIndex) {
			$compile(angular.element(row).contents())($scope);
		}

		var serverData = function (sSource, aoData, fnCallback, oSettings) {
			var sear = aoData[5].value.value;
			var draw = aoData[0].value;
			var size = aoData[4].value;
			var page = aoData[3].value / size;
			var sort = "";
			var newSort =
				aoData[1].value[aoData[2].value[0].column].name +
				" " +
				aoData[2].value[0].dir;

			if (sear && newSort == pastSort) {
				sort = "score desc";
			} else {
				sort = newSort;
			}
			var pastSort = newSort;
			console.log("aiuddaa2",sear,draw,size,page,sort)

			if ($scope.endDate) {
				$scope.endDate = moment($scope.endDate).endOf("day").toDate();
			}

			paldiService.orders
				.getCosting(
					sear,
					statusList,
					page * size,
					size,
					sort,
					$scope.startDate,
					$scope.endDate
				)
				.then(function (data) {
					var result = {
						draw: draw,
						recordsTotal: data.response.numFound,
						recordsFiltered: data.response.numFound,
						data: data.response.docs,
					};
					fnCallback(result);
				});

			paldiService.orders
				.getCostingStats(statusList, $scope.startDate, $scope.endDate)
				.then(function (data) {
					$scope.stats.min = isNaN(
						data.stats.stats_fields.grossMargin_d.min
					)
						? 0.0 + "%"
						: (
								data.stats.stats_fields.grossMargin_d.min * 100
						  ).toFixed(2) + "%";
					$scope.stats.max = isNaN(
						data.stats.stats_fields.grossMargin_d.max
					)
						? 0.0 + "%"
						: (
								data.stats.stats_fields.grossMargin_d.max * 100
						  ).toFixed(2) + "%";
					$scope.stats.mean = isNaN(
						data.stats.stats_fields.grossMargin_d.mean
					)
						? 0.0 + "%"
						: (
								data.stats.stats_fields.grossMargin_d.mean * 100
						  ).toFixed(2) + "%";
				});
		};

		$scope.tableOptions = DTOptionsBuilder.newOptions()
			.withLanguageSource("lang/table_lang.json")
			.withFnServerData(serverData)
			.withOption("processing", true)
			.withOption("serverSide", true)
			.withDisplayLength(20)
			.withDOM("ftp")
			.withOption("createdRow", createdRow)
			.withOption("order", [0, "desc"]);

		$scope.tableColumns = [
			DTColumnBuilder.newColumn(null)
				.withOption("name", "date_dt")
				.withTitle("Fecha")
				.renderWith(function (data) {
					console.log("z1",data)
					return (
						'<a href="#/console/order/' +
						data.id +
						'">' +
						$filter("date")(data.date_dt, "dd/MM/yyyy") +
						"</a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "no_l")
				.withTitle("No.")
				.withOption("width", "6%")
				.renderWith(function (data) {
					if (!data.isSuborder_b) {
						return (
							'<a href="#/console/order/' +
							data.id +
							'">' +
							data.no_l +
							"<a>"
						);
					} else {
						return (
							'<a href="#/console/order/' +
							data.id +
							'">' +
							data.suborderNo +
							"<a>"
						);
					}
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "project_txt")
				.withTitle("Cliente")
				.renderWith(function (data) {
					return (
						'<a href="#/console/order/' +
						data.id +
						'">' +
						data.clientName_txt +
						"</a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "clientType_txt")
				.withTitle("Tipo de Cliente")
				.renderWith(function (data) {
					return (
						'<a href="#/console/order/' +
						data.id +
						'">' +
						data.clientType_txt +
						"<a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "status_s")
				.withTitle("Estado")
				.renderWith(function (data) {
					return (
						'<a href="#/console/order/' +
						data.id +
						'" class="status-block ' +
						$rootScope.pretty("reverseOrderStatus", data.status_s) +
						'">' +
						data.status_s +
						"<a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "total_d")
				.withTitle("Subtotal")
				.renderWith(function (data) {
					return (
						'<a href="#/console/order/' +
						data.id +
						'">' +
						$filter("currency")(data.subTotal_d) +
						"<a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "cost_d")
				.withTitle("Costo")
				.renderWith(function (data) {
					return (
						'<a href="#/console/order/' +
						data.id +
						'">' +
						$filter("currency")(data.cost_d) +
						"<a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "grossMargin_d")
				.withTitle("% Margen Bruto")
				.renderWith(function (data) {
					let margin =
						data.cost_d > 0
							? (data.grossMargin_d * 100).toFixed(2) + "%"
							: "-";
					return (
						'<a href="#/console/order/' +
						data.id +
						'">' +
						margin +
						"<a>"
					);
				}),
		];

		//========================== DATEPICKER ====================

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
			}
			updateLink();
			$scope.drawTable();
		};

		$scope.endDateChange = function () {
			$scope.startDateOptions.maxDate = $scope.endDate;
			if ($scope.startDate > $scope.endDate) {
				$scope.startDate = angular.copy($scope.endDate);
			}
			updateLink();
			$scope.drawTable();
		};

		function updateLink() {
			$scope.downloadLink = paldiService.orders.getCostingDownloadLink(
				statusList,
				$scope.startDate,
				$scope.endDate,
				"Costeo"
			);
		}

		updateLink();
	}
);
