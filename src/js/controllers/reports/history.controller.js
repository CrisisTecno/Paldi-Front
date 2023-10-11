import { globals } from ".."

export const buildHistoryObject = (
  DTOptionsBuilder,
  DTColumnBuilder,
  paldiService,
  $scope
) => {
  const history = {}

  const fetchServerData = (_, props, callback, features) => {
    
    

    const start = props[3].value
    const length = props[4].value
    const page = start / length + 1

    

    paldiService.reports.getHistory({
      page: page,
      amount: length
    }).success((data) => {
      
      callback({
        draw: props[0].value,
        recordsTotal: data.currentTotal,
        recordsFiltered: data.total,
        data: data.data
      })
    })

  }

  history.options = DTOptionsBuilder.newOptions()
    .withLanguageSource("lang/table_lang.json")
    .withOption("processing", true)
    .withDOM("tp")
    .withOption("serverSide", true)
    .withFnServerData(fetchServerData)
    .withPaginationType('full_numbers')

  history.columns = [
    DTColumnBuilder.newColumn(null)
      .withOption("name", "date")
      .withTitle('Fecha')
      .renderWith((data) => {
        return moment(new Date(data.date)).format('DD/MM/yyyy')
      }),
      DTColumnBuilder.newColumn(null)
      .withOption("name", "tipo")
      .withTitle('Tipo')
      .renderWith((data) => {
        return $scope.reports.map[data.type].prettyName
      }),
      DTColumnBuilder.newColumn(null)
      .withOption("name", "user")
      .withTitle('Usuario')
      .renderWith((data) => {
        return data.user.name + " " + data.user.lastName
      }),
      DTColumnBuilder.newColumn(null)
      .withOption("name", "endDate")
      .withTitle('Seleccion Inicio')
      .renderWith((data) => {
        return moment(new Date(data.startDate)).format('DD/MM/yyyy')
      }),
      DTColumnBuilder.newColumn(null)
      .withOption("name", "startDate")
      .withTitle('Seleccion Final')
      .renderWith((data) => {
        return moment(new Date(data.endDate)).format('DD/MM/yyyy')
      }),
      DTColumnBuilder.newColumn(null)
      .withOption("name", "group")
      .withTitle('Agrupado por')
      .renderWith((data) => {
        return $scope.reports.prettyGroup(data.group ?? 'status')
      }),
      DTColumnBuilder.newColumn(null)
      .withOption("name", "download")
      .withTitle('Descargar')
      .renderWith((data) => {
        return `<button class="btn btn-xs btn-info" onclick="(async (startDate,endDate,group)=> {
          const query = 'name=&type=&userId=&group=' + group + '&startDate='+startDate + '&endDate=' + endDate;
      
          const response = await fetch('https://paldi-services.vercel.app/api' + '/reports/download/excel?' + query);
          const blob = await response.blob();
      
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'Cuentas por cobrar de'+startDate.substr(0,10) +' a '+ endDate.substr(0,10)+'.xlsx'
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
        })('${data.startDate.toString().trim()}','${data.endDate.toString().trim()}','${data.group.toString().trim()}')">Descargar Reporte</button>`
        // return `<a class="btn btn-xs btn-info" href=${globals.apiURL + "/newapi" + "/reports/download/" + data.rid} download="${`Cuentas por cobrar de ${moment(data.startDate).format('yyyy-MM-DD')} a ${moment(data.endDate).format('yyyy-MM-DD')}.xlsx`}">Descargar Reporte</a>`
      }),
    ]

  return history
}
