import { getDaysExcludingWeekends } from "./getDaysExcludingWeekends"
const START_CYCLE = 1

export const getCycleDays = (current, start, end) => {
  if (!start)
    return " - "

  let cycle = (end ? end : current)?.diff(start, "days")
  let days = cycle > 0 ? cycle : 0
  return getDaysExcludingWeekends(start, days) + START_CYCLE
}