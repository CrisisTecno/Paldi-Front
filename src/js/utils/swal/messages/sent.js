export const sent = (callback) => {
  swal({
    title: EXECUTION_ENV=="EXTERNAL"?"Payment Sent":"Pago Enviado",
    type: "success",
    confirmButtonText: EXECUTION_ENV=="EXTERNAL"?"Accept":"Aceptar",
  }, callback)
}