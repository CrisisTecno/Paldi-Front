import { pdApp, globals } from "../../index";

export function   generateToldoHandlers($http, $rootScope) {
  var getToldoPrice = function (toldo) {
    var isValid = true;

    if (!toldo) {
      isValid = false;
      toldo = {};
    }

    if (!toldo.type) {
      isValid = false;
    }

    if (!toldo.colorObj) {
      isValid = false;
    }

    if (!toldo.width) {
      isValid = false;
    }
    if (!toldo.height) {
      isValid = false;
    }

    if (toldo.width && toldo.height) {
      toldo.m2 = toldo.width * toldo.height;
      toldo.m2 = Math.round(toldo.m2 * 100) / 100;
    } else {
      toldo.m2 = null;
    }

    if (isValid) {
      var obj = {
        type: toldo.type,
        line: toldo.colorObj.line,
        textil: toldo.colorObj.textil,
        code: toldo.colorObj.code,
        width: toldo.width,
        height: toldo.height,
      };
      // console.log("OBJ-",obj)
      $http
        .post(globals.apiURL + "/pricing/prices/toldo", obj, {
          authentication: "yokozuna",
        })
        .then(function (response) {
          if (!response.data) {
            toldo.doable = false;
            toldo.price = null;
            toldo.total = null;
          } else {
            // console.log("REPONSE PRICE",response.data)
            var price = response.data.price;
            toldo.price = price;
            toldo.total = toldo.quantity
              ? toldo.price * toldo.quantity
              : null;
            toldo.doable = true;
          }
        });
    } else {
      toldo.price = null;
      toldo.total = null;
      toldo.doable = true;
    }
  };

  var getToldoColors = function (toldo) {
    if (toldo.type) {
      delete toldo.color;
      delete toldo.colorObj;
      $http
        .get(
          globals.apiURL + "/pricing/colors/toldos/" + toldo.type,
          { authentication: "yokozuna" }
        )
        .then(function (response) {
          toldo.colors = [];
          response.data.forEach(function (element, index) {
            toldo.colors.push({
              label: $rootScope.pretty("color", element),
              value: element,
            });
          });
        });
    }
  };
  return { getToldoPrice, getToldoColors };
}
