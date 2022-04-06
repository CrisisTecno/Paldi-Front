export const cancel = (callback) => {
  swal({
    title: EXECUTION_ENV=="EXTERNAL"?"Canceled":"Cancelado ",
    type: "error",
    confirmButtonText: EXECUTION_ENV=="EXTERNAL"?"Accept":"Aceptar",
  }, callback)
}