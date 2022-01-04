
// VALIDATE SHOULD ALWAYS HAVE AT LEAST ONE DEPENDENCY
// no validatos on base object
export const permissionsMap = {
  order: {
    installation_sheet: {
      download: function (installationSheet) {
        return installationSheet.pdfLink ? true : false
      },
      edit_base: function(user, order) {
        return [
          INSTALLATION_MANAGER, 
          SUPER_ADMIN, 
          SALES_MANAGER].includes(user.role)
          && (![PROGRAMMED, INSTALLED, INSTALLED_INCOMPLETE, INSTALLED_NONCONFORM, FINISHED].includes(order.status))
      },
      edit: function (user, order, installationSheet) {
        return this.edit_base(user, order)
          && this.download(installationSheet)
      },
      create: function (user, order, installationSheet) {
        return (!this.download(installationSheet)) && this.edit_base(user, order)
          && ![QUOTE, PENDING, REJECTED, DELETED].includes(order.status)
      },
      view_button: function (user, order, installationSheet) {
        return this.create(user, order, installationSheet)
          || this.download(installationSheet)
          || this.edit(user, order, installationSheet)
      },
    }
  }
}
// --- HELPER VARIABLES TO AVOID WRITING "" "" "" "" //

// USER_ROLES
const CONSULTANT = "CONSULTANT"
const CONSULTANT = "EXTERNAL_CONSULTANT"
const MANAGER = "MANAGER"
const SALES_MANAGER = "SALES_MANAGER"
const INSTALLATION_MANAGER = "INSTALLATION_MANAGER"
const BUYER = "BUYER"
const ADMIN = "ADMIN"
const SUPER_ADMIN = "SUPERADMIN"

// ORDER_STATUS
const QUOTE = "QUOTE"
const PENDING = "PENDING"
const REJECTED = "REJECTED"
const LINE = "LINE"
const BACKORDER = "BACKORDER"
const PRODUCTION = "PRODUCTION"
const TRANSIT = "TRANSIT"
const FINISHED = "FINISHED"
const INSTALLED = "INSTALLED"
const INSTALLED_INCOMPLETE = "INSTALLED_INCOMPLETE"
const INSTALLED_NONCONFORM = "INSTALLED_NONCONFORM"
const PROGRAMMED = "PROGRAMMED"
const CANCELED = "CANCELED"
const ORDER_CANCELED = "ORDER_CANCELED"
const DELETED = "DELETED"

// CURRENCY
const PESOS = "PESOS"
const DOLLARS = "DOLLARS"