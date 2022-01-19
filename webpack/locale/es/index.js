module.exports = {
  client: {
    details: "Detalles de Cliente",
    name: "<span>Nombre:</span> {{client.name}}",
    last_name: "<span>Apellidos:</span> {{client.lastName}}",
    personal_information: "Información personal",
    type: "Tipo de cliente",
    category: "<span>Categoría:</span> {{pretty('clientType', client.type)}}",
    contact_information: "Datos de contacto",
    email: `
      <span>E-mail:</span>
      <a href="mailto:{{client.email}}">{{client.email}}</a>
    `,
    phone: "<span>Teléfono:</span> {{client.phoneNumber}}",
    address_title: "Dirección",
    address: "<span>Dirección:</span> {{client.address}}",
    city: "<span>Ciudad:</span> {{client.city}}",
    postal_code: "<span>Código Postal:</span> {{client.postalCode}}",
    loading: "Cargando cliente",
    error_postal_code: "El Código Postal debe tener 5 dígitos",
    error_email: "El e-mail no es válido",
    error_phone: "El número de teléfono debe tener 10 dígitos",
    error_not_exists: "El cliente no existe",
    error_no_clients: "No hay clientes para mostrar",
  },
  costing: {
    ov_movements: "Movimientos de OV",
    receipts_for: "Facturas para Orden No. {{selectedOrderNo}}",
    receipt_no: "No. de factura",
    
  },
  inventory: {
    select_product: "Seleccione un producto de un almacen",
    empty_warehohuse: "No hay existencias el almacen seleccionado",
    product_types: `
      <option value="Laminados">Laminado</option>
      <option value="Vinil">Vinil</option>
      <option value="Ingenieria">Ingeniería</option>
    `,
  },
  date: {
    from: "Desde",
    to: "Hasta",
    today: "Hoy",
  },
  general: {
    edit: "Editar",
    cancel: "Cancelar",
    save: "Guardar",
    download: "Descargar",
    close: "Cerrar",
    delete: "Eliminar",
    back: "Regresar",
    update:"Actualizar",
    accept:"Aceptar",
    
    erase:"Borrar",

    filter:"Filtrar",
    clean:"Limpiar",


    add: "Agregar",
    loading: "Cargando",
    new: "Nuevo",
    clear: "Limpiar",

    no_data: "No hay datos para mostrar",

    name: "Nombre",
    last_name: "Apellido",
    address: "Domicilio",
    city: "Ciudad",
    postal_code: "Código postal",
    email: "E-Mail",
    phone: "Teléfono",
    type: "Tipo",
    all: "Todos",

    required_field: "Campo Requerido",

    clients: "Clientes",
    client: "Cliente",
    receipts: "Facturas",
    receipt: "Factura",
    adjustments: "Ajustes",
    adjustment: "Ajuste",
    warehouse: "Almacén",
    cost: "Costo",
    emission_date: "Fecha de emisión",
    color: "Color",
    molding: "Moldura",
    difference: "Diferencia",
    existance: "Existencias",
    new_value: "Valor Nuevo",
    reason: "Justificación",

    error_negative: "El valor no puede ser negativo",
  },
  files: {
    movement_report: "reporte_movimientos.xlsx",
  },
  features: {
    city: true,
  },
  console:{
    update_provider: "Actualizar Proveedor",
    provider_id: "ID de Proveedor",

    observations:"Observaciones",

    statistics:"Estadistícas",
    configuration:"Configuracion",
    city:"Ciudad",
    time_origin:"Cotizaciones Tiempo vs Origen",
    weekly:"Semanal",
    monthly:"Mensual",
    product_type:"Cotizaciones por producto",
    origin:"Origen de Cotización",
    state:"Estado",
    lost_subject:"Motivo Venta Perdida",
    stats:"Estadística de Asesores",
    stats_heading:`
      <th rowspan="2">Asesor</th>
			<th colspan="2">NUEVAS</th>
			<th colspan="2">EN SEGUIMIENTO</th>
			<th colspan="2">CERRADAS</th>
			<th colspan="2">PERDIDAS</th>
			<th colspan="2">CANCELADAS</th>
    `,
    stats_row: `<th>Cant.</th>
                <th>Valor</th>`,
    efficiency:"Efectividad de Asesores",
    efficiency_headings:`
      <th rowspan="2">Asesor</th>
      <th colspan="3">Tienda</th>
      <th colspan="3">Facebook</th>
      <th colspan="3">Prospección</th>
      <th colspan="3">Cliente</th>
      <th colspan="3">Recomendación</th>
    `,
    efficiency_rows:`
      <th>Total</th>
			<th>Cerr</th>
			<th>Effect</th>
    `,

    products:"Productos",

    catalog:"Catálogo de productos",
    load_catalog:"Cargar catálogo",

    general:"General",
    type:"Tipo:",
    engeenering:"Ingenieria",
    laminates:"Laminados",
    vynil:"Vinil",
    generals:"Generales",
    colors:"Colores",
    product_table:`
      <th>Nombre</th>
      <th>Código</th>
      <th>Línea</th>
      <th>Precio</th>
      <th>M² por caja</th>
      <th></th>
    `,
    moldings:"Molduras/Adicionales",
    moldings_table:`
            <th>Nombre</th>
						<th>Tipo de precio</th>
						<th>Precio</th>
						<th></th>
    `,

    product_details:"Detalles de producto",
    name:"Nombre:",
    code:"Código:",
    line:"Línea:",
    price_type:"Tipo de Precio:",
    meters_per_box:"M² por caja:",
    box_price:"Precio por caja:",
    installation_per_meter:"Precio de Instalación por m",


  }
}