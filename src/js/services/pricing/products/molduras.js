import { pdApp, globals } from "../../index";

//------------------------------ Plus ------------------------------
export function generateMoldurasHandlers($http, $filter) {

  var getMoldingTypes = function (model,etk) {
    console.log("modelo moldura",model)
    if(etk=='etk'){
      $http
      .get(globals.apiURL + "/pricing/plus/" + model.type+'etk', {
        authentication: "yokozuna",
      })
      .then(function (response) {
        model.molding_types = [];
        response.data.forEach(function (element, index) {
          
          model.molding_types.push({
            label: element.name,
            value: element,
          });
        });
      });
    }else{
      $http
      .get(globals.apiURL + "/pricing/plus/" + model.type, {
        authentication: "yokozuna",
      })
      .then(function (response) {
        model.molding_types = [];
        response.data.forEach(function (element, index) {
          
          model.molding_types.push({
            label: element.name,
            value: element,
          });
        });
      });
    }




  };


  var getMoldingPrice = function (model) {
    console.log("modelo moldura",model)
    if(!model.molding_types) return
    let type = model.molding_types.filter(x=> x.label == model.name)
    let price  = type.length > 0 ? type[0].value.price : null

    if(!price){
        model.price = null
        model.unit  = null
        model.total = null
        return
    }
    model.price = type[0].value.price * model.quantity
    model.unit  = type[0].value.price
    model.total = type[0].value.price * model.quantity


  };

  

  return { getMoldingTypes, getMoldingPrice };
}