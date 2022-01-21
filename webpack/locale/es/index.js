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
    select_date:"Seleccione una fecha:",
    selected_date:"Fecha Seleccionada",
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
    change:"Cambiar",
    
    erase:"Borrar",

    filter:"Filtrar",
    clean:"Limpiar",


    add: "Agregar",
    loading: "Cargando",
    new: "Nuevo",
    clear: "Limpiar",

    previous:"Anterior",
    next:"Siguiente",

    no_comment:"No hay comentarios para mostrar",
    no_data: "No hay datos para mostrar",
    product_not_found:"No Se encontró el producto",
    no_user:"El usuario no existe",

    activate:"Activar",
    deactivate:"Desactivar",

    name: "Nombre",
    last_name: "Apellido",
    address: "Domicilio",
    city: "Ciudad",
    postal_code: "Código postal",
    email: "E-Mail",
    phone: "Teléfono",
    type: "Tipo",
    all: "Todos",

    phone_required:"El número de teléfono debe tener 10 dígitos",
    role:"Rol",
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
    
    is_editing:"{{isEditing? 'Guardar' : 'Editar'}}",
    payments:"Pagos"

  },
  payments:{
    payment:"Pago",
    payment_advance:"Pago de Anticipo",
    currency:"Moneda",
    exhange_rate:"Tipo de Cambio",
    currency_options:`
    <option value="PESOS">Pesos</option>
    <option value="DOLLARS">Dollars</option>
    `,
    amount:"Cantidad",
    min_payment:"El monto mínimo de pago es:",
    min_percentage:"El monto mínimo es el 50% del total",
    payment_method:"Forma de pago",
    payment_options:`
      <option value ="CASH">Efectivo</option>
      <option value="CREDIT_CARD">Tarjeta de Crédito</option>
      <option value="DEBIT_CARD">Tarjeta de Débito</option>
      <option value="CHECK">Cheque</option>
      <option value="BANK_TRANSFER">Transferencia Bancaria</option>
    `,
    total:"Totales",
    products:"Productos:",
    additionals:"Adicionales:",
    motor:"Motorización:",
    discount:"Descuento",
    installation:"Instalación:",
    sub_total:"Sub-Total:",
    tax:"IVA:",
    total_:"Total:",
    balance:"Saldo:",
    notes:"Observaciones",
    payment_type:"Tipo de pago",
    sale_disccount:"Descuento sobre venta",
    invoice:"Enviar recibo al cliente",
    pay:"Pagar",
    
    cancel_payment:"Cancelar Pago",
    cancelation_reason:"Motivo de cancelación",
  },
  molding:{
    details_of:"Detalles de ",
    type:"Tipo:",
    name:"Nombre:",
    unit:"Unidad de medida:",
    price:"Precio:",
  },
  exchange_rate:{
    exchange_rate:"Tipo de cambio",
    update_exchange:"Nuevo tipo de cambio",

  },
  deadlines:{
    operation:"Operaciones",
    overdue:"Vencidas",
    shipment:"Embarque",
    arrival:"Llegada"

  },
  datepicker:{
    supplier_id:"ID del proveedor",
    due_date:"Fecha de Salida de Producción",
    arrival:"Fecha de Llegada",
    installation:"Fecha de Instalación",
    comments:"Obsevaciones",
    save:"Capturar datos"
  },
  console_costing:{
    cost:"Costeo",
    average:"Promedio",
    min:"Mínimo",
    max:"Máximo"

  },
  commissions:{
    commissions:"Comisiones",
    select_agent:"Seleccione un asesor",
    agent:"Asesor :",
    min_sale:"Monto mínimo de venta:",
    total_sale:"venta Total:",
    total_commissions:"Total Comisiones:",
    pay_commissions:"Total de comissiones a Pagar",
    order_no:"No. de orden",

    change_percentage:"Cambiar Porcentaje de Comisión",
    new_percentage:"Nuevo Porcentaje",
    max_value:"El valor máximo es de ",
    min_value:"El valor mínimo es de 0%"

  },
  change_status:{
    change_status:"Cambiar Estado",
    new_status:"Nuevo Estado",
    status_options:`
    <option ng-if="changePermissions.canLine" value="LINE">Línea</option>
    <option ng-if="changePermissions.canBackorder" value="BACKORDER">Backorder</option>
    <option ng-if="changePermissions.canProduction" value="PRODUCTION">Producción</option>
    <option ng-if="changePermissions.canTransit" value="TRANSIT">Tránsito</option>
    <option ng-if="changePermissions.canFinished" value="FINISHED">I. Terminado</option>
    <option ng-if="changePermissions.canProgrammed" value="PROGRAMMED">Programada</option>
    <option ng-if="changePermissions.canIncomplete" value="INSTALLED_INCOMPLETE">Instalada Parcial</option>
    <option ng-if="changePermissions.canNonConform" value="INSTALLED_NONCONFORM">Instalado Inconforme</option>          
    `
  },
  modals:{
    admission_xml:"Solo se admiten archivos con formato .XML",
    empty_file:"El archivo está vacio",
    load_recipt:"Cargar Factura",

    admission_xlsx:"Solo se adminten archivos con formato .xslx",
    load_catalog:"Cargar Catálogo"
    
  },
  navigation:{
    manage_quotes:"Ventas",
    quotes:"Cotizaciones",
    statistics:"Estadísticas",
    new_quote:"Cotizar",

    orders:"Órdenes",
    order_tracking:"Seguimiento OV",
    manual_register:"Registro OV",

    my_sells:"Mis Ventas",
    my_orders:"Mis órdenes",
    commissions:"Comisiones",
    payments:"Pagos",
    cost:"Costeo",
    catalog:"Catálogo",
    reports:`<li><a ui-sref="console.reports" ng-if="currentUser.role == 'SUPERADMIN' && currentUser.canAdmin || currentUser.role == 'ADMIN'">Reportes</a></li>`,

    inventory_menu:`
    <metis-item ui-sref-active="selected" ng-if="currentUser.canAdmin || currentUser.role == 'MANAGER' || currentUser.role == 'BUYER' || true">
        <a href="#"><i class="fa fa-check-square-o fa-lg"></i> <span class="nav-label">Inventario</span><span class="fa arrow"></span></a>
        <ul class="nav nav-second-level collapse">
            <li><a ui-sref="console.inventory-movements" ng-if="currentUser.canAdmin || currentUser.role == 'MANAGER' || currentUser.role == 'BUYER'">Reporte Mov.</a></li>
            <li><a ui-sref="console.inventory-report">Reporte Inv.</a></li>
            <li><a ui-sref="console.inventory-in" ng-if="currentUser.canAdmin || currentUser.role == 'MANAGER'">Entradas</a></li>
            <li><a ui-sref="console.inventory-cross" ng-if="currentUser.canAdmin || currentUser.role == 'MANAGER'">Traslados</a></li>
            <li><a ui-sref="console.inventory-adjustments" ng-if="currentUser.role == 'SUPERADMIN'">Ajustes</a></li>
            <li><a ui-sref="console.products" ng-if="currentUser.canAdmin || currentUser.role == 'MANAGER'">Productos</a></li>
            <li><a ui-sref="console.warehouses" ng-if="currentUser.canAdmin || currentUser.role == 'MANAGER'">Almacenes</a></li>
        </ul>
    </metis-item>
    `,

    costs:"Costeo",
    recipts:"Facturas",
    order_movement:"Movimientos de OV",
    clients:"Clientes",
    users:"Usuarios",
  },
  users:{
    new_user:"Nuevo Usuario",
    name:"Nombre",
    last_name:"Apellidos",
    email:"E-Mail",
    phone:"Teléfono",
    pwd:"Contraseña",
    permissions:"Permisos",
    warehouse:`
    <div class="form-group">
      <label>Almacén</label>
      <select name="warehouses" ng-model="user.warehouseId" class="form-control" ng-options="warehouse.id as warehouse.name for warehouse in warehouses"></select>
    </div>
    `,
    min_sale:"Monto mínimo de venta",
    error_pwd:"Mínimo 8 caracteres, incluyendo al menos una mayúscula, una minúscula, un número y un caracter especial (! ( ) - . _ ` ~ @)",
    
    users:"Usuarios",

    user_details:"Detallaes de usuario",
    personal_info:"Información personal",
    user_rol:"Tipo de Usuario",
    rol:"Rol:",
    contact_info:"Datos de contacto",
    minumun_sale:"Minimo de venta",
    warehouse_info:`
    <h3><i class="fa fa-industry" aria-hidden="true"></i>
    Almacén</h3>
     <ul>
         <li> <span>Nombre:</span> {{ user.warehouse ? user.warehouse.name : 'N/A' }}</li>
         <li ng-if="user.warehouse"> <span>Ciudad:</span> {{ user.warehouse.city }}</li>
     </ul>`,
     role:"Permisos",
     role_options:`
     <option value="CONSULTANT">Asesor</option>
     <option value="BUYER">Comprador</option>
     <option value="MANAGER" ng-if="currentUser.canAdmin">Gerente de Compras</option>
     <option value="INSTALLATION_MANAGER" ng-if="currentUser.canAdmin">Gerente de Instalación</option>
     <option value="SALES_MANAGER" ng-if="currentUser.canAdmin">Gerente de Ventas</option>
     <option value="ADMIN" ng-if="currentUser.role=='SUPERADMIN'">Admin</option>
     <option value="SUPERADMIN" ng-if="currentUser.canAdmin">Super Admin</option>
     `,
     load_user:"Cargando Usuario",
  }
}