import { 
  cancel, error, orders, sent as success
} from "./messages"

export const showSwal = (tag, callback=undefined) => {
  const swalInvoker = getSwal(tag)
  swalInvoker(callback)
}

const getSwal = (tag) => {
  const path = tag.split('.')
  let actual = swals
  for (const subKey of path) {
    actual = actual[subKey]
    console.log(actual)
  }
  return actual
}

const swals = {
  messages: {
    cancel: cancel,
    error: error,
    payment: {
      success: success
    },
    orders: orders
  }
}

console.log(swals)