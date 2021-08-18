export const fromQuote = (callback) => {
  swal({
    title: "Orden Enviada",
    text: "Se envió la cotización como orden",
    type: "success",
    confirmButtonText:
      "Aceptar",
  }, callback);
}