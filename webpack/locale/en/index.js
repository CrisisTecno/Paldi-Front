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
  }
}