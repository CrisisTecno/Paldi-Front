import {globals, pdApp} from "./index"
import {
  swalUserCreateDuplicatedEmailFactory, swalUserCreateSuccess,
} from "../utils/swals/userCreate"
import {swalErrorFactory} from "../utils/swals/generic"

pdApp.controller("UserNewCtrl", function ($scope,
  $rootScope,
  $state,
  $timeout,
  paldiService,
  inventoryDataService,
  userDataService,
) {
  $timeout(function () {
    if (!$scope.currentUser.canAdmin) {
      $state.go("console.quote-list")
    }
  }, 200)

  $scope.save = function (form, user) {
    if (!form.$valid || !$scope.passwordIsValid) {
      form.$validated = true
      return
    }

    userDataService
      .saveUser(user)
      .then((user) => {
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

  $scope.checkPassword = function checkPassword(str) {
    // al menos un número, una mayúscula y una minúscula, 8 caracteres mínimo
    // solo letras y números
    var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!()-._`~@])[0-9a-zA-Z!()-._`~@]{8,}$/
    $scope.passwordIsValid = re.test(str)
  }

  var init = function () {
    inventoryDataService.getWarehouses().then(function (data) {
      $scope.warehouses = data
      $scope.warehouses.splice(0, 0, {name: "", id: ""})
      $scope.user = {warehouseId: ""}
    })
  }

  $scope.roles = globals.roles
  init()
})
