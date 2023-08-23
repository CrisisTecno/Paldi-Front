import { globals } from ".."

const url = globals.newApiUrl + '/reports'

const getEndpoint = (endpoint) => url + (endpoint.startsWith('/') ? '' : '/') + endpoint
export const buildReportsService = ($http) => ({
  getList: () => {
    return $http.post(getEndpoint('list'))
  },
  download: (properties) => {
    return $http.post(getEndpoint(properties.name + '/' + properties.type), properties.data)
  },
  getHistory: (properties) => {
    return $http.post(getEndpoint('history'), properties)
  }
})