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
    accept:"Accept",
    change:"Change",
    
    erase:"Erase",

    filter:"Filter",
    clean:"Clear",


    add: "Add",
    loading: "Loading",
    new: "New",
    clear: "Clear",

    previous:"Previous",
    next:"Next",

    no_comment:"No comments",
    no_data: "No data to show",
    product_not_found:"Product not found",

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
  },
  console:{
    update_provider: "Update Supplier",
    provider_id: "Supplier ID",

    observations:"Observations",

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
			<th colspan="2">CANCElED</th>
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
      <th colspan="3">Recomendación</th>
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
    min_value:"The Minimum value is 0%"

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
  }
}