export const messages = {
  missing_type: () => {
    swal({
      title: "Es necesario seleccionar el formato del reporte",
      type: "error",
      confirmButtonText: "Aceptar",
    })
  },
  missing_group: () => {
    swal({
      title: "Es necesario seleccionar la agrupación del reporte",
      type: "error",
      confirmButtonText: "Aceptar",
    })
  }
}