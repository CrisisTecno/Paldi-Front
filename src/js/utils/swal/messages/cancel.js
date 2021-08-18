export const cancel = (callback) => {
  swal({
    title: "Cancelado",
    type: "error",
    confirmButtonText: "Aceptar",
  }, callback)
}