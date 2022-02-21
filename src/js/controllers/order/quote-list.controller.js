import {pdApp} from "../index"

pdApp.controller(
  "QuoteListCtrl",
  function (
    $rootScope,
    $scope,
    $compile,
    $filter,
    $location,
    $state,
    $timeout,
    paldiService,
    permissionsHelper,
    DTOptionsBuilder,
    DTColumnDefBuilder,
    DTColumnBuilder,
  ) {
    $scope.ready = false
    $scope.statusList = []
    var cleanStatusList = []
    $scope.selectedType = "all"

    $scope.isEmpty = true
    $scope.isConsultant = false
    $timeout(function () {
      if (
        $scope.currentUser.role !== "SUPERADMIN" &&
        $scope.currentUser.role !== "CONSULTANT" &&
        $scope.currentUser.role !== "SALES_MANAGER"
      ) {
        $state.go("console.quote-list")
      }
    }, 200)
    $scope.currentUser && $scope.currentUser.role === "CONSULTANT"
      ? ($scope.isConsultant = true)
      : ($scope.isConsultant = false)
    $scope.availableStatusList = [
      {label: EXECUTION_ENV!="EXTERNAL" ? "Nueva" :"New", value: "NEW"},
      {label: EXECUTION_ENV!="EXTERNAL" ? "Duplicada" :"Duplicated", value: "DUPLICATE"},
      {label: EXECUTION_ENV!="EXTERNAL" ? "Seguimiento":"Following", value: "FOLLOWING"},
      {label: EXECUTION_ENV!="EXTERNAL" ? "Venta Perdida":"Lost Sale", value: "LOST_SALE"},
      {label: EXECUTION_ENV!="EXTERNAL" ? "Pendiente" :"Pending", value: "PENDING"},
      {label: EXECUTION_ENV!="EXTERNAL" ? "Rechazada" :"Rejected", value: "REJECTED"},
      {label: EXECUTION_ENV!="EXTERNAL" ? "Eliminada" : "Deleted", value: "DELETED_QUOTE"},
    ]
    var status_list =[
    {label:  "Nueva" , value: "New"},
    {label:  "Duplicada" , value: "Duplicated"},
    {label:  "Seguimiento", value: "Following"},
    {label:  "Venta Perdida", value: "Lost Sale"},
    {label:  "Pendiente", value: "Pending"},
    {label:  "Rechazada" , value: "Rejected"},
    {label: "Eliminada" , value: "Deleted"},
    ]
    var statusTranslate= function(status){
      for (const elem of status_list){
        
        if (status==elem.label)
          return elem.value
      }
      return status
    }
    $scope.quotesTypes = $scope.currentUser.realRole!="EXTERNAL_CONSULTANT" ? [
      {value: "consultant", label: "Mis cotizaciones"},
      {value: "all", label: "Cotizaciones generales"},
    ] : [{value: "consultant", label: "My Quotes"},
      ] 

    //============= Data tables =============

    var getListDownloadLink = function () {
      $scope.downloadLink = paldiService.orders.getListDownloadLink(
        "quotes",
        $scope.startDate,
        $scope.endDate,
        cleanStatusList,
      )
    }

    $scope.drawTable = function () {
      var datatable = $("#table").dataTable().api()
      datatable.draw()
      getListDownloadLink()
    }

    $scope.quoteTypeChange = function (type) {
      $scope.ready = false
      $scope.selectedType = type
      $scope.ready = true
      $scope.drawTable()
    }

    var typeChange = function () {
      cleanStatusList = []
      angular.forEach($scope.statusList, function (status) {
        cleanStatusList.push(status.id)
      })
      $rootScope.quoteStatusList = $scope.statusList
      $scope.drawTable()
    }

    $scope.dropdownEvents = {
      onInitDone: function () {
        typeChange()
      },

      onSelectionChanged: function () {
        typeChange()
      },
    }

    $scope.dropdownSettings = {
      dynamicTitle: false,
      displayProp: "label",
      idProp: "value",
    }

    $scope.dropdownTranslations = {
      checkAll: EXECUTION_ENV!="EXTERNAL" ? "Seleccionar Todos":"Select all",
      uncheckAll: EXECUTION_ENV!="EXTERNAL" ? "Deseleccionar Todos":"Unselect All",
      buttonDefaultText: EXECUTION_ENV!="EXTERNAL" ?  "Estados de Cotización":"Quote Stages",
    }

    function createdRow(row, data, dataIndex) {
      $compile(angular.element(row).contents())($scope)
    }

    var pastSort = ""

    var serverData = async function (
      sSource,
      aoData,
      fnCallback,
      oSettings,
    ) {
      var sear = aoData[5].value.value
      var draw = aoData[0].value
      var size = aoData[4].value
      var page = aoData[3].value / size
      var sort = ""
      var newSort =
        aoData[1].value[aoData[2].value[0].column].name +
        " " +
        aoData[2].value[0].dir

      if (sear && newSort == pastSort) {
        sort = "score desc"
      } else {
        sort = newSort
      }
      pastSort = newSort

      let result
      if (cleanStatusList.length == 0) {
        result = {
          draw: draw,
          recordsTotal: 0,
          recordsFiltered: 0,
          data: [],
        }
      } else {
        let data
        if ($scope.selectedType !== "consultant") {
          data = await paldiService.orders.searchByStatusList(
            cleanStatusList,
            sear,
            page * size,
            size,
            sort,
            $scope.startDate,
            $scope.endDate,
          )
        } else {
          data = await paldiService.orders.searchByUser(
            cleanStatusList,
            sear,
            page * size,
            size,
            sort,
            $scope.startDate,
            $scope.endDate,
            $scope.currentUser.id,
          )
        }

        result = {
          draw: draw,
          recordsTotal: data.numFound,
          recordsFiltered: data.numFound,
          data: data.docs,
        }
      }

      if (EXECUTION_ENV === "INTERNAL") {
        const ids = result.data.map(({id}) => id)
        // console.log(ids)
        const orders = await paldiService.orders.getBatchOrders(ids)
        // console.log(orders)

        result.data = result.data
          .map((order) => ({
            ...order,
            real: orders.filter(({_id}) => {
              // console.log(_id, order.id)
              return _id === order.id
            })[0],
          }))
          .map((order) => {
            // console.log(order)
            return ({
              ...order,
              status_s:
                order.real.status === "DELETED"
                  ? "Eliminada"
                  : order.status_s,
              quoteStatus_txt: [
                order.real.status === "DELETED"
                  ? "Eliminada"
                  : order.status_s,
              ],
            })
          })
      }

      $scope.isEmpty = result.recordsTotal > 0 ? false : true
      // console.log(result)
      fnCallback(result)
    }

    $scope.tableOptions = DTOptionsBuilder.newOptions()
      .withLanguageSource( EXECUTION_ENV!="EXTERNAL" ? "lang/table_lang.json" :"lang/table_lang_en.json")
      .withFnServerData(serverData)
      .withOption("processing", true)
      .withOption("serverSide", true)
      .withDisplayLength(20)
      .withDOM("ftp")
      .withOption("createdRow", createdRow)
      .withOption("order", [0, "desc"])

    $scope.tableColumns = [
      DTColumnBuilder.newColumn(null)
        .withOption("name", "no_l")
        .withTitle("No.")
        .renderWith(function (data) {
          return (
            "<a href=\"#/console/order/" +
            data.id +
            "\">" +
            data.no_l +
            "</a>"
          )
        }),
      DTColumnBuilder.newColumn(null)
        .withOption("name", "date_dt")
        .withTitle(EXECUTION_ENV!="EXTERNAL" ?  "Fecha" : "Date")
        .renderWith(function (data) {
          return (
            "<a href=\"#/console/order/" +
            data.id +
            "\">" +
            $filter("date")(data.date_dt, "dd/MM/yyyy") +
            "</a>"
          )
        }),
      DTColumnBuilder.newColumn(null)
        .withOption("name", "clientName_txt")
        .withTitle(EXECUTION_ENV!="EXTERNAL" ? "Cliente" :"Client")
        .renderWith(function (data) {
          return (
            "<a href=\"#/console/order/" +
            data.id +
            "\">" +
            data.clientName_txt +
            "</a>"
          )
        }),
      DTColumnBuilder.newColumn(null)
        .withOption("name", "clientType_txt")
        .withTitle(EXECUTION_ENV!="EXTERNAL" ? "Tipo de Cliente":"Client Type")
        .renderWith(function (data) {
          return (
            "<a href=\"#/console/order/" +
            data.id +
            "\">" +
            data.clientType_txt +
            "<a>"
          )
        }),

      DTColumnBuilder.newColumn(null)
        .withOption("name", "products_i")
        .withTitle(EXECUTION_ENV!="EXTERNAL" ? "Cant":"Qty")
        .renderWith(function (data) {
          return (
            "<a href=\"#/console/order/" +
            data.id +
            "\">" +
            data.products_i +
            "<a>"
          )
        }),
      DTColumnBuilder.newColumn(null)
        .withOption("name", "productType_txt")
        .withTitle(EXECUTION_ENV!="EXTERNAL" ? "Tipo de producto":"Product Type")
        .renderWith(function (data) {
          return (
            "<a href=\"#/console/order/" +
            data.id +
            "\">" +
            data.productType_txt +
            "<a>"
          )
        }),
      DTColumnBuilder.newColumn(null)
        .withOption("name", "quoteStatus_txt")
        .withTitle(EXECUTION_ENV!="EXTERNAL" ? "Estado":"Status")
        .renderWith(function (data) {
          console.log(data)
          if (
            data.status_s == "Cancelada" ||
            data.status_s == "Rechazada" ||
            data.status_s == "Pendiente"
          ) {
            
            return (
              "<a href=\"#/console/order/" +
              data.id +
              "\" class=\"status-block " +
              $rootScope.pretty(
                "reverseOrderStatus",
                data.status_s,
              ) +
              "\">" +
              data.status_s +
              "<a>"
            )
          } else {
            return (
              "<a href=\"#/console/order/" +
              data.id +
              "\" class=\"status-block " +
              data.quoteStatus_txt +
              "\">" +
              (EXECUTION_ENV!="EXTERNAL" ?  data.quoteStatus_txt:statusTranslate( data.quoteStatus_txt))+
              "<a>"
            )
          }
        }),
      DTColumnBuilder.newColumn(null)
        .withOption("name", "total_d")
        .withTitle("Total")
        .renderWith(function (data) {
          return (
            "<a href=\"#/console/order/" +
            data.id +
            "\">" +
            $filter("currency")(data.total_d) +
            "<a>"
          )
        }),
    ]

//---------------------------------------------------
    var initLoad = function () {
      $scope.statusList = $rootScope.quoteStatusList
      typeChange()
      $scope.ready = true
    }

//========================== DATEPICKER ====================

    /*$scope.startDate = moment().startOf('month').toDate();
    $scope.endDate = moment().endOf('day').toDate();*/

    $scope.startDateOptions = {
      formatYear: "yy",
      startingDay: 1,
      maxDate: new Date(),
    }

    $scope.endDateOptions = {
      formatYear: "yy",
      startingDay: 1,
      minDate: $scope.startDate,
      maxDate: new Date(),
    }

    $scope.openStartDate = function () {
      $scope.startDatePopup.opened = true
    }

    $scope.openEndDate = function () {
      $scope.endDatePopup.opened = true
    }

    $scope.format = "dd/MM/yyyy"
    $scope.altInputFormats = ["M!/d!/yyyy"]

    $scope.startDatePopup = {
      opened: false,
    }

    $scope.endDatePopup = {
      opened: false,
    }

    $scope.startDateChange = function () {
      $scope.endDateOptions.minDate = $scope.startDate
      if ($scope.endDate && $scope.startDate > $scope.endDate) {
        $scope.endDate = angular.copy($scope.startDate)
      }
      $scope.drawTable()
    }

    $scope.endDateChange = function () {
      if ($scope.endDate) {
        $scope.endDate = moment($scope.endDate).endOf("day").toDate()
      }
      $scope.drawTable()
    }
//=========================================================
    if ($scope.isConsultant) {
      $scope.quoteTypeChange("consultant")
    }

    if (!$scope.currentUser) {
      $timeout(function () {
        initLoad()
      }, 1000)
    } else {
      initLoad()
    }
  },
)

