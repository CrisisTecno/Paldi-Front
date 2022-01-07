var ngYokozuna = angular.module("ng-yokozuna", ["ui.router"])
  .provider("yokozunaConfig", function () {
    this.setURL = function (url) {
      this.url = url
    }

    this.setLoginState = function (loginState) {
      this.loginState = loginState
    }

    this.$get = function () {
      return this
    }
  })
  .config(function ($httpProvider) {
    $httpProvider.interceptors.push("yokozunaHttpInterceptor")
  })
  .run(function (yokozuna, yokozunaConfig, $state, $rootScope) {
    $rootScope.yokozunaLogged = yokozuna.isLogged()

    $rootScope.$on(
      "$stateChangeStart",
      function (event, toState, toParams, fromState, fromParams, options) {
        if (toState.authRequired) {
          if (!yokozuna.isLogged()) {
            yokozuna.hasLastVisited = true
            yokozuna.lastState = toState
            yokozuna.lastStateParams = toParams

            event.preventDefault()
            $state.go(yokozunaConfig.loginState)
          } else {
            yokozuna.hasLastVisited = false
          }
        }
      },
    )
  })
  .factory("yokozunaHttpInterceptor", function ($window, $injector, $q) {
    var interceptor = {
      request: function (config) {
        if (config.authentication === "yokozuna") {
          config.headers["Authorization"]
            = "Bearer " + $injector.get("yokozuna").getToken()
        }
        return config
      },

      responseError: function (rejection) {
        if (rejection.status == 401 || rejection.status == 403) {
          $injector.get("yokozuna").logout()
          $injector.get("$state").go($injector.get("yokozunaConfig").loginState)
        }
        return $q.reject(rejection)
      },
    }

    return interceptor
  })

  .factory(
    "yokozuna",
    function ($http, $window, $q, $rootScope, $state, yokozunaConfig) {
      var tokenStoreKey = "jEshk1oG0vasP6Yigs9El2"

      var yokozuna = {}

      yokozuna.setToken = function (token) {
        if (token != null) {
          $window.sessionStorage.setItem(tokenStoreKey, token)
          $rootScope.yokozunaLogged = true
        } else {
          $window.sessionStorage.removeItem(tokenStoreKey)
          $rootScope.yokozunaLogged = false
        }
      }

      yokozuna.getToken = function () {
        return $window.sessionStorage[tokenStoreKey]
      }

      yokozuna.isLogged = function () {
        var token = yokozuna.getToken()
        return (typeof (token) !== "undefined" && token != null)
      }

      yokozuna.login = yokozunaLogin

      yokozuna.goLastVisitedOrElse = function (elseState, elseStateParams) {
        if (yokozuna.hasLastVisited) {
          $state.go(yokozuna.lastState, yokozuna.lastStateParams)
        } else {
          $state.go(elseState, elseStateParams)
        }
      }

      yokozuna.logout = function () {
        return $q(function (resolve, reject) {
          yokozuna.setToken(null)
          resolve()
        })
      }


      function yokozunaLogin(username, password) {
        return $http.post(
          yokozunaConfig.url + "/auth/login",
          {username: username, password: password},
        ).then(
          function (res) {
            yokozuna.setToken(res.data.token)
            return res.data
          },
          function (err) {
            return $q.reject("Error logging in")
          },
        )
      }

      return yokozuna
    },
  )


