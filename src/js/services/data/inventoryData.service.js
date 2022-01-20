import {globals} from "../../config"
import {pdApp} from "../../../pdApp";

pdApp
  .factory("inventoryDataService", ["$http", inventoryDataService])

const API_URL = globals.apiURL
const AUTH = {authentication: "yokozuna"}

function inventoryDataService($http) {
  let service = {}
  service.getWarehouses = getWarehouses

  function getWarehouses() {
    return $http
      .get(`${API_URL}/quotes/warehouses/list`, AUTH)
      .then(response => response.data)
  }

  return service
}