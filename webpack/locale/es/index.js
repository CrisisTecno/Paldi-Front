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
  }
}