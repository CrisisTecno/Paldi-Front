export const merge = (root, additional) => {
  Object.entries(additional).forEach(([key, value]) => root[key] = value)
  return root
}