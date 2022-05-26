const { resources } = require("../en");

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
    client_options:`
    <select class="form-control" name="type" ng-model="client.type" required="" selected="{{client.type}}">
    <option value="DIRECT_SALE"> {{pretty('clientType', 'DIRECT_SALE')}} </option>
    <option value="DISTRIBUTOR_INDEPENDENT"> {{pretty('clientType', 'DISTRIBUTOR_INDEPENDENT')}} </option>
    <option value="DISTRIBUTOR_PREMIUM"> {{pretty('clientType', 'DISTRIBUTOR_PREMIUM')}} </option>
    <option value="PROJECTS"> {{pretty('clientType', 'PROJECTS')}} </option>
    <option value="ARCHITECT_INTERIOR"> {{pretty('clientType', 'ARCHITECT_INTERIOR')}} </option>
    </select>`
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
    from: "Desde ",
    to: "Hasta ",
    today: "Hoy",
    select_date:"Seleccione una fecha:",
    selected_date:"Fecha Seleccionada",
  },
  general: {
    send:"Enviar",
    create:"Crear",
    date:"Fecha",
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
    remove:"Remover",
    filter:"Filtrar",
    clean:"Limpiar",


    add: "Agregar",
    loading: "Cargando",
    new: "Nuevo",
    clear: "Limpiar",
    searching:"Buscando",

    previous:"Anterior",
    next:"Siguiente",

    no_comment:"No hay comentarios para mostrar",
    no_data: "No hay datos para mostrar",
    product_not_found:"No Se encontró el producto",
    no_user:"El usuario no existe",
    no_client:"No se encontraron clientes",
    no_seller:"No se encontraron vendedores",

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
    client_name:"Nombre del cliente",

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
    cortinas: true,
    balance: true,
    shutter: true,
    toldo: true,
    enrollable: true,
    filtrasol: true,
    piso: true,
    fractions:false,
    faction_style:``,
    shipping: false,
    step:0.1,
    min:0
  },
  console:{


    personal_info:"Información Personal",
    change_pass:"Cambiar Contraseña",
    currency_ex:"Tipo de Cambio",
    bank_ex:"Tipo de Cambio Actual",
    logout:"Cerrar Cesión",

    
    update_provider: "Actualizar Proveedor",

    observations:"Observaciones",
    supplier:"ID Proveedor",
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
    exchange_rate:"Tipo de Cambio",
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
    folio:"Folio de Pedido",
    guide:"Guia de Rastreo",
    supplier_id:"ID del proveedor",
    due_date:"Fecha de Salida de Producción",
    arrival:"Fecha de Llegada",
    installation:"Fecha de Instalación",
    comments:"Observaciones",
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
  },
  reports:{
    reports:"Reportes",
    generate_report:"Generar reporte:",
    type:"Tipo",
    history:"Historial de reportes",
    report_options:"Opciones del reporte",
    format:"Formato",
    select:"Seleccionar",
    group:"Agrupar :",
    download_report:"Descargar Reporte"
  },
  quotes:{
    installation:"Instalación",
    quote:"Cotizar",
    manual_order:"Orden Manual",
    add_new_client:"Agregar nuevo cliente",
    client_type:"Tipo de Cliente",
    name:"Nombre:",
    phone:"Telefono:",
    address:"Domicilio:",
    discounts:`
    <li
                    class="discount"
                    ng-show="quote.clientMaxDiscount && product != 'Custom' && !isMultiple"
                ><small>Descuento:</small></li>
                <li
                    class="discount"
                    ng-show="quote.clientMaxDiscount && product != 'Custom' && isMultiple && productsSorted[0].products.length > 0"
                ><small>Desc. Balance & Cornizas:</small></li>
                <li
                    class="discount"
                    ng-show="quote.clientMaxDiscount && product != 'Custom' && isMultiple  && productsSorted[1].products.length > 0"
                ><small>Desc. Shutters:</small></li>
                <li
                    class="discount"
                    ng-show="quote.clientMaxDiscount && product != 'Custom' && isMultiple && productsSorted[3].products.length > 0"
                ><small>Desc. Persianas:</small></li>
                <li
                    class="discount"
                    ng-show="quote.clientMaxDiscount && product != 'Custom' && isMultiple && productsSorted[4].products.length > 0"
                ><small>Desc. Filtrasol:</small></li>
    `,
    percentages:"(Max {{quote.clientMaxDiscount}}%)",
    change_client:"Cambiar Cliente",
    details:"Detalles",
    sidemark:"Proyecto",
    origin:`
    <label>Origen</label>
            <select
                class="form-control"
                name="type"
                ng-model="quote.source"
                required=""
            >
              <option value="Tienda">Tienda</option>
              <option value="Recomendación">Recomendación</option>
              <option value="Cliente">Cliente</option>
              <option value="Facebook">Facebook</option>
              <option value="Prospección">Prospección</option>
            </select>
            <small
                class="error-message"
                ng-if="checkForm && (quote.source=='' || quote.source == null)"
            >Campo requerido</small>
            `,
    city:`
    <label>Ciudad</label>
            <select
                class="form-control"
                name="type"
                ng-model="quote.city"
                required=""
            >
              <option value="Ensenada">Ensenada</option>
              <option value="Tijuana">Tijuana</option>
              <option value="Mexicali">Mexicali</option>
              <option value="Rosarito">Rosarito</option>
              <option value="Tecate">Tecate</option>
            </select>
            <small
                class="error-message"
                ng-if="checkForm && (quote.city=='' || quote.city == null)"
            >Campo requerido</small>
          
    `,
    product_options:`
    <button
                class="btn btn-default"
                ng-click="addProduct('Balance')"
                ng-show="!quote.type || quote.type=='Filtrasol' || quote.type=='Shutter'|| quote.type=='Enrollable'||quote.type=='Balance' ||quote.type=='Mixta'"
            >Balance & Cornizas
            </button>
            <button
                class="btn btn-default"
                ng-click="addProduct('Shutter')"
                ng-show="!quote.type || quote.type=='Filtrasol' || quote.type=='Shutter' ||quote.type=='Enrollable'|| quote.type=='Balance' ||quote.type=='Mixta'"
            >Shutters
            </button>
            <button
                class="btn btn-default"
                ng-click="addProduct('Toldo')"
                ng-show="!quote.type || quote.type=='Toldo'"
            >Productos para el Exterior
            </button>
            <button
                class="btn btn-default"
                ng-click="addProduct('Enrollable')"
                ng-show="!quote.type || quote.type=='Filtrasol' || quote.type=='Shutter' ||quote.type=='Enrollable'|| quote.type=='Balance' ||quote.type=='Mixta'"
            >Persianas
            </button>
            <button
                class="btn btn-default"
                ng-click="addProduct('Filtrasol')"
                ng-show="!quote.type || quote.type=='Filtrasol'|| quote.type=='Shutter' || quote.type=='Enrollable'|| quote.type=='Balance' ||quote.type=='Mixta'"
            >Filtrasol
            </button>
            <button
                class="btn btn-default"
                ng-click="addProduct('Piso')"
                ng-show="!quote.type || quote.type=='Piso'"
            >Pisos
            </button>
            
              <button
                  class="btn btn-default"
                  ng-click="addProduct('Cortina')"
                  ng-show="!quote.type || quote.type=='Cortina'"
              >Cortinas
              </button>
            
          
    `,
    products_btn:`
    <button
    class="btn btn-default"
    ng-click="addProduct('Balance')"
    ng-show="!quote.type || quote.type=='Balance'"
>Balance & Cornizas 
</button>
<button
    class="btn btn-default"
    ng-click="addProduct('Shutter')"
    ng-show="!quote.type || quote.type=='Shutter'"
>Shutters
</button>
<button
    class="btn btn-default"
    ng-click="addProduct('Toldo')"
    ng-show="!quote.type || quote.type=='Toldo'"
>Productos para el Exterior
</button>
<button
    class="btn btn-default"
    ng-click="addProduct('Enrollable')"
    ng-show="!quote.type || quote.type=='Enrollable'"
>Persianas
</button>
<button
    class="btn btn-default"
    ng-click="addProduct('Filtrasol')"
    ng-show="!quote.type || quote.type=='Filtrasol'"
>Filtrasol
</button>
<button
    class="btn btn-default"
    ng-click="addProduct('Piso')"
    ng-show="!quote.type || quote.type=='Piso'"
>Pisos
</button>

  <button
      class="btn btn-default"
      ng-click="addProduct('Cortinas')"
      ng-show="!quote.type || quote.type=='Cortina'"
  >Cortinas
  </button>
    `,
    shades:"Persianas",
    products:"Productos",
    shades_headers:`
    <th>Cant.</th>
    <th>Ubicación</th>
    <th>Tipo</th>
    <th>Total</th>
    <th>Acciones</th>
    `,
    additionals:"Adicionales",
    additionals_headers:`
    <th>Cant</th>
    <th>Nombre</th>
    <th>Precio</th>
    <th>Total</th>
    `,
    installation_additional:"Adicionales de instalación",
    installation_additionals_headers:`
    <th>Cant</th>
    <th>Nombre</th>
    <th>Precio</th>
    <th>Total</th>
    `,
    motor:"Motorización",
    motor_headers:`
    <th>Cant</th>
    <th>Nombre</th>
    <th>Precio</th>
    `,
    order:"Orden",
    order_headers:`
    <th>Vendedor</th>
    <th>Tipo</th>
    <th>Precio</th>
    <th>Fecha Compromiso</th>
    <th>Acciones</th>
    `,
    totals:"Totales",
    discount:"Descuento",
    tax:"IVA",
    advance:"Anticipo",
    balance:"Saldo",
    annotations:"Anotaciones",
    notes:"Notas",

    quotes:"Cotizar",
    download_quotes:"Descargar Cotizaciones",
    no_quotes:"No hay cotizaciones para mostrar",
    loading_quotes:"Cargando Cotizaciones"
  },
  toldos:{
    exterior_products:"Productos para el exterior",
    no_doable:"No realizable",
    room:"Ubicación",
    type:"Tipo",
    width:"Ancho (Metros)",
    projection:"Proyeción/ Caída (Metros)",
    control_position:"Lado de Mando",
    left:"Izquierda",
    right:"Derecha",
    operation_mode:"Modo de operación",
    motor:"Motorización",
    add_additional:"Agregar Adicionales",
    additional:"Adicionales:",
    quantity:"Cantidad",
    name:"Nombre",
    add_motor:"Agregar Motorización",
    motorization:"Motorización:",
    notes:"Observaciones",
    inch_price:"Precio Metro",
    unit_price:"Precio Unitario",

  },
  details_headers:{
    item:"Ítem",
    qty:"Cant.",
    location:"Ubicación",
    type:"Tipo",
    width:"Ancho",
    height:"Altura",
    projection:"Proyeccion / Caída",
    operation_mode:"Modo de operación",
    unit_price:"Precio Unitario",
    notes:"Obs.",
    view:"Ver",
    squared_units:"m²",
    price_per_box:"Precio por Caja",
    boxes_qty:"Cant. Cajas",
    installation:"Instalación",
    system:"Sistema",
    total:"Total",
    name:"Nombre",
    price:"Precio",
    actions:"Acciones",
    product:"Producto",
    finish:"Acabado",
    textil:"Textil",
    opening:"Apertura",
    color:"Color",

    installation_type:"Tipo de Inst.",
    squared:true,
    units_height:"{{p.height}}",
    units_width:"{{p.width}}"  ,

    yes:"Si",
    no:"No"
  },
  shutters:{
    shutter:"Shutter",
    no_doable:"No Realizable",
    quantity:"Cantidad",
    room:"Ubicación",
    product:"Tipo de Shutter",
    product_options:`
    <option value="Regular">Regular</option>
    <option value="Arco">Arco</option>
    `,
    color:"Color",
    width:"Ancho (Metros)",
    height:"Alto (metros)",
    squared_meters:"m²",
    installation_type:"Tipo de Instalación",
    installation_options:`
    <option value="Por dentro">Por dentro</option>
    <option value="Por fuera">Por fuera</option>
    `,
    rod_type:"Tipo de Bastón",
    rod_options:`
    <option value="Visible">Visible</option>
    <option value="Oculto">Oculto</option>
    `,
    measure_type:"Tipo de Media",
    measure_options:`
    <option value="Claro de ventana">Claro de ventana</option>
    <option value="Medida exacta">Medida exacta</option>
    `,
    louver:"Louver",
    frame_type:"Tipo de Marco",
    frame_configuration:"Conf. del Marco",
    nothing:"Nada",
    panel_configuration:"Conf. de Paneles",
    rail_location:"Ubicación Riel D.",
    add_aditional:"Agregar Adicional",
    additional:"Adicional:",
    name:"Nombre",
    notes:"Observaciones",
    inch_price:"Precio Metro",
    unit_price:"Precio Unitario",
    total:"Total",
    squared:true
  },
  floors:{
    floors:"Pisos",
    type_options:`
    <option value="Laminados">Laminado</option>
    <option value="Vinil">Vinil</option>
    <option value="Ingenieria">Ingeniería</option>
    `,
    squared_per_box:true,
    installed:"Instalación",
    add_moldind:"Agregar Moldura/Adicional",
    moldind:"Moldura/Adicional:",
    quantity:"Cantidad",
    name:"Nombre",
    add_installation_additional:"Agregar Adicional de Instalación",
    installation_additional:"Adicional de Instalación",
    code:" Codigo",
    line:"Línea",
  },
  quote_commons:{
    products:"Productos",
    price_per_box:"Precio por caja",
    installation_price:"Precio de Instalación",
    total:"Total",
    notes:"Observaciones",
    name:"Nombre",
    quantity:"Cantidad",
    color:"Color",
    squared_meters:"m²",
    boxes_qty:"Cantidad de Cajas",
    no_doable:"No realizable",
    select_a_client:"Seleccione un cliente",
    room:"Ubicación",
    type:"Tipo",
    price:"Precio",
    square_per_box:"M² por Caja",
    price_type:"Tipo de Precio",
    per_box:"Por Caja",
    width:"Ancho (metros)",
    height:"Alto (metros)",
    squared:false,
    add_additionals:"Agregar Adicional",
    additional:"Adicional:",
    add_motor:"Agregar Motorización",
    motor:"Motorización:",
    meter_price:"Precio Metro",
    unit_price:"Precio Unitario",
    rotate_fabric:"Girar Textil",
    rotate_note:"",
    cancel_turn:"Cancelar giro de textil",
    qty:"Cant.",
    system:"Sistema"
  },
  molding_form:{
    molding:"Moldura/Adicional",
    measure_unit:"Unidad de Medida",
    measure_options:`
    <option value="PIECE">Unidad</option>
    <option value="METER">Metro cuadrado</option>
    <option value="WIDTH">Ancho (metro lineal)</option>
    <option value="HEIGHT">Alto (metro lineal)</option>
    `,

  },
  filtrasol:{
    filtrasol:"Filtrasol",
    type_options:`
    <option value="Filtrasol Eclisse">Eclisse</option>
    <option value="Filtrasol Enrollables">Enrollables</option>
    <option value="Filtrasol Panel Deslizante">Panel Deslizante</option>
    <option value="Filtrasol Triple Shade">Triple Shade</option>
    `,
    config:"Config",
    fall:"Caída",
    fall_options:`
    <option value="Atras">Atras</option>
    <option value="Enfrente">Enfrente</option>
    `,
    control:"Mando",
    control_options:`
    <option value="Izquierda">Izquierda</option>
    <option value="Derecha">Derecha</option>
    <option value="N/A">N/A</option>
    `,
    chain_height:"Altura de Mando",
    standard:"Estándar",
    rotate_fabric:"Girar Textil",
    cancel_turn:"Cancelar giro de textil",
    

  },
  enrollable:{
    shades:"Persianas",
    type_options:`
    <option value="Cascade">Cascade</option>
    <option value="Triple Shade">Triple Shade</option>
    <option value="Horizontales de Madera">Horizontales de Madera</option>
    <option value="Enrollables">Enrollables Platinum</option>
    <option value="Romanas">Romanas</option>
    <option value="Eclisse">Eclisse</option>
    <option value="Panel Deslizante">Panel Deslizante</option>
    <option value="Verticales de PVC">Verticales de PVC</option>
    <option value="Horizontales de Aluminio">Horizontales de Aluminio</option>
    <option value="Celular">Celular</option>
    <option value="Enrollables Wolken">Enrollables Wolken</option>
    `,
    system:"Sistema",
    config:"Config",
    fall:"Caída",
    fall_options:`
    <option value="Atras">Atras</option>
    <option value="Enfrente">Enfrente</option>
    `,
    control_position:"Mando",
    control_options:`
    <option value="Izquierda">Izquierda</option>
    <option value="Derecha">Derecha</option>
    <option value="N/A">N/A</option>
    `,
    chain_height:"Altura de Mando",
    standard:"Estándar",

    
  },
  custom:{
    cusotm:"Personalizado",
    seller:"Vendedor",
    product_type:"Tipo de Producto",
    product_types:`
    <option value="Balance">Balances & Cornizas</option>
    <option value="Shutter">Shutters</option>
    <option value="Toldo">Productos para el exterior</option>
    <option value="Enrollable">Persianas</option>
    <option value="Piso">Pisos</option>
    `,
    change_seller:"Cambiar vendedor",
    invalid_price:"Precio Invalido"
  },
  cortina:{
    cortina:"Cortina",
    textil:"Textil",
    opening:"Apertura",
    installation:"Instalación",

  },
  new_client:{
    new_client:"Nuevo Cliente",
  },
  balance:{
    balance_field:true,
    balances:"Balances & Cornizas",
    textil:"Textil",
    mount:"Configuracion",
    types:`
    <option value="De madera">De madera</option>
    <option value="Wrapped Cornice">Corniza Forrada</option>
    <option value="Aluminum Gallery">Galeria de Aluminio</option>`,
    width:"Ancho/frente (metros)",
    
    height:"Alto/frente (metros)",
    heights:"Alto/frente (cm)",
    way:"Tapa",
    right_return:"Retorno derecho",
    left_return:"Retorno Izquiero",
  },
  login:{
    mail_required:"El correo es requerido",
    pass_required:"La contraseña es requerida",
    password:"Contraseña",
    access:"Ingresar",
    forgot_password:"¿Olvidaste tu contraseña?",
    login:"Iniciar Sesión",
    recover_pass:"Recuperar Contraseña",
    send_pass:"Recordar",
    back_login:"Volver a ingreso"
  },
  order_list:{
    order_client:"<span>{{pretty('clientType', selectedOrder.client.type)}}</span>",
    supplier:"ID del Proveedor",

    orders:"Órdenes",
    manual_register:"Registro Orden Manual",
    download_orders:"Descargar Ordenes",
    order_details:"Detalles de La orden",
    order_no:"No. de Orden",
    state:"Estado",
    proyect:"Proyecto",
    client:"Cliente",
    client_type:"Tipo de Cliente",
    seller:"Vendedor",
    type:"Tipo",
    product_qty:"Cantidad de Productos",
    commitment:"Fecha de Compromiso",
    production_in:"Entrada a producción",
    production_out:"Salida de Produccion",
    trackingId:"Guia de Rastreo",
    transit_date:"Fecha de Embarque",
    transitInvoice:"Folio de Pedido",
    arrival_date:"Fecha de Llegada",
    programmedDate:"Fecha de Programación de Instalación",
    installation_date:"Fecha de Instalación",
    products:"Productos",
    additionals:"Adicionales",
    motor:"Motorizacion",
    discount:"Descuento",
    installation:"Instalación",
    sub_total:"Sub-Total",
    tax:"IVA",
    total:"TOTAL",
    balance:"Saldo",
    payments:"Pagos",
    folio:"No. Folio",
    date:"Fecha",
    amount:"Monto",
    

  },
  order_details:{
    condition_action:"",
    event:"{{pretty('event', event.action)}}",
    order_status_p:"{{pretty('orderStatus',order.quoteStatus)}}",
    change_status:"Cambiar Estado",
    quote:"Cotización",
    order:"Orden",
    details_quote:"Detalles de Cotización",
    details_order:"Detalles de Orden",
    state_coments:"Comentatios de Estado",
    quote_status:"Estado de Cotizacion",
    quote_options:`
    <option ng-if="order.quoteStatus == 'Nueva'" value="Nueva">Nueva </option>
    <option value="Seguimiento">Seguimiento</option>
    <option value="Duplicada">Duplicada</option>
    <option value="Venta Perdida">Venta Perdida</option>
    `,
    reason:"Razon",
    reason_options:`
    <option value="Precio Menor">Precio Menor</option>
    <option value="Tiempo de entrega menor">Tiempo de entrega menor </option>
    <option value="Busca otro producto">Busca otro producto</option>
    <option value="Falta Seguimiento">Falta de Seguimiento</option>
    `,
    postal_code:"C.P",
    seller:"Vendedor",
    proyect:"Proyecto",
    cycle_time:"Tiempo de Ciclo",
    dpfc:"DPFC",
    production_days:"T. Entrega de Producción",
    transit_days:"T. Entrega Tránsito",
    history:"Historial",
    history_options:`
    <th>Fecha</th>
    <th>Acción</th>
    <th>Usuario</th>
    <th>Observaciones</th>
    `,
    hide_history:"Ocultar Historial",
    products:"Productos",
    product_notes:"Observaciones de Producto",
    hide:"Ocultar",
    addi_motors:"Adicionales/Mototizacion",
    addi_motor_options:`
    <th>Ítem</th>
              <th>Cant</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Total</th>
    `,
    download_invoice:"Descargar Recibo",
    download_pdf:"Descargar PDF",
    send_client:"Enviar al Cliente",
    send_work_order:"Enviar Orden de Trabajo",
    canceled:"Cancelado",
    register_payment:"Registrar Pago",
    need_invoice:"Necesita Factura",
    send_as_order:"Enviar Como Orden",
    approve_order:"Aprobar Orden",
    reject:"Rechazar orden",
    send_prod:"Enviar a producción",
    send_back:"Enviar a Backorder",
    send_transit:"Enviar a tránsito",
    finish:"Terminar",
    inst_date:"Fecha de Inst.",
    work_order:"Orden de Trabajo",
    installation_order:"Orden de Instalación",
    installed:"Instalado",
    partial_install:"Instalada Parcial",
    inconform_install:"Instalada Inconforme",
    change_provider:"Cambiar ID de Provedor",
    change_guides:"Editar Guias",
    change_state:"Cambiar Estado",
    order_not_found:"No se encontró la orden",
    show_history:"Mostrar Historial",
    order_stats:"{{pretty('orderStatus', order.status)}}",

    folio:"No. Folio",
    date:"Fecha",
    amount:"Monto",
    charged:"Cobró"
  },
  send_as_order:{
    send_order:"Enviar como Orden",
    with_advance:"Con Anticipo",
    without_advance:"Sin Anticipo"
  },
  change_pass:{
    change_pass:"Cambiar Contraseña",
    alert_pass:"Por cuestiones de seguridad debe crear una nueva contraseña",
    actual_pass:"Contraseña actual",
    incorrect_pass:"Contraseña incorrecta",
    different_pass:"La Contraseña nueva debe ser diferente a la anterior",
    recent_pass:"Esta contraseña fue utilizada recientemente, cree una nueva",
    valid_pass:"Mínimo 8 caractéres, incluyendo al menos una mayúscula, una minúscula, un número y un caracter especial (! ( ) - . _ ` ~ @)",
    confirm_pass:"Confirmación de contraseña",
    no_match:"Contraseñas no coincide",
    new_pass:"Contraseña nueva"
  },
  button_commons:{
    today:"Hoy",
    clean:"Limpiar",
    duplicate:"Duplicar",
    close:"Cerrar",
    move_up:"Mover Arriba",
    move_down:"Mover Abajo",
    
  },
  resources:{
    resources:"Recursos",
    upload:"Selecciona el PDF",
    name:"Nombre",
    description:"Descripción",
    load:"Subir Archivo"
  }
  
  
}

