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
    
    erase:"Erase",

    filter:"Filter",
    clean:"Clear",


    add: "Add",
    loading: "Loading",
    new: "New",
    clear: "Clear",

    no_data: "No data to show",

    name: "Name",
    last_name: "Last Name",
    address: "Address",
    city: "City",
    postal_code: "Postal Code",
    email: "E-Mail",
    phone: "Phone number",
    type: "Type", 
    all: "All",

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


  }
}