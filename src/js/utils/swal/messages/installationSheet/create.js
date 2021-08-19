export const installationSheetCreated = (callback) => {
	swal(
		{
			title: "Hoja de instalacion creada",
			text: "Se creo la orden de installacion",
			type: "success",
			confirmButtonText: "Aceptar",
		},
		callback
	);
};
