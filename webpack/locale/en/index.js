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
    city: "",
    postal_code: "<span>Postal Code:</span> {{client.postalCode}}",
    error_postal_code: "The postal code must be 5 digits long",
    error_email: "The e-mail is not valid",
    error_phone: "The phone number must be 10 digits long",
    
  },
  general: {
    edit: "Edit",
    name: "Name",
    last_name: "Last Name",
    address: "Address",
    city: "City",
    postal_code: "Postal Code",
    phone: "Phone number",


    required_field: "Required",
  },
  features: {
    city: false,
  }
}