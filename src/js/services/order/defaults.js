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

const quoteStatus = [
  "NEW", "DUPLICATE", "LOST_SALE", "FOLLOWING", "REJECTED", "PENDING",
]
const orderStatus = [
  'CANCELED',
  'DELETED',
  'INSTALLED',
  'ORDER_CANCELED',
  'REJECTED',
  'BACKORDER',
  'FINISHED',
  'INSTALLED_NONCONFORM',
  'INSTALLED_INCOMPLETE',
  'PROGRAMMED',
  'QUOTE',
  'PRODUCTION',
  'TRANSIT',
  'LINE',
  'PENDING',
]

export function getOrderStatusFromList(statusList) {
  return statusList.filter(status => orderStatus.includes(status))
}

export function getQuoteStatusFromList(statusList) {
  return statusList.filter(status => quoteStatus.includes(status))
}