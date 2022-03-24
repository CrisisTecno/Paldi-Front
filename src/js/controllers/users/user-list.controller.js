import { pdApp } from "../index";

pdApp.controller(
	"UserListCtrl",
	function (
		$rootScope,
		$state,
		$scope,
		$compile,
		$timeout,
		paldiService,
		DTOptionsBuilder,
		DTColumnDefBuilder,
		DTColumnBuilder
	) {
		$timeout(function () {
			if (!$scope.currentUser.canAdmin) {
				
				$state.go("console.quote-list");
			}
		}, 200);

		//============= Data tables =============
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

			if (sear) {
				paldiService.users
					.search(page, size, sort, sear)
					.then(function (data) {
						processResult(data, fnCallback);
					});
			} else {
				paldiService.users.list(page, size, sort).then(function (data) {
					processResult(data, fnCallback);
				});
			}
		};

		$scope.tableOptions = DTOptionsBuilder.newOptions()
			.withLanguageSource("lang/table_lang.json")
			.withFnServerData(serverData)
			.withOption("processing", true)
			.withOption("serverSide", true)
			.withDisplayLength(20)
			.withDOM("ftp")
			.withOption("createdRow", createdRow);

		$scope.tableColumns = [
			DTColumnBuilder.newColumn(null)
				.withOption("name", "name")
				.withTitle("Nombre")
				.renderWith(function (data) {
					return (
						'<a href="#/console/user/' +
						data.id +
						'">' +
						data.name +
						" " +
						data.lastName +
						"</a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "email")
				.withTitle("E-mail")
				.renderWith(function (data) {
					return data.email;
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("role", "role")
				.withTitle("Rol")
				.renderWith(function (data) {
					return $rootScope.pretty("userRole", data.role);
				}),
		];
		//---------------------------------------------------
	}
);
