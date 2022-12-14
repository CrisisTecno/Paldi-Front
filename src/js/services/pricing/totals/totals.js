import {globals} from "../.."
import { getShippingCost } from "./shipping"

const toValue = v => isNaN(v) ? 0 : Number(v)


const calculateAdditionalSubTotal = (product, additional) => {
  // console.log("ADDITIONAL",angular.copy(additional))
  switch (additional.priceType) {
    case "PRODUCT":
      return additional.price * additional.quantity
    case "Piece":
    case "PIECE":
      return additional.price * additional.quantity
    case "WIDTH":
      return additional.price * additional.quantity * (product.width ?? 1)
    case "HEIGHT":
      return additional.price * additional.quantity * product.height
    case "METER":
      return additional.price * additional.quantity * product.m2
  }
  
  return additional.price * additional.quantity
}
const getAdditionalSubTotal = (product) => {
  return product.plusList.map(additional => calculateAdditionalSubTotal(product, additional))
}
const getAdditionalTotal = (product) => {
  const subtotal = getAdditionalSubTotal(product)
  return subtotal.reduce((p, c) => p + c, 0)
}
export const getAdditionalsSubTotal = (order) => {
  const subtotal = order.products.map(product => getAdditionalSubTotal(product))
  return subtotal
}

const getAdditionalTotalWD = (product,order) => {
  const toDecimalPercent = v => isNaN(v) ? 0 : (parseFloat(v) / 100)
  const getOrderDiscount = (name) => toDecimalPercent(order[`discountPercent${name}`])
  const subtotal = getAdditionalSubTotal(product)
  return subtotal.reduce((p, c) => p + c, 0) * (1 - getOrderDiscount(product.productType))
}

const getAdditionalDiscount = (product,order) => {
  const toDecimalPercent = v => isNaN(v) ? 0 : (parseFloat(v) / 100)
  
  const getOrderDiscount = (name) => toDecimalPercent(order[`discountPercent${name}`])
  const subtotal = getAdditionalSubTotal(product)
  return subtotal.reduce((p, c) => p + c, 0) * (getOrderDiscount(product.productType))
}

const getAdditionalsTotal = (order) => {

  let subtotal
  
 subtotal = order.products.map(product => getAdditionalTotal(product))

  const plusTotal = subtotal.reduce((p, c) => p + c, 0)


  // console.log(plusTotal,"A")
  const isMixedOrder = (order.type === 'Mixta')

  const isEnrollable = (order.productType === 'Enrollable')
  const plusEnrollable = (isMixedOrder && isEnrollable) ? plusTotal : undefined

  const isFiltrasol = (order.productType === 'Filtrasol')
  const plusFiltrasol = (isMixedOrder && isFiltrasol) ? plusTotal : undefined

  return {
    plusTotal,
    plusEnrollable,
    plusFiltrasol
  }
}

const getMotorSubtotal = (product) => {
  return product.motorList.map(motor => motor.price * motor.quantity)
}
const getMotorTotal = (product) => {
  const subtotal = product.motorList.map(motor => motor.price * motor.quantity)
  return subtotal.reduce((p, c) => p + c, 0)
}


export const getMotorsSubtotal = (order) => {
  if(order.type=="Mixta"){
    const toDecimalPercent = v => isNaN(v) ? 0 : (parseFloat(v) / 100)
    const getOrderDiscount = (name) => toDecimalPercent(order[`discountPercent${name}`])
    return order.products.map(product => getMotorSubtotal(product)* (1 - getOrderDiscount(product.productType)))
  }
  else
  return order.products.map(product => getMotorSubtotal(product))
}
const getMotorsTotal = (order) => {
  const toDecimalPercent = v => isNaN(v) ? 0 : (parseFloat(v) / 100)
  const getOrderDiscount = (name) => toDecimalPercent(order[`discountPercent${name}`])
  let subtotal
  
  subtotal = order.products.map(product => getMotorTotal(product))
  return {
    motorTotal: subtotal.reduce((p, c) => p + c, 0)
  }
}

const getMotorsTotalDiscount = (order) => {
  const toDecimalPercent = v => isNaN(v) ? 0 : (parseFloat(v) / 100)
  const getOrderDiscount = (name) => toDecimalPercent(order[`discountPercent${name}`])
  let subtotal
  if(order.type=="Mixta"){
    subtotal = order.products.map(product => getMotorTotal(product) * ( getOrderDiscount(product.productType)))
  }
  else
  subtotal = order.products.map(product => getMotorTotal(product))
  return subtotal.reduce((p, c) => p + c, 0)
  
}


const getInstallationPlusSubTotal = (product, installationPlus) => {
  switch (installationPlus.priceType) {
    case "PIECE":
      return installationPlus.price * installationPlus.quantity
    case "METER":
      return installationPlus.price * installationPlus.quantity * product.m2
  }
  return 0
}
const getInstallationPlusTotal = (product) => {
  const subtotal = product.installationPlusList.map(installationPlus => getInstallationPlusSubTotal(product, installationPlus))
  return subtotal.reduce((p, c) => p + c, 0)
}
const getInstallationsPlusTotal = (order) => {
  const toDecimalPercent = v => isNaN(v) ? 0 : (parseFloat(v) / 100)
  const getOrderDiscount = (name) => toDecimalPercent(order[`discountPercent${name}`])
  let subtotal
  subtotal = order.products.map(product => getInstallationPlusTotal(product))
  return subtotal.reduce((p, c) => p + c, 0)
}


