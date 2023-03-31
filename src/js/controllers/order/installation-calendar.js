import {pdApp} from "../index"

pdApp.controller(
	"InstallCalendarCtrl",
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

        
            $scope.calendars = {"Instalador 1":'https://calendar.google.com/calendar/embed?src=instaladorpaldi1%40gmail.com&ctz=America%2FTijuana',
			"Instalador 2":'https://calendar.google.com/calendar/embed?src=instaladorpaldi2%40gmail.com&ctz=America%2FTijuana'}

			$scope.updateCalendar = function(selection){
				
				document.getElementById('calendarframe').src = selection
				
			}
          
    }
);