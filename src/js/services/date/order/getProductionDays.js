import { getCountdownStatus } from "./getCountdownStatus"
import { getDaysExcludingWeekends } from "./getDaysExcludingWeekends"
import { getRemainingDays } from "./getRemainingDays"


const START_CYCLE = 1

export const getProductionDays = (start, commitment, end) => {
  if (!(start && commitment))
    return {
      productionDays: " - ",
      productionStatus: "",
      productionTotalStatus: "",
      productionTotalDays: "-"
    }
  
  let days = getRemainingDays(start, commitment, end)
  let businessDays = getDaysExcludingWeekends(start, commitment.diff(start, "days"))
  let productionDays = end === null ? (isNaN(days) ? days : Math.abs(days)) : (businessDays + START_CYCLE - days)

  return {
      productionDays: productionDays,
      productionStatus: getCountdownStatus(start, days, commitment, end),
      productionTotalStatus: getCountdownStatus(start, days, commitment, end),
      productionTotalDays: businessDays + START_CYCLE
    }
}