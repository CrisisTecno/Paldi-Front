import { pdApp, globals } from "../../index";

//------------------------------ Plus ------------------------------
export function generatePlusHandlers($http, $filter) {


  var getPlusList = function (model,etk) {
    if(etk=='etk'){
    $http
      .get(globals.apiURL + "/pricing/plus/" + model.type, {
        authentication: "yokozuna",
      })
      .then(function (response) {
        model.plusList = [];
        response.data.forEach(function (element, index) {
          
          model.plusList.push({
            label: element.name +
              " (" +
              $filter("currency")(element.price) +
              ")",
            value: element,
          });
        });
      });
    }else{
      $http
      .get(globals.apiURL + "/pricing/plus/" + model.type+'etk', {
        authentication: "yokozuna",
      })
      .then(function (response) {
        model.plusList = [];
        response.data.forEach(function (element, index) {
          
          model.plusList.push({
            label: element.name +
              " (" +
              $filter("currency")(element.price) +
              ")",
            value: element,
          });
        });
      });
      }
  };

  var getMotorList = function (model,etk) {
    console.log("modelo moldura",model)
   
    if(etk=='etk'){

      $http
      .get(globals.apiURL + "/pricing/plus/motor/" + model.type+'etk', {
        authentication: "yokozuna",
      })
      .then(function (response) {
        response.data.forEach(function (element, index) {
          model.motorList = []; 
          if (element.priceType == "MOTOR") {
            model.motorList.push({
              label: element.name +
                " (" +
                $filter("currency")(element.price) +
                ")",
              value: element,
            });
          } else {
            model.plusList.push({
              label: element.name +
                " (" +
                $filter("currency")(element.price) +
                ")",
              value: element,
            });
          }
        });
      });

    }else{

      $http
      .get(globals.apiURL + "/pricing/plus/motor/" + model.type, {
        authentication: "yokozuna",
      })
      .then(function (response) {
        response.data.forEach(function (element, index) {
          model.motorList = []; 
          if (element.priceType == "MOTOR") {
            model.motorList.push({
              label: element.name +
                " (" +
                $filter("currency")(element.price) +
                ")",
              value: element,
            });
          } else {
            model.plusList.push({
              label: element.name +
                " (" +
                $filter("currency")(element.price) +
                ")",
              value: element,
            });
          }
        });
      });

    }
    
  };

  var getInstallationPlusList = function (model) {
    $http
      .get(globals.apiURL + "/pricing/plus/pisos/installationPlus", {
        authentication: "yokozuna",
      })
      .then(function (response) {
        model.installationPlusList = [];
        response.data.forEach(function (element, index) {
          if (model.type == element.type) {
            model.installationPlusList.push({
              label: element.name +
                " (" +
                $filter("currency")(element.price) +
                ")",
              value: element,
            });
          }
        });
      });
  };

  var roundPrices = function (model) {
    model.productsTotal = model.productsTotal.toFixed(2);

    model.plusTotal = model.plusTotal.toFixed(2);
    model.motorTotal = model.motorTotal.toFixed(2);
    model.installationPlusTotal =
      model.installationPlusTotal.toFixed(2);
    model.installationTotal = model.installationTotal.toFixed(2);

    model.discount = model.discount.toFixed(2);
    model.subTotal = model.subTotal.toFixed(2);
    model.iva = model.iva.toFixed(2);
    model.total = model.total.toFixed(2);
  };

  var filterProducts = function (productsArray, productType) {
    var productsFiltered = productsArray.filter(function (elem) {
      return elem.productType === productType;
    });
    return productsFiltered;
  };
  return { roundPrices, filterProducts, getPlusList, getMotorList, getInstallationPlusList };
}
