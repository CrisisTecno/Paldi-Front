export const created = (callback) => {
	swal(
		{
			title: "Orden de instalacion creada",
			text: "Se creo la orden de instalación",
			type: "success",
			confirmButtonText: "Aceptar",
		},
		callback
	);
};
