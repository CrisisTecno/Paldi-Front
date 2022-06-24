module.exports = {
  client: {
    details: "Client Details",
    personal_information: "Personal Information",
    name: "<span>Name:</span> {{client.name}}",
    last_name: "<span>Last Name:</span> {{client.lastName}}",
    type: "Client Type",
    category: "<span>Category:</span> {{pretty('clientTypeEN', client.type)}}",
    contact_information: "Contact Information",
    email: `
      <span>E-mail:</span>
      <a href="mailto:{{client.email}}">{{client.email}}</a>
    `,
    phone: "<span>Phone number:</span> {{client.phoneNumber}}",
    address_title: "Address",
    address: "<span>Address:</span> {{client.address}}",
    city: "<span>City:</span> {{client.city}}",
    loading: "Loading Client",
    postal_code: "<span>Zip Code:</span> {{client.postalCode}}",
    error_postal_code: "The Zip code must be 5 digits long",
    error_email: "The e-mail is not valid",
    error_phone: "The phone number must be 10 digits long",
    error_not_exists: "The client does not exist",
    error_no_clients: "No clients found",
    client_options:`
    <select class="form-control" name="type" ng-model="client.type" required="" selected="{{client.type}}">
    <option value="DIRECT_SALE"> {{pretty('clientTypeEN', 'DIRECT_SALE')}} </option>
    <option value="DISTRIBUTOR_INDEPENDENT"> {{pretty('clientTypeEN', 'DISTRIBUTOR_PREMIUM')}} </option>
    </select>
    `
  },
  costing: {
    ov_movements: "OV Movements",
    receipts_for: "Receipts for Order # {{selectedOrderNo}}",
    receipt_no: "Receipt #",
  },
  inventory: {
    select_product: "Select a product from a warehouse",
    empty_warehouse: "The selected warehouse is empty",
    product_types: `
      <option value="Laminados">Laminate</option>
      <option value="Vinil">Vinyl</option>
      <option value="Ingenieria">Engineering</option>
    `,
  },
  date: {
    from: "From",
    to: "To",
    today: "Today",
    select_date:"Select a date:",
    selected_date:"Selected date:"
  },
  general: {
    send:"Send",
    create:"Create",
    date:"Date",
    edit: "Edit",
    cancel: "Cancel",
    save: "Save",
    download: "Download",
    close: "Close",
    delete: "Delete",
    back: "Back",

    update:"Update",
    accept:"Confirm",
    change:"Change",
    
    erase:"Erase",
    remove:"Remove",
    filter:"Filter",
    clean:"Clear",


    add: "Add",
    loading: "Loading",
    new: "New",
    clear: "Clear",
    searching:"Searching",

    previous:"Previous",
    next:"Next",

    no_comment:"No comments",
    no_data: "No data to show",
    product_not_found:"Product not found",
    no_user:"User not found",
    no_client:"Client not found",
    no_seller:"Seller not found",

    activate:"Activate",
    deactivate:"Deactivate",

    name: "Name",
    last_name: "Last Name",
    address: "Address",
    city: "City",
    postal_code: "Zip Code",
    email: "E-Mail",
    phone: "Phone number",
    type: "Type", 
    all: "All",

    phone_required:"Phone number must be at least 10 digits",
    role:"Rol",
    required_field: "Required",

    clients: "Clients",
    client: "Client",
    client_name:"Client Name",

    receipts: "Receipts",
    receipt: "Receipt",
    adjustments: "Adjustments",
    adjustment: "Adjustment",
    warehouse: "Warehouse",
    cost: "Cost",
    emission_date: "Date",
    color: "Color",
    molding: "Molding",
    difference: "Difference",
    existance: "Existance",
    new_value: "New Value",
    reason: "Reason",

    error_negative: "The value may be positive",
  },
  files: {
    movement_report: "movement_report.xlsx",
  },
  features: {
    city: false,
    cortinas: false,
    fractions:true,
    fraction_style:` style="width: 80%"`,
    shipping: true,
    step:1,
    min:1,

  },
  console:{
    personal_info:"Personal Information",
    change_pass:"Change Password",
    currency_ex:"Exchange Rate",
    bank_ex:"Bank Exchange Rate",
    logout:"Logout",
    update_provider: "Update Supplier",
    supplier: "Supplier ID",

    observations:"Notes",

    statistics:"Statistics",
    configuration:"Configuration",
    city:"City",
    time_origin:"Quotes Time vs Origin",
    weekly:"Weekly",
    monthly:"Monthly",
    product_type:"Quotes by product",
    origin:"Quote Origin",
    state:"Status",
    lost_subject:"Lost Sale Reason",
    stats:"Advisor Statistics",
    stats_heading:`
      <th rowspan="2">Advisors</th>
			<th colspan="2">NEW</th>
			<th colspan="2">ON TRACK</th>
			<th colspan="2">CLOSED</th>
			<th colspan="2">LOST</th>
			<th colspan="2">CANCELED</th>
    `,
    stats_row: `<th>Qty.</th>
                <th>Value</th>`,
    efficiency:"Advisor Effectiveness",
    efficiency_headings:`
      <th rowspan="2">Advisor</th>
      <th colspan="3">Store</th>
      <th colspan="3">Facebook</th>
      <th colspan="3">Prospecting</th>
      <th colspan="3">Client</th>
      <th colspan="3">Recomendation</th>
    `,
    efficiency_rows:`
      <th>Total</th>
			<th>Cerr</th>
			<th>Effect</th>
    `,

    products:"Products",

    catalog:"Product catalog",
    load_catalog:"Load catalog",

    general:"General",
    type:"Type:",
    engeenering:"Engineering",
    laminates:"Laminates",
    vynil:"Vynil",
    generals:"Generals",
    colors:"Colors",
    product_table:`
      <th>Name</th>
      <th>Code</th>
      <th>Line</th>
      <th>Price</th>
      <th>M² per box</th>
      <th></th>
    `,
    moldings:"Moldings/Additionals",
    moldings_table:`
            <th>Name</th>
						<th>Price Type</th>
						<th>Price</th>
						<th></th>
    `,

    product_details:"Product Details",
    name:"Name:",
    code:"Code:",
    line:"Line:",
    price_type:"Price Type:",
    meters_per_box:"M² per box",
    box_price:"Box price:",
    installation_per_meter:"Installation price m",

    is_editing:"{{isEditing? 'Save' : 'Edit'}}",
    payments:"Payments"

  },
  payments:{
    payment:"Payment",
    payment_advance:"Payment advance",
    currency:"Currency",
    exchange_rate:"Exchange rate",
    currency_options:`

    <option value="DOLLARS">Dollars</option>
    `,
    amount:"Amount",
    min_payment:"The minimun amount is:",
    min_percentage:"The minimun amount is 50% of the total",
    payment_method:"Payment method",
    payment_options:`
      <option value ="CASH">Cash</option>
      <option value="CREDIT_CARD">Credit Card</option>
      <option value="DEBIT_CARD">Debit Card</option>
      <option value="CHECK">Check</option>
      <option value="BANK_TRANSFER">Bank Wire Transfer</option>
    `,
    total:"Total",
    products:"Products:",
    additionals:"Additionals:",
    motor:"Motor:",
    discount:"Discount",
    installation:"Installation:",
    sub_total:"Sub-Total:",
    tax:"TAX:",
    total_:"Total:",
    balance:"Balance:",
    notes:"Notes",
    payment_type:"Payment type",
    sale_disccount:"Discount over sale",
    invoice:"Send Invoice",
    pay:"Pay",
        
    cancel_payment:"Cancel Payment",
    cancelation_reason:"Cancelation reason",
  },
  molding:{
    details_of:"Details of ",
    type:"Type:",
    name:"Name:",
    unit:"Measurement Unit:",
    price:"Price:",
  },
  exchange_rate:{
    exchange_rate:"Tipo de cambio",
    update_exchange:"Nuevo tipo de cambio",

  },
  deadlines:{
    operation:"Operation",
    overdue:"Overdue",
    shipment:"Shipment",
    arrival:"Arrival"

  },
  datepicker:{
    folio:"Order Sheed Id",
    guide:"Tracking Number",
    supplier_id:"Supplier Order Id",
    due_date:"Production due date",
    arrival:"Arrival",
    installation:"Installation date",
    comments:"Comments",
    save:"Save"
  },
  console_costing:{
    cost:"Cost",
    average:"Average",
    min:"Minimun",
    max:"Maximun"

  },
  commissions:{
    commissions:"Agent's Commissions",
    select_agent:"Select an Agent",
    agent:"Agent :",
    min_sale:"Minimun sale amount:",
    total_sale:"Total Sells:",
    total_commissions:"Total commissions:",
    pay_commissions:"Commisions to pay",
    order_no:"Order number ",

    change_percentage:"Change Comission Percentage",
    new_percentage:"New Percentage",
    max_value:"The Maximum value is ",
    min_value:"The Minimum   value is 0%"

  },
  change_status:{
    change_status:"Change Status",
    new_status:"New Status",
    status_options:`
    <option ng-if="changePermissions.canLine" value="LINE">{{pretty('enOrderStatus', 'LINE')}}</option>
    <option ng-if="changePermissions.canBackorder" value="BACKORDER">{{pretty('enOrderStatus', 'BACKORDER')}}</option>
    <option ng-if="changePermissions.canProduction" value="PRODUCTION">{{pretty('enOrderStatus', 'PRODUCTION')}}</option>
    <option ng-if="changePermissions.canTransit" value="TRANSIT">{{pretty('enOrderStatus', 'TRANSIT')}}</option>
    <option ng-if="changePermissions.canFinished" value="FINISHED">{{pretty('enOrderStatus', 'FINISHED')}}</option>
    <option ng-if="changePermissions.canProgrammed" value="PROGRAMMED">{{pretty('enOrderStatus', 'PROGRAMMED')}}</option>
    <option ng-if="changePermissions.canIncomplete" value="INSTALLED_INCOMPLETE">{{pretty('enOrderStatus', 'INSTALLED_INCOMPLETE')}}</option>
    <option ng-if="changePermissions.canNonConform" value="INSTALLED_NONCONFORM">{{pretty('enOrderStatus', 'INSTALLED_NONCONFORM')}}</option>          
    `
  },
  modals:{
    admission_xml:"Just .XML files",
    empty_file:"This file is empty",
    load_recipt:"Load Receipt",

    admission_xlsx:"Just .xlsx files",
    load_catalog:"Load catalog"
    
  },
  navigation:{
    manage_quotes:"Manage Quotes",
    quotes:"Quotes",
    statistics:"Statistics",
    new_quote:"New Quote",

    orders:"Orders",
    order_tracking:"Order tracking",
    manual_register:"Manual Registry",

    my_sells:"My quotes",
    my_orders:"My orders",
    commissions:"Commissions",
    payments:"Payments",
    cost:"Cost",
    catalog:"Catalog",
    reports:"",

    inventory_menu:`
 
    
    
    
    
    
    
    
    
    
    
    
    `,

    costs:"Cost",
    recipts:"Receipt",
    order_movement:"Order Movement",
    clients:"Client",
    users:"Users",
  },
  users:{
    new_user:"New User",
    name:"Name",
    last_name:"Last Name",
    email:"E-Mail",
    phone:"Phone",
    pwd:"Password",
    permissions:"Permissions",
    warehouse:`
    
    
    
    `,
    min_sale:"Minimun sale amount",
    error_pwd:"The password must be at least 8 characters including at least one uppercase letter, and one of this characters (! ( ) - . _ ` ~ @)",

    users:"Usuarios",


    user_details:"U ser details",
    personal_info:"Personal Info",
    user_rol:"User Role",
    rol:"Rol:",
    contact_info:"Contact Information",
    minumun_sale:"Minimum sale",
    warehouse_info:`
    
    
     
         
         
     `,
     role:"Role",
     role_options:`
      <option value="CONSULTANT">Sales Rep</option>
      <option value="MANAGER" ng-if="currentUser.canAdmin">Purchasing manager</option>
      <option value="INSTALLATION_MANAGER" ng-if="currentUser.canAdmin">Installation manager</option>
      <option value="SALES_MANAGER" ng-if="currentUser.canAdmin">Sales manager</option>
      <option value="BUYER">Buyer</option>
      <option value="ADMIN" ng-if="currentUser.role=='SUPERADMIN'">Admin</option>
      <option value="SUPERADMIN" ng-if="currentUser.canAdmin">Super Admin</option>
      <option value="EXTERNAL_CONSULTANT" ng-if="currentUser.canAdmin">External Consultant</option>
     `,
     load_user:"Loading User",
  },
  reports:{
    reports:"Reports",
    generate_report:"Generate Report:",
    type:"Type",
    history:"Report records",
    report_options:"Report Options",
    format:"Format",
    select:"Select",
    group:"Group by :",
    download_report:"Download Report  "
  },
  quotes:{
    installation:"Installation",
    quote:"Quote",
    manual_order:"Manual Order",
    add_new_client:"Add new client",
    client_type:"Client type",
    name:"Name:",
    phone:"Phone:",
    address:"Address:",
    discounts:`
    <li
                    class="discount"
                    ng-show="quote.clientMaxDiscount && product != 'Custom' && !isMultiple"
                ><small>Discount:</small></li>
                <li
                    class="discount"
                    ng-show="quote.clientMaxDiscount && product != 'Custom' && isMultiple && productsSorted[0].products.length > 0"
                ><small>Disc. Top Treatments:</small></li>
                



                <li
                    class="discount"
                    ng-show="quote.clientMaxDiscount && product != 'Custom' && isMultiple && productsSorted[3].products.length > 0"
                ><small>Disc. Shades:</small></li>
                



    `,
    percentages:"",
    change_client:"Change customer",
    details:"Quote Details",
    sidemark:"Sidermark",
    origin:`
 
















            `,
    city:`

















          
    `,
    product_options:`
    <button
                class="btn btn-default"
                ng-click="addProduct('Balance')"
                ng-show="!quote.type || quote.type=='Filtrasol' || quote.type=='Shutter'|| quote.type=='Enrollable'||quote.type=='Balance' ||quote.type=='Mixta'"
            >Top Treatments
            </button>
           




            </button>
           





            <button
                class="btn btn-default"
                ng-click="addProduct('Enrollable')"
                ng-show="!quote.type || quote.type=='Filtrasol' || quote.type=='Shutter' ||quote.type=='Enrollable'|| quote.type=='Balance' ||quote.type=='Mixta'"
            >Shades
            </button>

   

  <button
      class="btn btn-default"
      ng-click="addProduct('Cortina')"
      ng-show="!quote.type || quote.type=='Cortina'"
  >Curtain
  </button>
            





         












            
          
    `,
    products_btn:`
    <button
    class="btn btn-default"
    ng-click="addProduct('Balance')"
    ng-show="!quote.type || quote.type=='Balance' || quote.type=='Mixta' || quote.type=='Enrollable' "
>Top Treatments
</button>












<button
    class="btn btn-default"
    ng-click="addProduct('Enrollable')"
    ng-show="!quote.type || quote.type=='Enrollable' || quote.type=='Mixta' || quote.type=='Balance' "
>Shades
</button>





<button
class="btn btn-default"
ng-click="addProduct('Cortina')"
ng-show="!quote.type || quote.type=='Cortina'"
>Curtain
</button>













    `,
    shades:"Shades",
    products:"Products",
    shades_headers:`
    <th>Quantity</th>
    <th>Room</th>
    <th>Product</th>
    <th>Total</th>
    <th>Actions</th>
    `,
    additionals:"Aditionals",
    additionals_headers:`
    <th>Quantity</th>
    <th>Name</th>
    <th>Color</th>
    <th>Price</th>
    <th>Total</th>
    `,
    installation_additional:"Installations Additionals",
    installation_additionals_headers:`
    <th>Quantity</th>
    <th>Name</th>
    <th>Price</th>
    <th>Total</th>
    `,
    motor:"Motor",
    motor_headers:`
    <th>Quantity</th>
    <th>Name</th>
    <th>Price</th>
    `,
    order:"Order",
    order_headers:`
    <th>Sales Rep</th>
    <th>Type</th>
    <th>Price</th>
    <th>Due date</th>
    <th>Actions</th>
    `,
    totals:"Total",
    discount:"Discount",
    tax:"TAX",
    advance:"Advance",
    balance:"Balance",
    annotations:"Notes",
    notes:"Notes",
    
    quotes:"New Quote",
    download_quotes:"Download Quotes",
    no_quotes:"No quotes found",
    loading_quotes:"Loading Quotes"
  },
  toldos:{
    exterior_products:"Exterior Products",
    no_doable:"No doable",
    room:"Room",
    type:"Type",
    width:"Width (Inch)",
    projection:"Projection/Fall (Inch)",
    control_position:"Control Position",
    left:"Left",
    right:"Right",
    operation_mode:"Operation Mode",
    motor:"Motorization",
    add_additional:"Add Additional",
    additional:"Additional:",
    quantity:"Quantity",
    name:"Name",
    add_motor:"Add Motorization & Top Treatments",
    motorization:"Motorization:",
    notes:"Notes",
    inch_price:"Inch Price",
    unit_price:"Unit Price",
    
  },
  details_headers:{
    item:"Item",
    qty:"Quantity",
    location:"Location",
    type:"Type",
    width:"Width",
    height:"Height",
    projection:"Projection / Fall",
    operation_mode:"Operation Mode",
    unit_price:"Unit Price",
    notes:"Notes",
    view:"View",
    squared_units:"Inch²",
    price_per_box:"Price per Box",
    boxes_qty:"Boxes Quantity",
    installation:"Installation",
    system:"System",
    total:"Total",
    name:"Name",
    price:"Price",
    actions:"Actions",
    product:"Product",
    finish:"Finish",
    textil:"Textil",
    opening:"Opening",
    color:"Color",
    
    installation_type:"Installation Type",
    squared:false,
    units_height:"{{units.to_fraction(p.height, p.h_fraction)}}",
    units_width:"{{units.to_fraction(p.width, p.w_fraction)}}",
    
    yes:"Yes",
    no:"No"
  },
  shutters:{
    shutter:"Shutter",
    no_doable:"No Doable",
    quantity:"Quantity",
    room:"Room",
    product:"Product",
    product_options:`
    <option value="Regular">Regular</option>
    <option value="Arco">Arc</option>
    `,
    color:"Color",
    width:"Width (Inch)",
    height:"Height (Inch)",
    installation_type:"Installation Type",
    installation_options:`
    <option value="Por dentro">Inside</option>
    <option value="Por fuera">Outside</option>
    `,
    rod_type:"Rod Type",
    rod_options:`
    <option value="Visible">Visible</option>
    <option value="Oculto">Hidden</option>
    `,
    measure_type:"Measure Type",
    measure_options:`
    <option value="Claro de ventana">Window</option>
    <option value="Medida exacta">Exact Measure</option>
    `,
    louver:"Louver",
    frame_type:"Frame Type",
    frame_configuration:"Frame conf.",
    nothing:"Empty",
    panel_configuration:"Panel Conf.",
    rail_location:"Rail Location",
    add_aditional:"Add Additional",
    additional:"Aditional:",
    name:"Name",
    notes:"Notes",
    inch_price:"Inch Price",
    unit_price:"Unit Price",
    total:"Total",
    squared:false
  },
  floors:{
    floors:"Floors",
    type_options:`
    <option value="Laminados">Laminate</option>
    <option value="Vinil">Vinyl</option>
    <option value="Ingenieria">Engineering</option>
    `,
    squared_per_box:true,
    installed:"Instllation",
    add_moldind:"Agregar Moldind/Additional",
    moldind:"Moldind/Additional:",
    quantity:"Quantity",
    name:"Name",
    add_installation_additional:"Add Installation Aditional",
    installation_additional:"Installation Additional",
    code:" Code",
    line:"Line",
  },
  quote_commons:{
    products:"Products",
    price_per_box:"Price Per Box",
    installation_price:"Price per Installation",
    total:"Total",
    notes:"Notes",
    name:"Name",
    quantity:"Quantity",
    color:"Color",
    squared_meters:"Inches²",
    boxes_qty:"Boxes Quantity",
    no_doable:"No Doable",
    select_a_client:"Select a Client",
    room:"Room",
    type:"Product",
    price:"Price",
    square_per_box:"Inch² per Box",
    price_type:"Price Type",
    per_box:"Per Box",
    width:"Width (Inches)",
    height:"Height (Inches)",
    squared:false,
    add_additionals:"Add Additionals",
    additional:"Additionals:",
    add_motor:"Add Motor & Top Treatments",
    motor:"Motor & Top Tratments:",
    meter_price:"Inch Price",
    unit_price:"Unit Price",
    rotate_fabric:"Rotate Fabric",
    rotate_note:`title='note: if railroad max height in one piece without weld is= fabric width - 15" = max height for shade without weld'`,
    cancel_turn:"Cancel Turn",
    qty:"Qty.",
    system:"System"
  
  },
  molding_form:{
    molding:"Molding/Additional",
    measure_unit:"Measure Unit",
    measure_options:`
    <option value="PIECE">Unit</option>
    <option value="METER">Inches</option>
    <option value="WIDTH">Width (linal inches)</option>
    <option value="HEIGHT">Height (lineal inches)</option>
    `,
    
  },
  filtrasol:{
    filtrasol:"Filtrasol",
    type_options:`
    <option value="Filtrasol Eclisse">Eclisse</option>
    <option value="Filtrasol Enrollables">Enrollables</option>
    <option value="Filtrasol Panel Deslizante">Sliding Panel</option>
    <option value="Filtrasol Triple Shade">Triple Shade</option>
    `,
    config:"Mount",
    fall:"Roll Position",
    fall_options:`
    <option value="Atras">Back</option>
    <option value="Enfrente">Front</option>
    `,
    control:"Control Position",
    control_options:`
    <option value="Izquierda">Left</option>
    <option value="Derecha">Right</option>
    <option value="N/A">N/A</option>
    `,
    chain_height:"Chain Height",
    standard:"Standard",
    rotate_fabric:"Rotate Fabric",
    
    
    cancel_turn:"Cancel Turn",
    

  },
  enrollable:{
    shades:"Shades",
    type_options:`
    <option value="Solar Screen">Rollershade</option>
    <option value="Solar Blackout">Sheer Elegance</option>
    <option value="Triple Shade">Triple Shade</option>
    `,
    system:"System",
    config:"Mount",
    fall:"Roll",
    fall_options:`
    <option value="Standard">Standard</option>
    <option value="Reverse">Reverse</option>
    `,
    control_position:"Control Position",
    control_options:`
    <option value="Left">Left</option>
    <option value="Right">Right</option>
    <option value="N/A">N/A</option>
    `,
    chain_height:"Chain Height",
    standard:"Standar",

    
  },
  custom:{
    cusotm:"Custom",
    seller:"Seller",
    product_type:"Product Type",
    product_types:`
    <option value="Balance">Top Treatments</option>
    <option value="Toldo">Exterior Shades and Awnings</option>
    <option value="Enrollable">Shades</option>
    `,
    change_seller:"Change Seller",
    invalid_price:"Invalid Price"
  },
  cortina:{
    cortina:"Curtain",
    textil:"Textil",
    opening:"Opening",
    installation:"Installation",

  },
  new_client:{
    new_client:"New Client",
  },
  balance:{
    balance_field:false,
    textil:"Fabric",
    mount:"Mount",
    balances:"Top Treatments",
    types:`
    <option value="Wrapped Cornice">Wrapped Cornice</option>
    <option value="Aluminum Gallery">Aluminum Gallery</option>`,
    width:"Width/front (Inch)",
    height:"Height/front (Inch)",
    heights:"Height/front (Inch)",
    way:"Way",
    right_return:"Right Return",
    left_return:"Left Return",
  },
  login:{
    mail_required:"Mail Required",
    pass_required:"Password Required",
    password:"Password",
    access:"Login",
    forgot_password:"Forgot your password",
    login:"Login",
    recover_pass:"Forgot Password",
    send_pass:"Send Password",
    back_login:"Back to login"

  },
  order_list:{
    order_client:"<span>{{pretty('clientTypeEN', selectedOrder.client.type)}}</span>",
    supplier:"Supplier ID",
    orders:"Orders",
    manual_register:"Manual Register",
    download_orders:"Download Orders",
    order_details:"Order Details",
    order_no:"Order Number",
    state:"Status",
    proyect:"Sidemark",
    client:"Client",
    client_type:"Client Type",
    seller:"Sales Rep",
    type:"Type",
    product_qty:"Product Quantity",
    commitment:"Due Date",
    production_in:"Production Entry Date",
    production_out:"Production Out Date",
    trackingId:"Tracking Guide #",
    transit_date:"Shipping Date",
    transitInvoice:"Transit Invoice",
    arrival_date:"Arrival Date",
    programmedDate:"Scheduled Installation Date",
    installation_date:"Installation Date",
    products:"Products",
    additionals:"Additionals",
    motor:"Motors",
    discount:"Discount",
    installation:"Installation",
    sub_total:"Sub-Total",
    tax:"TAX",
    total:"TOTAL",
    balance:"Balance",
    payments:"Payments",
    folio:"Invoice Number",
    date:"Date",
    amount:"Price"
  },
  order_details:{
    event:"{{pretty('eventEn', event.action)}}",
    order_status_p:"{{pretty('orderStatusEn',order.quoteStatus)}}",
    change_status:"Change Status",
    quote:"Quote",
    order:"Order",
    details_quote:"Quote Details",
    details_order:"Order Details",
    state_coments:"Status Comments",
    quote_status:"Quote Status",
    quote_options:`
    <option ng-if="order.quoteStatus == 'Nueva'" value="Nueva">New </option>
    <option value="Seguimiento">Open</option>
    <option value="Duplicada">Duplicated</option>
    <option value="Venta Perdida">Lost Sale</option>
    `,
    condition_action:" || order.status != 'QUOTE'",
    reason:"Motive",
    reason_options:`
    <option value="Precio Menor">Less Price</option>
    <option value="Tiempo de entrega menor">Shorter Commitment Date </option>
    <option value="Busca otro producto">Searching For Another Product</option>
    <option value="Falta Seguimiento">Lack of Attention</option>
    `,
    postal_code:"Zip Code",
    seller:"Sales Rep",
    proyect:"Sidemark",
    cycle_time:"Cycle Time",
    dpfc:"Days to due date",
    production_days:"Production Date",
    transit_days:"Transit Days",
    history:"History",
    history_options:`
    <th>Date</th>
    <th>Actions</th>
    <th>User</th>
    <th>Notes</th>
    `,
    hide_history:"Hide History",
    products:"Products",
    product_notes:"Product Notes",
    hide:"Hide",
    addi_motors:"Additionals/Motors",
    addi_motor_options:`
    <th>Item</th>
              <th>Qty</th>
              <th>Name</th>
              <th>Price</th>
              <th>Total</th>
    `,
    download_invoice:"Download Receipt",
    download_pdf:"Download PDF",
    send_client:"Send To Client",
    send_work_order:"Send Work Order",
    canceled:"Canceled",
    register_payment:"Register Payment",
    need_invoice:"Needs Invoce",
    send_as_order:"Send as Order",
    approve_order:"Approve Order",
    reject:"Reject order",
    send_prod:"Send to production",
    send_back:"Send to Backorder",
    sent_transit:"Send Transit",
    finish:"Finish",
    inst_date:"Installation Date",
    work_order:"Work Order",
    installation_order:"Installation Order",
    installed:"Installed",
    partial_install:"Partially Installed",
    inconform_install:"Inconform Installation",
    change_provider:"Change Provider ID",
    change_guides:"Change Tracking Guides",
    change_state:"Change Status",
    order_not_found:"Order Not Found",
    show_history:"Show History",
    order_stats:"{{pretty('orderStatusEn', order.status)}}",
    folio:"Invoice #",
    date:"Date",
    amount:"Amount",
    charged:"Charged"
  },
  send_as_order:{
    send_order:"Send as order",
    with_advance:"With Advance",
    without_advance:"No Advance"
  },
  installation_order:{

  },
  change_pass:{
    change_pass:"Change Password",
    alert_pass:"For your security, you need to provide a new password",
    actual_pass:"Actual Password",
    incorrect_pass:"Wrong Password",
    different_pass:"Password must be diffent from the previous one",
    recent_pass:"This password was used recently, please create a new one",
    valid_pass:"8 Characters minimum including an upper case, lower case, a number and a special character (! ( ) - . _ ` ~ @)",
    confirm_pass:"Password Confirmation",
    no_match:"Password doesn't match",
    new_pass:"New Password"
  },
  button_commons:{
    today:"Today",
    clean:"Clean",
    duplicate:"Duplicate",
    close:"Close",
    move_up:"Move Up",
    move_down:"Move Down",
    remove_btn:"Remove",
    
  },
  resources:{
    resources:"Resources",
    upload:"Upload your PDF File",
    name:"Name",
    description:"Description",
    load:"Load Resource",
    
  }
  
  
  
 
  
}