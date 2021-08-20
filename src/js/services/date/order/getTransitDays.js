import { getDaysExcludingWeekends } from "./getDaysExcludingWeekends"

const START_CYCLE = 1

export const getTransitDays = (current, start, end, commitment) => {
  if (!(start && commitment))
    return " - "

  const businessDays = getDaysExcludingWeekends(start, commitment.diff(start, "days"))
  const cycle = (end ? end : current).diff(start, "days")
  const daysExcludingWeekends = getDaysExcludingWeekends(start, cycle <= 0 ? 0 : cycle) + START_CYCLE

  return `${daysExcludingWeekends}/${businessDays+START_CYCLE}`
}