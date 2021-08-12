angular.module('inspinia', []);




angular.module('inspinia').run(function($rootScope, $timeout) {
    $rootScope.$on('flashMessage', function(event, args) {
        $rootScope.flashMessage = args;
        $rootScope.flashMessageShow = true;
        $timeout(function() {
            $rootScope.flashMessageShow = false;
        }, 3000);
    });
});
