export const error = (callback) => {
  swal({
    title: EXECUTION_ENV=="EXTERNAL"?"An Error has Ocurred":"Ocurrió un error",
    type: "error",
    confirmButtonText: EXECUTION_ENV=="EXTERNAL"?"Accept":"Aceptar",
  }, callback)
}