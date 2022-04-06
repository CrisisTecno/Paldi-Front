export const swalErrorFactory = (details) => ({
  title: "Error",
  text: EXECUTION_ENV=="EXTERNAL"?"An error has ocurred":"Ocurrió un error: " + details,
  type: "error",
  confirmButtonText: EXECUTION_ENV=="EXTERNAL"?"Accept":"Aceptar",
})