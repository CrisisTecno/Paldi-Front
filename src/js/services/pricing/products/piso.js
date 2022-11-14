import { pdApp, globals } from "../../index";

export function generatePisoHandlers($http) {
  var getPisoPrice = function (piso) {
    var isValid = true;

    if (!piso) {
      isValid = false;
      piso = {};
    }
    if (!piso.type) {
      isValid = false;
    }
    if (!piso.colorObj) {
      isValid = false;
    }
    if (!piso.m2) {
      isValid = false;
    }

    if (isValid) {
      var obj = {
        type: piso.type,
        code: piso.colorObj.code,
        clientType: "",
      };

      $http
        .post(globals.apiURL + "/pricing/prices/piso", obj, {
          authentication: "yokozuna",
        })
        .then(function (response) {
          var price = response.data.price;
          var quantity = piso.m2 / response.data.m2Box;
          piso.quantity =
            quantity - Math.floor(quantity) > 0
              ? Math.floor(quantity) + 1
              : quantity;
          piso.m2Box = response.data.m2Box;
          piso.unit = price;
          piso.price = piso.unit;
          piso.total = piso.price * piso.quantity;
          piso.installationPrice = piso.install
            ? response.data.installationPrice * piso.m2
            : 0;
        });
    } else {
      piso.m2Box = null;
      piso.quantity = null;
      piso.unit = null;
      piso.price = null;
      piso.total = null;
      piso.installationPrice = 0;
    }
  };

  var getPisoColors = function (piso) {
    if (piso.type) {
      delete piso.color;
      delete piso.colorObj;
      $http
        .get(
          globals.apiURL + "/pricing/colors/pisos/" + piso.type,
          { authentication: "yokozuna" }
        )
        .then(function (response) {
          piso.colors = [];
          piso.woodTypes = {}
          response.data.forEach(function (element, index) {
            if(!piso.woodTypes[element.wood]){
              piso.woodTypes[element.wood] = [{
                label: element.name,
                value: element,
              }]
            }
            else{
              piso.woodTypes[element.wood].push({
                label: element.name,
                value: element,
              })
            }

            piso.colors.push({
              label: element.name,
              value: element,
            });
          });
        });
    }
  };

  var getPlusColors = function (plus) {
    if (plus.type) {
      delete plus.color;
      delete plus.colorObj;
      $http
        .get(
          globals.apiURL +
          "/pricing/plus/pisos/list/moldings/" +
          plus.type,
          { authentication: "yokozuna" }
        )
        .then(function (response) {
          plus.colors = [];
          response.data.forEach(function (element, index) {
            plus.colors.push({
              label: element.name,
              value: element,
            });
          });
        });
    }
  };
  return { getPisoPrice, getPisoColors, getPlusColors };
}