const getInstallationsPlusTotalDiscount = (order) => {
  const toDecimalPercent = v => isNaN(v) ? 0 : (parseFloat(v) / 100)
  const getOrderDiscount = (name) => toDecimalPercent(order[`discountPercent${name}`])
  let subtotal
  if(order.type=="Mixta"){
    subtotal = order.products.map(product => getInstallationPlusTotal(product) * ( getOrderDiscount(order.productType)))
  }
  else subtotal = order.products.map(product => getInstallationPlusTotal(product))
  return subtotal.reduce((p, c) => p + c, 0)
}
const getInstallationTotal = (order) => {
  const installationPlusTotal = getInstallationsPlusTotal(order)

  const isFloor = order.type == "Piso"
  const subtotal = order.products.map(({installationPrice}) => toValue(installationPrice) * isFloor)

  return {
    installationPlusTotal: toValue(installationPlusTotal),
    installationTotal: subtotal.reduce((p, c) => p + c, 0) + toValue(installationPlusTotal)
  }
}


const getProductsTotal = (order) => {
  const productTotal = order.products.reduce((prev, prod) => prod.total + prev, 0)
  //// console.log("ORDER TOTALs",order)
  const getSubProductTotal = (name) => order.products.reduce((prev, {
    productType,
    total
  }) => prev + ((total || 0) * (productType === name)), 0)

  const isMixed = order.type == "Mixta"
  //// console.log("CALCULATED",getSubProductTotal('Balance'))
  return {
    productsTotal: productTotal,
    balanceTotal: isMixed ? getSubProductTotal('Balance') : undefined,
    shutterTotal: isMixed ? getSubProductTotal('Shutter') : undefined,
    enrollableTotal: isMixed ? getSubProductTotal('Enrollable') : undefined,
    filtrasolTotal: isMixed ? getSubProductTotal('Filtrasol') : undefined,
    cortinaTotal: isMixed ? getSubProductTotal('Cortina') : undefined,
  }
}


const getDiscounts = (order, totals) => {
  const toDecimalPercent = v => isNaN(v) ? 0 : (parseFloat(v) / 100)
  
  const getTotal = (name) => totals[`${name.toLowerCase()}Total`]
  const getOrderDiscount = (name) => toDecimalPercent(order[`discountPercent${name}`])
  const getDiscount = (name) => getOrderDiscount(name) ? toValue(getTotal(name) * getOrderDiscount(name)) : undefined

 // // console.log("BALANCE DICOUNT",getDiscount("Balance"),totals)
  const balanceDiscount = getDiscount('Balance')
  const shutterDiscount = getDiscount('Shutter')
  const enrollableDiscount = getDiscount('Enrollable')
  const filtrasolDiscount = getDiscount('Filtrasol')
  const cortinaDiscount = getDiscount('Cortina')
  const additionalsDiscount = order.products.map(product => getAdditionalDiscount(product,order)).reduce((p, c) => p + c, 0)
  const motorsDiscount = getMotorsTotalDiscount(order)
  const installationPlusDiscount = getInstallationsPlusTotalDiscount(order);

  const mixedDiscount = toValue(balanceDiscount)
    + toValue(cortinaDiscount)
    + toValue(shutterDiscount)
    + toValue(enrollableDiscount)
    + toValue(filtrasolDiscount)  
    + toValue(additionalsDiscount) 
    + toValue(motorsDiscount) 
    + toValue(installationPlusDiscount)


  const fullDiscount = (order.discountPercent || order.discountPercent==0) ? (totals.productsTotal
    + totals.plusTotal
    + totals.motorTotal *  !IS_ZELBA
  ) * toDecimalPercent(order.discountPercent) : order.discount

  
  const discount = order.type === 'Mixta' ? mixedDiscount : fullDiscount
  

  return {
    ...({balanceDiscount, shutterDiscount, enrollableDiscount, filtrasolDiscount,cortinaDiscount}),
    discount: toValue(discount)
  }
}


export const getTotals = (order) => {
   

  if (!order.products instanceof Array) {
    return
  }

  const additionals = getAdditionalsTotal(order)
  const motors = getMotorsTotal(order)
  const installation = getInstallationTotal(order)
  const products = getProductsTotal(order)

  const totals = {
    ...additionals,
    ...motors,
    ...installation,
    ...products,
   
  }
 if (EXECUTION_ENV=="EXTERNAL"){
     totals.shipping= getShippingCost(order.products) 
 }
  const discounts = getDiscounts(order, totals)

    let subTotal = totals.productsTotal
    + totals.plusTotal
    + totals.motorTotal
    + totals.installationTotal
    // + totals.shipping
    - discounts.discount

    if(EXECUTION_ENV=="EXTERNAL"){
      subTotal+= totals.shipping
    }

  let iva
  if(EXECUTION_ENV!="EXTERNAL"){
   iva = subTotal * globals.iva // * order.hasTaxes
 }
 else{
   iva = (subTotal-totals.shipping) * globals.iva * order.hasTaxes
 }
  
  const total = subTotal + iva
// console.log(totals)
  return {
    ...totals,
    ...discounts,
    subTotal,
    iva,
    total,
  }
}