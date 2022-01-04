

export const swalUserCreateSuccess = {
  title: "Usuario guardado exitosamente",
  type: "success",
  confirmButtonText: "Aceptar",
}
export const swalUserCreateDuplicatedEmailFactory = (user) => ({
  title: "Error",
  text:
    "Ya existe un usuario con el E-mail: " +
    user.email,
  type: "error",
  confirmButtonText: "Aceptar",
})