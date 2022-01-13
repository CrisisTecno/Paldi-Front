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
  general: {
    edit: "Edit",
    cancel: "Cancel",
    save: "Save",

    add: "Add",
    loading: "Loading",
    new: "New",

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
  },
  features: {
    city: false,
  }
}