import { globals, pdApp } from "../index";

import { getConfirmPayment } from "./order-details/confirm-payment";
import { showSwal } from "../../utils/swal/show";
import { merge, mergeDeep, moveToScope } from "../../utils/merge";
import { showCreateInstallationSheetDialog } from "./order-details/installation-sheet/create";
import { swalUserCreateSuccess } from "../../utils/swals/userCreate";
import {to_fraction} from '../../utils/units'
pdApp.controller(
  "OrderDetailsCtrl",
  function (
    $rootScope,
    $scope,
    $state,
    $stateParams,
    $timeout,
    $uibModal,
    DTOptionsBuilder,
    DTColumnDefBuilder,
    paldiService,
    colorPriceService,
    permissionsHelper,
    ngDialog,
    orderService,
    permissionService
  ) {

    

    $scope.closeDialogFn =function(){
      $scope.dialog.close()
      if($scope.newStatus=="PENDING_INFO"){
        $scope.promiseReject()
        $scope.providerReject=true
      }
    }
    
    $scope.external = EXECUTION_ENV=="EXTERNAL"

    $scope.guias=false
    $scope.optionsList = []

    $scope.decideStatus = function(val){
      if($scope.order && $scope.order.status=="LINE" && $scope.order.providerStatus && ($scope.currentUser.role=="SUPERADMIN" ||$scope.currentUser.role=="PROVIDER"||$scope.currentUser.role=="BUYER"||$scope.currentUser.role=="MANAGER")){
        return $scope.pretty("orderStatus",$scope.order.providerStatus)
      }
      return val
    }
    
    let specialList =["QUOTE","AUTHORIZED","PENDING_INFO"];
				angular.forEach(specialList,function(status){
					$scope.optionsList.push({
						label: (EXECUTION_ENV =="EXTERNAL"?$scope.pretty("orderStatusEn", status) :$scope.pretty("orderStatus", status)),
						value: status,
					});
				})
    $scope.providerStatusSelected = $scope.optionsList[0];

    $scope.changeProviderStatusDialog = function(){
    $scope.dialog =ngDialog.open({
      template:"partials/views/console/change-provider-status.html",
      scope:$scope,
      showClose: false
    })
    }
    $scope.changeProviderStatus =  function(status){
      swal(
        {
          title:
          (EXECUTION_ENV=="EXTERNAL"?"Do you want to change the order status to ":"¿Cambiar estado de la orden a ") +
          (EXECUTION_ENV=="EXTERNAL"?$scope.pretty("orderStatusEn", status):$scope.pretty("orderStatus", status)) +
            "?",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: (EXECUTION_ENV=="EXTERNAL"?"Accept":"Aceptar"),
          cancelButtonText: (EXECUTION_ENV=="EXTERNAL"?"Cancel":"Cancelar"),
          closeOnConfirm: true,
        },
        async()=>{
          if(status=="QUOTED"){
            $scope.updateProviderDialog()
            await $scope.providerUpdatedPromise
            await $timeout(()=>{
            if(!$scope.successProv){
              return
            }
          },
            300)
          }
        
      $scope.statusNotesText=" "
      if(status=="PENDING_INFO"){
        $scope.newStatus="PENDING_INFO"
      
        $scope.statusNotesDialog()
        var promise = new Promise(function(resolve, reject){
          $scope.promiseResolve = resolve;
          $scope.promiseReject = reject;
        });
        
        
        await promise
        
          

      }
      if($scope.providerReject){
        $scope.providerReject=false
        return;
      }
      paldiService.orders.updateProviderStatus($scope.order,status,$scope.statusNotesText).then(()=>{
        $scope.newStatus==null;
        $scope.statusNotesText="";
        $scope.loadOrder();
      }
      )
    }
      );
    }

    var providerProducts = {
      "Enrollable":[
        "Cascade","Triple Shade","Horizontales de Madera","Enrollables","Romanas","Eclisse","Verticales de PVC","Horizontales de Aluminio","Celular","Enrollables Wolken"
      ],
      "Cortina":[
        "Plitz Frances", "Ondulada"
      ],
      "Balance":
      [
        "Wrapped Cornice","Aluminum Gallery"
      ],
      "Toldo":[
        "Capri","Select","Pergola","Pergolato","Arion"
      ],
      "Filtrasol":['Filtrasol Eclisse',"Filtrasol Enrollables","Filtrasol Panel Deslizante", "Filtrasol Triple Shade"]
    }
    
    
     function performAnalisis(){
      
     
      let results = {}
      for (let element of $scope.productsSorted){
        for (let elem of element['products']){
          
          
          if(Object.keys(providerProducts).includes(elem.productType) && providerProducts[elem.productType].includes(elem.type)){
            if(!results[elem.productType])
              results[elem.productType]=[]

              if(!results[elem.productType].includes(elem.type))
             results[elem.productType].push(elem.type) 
          }

          if(Object.keys(providerProducts).includes(elem.productType) && providerProducts[elem.productType].includes(elem.finish)){
            if(!results[elem.productType])
              results[elem.productType]=[]
            if(!results[elem.productType].includes(elem.finish))
             results[elem.productType].push(elem.finish) 
          }
        }
      }
      
      return  results
    }

   

    $scope.typeTranslate = function(name){
      if($scope.external){
        return name
      }
      else{
        switch(name){
          case "Wrapped Cornice":
            return "Corniza Forrada"
          case "Aluminum Gallery":
            return "Galeria de Aluminio"
          default:
            return name
        }
      }
    }

    $scope.getMatchDiscount = function(){
      if(EXECUTION_ENV=="INTERNAL" ) return "Descuento"
      if($scope.order.type=="Mixta") return "Discount"
      
      return $scope.pretty("productType",$scope.order.type) + " & Add Ins Discount"
    }

    $scope.sendWhatsapp = function(){
      const res = paldiService.schedule.sendMessage($stateParams.orderId)

     
    }

    $scope.scheduleRedirect = async function(){
      $scope.dialog.close();
      const res = await paldiService.schedule.sendMessage($stateParams.orderId)
      if(res.data=='Error'){
        swal({
          title: (EXECUTION_ENV=="EXTERNAL"?"Error":"Error"),
          type: "error",
          text:"Hoja de Instalación no definida",
          confirmButtonText: (EXECUTION_ENV=="EXTERNAL"?"Accept":"Aceptar") ,
        });
      }
      else{
     
      window.open(res.data.link, '_blank');
      }
    }

    $scope.messageDialog = async function(){
      $scope.dialog.close()
      const res = await paldiService.schedule.sendMessage($stateParams.orderId)
      if(res.data=='Error'){
        swal({
          title: (EXECUTION_ENV=="EXTERNAL"?"Error":"Error"),
          type: "error",
          text:"Hoja de Instalación no definida",
          confirmButtonText: (EXECUTION_ENV=="EXTERNAL"?"Accept":"Aceptar") ,
        });
      }else{
      $scope.messageSMS = res.data.message
      $scope.dialog = ngDialog.open({
        template:"js/controllers/order/scheduleforms/message-dialog.html",
        scope:$scope,
        showClose: false
      })
    }
      
    }

    $scope.copyToClipboard = function(){
      navigator.clipboard.writeText($scope.messageSMS);
      $scope.dialog.close()
    }
    $scope.showOptionsDialog = function(){
      $scope.dialog = ngDialog.open({
        template:"js/controllers/order/scheduleforms/options-dialog.html",
        scope:$scope,
        showClose: false
      })
    }

    $scope.getMatchDiscounts = function(name){
      if(EXECUTION_ENV=="INTERNAL") return name
      let formated
      
      switch(name){
        case"Descuento Balance":
          formated="Top Treatments";
          break;
        case"Descuento Persiana":
          formated ="Shades";
          break;
        default:
          formated = name.split(" ")[1];
      }
      return formated + " & Add Ins Discount"
    }

    
     $scope.selectProvidersTrigger = function (){
      $scope.providersNeeded = performAnalisis()
                
      if(Object.keys($scope.providersNeeded).length>0){
        $scope.selectProvidersDialog()
        return;
      }
     }
    let localPromise =null
    var loadOrder = function () {
      var id = $stateParams.orderId;
      $scope.step = "loading";
      $scope.showNotes = false;
      $scope.newStatus = '';
      $scope.productNotes = '';
      $scope.productsSorted = [];
      $scope.productsSorted.push({ type: "Balance", products: [] });
      $scope.productsSorted.push({ type: "Shutter", products: [] });
      $scope.productsSorted.push({ type: "Toldo", products: [] });
      $scope.productsSorted.push({ type: "Enrollable", products: [] });
      $scope.productsSorted.push({ type: "Filtrasol", products: [] });
      $scope.productsSorted.push({ type: "Persiana o Filtrasol", products: [] });
      $scope.productsSorted.push({ type: "Piso", products: [] });
      $scope.productsSorted.push({ type: "Cortina", products: [] });
      $scope.productsSorted.push({ type: "Cortina Filtrasol", products: [] });
      $scope.productsSorted.push({ type: "Moldura", products: [] });
      $scope.productsSorted.push({ type: "Custom", products: [] });
      $scope.suborders = [];
      $scope.limitDays = 20;
      $scope.maxDate;
      $scope.showChangeStatusButton = false;
      $scope.showChangeStatusTree= false;
      // show cases
      $scope.showlvl1= false;
      $scope.showlvl2= false;
      $scope.showlvl3= false;
      $scope.showlvl4= false;
      $scope.showlvl5= false;
      $scope.showlvl6= false;
      $scope.showlvl7= false;
      //ADD ACA
      
      paldiService.orders.get(id).then(async function (order) {

        $scope.order = order;     
        $scope.quoteStatus = order.quoteStatus;
        
        if(order.status=="LINE"||
        order.status=="PENDING_INFO"||
        order.status==" QUOTE "||
        order.status=="QUOTED"||
        order.status=="AUTHORIZED"
        ){
          $scope.showChangeStatusButton = true;
          $scope.showChangeStatusTree= true;
        }
  
        if($scope.currentUser.role=="SUPERADMIN" && order.status!='QUOTE' && !order.status!='PENDING'){
          $scope.showChangeStatusButton = true;
          switch(order.status){
            case "LINE":
            case " QUOTE ":
            case "PENDING_INFO":
            case "QUOTED":
            case "AUTHORIZED":
              $scope.showlvl1= true;
              break;
            case "BACKORDER":
              $scope.showlvl2= true;
              break;
            case "PRODUCTION":
              $scope.showlvl3= true;
              break;
            case "TRANSIT":
              $scope.showlvl4= true;
              break;
            case "FINISHED":
              $scope.showlvl5= true;
              break;
            case "PROGRAMMED":
              $scope.showlvl6= true;
              break;
            case "INSTALLED_INCOMPLETE":
            case "INSTALLED_NONCONFORM":
              $scope.showlvl7 = true;
              break;
          }
        }
        
        $scope.quoteSubStatus = order.quoteSubStatus;
        $scope.products = order.products;
        $scope.isSuborder = false;
        $scope.isMaster = false;
        $scope.providersSummary ={}
        

        if(order.type!="Mixta"){
          if(order.provider)
         $scope.providersSummary[order.type]=order.provider
        }
        if (order.type === 'Mixta') {
          $scope.isMaster = true;
          (order.mixedLabel !== null) ? $scope.mixedLabel = order.mixedLabel : $scope.mixedLabel = "Mixta";
          paldiService.orders.getByOrderParent($scope.order.id).then(function (suborders) {
            localPromise =suborders.forEach(function (suborder) {
              if(suborder.provider){
                $scope.providersSummary[suborder.type]=suborder.provider
              }
              $scope.suborders.push(suborder);
              if (suborder.products) {
                suborder.products.forEach(function (product) {
                  
                  orderProductsByType(product);
                })
              }

            })

          })
          
        } else {
          if ($scope.products) {
            localPromise = $scope.products.forEach(function (product) {
              orderProductsByType(product);
            })
          }
        }
        

        if (order.orderParent) {
          $scope.isSuborder = true;
        }

        $scope.cycleStartDate = order.cycleStartDate ? moment(order.cycleStartDate) : null;
        $scope.cycleFinishDate = order.cycleFinishDate ? moment(order.cycleFinishDate) : null;
        $scope.commitmentDate = order.commitmentDate ? moment(order.commitmentDate) : null;
        $scope.productionStartDate = order.productionDate ? moment(order.productionDate) : null;
        $scope.productionFinishDate = order.productionFinishDate ? moment(order.productionFinishDate) : null;
        $scope.productionLimitDate = order.productionLimitDate ? moment(order.productionLimitDate) : null;
        $scope.transitStartDate = order.transitDate ? moment(order.transitDate) : null;
        $scope.transitFinishDate = order.transitFinishDate ? moment(order.transitFinishDate) : null;
        $scope.transitLimitDate = order.transitLimitDate ? moment(order.transitLimitDate) : null;
        $scope.currentDate = moment();
        $scope.cycleDays = getCycleDays($scope.currentDate, $scope.cycleStartDate, $scope.cycleFinishDate);
        $scope.dpfcStatus = '';
        $scope.dpfcTotalStatus = '';
        $scope.dpfcTotalDays = 0;
        $scope.dpfcDays = getDPFCDays($scope.cycleStartDate, $scope.commitmentDate, $scope.cycleFinishDate);
        $scope.productionStatus = '';
        $scope.productionTotalStatus = '';
        $scope.productionTotalDays = '-';
        $scope.productionDays = getProductionDays($scope.productionStartDate, $scope.productionLimitDate, $scope.productionFinishDate);

        $scope.transitDays = getTransitDays($scope.currentDate, $scope.transitStartDate, $scope.transitFinishDate, $scope.transitLimitDate);


        $scope.client = order.client;
        $scope.step = order ? "loaded" : "empty";
        $scope.productType = order.type;
        $scope.order.type = $scope.productType;
        $timeout(function () {
          $scope.loadAdditionals();
        }, 200)

        $scope.order.pdfLink = paldiService.orders.getPdfLink(order);
        $scope.order.pdfOrderLink = paldiService.orders.getPdfOrderLink(order);
        if (order.payments) {
          $scope.order.payments = paldiService.orders.getReceiptLinks(order);
        }
        paldiService.orders.getLog(order.id).then(function (log) {
          $scope.order.events = log;
        });
        $scope.order.installationPlusTotal = order.installationPlusTotal ? order.installationPlusTotal : 0;

        const res = (await paldiService.orders.getPdfInstallationSheetLink(order))
        // $scope.order.pdfOrderLink = paldiService.orders.getPdfOrderLink(order);

        $scope.order.installationSheetPdfLink = res
        // document.getElementById('download_installation_sheet').href = $scope.installationSheet.pdfLink
        // $("#download_installation_sheet").attr('href', $scope.installationSheet.pdfLink)


        
        $scope.perms = permissionService.setDependencies([
          ["user", $rootScope.currentUser],
          ["order", $scope.order],
          ["installationSheet", {
            pdfLink: res,
          }],
        ]);

        
        $timeout(async function () {
          $scope.permissions = permissionsHelper.get(order, $rootScope.currentUser);
          $scope.canManagePayments = $scope.currentUser.role != 'MANAGER' && $scope.currentUser.role != 'INSTALLATION_MANAGER';
          // $scope.canManagePayments = [
          //   "MANAGER",
          //   "INSTALLATION_MANAGER",
          // // ].includes($scope.currentUser.role);
          
          
        });
        
      }, function (error) {
        $scope.step = "empty";
        
      }).then(async ()=>{
        $timeout(function () {
        $scope.needsProviderAssigned = Object.keys(performAnalisis()).length >0
        
        
        }, 500)
        
      });
    }

    $scope.loadOrder = loadOrder;
    $scope.paldiService = paldiService;
    $scope.ngDialog = ngDialog;

    $scope.showLog = false;
    $scope.isPaying = false;
    $scope.isCancellingPayment = false;
    loadOrder();

    $scope.sendToClient = function (order) {
      var objName;
      if (order.status == "QUOTE") {
        objName = (EXECUTION_ENV!="EXTERNAL" ? "cotización":"Quote");
      } else {
        objName = (EXECUTION_ENV!="EXTERNAL" ? "orden" : "Order");
      }

      swal(
        {
          title:
          (EXECUTION_ENV=="EXTERNAL"?"Do you want to send the ":"¿Seguro que deseas enviar la ") +
            objName +
          (EXECUTION_ENV=="EXTERNAL"?" to the client?":" al cliente?"),
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: EXECUTION_ENV=="EXTERNAL"?"Send":"Enviar",
          cancelButtonText: EXECUTION_ENV=="EXTERNAL"?"Cancel":"Cancelar",
          closeOnConfirm: true,
          closeOnCancel: false,
        },
        function (isConfirm) {
          if (isConfirm) {
            var id = $stateParams.orderId;
            paldiService.orders
              .sendOrder(id)
              .then(function (order) {
                swal({
                  title: (EXECUTION_ENV=="EXTERNAL"?"Sent":"Enviado"),
                  text: (EXECUTION_ENV=="EXTERNAL"?(objName + " Sent" ):("Se envió la " + objName)),
                  type: "success",
                  confirmButtonText: (EXECUTION_ENV=="EXTERNAL"?"Accept":"Aceptar"),
                });
              });
          } else {
            swal({
              title: (EXECUTION_ENV=="EXTERNAL"?"Canceled":"Cancelado"),
              type: "error",
              confirmButtonText: (EXECUTION_ENV=="EXTERNAL"?"Accept":"Aceptar") ,
            });
          }
        }
      );
    };
   
    function toFraction(amt) {
      
      if(amt == undefined) return ""
      if (amt > 0 && amt <= .125+(.125/7)) return '1/8';
      if (amt <= .25+(.125/7)) return '1/4';
      if (amt <= .375+(.125/7)) return '3/8';
      if (amt <= .5+(.125/7)) return '1/2';
      if (amt <= .625+(.125/7)) return '5/8';
      if (amt <= .75+(.125/7)) return '3/4';
      if (amt <= 1) return '7/8';
      // etc
    }
    $scope.units ={
     to_fraction:function(int,float){
      
        if(float=="undefined" || float==undefined) {
          return int
        }
       return int + " " +to_fraction(parseFloat(float)??undefined)??""

     }
     }

    $scope.sendToSpecialEmail = function (order) {

      var objName;
      if (order.status == "QUOTE") {
        objName = EXECUTION_ENV=="EXTERNAL" ? "cotización" :"Quote" ;
      } else {
        objName = EXECUTION_ENV=="EXTERNAL" ? "order" : "Orden";
      }
      

      const getProviderEmail = (type) => {
        const emails = {
          "Persianas": "atencion.premium@gabin.com.mx",
          "Enrollable": "atencion.premium@gabin.com.mx",
          "Filtrasol": "gabriela@farz.com.mx",
        }
        if (!Object.keys(emails).includes(type))
          return "Correo"
        return emails[type]
      }
      
      
      
      
      swal({
        title: (EXECUTION_ENV=="EXTERNAL"?("Do you want to send the" + objName + "to the mail"):("¿Seguro que desea enviar la " + objName + " al correo?")),
        type: "input",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: (EXECUTION_ENV=="EXTERNAL"?"Send":"Enviar"),
        cancelButtonText: (EXECUTION_ENV=="EXTERNAL"?"Cancel":"Cancelar"),
        closeOnConfirm: true,
        closeOnCancel: true,
        inputValue: getProviderEmail(order.products[0].productType)
      },
        function (value) {
          if (!value)
            return
          
          if (value.trim() === "") {
            swal.showInputError((EXECUTION_ENV=="EXTERNAL"?"A mail direction is required":"Es necesario escribir una dirección de correo"));
            return false
          }
          var id = $stateParams.orderId;

          paldiService.orders.sendOrderTo(id, value).then(function (order) {
            swal({
              title: (EXECUTION_ENV=="EXTERNAL"?"Sent":"Enviado"),
              text: (EXECUTION_ENV=="EXTERNAL"?(objName + "sent"):("Se envió la " + objName)),
              type: "success",
              confirmButtonText: (EXECUTION_ENV=="EXTERNAL"?"Accept":"Aceptar")
            });
          });
        });
    };

	  $scope.downloadWorkOrder = () => {
      window.open("{{order.pdfOrderLink}}", "_blank");
    };

    // downloadPdfOrderYPdfInstallation(order.installationSheetPdfLink , order.pdfOrderLink)
    $scope.downloadPdfOrderYPdfInstallation =async function (pdfOrden, pdfInstalacion,order) {
      // console.log(order)
      // //primer pdf orden 
      // // Crear un enlace temporal
      // setTimeout(() => {
      //   var link = document.createElement('a');
      //   link.href = pdfOrden;
      //   // link.target = '_blank';
      //   link.download = 'pdfOrden.pdf';
      //   link.style.display = 'none';
      //   document.body.appendChild(link);
      //   // Simular el clic en el enlace
      //   link.click();
      //   // Eliminar el enlace temporal
      //   document.body.removeChild(link);
      // }, 2000);
      // // {{order.pdfOrderLink}}
      // //segundo pdf de instalacion
      // var link2 = document.createElement('a');
      // link2.href = pdfInstalacion;
      // link2.target = '_blank';
      // link2.style.display = 'none';
      // document.body.appendChild(link2);
      // // Simular el clic en el enlace
      // link2.click();
      // // Eliminar el enlace temporal
      // document.body.removeChild(link2);


  //   let user = $scope.currentUser.name + " " + $scope.currentUser.lastName
  //   let folio = $scope.order.orderTransitInvoice
  //   $scope.dialog.close()
  //   let res = await paldiService.shipment.sheet($stateParams.orderId,boxesNum,user,folio)

  //  //  let res = await paldiService.shipment.sheet($stateParams.orderId,boxesNum,user,folio)
  //    let res =await paldiService.tickets.gettickets($stateParams.orderId,boxesNum,user,folio)

  //    const link = document.createElement("a");

  //    link.href = res;
  //    link.setAttribute("download", "etiqueta");
  //    document.body.appendChild(link);

      let res = await paldiService.orders.getPdfOrderWorkAndInstallation(
        order.id,order.orderNo
        )
        res;
        const link = document.createElement("a");
     link.href = res;
       link.setAttribute("download", "etiqueta");
       document.body.appendChild(link);
       link.click()

    };


    $scope.createInstallationSheet = () => {
      showCreateInstallationSheetDialog($scope,$timeout, () => {
        showSwal("messages.installation_sheet.created");
      });
    };

    $scope.editInstallationSheet = () => {
      showCreateInstallationSheetDialog(
        $scope,$timeout,
        () => {
          showSwal("messages.installation_sheet.edited");
        },
        "edit"
      );
    };

    var createSuborders = function (model, order) {
      paldiService.orders.getByOrderParent($scope.order.id).then(function (suborders) {
        var suborderNo = 0;
        suborders.forEach(function (suborder) {
          if (suborder.products && suborder.products.length > 0) {
            suborderNo++;
            var updatedOrder = suborder;
            updatedOrder.suborderNo = suborderNo;
            updatedOrder.orderNo = order.orderNo;

            paldiService.orders.updateStatus(updatedOrder, 'LINE').then(function (order) {
              $scope.isPaying = false;

            }, function (error) {
              console.error(error);
              $scope.isPaying = false;
              if (error.data.exception == 'io.lkmx.paldi.quote.components.error.InventoryNotEnoughException') {
                swal({ title: (EXECUTION_ENV=="EXTERNAL"?"Not enough inventory available":'No hay inventario suficiente'), type: 'error', confirmButtonText: (EXECUTION_ENV=="EXTERNAL"?"Accept":'Aceptar') });
              } else {
                swal({ title: (EXECUTION_ENV=="EXTERNAL"?"An error ocurred":'Ocurrió un error'), type: 'error', confirmButtonText: (EXECUTION_ENV=="EXTERNAL"?"Accept":'Aceptar') });
                loadOrder();
              }

            });

          } else {
            paldiService.orders.deleteSuborder($scope.order.id, suborder.type).then(function (order) {
              $scope.isPaying = false;

            }, function (error) {
              console.error(error);
              $scope.isPaying = false;
              swal({ title: (EXECUTION_ENV=="EXTERNAL"?"An error ocurred":'Ocurrió un error'), type: 'error', confirmButtonText: (EXECUTION_ENV=="EXTERNAL"?"Accept":'Aceptar') });
              loadOrder();
            });
          }
          
        })

      })
    };
    $scope.createSuborders = createSuborders;

    //========================= PAYMENTS ===========================

    $scope.findProviders = function (name,subtype) {
    
      return paldiService.users.searchProvider(subtype,name,$scope.providersNeeded[subtype])
    }

    $scope.conmuteProperty=function(value){
      if(!value){
        value =true
      }
      else{
        value = !value
      }
    }

    $scope.selectProvider = function(field,item){
      field.user = item
    }

    $scope.deleteProperty = function(model,property){
      delete model[property]
    }

    function checkIsProviderValid(providers){

      
      if(!providers || Object.keys(providers).length==0) return false
      
      for (const props of Object.values(providers)){
        
        if(props.skip) continue
        if(!props.skip & !Object.keys(props).includes('user')) return false
      }
      return true
    }

    $scope.assignProviders = async function(providers){
      
      
      if(checkIsProviderValid(providers)){
        
        swal({
          title:"Desea asignar los anteriores proveedores?",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: (EXECUTION_ENV=="EXTERNAL"?"Accept":"Aceptar"),
          cancelButtonText: (EXECUTION_ENV=="EXTERNAL"?"Cancel":"Cancelar"),
          closeOnConfirm: true,
          closeOnCancel: true,
          },async()=>{

            var filtered = Object.fromEntries(Object.entries(providers).filter(([k,v]) => !v.skip));
        
            if($scope.order.type.toLowerCase()!="mixta" && Object.keys(filtered).length!=0){
              let promise = paldiService.orders.updateSuborderProvider({id:$scope.order.id,type:$scope.order.type,providerId:filtered[$scope.order.type].user._id})

              await promise;
              $scope.dialog.close()
              
              

            }
            else{
            paldiService.orders.getByOrderParent($scope.order.id).then(async function (suborders){
              
              let filterSubOrders = suborders.filter(v=>Object.keys(filtered).includes(v.type))
              
              let relevantInfo = filterSubOrders.map(elem=> {return{id:$scope.order.id,type:elem.type}})
              
              
              relevantInfo = relevantInfo.map(x => {return{...x,providerId:filtered[x.type].user._id}})
              
              let promises = relevantInfo.map(x=> paldiService.orders.updateSuborderProvider(x))
              await Promise.all(promises)
              $scope.dialog.close()
              
              
            })
          }

          })
        
        
        
      }
    }

    $scope.paymentDialog = function (paymentType) {
      $scope.paymentType = paymentType;

      $scope.minPayment =
        paymentType == "payment"
          ? 0.01
          : parseFloat($scope.order.total / 2).toFixed(2);
      $scope.maxPayment = parseFloat($scope.order.balance).toFixed(2);

      $scope.payment = {
        min: $scope.minPayment,
        max: $scope.maxPayment,
        exchangeRate: 1,
        isDiscountPayment: false,
        sendToClient: false,
      };
      $scope.dialog = ngDialog.open({
        template: "partials/views/console/payment.html",
        scope: $scope,
        showClose: false,
      });
    };

    $scope.pay = function (form, model) {
      const confirmPayment = getConfirmPayment(this, $scope,$timeout, model);
      if (form.$valid) {
        $scope.dialog.close();
        confirmPayment(model);
      } else {
        form.$validated = true;
      }
    };

    $scope.currencyChange = function (model) {

      model.exchangeRate = model.currency =="DOLLARS"? ($rootScope.currentExchangeRate ?? 19):1;
      model.advance = 0;
      $scope.exchangeRateChange(model);
    };

    $scope.exchangeRateChange = function (model) {
      model.min =
        $scope.minPayment > 0.01
          ? parseFloat(
            $scope.minPayment / model.exchangeRate
          ).toFixed(2)
          : $scope.minPayment;
      model.max = parseFloat(
        $scope.maxPayment / model.exchangeRate
      ).toFixed(2);
      model.advance = 0;
    };

    //========================= STATUS ===========================

    $scope.sendToOrderDialog = async function () {
      
      if (!$scope.order.user.warehouse && $scope.order.user.role!="EXTERNAL_CONSULTANT") {
        swal({
          title:  (EXECUTION_ENV=="EXTERNAL"?"The seller is not afilliated to a warehouse":"El vendedor no está asignado a un almacén"),
          type: "error",
          confirmButtonText:  (EXECUTION_ENV=="EXTERNAL"?"Continue":"Continuar"),
        });
      } else {
        if(EXECUTION_ENV=="EXTERNAL"){
           swal({
          title:"Do you want to move your order to production?",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: (EXECUTION_ENV=="EXTERNAL"?"Accept":"Aceptar"),
          cancelButtonText: (EXECUTION_ENV=="EXTERNAL"?"Cancel":"Cancelar"),
          closeOnConfirm: true,
          closeOnCancel: false,
          },
          function(isConfirm){
          if(isConfirm){
          setTimeout(function(){
             swal({
              title:"Order Sent",
              type:"success",
              text:"Your order has been moved to production, customer service will reach out for payment details",
              confirmButtonText:  (EXECUTION_ENV=="EXTERNAL"?"Continue":"Continuar")
  
            },
            function(isConfirm){
              if(isConfirm){
                setTimeout(function(){
                  paldiService.orders.updateStatus($scope.order, "PENDING").then(loadOrder())
                  loadOrder();
                },500)
              }
            }
            
            )
          },500)
        }
        }
          )
          

          
         
        }
        else{
        $scope.dialog = ngDialog.open({
          scope: $scope,
          template: "js/controllers/order/order-send.html",
          // template: "partials/views/console/order-send.html",
          showClose: false,
        });
      }
      }
    };

    $scope.updateProviderDialog = function () {
      $scope.providerId = $scope.order.providerId;
      $scope.dialog = ngDialog.open({
        scope: $scope,
        template: "partials/views/console/update-provider.html",
        showClose: false,
      });
    };

    var triggerMsg = async function(){
      let owo = await swal({
        title:"Order Sent",
        type:"success",
        text:"Your order has been moved to production, customer service will reach out for payment details",
        confirmButtonText:  (EXECUTION_ENV=="EXTERNAL"?"Continue":"Continuar")

      })
    }
    
    $scope.updateGuidesDialog = function () {
      $scope.dateModel = {};
      $scope.dateModel['guides']=$scope.order.guides??[]
      $scope.dateModel['orderTransitInvoice']=$scope.order.orderTransitInvoice??""
      $scope.dialog = ngDialog.open({
        scope: $scope,
        template: "partials/views/console/update-guides.html",
        showClose: false,
      });
    };

    $scope.updateGuides = function (){
      $scope.dialog.close();
      var updatedOrder = $scope.order;
      updatedOrder.statusNotes = $scope.dateModel.notes;
      updatedOrder.orderTransitInvoice=$scope.dateModel.orderTransitInvoice
      updatedOrder.guides = $scope.dateModel.guides
      paldiService.orders.setGuides(updatedOrder).then(()=>{
        loadOrder();
      })
    }

    $scope.updateProvider = function (form, providerId) {
      if (form.$valid) {
        $scope.dialog.close();
        $scope.providerUpdatedPromise = paldiService.orders
          .updateProvider($scope.order, providerId)
          .then(function (order) {
            $scope.successProv = true
            swal({
              title:  (EXECUTION_ENV=="EXTERNAL"?"Supplier Updated":"Proveedor Actualizado"),
              type: "success",
              confirmButtonText:  (EXECUTION_ENV=="EXTERNAL"?"Accept":"Aceptar"),
            });
             
            loadOrder();
          });
      } else {
        form.$validated = true;
      }
    };

    $scope.shipmentDialog = function(){
      $scope.dialog = ngDialog.open({
        scope: $scope,
        template: "partials/views/console/shipment-sheet.html",
        showClose: false,
      });
    }

    $scope.downloadShipmentSheet = async function(boxesNum){
      
       let user = $scope.currentUser.name + " " + $scope.currentUser.lastName
       let folio = $scope.order.orderTransitInvoice
       $scope.dialog.close()
      //  let res = await paldiService.shipment.sheet($stateParams.orderId,boxesNum,user,folio)
        let res =await paldiService.tickets.gettickets($stateParams.orderId,boxesNum,user,folio)
       
			  const link = document.createElement("a");
				link.href = res;
				link.setAttribute("download", "etiqueta");
				document.body.appendChild(link);
				link.click()
    }

    $scope.changeQuoteStatusDialog = function (quoteStatus) {
      swal(
        {
          title:
          (EXECUTION_ENV=="EXTERNAL"?"Do you want to change the quote status to ":"¿Cambiar estado de la cotización a ") +
          (EXECUTION_ENV=="EXTERNAL"?$scope.pretty("orderStatusEn", quoteStatus):quoteStatus) +
            "?",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: (EXECUTION_ENV=="EXTERNAL"?"Accept":"Aceptar"),
          cancelButtonText: (EXECUTION_ENV=="EXTERNAL"?"Cancel":"Cancelar"),
          closeOnConfirm: true,
          closeOnCancel: false,
        },
        function (isConfirm) {
          if (isConfirm) {
            changeQuoteStatus();
          } else {
            swal({
              title:  (EXECUTION_ENV=="EXTERNAL"?"Canceled":"Cancelado"),
              type: "error",
              confirmButtonText:  (EXECUTION_ENV=="EXTERNAL"?"Accept":"Aceptar"),
            });
          }
        }
      );
    };

    $scope.fortransit=function (){
      paldiService.orders.getGuides($stateParams.orderId)
      .then(function(guias){
        console.log(guias)
        $scope.guias=guias
        ngDialog.open({
          template: "partials/views/console/datepicker.html",
          scope: $scope,
          showClose: false,
        });
      })

    };
    $scope.changeStatusDialog = function (status) {
      if (status && status == "LINE" && !$scope.order.user.warehouse) {
        swal({
          title:  (EXECUTION_ENV=="EXTERNAL"?"Sales Rep is not afiliated to a warehouse":"El vendedor no está asignado a un almacén"),
          type: "error",
          confirmButtonText:  (EXECUTION_ENV=="EXTERNAL"?"Continue":"Continuar"),
        });
      } else if (status) {
        swal(
          {
            title:
            (EXECUTION_ENV=="EXTERNAL"?"Do you want to change the order status to ":"¿Cambiar estado de la orden a ") +
            (EXECUTION_ENV=="EXTERNAL"?$scope.pretty("orderStatusEn", status): $scope.pretty("orderStatus", status)) +
              "?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText:  (EXECUTION_ENV=="EXTERNAL"?"Accept":"Aceptar"),
            cancelButtonText:  (EXECUTION_ENV=="EXTERNAL"?"Cancel":"Cancelar"),
            closeOnConfirm: true,
            closeOnCancel: false,
          },
          function (isConfirm) {
            if (isConfirm  ) {
              $scope.newStatus = status;
              if (status === "PENDING") {
                if(EXECUTION_ENV=="EXTERNAL"){
                  $scope.statusNotesDialog();
                  return
                }
                showCreateInstallationSheetDialog($scope,$timeout, () =>
                  showSwal(
                    "messages.installation_sheet.created",
                    () => $scope.statusNotesDialog()
                  )
                );
                return;
              }
              if (
                $scope.newStatus != "TRANSIT" &&
                $scope.newStatus != "PRODUCTION"
              ) {
                $scope.statusNotesDialog();
              } else {
                var statusToLimit =
                  $scope.newStatus === "PRODUCTION"
                    ? "production"
                    : "transit";
                setTimeout(function () {
                  $scope.limitDays = 0;
                  paldiService.orders
                    .getLimitDays(
                      $stateParams.orderId,
                      statusToLimit
                    )
                    .then(function (limitDays) {
                      if (limitDays) {
                        $scope.limitDays = limitDays;
                      }
                      // aca cambios
                      // var maxDate = getMaxDate(
                      //   $scope.limitDays
                      // );
                      var maxDate = new Date(2024, 12, 31);
                      $scope.dateOptions.maxDate =
                        new Date(maxDate);
                      $scope.changeStatus();
                    });
                }, 200);
              }
            } else {
              swal({
                title:  (EXECUTION_ENV=="EXTERNAL"?"Canceled":"Cancelado"),
                type: "error",
                confirmButtonText:  (EXECUTION_ENV=="EXTERNAL"?"Accept":"Aceptar"),
              });
            }
          }
        );
      } else {
        $scope.changePermissions =
          permissionsHelper.getChangePermissions($scope.order);
        $scope.dialog = ngDialog.open({
          scope: $scope,
          template: "partials/views/console/change-status.html",
          showClose: false,
        });
      }
    };

    $scope.changeOrderStatus = async function (form, status) {
      //var exceptionStatus=["QUOTED"," QUOTE ","AUTHORIZED","PENDING_INFO"]
      if (form.$valid) {
        $scope.dialog.close();
        // if(exceptionStatus.includes(status)){
        //   var actualStatus =status
        //   await paldiService.orders.updateProviderStatus($scope.order,actualStatus,"Retroactivo")
        //   status="LINE";
        //   if($scope.order.status=="LINE") {
        //     $scope.loadOrder()
        //     return
        //   }
        // }
        // if (exceptionStatus.includes(status)) {
        //   var actualStatus =status
        //   if ($scope.order.status == "LINE") {
        //     $scope.loadOrder();
        //     return;
        //   }
        // }
        paldiService.orders
          .updateRetroStatus($scope.order, status)
          .then(function (order) {
            swal({
              title:  (EXECUTION_ENV=="EXTERNAL"?"Status Updated":"Estado Actualizado"),
              type: "success",
              confirmButtonText:  (EXECUTION_ENV=="EXTERNAL"?"Accept":"Aceptar"),
            });
            loadOrder();
            if (order.orderParent !== null) {
              $scope.statusOrderMaster(
                order.orderParent,
                order.status,
                true
              );
            }
          });
      } else {
        form.$validated = true;
      }
    };

    var changeQuoteStatus = function () {
      if (
        $scope.quoteStatus != "Venta Perdida" &&
        $scope.quoteSubStatus
      ) {
        $scope.quoteSubStatus = null;
      }

      if (
        $scope.quoteStatus != "Venta Perdida" ||
        $scope.quoteSubStatus
      ) {
        paldiService.orders
          .setQuoteStatus(
            $scope.order.id,
            $scope.quoteStatus,
            $scope.quoteSubStatus
          )
          .then(function (order) {
            loadOrder();
          });
      }
    };

    $scope.statusNotesDialog = function () {
      $scope.dialog = ngDialog.open({
        template: "partials/views/console/status-notes.html",
        scope: $scope,
        showClose: false,
      });
    };

    function initProvidersSettings(elem){
      for (const key of Object.keys($scope.providersNeeded)){
        elem[key] = {'skip':false}
      }
      if(Object.keys($scope.providersSummary).length>0){
        for (const [key,value] of Object.entries($scope.providersSummary)){
          elem[key] = {'skip':false,user:value}
        } 
      }
    }
    $scope.selectProvidersDialog = function(){
      $scope.providersSelected = {}
      initProvidersSettings($scope.providersSelected)
      $scope.dialog = ngDialog.open({
        template: "partials/views/console/select-providers.html",
        scope: $scope,
        showClose: false,
      })

    }

    $scope.changeStatus = function (form, model) {
      if (form && form.$valid) {
        $scope.dialog.close();
        if($scope.newStatus=="PENDING_INFO"){
          $scope.statusNotesText = model
          $scope.promiseResolve()
          return
        }
        var updatedOrder = $scope.order;
        updatedOrder.statusNotes = model;

        paldiService.orders
          .updateStatus(updatedOrder, $scope.newStatus)
          .then(
            function (order) {
              swal({
                title:
                (EXECUTION_ENV=="EXTERNAL"?"Status: ":"Estado: ") +
                (EXECUTION_ENV=="EXTERNAL"?$scope.pretty("orderStatusEN",$scope.newStatus):$scope.pretty("orderStatus",$scope.newStatus)),
                text: (EXECUTION_ENV=="EXTERNAL"?"Order Status updated":"Estado de orden cambiado"),
                type: "success",
                confirmButtonText: (EXECUTION_ENV=="EXTERNAL"?"Accept":"Aceptar"),
              });

              if (
                order.type === "Mixta" &&
                $scope.newStatus === "LINE"
              ) {
                createSuborders(model, order);
              }

              if ($scope.newStatus === "CANCELED") {
                $state.go("console.quote-list");
              } else {
                loadOrder();
              }

              if (order.orderParent !== null) {
                $scope.statusOrderMaster(
                  order.orderParent,
                  order.status,
                  false
                );
              }
            },
            function (error) {
              

              if (
                error.data.exception ==
                "io.lkmx.paldi.quote.components.error.InventoryNotEnoughException"
              ) {
                swal({
                  title: (EXECUTION_ENV=="EXTERNAL"?"Not enough Inventory":"No hay inventario suficiente"),
                  type: "error",
                  confirmButtonText: (EXECUTION_ENV=="EXTERNAL"?"Accept":"Aceptar"),
                });
              } else {
                swal({
                  title: (EXECUTION_ENV=="EXTERNAL"?"Error":"Ocurrió un error"),
                  type: "error",
                  confirmButtonText: (EXECUTION_ENV=="EXTERNAL"?"Accept":"Aceptar"),
                });
                loadOrder();
              }
            }
          );
      } else if ($scope.newStatus == "TRANSIT") {
        // aca mirar
        $scope.dateDialog("arrival");
      } else if ($scope.newStatus == "PRODUCTION") {
        $scope.dateDialog("endProduction");
      }
    };

    $scope.confirmTransit = function (model) {
      $scope.dialog.close();
      var updatedOrder = $scope.order;
      updatedOrder.statusNotes = model.notes;
      updatedOrder.orderTransitInvoice=model.orderTransitInvoice
      updatedOrder.guides = model.guides
      
      paldiService.orders
        .updateStatus(updatedOrder, "TRANSIT")
        .then(function (order) {
          paldiService.orders
            .setDate(
              updatedOrder.id,
              $scope.dateType,
              $scope.date,
              model.notes
            ).then( ()=>{
              
              paldiService.orders.setGuides(
                updatedOrder
              )})
            .then(
              function () {
                swal({
                  title: (EXECUTION_ENV=="EXTERNAL"?"Order in Transit":"Orden en Tránsito"),
                  text: (EXECUTION_ENV=="EXTERNAL"?"Order set as In Transit":"Se marcó la orden como en tránsito"),
                  type: "success",
                  confirmButtonText: (EXECUTION_ENV=="EXTERNAL"?"Accept":"Aceptar"),
                });
                loadOrder();
                if (order.orderParent !== null) {
                  $scope.statusOrderMaster(
                    order.orderParent,
                    order.status,
                    false
                  );
                }
              },
              function (error) {
                swal({
                  title: (EXECUTION_ENV=="EXTERNAL"?"Error":"Ocurrió un error"),
                  type: "error",
                  confirmButtonText: (EXECUTION_ENV=="EXTERNAL"?"Accept":"Aceptar"),
                });
                loadOrder();
              }
            );
        });
      $scope.dateModel = {};
    };

    $scope.confirmProduction = function (model, form) {
      form.$validated = true;
      if (model.providerId && model.notes) {
        $scope.dialog.close();
        var updatedOrder = $scope.order;
        updatedOrder.statusNotes = model.notes;
        updatedOrder.providerId = model.providerId;
        paldiService.orders
          .updateStatus(updatedOrder, "PRODUCTION")
          .then(function (order) {
            paldiService.orders
              .setDate(
                updatedOrder.id,
                $scope.dateType,
                $scope.date,
                model.notes
              )
              .then(
                function () {
                  swal({
                    title: (EXECUTION_ENV=="EXTERNAL"?"Order In Production":"Orden en Producción"),
                    text: (EXECUTION_ENV=="EXTERNAL"?"Order set as in Production":"Se marcó la orden como en producción"),
                    type: "success",
                    confirmButtonText: (EXECUTION_ENV=="EXTERNAL"?"Accept":"Aceptar"),
                  });
                  loadOrder();

                  if (order.orderParent !== null) {
                    $scope.statusOrderMaster(
                      order.orderParent,
                      order.status,
                      false
                    );
                  }
                },
                function (error) {
                  swal({
                    title: (EXECUTION_ENV=="EXTERNAL"?"Error":"Ocurrió un error"),
                    type: "error",
                    confirmButtonText: (EXECUTION_ENV=="EXTERNAL"?"Accept":"Aceptar"),
                  });
                  loadOrder();
                }
              );
          });
        $scope.dateModel = {};
      }
    };
    //cambios para poder ir de linea a autorizado y viceversa
    $scope.statusOrderMaster = function (
      orderParent,
      suborderStatus,
      retroStatus
    ) {
      var status = {
        LINE: 1,
        BACKORDER: 2,
        PRODUCTION: 3,
        TRANSIT: 4,
        FINISHED: 5,
        PROGRAMMED: 6,
        INSTALLED_INCOMPLETE: 7,
        INSTALLED_NONCONFORM: 8,
        INSTALLED: 9,
      };

      var currentStatus = suborderStatus;
      paldiService.orders
        .getByOrderParent(orderParent.id)
        
        .then(function (suborders) {
          suborders.forEach(function (suborder) {

            if (status[currentStatus] > status[suborder.status]) {
              currentStatus = suborder.status;
            }
          });

          if (currentStatus !== orderParent.status) {
            if (!retroStatus) {
              var updatedOrder = orderParent;
              updatedOrder.statusNotes = "";
              updatedOrder.providerId = "";
              paldiService.orders
                .updateStatus(updatedOrder, currentStatus)
                .then(function (order) { });
            } else {
              paldiService.orders.updateRetroStatus(
                orderParent,
                currentStatus
              );
            }
          }
        });
    };

    //pruebas para cambios para poder ir de linea a autorizado y viceversa
//     $scope.statusOrderMaster = function (
//       orderParent,
//       suborderStatus,
//       retroStatus
//     ) {
//       var status = {
//         LINE: 1,
//         BACKORDER: 2,
//         PRODUCTION: 3,
//         TRANSIT: 4,
//         FINISHED: 5,
//         PROGRAMMED: 6,
//         INSTALLED_INCOMPLETE: 7,
//         INSTALLED_NONCONFORM: 8,
//         INSTALLED: 9,
//         QUOTE: 10,
//         QUOTED: 11,
//         PENDING_INFO: 12,
//         AUTHORIZED: 13,
//       };
    
//       var currentStatus = suborderStatus;
    
//       paldiService.orders.getByOrderParent(orderParent.id).then(function (suborders) {
//         suborders.forEach(function (suborder) {
//           // Permitir transiciones desde "LINE" a ["QUOTE", "QUOTED", "PENDING_INFO", "AUTHORIZED"]
//           if (
//             status[currentStatus] > status[suborder.status] &&
//             suborderStatus === "LINE" &&
//             [" QUOTE ", "QUOTED", "PENDING_INFO", "AUTHORIZED"].includes(
//               suborder.status
//             )
//           ) {
//             currentStatus = suborder.status;
//           }
    
//           // Permitir transiciones entre ["QUOTE", "QUOTED", "PENDING_INFO", "AUTHORIZED"]
//           // Permitir transiciones entre ["QUOTE", "QUOTED", "PENDING_INFO", "AUTHORIZED"] y hacia "LINE"
// if (
//   status[currentStatus] > status[suborder.status] &&
//   [" QUOTE ", "QUOTED", "PENDING_INFO", "AUTHORIZED"].includes(currentStatus) &&
//   [" QUOTE ", "QUOTED", "PENDING_INFO", "AUTHORIZED", "LINE"].includes(
//     suborder.status
//   )
// ) {
//   currentStatus = suborder.status;
// }

//         });
    
//         // Resto de la lógica original
//         if (currentStatus !== orderParent.status) {
//           if (!retroStatus) {
//             var updatedOrder = orderParent;
//             updatedOrder.statusNotes = "";
//             updatedOrder.providerId = "";
//             paldiService.orders.updateStatus(updatedOrder, currentStatus).then(
//               function (order) {}
//             );
//           } else {
//             paldiService.orders.updateRetroStatus(orderParent, currentStatus);
//           }
//         }
//       });
//     };
    
    //=================================================================

    $scope.editOrder = function () {
      $state.go("console.quote-edit", { orderId: $scope.order.id });
    };

    //===========================================================

    $scope.showProductNotes = function (notes) {
      if (notes) {
        $scope.showNotes = true;
        $scope.productNotes = notes;
      } else {
        $scope.showNotes = false;
        $scope.productNotes = "";
      }
    };
    //============================ DATES ===============================
    $scope.date = new Date();
    $scope.date.setHours(0, 0, 0, 0);
    // revisar aca
    $scope.dateDialog = function (dateType) {
      $scope.dateModel = {};
      $scope.dateType = dateType;
      if(dateType=='arrival'){
        $scope.dateModel['guides']=$scope.order.guides??[]
        $scope.dateModel['orderTransitInvoice']=$scope.order.orderTransitInvoice??""
      }
      if(dateType=='endProduction'){
        if($scope.order.providerId){
          $scope.dateModel['providerId']=$scope.order.providerId
        }
      }
      $scope.dialog = ngDialog.open({
        template: "partials/views/console/datepicker.html",
        scope: $scope,
        showClose: false,
      });

    };

    $scope.addDataToRepeater = function(model,type){
      if(type=="guides"){
        if(!model.guides){
          model.guides = [""]
        }
        else{
          model.guides.push("")
        }
      }
    }

    $scope.removeDataFromRepeater = function(model,type,index){
      
      if(type=="guides"){
        model.guides.splice(index,1)
        
      }

    }

    $scope.changeDate = function (model, form) {
      if ($scope.dateType == "install") {
        $scope.confirmInstallDate(model);
      }
      if ($scope.dateType == "arrival") {
        $scope.confirmTransit(model);
      }
      if ($scope.dateType == "endProduction") {
        $scope.confirmProduction(model, form);
      }
    };

    // $scope.dateOptions = {
    //   dateDisabled: disabled,
    //   formatYear: "yy",
    //   startingDay: 1,
    //   minDate: new Date(),
    // };
    $scope.dateOptions = {
      minDate: new Date(),
      dateDisabled: disabled,
      maxDate: new Date(2024, 12, 31),
      formatYear: 'yy',
      startingDay: 1
  };

    function disabled(data) {
      var date = data.date,
        mode = data.mode;
      return mode === "day" && date.getDay() === 0;
    }

    $scope.dateChanged = function (calendar) {
      $scope.date = calendar.date;
    };

    $scope.confirmInstallDate = function (model) {
      $scope.dialog.close();
      paldiService.orders
        .setDate(
          $scope.order.id,
          $scope.dateType,
          $scope.date,
          model.notes
        )
        .then(
          function () {
            swal({
              title: (EXECUTION_ENV=="EXTERNAL"?"Installation Date":"Fecha de Instalación"),
              text:  (EXECUTION_ENV=="EXTERNAL"?"Installation Date set":"Se capturó la fecha de instalación"),
              type: "success",
              confirmButtonText: (EXECUTION_ENV=="EXTERNAL"?"Accept":"Aceptar"),
            });
            loadOrder();
            if ($scope.order.orderParent !== null) {
              $scope.statusOrderMaster(
                $scope.order.orderParent,
                $scope.order.status,
                false
              );
            }
          },
          function (error) {
            swal({
              title: (EXECUTION_ENV=="EXTERNAL"?"Error":"Ocurrió un error"),
              type: "error",
              confirmButtonText: (EXECUTION_ENV=="EXTERNAL"?"Accept":"Aceptar"),
            });
            loadOrder();
          }
        );
    };

    $scope.toggleLog = function () {
      $scope.showLog = !$scope.showLog;
    };

    $scope.needsBill = function () {
      swal(
        {
          title: (EXECUTION_ENV=="EXTERNAL"?"Do you want to mark the order as Need Invoice?":"¿Seguro que deseas marcar la orden como Necesita Factura?"),
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: (EXECUTION_ENV=="EXTERNAL"?"Accept":"Aceptar"),
          cancelButtonText: (EXECUTION_ENV=="EXTERNAL"?"Cancel":"Cancelar"),
          closeOnConfirm: false,
          closeOnCancel: false,
        },
        function (isConfirm) {
          if (isConfirm) {
            paldiService.bills
              .needsBill($scope.order.id, "true")
              .then(
                function (order) {
                  swal({
                    title: (EXECUTION_ENV=="EXTERNAL"?"Order Set as Needs Invoice":"Orden marcada como Necesita factura"),
                    type: "success",
                    confirmButtonText: (EXECUTION_ENV=="EXTERNAL"?"Accept":"Aceptar"),
                  });
                  loadOrder();
                },
                function (error) {
                  
                }
              );
          } else {
            swal({
              title: (EXECUTION_ENV=="EXTERNAL"?"Canceled":"Cancelado"),
              type: "error",
              confirmButtonText: (EXECUTION_ENV=="EXTERNAL"?"Accept":"Aceptar"),
            });
          }
        }
      );
    };

    $scope.cancelPaymentDialog = function (paymentId) {
      $scope.paymentId = paymentId;
      $scope.dialog = ngDialog.open({
        template: "partials/views/console/payment-cancel.html",
        scope: $scope,
        showClose: false,
      });
    };

    $scope.cancelPayment = function (form, notes) {
      if (form.$valid) {
        swal(
          {
            title: (EXECUTION_ENV=="EXTERNAL"?"Dou you want to cancel de payment?":"¿Seguro que desea cancelar el Pago?"),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: (EXECUTION_ENV=="EXTERNAL"?"Accept":"Aceptar"),
            cancelButtonText: (EXECUTION_ENV=="EXTERNAL"?"Cancel":"Cancelar"),
            closeOnConfirm: false,
            closeOnCancel: false,
          },
          function (isConfirm) {
            if (isConfirm && !$scope.isCancellingPayment) {
              $scope.isCancellingPayment = true;
              var cancelRequest = {
                user: $scope.currentUser,
                paymentId: $scope.paymentId,
                notes: notes,
              };
              paldiService.payments.cancel(cancelRequest).then(
                function () {
                  swal({
                    title: (EXECUTION_ENV=="EXTERNAL"?"Payment Canceled":"Pago cancelado"),
                    type: "success",
                    confirmButtonText: (EXECUTION_ENV=="EXTERNAL"?"Accept":"Aceptar"),
                  });
                  loadOrder();
                  $scope.dialog.close();
                  $scope.isCancellingPayment = false;
                },
                function (error) {
                  swal({
                    title: (EXECUTION_ENV=="EXTERNAL"?"Error":"Ocurrió un error"),
                    type: "error",
                    confirmButtonText: (EXECUTION_ENV=="EXTERNAL"?"Accept":"Aceptar"),
                  });
                  $scope.isCancellingPayment = false;
                  loadOrder();
                }
              );
            } else {
              swal({
                title: (EXECUTION_ENV=="EXTERNAL"?"Canceled":"Cancelado"),
                type: "error",
                confirmButtonText: "Aceptar",
              });
            }
          }
        );
      } else {
        form.$validated = true;
      }
    };

    $scope.loadAdditionals = function () {
      $scope.plusList = [];
      $scope.motorList = [];
      $scope.installationPlusList = [];

      $scope.productsSorted.forEach(function (productTypeArray) {
        productTypeArray.products.forEach(function (product) {
          if (product.plusList && product.plusList.length > 0) {
            product.plusList.forEach(function (plus) {
              plus.item = product.item;
              $scope.plusList.push(plus);
            });
          }

          if (
            product.installationPlusList &&
            product.installationPlusList.length > 0
          ) {
            product.installationPlusList.forEach(function (
              installationPlus
            ) {
              installationPlus.item = product.item;
              $scope.installationPlusList.push(installationPlus);
            });
          }

          if (product.motorList.length > 0) {
            product.motorList.forEach(function (motor) {
              if(EXECUTION_ENV=="EXTERNAL"){

              }
              motor.item = product.item;
              if(EXECUTION_ENV=="EXTERNAL"){
                $scope.motorList.push(motor);
              }
              else{$scope.plusList.push(motor)};
            });
          }
        });
      });
    };

    $scope.getPositionOfProduct = function (type) {
      return $scope.productsSorted.findIndex(function (t) {
        return t.type === type;
      });
    };

    var getMaxDate = function (limitDays) {
      var START_CYCLE = 1;
      var SATURDAY = 6;
      var SUNDAY = 7;

      var maxDate = $scope.currentDate.clone();

      var limit = limitDays;

      var count = START_CYCLE;
      do {
        if (
          maxDate.isoWeekday() === SATURDAY ||
          maxDate.isoWeekday() === SUNDAY
        ) {
          count--;
        }

        if (count < limit) {
          maxDate = maxDate.add(1, "days");
          count++;
        }

        if (
          count === limit &&
          (maxDate.isoWeekday() === SATURDAY ||
            maxDate.isoWeekday() === SUNDAY)
        ) {
          if (maxDate.isoWeekday() === SATURDAY) {
            maxDate = maxDate.add(2, "days");
          } else {
            maxDate = maxDate.add(1, "days");
          }
        }
      } while (count < limit);

      return maxDate;
    };

    var item = 0;
    var orderProductsByType = function (product) {
      var pos;
      if ($scope.mixedLabel != undefined && ($scope.mixedLabel.indexOf("Persianas") != -1 && $scope.mixedLabel.indexOf("Filtrasol") != -1)) {
        if (product.productType == "Enrollable" || product.productType == "Filtrasol") {
          pos = $scope.productsSorted.findIndex(function (t) {
            return t.type === "Persiana o Filtrasol"
          });
        } else {
          pos = $scope.productsSorted.findIndex(function (t) {
            return t.type === product.productType
          });
        }
      } else {
        pos = $scope.productsSorted.findIndex(function (t) {
          return t.type === product.productType
        });
      }

      product.item = ++item;
      $scope.productsSorted[pos].products.push(product);
      

    }

    var getCycleDays = function (currentDate, startDate, endDate) {
      var cycle = 0;
      var days;
      var daysExcludingWeekends = 0;
      var START_CYCLE = 1;

      if (startDate) {
        if (!endDate) {
          cycle = currentDate.diff(startDate, 'days');
        } else {
          cycle = endDate.diff(startDate, 'days');
        }
        days = (cycle <= 0) ? 0 : cycle;
        daysExcludingWeekends = getDaysExcludingWeekends(startDate, days);
        daysExcludingWeekends += START_CYCLE;

        return daysExcludingWeekends;
      } else {
        return " - ";
      }
    }

    var getRemainingDays = function (startDate, commitmentDate, endDate) {
      var currentDate = moment();
      var days = 0;
      var daysLeft = 0;
      var comparisonDate;
      if (startDate && commitmentDate) {
        days = commitmentDate.diff(startDate, 'days');
        if (!endDate) {
          comparisonDate = angular.copy(currentDate);
        } else {
          comparisonDate = angular.copy(endDate);
        }
        days = getDaysExcludingWeekends(startDate, days);
        daysLeft = getDaysLeft(startDate, comparisonDate, days);
        return daysLeft;
      } else {
        return " - ";
      }
    }

    var getDaysExcludingWeekends = function (startDate, days) {
      var daysExcludingWeekends = angular.copy(days);
      var date = angular.copy(startDate);
      for (var i = 0; i < days; i++) {
        date = date.add(1, 'days');
        if (date.isoWeekday() === 6 || date.isoWeekday() === 7) {
          daysExcludingWeekends--;
        }
      }
      return daysExcludingWeekends;
    }

    var getDaysLeft = function (startDate, comparisonDate, commitmentDays) {
      var leftDays = angular.copy(commitmentDays);
      var date = angular.copy(startDate);
      var passedDays = comparisonDate.diff(date, 'days');
      for (var i = 0; i < passedDays; i++) {
        date = date.add(1, 'days');
        if (date.isoWeekday() !== 6 && date.isoWeekday() !== 7) {
          leftDays -= 1;
        }
      }
      return leftDays;
    }

    var getDPFCDays = function (startDate, commitmentDate, endDate) {
      var days;
      var absDays;
      var START_CYCLE = 1;
      var dpfcDays;

      if (startDate && commitmentDate) {
        days = getRemainingDays(startDate, commitmentDate, endDate);
        $scope.dpfcStatus = getCountdownStatus(startDate, days, commitmentDate, endDate);
        $scope.dpfcTotalStatus = getCountdownStatus(startDate, days, commitmentDate, endDate);
        absDays = isNaN(days) ? days : Math.abs(days);
        var businessDays = commitmentDate.diff(startDate, 'days');
        businessDays = getDaysExcludingWeekends(startDate, businessDays);
        var totalDays = (businessDays + START_CYCLE) - days;
        dpfcDays = absDays + "/" + (businessDays + START_CYCLE);

        if (endDate === null) {
          dpfcDays = absDays;
        } else {
          dpfcDays = totalDays;
        }
        $scope.dpfcTotalDays = businessDays + START_CYCLE;


      } else {
        dpfcDays = " - "
      }
      return dpfcDays;

    }

    var getProductionDays = function (startDate, commitmentDate, endDate) {
      var days;

      var START_CYCLE = 1;
      var productionDays;
      if (startDate && commitmentDate) {

        days = getRemainingDays(startDate, commitmentDate, endDate);
        $scope.productionStatus = getCountdownStatus(startDate, days, commitmentDate, endDate);
        $scope.productionTotalStatus = getCountdownStatus(startDate, days, commitmentDate, endDate);
        var absDays = isNaN(days) ? days : Math.abs(days);
        var businessDays = commitmentDate.diff(startDate, 'days');
        businessDays = getDaysExcludingWeekends(startDate, businessDays);
        var totalDays = (businessDays + START_CYCLE) - days;
        if (endDate === null) {
          productionDays = absDays;
        } else {
          productionDays = totalDays;

        }
        $scope.productionTotalDays = businessDays + START_CYCLE;

      } else {
        productionDays = "-";
      }
      return productionDays;
    }

    var getCountdownStatus = function (startCycle, days, commitmentDate, endDate) {
      var status = '';
      if (startCycle && commitmentDate) {
        if (!endDate) {
          status = (days >= 0) ? 'START' : 'LATE';
        } else {
          status = 'END';
        }
      } else {
        status = '';
      }
      return status;

    }

    var getTransitDays = function (currentDate, startDate, endDate, commitmentDate) {
      var cycle = 0;
      var days;
      var daysExcludingWeekends = 0;
      var transitDays;
      var START_CYCLE = 1;

      if (startDate && commitmentDate) {
        if (!endDate) {
          cycle = currentDate.diff(startDate, 'days');
        } else {
          cycle = endDate.diff(startDate, 'days');
        }
        var businessDays = commitmentDate.diff(startDate, 'days');
        businessDays = getDaysExcludingWeekends(startDate, businessDays);
        days = (cycle <= 0) ? 0 : cycle;
        daysExcludingWeekends = getDaysExcludingWeekends(startDate, days);
        daysExcludingWeekends += START_CYCLE;
        transitDays = daysExcludingWeekends + "/" + (businessDays + START_CYCLE);

        return transitDays;
      } else {
        return " - ";
      }
    }

    //============= Data tables =============
    $scope.tableOptions = DTOptionsBuilder.newOptions()
      .withDisplayLength(25)
      .withOption("ordering", false)
      .withDOM("rt")
      .withLanguage((EXECUTION_ENV=="EXTERNAL"?"lang/table_lang_en.json":"lang/table_lang.json"));

    $scope.tableColumns = [
      DTColumnDefBuilder.newColumnDef(1).withOption(
        "responsivePriority",
        1
      ),
    ];
  }
  

);
