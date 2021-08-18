export const sent = (callback) => {
  swal({
    title: "Pago Enviado",
    type: "success",
    confirmButtonText: "Aceptar",
  }, callback)
}