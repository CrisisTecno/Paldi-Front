import {pdApp} from "./index"

pdApp.controller(
  "QuoteNewCtrl",
  function (
    $scope,
    $rootScope,
    $state,
    $stateParams,
    paldiService,
    colorPriceService,
    $timeout,
    jsonService,
    DTOptionsBuilder,
    DTColumnDefBuilder,
    permissionsHelper,
  ) {
    const MIXED_ORDER = "Mixta"

    $scope.setupTemplate = async function () {
      // Cortina setup
      const [motors, sistemas, colores, acabados] = await Promise.all([
        paldiService.products.fetchAdditionals({
          product: "Cortina",
          group: "Motor",
        }),
        paldiService.products.fetchAdditionals({
          product: "Cortina",
          group: "Sistema",
        }),
        paldiService.products.fetchColors({
          product: "Cortina",
        }),
        paldiService.products.fetchCortinaAcabados(),
      ])
      $scope.productData = $scope.productData ?? {}
      $scope.productData.cortina = {
        motors, sistemas, colores, acabados
      }
      console.log("Loaded product data: ", $scope.productData)
    }
    $scope.setupTemplate()

    //---------------------------------------------------------------------------------------------//
    // ------------------------------------------ Clients / Sellers
    // ------------------------------------------//
    // ---------------------------------------------------------------------------------------------//
    $scope.findSellers = function (search) {
      return paldiService.users.findByRoleAndHasWarehouse(
        "CONSULTANT",
        search,
      )
    }

    $scope.selectSeller = function (seller) {
      $scope.quote.seller = seller
      $scope.sellerStep = "selected"
    }

    $scope.changeSeller = function () {
      $scope.quote.seller = null
      $scope.sellerStep = "empty"
    }

    $scope.findClients = function (name) {
      return paldiService.clients.find(name)
    }

    $scope.selectClient = function (client) {
      $scope.quote.client = client
      if ($scope.product == "Piso") {
        if (!$scope.pisoModel) {
          $scope.pisoModel = ""
        }
        $scope.pisoModel.clientType = $scope.quote.client.type
        $scope.updatePrices("Piso", $scope.pisoModel)
      }
      updateDiscount()
      $scope.clientStep = "selected"
    }

    $scope.changeClient = function () {
      $scope.quote.client = null
      $scope.quote.clientMaxDiscount = 0
      $scope.quote.discountPercent = 0
      $scope.quote.discountPercentBalance = 0
      $scope.quote.discountPercentShutter = 0
      $scope.quote.discountPercentEnrollable = 0
      $scope.quote.discountPercentFiltrasol = 0
      $scope.clientStep = "loaded"
      if ($scope.product == "Piso" && $scope.pisoModel) {
        $scope.pisoModel.clientType = ""
        $scope.updatePrices("Piso", $scope.pisoModel)
      }
      colorPriceService.updateTotals($scope.quote.type, $scope.quote)
    }

    $scope.dateChanged = function (datepicker) {
      $scope.date = datepicker.date
    }

    var updateDiscount = function () {
      $scope.quote.discountPercent = $scope.editing
        ? $scope.quote.discountPercent
        : 0
      $scope.quote.discountPercentBalance = $scope.editing
        ? $scope.quote.discountPercentBalance
        : 0
      $scope.quote.discountPercentShutter = $scope.editing
        ? $scope.quote.discountPercentShutter
        : 0
      $scope.quote.discountPercentEnrollable = $scope.editing
        ? $scope.quote.discountPercentEnrollable
        : 0
      $scope.quote.discountPercentFiltrasol = $scope.editing
        ? $scope.quote.discountPercentFiltrasol
        : 0
      colorPriceService.updateTotals($scope.quote.type, $scope.quote)
    }

    $scope.addNewClient = function () {
      $scope.clientStep = "new"
    }

    $scope.cancelNewClient = function () {
      $scope.clientStep = "loaded"
    }

    $scope.saveClient = function (form, client) {
      if (form.$valid) {
        $scope.clientStep = "loading"
        paldiService.clients.save(client).then(
          function (client) {
            swal({
              title: "Cliente guardado exitosamente",
              type: "success",
              confirmButtonText: "Aceptar",
            })

            $scope.quote.client = client
            $scope.clientStep = "selected"
            updateDiscount()
          },
          function (error) {
            //console.log(error);
            swal({
              title: "Error",
              text:
                "Ya existe un cliente con el E-mail: " +
                client.email,
              type: "error",
              confirmButtonText: "Aceptar",
            })
            $scope.clientStep = "new"
          },
        )
      } else {
        form.$validated = true
      }
    }

    $scope.clientStep = "loaded"

    //---------------------------------------------------------------------------------------------//
    // ----------------------------------------- Products
    // ------------------------------------------//
    // ---------------------------------------------------------------------------------------------//

    $scope.editFlag = false
    $scope.isMultiple
    $scope.producInEdit
    $scope.motorsInEdit
    $scope.plusInEdit
    $scope.systemsValid
    var edittedProductIndex
    var editedObjectIndex
    var editedProductIndex
    var minToRemove = 3
    var minToRemoveProduct = 1
    $scope.editSimpleQuote = false

    // @todo Make the products sorted dynamic
    $scope.productsSorted = []
    $scope.productsSorted.push({type: "Balance", products: []})
    $scope.productsSorted.push({type: "Shutter", products: []})
    $scope.productsSorted.push({type: "Toldo", products: []})
    $scope.productsSorted.push({type: "Enrollable", products: []})
    $scope.productsSorted.push({type: "Filtrasol", products: []})
    $scope.productsSorted.push({type: "Piso", products: []})
    $scope.productsSorted.push({type: "Cortina", products: []})
    $scope.productsSorted.push({type: "Custom", products: []})
    $scope.productsFiltered = []
    $scope.productsMixed = []

    // @note addProduct new quote
    $scope.addProduct = function (product, form, model) {
      // addProduct(productName, undefined, undefined) is called when adding a
      // new product from the quote-new view buttons
      if (!form) {
        addNewProduct($scope, product)
      }

      // addProduct(productName, productDetails, $scope.{product}) is called
      // when a product is added from the views/console/quote/{product}.html
      if (form) {
        console.log("Handling product submit")
        console.log("Model: ", model)

        $scope.updatePrices(product, model)

        const sellerValid = validateSeller(product, $scope)

        $scope.systemsValid = validateSystems($scope, model)

        if (form.$valid && model.total && model.price && $scope.systemsValid && sellerValid) {
          model.productType = product
          $scope.quote.type = product

          if (product === "custom") {
            model.seller = $scope.quote.seller
          }

          setModelColor(product, model)

          model.plusList = $scope.plusList
          model.motorList = $scope.motorList
          model.installationPlusList = $scope.installationPlusList
          model.rotated = $scope.rotated

          setModelControlHeight(product, $scope, model)

          updateProductList()

          $scope.hasAdditionals()
          $scope.hasMultipleProducts()
          colorPriceService.updateTotals(product, $scope.quote)

          // @todo Abstract product list separation
          $scope.productsSorted.forEach(function (typeList) {
            typeList.products = []
          })
          $scope.quote.products.forEach(function (product) {
            orderProductsByType(product)
          })

          $scope.editFlag = false

          // clear thestate create by the quote
          $scope.cancelProduct()
          // remove the data in $scope.{product}
          angular.copy({}, model)

          form.$validated = false
        } else {
          form.$validated = true
        }
      }

      $scope.filterProducts()

      function updateProductList() {
        if ($scope.editFlag) {
          $scope.quote.products.splice(
            edittedProductIndex,
            0,
            angular.copy(model),
          )
          $scope.productsSorted[editedObjectIndex].products.splice(
            editedProductIndex,
            0,
            angular.copy(model),
          )
          editedObjectIndex = null
          editedProductIndex = null
          edittedProductIndex = null
        } else {
          $scope.quote.products.push(angular.copy(model))
        }
      }
    }


    var orderProductsByType = function (product) {
      var pos = $scope.productsSorted.findIndex(function (t) {
        return t.type === product.productType
      })
      $scope.productsSorted[pos].products.push(product)
    }

    $scope.cancelProduct = function () {
      $scope.valid = false
      $scope.rotated = false
      //console.log($scope)

      $scope.product = ""
      $scope.plusList = []
      $scope.motorList = []
      $scope.installationPlusList = []
      $scope.color = null
      $scope.hasSystems = false

      if ($scope.editFlag == true) {
        $scope.quote.products.splice(
          edittedProductIndex,
          0,
          $scope.producInEdit,
        )
        $scope.productsSorted[editedObjectIndex].products.splice(
          editedProductIndex,
          0,
          $scope.producInEdit,
        )
        $scope.hasMultipleProducts()
        if ($scope.isMultiple) {
          colorPriceService.updateTotals(
            $scope.quote.type,
            $scope.productsSorted[editedObjectIndex],
          )
          colorPriceService.updateTotals(
            $scope.quote.type,
            $scope.quote,
          )
        } else {
          colorPriceService.updateTotals(
            $scope.quote.type,
            $scope.quote,
          )
        }
        editedObjectIndex = null
        editedProductIndex = null
        edittedProductIndex = null
        $scope.editFlag = false
      }
    }

    $scope.removeProduct = function (product, indexList, indexProduct) {
      $scope.hasMultipleProducts()
      if ($scope.isMultiple) {
        var countProducts = 0
        var countProductsByType = 0
        $scope.productsSorted.forEach(function (product) {
          if (product.products.length > 0) {
            countProducts++
          }
        })

        $scope.productsSorted[indexList].products.forEach(function (
          product,
        ) {
          countProductsByType++
        })

        if (
          countProducts >= minToRemove ||
          countProductsByType > minToRemoveProduct ||
          $scope.editFlag ||
          !$scope.editing
        ) {
          var i = $scope.quote.products.indexOf(product)
          $scope.quote.products.splice(i, 1)
          $scope.productsSorted[indexList].products.splice(
            indexProduct,
            1,
          )
          $scope.hasMultipleProducts()
        } else {
          swal({
            title: "Error",
            text: "Se requieren mínimo 2 tipos de productos en una cotización mixta",
            type: "error",
            confirmButtonText: "Aceptar",
          })
        }

        colorPriceService.updateTotals(
          $scope.quote.type,
          $scope.productsSorted[indexList],
        )
      } else {
        var i = $scope.quote.products.findIndex(function (p) {
          return angular.equals(p, product)
        })

        if (i !== -1) {
          $scope.quote.products.splice(i, 1)
          $scope.productsSorted[indexList].products.splice(
            indexProduct,
            1,
          )
        }

        if ($scope.quote.products.length <= 0) {
          $scope.quote.type = null
        }

        if ($scope.editFlag) {
          editedObjectIndex = indexList
          editedProductIndex = indexProduct
          edittedProductIndex = i
        }
        colorPriceService.updateTotals($scope.quote.type, $scope.quote)
      }

      // colorPriceService.updateTotals($scope.quote.type, $scope.quote);
      // colorPriceService.updateTotals($scope.quote.type,
      // $scope.productsSorted[indexList].products[indexProduct]);
    }

    $scope.editProduct = function (product, indexList, indexProduct) {
      $scope.editFlag = true
      $scope.producInEdit = angular.copy(product)
      editedObjectIndex = indexList
      editedProductIndex = indexProduct
      $scope.removeProduct(product, indexList, indexProduct)

      $scope.product = product.productType
      $scope.quote.type = product.productType

      $scope.valid = product.rotated === true
      $scope.valid |=
        product.productType === "Filtrasol" &&
        product.type === "Filtrasol Enrollables"
      $scope.valid |=
        product.productType === "Enrollable" &&
        product.type === "Enrollables"

      $scope.rotated = product.rotated

      switch (product.productType) {
        case "Enrollable":
          $scope.enrollable = angular.copy(product)
          $scope.updateTypeNoErasing("Enrollable", $scope.enrollable)
          $scope.colorSelected(
            {
              label: $scope.pretty("color", product.color),
              value: product.color,
            },
            "Enrollable",
            $scope.enrollable,
          )
          if ($scope.enrollable.controlHeight == 0) {
            $scope.controlHeightCheckbox = true
          }
          break
        case "Filtrasol":
          $scope.filtrasol = angular.copy(product)
          $scope.updateTypeNoErasing("Filtrasol", $scope.filtrasol)
          $scope.colorSelected(
            {
              label: $scope.pretty("color", product.color),
              value: product.color,
            },
            "Filtrasol",
            $scope.filtrasol,
          )
          if ($scope.filtrasol.controlHeight == 0) {
            $scope.controlHeightCheckbox = true
          }
          break
        case "Toldo":
          $scope.toldo = angular.copy(product)
          $scope.updateTypeNoErasing("Toldo", $scope.toldo)
          $scope.colorSelected(
            {
              label: $scope.pretty("color", product.color),
              value: product.color,
            },
            "Toldo",
            $scope.toldo,
          )
          break
        case "Shutter":
          $scope.shutter = angular.copy(product)
          $scope.updateTypeNoErasing("Shutter", $scope.shutter)
          $scope.colorSelected(
            {
              label: product.color.code,
              value: {code: product.color},
            },
            "Shutter",
            $scope.shutter,
          )
          break
        case "Balance":
          $scope.balance = angular.copy(product)
          $scope.updateTypeNoErasing("Balance", $scope.balance)
          $scope.colorSelected(
            {
              label: product.color.code,
              value: {code: product.color},
            },
            "Balance",
            $scope.balance,
          )
          break
        case "Piso":
          $scope.piso = angular.copy(product)
          $scope.updateTypeNoErasing("Piso", $scope.piso)
          product.color.m2Box = product.m2Box
          $scope.colorSelected(
            {
              label:
                product.color.name + " - " + product.color.code,
              value: product.color,
            },
            "Piso",
            $scope.piso,
          )
          break
        case "Custom":
          $scope.custom = angular.copy(product)
          $scope.selectSeller(product.seller)
          $scope.date = product.commitmentDate
          break
      }

      $scope.plusList = product.plusList
      $scope.motorList = product.motorList
      $scope.installationPlusList = product.installationPlusList

      $scope.addingPlus = false
      $scope.addingMotor = false

      $scope.motorsInEdit = angular.copy(product.motorList)
      $scope.plusInEdit = angular.copy(product.plusList)
      $scope.installationPlusInEdit = angular.copy(
        product.installationPlusList,
      )

      product.motorList = []
      product.plusList = []
      product.installationPlusList = []

      $scope.showSpinner = true
      $timeout(function () {
        if (
          product.productType == "Enrollable" ||
          product.productType == "Filtrasol" ||
          product.productType == "Toldo" ||
          product.productType == "Piso"
        ) {
          $("#color").val($scope.pretty("color", product.color))
        } else {
          $("#color").val(product.color)
        }
        $scope.showSpinner = false
      }, 1000)

      colorPriceService.updateTotals($scope.quote.type, $scope.quote)
    }

    //---------------------------------------------------------------------------------------------//
    // --------------------------------------- Additionals
    // -----------------------------------------//
    // ---------------------------------------------------------------------------------------------//
    $scope.addPlus = function (plus, qty) {
      if (plus && qty > 0) {
        if (!$scope.plusList) {
          $scope.plusList = []
        }
        plus.value.quantity = qty

        if ($scope.plusList.length > 0) {
          var plusExists = false

          for (var i = 0; i < $scope.plusList.length; i++) {
            if ($scope.plusList[i].name === plus.value.name) {
              $scope.plusList[i].quantity = qty
              plusExists = true
              break
            }
          }
          if (!plusExists) {
            $scope.plusList.push(plus.value)
            $scope.hasPlus = true
          }
        } else {
          $scope.plusList.push(plus.value)
          $scope.hasPlus = true
        }
        $scope.editingPlus = false
        $scope.cancelPlus()
      } else {
        $scope.addingPlus = true
      }
    }

    $scope.cancelPlus = function () {
      if ($scope.editingPlus) {
        $scope.plusList.push(angular.copy($scope.plusInEdit))
        $scope.plusInEdit = null

        if ($scope.product == "Enrollable") {
          $scope.enrollable.plus = ""
          $scope.enrollable.plusQuantity = ""
        }
        if ($scope.product == "Filtrasol") {
          $scope.filtrasol.plus = ""
          $scope.filtrasol.plusQuantity = ""
        }
        if ($scope.product == "Toldo") {
          $scope.toldo.plus = ""
          $scope.toldo.plusQuantity = ""
        }
        if ($scope.product == "Shutter") {
          $scope.enrollable.plus = ""
          $scope.shutter.plusQuantity = ""
        }
        if ($scope.product == "Piso") {
          $scope.piso.plus = ""
          $scope.piso.plusQuantity = ""
        }
      }
      $scope.editingPlus = false
      $scope.addingPlus = false

      $("#plus").val("")
      $("#plusQuantity").val("")
    }

    $scope.addMotor = function (motor, qty) {
      if (motor && qty > 0) {
        if (!$scope.motorList) {
          $scope.motorList = []
        }

        motor.value.quantity = qty

        if ($scope.motorList.length > 0) {
          var motorExists = false

          for (var i = 0; i < $scope.motorList.length; i++) {
            if ($scope.motorList[i].name == motor.value.name) {
              $scope.motorList[i].quantity = qty
              motorExists = true
              break
            }
          }
          if (!motorExists) {
            $scope.motorList.push(motor.value)
            $scope.hasMotor = true
          }
        } else {
          $scope.motorList.push(motor.value)
          $scope.hasMotor = true
        }
        $scope.editingMotor = false
        $scope.cancelMotor()
      } else {
        $scope.addingMotor = true
      }
    }

    $scope.cancelMotor = function () {
      if ($scope.editingMotor) {
        $scope.motorList.push(angular.copy($scope.motorInEdit))
        $scope.motorInEdit = null

        if ($scope.product == "Enrollable") {
          $scope.enrollable.motor = ""
          $scope.enrollable.motorQuantity = ""
        }
        if ($scope.product == "Filtrasol") {
          $scope.filtrasol.motor = ""
          $scope.filtrasol.motorQuantity = ""
        }
        if ($scope.product == "Toldo") {
          $scope.toldo.motor = ""
          $scope.toldo.motorQuantity = ""
        }
      }
      $scope.editingMotor = false
      $scope.addingMotor = false

      $("#motor").val("")
      $("#motorQuantity").val("")
    }

    $scope.addInstallationPlus = function (plus, qty) {
      if (plus && qty > 0) {
        if (!$scope.installationPlusList) {
          $scope.installationPlusList = []
        }
        plus.value.quantity = qty

        if ($scope.installationPlusList.length > 0) {
          var plusExists = false

          for (
            var i = 0;
            i < $scope.installationPlusList.length;
            i++
          ) {
            if (
              $scope.installationPlusList[i].name ===
              plus.value.name
            ) {
              $scope.installationPlusList[i].quantity = qty
              plusExists = true
              break
            }
          }
          if (!plusExists) {
            $scope.installationPlusList.push(plus.value)
            $scope.hasInstallationPlus = true
          }
        } else {
          $scope.installationPlusList.push(plus.value)
          $scope.hasInstallationPlus = true
        }
        $scope.editingInstallationPlus = false
        $scope.cancelInstallationPlus()
      } else {
        $scope.addingInstallationPlus = true
      }
    }

    $scope.cancelInstallationPlus = function () {
      if ($scope.editingInstallationPlus) {
        $scope.installationPlusList.push(
          angular.copy($scope.installationPlusInEdit),
        )
        $scope.plusInEdit = null

        if ($scope.product == "Piso") {
          $scope.piso.installationPlus = ""
          $scope.piso.installationPlusQuantity = ""
        }
      }
      $scope.editingInstallationPlus = false
      $scope.addingInstallationPlus = false

      $("#installationPlus").val("")
      $("#installationPlusQuantity").val("")
    }

    $scope.removeAdditional = function (additional, additionalList) {
      var i = additionalList.indexOf(additional)
      if (i != -1) {
        additionalList.splice(i, 1)
      }
      colorPriceService.updateTotals($scope.quote.type, $scope.quote)
    }

    $scope.editPlus = function (product, productlist) {
      $scope.editingPlus = true
      $scope.addingPlus = true
      $scope.plusInEdit = angular.copy(product)
      if ($scope.product == "Enrollable") {
        $scope.enrollable.plus = {
          label: product.name,
          value: product,
        }
        $scope.enrollable.plusQuantity = product.quantity
      }
      if ($scope.product == "Filtrasol") {
        $scope.filtrasol.plus = {label: product.name, value: product}
        $scope.filtrasol.plusQuantity = product.quantity
      }
      if ($scope.product == "Toldo") {
        $scope.toldo.plus = {label: product.name, value: product}
        $scope.toldo.plusQuantity = product.quantity
      }
      if ($scope.product == "Shutter") {
        $scope.shutter.plus = {label: product.name, value: product}
        $scope.shutter.plusQuantity = product.quantity
      }
      if ($scope.product == "Piso") {
        $scope.piso.plus = {label: product.name, value: product}
        $scope.piso.plusQuantity = product.quantity
      }
      $timeout(function () {
        $("#plus").val(product.name)
        $("#plusQuantity").val(product.quantity)
      }, 5)
      $scope.removeAdditional(product, productlist)

      colorPriceService.updateTotals($scope.quote.type, $scope.quote)
    }

    $scope.editInstallationPlus = function (product, productlist) {
      $scope.editingInstallationPlus = true
      $scope.addingInstallationPlus = true
      $scope.installationPlusInEdit = angular.copy(product)

      if ($scope.product == "Piso") {
        $scope.piso.installationPlus = {
          label: product.name,
          value: product,
        }
        $scope.piso.installationPlusQuantity = product.quantity
      }
      $timeout(function () {
        $("#installationPlus").val(product.name)
        $("#installationPlusQuantity").val(product.quantity)
      }, 5)
      $scope.removeAdditional(product, productlist)
      colorPriceService.updateTotals($scope.quote.type, $scope.quote)
    }

    $scope.editMotor = function (motor, motorList) {
      $scope.editingMotor = true
      $scope.addingMotor = true
      $scope.motorInEdit = angular.copy(motor)
      if ($scope.product == "Enrollable") {
        $scope.enrollable.motor = {label: motor.name, value: motor}
        $scope.enrollable.motorQuantity = motor.quantity
      }
      if ($scope.product == "Filtrasol") {
        $scope.filtrasol.motor = {label: motor.name, value: motor}
        $scope.filtrasol.motorQuantity = motor.quantity
      }
      if ($scope.product == "Toldo") {
        $scope.toldo.motor = {label: motor.name, value: motor}
        $scope.toldo.motorQuantity = motor.quantity
      }
      $timeout(function () {
        $("#motor").val(motor.name)
        $("#motorQuantity").val(motor.quantity)
      }, 5)
      $scope.removeAdditional(motor, motorList)
      colorPriceService.updateTotals($scope.quote.type, $scope.quote)
    }

    $scope.hasAdditionals = function () {
      $scope.hasPlus = false
      $scope.hasMotor = false
      $scope.hasInstallationPlus = false

      for (var i = 0; i < $scope.quote.products.length; i++) {
        var product = $scope.quote.products[i]
        if (product.motorList && product.motorList.length > 0) {
          $scope.hasMotor = true
          var objectIndex = $scope.productsSorted.findIndex(function (
            p,
          ) {
            return p.type === product.productType
          })
          $scope.productsSorted[objectIndex].hasMotor = true
        }
        if (product.plusList && product.plusList.length > 0) {
          $scope.hasPlus = true
          var objectIndex = $scope.productsSorted.findIndex(function (
            p,
          ) {
            return p.type === product.productType
          })
          $scope.productsSorted[objectIndex].hasPlus = true
        }
        if (
          product.installationPlusList &&
          product.installationPlusList.length > 0
        ) {
          $scope.hasInstallationPlus = true
          var objectIndex = $scope.productsSorted.findIndex(function (
            p,
          ) {
            return p.type === product.productType
          })
          $scope.productsSorted[
            objectIndex
            ].hasInstallationPlus = true
        }
      }
    }

    $scope.hasMultipleProducts = function () {
      var isMultiple

      for (var i = 0; i < $scope.quote.products.length; i++) {
        for (var j = 0; j < $scope.quote.products.length; j++) {
          if (
            $scope.quote.products[i].productType !==
            $scope.quote.products[j].productType
          ) {
            isMultiple = true
            $scope.quote.type = MIXED_ORDER
            i = j = $scope.quote.products.length
          } else {
            $scope.quote.type =
              $scope.quote.products[i].productType
            isMultiple = false
          }
        }
      }

      $scope.isMultiple = isMultiple
    }

    // sets $scope.productsFiltered to all the products with more than one used
    $scope.filterProducts = function () {
      $scope.productsFiltered = $scope.productsSorted.filter(function (
        elem,
      ) {
        return elem.products.length > 0
      })
    }

    $scope.filterMixedProducts = function () {
      $scope.productsMixed = $scope.productsSorted.filter(function (
        elem,
      ) {
        return (
          elem.type !== "Piso" &&
          elem.type !== "Custom" &&
          elem.type !== "Toldo"
        )
      })
    }

    //---------------------------------------------------------------------------------------------//
    // ------------------------------------------ Prices
    // -------------------------------------------//
    // ---------------------------------------------------------------------------------------------//

    // @note updatePrices
    $scope.updatePrices = function (product, model) {
      if (product == "Piso") {
        model.clientType = $scope.quote.client
          ? $scope.quote.client.type
          : null
        $scope.pisoModel = model
      }
      colorPriceService.updatePrice(product, model, $scope.productMeta)
    }

    $scope.updateProductPrice = function (product, model) {
      colorPriceService.updatePrice(product, model, $scope.productMeta)
    }

    $scope.validateDiscounts = function () {
      $scope.discount = 0
      if ($scope.isMultiple !== undefined && $scope.isMultiple) {
        $scope.quote.discountPercent = 0
        if (
          $scope.quote.discountPercentBalance >
          $scope.quote.clientMaxDiscount
        ) {
          $scope.quote.discountPercentBalance =
            $scope.quote.clientMaxDiscount
        }

        if (
          $scope.quote.discountPercentBalance < 0 ||
          !angular.isNumber($scope.quote.discountPercentBalance)
        ) {
          $scope.quote.discountPercentBalance = 0
        }

        if (
          $scope.quote.discountPercentShutter >
          $scope.quote.clientMaxDiscount
        ) {
          $scope.quote.discountPercentShutter =
            $scope.quote.clientMaxDiscount
        }

        if (
          $scope.quote.discountPercentShutter < 0 ||
          !angular.isNumber($scope.quote.discountPercentShutter)
        ) {
          $scope.quote.discountPercentShutter = 0
        }

        if (
          $scope.quote.discountPercentEnrollable >
          $scope.quote.clientMaxDiscount
        ) {
          $scope.quote.discountPercentEnrollable =
            $scope.quote.clientMaxDiscount
        }

        if (
          $scope.quote.discountPercentEnrollable < 0 ||
          !angular.isNumber($scope.quote.discountPercentEnrollable)
        ) {
          $scope.quote.discountPercentEnrollable = 0
        }

        if (
          $scope.quote.discountPercentFiltrasol >
          $scope.quote.clientMaxDiscount
        ) {
          $scope.quote.discountPercentFiltrasol =
            $scope.quote.clientMaxDiscount
        }

        if (
          $scope.quote.discountPercentFiltrasol < 0 ||
          !angular.isNumber($scope.quote.discountPercentFiltrasol)
        ) {
          $scope.quote.discountPercentFiltrasol = 0
        }
      } else {
        if (
          $scope.quote.discountPercent >
          $scope.quote.clientMaxDiscount
        ) {
          $scope.quote.discountPercent =
            $scope.quote.clientMaxDiscount
        }

        if (
          $scope.quote.discountPercent < 0 ||
          !angular.isNumber($scope.quote.discountPercent)
        ) {
          $scope.quote.discountPercent = 0
        }
      }
      colorPriceService.updateTotals($scope.quote.type, $scope.quote)
    }

    //---------------------------------------------------------------------------------------------//
    // ------------------------------------------ QUOTE
    // --------------------------------------------//
    // ---------------------------------------------------------------------------------------------//

    $scope.save = function (client) {
      //console.log($scope.quote)
      $scope.checkForm = true
      if (
        $scope.quote.notes != "" &&
        $scope.quote.notes != null &&
        $scope.quote.source &&
        $scope.quote.city
      ) {
        if (!$scope.editing) {
          $scope.subQuote = $scope.quote
          $scope.productsFiltered.forEach(function (productFiltered) {
            colorPriceService.prepare(
              productFiltered.type,
              $scope.quote,
            )
            $scope.quote.userId = $rootScope.currentUser.id
            $scope.saveDisabled = true
          })
          paldiService.orders.save($scope.quote).then(
            function (quote) {
              $scope.saveDisabled = false
              swal({
                title: "Cotización guardada exitosamente",
                type: "success",
                confirmButtonText: "Aceptar",
              })

              if ($scope.isMultiple) {
                $scope.quote.orderParentId = quote.id
                $scope.filterMixedProducts()
                $scope.subquote = $scope.quote
                createSuborders(0)
              } else {
                if ($scope.isCustomOrder) {
                  $state.go("console.order-list")
                } else {
                  $state.go("console.quote-list")
                }
              }
            },
            function (error) {
              $scope.saveDisabled = false
              //console.log(error);
            },
          )
        } else {
          if ($scope.quote.type === "Mixta") {
            $scope.quote.userId = $rootScope.currentUser.id
            $scope.saveDisabled = true
            paldiService.orders.update($scope.quote).then(
              function (quote) {
                $scope.saveDisabled = false
                $scope.quote.orderParentId = quote.id
                $scope.filterMixedProducts()
                updateSuborders(quote.id, 0)
                $scope.saveDisabled = false
                swal({
                  title: "Cotización editada exitosamente",
                  type: "success",
                  confirmButtonText: "Aceptar",
                })
                $state.go("console.quote-list")
              },
              function (error) {
                $scope.saveDisabled = false
                //console.log(error);
              },
            )
          } else {
            colorPriceService.prepare(
              $scope.quote.type,
              $scope.quote,
            )
            $scope.quote.userId = $rootScope.currentUser.id
            $scope.saveDisabled = true
            paldiService.orders.update($scope.quote).then(
              function (quote) {
                $scope.saveDisabled = false
                swal({
                  title: "Cotización editada exitosamente",
                  type: "success",
                  confirmButtonText: "Aceptar",
                })

                $state.go("console.order-details", {
                  orderId: $stateParams.orderId,
                })
              },
              function (error) {
                $scope.saveDisabled = false
                //console.log(error);
              },
            )
          }
        }
      }
    }

    $scope.getTemplate = function (product) {
      // console.log(product)
      var path = "partials/views/console/quote/"
      switch (product) {
        case "Balance":
          return path + "balances.html"
        case "Toldo":
          return path + "toldos.html"
        case "Shutter":
          return path + "shutters.html"
        case "Enrollable":
          return path + "enrollables.html"
        case "Filtrasol":
          return path + "filtrasol.html"
        case "Piso":
          return path + "pisos.html"
        case "Custom":
          return path + "custom.html"
        case "Cortinas":
          return path + "cortinas.html"
      }
    }

    $scope.getSubQuoteDiscount = function (product, model) {
      switch (product) {
        case "Balance":
          model.discountPercent = $scope.quote.discountPercentBalance
          break
        case "Shutter":
          model.discountPercent = $scope.quote.discountPercentShutter
          break
        case "Enrollable":
          model.discountPercent =
            $scope.quote.discountPercentEnrollable
          break
        case "Filtrasol":
          model.discountPercent =
            $scope.quote.discountPercentFiltrasol
          break
      }
    }

    function createSuborders(count) {
      if (count < $scope.productsMixed.length) {
        var i = count
        $scope.subquote.products = $scope.productsMixed[i].products
        $scope.subquote.type = $scope.productsMixed[i].type

        $scope.getSubQuoteDiscount(
          $scope.productsMixed[i].type,
          $scope.subquote,
        )

        colorPriceService.updateTotals(
          $scope.productsMixed[i].type,
          $scope.subquote,
        )
        paldiService.orders
          .saveSubOrder($scope.subquote, $scope.productsMixed[i].type)
          .then(
            function (suborder) {
              $state.go("console.quote-list")
              i++
              createSuborders(i)
            },
            function (error) {
              $scope.saveDisabled = false
              //console.log(error);
            },
          )
      } else {
        return
      }
    }

    function updateSuborders(orderMasterId, count) {
      if (count < $scope.productsMixed.length) {
        var i = count
        $scope.subquote = angular.copy($scope.quote)
        $scope.subquote.products = $scope.productsMixed[i].products
        $scope.subquote.type = $scope.productsMixed[i].type
        colorPriceService.prepare(
          $scope.productsMixed[i].type,
          $scope.subquote,
        )
        paldiService.orders
          .updateSuborder(orderMasterId, $scope.subquote)
          .then(
            function (suborder) {
              i++
              updateSuborders(orderMasterId, i)
            },
            function (error) {
              $scope.saveDisabled = false
              //console.log(error);
            },
          )
      } else {
        return
      }
    }

    //---------------------------------------------------------------------------------------------//
    // ---------------------------------------- Form Data
    // ------------------------------------------//
    // ---------------------------------------------------------------------------------------------//

    $scope.colorSelected = function (color, product, model) {
      model.colorObj = color.value
      model.color = color.code
      $scope.color = angular.copy(model.colorObj)
      if (model.width) {
        $scope.changeWidth(product, model)
      }
      if (model.height) {
        $scope.changeHeight(product, model)
      }
      if (!model.height && !model.width) {
        $scope.updatePrices(product, model)
      }
    }

    $scope.rotate = (product, model) => {
      $scope.rotated = !$scope.rotated
      let temp = model.height
      model.height = model.width - 0.3
      model.width = temp
      $scope.changeWidth(product, model)
      $scope.changeHeight(product, model)

      $scope.$apply()
    }

    $scope.changeRotation = function (product, model, element) {
      const rotate = (confirmation) => {
        if (confirmation) {
          $scope.rotate(product, model)

          swal({
            title: "Textil Girado",
            type: "success",
            confirmButtonText: "Aceptar",
          })
        }
      }
      if ($scope.rotated) {
        swal(
          {
            title: "¿Seguro que desea regresar el textil a la orientación inicial?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Confirmar",
            cancelButtonText: "Cancelar",
            closeOnConfirm: false,
            closeOnCancel: true,
          },
          rotate,
        )
      } else {
        swal(
          {
            title: "¿Seguro que desea girar el textil?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Confirmar",
            cancelButtonText: "Cancelar",
            closeOnConfirm: false,
            closeOnCancel: true,
          },
          rotate,
        )
      }
    }

    $scope.changeWidth = function (product, model) {
      if (model.width) {
        model.width = parseFloat(
          model.width.toString().match(/.*\..{0,3}|.*/)[0],
        )
        if ($scope.rotated) {
          $scope.updatePrices(product, model)
          return
        }

        if (
          $scope.color.maxWidth &&
          model.width > $scope.color.maxWidth
        ) {
          model.width = $scope.color.maxWidth
        }
        if (
          $scope.color.minWidth &&
          model.width < $scope.color.minWidth
        ) {
          model.width = $scope.color.minWidth
        }
      }
      $scope.updatePrices(product, model)
    }

    $scope.changeHeight = function (product, model) {
      if (model.height) {
        model.height = parseFloat(
          model.height.toString().match(/.*\..{0,3}|.*/)[0],
        )
        if ($scope.rotated) {
          if (
            $scope.color.maxHeight &&
            model.height > $scope.color.maxWidth - 0.3
          ) {
            model.height = $scope.color.maxWidth - 0.3
          } else {
          }
        } else if (
          $scope.color.maxHeight &&
          model.height > $scope.color.maxHeight
        ) {
          model.height = $scope.color.maxHeight
        }

        if (
          $scope.color.minHeight &&
          model.height < $scope.color.minHeight
        ) {
          model.height = $scope.color.minHeight
        }
      }
      $scope.updatePrices(product, model)
    }

    $scope.changeSimpleWidth = function (product, model) {
      if (model.width) {
        model.width = parseFloat(
          model.width.toString().match(/.*\..{0,3}|.*/)[0],
        )
      }
      $scope.updatePrices(product, model)
    }

    $scope.changeSimpleHeight = function (product, model) {
      if (model.height) {
        model.height = parseFloat(
          model.height.toString().match(/.*\..{0,3}|.*/)[0],
        )
      }
      $scope.updatePrices(product, model)
    }

    $scope.hasControl = function (control) {
      if (control !== "N/A") {
        $("#controlHeightCheckbox").prop("checked", true)
        $scope.controlHeightCheckbox = $("#controlHeightCheckbox").prop(
          "checked",
        )
      }
    }

    $scope.controlHeightChange = function () {
      $scope.controlHeightCheckbox = $("#controlHeightCheckbox").prop(
        "checked",
      )
    }

    $scope.updateType = function (product, model, color) {
      if ($scope.rotated) {
        $scope.rotate(product, model)
      }

      if (model.type) {
        if (product == "Enrollable") {
          $scope.productMeta = $scope.enrollablesMeta[model.type]

          if ($scope.productMeta.systems != undefined) {
            $scope.hasSystems =
              $scope.productMeta.systems.length > 0
          } else {
            $scope.hasSystems = false
          }
        } else if (product == "Filtrasol") {
          $scope.productMeta = $scope.filtrasolesMeta[model.type]
          $scope.hasSystems = false
        } else {
          $scope.hasSystems = false
        }

        if (product == "Toldo") {
          model.operationMode = null
          model.controlSide = null
        }

        if (model.system) {
          model.system = null
        }
        color = null
        model.colorObj = null
        model.color = null
        model.width = null
        model.height = null
        $("#color").val("")
        $("#width").val("")
        $("#height").val("")
        if (product == "Piso") {
          model.m2Box = null
          model.quantity = null
        }
        if (product != "Balance" && product != "Shutter") {
          $("#plus").val("")
          $("#plusQuantity").val("")
          $("#motor").val("")
          $("#motorQuantity").val("")
        }
        if (product == "Piso") {
          $("#installationPlus").val("")
          $("#installationPlusQuantity").val("")
        }
        $scope.plusList = []
        $scope.motorList = []
        $scope.installationPlusList = []
        $scope.updatePrices(product, model)
        colorPriceService.getColors(product, model)
        colorPriceService.getPlusList(product, model)
        colorPriceService.getMotorList(product, model)
        colorPriceService.getInstallationPlusList(product, model)
        colorPriceService.getPlusColorsList(product, model)
      }
      //console.log(product)
      //console.log(model)
      $scope.rotated = false
      $scope.valid =
        product === "Filtrasol" &&
        model.type === "Filtrasol Enrollables"
      $scope.valid |=
        product === "Enrollable" && model.type === "Enrollables"
      //console.log($scope.valid)
    }

    $scope.updateTypeNoErasing = function (product, model) {
      if (model.type) {
        if (product == "Enrollable") {
          $scope.productMeta = $scope.enrollablesMeta[model.type]

          if ($scope.productMeta.systems != undefined) {
            $scope.hasSystems =
              $scope.productMeta.systems.length > 0
          } else {
            $scope.hasSystems = false
          }
        } else if (product == "Filtrasol") {
          $scope.productMeta = $scope.filtrasolesMeta[model.type]
          $scope.hasSystems = false
        } else {
          $scope.hasSystems = false
        }

        if (product == "Toldo") {
          model.operationMode = null
          model.controlSide = null
        }
        $scope.updatePrices(product, model)
        colorPriceService.getColors(product, model)
        colorPriceService.getPlusList(product, model)
        colorPriceService.getMotorList(product, model)
        colorPriceService.getInstallationPlusList(product, model)
      }
    }

    //---------------------------------------------------------------------------------------------//
    // ---------------------------------------- Init Load
    // ------------------------------------------//
    // ---------------------------------------------------------------------------------------------//
    var loadProductMap = function () {
      jsonService.products.listEnrollables().then(
        function (products) {
          $scope.enrollablesMeta = products
        },
        function (error) {
          $scope.step = "empty"
          //console.log(error);
        },
      )

      jsonService.products.listFiltrasoles().then(
        function (products) {
          $scope.filtrasolesMeta = products
        },
        function (error) {
          $scope.step = "empty"
          //console.log(error);
        },
      )
    }

    loadProductMap()
    $scope.product = ""
    $scope.addingPlus = false
    $scope.addingMotor = false
    $scope.addingInstallationPlus = false
    $scope.hasSystems = false
    $scope.controlHeightCheckbox = ""
    $scope.quote = {
      products: [],
    }

    $scope.step = "loaded"
    $scope.saveDisabled = false

    if ($state.current.name == "console.quote-new-manual") {
      if ($scope.currentUser) {
        if (!$scope.currentUser.canAdmin) {
          $state.go("console.order-list")
        }
      } else {
        $timeout(function () {
          if (!$scope.currentUser.canAdmin) {
            $state.go("console.order-list")
          }
        }, 500)
      }

      $scope.isCustomOrder = true
      $scope.date = new Date()
      $scope.addProduct("Custom")
    } else {
      $scope.isCustomOrder = false
    }

    //---------------------------------------------------------------------------------------------//
    // ------------------------------------------ Edit
    // ---------------------------------------------//
    // ---------------------------------------------------------------------------------------------//
    $scope.editing = false

    if ($stateParams.orderId) {
      paldiService.orders.get($stateParams.orderId).then(
        function (order) {
          $timeout(function () {
            var permissions = permissionsHelper.get(
              order,
              $rootScope.currentUser,
            )
            if (!permissions.canEdit) {
              $state.go("console.order-details", {
                orderId: $stateParams.orderId,
              })
            }
            $scope.orderParentId = order.id
            $scope.quote = angular.copy(order)
            $scope.quote.products = angular.copy(order.products)
            $scope.editing = true
            $scope.hasAdditionals()
            $scope.selectClient(order.client)
            if (order.type === "Mixta") {
              $scope.editSimpleQuote = false
              $scope.isMultiple = true
              $scope.quote.products = []
              paldiService.orders
                .getByOrderParent($stateParams.orderId)
                .then(function (suborders) {
                  suborders.forEach(function (suborder) {
                    if (suborder.products) {
                      suborder.products.forEach(function (
                        product,
                      ) {
                        $scope.quote.products.push(
                          product,
                        )
                        orderProductsByType(product)
                        colorPriceService.updateTotals(
                          $scope.quote.type,
                          $scope.quote,
                        )
                      })
                    }
                  })
                })
            } else {
              $scope.editSimpleQuote = true
              if ($scope.quote.products) {
                $scope.quote.products.forEach(function (
                  product,
                ) {
                  orderProductsByType(product)
                })
              }
            }
          }, 200)
        },
        function (error) {
          //console.log(error);
          $state.go("console.order-details", {
            orderId: $stateParams.orderId,
          })
        },
      )
    } else if (!$scope.isCustomOrder) {
      if ($scope.currentUser) {
        if (
          $scope.currentUser.role != "SUPERADMIN" &&
          $scope.currentUser.role != "CONSULTANT" &&
          $scope.currentUser.role != "SALES_MANAGER"
        ) {
          $state.go("console.order-list")
        }
      } else {
        $timeout(function () {
          if (
            $scope.currentUser.role != "SUPERADMIN" &&
            $scope.currentUser.role != "CONSULTANT" &&
            $scope.currentUser.role != "SALES_MANAGER"
          ) {
            $state.go("console.order-list")
          }
        }, 500)
      }
    }
  },
)

