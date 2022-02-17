import { attachTo } from "../../../../utils/attach";

import { showSwal } from "../../../../utils/swal/show";

import { formatTelephone, deformatTelephone } from "./formatTelephone";
import { getExtraNames, getInstallationSheetSaveHandler, getObjName, isExtraPresent } from "./helpers"

const getInstallationSheetState = async ($scope, order) => {
  const previousInstallationSheet = await $scope.paldiService.installationSheet.fetchState($scope.order.id)
  const data = previousInstallationSheet.data ?? {}

  // Joins all the elements in the following structure {name: true, ...}
  const getAllItems = (items) => {
    return Object.fromEntries(
      [
        ...Object.entries(items).filter(([k, v]) => !k.includes('other_')),
        ...getOtherItems(items).map(v => [v, true])
      ]
    )
  }
  // only retrieves an array of extra items (names)
  const getOtherItems = (items) => {
    return Object.entries(items)
      .filter(([k, _]) => k.includes('other_'))
      .map(([_, v]) => v)
      .filter(v => v !== "")
  }

  return {
    orderNo: order.orderNo | order.quoteNo,

    receivingPerson: data.receiver,
    telephone: deformatTelephone(data.phone_number),
    address: data.address,
    addressReference: data.address_guide,
    postalCode: data.cp,

    extras: getAllItems(previousInstallationSheet.tools ?? {}),
    otherExtra: getOtherItems(previousInstallationSheet.tools ?? {}),
    materials: getAllItems(previousInstallationSheet.material ?? {}),
    otherMaterials: getOtherItems(previousInstallationSheet.material ?? {}),

    extraError: false,
  }
}


