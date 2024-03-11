import { pdApp, globals } from "../../index";

export function generatePapelHandlers($http) {
  var getPapelPrice = async function (papel) {
  
  
        
  
        }

  var getPapelColors = function (piso,etk) {
   
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
  return { getPapelPrice, getPapelColors, getPlusColors };
}
