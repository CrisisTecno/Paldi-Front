import { pdApp } from "../index";

pdApp.controller(
	"BillsCtrl",
	function (
		$rootScope,
		$state,
		$scope,
		$compile,
		$timeout,
		paldiService,
		$filter,
		ngDialog,
		DTOptionsBuilder,
		DTColumnDefBuilder,
		DTColumnBuilder,
		sessionHelper
	) {
		$timeout(function () {
			if (
				!$scope.currentUser.canAdmin &&
				$scope.currentUser.role != "MANAGER" &&
				$scope.currentUser.role != "BUYER"
			) {
				$state.go("console.quote-list");
			}
		}, 200);
		$scope.statusList = [];
		$scope.availableStatusList = [];
		var cleanStatusList = [];

		var billsStatusList = sessionHelper.getBillsStatusList();
		$scope.isEmpty = true;
		$scope.ready = false;

		var getDownloadLink = function () {
			$scope.downloadLink =
				paldiService.bills.getPendingBillsDownloadLink(
					search,
					$scope.startDate,
					$scope.endDate,
					cleanStatusList
				);
		};
		//============= Data tables =============
		function createdRow(row, data, dataIndex) {
			$compile(angular.element(row).contents())($scope);
		}
		var search = "";
		var serverData = function (sSource, aoData, fnCallback, oSettings) {
			var sear = aoData[5].value.value;
			var draw = aoData[0].value;
			var sort =
				aoData[1].value[aoData[2].value[0].column].name +
				" " +
				aoData[2].value[0].dir;
			var size = aoData[4].value;
			var page = aoData[3].value / size;

			search = sear;
			getDownloadLink();
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
				var processResult = function (data, fnCallback) {
					var result = {
						draw: draw,
						recordsTotal: data.numFound,
						recordsFiltered: data.numFound,
						data: data.docs,
					};
					fnCallback(result);
					$scope.isEmpty = result.recordsTotal > 0 ? false : true;
				};
				paldiService.bills
					.getPendingBills(
						search,
						cleanStatusList,
						page * size,
						page,
						size,
						sort,
						$scope.startDate,
						$scope.endDate
					)
					.then(function (data) {
						processResult(data, fnCallback);
					});
			}
		};

		$scope.tableOptions = DTOptionsBuilder.newOptions()
			.withLanguageSource("lang/table_lang.json")
			.withFnServerData(serverData)
			.withOption("processing", true)
			.withOption("serverSide", true)
			.withOption("order", [0, "asc"])
			.withDOM("ftp")
			.withDisplayLength(15)
			.withOption("createdRow", createdRow);

		$scope.tableColumns = [
			DTColumnBuilder.newColumn(null)
				.withOption("name", "date_dt")
				.withTitle("Fecha")
				.renderWith(function (data) {
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
				.withTitle("Orden de venta")
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
				.withOption("name", "clientName_txt")
				.withTitle("Cliente")
				.renderWith(function (data) {
					return (
						'<a href="#/console/order/' +
						data.id +
						'">' +
						data.clientName_txt +
						"<a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "providerId_s")
				.withTitle("ID Proveedor")
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
				.withOption("name", "status_s")
				.withTitle("Estado")
				.renderWith(function (data) {
					return (
						'<a href="#/console/order/' +
						data.id +
						'" class="status-block ' +
						$rootScope.pretty("reverseOrderStatus", data.status_s) +
						'">' +
						$scope.pretty("orderStatus", data.status_s) +
						"<a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "subTotal_d")
				.withTitle("Subtotal")
				.renderWith(function (data) {
					return (
						'<a href="#/console/order/' +
						data.id +
						'">' +
						$filter("currency")(data.subTotal_d) +
						"</a>"
					);
				}),
			DTColumnBuilder.newColumn(null).renderWith(function (data) {
				var id = "&#39;" + data.id + "&#39;";
				return (
					'<i class="btn btn-xs fa fa-file-o" ng-click="uploadBillDialog(' +
					id +
					')"> Cargar factura</i>'
				);
			}),
			DTColumnBuilder.newColumn(null).renderWith(function (data) {
				var id = "&#39;" + data.id + "&#39;";
				var showButton =
					($scope.currentUser.role == "SUPERADMIN" || $scope.currentUser.role=="MANAGER") ? "true" : "false";
				return (
					'<button ng-if="' +
					showButton +
					'" class="btn btn-xs btn-danger" ng-click="needsBill(' +
					id +
					')"> No necesita factura</button>'
				);
			}),
		];
		//---------------------------------------------------
		var selectedOrderId = null;

		$scope.uploadBillDialog = function (id) {
			$scope.fd = null;
			selectedOrderId = id;
			$scope.fileValid = false;
			$scope.dialog = ngDialog.open({
				scope: $scope,
				template: "partials/modals/upload-bill-file.html",
				showClose: false,
			});
		};

		$scope.selectFile = function (files) {
			$scope.fd = []
			$scope.fileValid = [];
			$scope.fileEmpty = false;
			for (const file of files){
			if (
				file.type == "text/xml" ||
				file.type == "application/xml"
			) {
				if (file.size) {
					let form = new FormData()
					form.append("file", file);
					$scope.fd.push(form)
					$scope.fileValid.push(true);
				} else {
					$scope.fileEmpty = true;
				}
			}
			}
			if($scope.fileValid.length==$scope.fd.length){
				$scope.fileValid=true
			}
			else{
				$scope.fileValid=false
			}
			$scope.$apply();
		};

		$scope.uploadBill = async function () {
			$scope.uploading = true;
			let promises = $scope.fd.map(file=>{
			return paldiService.bills.uploadBill(selectedOrderId, file).then(
				function (data) {
					
					console.log("AAAAA")
					swal({
						title: "Factura subida",
						text: "Se cargó la factura correctamente",
						type: "success",
						confirmButtonText: "Aceptar",
					});
					$timeout(function () {
						drawTable();
					}, 1500);
				},
				function (error) {
					
					
					
					swal({
						title: "Error",
						text: "Favor de revisar que el formato de la factura sea el correcto",
						type: "error",
						confirmButtonText: "Aceptar",
					});
					// console.log(error);
				}
			);
			})
			let res = await Promise.all(promises)
			console.log(res,promises)
			$scope.dialog.close()
			$scope.fd=null
			$scope.uploading=false
			selectedOrderId=false
		};

		$scope.needsBill = function (orderId) {
			swal(
				{
					title: "¿Seguro que deseas marcar la orden como No necesita Factura?",
					type: "warning",
					showCancelButton: true,
					confirmButtonColor: "#DD6B55",
					confirmButtonText: "Aceptar",
					cancelButtonText: "Cancelar",
					closeOnConfirm: false,
					closeOnCancel: false,
				},
				function (isConfirm) {
					if (isConfirm) {
						paldiService.bills.needsBill(orderId, "false").then(
							function (order) {
								swal({
									title: "Orden marcada como No necesita factura",
									type: "success",
									confirmButtonText: "Aceptar",
								});
								$timeout(function () {
									var searchRow = Array.from(
										document.querySelectorAll("a")
									).find(function (searchRow) {
										if (order.orderParent) {
											return (
												searchRow.textContent ===
												order.orderNo +
													"-" +
													order.suborderNo
											);
										} else {
											return (
												searchRow.textContent ===
												order.orderNo.toString()
											);
										}
									});
									searchRow.parentElement.parentElement.remove();
								}, 1500);
							},
							function (error) {
								// console.log(error);
							}
						);
					} else {
						swal({
							title: "Cancelado",
							type: "error",
							confirmButtonText: "Aceptar",
						});
					}
				}
			);
		};

		var drawTable = function () {
			var datatable = $("#bills-table").dataTable().api();
			datatable.draw();
		};

		//================================================================

		var typeChange = function () {
			cleanStatusList = [];
			angular.forEach($scope.statusList, function (status) {
				cleanStatusList.push(status.id);
			});
			$rootScope.billsList = $scope.statusList;
			drawTable();
			$scope.ready = true;
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
			checkAll: "Seleccionar Todos",
			uncheckAll: "Deseleccionar Todos",
			buttonDefaultText: "Estados de Orden",
		};

		var fillStatusList = function (list) {
			angular.forEach(list, function (status) {
				$scope.availableStatusList.push({
					label: $scope.pretty("orderStatus", status),
					value: status,
				});
			});
			$timeout(function () {
				$scope.statusList = $rootScope.billsList;
				$scope.ready = true;
			}, 200);
		};

		//========================== DATEPICKER ====================

		/*$scope.startDate = moment().startOf('month').toDate();
    $scope.endDate = moment().endOf('day').toDate();*/

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
			drawTable();
		};

		$scope.endDateChange = function () {
			if ($scope.endDate) {
				$scope.endDate = moment($scope.endDate).endOf("day").toDate();
			}
			drawTable();
		};
		//====================================================
		fillStatusList(billsStatusList);
	}
);
