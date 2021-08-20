const types = [
  "Balance", "Shutter", "Toldo", "Enrollable", "Filtrasol", "Persiana o Filtrasol", "Piso", "Custom"
]

export const getDefaultProductsSorted = () => {
  let productsSorted = [...types].map((type) => ({ type: type, products: [] }))
  return productsSorted
}

export const getDefaultInitialLoadOrderObject = () => ({
  step: "loading",
  showNotes: false,
  newStatus: "",
  productNotes: "",
  productsSorted: getDefaultProductsSorted(),
  suborders: [],
  limitDays: 20,
  maxDate: undefined
})