export const error = (callback) => {
  swal({
    title: "Ocurrió un error",
    type: "error",
    confirmButtonText: "Aceptar",
  }, callback)
}