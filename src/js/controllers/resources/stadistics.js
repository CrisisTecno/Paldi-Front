app.controller('StadisticCtrl', function($scope, $window) {

    $scope.iframeHeight = $window.innerHeight + 'px';
  
    angular.element($window).bind('resize', function() {
      $scope.iframeHeight = $window.innerHeight + 'px';
      $scope.$digest(); 
    });
  });
  