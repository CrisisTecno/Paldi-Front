const default_config = {
  apiURL: "http://localhost:8888",
  version: "3.3.7",
  iva: 0.08,
  env: "local",
  creation_permission: ($rootScope) => {
    // //console.log("evaluating something")
    return $rootScope.currentUser.canAdmin
  },
  test: [
    "asd",
    "bsd",
  ],

  roles: [
    {
      name: "CONSULTANT",
      text: "Asesor",
      creation_permission: (currentUser) => currentUser.canAdmin,
    },
    {
      name: "MANAGER",
      text: "Gerente de compras",
      creation_permission: (currentUser) => currentUser.canAdmin,
    },
    {
      name: "INSTALLATION_MANAGER",
      text: "Gerente de Instalación",
      creation_permission: (currentUser) => currentUser.canAdmin,
    },
    {
      name: "SALES_MANAGER",
      text: "Gerente de Ventas",
      creation_permission: (currentUser) => currentUser.canAdmin,
    },
    {
      name: "BUYER",
      text: "Comprador",
    },
    {
      name: "ADMIN",
      text: "Admin",
      creation_permission: (currentUser) => currentUser.role === "SUPERADMIN",
    },
    {
      name: "SUPERADMIN",
      text: "Super Admin",
      creation_permission: (currentUser) => currentUser.canAdmin,
    },
    {
      name: "EXTERNAL_CONSULTANT",
      text: "Asesor Externo",
      creation_permission: currentUser => currentUser.canAdmin,
    },
  ],
}

const external_api = {
  api: {
    auth: {
      whoami: "/auth/whoami",
    },
    orders: {
      byStatus: "/search"
    },
  },
}

const internal_api = {
  api: {
    auth: {
      whoami: "/me/user",
    },
    orders: {
      byStatus: "/search/status/list"
    },
  },
}

config = {
  external_local: {
    ...default_config,
    ...external_api
  },
  external_staging: {
    ...default_config,
    apiURL: "http://cotizadorpaldi.com.mx:7777",
    ...external_api,
    env: "staging",
  },
  external_production:{
    ...default_config,
    apiURL: "https://cotizadorpaldi.com.mx:3333",
    ...external_api,
    env: "production",
  },
  internal_local: {
    ...default_config,
    ...internal_api
  },
  internal_staging: {
    ...default_config,
    apiURL: "http://192.241.238.176:9999",
    ...internal_api,
    env: "staging",
  },
  internal_production: {
    ...default_config,
    apiURL: "https://cotizadorpaldi.com.mx/api",
    ...internal_api,
    env: "production",
  },
  new_internal_staging: {
    ...default_config,
    apiURL: "http://192.241.238.176:9999",
    ...internal_api,
    env: "staging",
  }
  
}

function parseConfig(data) {
  if (typeof data === "function") {
    return data
  }
  if (typeof data !== "object") {
    return JSON.stringify(data)
  }
  data = {...data}

  for ([key, value] of Object.entries(data)) {
    data[key] = parseConfig(value)
  }
  return data
}

module.exports = parseConfig(config)