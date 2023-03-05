import { pdApp, globals } from "../index";
import { inches_to_meters, meters_to_inches, sq_inches_to_meters, sq_meters_to_inches } from "../../utils/units";


import { generateEnrollableHandlers } from "./products/enrollable";
import { generateFiltrasolHandlers } from "./products/filtrasol";
import { generatePlusHandlers } from './products/plus'
import { generateToldoHandlers } from "./products/toldo";
import { generatePisoHandlers } from './products/piso'
import { generateBalanceHandlers } from './products/balance'
import { generateShutterHandlers } from "./products/shutter";

import { getAdditionalsSubTotal, getMotorsSubtotal } from "./totals/totals";
import { generateMoldurasHandlers } from "./products/molduras";

if(EXECUTION_ENV=="INTERNAL"){

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

	  getBankExchangeRate: function(){
		  return $http.get(
			  globals.apiURL + "/newapi/currency/exchangerate",
			  {
				  authentication:"yokozuna"
			  }
		  ).then((response)=> {
			  return response.data.data
		  })
	  },
      // Update Scope
      updatePrice: function (product, model, meta) {
         // console.log("Updating price of:", model)
       
       
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
		  case "Cortina Filtrasol":
			getCortinaFiltrasolPrice(model)
			break;
		  case "Moldura":
			getMoldingPrice(model)
			break;
          case "Custom":
            getCustomPrice(model);
            break;
        }
		// console.log(model.price)
		
       
       
        
      },

      updateTotals: function (product, model) {
       
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
        // // console.log('Calculated', totals)
        for (const [key, value] of Object.entries(totals)) {
          model[key] = value
        }


		
        // Update Plus Total
        const additionalTotals = getAdditionalsSubTotal(model)
         // console.log("Calculated additional totals: ", additionalTotals)
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
		case "Cortina Filtrasol":
				model.cortinaFiltrasol = filterProducts(
				  model.products,
				  product
				)
				break;
          case "Piso":
            model.pisos = filterProducts(model.products, product);
            break;
		case "Moldura":
				model.molduras = filterProducts(model.products, product);
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
		console.log(product)
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
		  case "Moldura":
			return getMoldingTypes(model);	
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

      // // console.log("Calculating cortina price for ", model)
      const payload = {
        product: "Cortina",
        finish: model.finish,
        textil: model.textil,
        width: model.width,
        height: model.height,
      }

      const result = await paldiService.products.fetchPrice(payload)
      // // console.log("Calculated cortina price", result)
      model.m2 = Math.round(model.width * model.height * 100) / 100
      model.price = result.price
      model.total = result.price * model.quantity

      return model
    }

	async function getCortinaFiltrasolPrice(model) {
		if (!model)
		  return
  
		 // console.log("Calculating cortina price for ", model)
		const payload = {
		  product: "Cortina Filtrasol",
		  finish: model.finish,
		  textil: model.textil,
		  width: model.width,
		  height: model.height,
		}
  
		const result = await paldiService.products.fetchPrice(payload)
		 // console.log("Calculated cortina price", result)
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
	//molduras

	const { getMoldingTypes, getMoldingPrice} = generateMoldurasHandlers($http,$filter)

    return service;
  }
);
}





