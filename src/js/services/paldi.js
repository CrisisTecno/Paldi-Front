import {pdApp} from "./index";
import {globals} from "./index";
import moment from "moment";
import {buildReportsService} from "./paldi/reports";
import {getQuoteStatusFromList} from "./order/defaults";
import { console_costing, reports } from "../../../webpack/locale/es";
import { inches_to_meters, meters_to_inches, sq_inches_to_meters, sq_meters_to_inches } from "../utils/units";
const PRODUCTS = ['pisos', 'enrollables', 'filtrasoles', 'balances', 'shutters', 'toldos', 'moldings','cortinas']
// TODO: Agregar esto a un modulo
pdApp.factory("paldiService", function ($http, $q, $rootScope) {
  let service = {};

  service.reports = buildReportsService($http)

  service.products = {
    fetchPrice: async (data) => {
      if(EXECUTION_ENV=="EXTERNAL"){
      let obj = {...data,
        width: inches_to_meters(data.width + parseFloat(data.w_fraction??0)),
        height: inches_to_meters(data.height + parseFloat(data.h_fraction??0))
        }
        return (await $http.post(globals.apiURL + "/newapi/products/price", obj)).data.data
      }

      return (await $http.post(globals.apiURL + "/newapi/products/price", data)).data.data
    },
    fetchAdditionals: async (data) => {
      return (await $http.post(globals.apiURL + "/newapi/products/additionals", data)).data.data
    },
    fetchAdditional: async (data) => {
      return (await $http.post(globals.apiURL + "/newapi/products/additional", data)).data.data
    },
    fetchAllAdditionals: async (data) => {
      return (await $http.post(globals.apiURL + "/newapi/products/all_additionals", data)).data.data
    },
    fetchColors: async (data) => {
      return (await $http.post(globals.apiURL + '/newapi/products/colors', data)).data.data
    },
    fetchCortinaAcabados: async () => {
      return (await $http.post(globals.apiURL + '/newapi/products/oki', {})).data.data
    },
  }

  //--------------- PASSWORD ---------------
  service.password = {
    forgotPassword: function (email) {
      return $http
        .post(globals.apiURL + "/quotes/users/forgot-password", {
          email: email,
        })
        .then(function (response) {
          return response.data;
        });
    },

    changePassword: function (obj, id) {
      return $http
        .put(
          globals.apiURL + "/quotes/users/" + id + "/password",
          obj,
          {authentication: "yokozuna"}
        )
        .then(function (response) {
          return response.data;
        });
    },
  };

  service.installationSheet = {
    create: function (data) {
      return $http.post(
        globals.apiURL + "/newapi/installation/sheet/create",
        data,
        {
          authentication: "yokozuna",
        }
      );
    },
    edit: function (data) {
      return $http.post(
        globals.apiURL + "/newapi/installation/sheet/edit",
        data,
        {authentication: "yokozuna"}
      );
    },
    fetchState: async (id) => {
      try {
        const result = await $http.post(
          globals.apiURL + "/newapi/installation/sheet/get",
          {order_id: id},
          {authentication: "yokozuna"}
        );

        return result.data;
      } catch (e) {
        // console.log(e);
        return e;
      }
    },
    exists: async function (id) {
      const response = await $http.post(
        globals.apiURL + `/newapi/installation/sheet/exists/${id}`,
        {authentication: "yokozuna"}
      );
      return response?.data?.code === 'api.errors.installation.sheet.found'
    },
  };

  //--------------- USERS ---------------
  service.users = {
    whoAmI: function () {
      return $http
        .get(globals.apiURL + globals.api.auth.whoami, {
          authentication: "yokozuna",
        })
        .then(function (response) {
          // console.log("WHOAMI RAN: ", response)
          if (response.data.role === "EXTERNAL_CONSULTANT"){
            response.data.realRole = "EXTERNAL_CONSULTANT"
            response.data.role = "CONSULTANT"
          }
          return response.data;
        });
    },

    getExternalDiscount:function(id){
      return $http
      .get(globals.apiURL + "/newapi/orgs/organizations/" + id, {
        authentication: "yokozuna",
      })
      .then(function (response) {
        return response.data;
      });

    },
    get: function (id) {
      return $http
        .get(globals.apiURL + "/quotes/users/" + id, {
          authentication: "yokozuna",
        })
        .then(function (response) {
          // console.log("GET USER RAN: ", response)
          if (response.data.role === "EXTERNAL_CONSULTANT"){
            response.data.realRole = "EXTERNAL_CONSULTANT"
            response.data.role = "CONSULTANT"
          }
          return response.data;
        });
    },

    getByRole: function (role) {
      return $http
        .get(globals.apiURL + "/quotes/users/role/" + role, {
          authentication: "yokozuna",
        })
        .then(function (response) {
          // console.log("GET USER BY ROLE RAN: ", response)
          return response.data;
        });
    },

    findByRole: function (role, search) {
      return $http
        .get(
          globals.apiURL +
          "/quotes/users/role/" +
          role +
          "/search/" +
          search,
          {authentication: "yokozuna"}
        )
        .then(function (response) {
          return response.data;
        });
    },

    findByRoleAndHasWarehouse: function (role, search) {
      return $http
        .get(
          globals.apiURL +
          "/quotes/users/role/" +
          role +
          "/warehouse/search/" +
          search,
          {authentication: "yokozuna"}
        )
        .then(function (response) {
          return response.data;
        });
    },

    list: function (page, size, sort) {
      return $http
        .get(
          globals.apiURL +
          "/quotes/users?page=" +
          page +
          "&size=" +
          size +
          "&sort=" +
          sort,
          {authentication: "yokozuna"}
        )
        .then(function (response) {
          return response.data;
        });
    },

    search: function (page, size, sort, search) {
      return $http
        .get(
          globals.apiURL +
          "/quotes/users/search/" +
          search +
          "?page=" +
          page +
          "&size=" +
          size +
          "&sort=" +
          sort,
          {authentication: "yokozuna"}
        )
        .then(function (response) {
          return response.data;
        });
    },

    save: function (user) {
      return $http
        .post(globals.apiURL + "/quotes/users", user, {
          authentication: "yokozuna",
        })
        .then(function (response) {
          return response.data;
        });
    },

    update: function (user) {
      return $http
        .put(globals.apiURL + "/quotes/users/" + user.id, user, {
          authentication: "yokozuna",
        })
        .then(function (response) {
          return response.data;
        });
    },

    delete: function (id) {
      return $http
        .delete(globals.apiURL + "/quotes/users/" + id, {
          authentication: "yokozuna",
        })
        .then(function (response) {
          return response.data;
        });
    },

    activate: function (id) {
      return $http
        .put(
          globals.apiURL + "/quotes/users/" + id + "/activate",
          {},
          {authentication: "yokozuna"}
        )
        .then(function (response) {
          return response.data;
        });
    },

    deactivate: function (id) {
      return $http
        .put(
          globals.apiURL + "/quotes/users/" + id + "/deactivate",
          {},
          {authentication: "yokozuna"}
        )
        .then(function (response) {
          return response.data;
        });
    },
  };

  //--------------- CLIENTS ---------------
  service.clients = {
    get: function (id) {
      return $http
        .get(globals.apiURL + "/quotes/clients/" + id, {
          authentication: "yokozuna",
        })
        .then(function (response) {
          return response.data;
        });
    },

    list: function (page, size, sort,user) {
      let params = {}
      if (EXECUTION_ENV === "INTERNAL") {
        params = {
          page: page,
          size: size,
          sort: {[sort.split(",")[0]]: sort.split(",") === "asc" ? 1 : -1,},
        }
      } else {
        const query = JSON.stringify({
          rows: size,
          start: page * size,
          sort: {
            [sort.split(",")[0]]: sort.split(",") === "asc" ? 1 : -1,
          }
        })
        params = {query: query}

      }

      return $http
        .get(
          globals.apiURL +
          "/quotes/clients",
          {
            authentication:"yokozuna",
            params: params
          }
        )
        .then(function (response) {
          return response.data;
        });
    },

    save: function (client) {
      return $http
        .post(globals.apiURL + "/quotes/clients", client, {
          authentication: "yokozuna",
        })
        .then(function (response) {
          return response.data;
        });
    },

    update: function (client) {
      let endpoint = globals.apiURL + "/quotes/clients"
      if (EXECUTION_ENV === "INTERNAL") {
        endpoint = globals.apiURL + "/quotes/clients/" + client.id
      }

      return $http
        .put(endpoint, client, {
          authentication: "yokozuna",
        })
        .then(function (response) {
          return response.data;
        });
    },

    loadDiscount: function (type) {
      return $http
        .get(
          globals.apiURL +
          "/quotes/clients/discount/" +
          type +
          "/" +
          $rootScope.currentUser.id,
          {authentication: "yokozuna"}
        )
        .then(function (response) {
          return response.data;
        });
    },

    search: function (page, size, sort, search,user) {
      console.log(user)
      return $http
        .get(
          globals.apiURL +
          "/quotes/clients/search/page/" +
          search +
          "?page=" +
          page +
          "&size=" +
          size +
          "&sort=" +
          sort + 
          (EXECUTION_ENV =="EXTERNAL"?'&user=' + user.id:"")
          ,
          {authentication: "yokozuna"}
        )
        .then(function (response) {
          return response.data;
        });
    },

    find: function (search) {
      
      return $http
        .get(globals.apiURL + "/quotes/clients/search/" + search, {
          authentication: "yokozuna",
        })
        .then(function (response) {
          return response.data;
        });
      

    },
  };

  //--------------- ORDERS ---------------
  service.orders = {

    get: function (id) {

      if(EXECUTION_ENV=="EXTERNAL"){
        const PRODUCTS = ['pisos', 'enrollables', 'filtrasoles', 'balances', 'shutters', 'toldos', 'moldings','cortinas']
      return $http
        .get(globals.apiURL + "/quotes/orders/" + id, {
          authentication: "yokozuna",
        })
        .then(function (response) {
          let order = response.data
          order.hasTaxes = !(order.iva < 0.001)
          order.hasShipping = !(order.shiping < 0.001)
          for (const product of PRODUCTS) {
            order[product]?.forEach((product) => {
              product.width = meters_to_inches(product.width)
              product.height = meters_to_inches(product.height)
              product.m2 = sq_meters_to_inches(parseFloat(product.m2))
            })
          }
          order.products?.forEach((product) => {
            console.log(product, product.width, product.height, product.m2)
            product.width = meters_to_inches(product.width)
            product.height = meters_to_inches(product.height)
            product.m2 = sq_meters_to_inches(parseFloat(product.m2))
          })

          console.log('fetched order', order)

          // console.log("API CALL: /quotes/orders/{id}")
          // console.log(order)
          return order;
        });
      }
      return $http
        .get(globals.apiURL + "/quotes/orders/" + id, {
          authentication: "yokozuna",
        })
        .then(function (response) {
          
          return response.data;
        });
    },
    getBatchOrders: async (id_list) => {
      try {
        const result = await $http.post(
          globals.apiURL + "/newapi/order/fetch/bulk",
          {id_list: id_list},
          {authentication: "yokozuna"}
        );

        return result.data;
      } catch (e) {
        // console.log(e);
        return e;
      }
    },
    getListDownloadLink: function (type, startDate, endDate, statusList) {
      startDate = !startDate ? "*" : JSON.stringify(startDate);
      endDate = !endDate ? "*" : JSON.stringify(endDate);
      statusList = JSON.stringify(statusList);
      return (
        globals.apiURL +
        "/quotes/orders/spreadsheet/" +
        type +
        "/" +
        (type == "quotes" ? "Cotizaciones" : "Ordenes") +
        ".xlsx?startDate=" +
        startDate +
        "&endDate=" +
        endDate +
        "&orderStatusList=" +
        statusList
      );
    },
    getPdfLink: function (order) {
      if (
        order.status == "QUOTE" ||
        order.status == "PENDING" ||
        order.status == "REJECTED"
      ) {
        return (
          globals.apiURL +
          "/quotes/orders/" +
          order.id +
          "/download/cotizacion_no_" +
          order.orderNo +
          ".pdf"
        );
      } else {
        return (
          globals.apiURL +
          "/quotes/orders/" +
          order.id +
          "/download/orden_no_" +
          order.orderNo +
          ".pdf"
        );
      }
    },
    getPdfInstallationSheetLink: async function (order) {
      if (await service.installationSheet.exists(order.id))
        return `${globals.apiURL}/newapi/installation/sheet/download/${order.id}.pdf`;
    },
    getPdfOrderLink: function (order) {
      if (
        order.status == "QUOTE" ||
        order.status == "PENDING" ||
        order.status == "REJECTED"
      ) {
        return (
          globals.apiURL +
          "/quotes/orders/" +
          order.id +
          "/downloadorder/cotizacion_no_" +
          order.orderNo +
          ".pdf"
        );
      } else {
        return (
          globals.apiURL +
          "/quotes/orders/" +
          order.id +
          "/downloadorder/orden_no_" +
          order.orderNo +
          ".pdf"
        );
      }
    },

    getReceiptLinks: function (order) {
      return order.payments.map(function (elem) {
        elem.receiptLink =
          globals.apiURL +
          "/quotes/orders/" +
          order.id +
          "/receipt/" +
          elem.id +
          "/Recibo_" +
          elem.folio +
          ".pdf";
        return elem;
      });
    },

    list: function () {
      return $http
        .get(globals.apiURL + "/quotes/orders", {
          authentication: "yokozuna",
        })
        .then(function (response) {
          return response.data;
        });
    },

    save: function (order) {

      if(EXECUTION_ENV=="EXTERNAL"){
        console.log("SAVING ORDER: ", order)
      order = { ...order }
      order.products = [...(order.products.map(v => ({
        ...v,
        width: inches_to_meters(v.width + parseFloat(v.w_fraction || 0)),
        height: inches_to_meters(v.height + parseFloat(v.h_fraction || 0)),
        m2: sq_inches_to_meters(v.m2),
        ...(v.controlHeight ? { controlHeight: v.controlHeight + parseFloat(v.control_h_fraction || 0) } : {})
      })))]
      console.log("ORDER ", order)
      const PRODUCTS = ['pisos', 'enrollables', 'filtrasoles', 'balances', 'shutters', 'toldos', 'moldings','cortinas']
      for (const product of PRODUCTS) {
        order[product]?.forEach((product) => {
          product.width = inches_to_meters(product.width + parseFloat(product.w_fraction || 0))
          product.height = inches_to_meters(product.height + parseFloat(product.h_fraction || 0))
          product.m2 = sq_inches_to_meters(parseFloat(product.m2))
        })
      }
      }

      return $http
        .post(globals.apiURL + "/quotes/orders", order, {
          authentication: "yokozuna",
        })
        .then(function (response) {
          return response.data;
        });
    },
    saveSubOrder: function (order, orderType) {

      if(EXECUTION_ENV=="EXTERNAL"){
        order = { ...order }
      order.products = [...(order.products.map(v => ({
        ...v,
        width: inches_to_meters(v.width + parseFloat(v.w_fraction || 0)),
        height: inches_to_meters(v.height + parseFloat(v.h_fraction || 0)),
        m2: sq_inches_to_meters(v.m2),
        ...(v.controlHeight ? { controlHeight: v.controlHeight + parseFloat(v.control_h_fraction || 0) } : {})
      })))]

      const PRODUCTS = ['pisos', 'enrollables', 'filtrasoles', 'balances', 'shutters', 'toldos', 'moldings','cortinas']
      for (const product of PRODUCTS) {
        order[product]?.forEach((product) => {
          product.width = inches_to_meters(product.width + parseFloat(product.w_fraction || 0))
          product.height = inches_to_meters(product.height + parseFloat(product.h_fraction || 0))
          product.m2 = sq_inches_to_meters(parseFloat(product.m2))
        })
      }

      console.log("SUB ORDER ", order)
      }

      return $http
        .post(globals.apiURL + "/quotes/orders/suborder", order, {
          authentication: "yokozuna",
          params: {orderType: orderType},
        })
        .then(function (response) {
          return response.data;
        });
    },

    update: function (order) {

      if(EXECUTION_ENV=="EXTERNAL"){
        order = { ...order }
      order.products = [...(order.products.map(v => ({
        ...v,
        width: inches_to_meters(v.width + parseFloat(v.w_fraction || 0)),
        height: inches_to_meters(v.height + parseFloat(v.h_fraction || 0)),
        m2: sq_inches_to_meters(v.m2),
        ...(v.controlHeight ? { controlHeight: v.controlHeight + parseFloat(v.control_h_fraction || 0) } : {})
      })))]

      const PRODUCTS = ['pisos', 'enrollables', 'filtrasoles', 'balances', 'shutters', 'toldos', 'moldings','cortinas']
      for (const product of PRODUCTS) {
        order[product]?.forEach((product) => {
          product.width = inches_to_meters(product.width + parseFloat(product.w_fraction || 0))
          product.height = inches_to_meters(product.height + parseFloat(product.h_fraction || 0))
          product.m2 = sq_inches_to_meters(parseFloat(product.m2))
        })
      }
      }
      return $http
        .put(globals.apiURL + "/quotes/orders/" + order.id, order, {
          authentication: "yokozuna",
          params: {user: $rootScope.currentUser.id},
        })
        .then(function (response) {
          return response.data;
        });
    },

    updateSuborder: function (orderMasterId, order) {

      if(EXECUTION_ENV=="EXTERNAL"){
        order = { ...order }
      order.products = [...(order.products.map(v => ({
        ...v,
        width: inches_to_meters(v.width + parseFloat(v.w_fraction || 0)),
        height: inches_to_meters(v.height + parseFloat(v.h_fraction || 0)),
        m2: sq_inches_to_meters(v.m2),
        ...(v.controlHeight ? { controlHeight: v.controlHeight + parseFloat(v.control_h_fraction || 0) } : {})
      })))]

      const PRODUCTS = ['pisos', 'enrollables', 'filtrasoles', 'balances', 'shutters', 'toldos', 'moldings','cortinas']
      for (const product of PRODUCTS) {
        order[product]?.forEach((product) => {
          product.width = inches_to_meters(product.width + parseFloat(product.w_fraction || 0))
          product.height = inches_to_meters(product.height + parseFloat(product.h_fraction || 0))
          product.m2 = sq_inches_to_meters(parseFloat(product.m2))
        })
      }

      console.log("UPDATE SUB ", order)
      }
      return $http
        .put(
          globals.apiURL + "/quotes/orders/suborder/" + orderMasterId,
          order,
          {
            authentication: "yokozuna",
            params: {orderType: order.type},
          }
        )
        .then(function (response) {
          return response.data;
        });
    },

    deleteSuborder: function (parentOrderId, orderType) {
      return $http
        .delete(
          globals.apiURL + "/quotes/orders/suborder/" + parentOrderId,
          {
            authentication: "yokozuna",
            params: {orderType: orderType},
          }
        )
        .then(function (response) {
          return response.data;
        });
    },
    setGuides : function (order){
      
      return $http
      .put(
        globals.apiURL +
        "/quotes/orders/" +
        order.id +
        "/guides",{},
        {
          authentication: "yokozuna",
          params: {
          user: $rootScope.currentUser.id,
          folio:  order.orderTransitInvoice,
          guides: order.guides
          },

        }
      )
      .then(function (response) {
        
        return response.data;
      });
    },

    updateStatus: function (order, status) {
      return $http
        .put(
          globals.apiURL +
          "/quotes/orders/" +
          order.id +
          "/" +
          status,
          order,
          {
            authentication: "yokozuna",
            params: {user: $rootScope.currentUser.id},
          }
        )
        .then(function (response) {
          return response.data;
        });
    },

    updateRetroStatus: function (order, status) {
      return $http
        .put(
          globals.apiURL +
          "/quotes/orders/" +
          order.id +
          "/" +
          status +
          "/hard",
          {},
          {
            authentication: "yokozuna",
            params: {user: $rootScope.currentUser.id},
          }
        )
        .then(function (response) {
          return response.data;
        });
    },

    updateProvider: function (order, providerId) {
      return $http
        .put(
          globals.apiURL + "/quotes/orders/" + order.id + "/provider",
          {providerId: providerId},
          {authentication: "yokozuna"}
        )
        .then(function (response) {
          return response.data;
        });
    },

    sendOrder: function (id) {
      return $http
        .post(
          globals.apiURL + "/quotes/orders/" + id + "/send",
          {},
          {authentication: "yokozuna"}
        )
        .then(function (response) {
          return response.data;
        });
    },
    sendOrderTo: function (id, email) {
      return $http
        .post(
          globals.apiURL + "/quotes/orders/" + id + "/sendto/",
          {email: email},
          {authentication: "yokozuna"}
        )
        .then(function (response) {
          return response.data;
        });
    },
    setQuoteStatus: function (id, quoteStatus, quoteSubStatus) {
      quoteSubStatus = !quoteSubStatus ? "" : quoteSubStatus;
      return $http
        .put(
          globals.apiURL + "/quotes/orders/" + id + "/quoteStatus/",
          {},
          {
            authentication: "yokozuna",
            params: {
              user: $rootScope.currentUser.id,
              quoteStatus: quoteStatus,
              quoteSubStatus: quoteSubStatus,
            },
          }
        )
        .then(function (response) {
          return response.data;
        });
    },

    setDate: function (id, dateType, date, notes) {
      notes = !notes ? "" : notes;
      return $http
        .put(
          globals.apiURL +
          "/quotes/orders/" +
          id +
          "/date/" +
          dateType,
          date,
          {
            authentication: "yokozuna",
            params: {
              user: $rootScope.currentUser.id,
              notes: notes,
            },
          }
        )
        .then(function (response) {
          return response.data;
        });
    },

    getLog: function (id) {
      return $http
        .get(globals.apiURL + "/quotes/orders/" + id + "/event/log", {
          authentication: "yokozuna",
        })
        .then(function (response) {
          return response.data;
        });
    },
    searchByStatusList: function (
      statusList, // done
      search, // TODO: Full text search mongodb
      start, // done
      rows, // done
      sort, // ignore
      startDate, // done
      endDate // done
    ) {

      let params = {}

      if (EXECUTION_ENV === "EXTERNAL") {
        if (getQuoteStatusFromList(statusList).length > 0) {
          statusList = [...statusList, "QUOTE"]
        }
        const query = {
          status: {
            $in: statusList
          },
          date: {
            $gte: startDate,
            $lte: endDate,
          }
        }
        params = {
          start: start,
          rows: rows,
          query: JSON.stringify(query),
          sort: JSON.stringify({orderNo: -1})
        }
       

      } else {
        sort = !sort ? "" : sort;
        startDate = !startDate ? "*" : startDate;
        endDate = !endDate ? "*" : endDate;

        params = {
          start: start,
          rows: rows,
          search: search,
          sort: sort,
          orderStatusList: JSON.stringify(statusList),
          startDate: startDate,
          endDate: endDate,
        }
      }

      return $http
        .get(globals.apiURL + "/quotes/orders" + globals.api.orders.byStatus, {
          authentication: "yokozuna",
          params: params,
        })
        .then(function (response) {
          return response.data.response;
        });
    },
    searchByUser: function (
      statusList,
      search,
      start,
      rows,
      sort,
      startDate,
      endDate,
      userId
    ) {
      sort = !sort ? "" : sort;
      startDate = !startDate ? "*" : startDate;
      endDate = !endDate ? "*" : endDate;
      userId = !userId ? "" : userId;
      return $http
        .get(globals.apiURL + "/quotes/orders/search/user/list", {
          authentication: "yokozuna",
          params: {
            start: start,
            rows: rows,
            search: search,
            sort: sort,
            orderStatusList: JSON.stringify(statusList),
            startDate: startDate,
            endDate: endDate,
            userId: userId,
          },
        })
        .then(function (response) {
          return response.data.response;
        });
    },
    getCosting: function (
      sear,
      statusList,
      start,
      rows,
      sort,
      startDate,
      endDate
    ) {
      sort = !sort ? "" : sort;
      startDate = !startDate ? "*" : startDate;
      endDate = !endDate ? "*" : endDate;
      return $http
        .get(globals.apiURL + "/quotes/orders/costing", {
          authentication: "yokozuna",
          params: {
            sear:sear,
            start: start,
            rows: rows,
            sort: sort,
            orderStatusList: JSON.stringify(statusList),
            startDate: startDate,
            endDate: endDate,
          },
        })
        .then(function (response) {
          return response.data;
        });
    },
    getCostingStats: function (statusList, startDate, endDate) {
      startDate = !startDate ? "*" : startDate;
      endDate = !endDate ? "*" : endDate;
      return $http
        .get(globals.apiURL + "/quotes/orders/costing/stats", {
          authentication: "yokozuna",
          params: {
            orderStatusList: JSON.stringify(statusList),
            startDate: startDate,
            endDate: endDate,
          },
        })
        .then(function (response) {
          return response.data;
        });
    },
    getCostingDownloadLink: function (
      statusList,
      startDate,
      endDate,
      name
    ) {
      startDate = !startDate ? "*" : startDate.toJSON();
      endDate = !endDate ? "*" : endDate.toJSON();
      return (
        globals.apiURL +
        "/quotes/orders/costing/spreadsheet/" +
        name +
        ".xlsx?startDate=" +
        startDate +
        "&endDate=" +
        endDate +
        "&orderStatusList=" +
        JSON.stringify(statusList)
      );
    },
    getByOrderParent: function (orderParentId) {
      const PRODUCTS = ['pisos', 'enrollables', 'filtrasoles', 'balances', 'shutters', 'toldos', 'moldings','cortinas']
      return $http
        .get(
          globals.apiURL + "/quotes/orders/suborder/" + orderParentId,
          {authentication: "yokozuna"}
        )
        .then(function (response) {
          
          if(EXECUTION_ENV=="EXTERNAL"){
          response.data.forEach((order) => {
            order.hasTaxes = !(order.iva < 0.001)
            order.hasShipping = !(order.shiping < 0.001)
            for (const product of PRODUCTS) {
              order[product]?.forEach((product) => {
                product.width = meters_to_inches(product.width)
                product.height = meters_to_inches(product.height)
                product.m2 = sq_meters_to_inches(parseFloat(product.m2))
              })
            }
            order.products?.forEach((product) => {
              product.width = meters_to_inches(product.width)
              product.height = meters_to_inches(product.height)
              product.m2 = sq_meters_to_inches(parseFloat(product.m2))
            })
            // return order;
          })
        }
          return response.data;
        });
    },
    getLimitDays: function (id, status) {
      return $http
        .get(
          globals.apiURL + "/quotes/orders/" + id + "/days/" + status,
          {authentication: "yokozuna"}
        )
        .then(function (response) {
          return response.data;
        });
    },
  };
  //------------------------- PAYMENTS ------------------
  service.payments = {
    getPayments: function (page, start, end, size, sort) {
      return $http
        .get(globals.apiURL + "/quotes/payments/", {
          authentication: "yokozuna",
          params: {
            startDate: start,
            endDate: end,
            page: page,
            size: size,
            sort: sort,
          },
        })
        .then(function (response) {
          return response.data;
        });
    },
    pay: function (id, payment) {
      return $http
        .put(
          globals.apiURL + "/quotes/orders/" + id + "/payment",
          payment,
          {authentication: "yokozuna"}
        )
        .then(function (response) {
          return response.data;
        });
    },
    getPaymentsDownloadLink: function (startDate, endDate, name) {
      return (
        globals.apiURL +
        "/quotes/payments/spreadsheet/" +
        name +
        ".xlsx?startDate=" +
        startDate +
        "&endDate=" +
        endDate
      );
    },
    cancel: function (cancelRequest) {
      return $http
        .put(
          globals.apiURL + "/quotes/payments/cancel",
          cancelRequest,
          {authentication: "yokozuna"}
        )
        .then(function (response) {
          return response.data;
        });
    },
  };

  //------------------------- INVENTORY ------------------
  service.inventory = {
    addMovements: function (products) {
      return $http
        .post(
          globals.apiURL + "/quotes/inventory/movements",
          products,
          {authentication: "yokozuna"}
        )
        .then(function (response) {
          return response;
        });
    },
    loadInventory: function (warehouse, color) {
      return $http
        .get(
          globals.apiURL +
          "/quotes/inventory/entries/" +
          warehouse.id +
          "/" +
          color.id,
          {authentication: "yokozuna"}
        )
        .then(function (response) {
          return response;
        });
    },
    getMovements: function (
      productType,
      page,
      size,
      sort,
      types,
      warehouses,
      startDate,
      endDate
    ) {
      startDate = !startDate ? "" : startDate;
      endDate = !endDate ? "" : endDate;
      sort = !sort ? "" : sort;
      return $http
        .get(globals.apiURL + "/quotes/inventory/movements/filter", {
          authentication: "yokozuna",
          params: {
            productType: productType,
            page: page,
            size: size,
            sort: sort,
            warehouseId: JSON.stringify(warehouses),
            types: JSON.stringify(types),
            startDate: startDate,
            endDate: endDate,
          },
        })
        .then(function (response) {
          return response.data;
        });
    },
    getMovementsByType: function (
      productType,
      page,
      size,
      sort,
      types,
      warehouses,
      startDate,
      endDate
    ) {
      startDate = !startDate ? "" : startDate;
      endDate = !endDate ? "" : endDate;
      sort = !sort ? "" : sort;
      return $http
        .get(
          globals.apiURL +
          "/quotes/inventory/movements/" +
          productType,
          {
            authentication: "yokozuna",
            params: {
              page: page,
              size: size,
              sort: sort,
              warehouseId: JSON.stringify(warehouses),
              types: JSON.stringify(types),
              startDate: startDate,
              endDate: endDate,
            },
          }
        )
        .then(function (response) {
          return response.data;
        });
    },
    getEntries: function (page, size, sort, warehouses) {
      return $http
        .get(globals.apiURL + "/quotes/inventory/entries/filter", {
          authentication: "yokozuna",
          params: {
            page: page,
            size: size,
            sort: sort,
            warehouseId: JSON.stringify(warehouses),
          },
        })
        .then(function (response) {
          return response.data;
        });
    },
    getEntriesByType: function (productType, page, size, sort, warehouses) {
      return $http
        .get(globals.apiURL + "/quotes/inventory/entries/type", {
          authentication: "yokozuna",
          params: {
            productType: productType,
            page: page,
            size: size,
            sort: sort,
            warehouseId: JSON.stringify(warehouses),
          },
        })
        .then(function (response) {
          return response.data;
        });
    },
    getMovementsDownloadLink: function (
      startDate,
      endDate,
      cleanTypeList,
      cleanWarehouseList
    ) {
      startDate = !startDate ? "" : JSON.parse(JSON.stringify(startDate));
      endDate = !endDate ? "" : JSON.parse(JSON.stringify(endDate));
      cleanTypeList = JSON.stringify(cleanTypeList);
      cleanWarehouseList = JSON.stringify(cleanWarehouseList);
      return (
        globals.apiURL +
        "/quotes/inventory/movements/spreadsheet/reporte_movimientos_inventario.xlsx?startDate=" +
        startDate +
        "&endDate=" +
        endDate +
        "&types=" +
        cleanTypeList +
        "&warehouseId=" +
        cleanWarehouseList
      );
    },
    getEntriesDownloadLink: function (cleanWarehouseList) {
      cleanWarehouseList = JSON.stringify(cleanWarehouseList);
      return (
        globals.apiURL +
        "/quotes/inventory/entries/spreadsheet/reporte_inventario.xlsx?warehouseId=" +
        cleanWarehouseList
      );
    },
    hasExistencies: function (productId) {
      return $http.get(
        globals.apiURL + "/quotes/inventory/entries/" + productId,
        {authentication: "yokozuna"}
      );
    },
  };

  //------------------------- DEADLINES -----------------
  service.deadlines = {
    getDeadlines: function (deadlineType, status, start, rows, sort) {
      
      return $http
        .get(
          globals.apiURL +
          "/quotes/deadlines/type/" +
          deadlineType +
          "/status/" +
          status,
          {
            authentication: "yokozuna",
            params: {start: start, rows: rows, sort: sort},
          }
        )
        .then(async function (response) {
          
          for(const f of response.data.response.docs)
          {
           
              var fullData = await service.orders.get(f["id"])
              f["dataB"] = fullData
          }
         
          return response.data.response;
        });
    },

    getPastDeadlines: function (status, page, size, sort) {
      return $http
        .get(
          globals.apiURL +
          "/quotes/deadlines/PAST/status/" +
          status +
          "?page=" +
          page +
          "&size=" +
          size +
          "&sort=" +
          sort,
          {authentication: "yokozuna"}
        )
        .then(async function (response) {
         
          for(const f of response.data.content)
          {
           
              var fullData = await service.orders.get(f["orderId"])
              f["dataB"] = fullData
          }
          return response.data;
        });
    },
    getDeadlinesDownloadLink: function (type) {
      return (
        globals.apiURL +
        "/quotes/deadlines/spreadsheet/" +
        type +
        "/Operaciones.xlsx"
      );
    },
  };
  //------------------------- STATISTICS ----------------
  service.statistics = {
    getByDateRangeAndCity: function (city, startDate, endDate) {
      return $http
        .get(globals.apiURL + "/quotes/statistics/", {
          authentication: "yokozuna",
          params: {start: startDate, end: endDate, city: city},
        })
        .then(function (response) {
          return response.data;
        });
    },
  };

  //------------------------- COMMISSIONS ----------------
  service.commissions = {
    getBySeller: function (sellerId, start, end, sortName, sortDir) {
      return $http
        .get(
          globals.apiURL + "/quotes/commissions/seller/" + sellerId,
          {
            authentication: "yokozuna",
            params: {
              startDate: start,
              endDate: end,
              sortName: sortName,
              sortDir: sortDir,
            },
          }
        )
        .then(function (response) {
          return response.data;
        });
    },
    updateCommissionPercent: function (id, percent) {
      return $http
        .put(
          globals.apiURL + "/quotes/commissions/" + id + "/percent",
          percent,
          {authentication: "yokozuna", params: {percent: percent}}
        )
        .then(function (response) {
          return response.data;
        });
    },
    getDownloadLink: function (sellerId, startDate, endDate, name) {
      return (
        globals.apiURL +
        "/quotes/commissions/seller/" +
        sellerId +
        "/download/" +
        name +
        ".xlsx?startDate=" +
        startDate +
        "&endDate=" +
        endDate
      );
    },
  };

  //----------------------------- BILLS ----------------
  service.bills = {
    getPendingBills: function (
      search,
      orderStatusList,
      start,
      page,
      rows,
      sort,
      startDate,
      endDate
    ) {
      sort = !sort ? "" : sort;
      startDate = !startDate
        ? JSON.stringify(moment().year(2018).startOf("year"))
        : JSON.stringify(startDate);
      endDate = !endDate ? "*" : JSON.stringify(endDate);
      return $http
        .get(
          globals.apiURL +
          "/quotes/bills/missing" +
          "?page=" +
          page +
          "&start=" +
          start +
          "&rows=" +
          rows +
          "&sort=" +
          sort +
          "&search=" +
          search +
          "&startDate=" +
          startDate +
          "&endDate=" +
          endDate +
          "&orderStatusList=" +
          JSON.stringify(orderStatusList),
          {authentication: "yokozuna"}
        )
        .then(function (response) {
          return response.data.response;
        });
    },
    getPendingBillsDownloadLink: function (
      search,
      startDate,
      endDate,
      statusList
    ) {
      startDate = !startDate
        ? JSON.stringify(moment().year(2018).startOf("year"))
        : JSON.stringify(startDate);
      endDate = !endDate ? "*" : JSON.stringify(endDate);
      return (
        globals.apiURL +
        "/quotes/bills/spreadsheet/Facturas.xlsx?startDate=" +
        startDate +
        "&endDate=" +
        endDate +
        "&search=" +
        search +
        "&orderStatusList=" +
        JSON.stringify(statusList)
      );
    },
    getBillsByOrder: function (orderId) {
      return $http
        .get(globals.apiURL + "/quotes/bills/" + orderId, {
          authentication: "yokozuna",
        })
        .then(function (response) {
          return response.data;
        });
    },

    uploadBill: function (orderId, formData) {
      return $http
        .post(globals.apiURL + "/quotes/bills/" + orderId, formData, {
          authentication: "yokozuna",
          headers: {"Content-Type": undefined},
          transformRequest: angular.identity,
        })
        .then(function (response) {
          return response.data;
        });
    },
    deleteBill: function (id) {
      return $http
        .put(
          globals.apiURL + "/quotes/bills/delete/" + id,
          {},
          {authentication: "yokozuna"}
        )
        .then(function (response) {
          return response.data;
        });
    },
    needsBill: function (orderId, needsBill) {
      return $http
        .put(
          globals.apiURL +
          "/quotes/bills/" +
          orderId +
          "/needsBill/" +
          needsBill,
          {},
          {authentication: "yokozuna"}
        )
        .then(function (response) {
          return response.data;
        });
    },
    getBillLinks: function (bills) {
      return bills.map(function (elem) {
        elem.downloadLink =
          globals.apiURL +
          "/quotes/bills/" +
          elem.id +
          "/download/" +
          elem.filename;
        return elem;
      });
    },
  };

  //----------------------------- CATALOG ----------------
  service.catalog = {
    getAll: function (start, rows, sort) {
      return $http
        .get(globals.apiURL + "/pricing/catalog", {
          authentication: "yokozuna",
          params: {page: start, rows: rows, sort: sort},
        })
        .then((response) => {
          return response.data;
        });
    },
    upload: function (formData) {
      return $http
        .post(globals.apiURL + "/pricing/catalog", formData, {
          authentication: "yokozuna",
          headers: {"Content-Type": undefined},
          transformRequest: angular.identity,
        })
        .then((response) => {
          return response.data;
        });
    },
    getFile: function (id) {
      return $http
        .get(globals.apiURL + "/pricing/catalog/" + id, {
          authentication: "yokozuna",
          responseType: "blob",
        })
        .then((response) => {
          return response.data;
        });
    },
    getStatus: function () {
      return $http
        .get(globals.apiURL + "/pricing/catalog/status", {
          authentication: "yokozuna",
        })
        .then((response) => {
          return response.data;
        });
    },
  };

  //------------------- MOVEMENTS --------------
  service.movements = {
    getMovements: function (
      statusList,
      type,
      search,
      start,
      rows,
      sort,
      startDate,
      endDate
    ) {
      sort = !sort ? "" : sort;
      startDate = !startDate ? "*" : startDate;
      endDate = !endDate ? "*" : endDate;
      return $http
        .get(globals.apiURL + "/quotes/movements", {
          authentication: "yokozuna",
          params: {
            search: search,
            startDate: startDate,
            endDate: endDate,
            start: start,
            rows: rows,
            sort: sort,
            type: type,
            orderStatusList: JSON.stringify(statusList),
          },
        })
        .then(function (response) {
          return response.data.response;
        });
    },
    getMovementsDownloadLink: function (
      search,
      startDate,
      endDate,
      inList,
      outList,
      invList
    ) {
      startDate = !startDate ? "*" : JSON.stringify(startDate);
      endDate = !endDate ? "*" : JSON.stringify(endDate);
      return (
        globals.apiURL +
        "/quotes/movements/spreadsheet/Movimientos.xlsx?startDate=" +
        startDate +
        "&endDate=" +
        endDate +
        "&search=" +
        search +
        "&inStatusList=" +
        JSON.stringify(inList) +
        "&outStatusList=" +
        JSON.stringify(outList) +
        "&invStatusList=" +
        JSON.stringify(invList)
      );
    },
  };
  //------------------- WAREHOUSES -------------
  service.warehouses = {
    getAll: function (page, size, sort) {
      return $http
        .get(
          globals.apiURL +
          "/quotes/warehouses/?page=" +
          page +
          "&size=" +
          size +
          "&sort=" +
          sort,
          {authentication: "yokozuna"}
        )
        .then(function (response) {
          return response.data;
        });
    },
    getList: function () {
      return $http
        .get(globals.apiURL + "/quotes/warehouses/list", {
          authentication: "yokozuna",
        })
        .then(function (response) {
          return response.data;
        });
    },
    get: function (id) {
      return $http
        .get(globals.apiURL + "/quotes/warehouses/" + id, {
          authentication: "yokozuna",
        })
        .then(function (response) {
          return response.data;
        });
    },
    save: function (warehouse) {
      return $http
        .post(globals.apiURL + "/quotes/warehouses", warehouse, {
          authentication: "yokozuna",
        })
        .then(function (response) {
          return response.data;
        });
    },
    delete: function (id) {
      return $http
        .delete(
          globals.apiURL + "/quotes/warehouses/" + id + "/delete",
          {authentication: "yokozuna"}
        )
        .then(function (response) {
          return response.data;
        });
    },

    activate: function (id) {
      return $http
        .put(
          globals.apiURL + "/quotes/warehouses/" + id + "/activate",
          {},
          {authentication: "yokozuna"}
        )
        .then(function (response) {
          return response.data;
        });
    },

    deactivate: function (id) {
      return $http
        .put(
          globals.apiURL + "/quotes/warehouses/" + id + "/deactivate",
          {},
          {authentication: "yokozuna"}
        )
        .then(function (response) {
          return response.data;
        });
    },
    update: function (warehouse) {
      return $http
        .put(
          globals.apiURL + "/quotes/warehouses/" + warehouse.id,
          warehouse,
          {authentication: "yokozuna"}
        )
        .then(function (response) {
          return response.data;
        });
    },
  };

  //------------------- COMMENTS -------------

  service.notes = {
    get: function (id) {
      return $http
        .get(globals.apiURL + "/quotes/comments/" + id, {
          authentication: "yokozuna",
        })
        .then(function (response) {
          return response.data;
        });
    },
    list: function (id) {
      return $http
        .get(globals.apiURL + "/quotes/comments/" + id, {
          authentication: "yokozuna",
        })
        .then(function (response) {
          return response.data;
        });
    },

    save: function (comment) {
      return $http
        .post(globals.apiURL + "/quotes/comments", comment, {
          authentication: "yokozuna",
        })
        .then(function (response) {
          return response.data;
        });
    },
  };

  return service;
});
