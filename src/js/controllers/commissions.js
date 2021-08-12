import { pdApp } from "./index";

pdApp.controller(
	"CommissionsCtrl",
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
		DTColumnBuilder
	) {
		$timeout(function () {
			if (
				!$scope.currentUser.canAdmin &&
				$scope.currentUser.role !== "SALES_MANAGER" &&
				$scope.currentUser.role !== "CONSULTANT"
			) {
				$state.go("console.quote-list");
			} else {
				if ($scope.currentUser.role === "CONSULTANT") {
					$scope.seller = $scope.currentUser.id;
					paldiService.users.get($scope.seller).then(function (user) {
						$scope.sellerName = user.name + " " + user.lastName;
						$scope.minimumSale = user.minimumSale;
						$scope.downloadLink =
							paldiService.commissions.getDownloadLink(
								$scope.seller,
								start.toJSON(),
								end.toJSON(),
								"Comisiones_" +
									$scope.sellerName +
									"_" +
									$scope.currentLabel
							);
						if ($scope.ready) {
							drawCommissionsTable();
						}
					});
				}
			}
		}, 200);

		var start;
		var end;
		$scope.addComment = false;
		$scope.comment = "";

		var loadCommissions = function (date) {
			$scope.ready = false;
			$scope.isEmpty = true;
			$scope.month = moment(date).date(1).toDate();
			$scope.past = moment(date).date(1).subtract(1, "months").toDate();
			$scope.next = moment(date).date(1).add(1, "months").toDate();
			$scope.currentLabel =
				$scope.pretty("month", moment($scope.month).format("MMMM")) +
				" - " +
				$scope.month.getFullYear();
			$scope.currentMonth = $scope.pretty(
				"month",
				moment($scope.month).format("MMMM")
			);

			start = moment($scope.month)
				.set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
				.toDate();
			end = moment(start)
				.add(1, "months")
				.subtract(1, "seconds")
				.toDate();
			if ($scope.next > new Date()) {
				$scope.next = null;
			}

			if ($scope.seller) {
				$scope.downloadLink = paldiService.commissions.getDownloadLink(
					$scope.seller,
					start.toJSON(),
					end.toJSON(),
					"Comisiones_" +
						$scope.sellerName +
						"_" +
						$scope.currentLabel
				);
			}

			paldiService.users.getByRole("CONSULTANT").then(function (data) {
				$scope.sellers = data;
				$scope.ready = true;
				loadColumns();
			});
		};

		loadCommissions(new Date());

		$scope.goto = function (date) {
			$scope.closeCommentPopup();
			loadCommissions(date);
		};

		//============= Data tables =============
		function createdRow(row, data, dataIndex) {
			$compile(angular.element(row).contents())($scope);
		}

		//============= Commission - Data table =============
		var serverDataCommissions = function (
			sSource,
			aoData,
			fnCallback,
			oSettings
		) {
			var sear = aoData[5].value.value;
			var draw = aoData[0].value;
			var sortName = aoData[1].value[aoData[2].value[0].column].name;
			var sortDir = aoData[2].value[0].dir;
			var size = aoData[4].value;
			var page = aoData[3].value / size;

			var processResult = function (data, fnCallback) {
				var result = {
					draw: draw,
					recordsTotal: data.length,
					recordsFiltered: data.length,
					data: data,
				};

				$scope.total = 0;
				$scope.payment = 0;
				$scope.commissionPaid = 0;
				$scope.subtotal = 0;
				let orders = [];
				for (var i = 0; i < data.length; i++) {
					$scope.total += data[i].commission;
					if (
						data[i].orderStatus !== "ORDER_CANCELED" &&
						!orders.includes(data[i].orderId)
					) {
						orders.push(data[i].orderId);
						$scope.subtotal += data[i].subTotal;
					}
					$scope.payment += data[i].payment;
					$scope.commissionPaid += data[i].commissionPaid;
				}

				fnCallback(result);
				$scope.commissionsAreEmpty = !result.recordsTotal > 0;
				$scope.isEmpty = !$scope.commissionsAreEmpty ? false : true;
			};

			paldiService.commissions
				.getBySeller($scope.seller, start, end, sortName, sortDir)
				.then(function (data) {
					processResult(data, fnCallback);
				});
		};

		var adminColumns = [
			DTColumnBuilder.newColumn(null)
				.withOption("name", "orderDate")
				.withTitle("Fecha")
				.renderWith(function (data) {
					return (
						'<a href="#/console/order/' +
						data.orderId +
						'">' +
						$filter("date")(data.orderDate, "dd/MM/yyyy") +
						"</a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "orderNo")
				.withTitle("No. de Orden")
				.renderWith(function (data) {
					return (
						'<a href="#/console/order/' +
						data.orderId +
						'">' +
						data.orderNo +
						"</a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "clientName")
				.withTitle("Cliente")
				.renderWith(function (data) {
					var clientName = data.clientName ? data.clientName : " - ";
					return (
						'<a href="#/console/order/' +
						data.orderId +
						'">' +
						clientName +
						"</a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "orderStatus")
				.withTitle("Estado")
				.renderWith(function (data) {
					return (
						'<a href="#/console/order/' +
						data.orderId +
						'" class="status-block ' +
						data.orderStatus +
						'" >' +
						$scope.pretty("orderStatus", data.orderStatus) +
						"</a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "clientType")
				.withTitle("Tipo de Cliente")
				.renderWith(function (data) {
					return (
						'<a href="#/console/order/' +
						data.orderId +
						'">' +
						$scope.pretty("clientType", data.clientType) +
						"</a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "subTotal")
				.withTitle("Subtotal")
				.renderWith(function (data) {
					return (
						'<a href="#/console/order/' +
						data.orderId +
						'">' +
						$filter("currency")(data.subTotal) +
						"</a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "balance")
				.withTitle("Saldo")
				.renderWith(function (data) {
					if (data.balance != null) {
						var balance = data.balance.toFixed(2);
						return (
							'<a href="#/console/order/' +
							data.orderId +
							'">' +
							$filter("currency")(balance) +
							"</a>"
						);
					} else {
						return (
							'<a href="#/console/order/' +
							data.orderId +
							'">' +
							" - " +
							"</a>"
						);
					}
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "payment")
				.withTitle("Pagos")
				.renderWith(function (data) {
					var payment = data.payment ? data.payment : 0;
					return (
						'<a href="#/console/order/' +
						data.orderId +
						'">' +
						$filter("currency")(payment) +
						"</a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "discountPercent")
				.withTitle("% de Descuento")
				.renderWith(function (data) {
					if (data.discountPercent != null) {
						return (
							'<a href="#/console/order/' +
							data.orderId +
							'">' +
							data.discountPercent +
							"%</a>"
						);
					} else {
						return (
							'<a href="#/console/order/' +
							data.orderId +
							'">' +
							" - " +
							"</a>"
						);
					}
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "commissionPercent")
				.withTitle("% de Comisión")
				.renderWith(function (data) {
					return (
						'<a href="#/console/order/' +
						data.orderId +
						'">' +
						data.commissionPercent +
						"%</a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "commission")
				.withTitle("Comisión")
				.renderWith(function (data) {
					return (
						'<a href="#/console/order/' +
						data.orderId +
						'">' +
						$filter("currency")(data.commission) +
						"</a>"
					);
				}),
			DTColumnBuilder.newColumn(null).renderWith(function (data) {
				var id = "&#39;" + data.id + "&#39;";
				var clientType = "&#39;" + data.clientType + "&#39;";
				var button =
					'<button class="btn btn-xs btn-danger" ng-click="changePercentDialog(' +
					id +
					"," +
					clientType +
					"," +
					data.commissionPercent +
					')">Cambiar porcentaje</button>';
				var buttonDisabled =
					'<button disabled class="btn btn-xs btn-danger">Cambiar porcentaje</button>';
				return data.orderStatus && data.orderStatus !== "ORDER_CANCELED"
					? button
					: buttonDisabled;
			}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "addComment")
				.withTitle("Comentarios")
				.renderWith(function (data) {
					return (
						'<div><button class="comment-button fa fa-comment fa-lg" ng-click="showCommentPopup(' +
						data.orderNo +
						"," +
						"'" +
						data.id +
						"'" +
						')"></button></div>'
					);
				}),
		];

		var consultantColumns = [
			DTColumnBuilder.newColumn(null)
				.withOption("name", "orderDate")
				.withTitle("Fecha")
				.renderWith(function (data) {
					return (
						'<a href="#/console/order/' +
						data.orderId +
						'">' +
						$filter("date")(data.orderDate, "dd/MM/yyyy") +
						"</a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "orderNo")
				.withTitle("No. de Orden")
				.renderWith(function (data) {
					return (
						'<a href="#/console/order/' +
						data.orderId +
						'">' +
						data.orderNo +
						"</a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "clientName")
				.withTitle("Cliente")
				.renderWith(function (data) {
					var clientName = data.clientName ? data.clientName : " - ";
					return (
						'<a href="#/console/order/' +
						data.orderId +
						'">' +
						clientName +
						"</a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "orderStatus")
				.withTitle("Estado")
				.renderWith(function (data) {
					return (
						'<a href="#/console/order/' +
						data.orderId +
						'" class="status-block ' +
						data.orderStatus +
						'" >' +
						$scope.pretty("orderStatus", data.orderStatus) +
						"</a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "clientType")
				.withTitle("Tipo de Cliente")
				.renderWith(function (data) {
					return (
						'<a href="#/console/order/' +
						data.orderId +
						'">' +
						$scope.pretty("clientType", data.clientType) +
						"</a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "subTotal")
				.withTitle("Subtotal")
				.renderWith(function (data) {
					return (
						'<a href="#/console/order/' +
						data.orderId +
						'">' +
						$filter("currency")(data.subTotal) +
						"</a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "balance")
				.withTitle("Saldo")
				.renderWith(function (data) {
					if (data.balance != null) {
						var balance = data.balance.toFixed(2);
						return (
							'<a href="#/console/order/' +
							data.orderId +
							'">' +
							$filter("currency")(balance) +
							"</a>"
						);
					} else {
						return (
							'<a href="#/console/order/' +
							data.orderId +
							'">' +
							" - " +
							"</a>"
						);
					}
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "payment")
				.withTitle("Pagos")
				.renderWith(function (data) {
					var payment = data.payment ? data.payment : 0;
					return (
						'<a href="#/console/order/' +
						data.orderId +
						'">' +
						$filter("currency")(payment) +
						"</a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "discountPercent")
				.withTitle("% de Descuento")
				.renderWith(function (data) {
					if (data.discountPercent != null) {
						return (
							'<a href="#/console/order/' +
							data.orderId +
							'">' +
							data.discountPercent +
							"%</a>"
						);
					} else {
						return (
							'<a href="#/console/order/' +
							data.orderId +
							'">' +
							" - " +
							"</a>"
						);
					}
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "commissionPercent")
				.withTitle("% de Comisión")
				.renderWith(function (data) {
					return (
						'<a href="#/console/order/' +
						data.orderId +
						'">' +
						data.commissionPercent +
						"%</a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "commission")
				.withTitle("Comisión")
				.renderWith(function (data) {
					return (
						'<a href="#/console/order/' +
						data.orderId +
						'">' +
						$filter("currency")(data.commission) +
						"</a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "addComment")
				.withTitle("Comentarios")
				.renderWith(function (data) {
					return (
						'<div><button class="comment-button fa fa-comment fa-lg" ng-click="showCommentPopup(' +
						data.orderNo +
						"," +
						"'" +
						data.id +
						"'" +
						')"></button></div>'
					);
				}),
		];

		var loadColumns = function () {
			switch ($scope.currentUser.role) {
				case "ADMIN":
					$scope.tableColumnsCommissions = adminColumns;
					break;
				case "SALES_MANAGER":
					$scope.tableColumnsCommissions = adminColumns;
					break;
				case "SUPERADMIN":
					$scope.tableColumnsCommissions = adminColumns;
					break;
				case "CONSULTANT":
					$scope.tableColumnsCommissions = consultantColumns;
					break;
			}
		};

		//---------------------------------------------------
		$scope.changePercentDialog = function (id, clientType, percent) {
			$scope.maxPercent = getMaxPercent(clientType);
			$scope.newPercent = percent;
			$scope.selectedCommissionId = id;
			$scope.dialog = ngDialog.open({
				scope: $scope,
				template:
					"partials/views/console/change-commission-percent.html",
				showClose: false,
			});
		};

		$scope.changePercent = function (form) {
			if (form.$valid) {
				$scope.dialog.close();
				paldiService.commissions
					.updateCommissionPercent(
						$scope.selectedCommissionId,
						$scope.newPercent
					)
					.then(function (data) {
						swal({
							title: "Porcentaje de comisión cambiado",
							text:
								"Nuevo porcentaje de " +
								$scope.newPercent +
								"%",
							type: "success",
							confirmButtonText: "Aceptar",
						});
						$scope.newPercent = null;
						$scope.selectSeller();
					});
			} else {
				form.$validated = true;
			}
		};

		$scope.percentChanged = function (newPercent) {
			$scope.newPercent = newPercent.toFixed(2);
		};

		var drawCommissionsTable = function () {
			var datatable = $("#commissions-table").dataTable().api();

			$scope.tableOptionsCommissions = DTOptionsBuilder.newOptions()
				.withLanguageSource("lang/table_lang.json")
				.withFnServerData(serverDataCommissions)
				.withOption("processing", true)
				.withOption("serverSide", true)
				.withOption("order", [0, "desc"])
				.withDOM("tp")
				.withOption("createdRow", createdRow);

			datatable.draw();
		};

		$scope.selectSeller = function () {
			$scope.closeCommentPopup();
			paldiService.users.get($scope.seller).then(function (user) {
				if (user.minimumSale) {
					$scope.sellerName = user.name + " " + user.lastName;
					$scope.minimumSale = user.minimumSale;
					$scope.downloadLink =
						paldiService.commissions.getDownloadLink(
							$scope.seller,
							start.toJSON(),
							end.toJSON(),
							"Comisiones_" +
								$scope.sellerName +
								"_" +
								$scope.currentLabel
						);
					if ($scope.ready) {
						drawCommissionsTable();
					}
				} else {
					swal(
						{
							title: "Error al cargar asesor",
							html: true,
							text: "El <b>monto mínimo de venta</b> no ha sido asignado",
							type: "error",
							confirmButtonText: "Asignar",
							showCancelButton: true,
							cancelButtonText: "Cancelar",
						},
						function (result) {
							if (result) {
								$state.go("console.user-details", {
									userId: user.id,
								});
							} else {
								$scope.seller = "";
							}
						}
					);
				}
			});
		};

		$scope.showCommentPopup = function (orderNo, commissionId) {
			$scope.comment = "";
			$scope.comments = [];
			$scope.orderNo = orderNo;
			$scope.commissionId = commissionId;
			$scope.addComment = true;
			paldiService.notes.list(commissionId).then(function (comments) {
				$scope.comments = comments;
			});
		};

		$scope.closeCommentPopup = function () {
			$scope.addComment = false;
			$scope.newComment = {};
			$scope.comment = "";
		};

		$scope.sendComment = function (comment) {
			$scope.newComment = {
				comment: comment,
				userId: $scope.currentUser.id,
				type: "COMMISSION",
				commissionId: $scope.commissionId,
			};
			paldiService.notes.save($scope.newComment).then(function () {
				$scope.showCommentPopup($scope.orderNo, $scope.commissionId);
			});
		};

		var getMaxPercent = function (clientType) {
			switch (clientType) {
				case "DIRECT_SALE":
					return 6;
				case "DISTRIBUTOR_PREMIUM":
					return 4;
				case "DISTRIBUTOR_INDEPENDENT":
					return 4;
				case "PROJECTS":
					return 4;
				case "ARCHITECT_INTERIOR":
					return 4;
			}
		};
	}
);