else{
   //////////////Color Price EN
   pdApp.factory(
	"colorPriceService",
	function ($http, $q, $filter, $rootScope, paldiService, pricingService) {
		var service = {
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

			updatePrice: function (product, model, meta) {
        // // console.log(product, model, meta)
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
					case "Custom":
						getCustomPrice(model);
						break;
					case "Cortina":
						getCortinaPrice(model);
						break;
				}
			},

      updateTotals: function(product, model) {
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
					case "Piso":
						model.pisos = filterProducts(model.products, product);
						break;
						case "Cortina":
							model.cortinas = filterProducts(
							  model.products,
							  product
							)
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
            // // console.log('API CALL: /pricing/prices/piso')
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
//------------------------------ Cortinas ----------------------------

	async function getCortinaPrice(model) {
		if (!model)
		return

		
		const payload = {
		product: "Cortina",
		finish: model.finish,
		textil: model.textil,
		width: model.width,
		height: model.height,
		}

		const result = await paldiService.products.fetchPrice(payload)
		// // console.log("Calculated cortina price", result)
		model.m2 = Math.round(model.width * model.height * 100) / 100
		model.price = result.price
		model.total = result.price * model.quantity

		return model
	}
		//------------------------------ Custom ------------------------------
		var getCustomPrice = function (custom) {
			custom.total = custom.price;
		};

		//------------------------------ Pisos ------------------------------
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
						response.data.forEach(function (element, index) {
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
		//------------------------------ Balances ------------------------------
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
        // // console.log(balance)
        const obj = {
          ...balance, 
          width: inches_to_meters(balance.width + parseFloat(balance.w_fraction ?? 0)).toFixed(4),
          height: inches_to_meters(balance.height + parseFloat(balance.h_fraction ?? 0)).toFixed(4),
		  textil: balance.textil
        }
				$http
					.post(globals.apiURL + "/pricing/prices/balance", obj, {
						authentication: "yokozuna",
					})
					.then(function (response) {
            // // console.log('API CALL: /pricing/prices/balance', response)
						var price = response.data.price;
						balance.unit = price;
						balance.price = price;

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
            // // console.log('API CALL: /pricing/colors/balances/', response)
            response.data.forEach((element) => {
              // element.minWidth= meters_to_inches(parseFloat(element.minWidth))
              element.maxWidth = meters_to_inches(parseFloat(element.maxWidth))
              // element.minHeight= meters_to_inches(parseFloat(element.minHeight))
              element.maxHeight = meters_to_inches(parseFloat(element.maxHeight))
            })
						balance.colors = [];
						response.data.forEach(function (element, index) {
							balance.colors.push({
								label: element.code,
								textil:element.textil,
								value: element,
							});
						});
					});
			}
		};

		//------------------------------ Shutters ------------------------------
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
            price = inches_to_meters(price)
						shutter.unit = price;

						var ft = 12;
						var incheQuantity = 0;

						if (shutter.installationType == "Por fuera") {
							incheQuantity = 6;
						} else {
							incheQuantity = 4;
						}
						var m2 =  
							(shutter.width  + parseFloat(shutter.w_fraction ?? 0) + incheQuantity) *
							(shutter.height + parseFloat(shutter.h_fraction ?? 0) + incheQuantity);
            // // console.log(m2)
						m2 = m2 >= ft * 8 ? m2 : ft * 8;
						// shutter.m2 = Math.round(m2 * 100) / 100;
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
            // // console.log('API CALL: /pricing/colors/shutters/', response)
            response.data.forEach((element) => {
              // element.minWidth= meters_to_inches(parseFloat(element.minWidth))
              element.maxWidth = meters_to_inches(parseFloat(element.maxWidth))
              // element.minHeight= meters_to_inches(parseFloat(element.minHeight))
              element.maxHeight = meters_to_inches(parseFloat(element.maxHeight))
            })
						shutter.colors = [];
						response.data.forEach(function (element, index) {
							shutter.colors.push({
								label: element.code,
								value: element,
							});
						});
					});
			}
		};

		//------------------------------ Toldos ------------------------------
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
				// toldo.m2 = Math.round(toldo.m2 * 100) / 100;
			} else {
				toldo.m2 = null;
			}

			if (isValid) {
				var obj = {
					type: toldo.type,
					line: toldo.colorObj.line,
					textil: toldo.colorObj.textil,
					code: toldo.colorObj.code,
					width: inches_to_meters(toldo.width + parseFloat(toldo.w_fraction || 0)),
					height: inches_to_meters(toldo.height + parseFloat(toldo.h_fraction || 0)),
				};
				$http
					.post(globals.apiURL + "/pricing/prices/toldo", obj, {
						authentication: "yokozuna",
					})
					.then(function (response) {
            // // console.log('API CALL: /pricing/prices/toldo')
						if (!response.data) {
							toldo.doable = false;
							toldo.price = null;
							toldo.total = null;
						} else {
							var price = response.data.price;
              price = sq_inches_to_meters(price)
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
            // // console.log('API CALL: /pricing/colors/toldos', response)
            
            response.data.forEach((element) => {
              element.minWidth= meters_to_inches(parseFloat(element.minWidth))
              element.maxWidth = meters_to_inches(parseFloat(element.maxWidth))
              element.minHeight= meters_to_inches(parseFloat(element.minHeight))
              element.maxHeight = meters_to_inches(parseFloat(element.maxHeight))
            })
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

		//------------------------------ Enrollables ------------------------------
		var getEnrollablePrice = function (enrollable, meta) {
			var validateMin = function (value, isUnitPrice) {
				return value;
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

      const width = inches_to_meters(enrollable.width + parseFloat(enrollable.w_fraction ?? 0))
      const height = inches_to_meters(enrollable.height + parseFloat(enrollable.h_fraction ?? 0))
      // // console.log("---------------------- DIMENSIONS")
      // // console.log(width, height)

			if (enrollable.width && enrollable.height) {
				enrollable.m2 =
					validateMin(width, isUnitPrice) *
					validateMin(height, isUnitPrice);
				// enrollable.m2 = Math.round(enrollable.m2 * 100) / 100;
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
					obj.width = validateMin(width, isUnitPrice);
					obj.height = validateMin(height, isUnitPrice);
				} else {
					obj.system =
						enrollable.system != "N/A" ? enrollable.system : null;
				}

				$http
					.post(globals.apiURL + "/pricing/prices/enrollable", obj, {
						authentication: "yokozuna",
					})
					.then(function (response) {
              //// console.log('API CALL: /pricing/prices/enrollable', response)
						if (!response.data) {
							enrollable.doable = false;
							enrollable.unit = null;
							enrollable.price = null;
							enrollable.total = null;
						} else {
							enrollable.doable = true;
							var price = response.data.price;
							var priceType = response.data.priceType;
							var m2 =
								enrollable.m2 &&
								enrollable.m2 < 1 &&
								isUnitPrice
									? sq_meters_to_inches(1)
									: sq_meters_to_inches(enrollable.m2);

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
      enrollable.m2 = sq_meters_to_inches(enrollable.m2 == 1 ? 1 : enrollable.m2)
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
            // // console.log('API CALL: /pricing/colors/enrollables/', response)
            response.data.forEach((element) => {
              // element.minWidth= meters_to_inches(parseFloat(element.minWidth))
              element.maxWidth = meters_to_inches(parseFloat(element.maxWidth))
              // element.minHeight= meters_to_inches(parseFloat(element.minHeight))
              element.maxHeight = meters_to_inches(parseFloat(element.maxHeight))
            })
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

		//------------------------------ Filtrasoles ------------------------------
		var getFiltrasolPrice = function (filtrasol, meta) {
			var validateMin = function (value) {
				return value;
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


      const width = filtrasol.width + parseFloat(filtrasol.w_fraction ?? 0)
      const height = filtrasol.height + parseFloat(filtrasol.h_fraction ?? 0)

			if (filtrasol.width && filtrasol.height) {
				filtrasol.m2 =
					validateMin(width) *
					validateMin(height);
				// filtrasol.m2 = Math.round(filtrasol.m2 * 100) / 100;
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
					obj.width = inches_to_meters(width);
					obj.height = inches_to_meters(height);
				}

				$http
					.post(globals.apiURL + "/pricing/prices/filtrasol", obj, {
						authentication: "yokozuna",
					})
					.then(function (response) {
            // // console.log('API CALL: /pricing/prices/filtrasol')
            // // console.log(response)
						if (!response.data) {
							filtrasol.doable = false;
							filtrasol.unit = null;
							filtrasol.price = null;
							filtrasol.total = null;
						} else {
							filtrasol.doable = true;
							var price = response.data.price;
              price = sq_inches_to_meters(price)
							var priceType = response.data.priceType;
							var m2 =
								filtrasol.m2 && filtrasol.m2 < 1
									? 1
									: sq_meters_to_inches(filtrasol.m2);

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
            // // console.log('API CALL: /pricing/colors/filtrasoles/', response)
            response.data.forEach((element) => {
              // element.minWidth= meters_to_inches(parseFloat(element.minWidth))
              element.maxWidth = meters_to_inches(parseFloat(element.maxWidth))
              // element.minHeight= meters_to_inches(parseFloat(element.minHeight))
              element.maxHeight = meters_to_inches(parseFloat(element.maxHeight))
            })
            // // console.log(response)
						filtrasol.colors = [];
						response.data.forEach(function (element, index) {
							filtrasol.colors.push({
								label: $rootScope.pretty("color", element),
								value: element,
							});
						});
            // // console.log(filtrasol.colors)
					});
			}
		};

		//------------------------------ Plus ------------------------------
		var getPlusList = function (model) {
			$http
				.get(globals.apiURL + "/pricing/plus/" + model.type, {
					authentication: "yokozuna",
				})
				.then(function (response) {
					model.plusList = [];
					response.data.forEach(function (element, index) {
						model.plusList.push({
							label:
								element.name +
								" (" +
								$filter("currency")(element.price) +
								")",
							value: element,
						});
					});
				});
		};

		var getMotorList = function (model) {
			$http
				.get(globals.apiURL + "/pricing/plus/motor/" + model.type, {
					authentication: "yokozuna",
				})
				.then(function (response) {
					model.motorList = [];
					response.data.forEach(function (element, index) {
						model.motorList.push({
							label:
								element.name +
								" (" +
								$filter("currency")(element.price) +
								")",
							value: element,
						});
					});
				});
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
								label:
									element.name +
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
			// model.productsTotal = model.productsTotal.toFixed(2);

			// model.plusTotal = model.plusTotal.toFixed(2);
			// model.motorTotal = model.motorTotal.toFixed(2);
			// model.installationPlusTotal =
				// model.installationPlusTotal.toFixed(2);
			// model.installationTotal = model.installationTotal.toFixed(2);

			// model.discount = model.discount.toFixed(2);
			// model.subTotal = model.subTotal.toFixed(2);
			// model.iva = model.iva.toFixed(2);
			// model.total = model.total.toFixed(2);
		};

		var filterProducts = function (productsArray, productType) {
			var productsFiltered = productsArray.filter(function (elem) {
				return elem.productType === productType;
			});
			return productsFiltered;
		};

		return service;
	}
);
}


