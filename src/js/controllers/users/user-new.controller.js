import {globals, pdApp} from "../index"
import {
  swalUserCreateDuplicatedEmailFactory, swalUserCreateSuccess,
} from "../../utils/swals/userCreate"
import {swalErrorFactory} from "../../utils/swals/generic"

pdApp.controller("UserNewCtrl", function (
  $scope,
  $rootScope,
  $state,
  $timeout,
  paldiService,
  ngDialog,
  inventoryDataService,
  userDataService,
) {
  $scope.save = saveNewUser
  $scope.checkPassword = checkPassword

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

  // console.log($scope.providerSelectionList)
  
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
    // console.log("AAAAAA")
    $scope.resetProducts()
    $scope.dialog = ngDialog.open({
      template:"js/controllers/users/provider-products.html",
      scope:$scope,
      showClose: false
    })
  }

  $scope.selectProducts = function(){
    for(const [key,value] of Object.entries($scope.providerSelectionList)){

      for (const [prod,accepted] of Object.entries(value)){
        if(accepted===true && !$scope.assignedProducts[key].includes(prod)) $scope.assignedProducts[key].push(prod)
      }
    }
    $scope.dialog.close()
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


  $timeout(function () {
    if (!$scope.currentUser.canAdmin) {
      $state.go("console.quote-list")
    }
  }, 200)
  init()

$scope.changeStatus= function(value){
 value = !value
}

  function checkPassword(str) {
    // al menos un número, una mayúscula y una minúscula, 8 caracteres mínimo
    // solo letras y números
    var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!()-._`~@])[0-9a-zA-Z!()-._`~@]{8,}$/
    $scope.passwordIsValid = re.test(str)
  }

  function saveNewUser(form, user) {
    
    
    if (!form.$valid || !$scope.passwordIsValid) {
      form.$validated = true
      return
    }
    if(user.role!="PROVIDER" && user.subtype){
      delete user['subtype']
    }
    
    if(user.role=="PROVIDER" && !checkProductsAssigned()){

      swal(swalErrorFactory('Debe asignar almenos 1 producto.'))
      return
    }

    userDataService
      .saveUser(user)
      .then(async (user) => {
        await paldiService.users.setProviderProducts($scope.assignedProducts,user.id)
        swal(swalUserCreateSuccess)
        $state.go("console.user-list")
      })
      .catch((code, error) => {
        switch (code) {
          case "duplicatedEmail":
            swal(swalUserCreateDuplicatedEmailFactory(user))
            break
          default:
            swal(swalErrorFactory(error?.status ?? error))
        }
        form.$validated = true
      })
  }

  function init() {
    $scope.roles = globals.roles
    // console.log($scope.roles)
    if(EXECUTION_ENV=="INTERNAL") delete $scope.roles["7"]
    inventoryDataService.getWarehouses().then(function (data) {
      $scope.warehouses = data
      $scope.warehouses.splice(0, 0, {name: "", id: ""})
      $scope.user = {warehouseId: ""}
    })
  }




})
