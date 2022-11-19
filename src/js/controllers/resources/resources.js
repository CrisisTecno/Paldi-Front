import { showSwal } from "../../utils/swal/show";
import { pdApp } from "../index";

pdApp.controller(
	"ResourcesCtrl",
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
        

		// ============= Load catalog ============= //
		$scope.loadResource = () => {
			$scope.dialog = ngDialog.open({
				scope: $scope,
				template: "partials/modals/upload-resource-file.html",
				showClose: false,
			});
		};

		

		$scope.selectFile = function (files) {
			$scope.fd = new FormData();
			$scope.fd.append("document", files[0]);


			$scope.fileValid = true;
			$scope.$apply();
		};

		$scope.uploadResource = function (name,description) {
			$scope.fd.append('name',name)
            $scope.fd.append('description',description)
            $scope.fd.append('uploader',$scope.currentUser.id)
            $scope.fd.append('uploaderName',$scope.currentUser.name +' '+ $scope.currentUser.lastName)
            $scope.dialog.close();
			swal({
                title: 'Uploading File',
                showCancelButton: false, // There won't be any cancel button
				showConfirmButton: false,
                allowOutsideClick: false,
               	imageUrl:"img/spinner.gif"
            });
            paldiService.resources.postResource($scope.fd).then(response=>{
				swal.close()
				$timeout(function()
				{
                if(response.code && response.code=="query.success"){
                    showSwal('messages.resources.upload.success')
					$timeout(function () {
						init();
					}, 1000);

                }
                else{
                    showSwal('messages.resources.upload.error')
                    $timeout(function () {
						init();
					}, 1000);
                }

                init();
			},500)
            })

            $scope.fd = null



		};

		function init() {
			$scope.canUpload = true;

			drawTable();
		}

		$scope.deleteFile = function(id){
			paldiService.resources.deleteFile(id).then((file) => {
                
                if(file.code=='query.success'){
                    showSwal('messages.resources.erase.success')
                    $timeout(function () {
						init();
					}, 1000);
                    return
                }
                showSwal('messages.resources.upload.error')
                $timeout(function () {
                    init();
                }, 1000);

			});
            init()
		};

		// ============= Download File ============= //
		$scope.downloadFile = (id, name) => {
            //// console.log("STST",id,name)
			paldiService.resources.downloadFile(id).then((file) => {
               
                if(file.code){
                    showSwal('messages.resources.retrieve.fail')
                    return
                }
                //let buffer = new Uint8Array(file)
               // const url = window.URL.createObjectURL(file);
				const link = document.createElement("a");
				if(EXECUTION_ENV=="EXTERNAL"){
				file= file.replace('api2','api')
				}
				link.href = file;
				link.setAttribute("download", name);
				document.body.appendChild(link);
				link.click()

			});
		};

		// ============= Data tables ============= //
		var drawTable = () => {
			var datatable = $("#resources-table").dataTable().api();
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
					recordsTotal: data.totalPages * size,
					recordsFiltered: data.totalPages * size,
					data: data.records,
				};
               
				fnCallback(result);
			};
            
			paldiService.resources.getResources(page, size, sear).then((data) => {
                
				processResult(data, fnCallback);
			});
		};

		$scope.tableOptions = DTOptionsBuilder.newOptions()
			.withLanguageSource(EXECUTION_ENV=="EXTERNAL"?"lang/table_lang_en.json":"lang/table_lang.json")
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
				.withTitle(EXECUTION_ENV!="EXTERNAL"?"Nombre":"Name")
				.notSortable()
				.renderWith((data) => {
					return data.originalName;
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "date")
				.withTitle(EXECUTION_ENV!="EXTERNAL"?"Fecha":"Date")
				.renderWith((data) => {
					return $filter("date")(dateFromObjectId(data._id));
				}),
			DTColumnBuilder.newColumn(null)
				.withOption("name", "userName")
				.withTitle(EXECUTION_ENV!="EXTERNAL"?"Usuario":"User")
				.notSortable()
				.renderWith((data) => {
					return data.uploaderName;
				}),

			DTColumnBuilder.newColumn(null)
				.withOption("name", "catalogStatus")
				.withTitle(EXECUTION_ENV!="EXTERNAL"?"Descripción":"Description")
				.notSortable()
				.renderWith((data) => {
					return data.description;
				}),

			DTColumnBuilder.newColumn(null)
				.withOption("name", "action")
				.withTitle(EXECUTION_ENV!="EXTERNAL"?"Accion":"Action")
				.notSortable()
				.renderWith((data) => {
					return (
						"<a  ng-click=\"downloadFile('"  +
                        data._id +"' , '" + data.originalName +".pdf"
						+ "')\">Download<a>    " 
					);
				}),
			$scope.currentUser.role=="ADMIN" || $scope.currentUser.role=="SUPERADMIN"|| $scope.currentUser.role=="SALES_MANAGER"?
			DTColumnBuilder.newColumn(null)
				.withOption("name", "action")
				.notSortable()
				.renderWith((data) => {
					return (
						
                        "<a ng-click=\"deleteFile('"  +
                        data._id
						+ "')\">Delete<a>"
					);
				}):DTColumnBuilder.newColumn(null)
				.withOption("name", "action")
				.notSortable()
				.renderWith((data) => {
					return ("")})

		];

		// ============= Init ============= //
		$scope.ready = false;
		init();
		$scope.ready = true;
	}
);

var objectIdFromDate = function (date) {
	return Math.floor(date.getTime() / 1000).toString(16) + "0000000000000000";
};

var dateFromObjectId = function (objectId) {
	return new Date(parseInt(objectId.substring(0, 8), 16) * 1000);
};