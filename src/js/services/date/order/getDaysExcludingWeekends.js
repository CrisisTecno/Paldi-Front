export const getDaysExcludingWeekends = (start, days) => {
  let daysExcludingWeekends = angular.copy(days)
  let date = angular.copy(start)
  for (let i = 0; i< days; i++) {
    date = date.add(1, "days")
    daysExcludingWeekends -= [6, 7].includes(date.isoWeekday) ?  1 : 0
  }
  return daysExcludingWeekends
}