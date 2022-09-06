
import {pdApp} from "../index"
import {normalizeText} from "../../utils/normalization"
import { meters_to_inches } from "../../utils/units"


pdApp.controller("QuoteNewCtrl", function ($scope, $rootScope, $state, $stateParams, paldiService, colorPriceService, $timeout, jsonService, DTOptionsBuilder, DTColumnDefBuilder, permissionsHelper,) {
  const MIXED_ORDER = "Mixta"
  $scope.updateTotals = colorPriceService.updateTotals
  
  $scope.originalMix = false;

  $scope.translateType = function(name){
    if (EXECUTION_ENV!="EXTERNAL") {
      switch(name){
        case "Wrapped Cornice":
          return "Corniza Forrada"
        case "Aluminum Gallery":
          return "Galeria de Aluminio"
        default:
          return name
      }
    }
    switch(name){
      case "De madera":
        return "Wood"
      case "Solar Blackout":
        return 'Sheer Elegance'
      case "Solar Screen":
        return "Rollershade"
      default:
        return name
    }
  }

  $scope.translateAddis = function(name){
    if (EXECUTION_ENV!="EXTERNAL") return name
    
    switch(name){
      case "Motorizacion ":
        return "Motor";
      case "Bastilla":
        return "Bastille";
      case "Cortinero y Bastones":
        return "Curtain rod and canes";
      default:
        return name
    }
  }
 
  $scope.fixedDiscounts = EXECUTION_ENV=="EXTERNAL"
  var isMixta = function(){
    let elementList = []
     $scope.productsSorted.forEach(element=>{
       if(element.products.length > 0){
         elementList.push(element.type)
       }
     })
     //console.log("IS MIXTA",elementList.length >= 2)
     return elementList.length >= 2
  }
  if(EXECUTION_ENV=="EXTERNAL"){
  paldiService.users.getExternalDiscount($rootScope.currentUser.id).then(
    res=>{
      $scope.externalDiscount = res.data
      updateDiscountExternal()
    }
  )
  }
  
  var updateDiscountExternal = function(){
    

    if($scope.quote.type=="Enrollable"){
      //console.log($scope.externalDiscount.shadesDiscount)
      $scope.quote.discountPercent = $scope.externalDiscount.shadesDiscount ?? 0
     
    }
    if($scope.quote.type=="Cortina"){
      //console.log($scope.externalDiscount.cortinaDiscount)
      $scope.quote.discountPercent = $scope.externalDiscount.cortinaDiscount ?? 0
    }
    
    if($scope.quote.type=="Balance"){
      //console.log($scope.externalDiscount.cornicesDiscount)
      $scope.quote.discountPercent = $scope.externalDiscount.cornicesDiscount ?? 0
      
    }
    if($scope.quote.type=="Toldo"){
      //console.log($scope.externalDiscount.toldosDiscount)
      $scope.quote.discountPercent = $scope.externalDiscount.toldosDiscount ?? 0
    }
    $scope.quote.discountPercentEnrollable = $scope.externalDiscount.shadesDiscount ?? 0
    $scope.quote.discountPercentBalance = $scope.externalDiscount.cornicesDiscount ?? 0
   
    if(isMixta()){
      $scope.quote.discountPercent=0
      
      
    }
    else{
    $scope.quote.discountPercentEnrollable =  0
    $scope.quote.discountPercentBalance =  0
    }
  }
  $scope.sortProductsByType = function(){
    $scope.productsSorted.forEach((productTypeList,idx) =>{
        
      productTypeList.products.sort(function(a,b){
        return a['idx']-b['idx']
      })
      
    })
  }
  
  $scope.exchangeProduct = function(current,next,productIndex){
    setIndexforProducts()
    
    $scope.productsSorted[productIndex].products[current]['idx']=next
    $scope.productsSorted[productIndex].products[next]['idx']=current
    
    sortProducts()
    $scope.sortProductsByType()
   
    
  }

  $scope.cloneProduct= function(productIndex,ListIndex){
    // console.log($scope.productsSorted)
    // console.log(productIndex,ListIndex)
    let copy = angular.copy($scope.productsSorted[ListIndex].products[productIndex])
    if(copy['idx']!=undefined) delete copy['idx']
    // console.log(copy)
    let mod = angular.copy(copy)
    //console.log(mod)
    updateMeta($scope,copy)

    //console.log("UpdatedModel",angular.copy(copy))
    // console.log($scope.productMeta)
    $scope.addProduct(copy.productType,true,copy)
  }


  $scope.filterColors = function (item) {
    //  // // console.log("Input of Filter :", item)
    //  // // console.log("Current Value: ", document.getElementById("cortinacolor").value )
    let match = document.getElementById("cortinacolor").value
    const matchval = match.toString().toLowerCase()
    const name = item.color.toLowerCase()
    const code = item.code.toLowerCase()
    //  // // console.log(matchval,name,code)
    //  // // console.log(name.includes(matchval))
    //  // // console.log(code.includes(matchval))
    if (name.includes(matchval) || code.includes(matchval))

      return item
  }

  $scope.setupTemplate = async function () {
    // Cortina setup
    const [motors, sistemas, colores, acabados, allAdditionals] = await Promise.all([paldiService.products.fetchAdditionals({
      product: "Cortina", group: "Motor",
    }), paldiService.products.fetchAdditional({
      product: "Cortina", group: "Sistema",
    }), paldiService.products.fetchColors({
      product: "Cortina",
    }), paldiService.products.fetchCortinaAcabados(), paldiService.products.fetchAllAdditionals({
      product: "Cortina",
    }),])
    $scope.productData = $scope.productData ?? {}
    $scope.productData.cortina = {
      motors, sistemas, colores, acabados, allAdditionals
    }
   
  }
  $scope.setupTemplate()


  
  $scope.balancesData ={
    'config':{
      'units':EXECUTION_ENV=="EXTERNAL"?"\"":"CM",
      'Heights':{
        'Wrapped Cornice': EXECUTION_ENV=="EXTERNAL"?[[6,6],[8,8],[10,10]]:[[15.2,0.152],[20.3,0.2],[25.4,0.254]],
        'Aluminum Gallery': EXECUTION_ENV=="EXTERNAL"?[[5,5],[8,8]]:[[12.7,0.127],[20.3,0.2032]],
      },
      'Mount':{
        'Wrapped Cornice': EXECUTION_ENV=="EXTERNAL"?["OM","IM"]:["XFM","XDM"],
        'Aluminum Gallery': EXECUTION_ENV=="EXTERNAL"?["OM","IM"]:["XFM","XDM"],
      }
    }
  }

  

  //---------------------------------------------------------------------------------------------//
  // ------------------------------------------ Clients / Sellers
  // ------------------------------------------//
  // ---------------------------------------------------------------------------------------------//
  $scope.findSellers = function (search) {
    return paldiService.users.findByRoleAndHasWarehouse("CONSULTANT", search,)
  }

  $scope.selectSeller = function (seller) {
     // // console.log("Selected seller: ", seller)
    $scope.quote.seller = seller
    $scope.sellerStep = "selected"
  }

  $scope.changeSeller = function () {
     // // console.log("Changed seller")
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
    updateDiscount()
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
    $scope.quote.discountPercent = $scope.editing ? $scope.quote.discountPercent : 0
    $scope.quote.discountPercentBalance = $scope.editing ? $scope.quote.discountPercentBalance : 0
    $scope.quote.discountPercentShutter = $scope.editing ? $scope.quote.discountPercentShutter : 0
    $scope.quote.discountPercentEnrollable = $scope.editing ? $scope.quote.discountPercentEnrollable : 0
    $scope.quote.discountPercentFiltrasol = $scope.editing ? $scope.quote.discountPercentFiltrasol : 0

    if (EXECUTION_ENV=="EXTERNAL"){
      updateDiscountExternal()
    }
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
      if (EXECUTION_ENV=="EXTERNAL") {
        client.city = "Any"
      }
      $scope.clientStep = "loading"
      paldiService.clients.save(client).then(function (client) {
        swal({
          title: (EXECUTION_ENV=="EXTERNAL"?"Client Saved Successfully" :"Cliente guardado exitosamente"), type: "success", confirmButtonText: (EXECUTION_ENV=="EXTERNAL"?"Accept" :"Aceptar"),
        })

        $scope.quote.client = client
        $scope.clientStep = "selected"
        updateDiscount()
      }, function (error) {
        //  // // console.log(error);
        swal({
          title: "Error",
          text: (EXECUTION_ENV=="EXTERNAL"?("There is already a client with the email" + client.email ):("Ya existe un cliente con el E-mail: " + client.email)),
          type: "error",
          confirmButtonText: (EXECUTION_ENV=="EXTERNAL"?"Accept" :"Aceptar"),
        })
        $scope.clientStep = "new"
      },)
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
     // // console.log("Adding new product to quote: ", product, form, model)
    //  // // console.log(product,form,model)
    // addProduct(productName, undefined, undefined) is called when adding a
    // new product from the quote-new view buttons
    if (!form) {
      $scope.cortina = {
        ...$scope.cortina, sistema: {
          ...$scope.cortina?.sistema, type: "Cortina",
        }
      }
      addNewProduct($scope, product)
    }

    // addProduct(productName, productDetails, $scope.{product}) is called
    // when a product is added from the views/console/products/{product}.html
    if (form) {
      
     
      $scope.updatePrices(product, model)
      const sellerValid = validateSeller(product, $scope)

      $scope.systemsValid = validateSystems($scope, model)

      
      //  // // console.log("Valid Systems",$scope.systemsValid)
      //  // // console.log("Valid Form",form.$valid)
      // console.log("model Total",model.total)
      //  // // console.log("Model Price",model.price)
      //  // // console.log("Valid Seller",sellerValid)
    
       

      if (( typeof(form)=='boolean' || form.$valid) && model.total && model.price && $scope.systemsValid && sellerValid ) {
        
        
        model.productType = product
        $scope.quote.type = product
        if(EXECUTION_ENV=="EXTERNAL"){
        updateDiscountExternal()
        }
       
        if (product.toUpperCase() === "CUSTOM") {
          model.seller = $scope.quote.seller
        }

        setModelColor(product, model)
        
        if(typeof(form)!='boolean'){
        model.plusList = $scope.plusList
        model.motorList = $scope.motorList
        model.installationPlusList = $scope.installationPlusList
        model.rotated = $scope.rotated
        }
        
        setModelControlHeight(product, $scope, model)

       
        setIndexforProducts()
        
        updateProductList()
       

        $scope.hasAdditionals()
        $scope.hasMultipleProducts()
        colorPriceService.updateTotals(product, $scope.quote)

        // @todo Abstract product list separation
        
        $scope.productsSorted.forEach(function (typeList) {
          typeList.products = []
        })
        sortProducts()
        // console.log("A",$scope.quote.products)
        $scope.quote.products.forEach(function (product) {
          
          orderProductsByType(product)
        })
        // console.log($scope.sortProductsByType)
        $scope.sortProductsByType()
        

        

        $scope.editFlag = false

        // clear thestate create by the quote
        $scope.cancelProduct()
        // remove the data in $scope.{product}
        angular.copy({}, model)
        if(typeof(form)!='boolean'){
        form.$validated = false
        }
      } else {
        form.$validated = true
      }
      if(EXECUTION_ENV=="EXTERNAL"){
        updateDiscountExternal()
        colorPriceService.updateTotals(product, $scope.quote)
        }
    }

    $scope.filterProducts()

    

    

    function updateProductList() {
      if ($scope.editFlag) {
        let editedProduct = angular.copy(model)
        delete editedProduct['colors']
        editedProduct['idx']=edittedProductIndex
        $scope.quote.products.splice(edittedProductIndex, 0, editedProduct,)
        $scope.productsSorted[editedObjectIndex].products.splice(editedProductIndex, 0, editedProduct,)
        editedObjectIndex = null
        editedProductIndex = null
        edittedProductIndex = null
      } else {
        let newProduct = angular.copy(model)
        let pos = $scope.quote.products.length
        delete newProduct['colors']
        newProduct['idx']=pos
        $scope.quote.products.push(newProduct)
      }
    }
  }
  function setIndexforProducts (){
    $scope.productsSorted.forEach((productTypeList,idx) =>{
      
      productTypeList.products.forEach((element,index)=>{
        if(element['idx']==undefined) element['idx']= index + ( $scope.editFlag && edittedProductIndex>index ? 0:1)
        productTypeList.products[index]=element
      })
      
    })
  }
  
  function sortProducts(){
    $scope.quote.products.sort((a,b)=>{
      if (a['idx']==undefined || b['idx']==undefined){
        if(a['idx']==undefined && b['idx']==undefined){
          return 0
        }
        else if (a['idx']==undefined){
          return 1
        }
        else{
          return -1
        }
      }
      else{
        return a['idx']-b['idx']
      }
    })
  }

  const nameMappings = {
    "Rollershade": "Solar Screen",
    "Sheer Elegance": "Solar Blackout"
  }
  
   const reverseEnrollableName = (name) => {
    return nameMappings[name] ?? name
  }
  var orderProductsByType = function (product) {
    if (EXECUTION_ENV=="EXTERNAL" && product.productType === "Enrollable"){
    product.type = reverseEnrollableName(product.type)
    }
    var pos = $scope.productsSorted.findIndex(function (t) {
      // console.log(product.productType)
      return t.type === product.productType
    })
    if(product['idx']==undefined){
      let size = $scope.productsSorted[pos].products.length
      product['idx']=size
    }
    // console.log($scope.productsSorted[pos],pos)
    $scope.productsSorted[pos].products.push(product)
  }

  $scope.cancelProduct = function () {
    $scope.valid = false
    $scope.rotated = false
    //  // // console.log($scope)

    $scope.product = ""
    $scope.plusList = []
    $scope.motorList = []
    $scope.installationPlusList = []
    $scope.color = null
    $scope.hasSystems = false

    if ($scope.editFlag == true) {
      $scope.quote.products.splice(edittedProductIndex, 0, $scope.producInEdit,)
      $scope.productsSorted[editedObjectIndex].products.splice(editedProductIndex, 0, $scope.producInEdit,)
      $scope.hasMultipleProducts()
      if ($scope.isMultiple) {
        colorPriceService.updateTotals($scope.quote.type, $scope.productsSorted[editedObjectIndex],)
        colorPriceService.updateTotals($scope.quote.type, $scope.quote,)
      } else {
        colorPriceService.updateTotals($scope.quote.type, $scope.quote,)
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

      $scope.productsSorted[indexList].products.forEach(function (product,) {
        countProductsByType++
      })

      if (countProducts >= minToRemove || countProductsByType > minToRemoveProduct || $scope.editFlag || !$scope.editing) {
        var i = $scope.quote.products.indexOf(product)
        $scope.quote.products.splice(i, 1)
        $scope.productsSorted[indexList].products.splice(indexProduct, 1,)
        $scope.hasMultipleProducts()
      } else {
        swal({
          title: "Error",
          text: (EXECUTION_ENV=="EXTERNAL"?"2 Product types are required in a custom quote" :"Se requieren mínimo 2 tipos de productos en una cotización mixta"),
          type: "error",
          confirmButtonText: (EXECUTION_ENV=="EXTERNAL"?"Accept" :"Aceptar"),
        })
      }

      colorPriceService.updateTotals($scope.quote.type, $scope.productsSorted[indexList],)
    } else {
      var i = $scope.quote.products.findIndex(function (p) {
        return angular.equals(p, product)
      })

      if (i !== -1) {
        $scope.quote.products.splice(i, 1)
        $scope.productsSorted[indexList].products.splice(indexProduct, 1,)
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

    colorPriceService.updateTotals($scope.quote.type, $scope.quote);
    // colorPriceService.updateTotals($scope.quote.type,
    // $scope.productsSorted[indexList].products[indexProduct]);
  }

  $scope.editProduct = function (product, indexList, indexProduct) {
    $scope.editFlag = true
    $scope.producInEdit = angular.copy(product)
    console.log("EDITED PRODUCT",angular.copy(product))
    if(EXECUTION_ENV=="EXTERNAL"){
      
    
      
    }
    console.log(angular.copy(product))
    editedObjectIndex = indexList
    editedProductIndex = indexProduct
  
    $scope.removeProduct(product, indexList, indexProduct)

    $scope.product = product.productType
    $scope.quote.type = product.productType

     // // console.log("Edit Product", product, indexList, indexProduct)
    $scope.valid = product.rotated === true
    $scope.valid |= product.productType === "Filtrasol" && product.type === "Filtrasol Enrollables"
    $scope.valid |= product.productType === "Enrollable" && product.type === "Enrollables"

    $scope.rotated = product.rotated
    
    switch (product.productType) {
      case "Enrollable":
        $scope.enrollable = angular.copy(product)
        $scope.updateTypeNoErasing("Enrollable", $scope.enrollable)
        $scope.colorSelected({
          label: $scope.pretty("color", product.color), value: product.color,
        }, "Enrollable", $scope.enrollable,)
        if ($scope.enrollable.controlHeight == 0) {
          $scope.controlHeightCheckbox = true
        }
        break
      case "Filtrasol":
        $scope.filtrasol = angular.copy(product)
        
        $scope.updateTypeNoErasing("Filtrasol", $scope.filtrasol)
       
        $scope.colorSelected({
          label: $scope.pretty("color", product.color), value: product.color,
        }, "Filtrasol", $scope.filtrasol,)
        if ($scope.filtrasol.controlHeight == 0) {
          $scope.controlHeightCheckbox = true
        }
        break
      case "Toldo":
        $scope.toldo = angular.copy(product)
        $scope.updateTypeNoErasing("Toldo", $scope.toldo)
        $scope.colorSelected({
          label: $scope.pretty("color", product.color), value: product.color,
        }, "Toldo", $scope.toldo,)
        break
      case "Shutter":
        $scope.shutter = angular.copy(product)
        $scope.updateTypeNoErasing("Shutter", $scope.shutter)
        $scope.colorSelected({
          label: product.color.code, value: {code: product.color},
        }, "Shutter", $scope.shutter,)
        break
      case "Balance":
        $scope.balance = angular.copy(product)
        //console.log("---------UPDATING PRICE",angular.copy($scope.balance))
        $scope.updateTypeNoErasing("Balance", $scope.balance)
        
        $scope.colorSelected({
          label: product.type != "Wrapped Cornice" ? product.color.code : product.color,
          textil: product.textil,
          value: { code: product.color, textil:product.textil},
        }, "Balance", $scope.balance,)
        break
      case "Piso":
        $scope.piso = angular.copy(product)
        $scope.updateTypeNoErasing("Piso", $scope.piso)
        product.color.m2Box = product.m2Box
        $scope.colorSelected({
          label: product.color.name + " - " + product.color.code, value: product.color,
        }, "Piso", $scope.piso,)
        break
      case "Custom":
        $scope.custom = angular.copy(product);
        $scope.selectSeller(product.seller);
        $scope.date = product.commitmentDate;
        break;
      case "Cortina":
        $scope.cortina = angular.copy(product);
        if (EXECUTION_ENV=="EXTERNAL"){
         
        }
        $scope.updateTypeNoErasing("Cortina", $scope.cortina);
    }
    
    $scope.plusList = product.plusList;
    $scope.motorList = product.motorList;
    $scope.installationPlusList = product.installationPlusList;

    $scope.addingPlus = false
    $scope.addingMotor = false

    $scope.motorsInEdit = angular.copy(product.motorList)
    $scope.plusInEdit = angular.copy(product.plusList)
    $scope.installationPlusInEdit = angular.copy(product.installationPlusList,)

    product.motorList = []
    product.plusList = []
    product.installationPlusList = []

    $scope.showSpinner = true
    $timeout(function () {
      if (product.productType == "Enrollable" || product.productType == "Filtrasol" || product.productType == "Toldo" || product.productType == "Piso") {
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
  $scope.newPlus = function (name, additionals) {
    $scope.addingPlus = true
    $scope.plusName = name
    $scope.plusTemplate = additionals
  }
  $scope.addPlus = function (plus, qty) {
     
    if (plus && qty > 0) {
      if (!$scope.plusList) {
        $scope.plusList = []
      }
      plus.value.quantity = qty
      plus.value.color = plus.color

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
      if ($scope.product == "Cortina") {
        $scope.cortina.plus = ""
        $scope.cortina.plusQuantity = ""
      }
    }
    $scope.editingPlus = false
    $scope.addingPlus = false

    $("#plus").val("")
    $("#plusQuantity").val("")
  }

  $scope.addMotor = function (motor, qty, product = undefined) {
    //  // // console.log(motor,qty,product)
    if (motor && qty > 0) {
      if (product != undefined) {
        let res = $scope.productData.cortina.motors
        res = res.filter(v => v.name == motor)
        motor = {'value': res[0]}
      }
      if (!$scope.motorList) {
        $scope.motorList = []
      }
      //  // // console.log(motor)

      motor.value.quantity = qty

      if ($scope.motorList.length > 0 && product == undefined) {
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

        for (var i = 0; i < $scope.installationPlusList.length; i++) {
          if ($scope.installationPlusList[i].name === plus.value.name) {
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
      $scope.installationPlusList.push(angular.copy($scope.installationPlusInEdit),)
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
        label: product.name, value: product,
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
    if ($scope.product == "Cortina") {
      $scope.cortina.plus = {label: product.name, value: product}
      $scope.cortina.plusQuantity = product.quantity
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
        label: product.name, value: product,
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
        var objectIndex = $scope.productsSorted.findIndex(function (p,) {
          return p.type === product.productType
        })
        $scope.productsSorted[objectIndex].hasMotor = true
      }
      if (product.plusList && product.plusList.length > 0) {
        $scope.hasPlus = true
        var objectIndex = $scope.productsSorted.findIndex(function (p,) {
          return p.type === product.productType
        })
        $scope.productsSorted[objectIndex].hasPlus = true
      }
      if (product.installationPlusList && product.installationPlusList.length > 0) {
        $scope.hasInstallationPlus = true
        var objectIndex = $scope.productsSorted.findIndex(function (p,) {
          return p.type === product.productType
        })
        $scope.productsSorted[objectIndex].hasInstallationPlus = true
      }
    }
  }

  $scope.hasMultipleProducts = function () {
    var isMultiple

    for (var i = 0; i < $scope.quote.products.length; i++) {
      for (var j = 0; j < $scope.quote.products.length; j++) {
        if ($scope.quote.products[i].productType !== $scope.quote.products[j].productType) {
          isMultiple = true
          $scope.quote.type = MIXED_ORDER
          i = j = $scope.quote.products.length
        } else {
          $scope.quote.type = $scope.quote.products[i].productType
          isMultiple = false
        }
      }
    }

    $scope.isMultiple = isMultiple
  }

  // sets $scope.productsFiltered to all the products with more than one used
  $scope.filterProducts = function () {
    $scope.productsFiltered = $scope.productsSorted.filter(function (elem,) {
      return elem.products.length > 0
    })
  }

  $scope.filterMixedProducts = function () {
    $scope.productsMixed = $scope.productsSorted.filter(function (elem,) {
      return (elem.type !== "Piso" && elem.type !== "Custom" && elem.type !== "Toldo")
    })
  }

  //---------------------------------------------------------------------------------------------//
  // ------------------------------------------ Prices
  // -------------------------------------------//
  // ---------------------------------------------------------------------------------------------//

  // @note updatePrices
  $scope.updatePrices = function (product, model) {
     // // console.log("Updating price of: ", product, model)
     // // console.log("Scope:", $scope)
    // this should not be done in here, but best place to put it
    // quick and dirty, todo: clean later
    if (product === "Cortina") {
     
  
      model.color = $scope.productData.cortina.colores[model.textil]?.filter(color => color.color.toLowerCase() === model.colorName.toLowerCase())[0]
      model.color.name = model.color.color
      model.color.type = "Cortina"

      //  // // console.log("Translated product color: ", model.color)
    }

    if (product == "Piso") {
      model.clientType = $scope.quote.client ? $scope.quote.client.type : null
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
      if ($scope.quote.discountPercentBalance > $scope.quote.clientMaxDiscount) {
        $scope.quote.discountPercentBalance = $scope.quote.clientMaxDiscount
      }

      if ($scope.quote.discountPercentBalance < 0 || !angular.isNumber($scope.quote.discountPercentBalance)) {
        $scope.quote.discountPercentBalance = 0
      }

      if ($scope.quote.discountPercentShutter > $scope.quote.clientMaxDiscount) {
        $scope.quote.discountPercentShutter = $scope.quote.clientMaxDiscount
      }

      if ($scope.quote.discountPercentShutter < 0 || !angular.isNumber($scope.quote.discountPercentShutter)) {
        $scope.quote.discountPercentShutter = 0
      }

      if ($scope.quote.discountPercentEnrollable > $scope.quote.clientMaxDiscount) {
        $scope.quote.discountPercentEnrollable = $scope.quote.clientMaxDiscount
      }

      if ($scope.quote.discountPercentEnrollable < 0 || !angular.isNumber($scope.quote.discountPercentEnrollable)) {
        $scope.quote.discountPercentEnrollable = 0
      }

      if ($scope.quote.discountPercentFiltrasol > $scope.quote.clientMaxDiscount) {
        $scope.quote.discountPercentFiltrasol = $scope.quote.clientMaxDiscount
      }

      if ($scope.quote.discountPercentFiltrasol < 0 || !angular.isNumber($scope.quote.discountPercentFiltrasol)) {
        $scope.quote.discountPercentFiltrasol = 0
      }
    } else {
      if ($scope.quote.discountPercent > $scope.quote.clientMaxDiscount) {
        $scope.quote.discountPercent = $scope.quote.clientMaxDiscount
      }

      if ($scope.quote.discountPercent < 0 || !angular.isNumber($scope.quote.discountPercent)) {
        $scope.quote.discountPercent = 0
      }
    }
    if(EXECUTION_ENV=="EXTERNAL"){
      updateDiscountExternal()
    }
    colorPriceService.updateTotals($scope.quote.type, $scope.quote)
  }

  //---------------------------------------------------------------------------------------------//
  // ------------------------------------------ QUOTE
  // --------------------------------------------//
  // ---------------------------------------------------------------------------------------------//

  $scope.save = function (client) {
 
    $scope.checkForm = true
    if ($scope.quote.notes != "" && $scope.quote.notes != null && (($scope.quote.source && $scope.quote.city) || $scope.currentUser.realRole)) {
      if($scope.currentUser.realRole){
        $scope.quote.source="."
        $scope.quote.city="."
      }
      if (!$scope.editing) {

        $scope.subQuote = $scope.quote
        $scope.productsFiltered.forEach(function (productFiltered) {
          colorPriceService.prepare(productFiltered.type, $scope.quote,)
          $scope.quote.userId = $rootScope.currentUser.id
          $scope.saveDisabled = true
        })
        
        paldiService.orders.save($scope.quote).then(function (quote) {
           // // console.log("SAVING")
           // // console.log($scope.quote)
          $scope.saveDisabled = false
          swal({
            title:  (EXECUTION_ENV=="EXTERNAL"?"Quote saved succesfully":"Cotización guardada exitosamente"), type: "success", confirmButtonText: EXECUTION_ENV=="EXTERNAL"?"Accept":"Aceptar",
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
        }, function (error) {
          $scope.saveDisabled = false
          //  // // console.log(error);
        },)
      } else {
        if ($scope.quote.type === "Mixta") {

          if(EXECUTION_ENV=="EXTERNAL"){
            $scope.productsFiltered.forEach(function (productFiltered) {
              colorPriceService.prepare(
                productFiltered.type,
                $scope.quote
              );});
   
            $scope.subquote = angular.copy($scope.quote);
            $scope.subQuote = angular.copy($scope.quote);
            $scope.updatingOrderType =false;
          } 

          $scope.quote.userId = $rootScope.currentUser.id
          $scope.saveDisabled = true
          paldiService.orders.update($scope.quote).then(function (quote) {

            if(EXECUTION_ENV=="EXTERNAL"){
              $scope.saveDisabled = false;
              $scope.quote.orderParentId = quote.id;

              $scope.filterMixedProducts();
              if(!$scope.originalMix){

                $scope.updatingOrderType =true;


                createSuborders(0);
              }
              else{
              updateSuborders(quote.id, 0);
              }
            }else{
          
            $scope.saveDisabled = false
            $scope.quote.orderParentId = quote.id
            $scope.filterMixedProducts()
            updateSuborders(quote.id, 0)
            }
            $scope.saveDisabled = false
            swal({
              title: (EXECUTION_ENV=="EXTERNAL"?"Quote edited succesfully" :"Cotización editada exitosamente"), type: "success", confirmButtonText: (EXECUTION_ENV=="EXTERNAL"?"Accept" :"Aceptar"),
            })
            $state.go("console.quote-list")
          }, function (error) {
            $scope.saveDisabled = false
            //  // // console.log(error);
          },)
        } else {
          colorPriceService.prepare($scope.quote.type, $scope.quote,)
          $scope.quote.userId = $rootScope.currentUser.id
          $scope.saveDisabled = true
          paldiService.orders.update($scope.quote).then(function (quote) {
            $scope.saveDisabled = false
            swal({
              title: (EXECUTION_ENV=="EXTERNAL"?"Quote edited Succesfully" :"Cotización editada exitosamente"), type: "success", confirmButtonText: (EXECUTION_ENV=="EXTERNAL"?"Accept" :"Aceptar"),
            })

            $state.go("console.order-details", {
              orderId: $stateParams.orderId,
            })
          }, function (error) {
            $scope.saveDisabled = false
            //  // // console.log(error);
          },)
        }
      }
    }
  }

  $scope.getTemplate = function (product) {
    //  // // console.log(product)
    var path = "js/controllers/order/products/"
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
        return path + "custom.html";
      case "Cortina":
        return path + "cortinas.html"
        case "Cortinas":
          return path + "cortinas.html"
    }
  }

  let toFraction=function(amt) {
    
    if(amt == undefined || amt ==0) return [0,0]
    if (amt > 0 && amt <= .125) return [.125,amt-.125];
    if (amt <= .25) return [.25,amt-.25];
    if (amt <= .375) return [.375,amt-.375];
    if (amt <= .5) return [.5,amt-.5];
    if (amt <= .625) return [.625,amt-.625];
    if (amt <= .75) return [.75,amt-.75];
    if (amt <= .875 ) return [.875,amt-.875];
    else return [0,0]
  }
  let to_fraction =function(val){
    val = val;
    //console.log(val)
    val = val.toString();
    val = val.split(".")
    if(val[1]!= undefined) {val[1] = parseFloat("."+val[1])}
    else{val[1]=0}
    let fracs = toFraction(val[1])
      //console.log("FRACS RESULT",fracs)
    return [Math.round(parseFloat(val[0])+parseFloat(fracs[1])),fracs[0]]
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
        model.discountPercent = $scope.quote.discountPercentEnrollable
        break
      case "Filtrasol":
        model.discountPercent = $scope.quote.discountPercentFiltrasol
        break
    }
  }

  function createSuborders(count) {
    if (count < $scope.productsMixed.length) {
      var i = count

      if(EXECUTION_ENV=="EXTERNAL"){

        if($scope.updatingOrderType){
          $scope.subquote = angular.copy($scope.subQuote)
          $scope.productsFiltered.forEach(function (productFiltered) {
            colorPriceService.prepare(
              productFiltered.type,
              $scope.subquote
            );});
            $scope.subquote.orderParentId = $scope.subQuote.id;
                  $scope.subquote.clientId = $scope.quote.client.id
                  $scope.subquote.userId = $scope.quote.user.id
         // console.log("ENABLING UPDATE",angular.copy($scope.productsFiltered))
        }

      }


      $scope.subquote.products = $scope.productsMixed[i].products
      $scope.subquote.type = $scope.productsMixed[i].type

      $scope.getSubQuoteDiscount($scope.productsMixed[i].type, $scope.subquote,)
      colorPriceService.updateTotals($scope.productsMixed[i].type, $scope.subquote,)
      
      paldiService.orders
        .saveSubOrder($scope.subquote, $scope.productsMixed[i].type)
        .then(function (suborder) {
          if(EXECUTION_ENV=="INTERNAL" || !$scope.updatingOrderType){
                $state.go("console.quote-list");
              }
          i++
          createSuborders(i)
        }, function (error) {
          $scope.saveDisabled = false
          //  // // console.log(error);
        },)
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
      $scope.getSubQuoteDiscount($scope.productsMixed[i].type, $scope.subquote,)
      colorPriceService.prepare($scope.productsMixed[i].type, $scope.subquote,)
      paldiService.orders
        .updateSuborder(orderMasterId, $scope.subquote)
        .then(function (suborder) {
          i++
          updateSuborders(orderMasterId, i)
        }, function (error) {
          $scope.saveDisabled = false
          //  // // console.log(error);
        },)
    } else {
      return
    }
  }

  //---------------------------------------------------------------------------------------------//
  // ---------------------------------------- Form Data
  // ------------------------------------------//
  // ---------------------------------------------------------------------------------------------//
  

  function  updateModelColor(product,model){
    if (model.width) {
      $scope.changeWidth(product, model);
    }
    if (model.height) {
      //console.log(model.height)
      $scope.changeHeight(product, model);
    }
    if (!model.height && !model.width) {
      $scope.updatePrices(product, model);
    }
  }

  $scope.colorSelected = async function (color, product, model) {
     //console.log("COLOR SELECTED EXECUTED", color, product, model)

    model.colorObj = color.value

    

    if(EXECUTION_ENV=="EXTERNAL"){
      var res;
      if(product=="Enrollable"){
       res = $timeout( function(){
        
        model.colorObj=$scope.enrollable.colors.find(element =>element.value.code == model.colorObj.code)
        model.colorObj = model.colorObj.value
        $scope.color = angular.copy(model.colorObj);
        $scope.valid |= model.colorObj.railRoad.toLowerCase().includes('yes');
        updateModelColor(product,model)
        
        
      },500)
      if(res!=undefined){
        await res
      }
      return

      
    }

      
    }

    if(product=='Balance'){
      model.textil = color.textil
    }
    if(EXECUTION_ENV!="EXTERNAL"){
    model.color = color
    $scope.color = color
    }
    updateModelColor(product,model)
    
  }

  $scope.rotate = (product, model) => {
    $scope.rotated = !$scope.rotated
    let temp = model.height
    if(EXECUTION_ENV=="EXTERNAL"){
      model.height = model.width - 15
      let tempwfrac = model.w_fraction
      model.w_fraction = model.h_fraction
      model.h_fraction = tempwfrac 
    }
    else{
      
    model.height = model.width - 0.3
    }
    model.width = temp
    $scope.changeWidth(product, model)
    $scope.changeHeight(product, model)

    
  }

  $scope.changeRotation = function (product, model, element) {
    const rotate = (confirmation) => {
      if (confirmation) {
        $scope.rotate(product, model)

        swal({
          title: (EXECUTION_ENV=="EXTERNAL"?"Fabric Rotated" :"Textil Girado"), type: "success", confirmButtonText: (EXECUTION_ENV=="EXTERNAL"?"Accept" :"Aceptar"),
        })
      }
    }
    if ($scope.rotated) {
      swal({
        title: (EXECUTION_ENV=="EXTERNAL"?"Do you want to return fabric to the original orientation?" :"¿Seguro que desea regresar el textil a la orientación inicial?"),
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: (EXECUTION_ENV=="EXTERNAL"?"Confirm" :"Confirmar"),
        cancelButtonText: (EXECUTION_ENV=="EXTERNAL"?"Cancel" :"Cancelar"),
        closeOnConfirm: false,
        closeOnCancel: true,
      }, rotate,)
    } else {
      swal({
        title: (EXECUTION_ENV=="EXTERNAL"?"Do you want to rotate the fabric?" :"¿Seguro que desea girar el textil?"),
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: (EXECUTION_ENV=="EXTERNAL"?"Confirm" :"Confirmar"),
        cancelButtonText: (EXECUTION_ENV=="EXTERNAL"?"Cancel" :"Cancelar"),
        closeOnConfirm: false,
        closeOnCancel: true,
      }, rotate,)
    }
  }

  $scope.changeWidth = function (product, model) {
    if(EXECUTION_ENV!="EXTERNAL"){
    if (model.width) {
      model.width = parseFloat(model.width.toString().match(/.*\..{0,3}|.*/)[0],)
      if ($scope.rotated) {
        $scope.updatePrices(product, model)
        return
      }

      if ($scope.color.maxWidth && model.width > $scope.color.maxWidth) {
        model.width = $scope.color.maxWidth
      }
      if ($scope.color.minWidth && model.width < $scope.color.minWidth) {
        model.width = $scope.color.minWidth
      }
    }
  }
  else{
    if (model.width) {
      
       // // console.log("Making Parse")
      model.width = parseFloat(model.width.toString().match(/.*\..{0,3}|.*/)[0]);

      if ($scope.rotated) {
        $scope.updatePrices(product, model);
        return;
      }
      
      const width = parseFloat(model.w_fraction ?? 0) + model.width
      if ($scope.color.maxWidth && width >$scope.color.maxWidth) {
        
        model.width = $scope.color.maxWidth - parseFloat(model.w_fraction ?? 0);
        model.width = Math.floor(model.width)
      }
      if ($scope.color.minWidth && width < $scope.color.minWidth) {
        model.width =$scope.color.minWidth - parseFloat(model.w_fraction ?? 0);
        model.width = Math.ceil(model.width ) 
      }
      model.width = parseInt(model.width)
    }
  }
    $scope.updatePrices(product, model)
  }


  $scope.changeHeight = function (product, model) {
    if(EXECUTION_ENV!="EXTERNAL"){
    if (model.height) {
      model.height = parseFloat(model.height.toString().match(/.*\..{0,3}|.*/)[0],)
      if ($scope.rotated) {
        if ($scope.color.maxHeight && model.height > $scope.color.maxWidth - 0.3) {
          model.height = $scope.color.maxWidth - 0.3
        } else {
        }
      } else if ($scope.color.maxHeight && model.height > $scope.color.maxHeight) {
        model.height = $scope.color.maxHeight
      }

      if ($scope.color.minHeight && model.height < $scope.color.minHeight) {
        model.height = $scope.color.minHeight
      }
    }
    }
    else{
      if (model.height) {
        model.height = parseFloat(model.height.toString().match(/.*\..{0,3}|.*/)[0]);
       
        const height = parseFloat(model.h_fraction ?? 0) + model.height
        if ($scope.rotated) {
          if ($scope.color.maxHeight && height >$scope.color.maxWidth - 15) {
            model.height = $scope.color.maxWidth - 15 - parseFloat(model.h_fraction ?? 0);
            model.height = Math.floor(model.height ) 
          }
        } else if ($scope.color.maxHeight && height > $scope.color.maxHeight) {
          model.height = $scope.color.maxHeight - parseFloat(model.h_fraction ?? 0);
          model.height = Math.floor(model.height)
        }
        if ($scope.color.minHeight && height < $scope.color.minHeight) {
          model.height = $scope.color.minHeight - parseFloat(model.h_fraction ?? 0);
          model.height = Math.ceil(model.height)
        }
      }
      
    }
    $scope.updatePrices(product, model)
  }

  $scope.simpleWidthTimer=''
  $scope.changeSimpleWidth = function (product, model) {

    if(EXECUTION_ENV!="EXTERNAL"){
    let color;
    let textil;
    if(product=="Cortina"){
    textil = $scope.productData.cortina.colores[model.textil]
    
    textil.forEach(element => {
      if(element.color==model.colorName)
        color=element
    });
  }

    if (model.width) {
      let width = parseFloat(model.width.toString().match(/.*\..{0,3}|.*/)[0],)
      
      if(product=="Cortina"){
      if (model.width < color.minWidth) model.width = parseFloat(color.minWidth)
      else if (model.width > color.maxWidth) model.width = parseFloat(color.maxWidth)
      else model.width = width
      }
      else{
        model.width =width
      }
    }
  }
  else{
    $timeout.cancel($scope.simpleWidthTimer)
    
    $scope.simpleWidthTimer = $timeout(()=>{
    let color;
    if(product=="Cortina"){
    let textil = $scope.productData.cortina.colores[model.textil]
    
    textil.forEach(element => {
      if(element.color==model.colorName)
        color=element
    });
    }

    if (model.width) {
      
      let width = parseFloat(model.width.toString().match(/.*\..{0,3}|.*/)[0],)
      if(product=="Cortina"){
      let w = width + parseFloat(model.w_fraction ?? 0)
      if ( w < metersToInches(color.minWidth)) model.width = Math.ceil(parseFloat(metersToInches(color.minWidth)) - parseFloat(model.w_fraction ?? 0))
      else if (w > metersToInches(color.maxWidth)) model.width = Math.floor(parseFloat(metersToInches(color.maxWidth)) - parseFloat(model.w_fraction ?? 0))
      else model.width = width
      }
      else{
        model.width = width
      }
      model.width = parseInt(model.width)
      $scope.updatePrices(product, model)
      

    }
  },1000);
  }
  $scope.updatePrices(product, model)
  }

  
  $scope.simpleHeightTimer=''
  $scope.changeSimpleHeight = function (product, model) {
    if(EXECUTION_ENV!="EXTERNAL"){
    let textil;
    let color;
    if (product=="Cortina"){
    textil= $scope.productData.cortina.colores[model.textil]
    
    textil.forEach(element => {
      if(element.color==model.colorName)
        color=element
    });
    }

    if (model.height) {
      let height = parseFloat(model.height.toString().match(/.*\..{0,3}|.*/)[0],)
      //console.log(model)
      if(model.type=="Wrapped Cornice" || model.type=="Aluminum Gallery")
      { height=parseFloat(model.height)
      
      }
      //console.log(angular.copy(height),parseFloat(model.height))
      if(product=="Cortina"){
      if (model.height < color.minHeight) model.height = parseFloat(color.minHeight)
      else if (model.height > color.maxHeight) model.height = parseFloat(color.maxHeight)
      else model.height = height
      }
      else{
        model.height=height
        
      }
    }
  }
  else{
    $timeout.cancel($scope.simpleHeightTimer)
    
    $scope.simpleHeightTimer = $timeout(()=>{
    let color;
    if(product=="Cortina"){
    let textil = $scope.productData.cortina.colores[model.textil]
    
    textil.forEach(element => {
      if(element.color==model.colorName)
        color=element
    });
  }
    
    if (model.height) {
      
      let height = parseFloat(model.height.toString().match(/.*\..{0,3}|.*/)[0],)
      if(product=="Cortina"){
      let h = height + parseFloat(model.h_fraction ?? 0)
      if ( h < metersToInches(color.minHeight)) model.height = Math.ceil(parseFloat(metersToInches(color.minHeight)) - parseFloat(model.h_fraction ?? 0))
      else if (h > metersToInches(color.maxHeight)) model.height = Math.floor(parseFloat(metersToInches(color.maxHeight)) - parseFloat(model.h_fraction ?? 0))
      else model.height = height
      }
      else{
        model.height = height
      }
      model.height = parseInt(model.height)
      
      $scope.updatePrices(product, model)

    } 
  },1000);
  }
    $scope.updatePrices(product, model)
  }

  function metersToInches(val){
    return meters_to_inches(parseFloat(val)??0)

  }

  $scope.hasControl = function (control) {
    if (control !== "N/A") {
      $("#controlHeightCheckbox").prop("checked", true)
      $scope.controlHeightCheckbox = $("#controlHeightCheckbox").prop("checked",)
    }
  }

  $scope.controlHeightChange = function () {
    $scope.controlHeightCheckbox = $("#controlHeightCheckbox").prop("checked",)
  }

  $scope.updateType = function (product, model, color) {
     // // console.log(model)
    if ($scope.rotated) {
      $scope.rotate(product, model)
    }

    if (model.type || model.sistema.type) {
      if (product == "Enrollable") {
        $scope.productMeta = $scope.enrollablesMeta[model.type]

        if ($scope.productMeta.systems != undefined) {
          $scope.hasSystems = $scope.productMeta.systems.length > 0
        } else {
          $scope.hasSystems = false
        }
      } else if (product == "Filtrasol") {
        $scope.productMeta = $scope.filtrasolesMeta[model.type]
        $scope.hasSystems = false
      } else {
        $scope.hasSystems = false
      }

      if(product=='Balance'){
        $scope.color=null;
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
      model.textil = null
      model.colorName = null
      $scope.valid = false

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
      
    
      colorPriceService.getColors(product, model)
      colorPriceService.getPlusList(product, model)
      colorPriceService.getMotorList(product, model)
      colorPriceService.getInstallationPlusList(product, model)
      colorPriceService.getPlusColorsList(product, model)
    }
    
    $scope.updatePrices(product, model)
     // console.log("Update Type", product, model)
    $scope.rotated = false
    $scope.valid = product === "Filtrasol" && model.type === "Filtrasol Enrollables"
    $scope.valid |= product === "Enrollable" && model.type === "Enrollables"
   
  }

  $scope.updateTypeNoErasing = function (product, model) {
    // console.log("UPDATING PRODUCT META")
    if (model.type) {
      if (product == "Enrollable") {
        //console.log(model.type)
        loadProductMap()
        $scope.productMeta = $scope.enrollablesMeta[model.type]
        //console.log(angular.copy($scope.productMeta),angular.copy($scope.enrollablesMeta))
        
        if ($scope.productMeta.systems != undefined) {
          $scope.hasSystems = $scope.productMeta.systems.length > 0
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
        //console.log(product,model)
      }
      //console.log(angular.copy(model),1)
      $scope.updatePrices(product, model)
      //console.log(angular.copy(model),2)
      colorPriceService.getColors(product, model)
      //console.log(angular.copy(model),3)
      colorPriceService.getPlusList(product, model)
      //console.log(angular.copy(model),4)
      colorPriceService.getMotorList(product, model)
      //console.log(angular.copy(model),5)
      colorPriceService.getInstallationPlusList(product, model)
      //console.log(angular.copy(model),6)
    }
  }

  //---------------------------------------------------------------------------------------------//
  // ---------------------------------------- Init Load
  // ------------------------------------------//
  // ---------------------------------------------------------------------------------------------//
  var loadProductMap = function () {
    jsonService.products.listEnrollables().then(function (products) {
      $scope.enrollablesMeta = products
      //console.log("Enrollables Meta",products)
    }, function (error) {
      $scope.step = "empty"
      //  // // console.log(error);
    },)

    jsonService.products.listFiltrasoles().then(function (products) {
      $scope.filtrasolesMeta = products
    }, function (error) {
      $scope.step = "empty"
      //  // // console.log(error);
    },)
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
    paldiService.orders.get($stateParams.orderId).then(function (order) {
      $timeout(function () {
        var permissions = permissionsHelper.get(order, $rootScope.currentUser,)
        if (!permissions.canEdit) {
          $state.go("console.order-details", {
            orderId: $stateParams.orderId,
          })
        }
        $scope.orderParentId = order.id
        $scope.quote = angular.copy(order)
         // console.log("Loading order",order)
        $scope.quote.products = angular.copy(order.products)

      

        $scope.quote.products.forEach(prod =>{
          if (prod.productType=="Cortina"){
            //console.log(prod)
            prod.colorName=normalizeText(prod.color.name.trim())
            prod.textil=normalizeText(prod.color.textil.trim())
          }
        })
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
                  suborder.products.forEach(function (product,) {
                    $scope.quote.products.push(product,)
                    orderProductsByType(product)
                    colorPriceService.updateTotals($scope.quote.type, $scope.quote,)
                  })
                  if(EXECUTION_ENV=="EXTERNAL"){
                    updateDiscountExternal()
                    }
                }
              })
            })
        } else {
          $scope.editSimpleQuote = true
          if ($scope.quote.products) {
            $scope.quote.products.forEach(function (product,) {
              orderProductsByType(product)
            })
            if(EXECUTION_ENV=="EXTERNAL"){
            updateDiscountExternal()
            }
          }
        }
      }, 200)

     
    }, function (error) {
      //  // // console.log(error);
      $state.go("console.order-details", {
        orderId: $stateParams.orderId,
      })
    },)
  } else if (!$scope.isCustomOrder) {
    if ($scope.currentUser) {
      if ($scope.currentUser.role != "SUPERADMIN" && $scope.currentUser.role != "CONSULTANT" && $scope.currentUser.role != "SALES_MANAGER") {
        $state.go("console.order-list")
      }
    } else {
      $timeout(function () {
        if ($scope.currentUser.role != "SUPERADMIN" && $scope.currentUser.role != "CONSULTANT" && $scope.currentUser.role != "SALES_MANAGER") {
          $state.go("console.order-list")
        }
      }, 500)
    }
  }
},)

function setModelControlHeight(product, $scope, model) {
  if (!$scope.controlHeightCheckbox) {
    return
  }

  if (product == "Enrollable" || product == "Filtrasol") {
    model.controlHeight = 0
  }
}

function setModelColor(product, model) {
    // console.log("MODEL COLOR OBJ",model.colorObj)
  if (product != "Custom") {
    if (["Toldo", "Enrollable", "Filtrasol", "Piso", // "Shutter",
    ].includes(model.productType)) {
      model.color = model.colorObj
    } else if (["Cortina"].includes(model.productType)) {
      model.color = model.color
    } else {
      model.color = model.colorObj.code
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
  if (product === "Custom" && !$scope.quote.seller) {
    sellerValid = false
  }
  return sellerValid
}




function updateMeta($scope,product){
  
  switch (product.productType) {
    case "Enrollable":
      $scope.enrollable = angular.copy(product)
      $scope.updateTypeNoErasing("Enrollable", $scope.enrollable)
      $scope.colorSelected({
        label: $scope.pretty("color", product.color), value: product.color,
      }, "Enrollable", product,)
      if ($scope.enrollable.controlHeight == 0) {
        $scope.controlHeightCheckbox = true
      }
      break
    case "Filtrasol":
      $scope.filtrasol = angular.copy(product)
      $scope.updateTypeNoErasing("Filtrasol", $scope.filtrasol)
      $scope.colorSelected({
        label: $scope.pretty("color", product.color), value: product.color,
      }, "Filtrasol", product,)
      if ($scope.filtrasol.controlHeight == 0) {
        $scope.controlHeightCheckbox = true
      }
      break
    case "Toldo":
      //console.log("UPDATING PRODUCT")
      $scope.toldo = angular.copy(product)
      $scope.updateTypeNoErasing("Toldo", $scope.toldo)
      //console.log("AAAA",$scope.toldo,"BBB",angular.copy(product))
      $scope.colorSelected({
        label: $scope.pretty("color", product.color), value: product.color,
      }, "Toldo", product,)
      break
    case "Shutter":
      $scope.shutter = angular.copy(product)
      $scope.updateTypeNoErasing("Shutter", $scope.shutter)
      $scope.colorSelected({
        label: product.color.code, value: {code: product.color},
      }, "Shutter", product,)
      break
    case "Balance":
      $scope.balance = angular.copy(product)
      $scope.updateTypeNoErasing("Balance", $scope.balance)
      $scope.colorSelected({
        label: product.type != "Wrapped Cornice" ? product.color.code : product.color,
        textil: product.textil,
        value: { code: product.color, textil:product.textil},
      }, "Balance", product,)
      break
    case "Piso":
      $scope.piso = angular.copy(product)
      $scope.updateTypeNoErasing("Piso", $scope.piso)
      product.color.m2Box = product.m2Box
      $scope.colorSelected({
        label: product.color.name + " - " + product.color.code, value: product.color,
      }, "Piso", product,)
      break
    case "Custom":
      $scope.custom = angular.copy(product);
      $scope.selectSeller(product.seller);
      $scope.date = product.commitmentDate;
      break;
    case "Cortina":
      $scope.cortina = angular.copy(product);
      $scope.updateTypeNoErasing("Cortina", product);
  }
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
  angular.copy({}, $scope.cortina);
  //  // console.log(product)
  
  
  $scope.product = product
  $scope.plusList = []
  $scope.motorList = []
  $scope.installationPlusList = []
  switch (product) {
    case "Enrollable":
      $scope.enrollable = {}
      break
    case "Filtrasol":
      $scope.filtrasol = {}
      break
    case "Shutter":
      $scope.shutter = {}
      break
    case "Toldo":
      $scope.toldo = {}
      break
    case "Balance":
      $scope.balance = {}
      break
    case "Piso":
      $scope.piso = {}
      break
    case "Cortina": // @note scope cortina im not sure why this does this :(
      $scope.cortina = {};
      break;
    case "Custom":
      $scope.custom = {};
      $scope.sellerStep = "empty";
      break;
  }
}

