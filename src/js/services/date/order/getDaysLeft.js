export const getDaysLeft = (start, comparison, commitment) => {
  let left = angular.copy(commitment)
  let date = angular.copy(start)
  let passed = comparison.diff(date, "days")
  for (let i = 0; i < passed; i++) {
    date = date.add(1, "days")
    left -= [6, 7].includes(date.isoWeekday()) ? 1 : 0
  }
  return left
}