export const showCreateInstallationSheetDialog = async (
  $scope,
  callback,
  mode = "create"
) => {
  $scope.installationSheet = {
    ...(await getInstallationSheetState($scope, $scope.order)),
    save: async (installationForm) => {

      // console.log($scope)
      const data = $scope.installationSheet;
      // console.log(data)

      const extras = data.extras;
      const material = data.materials;

      // if (!isExtraPresent(extras, material)) {
      //   $scope.installationSheet.extraError = true;
      //   return
      // } else { 
      //   $scope.installationSheet.extraError = false;
      // }

      const finalExtras = data.otherExtra.filter(
        (extraItem) => data.extras[extraItem]
      );

      const finalMaterials = data.otherMaterials.filter(
        (materialItem) => data.materials[materialItem]
      );

      const phone = formatTelephone(data.telephone);

      const order = $scope.order;
      const sheetData = {
        order_id: order.id,
        data: {
          receiver: data.receivingPerson,
          phone_number: data.telephone,
          address: data.address,
          address_guide: data.addressReference,
          cp: data.postalCode,
        },
        tools: {
          rotomartillo: extras.rotomartillo,
          andamios: extras.andamios,
          escaleras: extras.escaleras,
          other_1: finalExtras[0] || "",
          other_2: finalExtras[1] || "",
          other_3: finalExtras[2] || "",
          other_4: finalExtras[3] || "",
          other_5: finalExtras[4] || "",
          other_6: finalExtras[5] || "",
        },
        material: {
          acero: material.acero,
          tablarroca: material.tablarroca,
          aluminio: material.aluminio,
          madera: material.madera,
          other_1: finalMaterials[0] || "",
          other_2: finalMaterials[1] || "",
          other_3: finalMaterials[2] || "",
          other_4: finalMaterials[3] || "",
        },
      };

      let response = await $scope.paldiService.installationSheet.create(sheetData);
      if (!["api.errors.installation.sheet.duplicated", "api.success.installation.sheet.create"].includes(response.data.code)) {
        return showSwal("messages.error");
      }
      if (response.data.code === "api.errors.installation.sheet.duplicated") {
        response = await $scope.paldiService.installationSheet.edit(sheetData);
        if (response.data.code !== "api.success.installation.sheet.edit")
          return showSwal("messages.error")
      }
      $scope.dialog.close()
      callback()

    },
    addOtherExtra: (otherName, arrayName) => {
      if (!otherName || $scope.installationSheet[arrayName].includes(otherName)
        || (arrayName === "otherExtra" ? $scope.installationSheet[arrayName].length === 6 : $scope.installationSheet[arrayName].length === 4)) {
        return;
      }
      $scope.installationSheet[arrayName].push(otherName);
      const objName = getObjName(arrayName);
      $scope.installationSheet[objName][otherName] = true;
    },
    removeOtherExtra: (otherName, arrayName) => {
      const objName = getObjName(arrayName);

      const otherPositionIdx = Object.values($scope.installationSheet[objName]).findIndex((value) => value === otherName);

      const otherNameInInstallationSheet = Object.keys($scope.installationSheet[objName])[otherPositionIdx]

      $scope.installationSheet[arrayName] = $scope.installationSheet[arrayName].filter((extra) => extra !== otherName);
      delete $scope.installationSheet[objName][otherName];
      delete $scope.installationSheet[objName][otherNameInInstallationSheet];

    },
  };
  // //console.log($scope);
  //console.log($scope);
  

  $scope.dialog = $scope.ngDialog.open({
    template: "js/controllers/order/installation-sheet/form-create.html",
    // template: "partials/views/console/installation-sheet/form-create.html",
    scope: $scope,
    showClose: false,
    closeOnClickOutside: false,
    closeByDocument: false,
    controller:function() {
      'use strict';
      
      var loaded
      var geocoder = new google.maps.Geocoder();
      var marker;

      $scope.store_location = {
        lat: '32.5121884',
        lng: '-117.0208881',
        name: 'Estación Tijuana'
      } 
      $scope.address = {}
  
      $scope.map = '';
  
      $scope.geocodePosition = function(pos) {
        geocoder.geocode({
          latLng: pos
        }, function(responses) {
          //console.log(responses.length)
          if (responses && responses.length > 0) {
            $scope.updateMarkerAddress(responses[0]);
          } else {
            $scope.error = 'I feel free..!!!';
          }
        });
      };

      $scope.addressToGeocode = async(addr) => {
        var res =null;
        await geocoder.geocode({
          address: addr
        }, function(responses) {
          //console.log(responses.length)
          if (responses && responses.length > 0) {
            res = responses[0]
          } else {
            $scope.error = 'I feel free..!!!';
          }
        });
        return res;
      };
      
      $scope.updateMarker = async(str)=>{
        var res = await $scope.addressToGeocode(str)
        
        res.address_components.forEach(elem=>{
          
          if(elem.types.includes('postal_code')){
           
            document.getElementById('postalCode').value=elem.long_name;
            $scope.installationSheet.postalCode=elem.long_name;
          }
        })

        res = res.geometry.location
        marker.setPosition(res)
        $scope.map.setCenter(res)

      }
    
      $scope.updateMarkerAddress = function(str) {
        ////console.log(str)
        document.getElementById('address').value = str.formatted_address
        $scope.installationSheet.address = str.formatted_address
        str.address_components.forEach(elem=>{
        
          if(elem.types.includes('postal_code')){
            //console.log("AAAAA", elem)
            document.getElementById('postalCode').value=elem.long_name;
            $scope.installationSheet.postalCode=elem.long_name;
          }
        })

        

      };
  
      $scope.updateMarkerPosition = function(latLng) {
        $scope.address.latlon = [
          latLng.lat(),
          latLng.lng()
        ].join(', ');
        
      };
  
      $scope.changeMarkerPosition= function(lat_lon){
          if (lat_lon === null) {
                  lat_lon = "-8.6429208,115.1939819";
                  lat_lon = lat_lon.split(",");
                } else {
                  lat_lon = lat_lon.split(",");
                }
  
          var latLng = new google.maps.LatLng(lat_lon[0], lat_lon[1]);
          marker.setPosition (latLng)
      }
  
      $scope.initMapMarker = async(marker_latlon) =>{
        
  
        var lat_lon = marker_latlon;
        if (lat_lon === null) {
          if($scope.installationSheet.address=="" || null)
              lat_lon =$scope.store_location.lat+','+ $scope.store_location.lng;
          else{
              lat_lon = await $scope.addressToGeocode($scope.installationSheet.address)
              lat_lon = lat_lon.geometry.location
              lat_lon =[lat_lon.lat(),lat_lon.lng()].join(',')
              
          }

          lat_lon = lat_lon.split(",");
        } else {
          lat_lon = lat_lon.split(",");
        }
        var latLng = new google.maps.LatLng(lat_lon[0], lat_lon[1]);
        
        
        $scope.map = new google.maps.Map(document.getElementById('mapcanvas'), {
          zoom: 18,
          center: latLng,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        marker = new google.maps.Marker({
          position: latLng,
          title: 'Marker',
          map: $scope.map,
          draggable: true
        });
    
        // Update current position info.
        $scope.geocodePosition(latLng);
  
        google.maps.event.addListener(marker, 'drag', function() {
          $scope.updateMarkerPosition(marker.getPosition());
          //console.log($scope.installationSheet.address)
        });
        
        google.maps.event.addListener(marker, 'dragend', function() {
          $scope.geocodePosition(marker.getPosition());
        });
      };
      var loaded= false;
  
      var isMapLoaded= function (){
        if(document.getElementById('mapcanvas')!=null){
          if(loaded==false){
            loaded=true;
            $scope.initMapMarker(null)
          }
          
        }
      }
      var watcher =$scope.$watch(function () {
        return document.body.innerHTML;
       }, function(val) {
        isMapLoaded()
       });
    }
  });
  

};

