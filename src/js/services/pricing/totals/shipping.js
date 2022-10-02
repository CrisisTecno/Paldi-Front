

const pipe = (...args) => args.reduce((acc, el) => el(acc));

const SHIPPING_PRICES = {
  maxPiecesDefault: 4,
  smallOrderPrice: 27,
  defaultPrice: 7,
  overWidth: 100
}

export const getShippingCost = (products) => {
  if (products?.length <= 0)
    return 0
  

    let productsShipping = products.map(product => {
      //console.log(product);
       if(product.productType=="Balance"){
         return (isNaN(product.shipping) ? SHIPPING_PRICES.defaultPrice  : product.shipping) * product.quantity
       }
       if(product.productType=="Additionals"){
         return product.quantity * SHIPPING_PRICES.defaultPrice
       }
       if(!product.color){
         return product.quantity * SHIPPING_PRICES.defaultPrice
       }
       return (isNaN(product.color.shipping) ? SHIPPING_PRICES.defaultPrice : product.color.shipping) * product.quantity
   
     })

     productsShipping = productsShipping.reduce((p,c)=>p+c,0)

  
  return productsShipping
}