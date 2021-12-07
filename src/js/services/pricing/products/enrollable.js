import { pdApp, globals } from "../../index";

export function generateEnrollableHandlers($http, $rootScope) {
  var getEnrollablePrice = function (enrollable, meta) {
    var validateMin = function (value, isUnitPrice) {
      return value < 1 ? 1 : value;
    };
    var isValid = true;
    var isUnitPrice = false;

    if (!enrollable) {
      isValid = false;
      enrollable = {};
    }
    if (!enrollable.type) {
      isValid = false;
    } else if (meta.priceType == "METER") {
      isUnitPrice = true;
    }
    if (!enrollable.colorObj) {
      isValid = false;
    }

    if (isUnitPrice && !enrollable.system && meta.systems) {
      isValid = false;
    }
    if (!isUnitPrice && !enrollable.width) {
      isValid = false;
    }
    if (!isUnitPrice && !enrollable.height) {
      isValid = false;
    }

    if (enrollable.width && enrollable.height) {
      enrollable.m2 =
        validateMin(enrollable.width, isUnitPrice) *
        validateMin(enrollable.height, isUnitPrice);
      enrollable.m2 = Math.round(enrollable.m2 * 100) / 100;
    } else {
      enrollable.m2 = null;
    }

    if (isValid) {
      var obj = {
        type: enrollable.type,
        line: enrollable.colorObj.line,
        textil: enrollable.colorObj.textil,
        code: enrollable.colorObj.code,
      };
      if (!isUnitPrice) {
        obj.width = validateMin(enrollable.width, isUnitPrice);
        obj.height = validateMin(enrollable.height, isUnitPrice);
      } else {
        obj.system =
          enrollable.system != "N/A" ? enrollable.system : null;
      }

      $http
        .post(globals.apiURL + "/pricing/prices/enrollable", obj, {
          authentication: "yokozuna",
        })
        .then(function (response) {
          if (!response.data) {
            enrollable.doable = false;
            enrollable.unit = null;
            enrollable.price = null;
            enrollable.total = null;
          } else {
            enrollable.doable = true;
            var price = response.data.price;
            var priceType = response.data.priceType;
            var m2 = enrollable.m2 &&
              enrollable.m2 < 1 &&
              isUnitPrice
              ? 1
              : enrollable.m2;

            enrollable.unit =
              priceType == "METER" ? price : null;
            enrollable.price =
              priceType == "METER" ? m2 * price : price;
            enrollable.total = enrollable.quantity
              ? enrollable.price * enrollable.quantity
              : null;
          }
        });
    } else {
      enrollable.unit = null;
      enrollable.price = null;
      enrollable.total = null;
      enrollable.doable = true;
    }
  };

  var getEnrollableColors = function (enrollable) {
    if (enrollable.type) {
      delete enrollable.color;
      delete enrollable.colorObj;
      $http
        .get(
          globals.apiURL +
          "/pricing/colors/enrollables/" +
          enrollable.type,
          { authentication: "yokozuna" }
        )
        .then(function (response) {
          enrollable.colors = [];
          response.data.forEach(function (element, index) {
            enrollable.colors.push({
              label: $rootScope.pretty("color", element),
              value: element,
            });
          });
        });
    }
  };
  return { getEnrollablePrice, getEnrollableColors };
}
