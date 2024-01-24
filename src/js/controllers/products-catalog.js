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

		// $scope.selectFile = function (files) {
		// 	$scope.fd2 = {
		// 		file: files[0],
		// 		name: files[0].name,
		// 		userId: $rootScope.currentUser.id,
		// 		userName:
		// 			$rootScope.currentUser.name +
		// 			" " +
		// 			$rootScope.currentUser.lastName,
		// 	};
		// 	$scope.fd = new FormData();

		// 	// console.log("[DEBUG] FILE : ", files[0]);

		// 	$scope.fd.append("file", files[0]);
		// 	$scope.fd.append("name", files[0].name);
		// 	$scope.fd.append("userId", $rootScope.currentUser.id);

		// 	// console.log("[DEBUG] USER : ", $rootScope.currentUser);

		// 	$scope.fd.append(
		// 		"userName",
		// 		$rootScope.currentUser.name +
		// 			" " +
		// 			$rootScope.currentUser.lastName
		// 	);
		// 	// console.log("[DEBUG] CATALOG FD1 : ", $scope.fd);
		// 	// console.log($scope.fd.has("file"));
		// 	// console.log($scope.fd.get('file'));
		// 	$scope.fileValid = true;
		// 	$scope.$apply();
		// };
		$scope.selectFile = function (files) {
			var reader = new FileReader();
		
			reader.onload = function (e) {
				var base64 = e.target.result;
				$scope.fd2 = {
					fileBase64: base64,
					name: files[0].name,
					userId: $rootScope.currentUser.id,
					userName: $rootScope.currentUser.name + " " + $rootScope.currentUser.lastName,
				};
		
				$scope.fileValid = true;
				$scope.$apply();
			};
		
			reader.readAsDataURL(files[0]);
		};
		
		// $scope.uploadCatalog = function () {

		// 	console.log("[DEBUG] CATALOG FD1 : ", $scope.fd);
		// 	console.log("[DEBUG] CATALOG FD2: ", $scope.fd2);

		// 	$scope.uploading = true;
		// 	paldiService.catalog.upload($scope.fd2).then(
		// 		(data) => {
		// 			$scope.uploading = false;
		// 			$scope.fd = null;
		// 			$scope.fd2 = null;
		// 			$scope.dialog.close();
		// 			swal({
		// 				title: "Catálogo subido",
		// 				text: "Se cargó el catálogo correctamente",
		// 				type: "success",
		// 				showConfirmButton: false,
		// 				timer: 1000,
		// 			});
		// 			$timeout(function () {
		// 				init();
		// 			}, 1000);
		// 		},
		// 		(error) => {
		// 			$scope.uploading = false;
		// 			$scope.fd = null;
		// 			$scope.dialog.close();
		// 			init();
		// 			swal({
		// 				title: "Error",
		// 				text: "Favor de revisar que el formato del archivo sea el correcto",
		// 				type: "error",
		// 				confirmButtonText: "Aceptar",
		// 			});
					
		// 		}
		// 	);
		// };
		$scope.uploadCatalog = function () {
			console.log("[DEBUG] CATALOG FD2: ", $scope.fd2);
		
			if (!$scope.fd2 || !$scope.fd2.fileBase64) {
				swal({
					title: "Error",
					text: "No se ha seleccionado ningún archivo",
					type: "error",
					confirmButtonText: "Aceptar",
				});
				return;
			}
		
			$scope.uploading = true;
		
			paldiService.catalog.upload($scope.fd2)
				.then(
					(data) => {
						$scope.uploading = false;
						// Limpiar los datos del formulario
						$scope.fd2 = null;
						$scope.dialog.close();
						
						swal({
							title: "Catálogo subido",
							text: "Se cargó el catálogo correctamente",
							type: "success",
							showConfirmButton: false,
							timer: 1000,
						});
		
						$timeout(() => {
							init(); // Reinicializar para reflejar cambios
						}, 1000);
					},
					(error) => {
						$scope.uploading = false;
						$scope.fd2 = null;
						$scope.dialog.close();
						
						swal({
							title: "Error",
							text: "Hubo un problema al subir el archivo. Por favor, inténtelo de nuevo.",
							type: "error",
							confirmButtonText: "Aceptar",
						});
					}
				)
				.finally(() => {
					console.log("ARCHIVO CARGADO CON EXITO")
				});
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
		$scope.downloadFile = (url, name) => {
			if (!url || !name) {
				console.error('URL or file name is missing for download');
				return;
			}
			const link = document.createElement("a");
			link.href = url;
			link.setAttribute("download", name);
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link); // Opcional: remover el link después de hacer click
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
						data.url +
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
