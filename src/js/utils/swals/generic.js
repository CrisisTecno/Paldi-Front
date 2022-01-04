export const swalErrorFactory = (details) => ({
  title: "Error",
  text: "Ocurrió un error: " + details,
  type: "error",
  confirmButtonText: "Aceptar",
})