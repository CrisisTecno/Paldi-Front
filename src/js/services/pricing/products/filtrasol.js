import { pdApp, globals } from "../../index";

export function generateFiltrasolHandlers($http, $rootScope) {
  var getFiltrasolPrice = function (filtrasol, meta) {
    var validateMin = function (value) {
      return value < 1 ? 1 : value;
    };

    var isValid = true;
    var isUnitPrice = false;

    if (!filtrasol) {
      isValid = false;
      filtrasol = {};
    }
    
    if (!filtrasol.type) {
      isValid = false;
     
    } else if (meta.priceType == "METER") {
      isUnitPrice = true;
    
    }
    if (!filtrasol.colorObj) {
     
      isValid = false;
    }
    if (!isUnitPrice && !filtrasol.width) {
      
      isValid = false;
    }
    if (!isUnitPrice && !filtrasol.height) {
     
      isValid = false;
    }

    if (filtrasol.width && filtrasol.height) {
      filtrasol.m2 =
        validateMin(filtrasol.width) *
        validateMin(filtrasol.height);
      filtrasol.m2 = Math.round(filtrasol.m2 * 100) / 100;
    } else {
      filtrasol.m2 = null;
    }

    if (isValid) {
      var obj = {
        type: filtrasol.type,
        line: filtrasol.colorObj.line,
        textil: filtrasol.colorObj.textil,
        code: filtrasol.colorObj.code,
      };
      if (!isUnitPrice) {
        obj.width = filtrasol.width;
        obj.height = filtrasol.height;
      }

      $http
        .post(globals.apiURL + "/pricing/prices/filtrasol", obj, {
          authentication: "yokozuna",
        })
        .then(function (response) {
          // console.log("HTTP REPONSE",response)
          if (!response.data) {
            filtrasol.doable = false;
            filtrasol.unit = null;
            filtrasol.price = null;
            filtrasol.total = null;
          } else {
            filtrasol.doable = true;
            var price = response.data.price;
            var priceType = response.data.priceType;
            var m2 = filtrasol.m2 && filtrasol.m2 < 1
              ? 1
              : filtrasol.m2;

            filtrasol.unit =
              priceType == "METER" ? price : null;
            filtrasol.price =
              priceType == "METER" ? m2 * price : price;
            filtrasol.total = filtrasol.quantity
              ? filtrasol.price * filtrasol.quantity
              : null;
          }
        });
    } else {
      filtrasol.unit = null;
      filtrasol.price = null;
      filtrasol.total = null;
      filtrasol.doable = true;
    }
  };

  var getFiltrasolColors = function (filtrasol) {
    if (filtrasol.type) {
      delete filtrasol.color;
      delete filtrasol.colorObj;
      $http
        .get(
          globals.apiURL +
          "/pricing/colors/filtrasoles/" +
          filtrasol.type,
          { authentication: "yokozuna" }
        )
        .then(function (response) {
          filtrasol.colors = [];
          response.data.forEach(function (element, index) {
            filtrasol.colors.push({
              label: $rootScope.pretty("color", element),
              value: element,
            });
          });
        });
    }
  };
  return { getFiltrasolPrice, getFiltrasolColors };
}