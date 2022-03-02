import { pdApp } from "./index";

pdApp.controller(
	"ProductsCatalogCtrl",
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
		$timeout(() => {
			if (!$scope.currentUser.role == "SUPERADMIN") {
				$state.go("console.quote-list");
			}
		}, 200);

		// ============= Load catalog ============= //
		$scope.loadCatalog = () => {
			$scope.dialog = ngDialog.open({
				scope: $scope,
				template: "partials/modals/upload-catalog-file.html",
				showClose: false,
			});
		};

		$scope.selectFile = function (files) {
			$scope.fd = new FormData();
			$scope.fd.append("file", files[0]);
			$scope.fd.append("userId", $rootScope.currentUser.id);
			$scope.fd.append(
				"userName",
				$rootScope.currentUser.name +
					" " +
					$rootScope.currentUser.lastName
			);

			$scope.fileValid = true;
			$scope.$apply();
		};

		$scope.uploadCatalog = function () {
			$scope.uploading = true;
			paldiService.catalog.upload($scope.fd).then(
				(data) => {
					$scope.uploading = false;
					$scope.fd = null;
					$scope.dialog.close();

					swal({
						title: "Catálogo subido",
						text: "Se cargó el catálogo correctamente",
						type: "success",
						showConfirmButton: false,
						timer: 1000,
					});
					$timeout(function () {
						init();
					}, 1000);
				},
				(error) => {
					$scope.uploading = false;
					$scope.fd = null;
					$scope.dialog.close();
					init();

					swal({
						title: "Error",
						text: "Favor de revisar que el formato del archivo sea el correcto",
						type: "error",
						confirmButtonText: "Aceptar",
					});
					// //console.log(error);
				}
			);
		};

		function init() {
			$scope.canUpload = false;
			checkStatus();
			drawTable();
		}

		function checkStatus() {
			paldiService.catalog.getStatus().then((status) => {
				if (status != "UPLOADED") {
					$scope.canUpload = true;
					drawTable();
				} else {
					$timeout(() => {
						checkStatus();
					}, 20000);
				}
			});
		}

		// ============= Download File ============= //
		$scope.downloadFile = (id, name) => {
			paldiService.catalog.getFile(id).then((file) => {
				const url = window.URL.createObjectURL(new Blob([file]));
				const link = document.createElement("a");
				link.href = url;
				link.setAttribute("download", name);
				document.body.appendChild(link);
				link.click();
			});
		};

		// ============= Data tables ============= //
		var drawTable = () => {
			var datatable = $("#products-catalog-table").dataTable().api();
			datatable.draw();
		};

		$scope.dtInstanceCallback = function (instance) {
			$scope.dtInstance = instance;
		};

		function createdRow(row, data, dataIndex) {
			$compile(angular.element(row).contents())($scope);
		}

		var serverData = function (sSource, aoData, fnCallback, oSettings) {
			var sear = aoData[5].value.value;
			var draw = aoData[0].value;
			var sort =
				aoData[1].value[aoData[2].value[0].column].name +
				"," +
				aoData[2].value[0].dir;
			var size = aoData[4].value;
			var page = aoData[3].value / size;

			var processResult = function (data, fnCallback) {
				var result = {
					draw: draw,
					recordsTotal: data.numberOfElements,
					recordsFiltered: data.totalElements,
					data: data.content,
				};
				fnCallback(result);
			};

			paldiService.catalog.getAll(page, size, sort).then((data) => {
				processResult(data, fnCallback);
			});
		};

		$scope.tableOptions = DTOptionsBuilder.newOptions()
			.withLanguageSource("lang/table_lang.json")
			.withFnServerData(serverData)
			.withOption("processing", true)
			.withOption("serverSide", true)
			.withOption("order", [[1, "desc"]])
			.withDOM("tp")
			.withOption("createdRow", createdRow)
			.withDisplayLength(20);

		$scope.tableColumns = [
			DTColumnBuilder.newColumn(null)
				.withOption("name", "name")
				.withTitle("Nombre")
				.notSortable()
				.renderWith((data) => {
					return data.name;
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "date")
				.withTitle("Fecha")
				.renderWith((data) => {
					return $filter("date")(data.date);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "date")
				.withTitle("Hora")
				.renderWith((data) => {
					return $filter("date")(data.date, "HH:mm:ss");
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "userName")
				.withTitle("Usuario")
				.notSortable()
				.renderWith((data) => {
					return data.userName;
				}),

			DTColumnBuilder.newColumn(null)
				.withOption("name", "catalogStatus")
				.withTitle("Estado")
				.notSortable()
				.renderWith((data) => {
					return $filter("catalogStatus")(data.status);
				}),

			DTColumnBuilder.newColumn(null)
				.withOption("name", "action")
				.withTitle("Accion")
				.notSortable()
				.renderWith((data) => {
					return (
						"<a ng-click=\"downloadFile('" +
						data.id +
						"', '" +
						data.name +
						"')\">Descargar<a>"
					);
				}),
		];

		// ============= Init ============= //
		$scope.ready = false;
		init();
		$scope.ready = true;
	}
);
