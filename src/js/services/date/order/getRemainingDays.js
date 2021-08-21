import { getDaysExcludingWeekends } from "./getDaysExcludingWeekends"
import { getDaysLeft } from "./getDaysLeft"

export const getRemainingDays = (start, commitment, end) => {
  if (!(start && commitment))
    return " - "
  return getDaysLeft(start, end ? end : moment(), getDaysExcludingWeekends(start, commitment.diff(start, 'days')))
}