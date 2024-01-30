import { pdApp, globals } from "../../index";

export function generateShutterHandlers($http) {
  var getShutterPrice = function (shutter) {
    var isValid = true;

    if (!shutter) {
      isValid = false;
      shutter = {};
    }
    if (!shutter.type) {
      isValid = false;
    }
    if (!shutter.installationType) {
      isValid = false;
    }
    if (!shutter.rodType) {
      isValid = false;
    }

    if (isValid) {
      $http
        .post(globals.apiURL + "/pricing/prices/shutter", shutter, {
          authentication: "yokozuna",
        })
        .then(function (response) {
          var price = response.data.price;
          shutter.unit = price;

          var inche = 0.0254, ft = 0.092903;
          var incheQuantity = 0;

          if (shutter.installationType == "Por fuera") {
            incheQuantity = 6;
          } else {
            incheQuantity = 4;
          }

          var m2 = (shutter.width + incheQuantity * inche) *
            (shutter.height + incheQuantity * inche);
          m2 = m2 >= ft * 8 ? m2 : ft * 8;
          shutter.m2 = Math.round(m2 * 100) / 100;
          shutter.unit = price;
          shutter.price = shutter.m2 ? shutter.unit * m2 : null;
          shutter.total =
            shutter.quantity && shutter.m2 && shutter.price
              ? shutter.price * shutter.quantity
              : shutter.quantity;
        });
    } else {
      shutter.unit = null;
      shutter.price = null;
      shutter.total = null;
    }
  };

  var getShutterColors = function (shutter) {
    if (shutter.type) {
      delete shutter.color;
      $http
        .get(
          globals.apiURL +
          "/pricing/colors/shutters/" +
          shutter.type,
          { authentication: "yokozuna" }
        )
        .then(function (response) {
          shutter.colors = [];
          response.data.forEach(function (element, index) {
            
            shutter.colors.push({
              label: element.color,
              value: element,
            });
          });
        });
    }
  };
  return { getShutterPrice, getShutterColors };
}

