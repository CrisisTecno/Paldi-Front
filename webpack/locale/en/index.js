module.exports = {
  client: {
    details: "Client Details",
    personal_information: "Personal Information",
    name: "<span>Name:</span> {{client.name}}",
    last_name: "<span>Last Name:</span> {{client.lastName}}",
    type: "Client Type",
    category: "<span>Category:</span> {{pretty('clientType', client.type)}}",
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
    postal_code: "<span>Postal Code:</span> {{client.postalCode}}",
    error_postal_code: "The postal code must be 5 digits long",
    error_email: "The e-mail is not valid",
    error_phone: "The phone number must be 10 digits long",
    error_not_exists: "The client does not exist",
    error_no_clients: "No clients found",
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

    activate:"Activate",
    deactivate:"Deactivate",

    name: "Name",
    last_name: "Last Name",
    address: "Address",
    city: "City",
    postal_code: "Postal Code",
    email: "E-Mail",
    phone: "Phone number",
    type: "Type", 
    all: "All",

    phone_required:"Phone number must be at least 10 digits",
    role:"Rol",
    required_field: "Required",

    clients: "Clients",
    client: "Client",
    client_name:"Nombre del cliente",

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
  },
  console:{
    update_provider: "Update Supplier",
    provider_id: "Supplier ID",

    observations:"Notes",

    statistics:"Statistics",
    configuration:"Configuration",
    city:"City",
    time_origin:"Quotes Time vs Origin",
    weekly:"Weekly",
    monthly:"Monthly",
    product_type:"Quotes by product",
    origin:"Quote Origin",
    state:"State",
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
    exhange_rate:"Exchange rate",
    currency_options:`

    <option value="DOLLARS">Dollars</option>
    `,
    amount:"Amount",
    min_payment:"The minimun amount is:",
    min_percentage:"The minimun amount is 50% of the total",
    payment_method:"PAyment method",
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
    quotes:"Quote",
    statistics:"Statistics",
    new_quote:"New Quote",

    orders:"Orders",
    order_tracking:"Order tracking",
    manual_register:"Manual Registry",

    my_sells:"My sells",
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
      <option value="INSTALLATION_MANAGER" ng-if="currentUser.canAdmin">Instalation manager</option>
      <option value="SALES_MANAGER" ng-if="currentUser.canAdmin">Sales manager</option>
      <option value="BUYER">Comprador</option>
      <option value="ADMIN" ng-if="currentUser.role=='SUPERADMIN'">Admin</option>
      <option value="SUPERADMIN" ng-if="currentUser.canAdmin">Super Admin</option>
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
                ><small>Disc. Cornices:</small></li>
                



                <li
                    class="discount"
                    ng-show="quote.clientMaxDiscount && product != 'Custom' && isMultiple && productsSorted[3].products.length > 0"
                ><small>Disc Shades:</small></li>
                



    `,
    change_client:"Change customer",
    details:"Quote Details",
    sidemark:"Sidermark",
    origin:`
 
















            `,
    city:`

















          </div>
    `,
    product_options:`
    <button
                class="btn btn-default"
                ng-click="addProduct('Balance')"
                ng-show="!quote.type || quote.type=='Filtrasol' || quote.type=='Shutter'|| quote.type=='Enrollable'||quote.type=='Balance' ||quote.type=='Mixta'"
            >Cornices
            </button>
           




            </button>
            <button
                class="btn btn-default"
                ng-click="addProduct('Toldo')"
                ng-show="!quote.type || quote.type=='Toldo'"
            >Exterior Products
            </button>
            <button
                class="btn btn-default"
                ng-click="addProduct('Enrollable')"
                ng-show="!quote.type || quote.type=='Filtrasol' || quote.type=='Shutter' ||quote.type=='Enrollable'|| quote.type=='Balance' ||quote.type=='Mixta'"
            >Shades
            </button>
            





         












            
          </div>
    `,
    products_btn:`
    <button
    class="btn btn-default"
    ng-click="addProduct('Balance')"
    ng-show="!quote.type || quote.type=='Balance'"
>Cornices
</button>






<button
    class="btn btn-default"
    ng-click="addProduct('Toldo')"
    ng-show="!quote.type || quote.type=='Toldo'"
>Exterior Products
</button>
<button
    class="btn btn-default"
    ng-click="addProduct('Enrollable')"
    ng-show="!quote.type || quote.type=='Enrollable'"
>Shades
</button>



















    `,
    shades:"Shades",
    products:"Products",
    product_table_header:`
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
    annotations:"Annotations",
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
    add_motor:"Add Motorization & Cornices",
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
    projection:"Projection / Fall",
    operation_mode:"Operation Mode",
    unit_price:"Unit Price",
    notes:"Notes",
    view:"View"

  }
}