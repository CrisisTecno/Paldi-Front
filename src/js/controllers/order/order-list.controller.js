import { pdApp } from "../index";
import moment from "moment";

pdApp.controller(
	"OrderListCtrl",
	function (
		$rootScope,
		$scope,
		$timeout,
		$location,
		$compile,
		$filter,
		paldiService,
		permissionsHelper,
		DTOptionsBuilder,
		DTColumnDefBuilder,
		DTColumnBuilder
	) {
		$timeout(function(){},2000)

		$scope.external = EXECUTION_ENV=="EXTERNAL"
		$scope.statusList = [];
		$scope.availableStatusList = [];
		var cleanStatusList = [];
		$scope.toggle = false;
		$scope.isEmpty = true;
		$scope.isSuborder = false;
		$scope.selectedType = "all";
		console.log($scope.currentUser,EXECUTION_ENV)
		$scope.orderTypes =EXECUTION_ENV!="EXTERNAL" ? [
			{value: "consultant", label: "Mis cotizaciones"},
			{value: "all", label: "Cotizaciones generales"},
		  ] : [{value: "consultant", label: "My Quotes"},
			];

		//============= Data tables =============

		function createdRow(row, data, dataIndex) {
			$compile(angular.element(row).contents())($scope);
		}

		var pastSort = "";

		$scope.currentUser && $scope.currentUser.role === "CONSULTANT"
			? ($scope.isConsultant = true)
			: ($scope.isConsultant = false);

		var serverData = function (sSource, aoData, fnCallback, oSettings) {
      // console.log(sSource, aoData, fnCallback, oSettings)
			var sear = aoData[5].value.value;
			var draw = aoData[0].value;
			var sort = sear
				? "score desc"
				: aoData[1].value[aoData[2].value[0].column].name +
				  " " +
				  aoData[2].value[0].dir;
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
			pastSort = newSort;

			if (cleanStatusList.length == 0) {
				var result = {
					draw: draw,
					recordsTotal: 0,
					recordsFiltered: 0,
					data: [],
				};
				$scope.isEmpty = true;
				fnCallback(result);
			} else {
				if ($scope.selectedType !== "consultant") {
					paldiService.orders
						.searchByStatusList(
							cleanStatusList,
							sear,
							page * size,
							size,
							sort,
							$scope.startDate,
							$scope.endDate
						)
						.then(function (data) {
							var result = {
								draw: draw,
								recordsTotal: data.numFound,
								recordsFiltered: data.numFound,
								data: data.docs,
							};
							$scope.isEmpty =
								result.recordsTotal > 0 ? false : true;
							fnCallback(result);
						});
				} else {
					paldiService.orders
						.searchByUser(
							cleanStatusList,
							sear,
							page * size,
							size,
							sort,
							$scope.startDate,
							$scope.endDate,
							$scope.currentUser.id
						)
						.then(function (data) {
							var result = {
								draw: draw,
								recordsTotal: data.numFound,
								recordsFiltered: data.numFound,
								data: data.docs,
							};
							$scope.isEmpty =
								result.recordsTotal > 0 ? false : true;
							fnCallback(result);
						});
				}
			}
		};

		var getListDownloadLink = function () {
			$scope.downloadLink = paldiService.orders.getListDownloadLink(
				"orders",
				$scope.startDate,
				$scope.endDate,
				cleanStatusList
			);
		};

		$scope.drawTable = function () {
			var datatable = $("#table").dataTable().api();
			datatable.draw();
			getListDownloadLink();
		};

		$scope.orderTypeChange = function (type) {
			$scope.ready = false;
			$scope.selectedType = type;
			$scope.ready = true;
			$scope.drawTable();
		};

		var typeChange = function () {
			cleanStatusList = [];
			angular.forEach($scope.statusList, function (status) {
				cleanStatusList.push(status.id);
			});
			$rootScope.orderStatusList = $scope.statusList;

			$scope.drawTable();
		};

		$scope.dropdownEvents = {
			onInitDone: function () {
				typeChange();
			},

			onSelectionChanged: function () {
				typeChange();
			},
		};

		$scope.dropdownSettings = {
			dynamicTitle: false,
			displayProp: "label",
			idProp: "value",
		};

		$scope.dropdownTranslations = {
			checkAll: EXECUTION_ENV!="EXTERNAL" ? "Seleccionar Todos":"Select all",
			uncheckAll: EXECUTION_ENV!="EXTERNAL" ? "Deseleccionar Todos":"Unselect All",
			buttonDefaultText: EXECUTION_ENV!="EXTERNAL" ?  "Estados de Orden":"Order Status",
		  }

		$scope.toggleDetails = function (orderId) {
			if (orderId) {
				paldiService.orders.get(orderId).then(function (order) {
					$scope.selectedOrder = order;

					$scope.productsQuantity = getQuantityProducts(order);

					if ($scope.selectedOrder.orderParent) {
						$scope.isSuborder = true;
					} else {
						$scope.isSuborder = false;
					}

					$scope.toggle = true;
					$scope.permissions = permissionsHelper.get(
						order,
						$rootScope.currentUser
					);
				});
			} else {
				$scope.toggle = false;
				$scope.selectedOrder = "";
			}
		};

		$scope.tableOptions = DTOptionsBuilder.newOptions()
			.withLanguageSource( EXECUTION_ENV!="EXTERNAL" ? "lang/table_lang.json" :"lang/table_lang_en.json")
			.withFnServerData(serverData)
			.withOption("processing", true)
			.withOption("serverSide", true)
			.withDisplayLength(20)
			.withDOM("ftp")
			.withOption("createdRow", createdRow)
			.withOption("order", [0, "desc"]);

		var adminColumns = [
			DTColumnBuilder.newColumn(null)
				.withOption("name", "date_dt")
				.withTitle(EXECUTION_ENV!="EXTERNAL" ? "Fecha":"Date")
				.renderWith(function (data) {
					var id = "&#39;" + data.id + "&#39;";
					return (
						'<a ng-click="toggleDetails(' +
						id +
						')">' +
						$filter("date")(data.date_dt, "dd/MM/yyyy") +
						"</a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "no_l")
				.withTitle(EXECUTION_ENV!="EXTERNAL" ? "Orden":"Order")
				.renderWith(function (data) {
					var id = "&#39;" + data.id + "&#39;";
					if (!data.isSuborder_b) {
						return (
							'<a ng-click="toggleDetails(' +
							id +
							')">' +
							data.no_l +
							"</a>"
						);
					} else {
						return (
							'<a ng-click="toggleDetails(' +
							id +
							')">' +
							data.suborderNo +
							"</a>"
						);
					}
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "clientName_txt")
				.withTitle(EXECUTION_ENV!="EXTERNAL" ? "Cliente":"Client")
				.renderWith(function (data) {
					var id = "&#39;" + data.id + "&#39;";
					return (
						'<a ng-click="toggleDetails(' +
						id +
						')">' +
						data.clientName_txt +
						"</a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "assesor_txt")
				.withTitle(EXECUTION_ENV!="EXTERNAL" ?"Vendedor":"Sales Rep")
				.renderWith(function (data) {
					var id = "&#39;" + data.id + "&#39;";
					return (
						'<a ng-click="toggleDetails(' +
						id +
						')">' +
						data.assesor_txt +
						"</a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "total_d")
				.withTitle("Total")
				.renderWith(function (data) {
					var id = "&#39;" + data.id + "&#39;";
					return (
						'<a ng-click="toggleDetails(' +
						id +
						')">' +
						$filter("currency")(data.total_d) +
						"</a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "balance_d")
				.withTitle(EXECUTION_ENV!="EXTERNAL" ?"Saldo":"Balance")
				.renderWith(function (data) {
					var id = "&#39;" + data.id + "&#39;";

					if (!data.isSuborder_b) {
						var balance =
							data.balance_d == null
								? data.total_d
								: data.balance_d;
						return (
							'<a ng-click="toggleDetails(' +
							id +
							')">' +
							$filter("currency")(balance) +
							"</a>"
						);
					} else {
						return (
							'<a ng-click="toggleDetails(' +
							id +
							')">' +
							"-" +
							"</a>"
						);
					}
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "status_s")
				.withTitle(EXECUTION_ENV!="EXTERNAL" ?"Estado":"Order Status")
				.renderWith(function (data, type) {
					var id = "&#39;" + data.id + "&#39;";
					var status = $scope.pretty(
						"reverseOrderStatus",
						data.status_s
					);
					var text =
						'<a ng-click="toggleDetails(' +
						id +
						')" class="status-block ' +
						status +
						'">' +
						(EXECUTION_ENV!="EXTERNAL"?$scope.pretty("orderStatus", status):$scope.pretty("orderStatusEn", status)) +
						"</a>";
					if (
						type == "display" &&
						data &&
						data.installationDate_dt &&
						[
							"LINE",
							"BACKORDER",
							"PRODUCTION",
							"TRANSIT",
							"FINISHED",
							"ORDER_CANCELED",
						].indexOf(status) !== -1
					) {
						var programmed =
							'<a ng-click="toggleDetails(' +
							id +
							')" class="status-block status-circle PROGRAMMED">P</a>';
						text = text + programmed;
					}
					return text;
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "dpfc")
				.withTitle(EXECUTION_ENV!="EXTERNAL" ?"D.P.F.C":"Days To Due Date")
				.renderWith(function (data) {
					var id = "&#39;" + data.id + "&#39;";
					var startDate = data.cycleStartDate_dt
						? moment(data.cycleStartDate_dt)
						: null;
					var commitmentDate = data.commitmentDate_dt
						? moment(data.commitmentDate_dt)
						: null;
					var endDate = data.cycleFinishDate_dt
						? moment(data.cycleFinishDate_dt)
						: null;
					var days = getRemainingDays(
						startDate,
						commitmentDate,
						endDate
					);
					var commitmentStatus = getCountdownStatus(
						startDate,
						days,
						commitmentDate,
						endDate
					);
					var dpfcDays = getDPFCDays(
						days,
						data.status_s,
						startDate,
						commitmentDate
					);
					return (
						'<a ng-click="toggleDetails(' +
						id +
						')" class="order-cycle ' +
						commitmentStatus +
						'">' +
						dpfcDays +
						"</a>"
					);
				}),

			DTColumnBuilder.newColumn(null)
				.withOption("name", "cycle")
				.withTitle(EXECUTION_ENV!="EXTERNAL" ?"Tiempo de Ciclo":"Cycle Time")
				.renderWith(function (data) {
					var id = "&#39;" + data.id + "&#39;";
					var startDate = data.cycleStartDate_dt
						? moment(data.cycleStartDate_dt)
						: null;
					var endDate = data.cycleFinishDate_dt
						? moment(data.cycleFinishDate_dt)
						: null;
					var status = getCycleStatus(startDate, endDate);
					var days = getCycleDays(startDate, endDate);
					return (
						'<a ng-click="toggleDetails(' +
						id +
						')" class="order-cycle ' +
						status +
						'">' +
						days +
						"</a>"
					);
				}),
		];

		var salesManagerColumns = [
			DTColumnBuilder.newColumn(null)
				.withOption("name", "date_dt")
				.withTitle(EXECUTION_ENV!="EXTERNAL" ?"Fecha":"DAte")
				.renderWith(function (data) {
					var id = "&#39;" + data.id + "&#39;";
					return (
						'<a ng-click="toggleDetails(' +
						id +
						')">' +
						$filter("date")(data.date_dt, "dd/MM/yyyy") +
						"</a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "no_l")
				.withTitle(EXECUTION_ENV!="EXTERNAL" ?"Orden":"Order")
				.renderWith(function (data) {
					var id = "&#39;" + data.id + "&#39;";
					if (!data.isSuborder_b) {
						return (
							'<a ng-click="toggleDetails(' +
							id +
							')">' +
							data.no_l +
							"</a>"
						);
					} else {
						return (
							'<a ng-click="toggleDetails(' +
							id +
							')">' +
							data.suborderNo +
							"</a>"
						);
					}
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "clientName_txt")
				.withTitle(EXECUTION_ENV!="EXTERNAL" ?"Cliente":"Client")
				.renderWith(function (data) {
					var id = "&#39;" + data.id + "&#39;";
					return (
						'<a ng-click="toggleDetails(' +
						id +
						')">' +
						data.clientName_txt +
						"</a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "assesor_txt")
				.withTitle(EXECUTION_ENV!="EXTERNAL" ?"Vendedor":"Sales Rep.")
				.renderWith(function (data) {
					var id = "&#39;" + data.id + "&#39;";
					return (
						'<a ng-click="toggleDetails(' +
						id +
						')">' +
						data.assesor_txt +
						"</a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "total_d")
				.withTitle("Total")
				.renderWith(function (data) {
					var id = "&#39;" + data.id + "&#39;";
					return (
						'<a ng-click="toggleDetails(' +
						id +
						')">' +
						$filter("currency")(data.total_d) +
						"</a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "balance_d")
				.withTitle(EXECUTION_ENV!="EXTERNAL" ?"Saldo":"Balance")
				.renderWith(function (data) {
					var id = "&#39;" + data.id + "&#39;";

					if (!data.isSuborder_b) {
						var balance =
							data.balance_d == null
								? data.total_d
								: data.balance_d;
						return (
							'<a ng-click="toggleDetails(' +
							id +
							')">' +
							$filter("currency")(balance) +
							"</a>"
						);
					} else {
						return (
							'<a ng-click="toggleDetails(' +
							id +
							')">' +
							"-" +
							"</a>"
						);
					}
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "status_s")
				.withTitle(EXECUTION_ENV!="EXTERNAL" ?"Estado":"Order Status")
				.renderWith(function (data) {
					var id = "&#39;" + data.id + "&#39;";
					var status = $scope.pretty(
						"reverseOrderStatus",
						data.status_s
					);
					return (
						'<a ng-click="toggleDetails(' +
						id +
						')" class="status-block ' +
						status +
						'">' +
						(EXECUTION_ENV!="EXTERNAL"?$scope.pretty("orderStatus", status):$scope.pretty("orderStatusEn", status)) +
						"</a>"
					);
				}),

			DTColumnBuilder.newColumn(null)
				.withOption("name", "dpfc")
				.withTitle(EXECUTION_ENV!="EXTERNAL" ?"D.P.F.C":"Days to Due Date")
				.renderWith(function (data) {
					var id = "&#39;" + data.id + "&#39;";
					var startDate = data.cycleStartDate_dt
						? moment(data.cycleStartDate_dt)
						: null;
					var commitmentDate = data.commitmentDate_dt
						? moment(data.commitmentDate_dt)
						: null;
					var endDate = data.cycleFinishDate_dt
						? moment(data.cycleFinishDate_dt)
						: null;
					var days = getRemainingDays(
						startDate,
						commitmentDate,
						endDate
					);
					var commitmentStatus = getCountdownStatus(
						startDate,
						days,
						commitmentDate,
						endDate
					);
					var dpfcDays = getDPFCDays(
						days,
						data.status_s,
						startDate,
						commitmentDate
					);
					return (
						'<a ng-click="toggleDetails(' +
						id +
						')" class="order-cycle ' +
						commitmentStatus +
						'">' +
						dpfcDays +
						"</a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "cycle")
				.withTitle(EXECUTION_ENV!="EXTERNAL" ?"Tiempo de Ciclo":"Cycle Time")
				.renderWith(function (data) {
					var id = "&#39;" + data.id + "&#39;";
					var startDate = data.cycleStartDate_dt
						? moment(data.cycleStartDate_dt)
						: null;
					var endDate = data.cycleFinishDate_dt
						? moment(data.cycleFinishDate_dt)
						: null;
					var status = getCycleStatus(startDate, endDate);
					var days = getCycleDays(startDate, endDate);
					return (
						'<a ng-click="toggleDetails(' +
						id +
						')" class="order-cycle ' +
						status +
						'">' +
						days +
						"</a>"
					);
				}),
		];

		var consultantColumns = [
			DTColumnBuilder.newColumn(null)
				.withOption("name", "date_dt")
				.withTitle(EXECUTION_ENV!="EXTERNAL" ?"Fecha":"Date")
				.renderWith(function (data) {
					var id = "&#39;" + data.id + "&#39;";
					return (
						'<a ng-click="toggleDetails(' +
						id +
						')">' +
						$filter("date")(data.date_dt, "dd/MM/yyyy") +
						"</a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "no_l")
				.withTitle(EXECUTION_ENV!="EXTERNAL" ?"Orden":"Order")
				.renderWith(function (data) {
					var id = "&#39;" + data.id + "&#39;";
					if (!data.isSuborder_b) {
						return (
							'<a ng-click="toggleDetails(' +
							id +
							')">' +
							data.no_l +
							"</a>"
						);
					} else {
						return (
							'<a ng-click="toggleDetails(' +
							id +
							')">' +
							data.suborderNo +
							"</a>"
						);
					}
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "clientName_txt")
				.withTitle(EXECUTION_ENV!="EXTERNAL" ?"Cliente":"Client")
				.renderWith(function (data) {
					var id = "&#39;" + data.id + "&#39;";
					return (
						'<a ng-click="toggleDetails(' +
						id +
						')">' +
						data.clientName_txt +
						"</a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "status_s")
				.withTitle(EXECUTION_ENV!="EXTERNAL" ?"Estado":"Order Status")
				.renderWith(function (data) {
					var id = "&#39;" + data.id + "&#39;";
					var status = $scope.pretty(
						"reverseOrderStatus",
						data.status_s
					);
					return (
						'<a ng-click="toggleDetails(' +
						id +
						')" class="status-block ' +
						status +
						'">' +
						(EXECUTION_ENV!="EXTERNAL"?$scope.pretty("orderStatus", status):$scope.pretty("orderStatusEn", status)) +
						"</a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "dpfc")
				.withTitle(EXECUTION_ENV!="EXTERNAL" ?"D.P.F.C":"Days To due Date")
				.renderWith(function (data) {
					var id = "&#39;" + data.id + "&#39;";
					var startDate = data.cycleStartDate_dt
						? moment(data.cycleStartDate_dt)
						: null;
					var commitmentDate = data.commitmentDate_dt
						? moment(data.commitmentDate_dt)
						: null;
					var endDate = data.cycleFinishDate_dt
						? moment(data.cycleFinishDate_dt)
						: null;
					var days = getRemainingDays(
						startDate,
						commitmentDate,
						endDate
					);
					var commitmentStatus = getCountdownStatus(
						startDate,
						days,
						commitmentDate,
						endDate
					);
					var dpfcDays = getDPFCDays(
						days,
						data.status_s,
						startDate,
						commitmentDate
					);
					return (
						'<a ng-click="toggleDetails(' +
						id +
						')" class="order-cycle ' +
						commitmentStatus +
						'">' +
						dpfcDays +
						"</a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "programmedDate_dt")
				.withTitle(EXECUTION_ENV!="EXTERNAL" ?"F. Programación":"Scheduled Installation")
				.renderWith(function (data) {
					var date =
						data.programmedDate_dt != null
							? data.programmedDate_dt
							: "-";
					var id = "&#39;" + data.id + "&#39;";
					return (
						'<a ng-click="toggleDetails(' +
						id +
						')">' +
						$filter("date")(date, "dd/MM/yyyy") +
						"</a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "installationDate_dt")
				.withTitle(EXECUTION_ENV!="EXTERNAL" ?"F. Instalación":"Installation Date")
				.renderWith(function (data) {
					var date =
						data.installationDate_dt != null
							? data.installationDate_dt
							: "-";
					var id = "&#39;" + data.id + "&#39;";
					return (
						'<a ng-click="toggleDetails(' +
						id +
						')">' +
						$filter("date")(date, "dd/MM/yyyy") +
						"</a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "cycle")
				.withTitle(EXECUTION_ENV!="EXTERNAL" ?"Tiempo de Ciclo":"Cycle Time")
				.renderWith(function (data) {
					var id = "&#39;" + data.id + "&#39;";
					var startDate = data.cycleStartDate_dt
						? moment(data.cycleStartDate_dt)
						: null;
					var endDate = data.cycleFinishDate_dt
						? moment(data.cycleFinishDate_dt)
						: null;
					var status = getCycleStatus(startDate, endDate);
					var days = getCycleDays(startDate, endDate);
					return (
						'<a ng-click="toggleDetails(' +
						id +
						')" class="order-cycle ' +
						status +
						'">' +
						days +
						"</a>"
					);
				}),
		];

		var managerColumns = [
			DTColumnBuilder.newColumn(null)
				.withOption("name", "no_l")
				.withTitle(EXECUTION_ENV!="EXTERNAL" ?"Orden":"Order")
				.renderWith(function (data) {
					var id = "&#39;" + data.id + "&#39;";
					if (!data.isSuborder_b) {
						return (
							'<a ng-click="toggleDetails(' +
							id +
							')">' +
							data.no_l +
							"</a>"
						);
					} else {
						return (
							'<a ng-click="toggleDetails(' +
							id +
							')">' +
							data.suborderNo +
							"</a>"
						);
					}
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "clientName_txt")
				.withTitle(EXECUTION_ENV!="EXTERNAL" ?"Cliente":"Client")
				.renderWith(function (data) {
					var id = "&#39;" + data.id + "&#39;";
					return (
						'<a ng-click="toggleDetails(' +
						id +
						')">' +
						data.clientName_txt +
						"</a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "status_s")
				.withTitle(EXECUTION_ENV!="EXTERNAL" ?"Estado":"Order Status")
				.renderWith(function (data) {
					var id = "&#39;" + data.id + "&#39;";
					var status = $scope.pretty(
						"reverseOrderStatus",
						data.status_s
					);
					return (
						'<a ng-click="toggleDetails(' +
						id +
						')" class="status-block ' +
						status +
						'">' +
						(EXECUTION_ENV!="EXTERNAL"?$scope.pretty("orderStatus", status):$scope.pretty("orderStatusEn", status)) +
						"</a>"
					);
				}),

			DTColumnBuilder.newColumn(null)
				.withOption("name", "providerId_s")
				.withTitle(EXECUTION_ENV!="EXTERNAL" ?"Proveedor":"Provider")
				.renderWith(function (data) {
					var provider = data.providerId_s
						? data.providerId_s
						: " - ";
					return (
						'<a href="#/console/order/' +
						data.id +
						'">' +
						provider +
						"<a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "dpfc")
				.withTitle(EXECUTION_ENV!="EXTERNAL" ?"D.P.F.C":"Days to due Date")
				.renderWith(function (data) {
					var id = "&#39;" + data.id + "&#39;";
					var startDate = data.cycleStartDate_dt
						? moment(data.cycleStartDate_dt)
						: null;
					var commitmentDate = data.commitmentDate_dt
						? moment(data.commitmentDate_dt)
						: null;
					var endDate = data.cycleFinishDate_dt
						? moment(data.cycleFinishDate_dt)
						: null;
					var days = getRemainingDays(
						startDate,
						commitmentDate,
						endDate
					);
					var commitmentStatus = getCountdownStatus(
						startDate,
						days,
						commitmentDate,
						endDate
					);
					var dpfcDays = getDPFCDays(
						days,
						data.status_s,
						startDate,
						commitmentDate
					);
					return (
						'<a ng-click="toggleDetails(' +
						id +
						')" class="order-cycle ' +
						commitmentStatus +
						'">' +
						dpfcDays +
						"</a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "te_produccion")
				.withTitle(EXECUTION_ENV!="EXTERNAL" ?"T. Entrega Producción":"Production Days")
				.renderWith(function (data) {
					var id = "&#39;" + data.id + "&#39;";
					var startDate = data.productionDate_dt
						? moment(data.productionDate_dt)
						: null;
					var commitmentDate = data.productionLimitDate_dt
						? moment(data.productionLimitDate_dt)
						: null;
					var endDate = data.productionFinishDate_dt
						? moment(data.productionFinishDate_dt)
						: null;
					var days = getRemainingDays(
						startDate,
						commitmentDate,
						endDate
					);
					var status = getCountdownStatus(
						startDate,
						days,
						commitmentDate,
						endDate
					);
					var countdown = getProductionDays(
						days,
						startDate,
						commitmentDate,
						endDate
					);

					return (
						'<a ng-click="toggleDetails(' +
						id +
						')" class="order-cycle ' +
						status +
						'">' +
						countdown +
						"</a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "endProductionDate_dt")
				.withTitle(EXECUTION_ENV!="EXTERNAL" ?"Salida de Producción":"Production Out Date")
				.renderWith(function (data) {
					var date =
						data.endProductionDate_dt != null
							? data.endProductionDate_dt
							: "-";
					var id = "&#39;" + data.id + "&#39;";
					return (
						'<a ng-click="toggleDetails(' +
						id +
						')">' +
						$filter("date")(date, "dd/MM/yyyy") +
						"</a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "te_transit")
				.withTitle(EXECUTION_ENV!="EXTERNAL" ?"T. Entrega Tránsito":"Transit Date")
				.renderWith(function (data) {
					var id = "&#39;" + data.id + "&#39;";
					var startDate = data.transitDate_dt
						? moment(data.transitDate_dt)
						: null;
					var commitmentDate = data.transitLimitDate_dt
						? moment(data.transitLimitDate_dt)
						: null;
					var endDate = data.transitFinishDate_dt
						? moment(data.transitFinishDate_dt)
						: null;
					var days = getCycleDays(startDate, endDate);
					var status = getCountupStatus(
						startDate,
						days,
						commitmentDate,
						endDate
					);
					return (
						'<a ng-click="toggleDetails(' +
						id +
						')" class="order-cycle ' +
						status +
						'">' +
						days +
						"</a>"
					);
				}),

			DTColumnBuilder.newColumn(null)
				.withOption("name", "cycle")
				.withTitle(EXECUTION_ENV!="EXTERNAL" ?"Tiempo de Ciclo":"Cycle Time")
				.renderWith(function (data) {
					var id = "&#39;" + data.id + "&#39;";
					var startDate = data.cycleStartDate_dt
						? moment(data.cycleStartDate_dt)
						: null;
					var endDate = data.cycleFinishDate_dt
						? moment(data.cycleFinishDate_dt)
						: null;
					var status = getCycleStatus(startDate, endDate);
					var days = getCycleDays(startDate, endDate);
					return (
						'<a ng-click="toggleDetails(' +
						id +
						')" class="order-cycle ' +
						status +
						'">' +
						days +
						"</a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "commitmentDate_dt")
				.withTitle(EXECUTION_ENV!="EXTERNAL" ?"Fecha Compromiso":"Commitment Date")
				.renderWith(function (data) {
					var date =
						data.commitmentDate_dt != null
							? data.commitmentDate_dt
							: "-";
					var id = "&#39;" + data.id + "&#39;";
					return (
						'<a ng-click="toggleDetails(' +
						id +
						')">' +
						$filter("date")(date, "dd/MM/yyyy") +
						"</a>"
					);
				}),
		];

		var installationManagerColumns = [
			DTColumnBuilder.newColumn(null)
				.withOption("name", "date_dt")
				.withTitle(EXECUTION_ENV!="EXTERNAL" ?"Fecha":"Date")
				.renderWith(function (data) {
					var id = "&#39;" + data.id + "&#39;";
					return (
						'<a ng-click="toggleDetails(' +
						id +
						')">' +
						$filter("date")(data.date_dt, "dd/MM/yyyy") +
						"</a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "no_l")
				.withTitle(EXECUTION_ENV!="EXTERNAL" ?"Orden":"Order")
				.renderWith(function (data) {
					var id = "&#39;" + data.id + "&#39;";
					if (!data.isSuborder_b) {
						return (
							'<a ng-click="toggleDetails(' +
							id +
							')">' +
							data.no_l +
							"</a>"
						);
					} else {
						return (
							'<a ng-click="toggleDetails(' +
							id +
							')">' +
							data.suborderNo +
							"</a>"
						);
					}
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "clientName_txt")
				.withTitle(EXECUTION_ENV!="EXTERNAL" ?"Cliente":"Client")
				.renderWith(function (data) {
					var id = "&#39;" + data.id + "&#39;";
					return (
						'<a ng-click="toggleDetails(' +
						id +
						')">' +
						data.clientName_txt +
						"</a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "status_s")
				.withTitle(EXECUTION_ENV!="EXTERNAL" ?"Estado":"Order Status")
				.renderWith(function (data) {
					var id = "&#39;" + data.id + "&#39;";
					var status = $scope.pretty(
						"reverseOrderStatus",
						data.status_s
					);
					return (
						'<a ng-click="toggleDetails(' +
						id +
						')" class="status-block ' +
						status +
						'">' +
						(EXECUTION_ENV!="EXTERNAL"?$scope.pretty("orderStatus", status):$scope.pretty("orderStatusEn", status)) +
						"</a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "arrivalDate_dt")
				.withTitle(EXECUTION_ENV!="EXTERNAL" ?"F. Llegada":"Arrival Date")
				.renderWith(function (data) {
					var date =
						data.arrivalDate_dt != null ? data.arrivalDate_dt : "-";
					var id = "&#39;" + data.id + "&#39;";
					return (
						'<a ng-click="toggleDetails(' +
						id +
						')">' +
						$filter("date")(date, "dd/MM/yyyy") +
						"</a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "dpfc")
				.withTitle(EXECUTION_ENV!="EXTERNAL" ?"D.P.F.C":"Days to due Date")
				.renderWith(function (data) {
					var id = "&#39;" + data.id + "&#39;";
					var startDate = data.cycleStartDate_dt
						? moment(data.cycleStartDate_dt)
						: null;
					var commitmentDate = data.commitmentDate_dt
						? moment(data.commitmentDate_dt)
						: null;
					var endDate = data.cycleFinishDate_dt
						? moment(data.cycleFinishDate_dt)
						: null;
					var days = getRemainingDays(
						startDate,
						commitmentDate,
						endDate
					);
					var commitmentStatus = getCountdownStatus(
						startDate,
						days,
						commitmentDate,
						endDate
					);
					var dpfcDays = getDPFCDays(
						days,
						data.status_s,
						startDate,
						commitmentDate
					);
					return (
						'<a ng-click="toggleDetails(' +
						id +
						')" class="order-cycle ' +
						commitmentStatus +
						'">' +
						dpfcDays +
						"</a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "te_transit")
				.withTitle(EXECUTION_ENV!="EXTERNAL" ?"T. Entrega Tránsito":"Transit Date")
				.renderWith(function (data) {
					var id = "&#39;" + data.id + "&#39;";
					var startDate = data.transitDate_dt
						? moment(data.transitDate_dt)
						: null;
					var commitmentDate = data.transitLimitDate_dt
						? moment(data.transitLimitDate_dt)
						: null;
					var endDate = data.transitFinishDate_dt
						? moment(data.transitFinishDate_dt)
						: null;
					var days = getCycleDays(startDate, endDate);
					var status = getCountupStatus(
						startDate,
						days,
						commitmentDate,
						endDate
					);
					return (
						'<a ng-click="toggleDetails(' +
						id +
						')" class="order-cycle ' +
						status +
						'">' +
						days +
						"</a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "cycle")
				.withTitle(EXECUTION_ENV!="EXTERNAL" ?"Tiempo de Ciclo":"Cycle Time")
				.renderWith(function (data) {
					var id = "&#39;" + data.id + "&#39;";
					var startDate = data.cycleStartDate_dt
						? moment(data.cycleStartDate_dt)
						: null;
					var endDate = data.cycleFinishDate_dt
						? moment(data.cycleFinishDate_dt)
						: null;
					var status = getCycleStatus(startDate, endDate);
					var days = getCycleDays(startDate, endDate);
					return (
						'<a ng-click="toggleDetails(' +
						id +
						')" class="order-cycle ' +
						status +
						'">' +
						days +
						"</a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "commitmentDate_dt")
				.withTitle(EXECUTION_ENV!="EXTERNAL" ?"Fecha Compromiso":"Commitment Date")
				.renderWith(function (data) {
					var date =
						data.commitmentDate_dt != null
							? data.commitmentDate_dt
							: "-";
					var id = "&#39;" + data.id + "&#39;";
					return (
						'<a ng-click="toggleDetails(' +
						id +
						')">' +
						$filter("date")(date, "dd/MM/yyyy") +
						"</a>"
					);
				}),
		];

		var consultantExternalColumns = [
			DTColumnBuilder.newColumn(null)
				.withOption("name", "date_dt")
				.withTitle(EXECUTION_ENV!="EXTERNAL" ?"Fecha":"Date")
				.renderWith(function (data) {
					var id = "&#39;" + data.id + "&#39;";
					return (
						'<a ng-click="toggleDetails(' +
						id +
						')">' +
						$filter("date")(data.date_dt, "dd/MM/yyyy") +
						"</a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "no_l")
				.withTitle(EXECUTION_ENV!="EXTERNAL" ?"Orden":"Order #")
				.renderWith(function (data) {
					var id = "&#39;" + data.id + "&#39;";
					if (!data.isSuborder_b) {
						return (
							'<a ng-click="toggleDetails(' +
							id +
							')">' +
							data.no_l +
							"</a>"
						);
					} else {
						return (
							'<a ng-click="toggleDetails(' +
							id +
							')">' +
							data.suborderNo +
							"</a>"
						);
					}
				}),
				DTColumnBuilder.newColumn(null)
				.withOption("name", "clientType_txt")
				.withTitle(EXECUTION_ENV!="EXTERNAL" ? "Tipo de Cliente":"Sidemark")
				.renderWith(function (data) {
				  
				  return (
					"<a href=\"#/console/order/" +
					data.id +
					"\">" +
					(EXECUTION_ENV!="EXTERNAL" ? data.clientType_txt : data.project_txt) +
					"<a>"
				  )
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "clientName_txt")
				.withTitle(EXECUTION_ENV!="EXTERNAL" ?"Cliente":"Client")
				.renderWith(function (data) {
					var id = "&#39;" + data.id + "&#39;";
					return (
						'<a ng-click="toggleDetails(' +
						id +
						')">' +
						data.clientName_txt +
						"</a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "status_s")
				.withTitle(EXECUTION_ENV!="EXTERNAL" ?"Estado":"Order Status")
				.renderWith(function (data) {
					var id = "&#39;" + data.id + "&#39;";
					var status = $scope.pretty(
						"reverseOrderStatus",
						data.status_s
					);
					return (
						'<a ng-click="toggleDetails(' +
						id +
						')" class="status-block ' +
						status +
						'">' +
						(EXECUTION_ENV!="EXTERNAL"?$scope.pretty("orderStatus", status):$scope.pretty("orderStatusEn", status)) +
						"</a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "total_d")
				.withTitle(EXECUTION_ENV!="EXTERNAL" ?"D.P.F.C":" Total")
				.renderWith(function (data) {
					var id = "&#39;" + data.id + "&#39;";
					return (
						'<a ng-click="toggleDetails(' +
						id +
						')">' +
						$filter("currency")(data.total_d) +
						"</a>"
					);
				}),
				DTColumnBuilder.newColumn(null)
				.withOption("name", "balance_d")
				.withTitle(EXECUTION_ENV!="EXTERNAL" ?"Saldo":"Balance")
				.renderWith(function (data) {
					var id = "&#39;" + data.id + "&#39;";

					if (!data.isSuborder_b) {
						var balance =
							data.balance_d == null
								? data.total_d
								: data.balance_d;
						return (
							'<a ng-click="toggleDetails(' +
							id +
							')">' +
							$filter("currency")(balance) +
							"</a>"
						);
					} else {
						return (
							'<a ng-click="toggleDetails(' +
							id +
							')">' +
							"-" +
							"</a>"
						);
					}
				}),
			/*DTColumnBuilder.newColumn(null)
				.withOption("name", "cycle")
				.withTitle(EXECUTION_ENV!="EXTERNAL" ?"Tiempo de Ciclo":"Cycle Time")
				.renderWith(function (data) {
					var id = "&#39;" + data.id + "&#39;";
					var startDate = data.cycleStartDate_dt
						? moment(data.cycleStartDate_dt)
						: null;
					var endDate = data.cycleFinishDate_dt
						? moment(data.cycleFinishDate_dt)
						: null;
					var status = getCycleStatus(startDate, endDate);
					var days = getCycleDays(startDate, endDate);
					return (
						'<a ng-click="toggleDetails(' +
						id +
						')" class="order-cycle ' +
						status +
						'">' +
						days +
						"</a>"
					);
				}),
				*/
		];

		var loadColumns = function () {
			switch ($scope.currentUser.role) {
				case "ADMIN":
					$scope.tableColumns = adminColumns;
					break;
				case "SALES_MANAGER":
					$scope.tableColumns = salesManagerColumns;
					break;
				case "SUPERADMIN":
					$scope.tableColumns = adminColumns;
					break;
				case "MANAGER":
					$scope.tableColumns = managerColumns;
					break;
				case "BUYER":
					$scope.tableColumns = managerColumns;
					break;
				case "INSTALLATION_MANAGER":
					$scope.tableColumns = installationManagerColumns;
					break;
				case "CONSULTANT":
					$scope.tableColumns = consultantColumns;
					if(EXECUTION_ENV=="EXTERNAL"){
						$scope.tableColumns = consultantExternalColumns;
					}
					break;
			}
			fillStatusList(
				permissionsHelper.getStatusList($rootScope.currentUser.role)
			);
			$scope.statusList = $rootScope.orderStatusList;
			console.log($scope.statusList)
			typeChange();
			typeChange();
			$timeout(function () {
				typeChange();
			}, 1000);
			$scope.ready = true;
		};

		var fillStatusList = function (list) {
			angular.forEach(list, function (status) {
				$scope.availableStatusList.push({
					label: (EXECUTION_ENV =="EXTERNAL"?$scope.pretty("orderStatusEn", status) :$scope.pretty("orderStatus", status)),
					value: status,
				});
			});
			if (!$rootScope.orderStatusList) {
				$rootScope.orderStatusList = [];
				$scope.availableStatusList.forEach(function (status) {
					$rootScope.orderStatusList.push({ id: status.value });
				});
			}
		};
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
			if ($scope.endDate && $scope.startDate > $scope.endDate) {
				$scope.endDate = angular.copy($scope.startDate);
			}
			$scope.drawTable();
		};

		$scope.endDateChange = function () {
			if ($scope.endDate) {
				$scope.endDate = moment($scope.endDate).endOf("day").toDate();
			}
			$scope.drawTable();
		};

		var getCycleDays = function (startDate, endDate) {
			var cycle = 0;
			var days;
			var currentDate = moment();
			var daysExcludingWeekends = 0;
			var START_CYCLE = 1;

			if (startDate) {
				if (!endDate) {
					cycle = currentDate.diff(startDate, "days");
				} else {
					cycle = endDate.diff(startDate, "days");
				}
				days = cycle <= 0 ? 0 : cycle;
				daysExcludingWeekends = getDaysExcludingWeekends(
					startDate,
					days
				);
				daysExcludingWeekends += START_CYCLE;

				return daysExcludingWeekends;
			} else {
				return " - ";
			}
		};

		var getCycleStatus = function (startDate, endDate) {
			var status = "";
			if (startDate) {
				if (!endDate) {
					status = "START";
				} else {
					status = "END";
				}
			} else {
				status = "";
			}
			return status;
		};

		var getRemainingDays = function (startDate, commitmentDate, endDate) {
			var currentDate = moment();
			var days = 0;
			var daysLeft = 0;
			var comparisonDate;

			if (startDate && commitmentDate) {
				days = commitmentDate.diff(startDate, "days");
				if (!endDate) {
					comparisonDate = angular.copy(currentDate);
				} else {
					comparisonDate = angular.copy(endDate);
				}
				days = getDaysExcludingWeekends(startDate, days);
				daysLeft = getDaysLeft(startDate, comparisonDate, days);
				return daysLeft;
			} else {
				return " - ";
			}
		};

		var getCountdownStatus = function (
			startCycle,
			days,
			commitmentDate,
			endDate
		) {
			var status = "";

			if (startCycle && commitmentDate) {
				if (!endDate) {
					status = days >= 0 ? "START" : "LATE";
				} else {
					status = "END";
				}
			} else {
				status = "";
			}
			return status;
		};

		var getCountupStatus = function (
			startDate,
			days,
			commitmentDate,
			endDate
		) {
			var status = "";
			var START_CYCLE = 1;

			if (startDate && commitmentDate) {
				var commitmentDays = commitmentDate.diff(startDate, "days");
				commitmentDays = getDaysExcludingWeekends(
					startDate,
					commitmentDays
				);

				commitmentDays += START_CYCLE;

				if (!endDate) {
					status = days <= commitmentDays ? "START" : "LATE";
				} else {
					status = "END";
				}
			} else {
				status = "";
			}

			return status;
		};

		var getDaysExcludingWeekends = function (startDate, days) {
			var daysExcludingWeekends = angular.copy(days);
			var date = angular.copy(startDate);
			for (var i = 0; i < days; i++) {
				date = date.add(1, "days");
				if (date.isoWeekday() === 6 || date.isoWeekday() === 7) {
					daysExcludingWeekends--;
				}
			}
			return daysExcludingWeekends;
		};

		var getDaysLeft = function (startDate, comparisonDate, commitmentDays) {
			var leftDays = angular.copy(commitmentDays);
			var date = angular.copy(startDate);
			var passedDays = comparisonDate.diff(date, "days");
			for (var i = 0; i < passedDays; i++) {
				date = date.add(1, "days");
				if (date.isoWeekday() !== 6 && date.isoWeekday() !== 7) {
					leftDays--;
				}
			}
			return leftDays;
		};

		var getDPFCDays = function (days, status, startDate, commitmentDate) {
			var orderStatus = $scope.pretty("reverseOrderStatus", status);
			var absDays = isNaN(days) ? days : Math.abs(days);
			var START_CYCLE = 1;
			var dpfcDays;
			if (startDate && commitmentDate) {
				var businessDays = commitmentDate.diff(startDate, "days");
				businessDays = getDaysExcludingWeekends(
					startDate,
					businessDays
				);
				var totalDays = businessDays + START_CYCLE - days;

				if (orderStatus !== "INSTALLED") {
					dpfcDays = absDays;
				} else {
					dpfcDays = totalDays + "/" + (businessDays + START_CYCLE);
				}
			} else {
				dpfcDays = "-";
			}

			return dpfcDays;
		};

		var getProductionDays = function (
			days,
			startDate,
			commitmentDate,
			endDate
		) {
			var absDays = isNaN(days) ? days : Math.abs(days);
			var START_CYCLE = 1;
			var productionDays;
			if (startDate && commitmentDate) {
				var businessDays = commitmentDate.diff(startDate, "days");
				businessDays = getDaysExcludingWeekends(
					startDate,
					businessDays
				);
				var totalDays = businessDays + START_CYCLE - days;
				if (endDate === null) {
					productionDays = absDays;
				} else {
					productionDays =
						totalDays + "/" + (businessDays + START_CYCLE);
				}
			} else {
				productionDays = "-";
			}
			return productionDays;
		};

		var getQuantityProducts = function (order) {
			var productsQuantity = 0;
			if (order.type !== "Custom") {
				if (order.products != null) {
					order.products.forEach(function (product) {
						productsQuantity += product.quantity;
					});
				}
			} else {
				productsQuantity = order.products[0].quantity;
			}

			return productsQuantity;
		};

		if ($scope.isConsultant) {
			$scope.orderTypeChange("consultant");
		}

		//====================================================

		if (!$scope.currentUser) {
			$timeout(function () {
				loadColumns();
			}, 1000);
		} else {
			loadColumns();
		}

		//---------------------------------------------------
	}
);
