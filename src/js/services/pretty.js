import { pdApp } from "./index";
pdApp.factory("prettyHelper", function () {
	var service = {
		getClientType: function (type) {
			if(EXECUTION_ENV=="EXTERNAL"){
				return this.getClientTypeEN(type)
			}
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

		getClientTypeEN: function (type) {
			
			switch (type) {
				case "DIRECT_SALE":
					return "Retail";
				case "DISTRIBUTOR_INDEPENDENT":
					return "Distributor Independent";
				case "DISTRIBUTOR_PREMIUM":
					return "Wholesale";
				case "PROJECTS":
					return "Proyects";
				case "ARCHITECT_INTERIOR":
					return "Architects & Interior Desginers";
			}
			return "";
		},

		getOrderStatus: function (status) {
			if(EXECUTION_ENV=="EXTERNAL"){
				return this.getOrderStatusEn(status)
			}
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
				case "PENDING_INFO":
					return "Información Pendiente";
				case "AUTHORIZED":
					return "Autorizado";
			}
			return status;
		},
		getOrderStatusEn: function (status) {
		
			switch (status) {
				case "QUOTE":
					return "Quote";
				case "REJECTED":
					return "Rejected";
				case "CANCELED":
					return "Canceled";
				case "ORDER_CANCELED":
					return "Canceled Order";
				case "PENDING":
					return "Pending";
				case "LINE":
					return "Production";
				case "BACKORDER":
					return "Backorder";
				case "PRODUCTION":
					return "Production";
				case "TRANSIT":
					return "Production";
				case "FINISHED":
					return "Production";
				case "PROGRAMMED":
					return "Shipped";
				case "INSTALLED":
					return "Delivered";
				case "INSTALLED_INCOMPLETE":
					return "Partial Delivery";
				case "INSTALLED_NONCONFORM":
					return "Product Defect";
			}
			
			return this.getReverseOrderStatusEn(status);
		},
		getReverseOrderStatusEn: function (status) {
			switch (status) {
				case "Cotizacion":
					return "Quote";
				case "Rechazada":
					return "Rejected";
				case "Cancelada":
					return "Canceled";
				case "Pendiente":
					return "Pending";
				case "Linea":
					return "Line";
				case "Backorder":
					return "Backorder";
				case "Produccion":
					return "Production";
				case "Transito":
					return "Transit";
				case "I. Terminado":
					return "Finished";
				case "Programada":
					return "Programmed";
				case "Instalada":
					return "Installed";
				case "Instalado Parcial":
					return "Partial Installation";
				case "Instalado Inconforme":
					return "Non Conform Installation";
				case "Orden Cancelada":
					return "Canceled Order";
				case "Seguimiento":
					return "Open"
				case "Venta Perdida":
					return "Lost Sale"
				case "Duplicada":
					return "Duplicated"
				case "Nueva":
					return "New"

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
			if (EXECUTION_ENV!="EXTERNAL"){
			switch (priceType) {
				case "WIDTH":
					return "Ancho (metro lineal)";
				case "HEIGHT":
					return "Alto (metro lineal)";
				case "METER":
					return "Metro cuadrado";
			}
			return "Unidad";
		}
		
			switch (priceType) {
				case "WIDTH":
					return "Width (lineal)";
				case "HEIGHT":
					return "Height (lineal)";
				case "METER":
					return "Squared Inch";
			}
			return "Unit";
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
				case "PROVIDER":
					return "Poveedor"
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
		
			if(EXECUTION_ENV=="EXTERNAL"){
				
				return this.getProductTypeEN(type)
			}
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
		getProductTypeEN: function (type) {
			
			switch (type) {
				case "Enrollable":
					return "Shades";
				case "Toldo":
					return "Exterior Products";
				case "Shutter":
					return "Shutter";
				case "Balance":
					return "Top Treatments";
				case "Piso":
					return "Floors";
				case "Filtrasol":
					return "Filtrasol";
				case "Cortina":
					return "Curtains"
				case "Custom":
					return "Custom";
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

		getEventEn: function (action) {
			switch (action) {
				case "QUOTE_CREATED":
					return "Quote created";
				case "QUOTE_EDITED":
					return "Quote edited";
				case "QUOTE_STATUS_NEW":
					return "Changed quote status to New";
				case "QUOTE_STATUS_FOLLOWUP":
					return "Changed Quote status to Follow up";
				case "QUOTE_STATUS_DUPLICATED":
					return "Changed Quote status to Duplicated";
				case "QUOTE_STATUS_LOST_BRAND":
					return "Venta Perdida (Busca otro producto)";
				case "QUOTE_STATUS_LOST_PRICE":
					return "Quote status changed to Lost Sale (Lower price)";
				case "QUOTE_STATUS_LOST_FOLLOWUP":
					return "Quote status changed to Lost Sale (No response)";
				case "QUOTE_STATUS_LOST_DELIVERYTIME":
					return "Quote status changed to Lost Sale (Faster service)";
				case "STATUS_LINE":
					return "Status changed to Line";
				case "STATUS_REJECTED":
					return "Status changed to Rejecteed";
				case "STATUS_CANCELED":
					return "Status changed to Cancelled";
				case "STATUS_ORDER_CANCELED":
					return "Status changed to Order Cancelled";
				case "STATUS_PENDING":
					return "Status changed to Pending";
				case "STATUS_PRODUCTION":
					return "Status changed to Production";
				case "STATUS_BACKORDER":
					return "Status changed to Backorder";
				case "STATUS_TRANSIT":
					return "Status changed to Transit";
				case "STATUS_FINISHED":
					return "Status changed to Done";
				case "STATUS_PROGRAMMED":
					return "Status changed to Shipped";
				case "STATUS_INSTALLED":
					return "Status changed to Installed";
				case "STATUS_INSTALLED_INCOMPLETE":
					return "Status changed to Partial Delivery";
				case "STATUS_INSTALLED_NONCONFORM":
					return "Status changed to Product Defect";
				case "PAYMENT":
					return "A payment was received";
				case "PAYMENT_ADVANCE":
					return "An advance payment was received";
				case "PAYMENT_LIQUIDATE":
					return "The order liquidated the order";
				case "PAYMENT_CANCEL":
					return "A payment was cancelled";
				case "DATE_INSTALLATION":
					return "Installation date changed";
				case "DATE_ARRIVAL":
					return "Delivery date changed";
				case "DATE_ENDPRODUCTION":
					return "Production finish date changed";
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
