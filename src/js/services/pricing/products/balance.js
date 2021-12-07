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
              value: element,
            });
          });
        });
    }
  };
  return { getBalancePrice, getBalanceColors };
}
