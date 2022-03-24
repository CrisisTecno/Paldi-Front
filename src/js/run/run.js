import {pdApp} from "../../pdApp"
import {globals} from "../../index"

pdApp.run(function (
  $rootScope,
  $state,
  $stateParams,
  paldiService,
  yokozuna,
  prettyHelper,
  permissionsHelper,
  colorPriceService,
) {
  $rootScope.$state = $state
  $rootScope.$stateParams = $stateParams
  $rootScope.currentVersion = globals.version

  function loadUser(user) {
    
    if (EXECUTION_ENV === "INTERNAL") {
      $rootScope.currentUser = user
      // paldiService.users
      //   .get($rootScope.currentUser.id)
      //   .then(function (currentUser) {
      //     currentUser.passwordReset
      //   })

      $rootScope.currentUser.canAdmin =
        user.role == "ADMIN" || user.role == "SUPERADMIN"
      $rootScope.currentUser.canManage =
        user.role == "MANAGER" ||
        user.role == "INSTALLATION_MANAGER" ||
        user.role == "SALES_MANAGER"
    } else {
   
      $rootScope.currentUser = user
    }
  }

  $rootScope.updateBankRate= ()=>{

    colorPriceService.getBankExchangeRate().then((data)=>{

      $rootScope.bankRate = data[0]
      
    })
  }

  var isLogged = function () {
    paldiService.users.whoAmI().then(
      function (user) {
        
        loadUser(user)
        colorPriceService.getExchangeRate().then(function (rate) {
          $rootScope.currentExchangeRate = rate
        })
        if (EXECUTION_ENV=="INTERNAL"){

        $rootScope.updateBankRate()
        }
        

        if ($rootScope.currentUser.reset) {
          $state.go("console.change-password")
        }

        $rootScope.orderStatusList = []
        permissionsHelper
          .getStatusList(user.role)
          .forEach(function (status) {
            $rootScope.orderStatusList.push({id: status})
          })

        $rootScope.quoteStatusList = []
        permissionsHelper
          .getStatusList("QUOTE")
          .forEach(function (status) {
            console.log(status)
            $rootScope.quoteStatusList.push({id: status})
          })

        //========== Movements status lists
        // ==================================================
        var inStatusList = [
          "LINE",
          "BACKORDER",
          "PRODUCTION",
          "TRANSIT",
          "FINISHED",
          "PROGRAMMED",
          "INSTALLED",
          "INSTALLED_INCOMPLETE",
          "INSTALLED_NONCONFORM",
        ]
        var outStatusList = [
          "INSTALLED",
          "INSTALLED_INCOMPLETE",
          "INSTALLED_NONCONFORM",
        ]
        var invStatusList = ["PROGRAMMED", "FINISHED"]

        $rootScope.movementsInList = []
        inStatusList.forEach(function (status) {
          $rootScope.movementsInList.push({id: status})
        })

        $rootScope.movementsOutList = []
        outStatusList.forEach(function (status) {
          $rootScope.movementsOutList.push({id: status})
        })

        $rootScope.movementsInvList = []
        invStatusList.forEach(function (status) {
          $rootScope.movementsInvList.push({id: status})
        })
        //============= Bills status list
        // ====================================================
        var billsStatusList = [
          "LINE",
          "BACKORDER",
          "PRODUCTION",
          "TRANSIT",
          "FINISHED",
          "PROGRAMMED",
          "INSTALLED",
          "INSTALLED_INCOMPLETE",
          "INSTALLED_NONCONFORM",
        ]

        $rootScope.billsList = []
        billsStatusList.forEach(function (status) {
          $rootScope.billsList.push({id: status})
        })
      },
      function () {
        if (!$rootScope.currentUser) {
          $state.go("access.login")
        }
      },
    )
  }

  $rootScope.$on("user:mightBeAvailable", function () {
    if (yokozuna.isLogged()) {
      isLogged()
    }
  })
  $rootScope.$on("user:mightNotBeAvailable", function () {
    if (!yokozuna.isLogged()) {
      $rootScope.currentUser = undefined
      $state.go("access.login")
    }
  })
  $rootScope.$emit("user:mightBeAvailable")
  $rootScope.$on("$stateChangeStart", function (e, toState) {
    if (toState.name != "console.change-password") {
      if (yokozuna.isLogged() && $rootScope.currentUser) {
        if ($rootScope.currentUser.reset) {
          $rootScope.$emit("user:mightBeAvailable")
        }
      }
    }
  })

  $rootScope.pretty = function (type, ugly) {
    if (type === "clientType") {
      return prettyHelper.getClientType(ugly)
    }if (type === "clientTypeEN") {
        return prettyHelper.getClientTypeEN(ugly)
    } else if (type === "reverseOrderStatus") {
      return prettyHelper.getReverseOrderStatus(ugly)
    } else if (type === "orderStatus") {
      return prettyHelper.getOrderStatus(ugly)
    } else if (type==="orderStatusEn"){
      return prettyHelper.getOrderStatusEn(ugly)
    } else if (type === "plusPriceType") {
      return prettyHelper.getPlusPriceType(ugly)
    } else if (type === "userRole") {
      return prettyHelper.getUserRole(ugly)
    } else if (type === "movementType") {
      return prettyHelper.getMovementType(ugly)
    } else if (type === "color") {
      return prettyHelper.getColor(ugly)
    } else if (type === "productType") {
      return prettyHelper.getProductType(ugly)
    } else if (type === "event") {
      return prettyHelper.getEvent(ugly)
    } else if (type === "eventEn") {
      return prettyHelper.getEventEn(ugly)
    } else if (type === "month") {
      return prettyHelper.getMonth(ugly)
    } else if (type === "plusStatus") {
      return prettyHelper.getPlusStatus(ugly)
    } else if (type === "plusLabel") {
      return prettyHelper.getPlusLabel(ugly)
    } else if (type === "singularForm") {
      return prettyHelper.getSingularForm(ugly)
    } else if (type === "pluralForm") {
      return prettyHelper.getPluralLabel(ugly)
    }
    return ugly
  }
})
