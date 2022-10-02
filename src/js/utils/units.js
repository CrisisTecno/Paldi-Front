const INCHES_PER_METER = 1.0
const SQ_INCHES_PER_METER = INCHES_PER_METER * INCHES_PER_METER

export function meters_to_inches(meters) {
  return parseFloat((meters * INCHES_PER_METER))
}

export function inches_to_meters(inches) {
  return parseFloat((inches / INCHES_PER_METER))
}

export function sq_meters_to_inches(sq_meters) {
  return parseFloat((sq_meters * SQ_INCHES_PER_METER))
}

export function sq_inches_to_meters(sq_inches) {
  return parseFloat((sq_inches / SQ_INCHES_PER_METER))
}

export function to_fraction(inches) {
  const decimal = inches  // delta
  console.log(decimal)
  // This solution rounds up
  const tags = ["", "1/8", "1/4", "3/8", "1/2", "5/8", "3/4", "7/8"]
  const thresholds = [1/16, 3/16, 5/16, 7/16, 9/16, 11/16, 13/16, 15/16]
  for (let i = 0; i < 9; i++) {
    if (decimal < thresholds[i] )
      return `${tags[i]}` 
  }
  return parseInt(Math.ceil(inches))
  // 0, 1/8, 1/4, 3/8, 1/2, 5/8, 3/4, 7/8 
}
