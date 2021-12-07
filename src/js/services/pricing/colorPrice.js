import { pdApp, globals } from "../index";

import { generateEnrollableHandlers } from "./products/enrollable";
import { generateFiltrasolHandlers } from "./products/filtrasol";
import { generatePlusHandlers } from './products/plus'
import { generateToldoHandlers } from "./products/toldo";
import { generatePisoHandlers } from './products/piso'
import { generateBalanceHandlers } from './products/balance'
import { generateShutterHandlers } from "./products/shutter";



pdApp.factory(
  "colorPriceService",
  function ($http, $q, $filter, $rootScope, paldiService) {
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
        var productsTotal = 0;
        var balanceTotal = 0;
        var shutterTotal = 0;
        var enrollableTotal = 0;
        var filtrasolTotal = 0;
        var plusTotal = 0;
        var motorTotal = 0;
        var installationTotal = 0;
        var installationPlusTotal = 0;
        var plusFiltrasol = 0;
        var plusEnrollable = 0;

        var pisoDiscount = false;

        angular.forEach(model.products, function (product, key) {
          // - !!!!!!!!!!! ADITIONALS !!!!!!!!!!! - //
          angular.forEach(product.plusList, function (plus, key) {
            switch (plus.priceType) {
              case "PRODUCT":
                plus.total = plus.price * plus.quantity;
                break;
              case "PIECE":
                plus.total = plus.price * plus.quantity;
                break;
              case "WIDTH":
                plus.total =
                  plus.price * plus.quantity * product.width;
                break;
              case "HEIGHT":
                plus.total =
                  plus.price * plus.quantity * product.height;
                break;
              case "METER":
                plus.total =
                  plus.price * plus.quantity * product.m2;
                break;
            }

            if (model.type === "Mixta") {
              if (product.productType === "Enrollable") {
                plusEnrollable += plus.total;
              } else if (product.productType === "Filtrasol") {
                plusFiltrasol += plus.total;
              }
            }

            plusTotal += plus.total;
          });

          // - !!!!!!!!!!! MOTOR !!!!!!!!!!! - //
          angular.forEach(product.motorList, function (motor, key) {
            motor.total = motor.price * motor.quantity;
            motorTotal += motor.total;
          });

          //=============== INSTALLATION PLUS =========================//
          angular.forEach(
            product.installationPlusList,
            function (plus) {
              if (plus.priceType == "PIECE") {
                plus.total = plus.price * plus.quantity;
              } else if (plus.priceType == "METER") {
                plus.total =
                  plus.price * plus.quantity * product.m2;
              }
              installationPlusTotal += plus.total;
            }
          );

          if (model.type == "Piso") {
            if (
              product.type == "Laminados" &&
              model.client &&
              model.client.type != "DIRECT_SALE"
            ) {
              pisoDiscount = true;
            }

            installationTotal += product.installationPrice;
          }

          if (model.type == "Mixta") {
            switch (product.productType) {
              case "Balance":
                balanceTotal += product.total;
                break;
              case "Shutter":
                shutterTotal += product.total;
                break;
              case "Enrollable":
                enrollableTotal += product.total;
                break;
              case "Filtrasol":
                filtrasolTotal += product.total;
                break;
            }
          }

          productsTotal += product.total;
        });

        model.productsTotal = productsTotal;
        model.balanceTotal = balanceTotal;
        model.shutterTotal = shutterTotal;
        model.enrollableTotal = enrollableTotal;
        model.filtrasolTotal = filtrasolTotal;

        model.plusTotal = plusTotal;
        model.motorTotal = motorTotal;
        model.installationPlusTotal = installationPlusTotal;
        model.installationTotal =
          installationTotal + installationPlusTotal;

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

        if (model.type === "Mixta") {
          model.discountPercent = 0;
          model.balanceDiscount = model.discountPercentBalance
            ? (model.balanceTotal * model.discountPercentBalance) /
            100
            : 0;
          model.shutterDiscount = model.discountPercentShutter
            ? (model.shutterTotal * model.discountPercentShutter) /
            100
            : 0;
          model.enrollableDiscount = model.discountPercentEnrollable
            ? ((model.enrollableTotal +
              plusEnrollable +
              model.motorTotal) *
              model.discountPercentEnrollable) /
            100
            : 0;
          model.filtrasolDiscount = model.discountPercentFiltrasol
            ? ((model.filtrasolTotal + plusFiltrasol) *
              model.discountPercentFiltrasol) /
            100
            : 0;
          model.discount =
            model.balanceDiscount +
            model.shutterDiscount +
            model.enrollableDiscount +
            model.filtrasolDiscount;
        } else if (model.type === "Piso") {
          model.discount = model.discountPercent
            ? ((model.productsTotal +
              model.plusTotal +
              model.motorTotal) *
              model.discountPercent) /
            100
            : 0;
        } else {
          model.discount = model.discountPercent
            ? ((model.productsTotal +
              model.plusTotal +
              model.motorTotal) *
              model.discountPercent) /
            100
            : 0;
        }
        model.subTotal =
          model.productsTotal +
          model.plusTotal +
          model.motorTotal +
          model.installationTotal -
          model.discount;
        model.iva = model.subTotal * globals.iva;
        model.total = model.subTotal + model.iva;

        roundPrices(model);
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
            getBalanceColors(model);
            break;
          case "Toldo":
            getToldoColors(model);
            break;
          case "Shutter":
            getShutterColors(model);
            break;
          case "Enrollable":
            getEnrollableColors(model);
            break;
          case "Filtrasol":
            getFiltrasolColors(model);
            break;
          case "Piso":
            getPisoColors(model);
            break;
          case "Plus":
            getPlusColors(model);
            break;
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
    function getCortinaPrice(model) {
      model.total = 500
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



