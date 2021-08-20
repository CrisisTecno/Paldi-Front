export const getCountdownStatus = (cycle, days, commitment, end) => {
  if (!(cycle && commitment)) return ""
  if (end) return "END"
  return days >= 0 ? "START" : "LATE"
}