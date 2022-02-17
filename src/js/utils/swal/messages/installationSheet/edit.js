export const edited = (callback) => {
	swal(
		{
			title: "Orden de instalacion editada",
			text: "Fue modificada la orden de instalación",
			type: "success",
			confirmButtonText: "Aceptar",
		},
		callback
	);
};
