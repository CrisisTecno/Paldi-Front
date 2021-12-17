import { pdApp, globals } from "../index";

import { generateEnrollableHandlers } from "./products/enrollable";
import { generateFiltrasolHandlers } from "./products/filtrasol";
import { generatePlusHandlers } from './products/plus'
import { generateToldoHandlers } from "./products/toldo";
import { generatePisoHandlers } from './products/piso'
import { generateBalanceHandlers } from './products/balance'
import { generateShutterHandlers } from "./products/shutter";

import { getAdditionalsSubTotal, getMotorsSubtotal } from "./totals/totals";


pdApp.factory(
  "colorPriceService",
  function ($http, $q, $filter, $rootScope, paldiService, pricingService) {
    var service = {
      // Exchange Rate
      getExchangeRate: function () {
        return $http
          .get(globals.apiURL + "/pricing/prices/exchangeRate", {
            authentication: "yokozuna",
          })
          .then(function (response) {
            return response.data;
          });
      },
      setExchangeRate: function (exchangeRate) {
        return $http
          .post(
            globals.apiURL + "/pricing/prices/exchangeRate",
            exchangeRate,
            { authentication: "yokozuna" }
          )
          .then(function (response) {
            return response.data.rate;
          });
      },

      // Update Scope
      updatePrice: function (product, model, meta) {
        console.log("Updating price of:", product)
        switch (product) {
          case "Balance":
            getBalancePrice(model);
            break;
          case "Toldo":
            getToldoPrice(model);
            break;
          case "Shutter":
            getShutterPrice(model);
            break;
          case "Enrollable":
            getEnrollablePrice(model, meta);
            break;
          case "Filtrasol":
            getFiltrasolPrice(model, meta);
            break;
          case "Piso":
            getPisoPrice(model);
            break;
          case "Cortina":
            getCortinaPrice(model);
            break;
          case "Custom":
            getCustomPrice(model);
            break;
        }
      },

      updateTotals: function (product, model) {
        console.log("TotalUpdate",model);
        let pisoDiscount = false
        angular.forEach(model.products, function (product, key) {
          if (model.type == "Piso" && product.type == "Laminados" && model.client && model.client.type != "DIRECT_SALE") {
            pisoDiscount = true;
          }
        })

        if ($rootScope.currentUser.canAdmin) {
          model.clientMaxDiscount = 100;
        } else {
          if (pisoDiscount) {
            model.clientMaxDiscount = 30;
          } else if (model.client) {
            paldiService.clients
              .loadDiscount(model.client.type)
              .then(function (discount) {
                model.clientMaxDiscount = discount;
              });
          }
        }

        // Update Quote/Order Object
        const totals = pricingService.getTotals(model)
        console.log('Calculated', totals)
        for (const [key, value] of Object.entries(totals)) {
          model[key] = value
        }

        // Update Plus Total
        const additionalTotals = getAdditionalsSubTotal(model)
        model.products?.forEach((product, i) => {
          product.plusList?.forEach((additional, j) => {
            additional.total = additionalTotals[i][j]
          })
        })

        // Updater Motor Total
        const motorsTotals = getMotorsSubtotal(model)
        model.products?.forEach((product, i) => {
          product.motorList?.forEach((motor, j) => {
            motor.total = motorsTotals[i][j]
          })
        })
      },

      prepare: function (product, model) {
        this.updateTotals(product, model);
        model.clientId = model.client.id;

        switch (product) {
          case "Balance":
            model.balances = filterProducts(
              model.products,
              product
            );
            break;
          case "Toldo":
            model.toldos = filterProducts(model.products, product);
            break;
          case "Shutter":
            model.shutters = filterProducts(
              model.products,
              product
            );
            break;
          case "Enrollable":
            model.enrollables = filterProducts(
              model.products,
              product
            );
            break;
          case "Filtrasol":
            model.filtrasoles = filterProducts(
              model.products,
              product
            );
            break;
          case "Cortina":
            model.cortinas = filterProducts(
              model.products,
              product
            )
            break;
          case "Piso":
            model.pisos = filterProducts(model.products, product);
            break;
          case "Custom":
            model.customs = filterProducts(model.products, product);
            break;
        }
      },

      addProduct: function (service, product, newProducts) {
        return $http
          .post(
            globals.apiURL + "/pricing/" + service + "/" + product,
            newProducts,
            { authentication: "yokozuna" }
          )
          .then(function (response) {
            return response;
          });
      },

      // Edit
      editPiso: function (id, newPiso) {
        return $http
          .put(
            globals.apiURL + "/pricing/colors/pisos/" + id,
            newPiso,
            { authentication: "yokozuna" }
          )
          .then(function (response) {
            return response;
          });
      },
      editPlus: function (type, id, plusForm) {
        return $http
          .put(
            globals.apiURL +
            "/pricing/plus/pisos/" +
            type +
            "/" +
            id,
            plusForm,
            { authentication: "yokozuna" }
          )
          .then(function (response) {
            return response;
          });
      },

      // Delete 
      deleteProduct: function (type, id) {
        return $http
          .put(
            globals.apiURL +
            "/pricing/colors/" +
            type +
            "/" +
            id +
            "/delete",
            {},
            { authentication: "yokozuna" }
          )
          .then(function (response) {
            return response.data;
          });
      },
      deleteMolding: function (type, id) {
        return $http
          .put(
            globals.apiURL +
            "/pricing/plus/pisos/" +
            type +
            "/" +
            id +
            "/delete",
            {},
            { authentication: "yokozuna" }
          )
          .then(function (response) {
            return response.data;
          });
      },

      // Random gets
      getAllProducts: function (service, product, page, size, sort) {
        return $http
          .get(
            globals.apiURL +
            "/pricing/" +
            service +
            "/" +
            product +
            "?page=" +
            page +
            "&size=" +
            size +
            "&sort=" +
            sort,
            { authentication: "yokozuna" }
          )
          .then(function (response) {
            return response.data;
          });
      },
      getPlus: function (plus, id) {
        return $http
          .get(
            globals.apiURL +
            "/pricing/plus/pisos/" +
            plus +
            "/" +
            id,
            { authentication: "yokozuna" }
          )
          .then(function (response) {
            return response.data;
          });
      },
      getPisoColor: function (id) {
        return $http
          .get(globals.apiURL + "/pricing/colors/pisos/id/" + id, {
            authentication: "yokozuna",
          })
          .then(function (response) {
            return response.data;
          });
      },
      getPisoColorPrice: function (type, code) {
        return $http
          .get(globals.apiURL + "/pricing/prices/piso", {
            authentication: "yokozuna",
            params: { type: type, code: code },
          })
          .then(function (response) {
            return response.data;
          });
      },
      getColors: function (product, model) {
        switch (product) {
          case "Balance":
            return getBalanceColors(model);
          case "Toldo":
            return getToldoColors(model);
          case "Shutter":
            return getShutterColors(model);
          case "Enrollable":
            return getEnrollableColors(model);
          case "Filtrasol":
            return getFiltrasolColors(model);
          case "Piso":
            return getPisoColors(model);
          case "Plus":
            return getPlusColors(model);
        }
      },

      // Get additional lists
      getPlusList: function (product, model) {
        if (product != "Balance" && model.type) {
          getPlusList(model);
        }
      },
      getMotorList: function (product, model) {
        if (
          model.type &&
          product != "Balance" &&
          product != "Shutter" &&
          product != "Piso"
        ) {
          getMotorList(model);
        }
      },
      getPlusColorsList: function (product, model) {
        if (model.type && model.color && product == "Piso") {
          getPlusColors(model);
        }
      },
      getInstallationPlusList: function (product, model) {
        if (product == "Piso") {
          getInstallationPlusList(model);
        }
      },
    };

    //------------------------------ Cortinas ---------------------------    
    async function getCortinaPrice(model) {
      if (!model)
        return

      console.log("Calculating cortina price for ", model)
      const payload = {
        product: "Cortina",
        finish: model.finish,
        textil: model.textil,
        width: model.width,
        height: model.height,
      }

      const result = await paldiService.products.fetchPrice(payload)
      console.log("Calculated cortina price", result)
      model.m2 = Math.round(model.width * model.height * 100) / 100
      model.price = result.price
      model.total = result.price * model.quantity

      return model
    }

    //------------------------------ Custom -----------------------------
    var getCustomPrice = function (custom) {
      custom.total = custom.price;
    };

    // Pisos
    const { getPisoPrice, getPisoColors, getPlusColors } = generatePisoHandlers($http);
    // Balances
    const { getBalancePrice, getBalanceColors } = generateBalanceHandlers($http);
    // Shutters
    const { getShutterPrice, getShutterColors } = generateShutterHandlers($http);
    // Toldos
    const { getToldoPrice, getToldoColors } = generateToldoHandlers($http, $rootScope);
    // Enrollables
    const { getEnrollablePrice, getEnrollableColors } = generateEnrollableHandlers($http, $rootScope);
    // Filtrasoles
    const { getFiltrasolPrice, getFiltrasolColors } = generateFiltrasolHandlers($http, $rootScope);
    // Plus
    const { roundPrices, filterProducts, getPlusList, getMotorList, getInstallationPlusList } = generatePlusHandlers($http, $filter);

    return service;
  }
);



