
// VALIDATE SHOULD ALWAYS HAVE AT LEAST ONE DEPENDENCY
// no validatos on base object
export const permissionsMap = {
  order: {
    installation_sheet: {
      edit: (user, order) => (
        [INSTALLATION_MANAGER, SUPER_ADMIN, SALES_MANAGER].includes(user.role)
        && (![PROGRAMMED, INSTALLED, INSTALLED_INCOMPLETE, INSTALLED_NONCONFORM].includes(order.status))
      ),
      download: (installationSheet) => !!installationSheet.pdfLink,
      view_button: function (user, order, installationSheet) {
        return this.download(installationSheet) || this.edit(user, order)
      }
    }
  }
}
// --- HELPER VARIABLES TO AVOID WRITING "" "" "" "" //

// USER_ROLES
const CONSULTANT = "CONSULTANT"
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