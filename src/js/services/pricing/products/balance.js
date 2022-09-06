import { pdApp, globals } from "../../index";

export function generateBalanceHandlers($http) {
  var getBalancePrice = function (balance) {
    var isValid = true;

    if (!balance) {
      isValid = false;
      balance = {};
    }
    if (!balance.type) {
      isValid = false;
    }
   // console.log("BALANCE AF",angular.copy(balance))
    if(balance.type=="De madera"){
      
      delete balance.textil
    }

    if(balance.type=="Wrapped Cornice" || balance.type=="Aluminum Gallery"){
      
      if(balance.height == 0.152) balance.height=0.152
      if(balance.height == 0.203) balance.height=0.2032
    }
   // console.log("BALANCE BF",angular.copy(balance))
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
          balance.total =
            balance.width && balance.quantity && balance.price
              ? balance.price * balance.quantity
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
