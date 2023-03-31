import { pdApp } from "../index";
import {swalErrorFactory} from "../../utils/swals/generic"

pdApp.controller(
	"UserDetailsCtrl",
	function (
		$scope,
		$rootScope,
		$state,
		ngDialog,
		$timeout,
		$stateParams,
		paldiService
	) {
		$scope.loadUser = function () {
			$scope.step = "loading";
			var id = $stateParams.userId;
			
			$timeout(function () {
				if (!$scope.currentUser.canAdmin) {
					$state.go("console.quote-list");
				}
				$scope.sameUser = id == $scope.currentUser.id;
			}, 200);

			paldiService.users.get(id).then(
				function (user) {
					if(user.realRole){
						user.role =user.realRole
					}
					paldiService.users.getProviderProducts(id).then(res=>{
						
						if(Object.keys(res).includes('user'))delete res['user']
						if(Object.keys(res).includes('_id'))delete res['_id']
						$scope.assignedProducts = res
					  })
					

					$scope.user = user;
					$scope.user.warehouseId = user.warehouse
						? user.warehouse.id
						: "";
					$scope.step = user ? "loaded" : "empty";
				},
				function (error) {
					$scope.step = "empty";
					
				}
			);
		};

		$scope.loadUser();
		

		//================= ACTIONS =================
		$scope.edit = function (form, user) {
			if (form.$valid) {
				paldiService.users.update(user).then(
					function (user) {
						swal({
							title: "Usuario modificado exitosamente",
							type: "success",
							confirmButtonText: "Aceptar",
						});

						$state.go("console.user-list");
					},
					function (error) {
						
					}
				);
			} else {
				form.$validated = true;
			}
		};

		$scope.delete = function () {
			swal(
				{
					title: "¿Seguro que deseas eliminar al usuario?",
					type: "warning",
					showCancelButton: true,
					confirmButtonColor: "#DD6B55",
					confirmButtonText: "Eliminar",
					cancelButtonText: "Cancelar",
					closeOnConfirm: false,
					closeOnCancel: false,
				},
				function (isConfirm) {
					if (isConfirm) {
						paldiService.users.delete($scope.user.id).then(
							function (user) {
								swal({
									title: "Usuario borrado exitosamente",
									type: "success",
									confirmButtonText: "Aceptar",
								});
								$state.go("console.user-list");
							},
							function (error) {
								$scope.step = "empty";
								
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

		$scope.providerProducts = {
			"Enrollable":[
			  "Cascade","Triple Shade","Horizontales de Madera","Enrollables","Romanas","Eclisse","Verticales de PVC","Horizontales de Aluminio","Celular","Enrollables Wolken"
			],
			"Cortina":[
			  "Plitz Frances", "Ondulada"
			],
			"Balance":
			[
			  "Wrapped Cornice","Aluminum Gallery"
			],
			"Toldo":[
			  "Capri","Select","Pergola","Pergolato","Arion"
			],
			"Filtrasol":['Filtrasol Eclisse',"Filtrasol Enrollables","Filtrasol Panel Deslizante", "Filtrasol Triple Shade"]
		  }
		
		  $scope.providerSelectionList ={}
		  for (const [key,value] of Object.entries($scope.providerProducts)){
			
			$scope.providerSelectionList[key]= Object.assign({},...value.map(x=>({[x]:false})))
		  }
		
		  
		  
		  $scope.assignedProducts = {
			"Enrollable":[],
			"Cortina":[],
			"Balance":[],
			"Toldo":[],
			"Filtrasol":[]
		  }
		  
		 
		
		  $scope.toggleProduct = function(type,product){
			$scope.providerSelectionList[type][product]=!$scope.providerSelectionList[type][product]
		  }
		
		  $scope.assignProductsDialog = function(){
			
			$scope.resetProducts()
			$scope.dialog = ngDialog.open({
			  template:"js/controllers/users/provider-products.html",
			  scope:$scope,
			  showClose: false
			})
		  }
		
		  $scope.selectProducts = async function(){
			

			for(const [key,value] of Object.entries($scope.providerSelectionList)){
		
			  for (const [prod,accepted] of Object.entries(value)){
				if(accepted===true && !$scope.assignedProducts[key].includes(prod)) $scope.assignedProducts[key].push(prod)
			  }
			}

			if($scope.user.role=="PROVIDER" && !checkProductsAssigned()){

				swal(swalErrorFactory('Debe asignar almenos 1 producto.'))
				return
			  }
			$scope.dialog.close()

			await paldiService.users.updateProviderProducts($scope.assignedProducts,$scope.user.id).then($scope.loadUser())
			

		  }
		
		  $scope.resetProducts = function(){
			for(const [key,value] of Object.entries($scope.providerSelectionList)){
		
			  for (const prod of Object.keys(value)){
				$scope.providerSelectionList[key][prod]=$scope.assignedProducts[key].includes(prod)
			  }
			}
		  }
		  function checkProductsAssigned(){
		   
			return Object.values($scope.assignedProducts).map(x=>x.length).reduce((partialSum, a) => partialSum + a, 0) >0
		  }

		$scope.activate = function () {
			swal(
				{
					title: "¿Seguro que deseas activar al usuario?",
					type: "warning",
					showCancelButton: true,
					confirmButtonColor: "#DD6B55",
					confirmButtonText: "Activar",
					cancelButtonText: "Cancelar",
					closeOnConfirm: false,
					closeOnCancel: false,
				},
				function (isConfirm) {
					if (isConfirm) {
						paldiService.users.activate($scope.user.id).then(
							function (user) {
								$scope.loadUser();
								swal({
									title: "Usuario activado exitosamente",
									type: "success",
									confirmButtonText: "Aceptar",
								});
							},
							function (error) {
								
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

		$scope.deactivate = function () {
			swal(
				{
					title: "¿Seguro que deseas desactivar al usuario?",
					type: "warning",
					showCancelButton: true,
					confirmButtonColor: "#DD6B55",
					confirmButtonText: "Desactivar",
					cancelButtonText: "Cancelar",
					closeOnConfirm: false,
					closeOnCancel: false,
				},
				function (isConfirm) {
					if (isConfirm) {
						paldiService.users.deactivate($scope.user.id).then(
							function (user) {
								$scope.loadUser();
								swal({
									title: "Usuario desactivado exitosamente",
									type: "success",
									confirmButtonText: "Aceptar",
								});
							},
							function (error) {
								
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

		var init = function () {
			paldiService.warehouses.getList().then(function (data) {
				$scope.warehouses = data;
				$scope.warehouses.splice(0, 0, { name: "", id: "" });
			});
		};

		init();
		
	}
);
