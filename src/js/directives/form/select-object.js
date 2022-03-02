// //console.log("loaded ?")

angular.module("formDirectives", [])
  .directive("selectObject", function () {
    return {
      restrict: "E",
      templateUrl: "partials/directives/form/select-object.html",
      scope: {
        data: "=data",
        model: "=ngModel",
        textProperty: "=textProperty",
        valueProperty: "=valueProperty",
        ifFunctionProperty: "=?ifFunctionProperty",
        scope: "=?scope",
      },
      link: function ($scope) {
        // //console.log("linking")
        $scope.evalIf = (entry) => {
          if (!$scope.ifFunctionProperty) {
            return true
          }

          try {
            return entry[$scope.ifFunctionProperty] ? entry[$scope.ifFunctionProperty](
              $scope.scope) : true
          } catch (e) {
            return true
          }
        }
      },
    }
  })