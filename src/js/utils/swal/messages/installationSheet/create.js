export const created = (callback) => {
	swal(
		{
			title: "Hoja de instalacion creada",
			text: "Se creo la orden de instalación",
			type: "success",
			confirmButtonText: "Aceptar",
		},
		callback
	);
};
