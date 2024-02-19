
import {pdApp} from "../index"
import {normalizeText} from "../../utils/normalization"
import { meters_to_inches } from "../../utils/units"
import { apply } from "file-loader"


pdApp.controller("QuoteNewCtrl", function ($scope, $rootScope, $state, $stateParams, ngDialog, paldiService, colorPriceService, $timeout, jsonService, DTOptionsBuilder, DTColumnDefBuilder, permissionsHelper,) {
  const MIXED_ORDER = "Mixta"
  $scope.updateTotals = colorPriceService.updateTotals
 
  $scope.roleUser = {};
  setTimeout(() => {
    $scope.roleUser = $rootScope.currentUser;
    
  }, 1000);
  
  $scope.originalMix = false;
  $scope.needsLoadProjects = true;

  $scope.ngDialog = ngDialog;
  $scope.isInternalEnv = EXECUTION_ENV=="INTERNAL"
  

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
      
      $scope.quote.discountPercent = $scope.externalDiscount.shadesDiscount ?? 0
     
    }
    if($scope.quote.type=="Cortina"){
      
      $scope.quote.discountPercent = $scope.externalDiscount.cortinaDiscount ?? 0
    }
    
    if($scope.quote.type=="Balance"){
      
      $scope.quote.discountPercent = $scope.externalDiscount.cornicesDiscount ?? 0
      
    }
    if($scope.quote.type=="Toldo"){
      
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
    
    
    let copy = angular.copy($scope.productsSorted[ListIndex].products[productIndex])
    if(copy['idx']!=undefined) delete copy['idx']
    
    let mod = angular.copy(copy)
    
    updateMeta($scope,copy)

    
    
    $scope.addProduct(copy.productType,true,copy)
  }


  $scope.filterColors = function (item) {
    
    
    let match = document.getElementById("cortinacolor").value
    const matchval = match.toString().toLowerCase()
    const name = item.color.toLowerCase()
    const code = item.code.toLowerCase()
    
    
    
    if (name.includes(matchval) || code.includes(matchval))

      return item
  }

  $scope.setupTemplate = async function () {
    let motorGroup = EXECUTION_ENV=="EXTERNAL"?"Motorized tracks":"Motor"
    const [motors, sistemas, colores, acabados, allAdditionals] = await Promise.all([paldiService.products.fetchAdditionals({
      product: "Cortina", group: motorGroup,
    }), paldiService.products.fetchAdditional({
      product: "Cortina", group: "Sistema",
    }), paldiService.products.fetchColors({
      product: "Cortina",
    }), paldiService.products.fetchCortinaAcabados(),
    paldiService.products.fetchAllAdditionals({
      product: "Cortina",
    }),])
    $scope.productData = $scope.productData ?? {}
    $scope.productData.cortina = {
      motors, sistemas, colores, acabados, allAdditionals
    }

    if(EXECUTION_ENV=="INTERNAL"){
    const [motors2, sistemas2, colores2, acabados2, allAdditionals2] = await Promise.all([paldiService.products.fetchAdditionals({
      product: "Cortina Filtrasol", group: "Motor",
    }), paldiService.products.fetchAdditional({
      product: "Cortina Filtrasol", group: "Sistema",
    }), paldiService.products.fetchColors({
      product: "Cortina Filtrasol",
    }), paldiService.products.fetchCortinaFiltrasolAcabados(), paldiService.products.fetchAllAdditionals({
      product: "Cortina Filtrasol",
    }),])
    // console.log({
    //   motors:motors2, sistemas:sistemas2, colores:colores2, acabados:acabados2, allAdditionals:allAdditionals2
    // });
    $scope.productData = $scope.productData ?? {}
    $scope.productData.cortinaFiltrasol = {
      motors:motors2, sistemas:sistemas2, colores:colores2, acabados:acabados2, allAdditionals:allAdditionals2
    }
    
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
  $scope.findSellers = async function (search) {
    let sales = await paldiService.users.findByRoleAndHasWarehouse("SALES_MANAGER",search,)
    let consultant = await paldiService.users.findByRoleAndHasWarehouse("CONSULTANT", search,)
    sales = [...sales , ...consultant]
    return sales
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

  $scope.openEditClient = function(){
  $scope.dialog = $scope.ngDialog.open({
    template: "js/controllers/order/products/client-pop-up.html",
    // template: "partials/views/console/installation-sheet/form-create.html",
    scope: $scope,
    showClose: false,
    closeOnClickOutside: false,
    closeByDocument: false})
  }

  $scope.updateClient = function(form,client){
    paldiService.clients.update(client).then(
      function(elem){
      if(elem && elem.deleted==false){
        $scope.dialog.close()
        $scope.selectClient(client)
      }

      swal({
        title:  (EXECUTION_ENV=="EXTERNAL"?"Client Modified Successfully" :"Cliente modificado exitosamente"),
        type: "success",
        confirmButtonText: (EXECUTION_ENV=="EXTERNAL"?"Accept":"Aceptar"),
      });

    },
    function (error) {
      
      swal({
        title: "Error",
        text:
        (EXECUTION_ENV=="EXTERNAL"?"There is already a client with the E-mail: ":"Ya existe un cliente con el E-mail: ") +
          client.email,
        type: "error",
        confirmButtonText: (EXECUTION_ENV=="EXTERNAL"?"Accept":"Aceptar"),
      });
    }
  )
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
    
    if(client.bitrixId!=null && $scope.needsLoadProjects) $scope.bitrixProjectExists = true 
    else $scope.bitrixProjectExists = false
    //$scope.bitrixProjectExists = true
    $scope.loadProjects(client.bitrixId)
    $scope.clientStep = "selected"
  }

  $scope.loadProjects = async(clientId)=>{
    $scope.loadEnded = false
    $scope.projectsLoaded =  new Promise(function(resolve, reject){
      $scope.promiseResolve = resolve;
      $scope.promiseReject = reject;
    });
    $scope.projects = await paldiService.bitrix.getBitrixProjects(clientId)
    $scope.promiseResolve();
    
    
    $scope.loadEnded = true
    $scope.$apply()  
  }

  $scope.setBitrixId = function(project, apply=false){
    let filteredOptions = $scope.projects.filter(x=>x.ID==project.ID)
    
    if(filteredOptions.length==0){
      $scope.quote.project = project.Title
      $scope.quote.bitrixDealId = undefined
      $scope.quote.source = project.Source
      $scope.bitrixProjectExists = false
      if(apply)
    {
      $scope.$apply()
    }
      
      

   
    }
    else{

    $scope.quote.project = project.Title
    $scope.quote.bitrixDealId = project.ID
    $scope.quote.source = project.Source
    $scope.quote.option=project
    if(apply)
    {
      $scope.$apply()
    }
    

    }

    
    
  }

  $scope.toggleProject = function(){
    $scope.bitrixProjectExists = !$scope.bitrixProjectExists
    if($scope.quote.project){
      $scope.quote.project = undefined
      $scope.quote.bitrixDealId = undefined
    } 
  }



  $scope.changeClient = function () {
    $scope.quote.client = null
    $scope.quote.clientMaxDiscount = 0

    $scope.quote.discountPercent = 0
    $scope.quote.discountPercentBalance = 0
    $scope.quote.discountPercentShutter = 0
    $scope.quote.discountPercentEnrollable = 0
    $scope.quote.discountPercentFiltrasol = 0
    $scope.quote.discountPercentCortina = 0
    $scope.quote.discountPercentPiso =0
    $scope.quote.discountPercentMoldura =0
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
    $scope.quote.discountPercentCortina = $scope.editing ? $scope.quote.discountPercentCortina : 0
    $scope.quote.discountPercenPiso = $scope.editing ? $scope.quote.discountPercentPiso : 0
    $scope.quote.discountPercentMoldura = $scope.editing ? $scope.quote.discountPercentMoldura : 0

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
  $scope.productetk = false
  $scope.productetk2 = false
  $scope.productetk3 = false

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
  $scope.productsSorted.push({type: "Piso Eteka", products: []})
  $scope.productsSorted.push({type: "Cortina", products: []})
  $scope.productsSorted.push({type: "Cortina Filtrasol", products: []})
  $scope.productsSorted.push({type: "Moldura", products: []})
  $scope.productsSorted.push({type: "Custom", products: []})
  $scope.productsFiltered = []
  $scope.productsMixed = []

  

  // @note addProduct new quote
  $scope.addProduct = function (product, form, model) {
    // if($scope.currentUser.role ==='CONSULTANT_MAYOR' ||'SUPERADMIN'){
      
    if($scope.currentUser.role ==='CONSULTANT_MAYOR' ){
      
      //console.log($scope.currentUser.role )
      $scope.productetk = true
      $scope.productetk2 = true
    }
    if(product==='Moldurax' ){
      //console.log($scope.currentUser.role )
      $scope.productetk = true
      $scope.productetk2 = true
      $scope.productetk3 = true

      product='Moldura'
      
    }else{
      if(product==='Moldura' ){
       // console.log($scope.currentUser.role )
      $scope.productetk = false
      }
    }
    //console.log( $scope.productetk )
    //1
    // addProduct(productName, undefined, undefined) is called when adding a
    // new product from the quote-new view buttons
   
    if (!form) {
      $scope.cortina = {
        ...$scope.cortina, sistema: {
          ...$scope.cortina?.sistema, type: "Cortina",
        }
      }
      $scope.cortinaFiltrasol ={
        ...$scope.cortinaFiltrasol, sistema: {
          ...$scope.cortinaFiltrasol?.sistema, type: "Cortina Filtrasol",
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
        if(product!="Moldura"){
          colorPriceService.updateTotals(product, $scope.quote)
        }
        // @todo Abstract product list separation
        $scope.productsSorted.forEach(function (typeList) {
          typeList.products = []
        })
        sortProducts()
        $scope.quote.products.forEach(function (product) {
          orderProductsByType(product)
        })
        $scope.sortProductsByType()
        sortProducts()
        if(product=="Moldura"){
          colorPriceService.updateTotals(product, $scope.quote)
        }
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
      
      return t.type === product.productType
    })
    if(product['idx']==undefined){
      let size = $scope.productsSorted[pos].products.length
      product['idx']=size
    }
    $scope.productsSorted[pos].products.push(product)
  }



  $scope.cancelProduct = function () {
    $scope.valid = false
    $scope.rotated = false
    

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
  $scope.getProductIndex = function(indexProd,index){
    let num = 0
    
    for(let i =0; i< index;i++){
      num += $scope.productsSorted[i].products.length
    }
    return num +1 + indexProd
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
    
    if(EXECUTION_ENV=="EXTERNAL"){
      
    
      
    }
    
    editedObjectIndex = indexList
    editedProductIndex = indexProduct
  
    $scope.removeProduct(product, indexList, indexProduct)

    $scope.product = product.productType
    $scope.quote.type = product.productType

     
    $scope.valid = product.rotated === true
    $scope.valid |= product.productType === "Filtrasol" && product.type === "Filtrasol Enrollables"
    $scope.valid |= product.productType === "Enrollable" && product.type === "Enrollables"

    $scope.rotated = product.rotated
    ;
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
        
        $scope.updateTypeNoErasing("Balance", $scope.balance)
        
        $scope.colorSelected({
          label: product.type != "Wrapped Cornice" ? product.color.code : product.color,
          textil: product.textil,
          value: EXECUTION_ENV=="EXTERNAL"?{ code: product.color, textil:product.textil,shipping:product.shipping}:{ code: product.color, textil:product.textil},
        }, "Balance", $scope.balance,)
        break
      case "Piso":
        $scope.piso = angular.copy(product)
        $scope.updateTypeNoErasing("Piso", $scope.piso)
        product.color.m2Box = product.m2Box
        
       
        $scope.colorSelected({
          label: product.color.name, value: product.color,
        }, "Piso", $scope.piso,)
        break
      case "Moldura":
        
        if(!product.motorList) product.motorList = []
        if(!product.plusList) product.plusList =[]
        $scope.moldura = angular.copy(product)
        
        $scope.updateTypeNoErasing("Moldura", $scope.moldura)
        
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
        break;
      case "Cortina Filtrasol":
        $scope.cortinaFiltrasol = angular.copy(product)
        $scope.updateTypeNoErasing("Cortina Filtrasol", $scope.cortinaFiltrasol);
        break;
    }
    ;
    
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
      if ($scope.product == "Cortina Filtrasol") {
        $scope.cortinaFiltrasol.plus = ""
        $scope.cortinaFiltrasol.plusQuantity = ""
      }
    }
    $scope.editingPlus = false
    $scope.addingPlus = false

    $("#plus").val("")
    $("#plusQuantity").val("")
  }

  $scope.addMotor = function (motor, qty, product = undefined) {
    
    if (motor && qty > 0) {
      if (product != undefined) {
        let res = $scope.productData.cortina.motors
        res = res.filter(v => v.name == motor)
        motor = {'value': res[0]}
      }
      if (!$scope.motorList) {
        $scope.motorList = []
      }
      

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
    if ($scope.product == "Cortina Filtrasol") {
      $scope.cortinaFiltrasol.plus = {label: product.name, value: product}
      $scope.cortinaFiltrasol.plusQuantity = product.quantity
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
      return ( elem.type !== "Custom" && elem.type !== "Toldo")
    })
  }

  //---------------------------------------------------------------------------------------------//
  // ------------------------------------------ Prices
  // -------------------------------------------//
  // ---------------------------------------------------------------------------------------------//

  // @note updatePrices
  $scope.updatePrices = function (product, model,etk) {
    // this should not be done in here, but best place to put it
    // quick and dirty, todo: clean later

    //2
    if (product === "Cortina") {

      model.color = $scope.productData.cortina.colores[model.textil]?.filter(color => color.color.toLowerCase() == model.colorName.toLowerCase())[0]

      model.color.name = model.color.color
      model.color.type = "Cortina"

    }
    if (product==="Cortina Filtrasol") {
     
      

      model.color = $scope.productData.cortinaFiltrasol.colores[model.textil]?.filter(color => color.color.toLowerCase() == model.colorName.toLowerCase())[0]
      
      
      model.color.name = model.color.color
      model.color.type = "Cortina Filtrasol"

      
    }

    if (product == "Piso"||'Piso Eteka') {
      model.clientType = $scope.quote.client ? $scope.quote.client.type : null
      $scope.pisoModel = model
    }
    //console.log("product eteka?")
			//console.log($scope.productetk)
    if($scope.productetk){
      etk='etk'
    }
    colorPriceService.updatePrice(product, model, $scope.productMeta,etk)
    $timeout(
      colorPriceService.updatePrice(product, model, $scope.productMeta)
      
      ,200)
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

      if ($scope.quote.discountPercentCortina > $scope.quote.clientMaxDiscount) {
        $scope.quote.discountPercentCortina = $scope.quote.clientMaxDiscount
      }

      if ($scope.quote.discountPercentCortina < 0 || !angular.isNumber($scope.quote.discountPercentCortina)) {
        $scope.quote.discountPercentCortina = 0
      }

      if ($scope.quote.discountPercentPiso > $scope.quote.clientMaxDiscount) {
        $scope.quote.discountPercentPiso = $scope.quote.clientMaxDiscount
      }

      if ($scope.quote.discountPercentPiso < 0 || !angular.isNumber($scope.quote.discountPercentPiso)) {
        $scope.quote.discountPercentPiso = 0
      }

      if ($scope.quote.discountPercentMoldura > $scope.quote.clientMaxDiscount) {
        $scope.quote.discountPercentMoldura = $scope.quote.clientMaxDiscount
      }

      if ($scope.quote.discountPercentMoldura < 0 || !angular.isNumber($scope.quote.discountPercentMoldura)) {
        $scope.quote.discountPercentMoldura = 0
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
          
        },)
      } else {
        if ($scope.quote.type === "Mixta") {

          if(!$scope.originalMix){
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
            

            $scope.saveDisabled = false
            swal({
              title: (EXECUTION_ENV=="EXTERNAL"?"Quote edited succesfully" :"Cotización editada exitosamente"), type: "success", confirmButtonText: (EXECUTION_ENV=="EXTERNAL"?"Accept" :"Aceptar"),
            })
            $state.go("console.quote-list")
          }, function (error) {
            $scope.saveDisabled = false
            
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
            
          },)
        }
      }
    }
  }
  ///aca en el new-quote

  $scope.getTemplate = function (product) {
  
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
      case "Piso Eteka":
        return path + "piso_eteka.html"
      case "Custom":
        return path + "custom.html";
      case "Cortina":
        return path + "cortinas.html"
      case "Cortinas":
          return path + "cortinas.html"
      case "Moldura":
            return path + "moldura-quote.html"
      case "Cortina Filtrasol":
        return path + "cortinas-filtrasol.html"
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
    
    val = val.toString();
    val = val.split(".")
    if(val[1]!= undefined) {val[1] = parseFloat("."+val[1])}
    else{val[1]=0}
    let fracs = toFraction(val[1])
      
    return [Math.round(parseFloat(val[0])+parseFloat(fracs[1])),fracs[0]]
  }

  //aca agregamos piso eteka a moldura
  $scope.pisoMolduraQuote = function(){
    let allowedTypes = ["Moldura", "Piso","Piso Eteka"]

    for( const elem of $scope.productsSorted){

      if(!allowedTypes.includes(elem['type']) && elem['products'].length > 0) return false
    }
    
    return true
    
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
      case "Cortina":
        model.discountPercent = $scope.quote.discountPercentCortina
      case "Piso":
        model.discountPercent = $scope.quote.discountPercentPiso
      case "Moldura":
        model.discountPercent = $scope.quote.discountPercentMoldura
    }
  }

  function createSuborders(count) {
    if (count < $scope.productsMixed.length) {
      var i = count

      

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
         
        }

      


      $scope.subquote.products = $scope.productsMixed[i].products
      $scope.subquote.type = $scope.productsMixed[i].type

      $scope.getSubQuoteDiscount($scope.productsMixed[i].type, $scope.subquote,)
      colorPriceService.updateTotals($scope.productsMixed[i].type, $scope.subquote,)
      
      paldiService.orders
        .saveSubOrder($scope.subquote, $scope.productsMixed[i].type)
        .then(function (suborder) {
          if(!$scope.updatingOrderType){
                $state.go("console.quote-list");
              }
          i++
          createSuborders(i)
        }, function (error) {
          $scope.saveDisabled = false
          
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
      
      $scope.changeHeight(product, model);
    }
    if (!model.height && !model.width) {
      $scope.updatePrices(product, model);
    }
  }

  $scope.colorSelected = async function (color, product, model) {
      

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
      if(EXECUTION_ENV=="EXTERNAL"){
        model.shipping = model.colorObj.shipping
      }
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


  document.addEventListener("wheel", function(event){
    if(document.activeElement.type === "number"){
        document.activeElement.blur();
    }
});

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

  $scope.widthTimer = '';
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
    $scope.updatePrices(product, model)
  }
  else{
    $timeout.cancel($scope.widthTimer)
    $scope.widthTimer = $timeout(()=>{
    if (model.width) {
      
       
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
    $scope.updatePrices(product, model)
  },500)
  }
    
  }

  $scope.heightTimer =''
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
    $scope.updatePrices(product, model)
    }
    else{
      $timeout.cancel($scope.heightTimer)
      $scope.heightTimer = $timeout(()=>{
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
      $scope.updatePrices(product, model)
    },500)  
    }
    
  }

  $scope.simpleWidthTimer=''
  $scope.changeSimpleWidth = function (product, model) {

    if(EXECUTION_ENV!="EXTERNAL"){
    let color;
    let textil;
    if(product=="Cortina"){
    textil = $scope.productData.cortina.colores[model.textil]
    
    textil.forEach(element => {
      
      if(element.color.toLowerCase()==model.colorName.toLowerCase())
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

    if(product=="Cortina Filtrasol"){
      let textil = $scope.productData.cortinaFiltrasol.colores[model.textil]
      
      textil.forEach(element => {
        if(element.color==model.colorName)
          color=element
      });
      }

    if (model.width) {
      
      let width = parseFloat(model.width.toString().match(/.*\..{0,3}|.*/)[0],)
      if(product=="Cortina" || product == "Cortina Filtrasol"){
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
      if(element.color.toLowerCase()==model.colorName.toLowerCase())
        color=element
    });
    }

    if (model.height) {
      let height = parseFloat(model.height.toString().match(/.*\..{0,3}|.*/)[0],)
      
      if(model.type=="Wrapped Cornice" || model.type=="Aluminum Gallery")
      { height=parseFloat(model.height)
      
      }
      
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
    if(product=="Cortina" ){
    let textil = $scope.productData.cortina.colores[model.textil]
    
    textil.forEach(element => {
      if(element.color==model.colorName)
        color=element
    });
  }
    
  if(product=="Cortina Filtrasol" ){
    let textil = $scope.productData.cortinaFiltrasol.colores[model.textil]
    
    textil.forEach(element => {
      if(element.color==model.colorName)
        color=element
    });
  }
    if (model.height) {
      
      let height = parseFloat(model.height.toString().match(/.*\..{0,3}|.*/)[0],)
      if(product=="Cortina" || product =="Cortina Filtrasol"){
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
      
      model.colorObj = null
      model.color = null
      model.width = null
      model.height = null
      model.textil = null
      model.colorName = null
      model.total=null
      model.price=null
      
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
   
      //aca we we we
      
      colorPriceService.getInstallationPlusList(product, model)
      colorPriceService.getPlusColorsList(product, model)
      if($scope.productetk===true ){
        //console.log("entro por aca 1")
        colorPriceService.getMotorList(product, model,'etk')
        colorPriceService.getPlusList(product, model,'etk')
        
      }else{
        //console.log("entro por aca 2")
        colorPriceService.getMotorList(product, model)
        colorPriceService.getPlusList(product, model)
      }
      if(color=="etk" ){
        $scope.productetk3 = true
        colorPriceService.getColors(product, model,'etk')
      }else{
        colorPriceService.getColors(product, model)
      }
      
     
      color = null
    }
    
    $scope.updatePrices(product, model)
     
    $scope.rotated = false
    $scope.valid = product === "Filtrasol" && model.type === "Filtrasol Enrollables"
    $scope.valid |= product === "Enrollable" && model.type === "Enrollables"
   
  }

  $scope.selectMoldingType = function(model, obj) {
    model.name = obj.label
    $scope.updatePrices('Moldura', model)
  }

  $scope.updateTypeNoErasing = function (product, model) {
    
    if (model.type) {
      if (product == "Enrollable") {
        
        loadProductMap()
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

      if (product == "Toldo") {
        
      }
      if(product=="Moldura"){
        
        if(!model.motorList) model.motorList = []
        if(!model.plusList) model.plusList = []
        colorPriceService.getColors(product, model)
        $timeout(()=>{
          $scope.updatePrices(product, model)
        },200)
      }
      
      
      
      colorPriceService.getColors(product, model)

      
      if($scope.productetk===true ){
        colorPriceService.getMotorList(product, model,'etk')
        colorPriceService.getPlusList(product, model,'etk')
        
      }else{
        colorPriceService.getMotorList(product, model)
        colorPriceService.getPlusList(product, model)
      }
      
      colorPriceService.getInstallationPlusList(product, model)
      
      $scope.updatePrices(product, model)
    }
  }

  //---------------------------------------------------------------------------------------------//
  // ---------------------------------------- Init Load
  // ------------------------------------------//
  // ---------------------------------------------------------------------------------------------//
  var loadProductMap = function () {
    jsonService.products.listEnrollables().then(function (products) {
      $scope.enrollablesMeta = products
      
    }, function (error) {
      $scope.step = "empty"
      
    },)

    jsonService.products.listFiltrasoles().then(function (products) {
      $scope.filtrasolesMeta = products
    }, function (error) {
      $scope.step = "empty"
      
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
        
        $scope.quote.products = angular.copy(order.products)

        if($scope.quote.type=="Mixta") $scope.originalMix = true;

        $scope.quote.products.forEach(prod =>{
          if(prod.productType == "Piso" && $scope.quote.type!="Mixta"){
            prod.wood = prod.color.wood
          }
          if (prod.productType=="Cortina" || prod.productType=="Cortina Filtrasol"){
            if(prod.color){  
            prod.colorName=normalizeText(prod.color.name.trim())
            prod.textil=normalizeText(prod.color.textil.trim())
            }
          }
        })
        $scope.editing = true
        $scope.hasAdditionals()
        
        

        
        if(!order.bitrixDealId){
          $scope.needsLoadProjects = false
        }
        $scope.selectClient(order.client)
        if(order.bitrixDealId){
          
          
         let opt = {
            
            "Title":order.project,
            "ID":order.bitrixDealId,
            "Source":order.source,
          }
          $timeout(async()=>{
            
            await $scope.projectsLoaded
            
            $scope.setBitrixId(opt,true)
          },1)
          
        }
   
        //$scope.selectClient(order.client)


       
        

       
          

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

                    if(product.productType == "Piso" ){
                      product.wood = product.color.wood
                    }
          
                      if (product.productType=="Cortina" || product.productType=="Cortina Filtrasol"){
                        if(product.color){  
                        product.colorName=normalizeText(product.color.name.trim())
                        product.textil=normalizeText(product.color.textil.trim())
                        }
                      }
                    
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
      
      $state.go("console.order-details", {
        orderId: $stateParams.orderId,
      })
    },)
  } else if (!$scope.isCustomOrder) {
    if ($scope.currentUser) {
      if ($scope.currentUser.role != "SUPERADMIN"     && $scope.currentUser.role != "CONSULTANT" && $scope.currentUser.role != "SALES_MANAGER" && $scope.currentUser.role != "CONSULTANT_MAYOR" ) {
        $state.go("console.order-list")
      }
    } else {
      $timeout(function () {
        if ($scope.currentUser.role != "SUPERADMIN" &&   $scope.currentUser.role != "CONSULTANT" && $scope.currentUser.role != "SALES_MANAGER"  && $scope.currentUser.role != "CONSULTANT_MAYOR" ) {
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
    
  if (product != "Custom") {
    if (["Toldo", "Enrollable", "Filtrasol", "Piso", "Piso Eteka" // "Shutter",
    ].includes(model.productType)) {
      model.color = model.colorObj
    } else if (["Cortina", "Cortina Filtrasol"].includes(model.productType) ) {
      model.color = model.color
    }
    else if (model.productType=="Moldura"){

    } 
    else {
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
      
      $scope.toldo = angular.copy(product)
      $scope.updateTypeNoErasing("Toldo", $scope.toldo)
      
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
        value: EXECUTION_ENV=="EXTERNAL"?{ code: product.color, textil:product.textil,shipping:product.shipping}:{ code: product.color, textil:product.textil},
      }, "Balance", product,)
      break
    case "Piso":
      $scope.piso = angular.copy(product)
      $scope.updateTypeNoErasing("Piso", $scope.piso)
      product.color.m2Box = product.m2Box
      $scope.colorSelected({
        label: product.color.name, value: product.color,
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
    case "Cortina Filtrasol":
      $scope.cortinaFiltrasol = angular.copy(product);
      $scope.updateTypeNoErasing("Cortina Filtrasol", product);

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
  angular.copy({}, $scope.cortinaFiltrasol);
  
  
  
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
    case "Cortina Filtrasol": // @note scope cortina im not sure why this does this :(
      $scope.cortinaFiltrasol = {};
      break;
    case "Custom":
      $scope.custom = {};
      $scope.sellerStep = "empty";
      break;
  }
}

