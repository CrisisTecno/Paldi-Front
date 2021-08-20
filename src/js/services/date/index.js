

angular.module('paldi-app').service('DateService', function (

) {
  let service = {}

  const getTransitDays = function (
    currentDate,
    startDate,
    endDate,
    commitmentDate
  ) {
    var cycle = 0;
    var days;
    var daysExcludingWeekends = 0;
    var transitDays;
    var START_CYCLE = 1;

    transitDays =
      daysExcludingWeekends + "/" + (businessDays + START_CYCLE);

    return transitDays;
  };


  return service
})