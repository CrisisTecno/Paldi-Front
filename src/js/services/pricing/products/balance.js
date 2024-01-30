import { pdApp, globals } from "../../index";

export function generateBalanceHandlers($http) {

  var getBalancePrice = function (balance) {
    const intervals = [
      { min: 0.1, max: 0.6 },
      { min: 0.6, max: 0.75 },
      { min: 0.75, max: 0.9 },
      { min: 0.9, max: 1.05 },
      { min: 1.05, max: 1.2 },
      { min: 1.2, max: 1.35 },
      { min: 1.35, max: 1.5 },
      { min: 1.5, max: 1.65 },
      { min: 1.65, max: 1.8 },
      { min: 1.8, max: 1.95 },
      { min: 1.95, max: 2.1 },
      { min: 2.1, max: 2.25 },
      { min: 2.25, max: 2.4 },
      { min: 2.4, max: 2.55 },
      { min: 2.55, max: 2.7 },
      { min: 2.7, max: 2.85 },
      { min: 2.85, max: 3 },
      { min: 3, max: 3.15 }
    ];
    
    if (balance.type == "Wrapped Cornice" && balance.width) {
      
      const interval = intervals.find(i => balance.width > i.min && balance.width <= i.max);
      
    
      if (interval) {
        balance.maxWidth = interval.max;
        balance.minWidth = interval.min;
      } else {
        console.log('ERROR');
      }
    }
    var isValid = true;

    if (!balance) {
      isValid = false;
      balance = {};
    }
    if (!balance.type) {
      isValid = false;
    }
   
    if(balance.type=="De madera"){
      
      delete balance.textil
    }

    if(balance.type=="Wrapped Cornice" || balance.type=="Aluminum Gallery"){
      
      if(balance.height == 0.152) balance.height=0.152
      if(balance.height == 0.203) balance.height=0.2032
      
    }
    
    if (isValid) {
      $http
        .post(globals.apiURL + "/pricing/prices/balance", balance, {
          authentication: "yokozuna",
        })
        .then(function (response) {
          var price = response.data.price;
          balance.unit = price;
          balance.price = balance.width
            ? balance.unit * balance.width
            : null;
          if(balance.type=="Wrapped Cornice" || balance.type=="Aluminum Gallery"){
            balance.price=price
          }
          balance.total =balance.width && balance.quantity && balance.price? balance.price * balance.quantity
              : null;
          
        });
    } else {
      balance.unit = null;
      balance.price = null;
      balance.total = null;
    }
  };

  var getBalanceColors = function (balance) {
    if (balance.type) {
      delete balance.color;
      $http
        .get(
          globals.apiURL +
          "/pricing/colors/balances/" +
          balance.type,
          { authentication: "yokozuna" }
        )
        .then(function (response) {
          balance.colors = [];
          response.data.forEach(function (element, index) {
            balance.colors.push({
              label: element.code,
              textil:element.textil??null,
              value: element,
            });
          });
        });
    }
  };
  return { getBalancePrice, getBalanceColors };
}
