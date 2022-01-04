import {globals} from "../../config"

angular.module("dataModule")
  .factory("userDataService", ["$http", userDataService])

const AUTH = {authentication: "yokozuna"}

function userDataService($http) {
  let service = {}
  service.saveUser = saveUser

  /**
   *
   * @param user
   * @returns {Promise<unknown>}
   * The promise resolves with the data from the response of the api
   * The promise rejects with an error string
   * Errors: ["duplicatedEmail", "unknown"]
   */
  function saveUser(user) {
    return new Promise((resolve, reject) => {
      $http
        .post(`${globals.apiURL}/quotes/users`, user, AUTH)
        .then(response => resolve(response.data))
        .catch(error => {
          if (error?.status === 409) {
            reject("duplicatedEmail", error)
            return
          }
          reject("unknown", error)
        })
    })
  }

  return service
}