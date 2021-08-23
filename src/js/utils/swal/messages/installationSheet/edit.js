export const edited = (callback) => {
	swal(
		{
			title: "Hoja de instalacion editada",
			text: "Fue modificada la orden de installacion",
			type: "success",
			confirmButtonText: "Aceptar",
		},
		callback
	);
};
