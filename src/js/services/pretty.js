import { pdApp } from "./index";
pdApp.factory("prettyHelper", function () {
	var service = {
		getClientType: function (type) {
			switch (type) {
				case "DIRECT_SALE":
					return "Venta Directa al Público";
				case "DISTRIBUTOR_INDEPENDENT":
					return "Distribuidor S/Local";
				case "DISTRIBUTOR_PREMIUM":
					return "Distribuidor C/Local";
				case "PROJECTS":
					return "Proyectos";
				case "ARCHITECT_INTERIOR":
					return "Arquitectos e Interioristas";
			}
			return "";
		},

		getOrderStatus: function (status) {
			switch (status) {
				case "QUOTE":
					return "Cotización";
				case "REJECTED":
					return "Rechazada";
				case "CANCELED":
					return "Cancelada";
				case "ORDER_CANCELED":
					return "Orden Cancelada";
				case "PENDING":
					return "Pendiente";
				case "LINE":
					return "Línea";
				case "BACKORDER":
					return "Backorder";
				case "PRODUCTION":
					return "Producción";
				case "TRANSIT":
					return "Tránsito";
				case "FINISHED":
					return "I. Terminado";
				case "PROGRAMMED":
					return "Programada";
				case "INSTALLED":
					return "Instalada";
				case "INSTALLED_INCOMPLETE":
					return "Instalado Parcial";
				case "INSTALLED_NONCONFORM":
					return "Instalado Inconforme";
			}
			return status;
		},

		getReverseOrderStatus: function (status) {
			switch (status) {
				case "Cotizacion":
					return "QUOTE";
				case "Rechazada":
					return "REJECTED";
				case "Cancelada":
					return "CANCELED";
				case "Pendiente":
					return "PENDING";
				case "Linea":
					return "LINE";
				case "Backorder":
					return "BACKORDER";
				case "Produccion":
					return "PRODUCTION";
				case "Transito":
					return "TRANSIT";
				case "I. Terminado":
					return "FINISHED";
				case "Programada":
					return "PROGRAMMED";
				case "Instalada":
					return "INSTALLED";
				case "Instalado Parcial":
					return "INSTALLED_INCOMPLETE";
				case "Instalado Inconforme":
					return "INSTALLED_NONCONFORM";
				case "Orden Cancelada":
					return "ORDER_CANCELED";
			}
			return status;
		},

		getPlusPriceType: function (priceType) {
			switch (priceType) {
				case "WIDTH":
					return "Ancho (metro lineal)";
				case "HEIGHT":
					return "Alto (metro lineal)";
				case "METER":
					return "Metro cuadrado";
			}
			return "Unidad";
		},

		getPlusStatus: function (status) {
			switch (status) {
				case "ACTIVE":
					return "Activado";
				case "DISABLED":
					return "Desactivado";
			}
			return status;
		},

		getPlusLabel: function (label) {
			switch (label) {
				case "moldings":
					return "Moldura/Adicional";
				case "installationPlus":
					return "Instalación";
			}
			return label;
		},
    
		getSingularForm: function (label) {
			switch (label) {
				case "moldings":
					return "moldura";
				case "pisos":
					return "piso";
			}
			return label;
		},

		getPluralLabel: function (label) {
			switch (label) {
				case "moldings":
					return "molduras/adicionales";
				case "pisos":
					return "pisos";
			}
			return label;
		},

		getUserRole: function (role) {
			switch (role) {
				case "CONSULTANT":
					return "Asesor";
				case "MANAGER":
					return "Gerente de Compras";
				case "SALES_MANAGER":
					return "Gerente de Ventas";
				case "INSTALLATION_MANAGER":
					return "Gerente de Instalación";
				case "SALES_MANAGER":
					return "Gerente de Ventas";
				case "ADMIN":
					return "Administrador";
				case "SUPERADMIN":
					return "Super Administrador";
				case "BUYER":
					return "Comprador";
				case "EXTERNAL_CONSULTANT":
					return "Asesor Externo";
			}
			return "";
		},

		getMovementType: function (movementType) {
			switch (movementType) {
				case "IN":
					return "Entrada";
				case "OUT":
					return "Salida";
				case "CROSS_IN":
					return "Traslado/entrada";
				case "CROSS_OUT":
					return "Traslado/salida";
				case "ADJUSTMENT":
					return "Ajuste";
			}
			return "";
		},

		getProductType: function (type) {
			switch (type) {
				case "Enrollable":
					return "Persianas";
				case "Toldo":
					return "Producto para el Exterior";
				case "Shutter":
					return "Shutter";
				case "Balance":
					return "Balance";
				case "Piso":
					return "Piso";
				case "Filtrasol":
					return "Filtrasol";
				case "Custom":
					return "Personalizado";
			}
			return type;
		},

		getColor: function (color) {
			if (!color.name) {
				return color.code + " - " + color.textil;
			} else if (!color.textil) {
				return color.name + " - " + color.line;
			} else {
				return color.name + " - " + color.textil;
			}
		},
		getEvent: function (action) {
			switch (action) {
				case "QUOTE_CREATED":
					return "Cotización creada";
				case "QUOTE_EDITED":
					return "Cotización editada";
				case "QUOTE_STATUS_NEW":
					return "Estado de Cotización cambió a Nueva";
				case "QUOTE_STATUS_FOLLOWUP":
					return "Estado de Cotización cambió a Seguimiento";
				case "QUOTE_STATUS_DUPLICATED":
					return "Estado de Cotización cambió a Duplicada";
				case "QUOTE_STATUS_LOST_BRAND":
					return "Estado de Cotización cambió a Venta Perdida (Busca otro producto)";
				case "QUOTE_STATUS_LOST_PRICE":
					return "Estado de Cotización cambió a Venta Perdida (Precio Menor)";
				case "QUOTE_STATUS_LOST_FOLLOWUP":
					return "Estado de Cotización cambió a Venta Perdida (Falta Seguimiento)";
				case "QUOTE_STATUS_LOST_DELIVERYTIME":
					return "Estado de Cotización cambió a Venta Perdida (Tiempo de entrega menor)";
				case "STATUS_LINE":
					return "Estado cambió a Línea";
				case "STATUS_REJECTED":
					return "Estado cambió a Rechazada";
				case "STATUS_CANCELED":
					return "Estado cambió a Cancelada";
				case "STATUS_ORDER_CANCELED":
					return "Estado cambió a Orden Cancelada";
				case "STATUS_PENDING":
					return "Estado cambió a Pendiente";
				case "STATUS_PRODUCTION":
					return "Estado cambió a Producción";
				case "STATUS_BACKORDER":
					return "Estado cambió a Backorder";
				case "STATUS_TRANSIT":
					return "Estado cambió a Tránsito";
				case "STATUS_FINISHED":
					return "Estado cambió a Inv. Terminado";
				case "STATUS_PROGRAMMED":
					return "Estado cambió a Programado";
				case "STATUS_INSTALLED":
					return "Estado cambió a Instalado";
				case "STATUS_INSTALLED_INCOMPLETE":
					return "Estado cambió a Instalado Parcial";
				case "STATUS_INSTALLED_NONCONFORM":
					return "Estado cambió a Instalado Inconforme";
				case "PAYMENT":
					return "Se recibió un Pago";
				case "PAYMENT_ADVANCE":
					return "Se recibió un Pago de Anticipo";
				case "PAYMENT_LIQUIDATE":
					return "Se liquidó el saldo de la orden";
				case "PAYMENT_CANCEL":
					return "Se canceló un pago";
				case "DATE_INSTALLATION":
					return "Se cambió la Fecha de Instalación";
				case "DATE_ARRIVAL":
					return "Se cambió la Fecha de Llegada";
				case "DATE_ENDPRODUCTION":
					return "Se cambió la Fecha de Salida de producción";
			}
			return "";
		},

		getMonth: function (month) {
			switch (month) {
				case "January":
					return "Enero";
				case "February":
					return "Febrero";
				case "March":
					return "Marzo";
				case "April":
					return "Abril";
				case "May":
					return "Mayo";
				case "June":
					return "Junio";
				case "July":
					return "Julio";
				case "August":
					return "Agosto";
				case "September":
					return "Septiembre";
				case "October":
					return "Octubre";
				case "November":
					return "Noviembre";
				case "December":
					return "Diciembre";
			}
			return "";
		},
	};

	return service;
});
