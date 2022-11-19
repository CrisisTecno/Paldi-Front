import {pdApp, globals} from "../index"

pdApp.controller(
  "LogInCtrl",
  function (
    $scope,
    $rootScope,
    $state,
    $timeout,
    paldiService,
    yokozuna,
    sessionHelper,
  ) {
    $scope.env = globals.env
    
    $scope.login = function (username, password) {
      $scope.loginForm.$validated = true
      yokozuna.login(username, password).then(
        loginSuccess,
        loginError,
      )
    }
    $scope.logout = function () {
      yokozuna.logout().then(function () {
        $scope.$emit("user:mightNotBeAvailable")
      })
    }
    $scope.forgot = function (email) {
      paldiService.password.forgotPassword(email).then(
        function () {
          swal({
            title: EXECUTION_ENV=="EXTERNAL"?"Petition Processed":"Petición procesada",
            type: "success",
            confirmButtonText: "Aceptar",
          })
          $state.go("access.login")
        },
        function (error) {
          // // console.log(error);
          swal({
            title: EXECUTION_ENV=="EXTERNAL"?"Petition Processed":"Petición procesada",
            type: "success",
            confirmButtonText: "Aceptar",
          })
          $state.go("access.login")
        },
      )
    }


    function goIn() {
      $scope.$emit("user:mightBeAvailable")
      let name = (EXECUTION_ENV=="EXTERNAL"?"console.quote-list":"console.order-list")
      if($scope.currentUser.role=="PROVIDER") name='console.provider-list'
      if ($rootScope.currentUser) {
        yokozuna.goLastVisitedOrElse(name)
      } else {
        $timeout(function () {
          yokozuna.goLastVisitedOrElse(name)
        }, 2000)
      }
    }
    function loginSuccess(data) { // @ CONDITIONAL PROXY
      if (EXECUTION_ENV === "INTERNAL") {
        paldiService.users.whoAmI().then(
          function (user) {
            $rootScope.currentUser = user
            $rootScope.currentUser.canAdmin
              = user.role == "ADMIN" || user.role == "SUPERADMIN"
            $rootScope.currentUser.canManage =
              user.role == "MANAGER" ||
              user.role == "INSTALLATION_MANAGER" ||
              user.role == "SALES_MANAGER"


            sessionHelper.initOrderStatusList(user.role)
            $timeout(function () {
              goIn()
            }, 500)
          },
          function () {
            goIn()
          },
        )
      } else {
       
        $scope.currentUser = {
          ...data.user,
          ...data.permissions,
        }
        $rootScope.currentUser ={
          ...data.user,
          ...data.permissions,
        }
        
        
        sessionHelper.initOrderStatusList(data.user.role)
        goIn()
      }

    }
    function loginError(err) {
      $scope.errorMessage = EXECUTION_ENV=="EXTERNAL"?"Wrong Credentials":"Credenciales inválidas"
    }

  },
)
