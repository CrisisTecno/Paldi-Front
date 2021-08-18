export const notEnoughInventory = (callback) => {
  swal({
    title: "No hay inventario suficiente",
    type: "error",
    confirmButtonText:
      "Aceptar",
  }, callback);
}