import { globals, pdApp } from "..";
import { showSwal } from "../../utils/swal/show";
import { buildHistoryObject } from "./history.controller";

const GROUPINGS = {
  seller: 'Vendedor',
  status: 'Estado',
}

pdApp.controller("ReportsController", function (
  $rootScope,
  $state,
  $scope,
  paldiService,
  DTOptionsBuilder,
  DTColumnBuilder
) {

  const init = () => {
    $scope.reports.list = []
    paldiService.reports.getList().then((response) => {
      $scope.reports.list = response.data ?? []
      $scope.reports.map = Object.fromEntries(response.data?.map(v => [v.name, v]))
    })
  }

  const reset = () => {
    $scope.reports = {
      ...controller,
      date: {
        start: {
          opened: false,
        },
        end: {
          opened: false,
        },
      }
    }

    $scope.reports.prettyGroup = (k) => GROUPINGS[k]
  }

  const loadReports = () => {

  }

  const controller = {}

  controller.updateSelected = () => {
    const reportName = $scope.reports.selected.name
    $scope.reports.templateUrl = `/js/controllers/reports/${reportName}/index.html`
    
  }
  controller.download = async () => {
    
    

    const selected = $scope.reports?.selected
    const current = $scope.reports?.current

    if (!current?.type) {
      showSwal('messages.reports.missing_type')
      return
    }

    if (!current?.group) {
      showSwal('messages.reports.missing_group')
      return
    }

    const startDate = current.date?.start?.value ? new Date(current.date.start.value) : new Date(0)
    const endDate = current.date?.end?.value ? new Date(current.date.end.value) : new Date()
    const properties = {
      name: selected.name,
      type: current.type,
      data: {
        userId: $rootScope.currentUser.id,
        group: current.group,
        startDate: startDate,
        endDate: endDate,
      }
    }

    var query = `name=${properties.name}&`;
    query += `type=${properties.type}&`;
    query += `userId=${properties.data.userId}&`;
    query += `group=${properties.data.group}&`;
    query += `startDate=${properties.data.startDate}&`;
    query += `endDate=${properties.data.endDate}`;

    const response = await fetch(`${globals.apiURL}/reports/download/excel?${query}`);
    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Cuentas por cobrar de ${moment(startDate).format('yyyy-MM-DD')} a ${moment(endDate).format('yyyy-MM-DD')}.xlsx`
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);

    setTimeout(() => $('#reportHistory').DataTable().ajax.reload(), 100);
    return;
    
    paldiService.reports.download(properties).success((data, status, headers) => {
      const filename = `Cuentas por cobrar de ${moment(startDate).format('yyyy-MM-DD')} a ${moment(endDate).format('yyyy-MM-Dd')}.xlsx`
      setTimeout(() => $('#reportHistory').DataTable().ajax.reload(), 100)
      

      function downloadURI(uri, name) {
        const link = document.createElement("a")
        link.download = name
        link.href = uri
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
      downloadURI(globals.apiURL + "/newapi" + '/reports/download/' + data.id, filename)

    })
    // const blob = response.data

  }

  

  $scope.startDateOptions = {
    formatYear: "yy",
    startingDay: 1,
    maxDate: new Date(),
  };

  $scope.endDateOptions = {
    formatYear: "yy",
    startingDay: 1,
    minDate: $scope.startDate,
    maxDate: new Date(),
  };

  $scope.format = "dd/MM/yyyy";
  $scope.altInputFormats = ["M!/d!/yyyy"];


  $scope.history = buildHistoryObject(
    DTOptionsBuilder,
    DTColumnBuilder,
    paldiService,
    $scope
  )

  // MAIN CODE
  reset()
  init()

  return controller
})
