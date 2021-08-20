import { getCountdownStatus } from "./getCountdownStatus"
import { getDaysExcludingWeekends } from "./getDaysExcludingWeekends"
import { getRemainingDays } from "./getRemainingDays"

const START_CYCLE = 1

export const getDPFCDays = (start, commitment, end) => {
  if (!(start && commitment))
    return {
      dpfcDays: " - ",
      dpfcStatus: "",
      dpfcTotalStatus: "",
      dpfcTotalDays: 0,
    }
    
  let days = getRemainingDays(start, commitment, end)
  let businessDays = getDaysExcludingWeekends(start, commitment.diff(start, "days"))
  let dpfcDays = end === null ? (isNaN(days) ? days : Math.abs(days)) : (businessDays + START_CYCLE - days)

  return {
    dpfcDays: dpfcDays,
    dpfcStatus: getCountdownStatus(start, days, commitment, end),
    dpfcTotalStatus: getCountdownStatus(start, days, commitment, end),
    dpfcTotalDays: businessDays + START_CYCLE
  }
}