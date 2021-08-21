

export const attachTo = (base, route, value) => {
  const split_route = route.split('.')
  let actual = base
  let prev = undefined

  for (let i = 0; i < split_route.length - 1; i++) {
    const key = split_route[i]
    actual[key] = actual[key] ? actual[key] : {}
    prev = actual
    actual = actual[key]
  }
  actual[split_route[split_route.length-1]] = value
  return base
}