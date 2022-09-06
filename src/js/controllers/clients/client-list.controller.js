import { pdApp } from "../index";
pdApp.controller(
	"ClientListCtrl",
	function (
		$scope,
		$rootScope,
		$compile,
		paldiService,
		DTOptionsBuilder,
		DTColumnDefBuilder,
		DTColumnBuilder
	) {
		

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
				//console.log(typeof(data.content))
				fnCallback(result);
			};

			if (sear) {
				
				paldiService.clients
					.search(page, size, sort, sear,$scope.currentUser)
					.then(function (data) {
						processResult(data, fnCallback);
					});
			} else {
				paldiService.clients
					.list(page, size, sort,$scope.currentUser)
					.then(function (data) {
						processResult(data, fnCallback);
					});
			}
		};

		
		$scope.tableOptions = DTOptionsBuilder.newOptions()
			.withLanguageSource(EXECUTION_ENV!="EXTERNAL"?"lang/table_lang.json":"lang/table_lang_en.json")
			.withFnServerData(serverData)
			.withOption("processing", true)
			.withOption("serverSide", true)
			.withDisplayLength(20)
			.withDOM("ftp")
			.withOption("createdRow", createdRow);

		$scope.tableColumns = [
			DTColumnBuilder.newColumn(null)
				.withOption("name", "name")
				.withTitle(EXECUTION_ENV!="EXTERNAL"?"Nombre":"Name")
				.renderWith(function (data) {
					
					return (
						'<a href="#/console/client/' +
						(EXECUTION_ENV!="EXTERNAL"?data.id:data._id) +
						'">' +
						data.name +
						" " +
						data.lastName +
						"</a>"
					);
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "type")
				.withTitle(EXECUTION_ENV!="EXTERNAL"?"Tipo de Cliente":"Client Type")
				.renderWith(function (data) {
					return EXECUTION_ENV!="EXTERNAL"? $rootScope.pretty("clientType", data.type) : $rootScope.pretty("clientTypeEN", data.type) ;
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "email")
				.withTitle("E-mail")
				.renderWith(function (data) {
					return data.email;
				}),
		];
		//---------------------------------------------------
	}
);