function setModelControlHeight(product, $scope, model) {
  if (!$scope.controlHeightCheckbox) {
    return
  }

  if (product == "Enrollable" || product == "Filtrasol") {
    model.controlHeight = 0
  }
}

function setModelColor(product, model) {
  if (product != "Custom") {
    if ([
      "Toldo",
      "Enrollable",
      "Filtrasol",
      "Piso",
    ].includes(model.productType)) {
      model.color = model.colorObj
    } else if (["Cortina"].includes(model.productType)) {
      model.color = model.color
    } else {
      model.colorObj.code
    }
  }
}

function validateSystems($scope, model) {
  if (!$scope.hasSystems) {
    return true
  }
  return !!model.system
}

function validateSeller(product, $scope) {
  let sellerValid = true
  if (product == "Custom" && !$scope.quote.seller) {
    sellerValid = false
  }
  return sellerValid
}

function addNewProduct($scope, product) {
  angular.copy({}, $scope.balance)
  angular.copy({}, $scope.shutter)
  angular.copy({}, $scope.toldo)
  angular.copy({}, $scope.enrollable)
  angular.copy({}, $scope.filtrasol)
  angular.copy({}, $scope.piso)
  angular.copy({}, $scope.custom)
  // @note scope cortina init
  angular.copy({}, $scope.cortina)

  $scope.product = product
  $scope.plusList = []
  $scope.motorList = []
  $scope.installationPlusList = []
  switch (product) {
    case "Enrollable":
      $scope.enrollable = ""
      break
    case "Filtrasol":
      $scope.filtrasol = ""
      break
    case "Shutter":
      $scope.shutter = ""
      break
    case "Toldo":
      $scope.toldo = ""
      break
    case "Balance":
      $scope.balance = ""
      break
    case "Piso":
      $scope.piso = ""
      break
    case "Cortina": // @note scope cortina im not sure why this does this :(
      $scope.cortina = "";
      break;
    case "Custom":
      $scope.custom = "";
      $scope.sellerStep = "empty";
      break;
  }
}

