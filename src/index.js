import "sweetalert/dist/sweetalert.css";
import "ng-dialog/css/ngDialog.min.css";
import "ng-dialog/css/ngDialog-theme-default.min.css";
import "bootstrap";
import "angular-datatables/dist/css/angular-datatables.min.css";

// ---- ENV CHANGE ----
export { globals } from "./js/config/envs/local";
// export { globals } from "./js/config/envs/prod";
// export { globals } from "./js/config/envs/stg";

import "./pdApp";
import "./js/run/run";
import "./js/filters";
import "./js/services";
import "./js/controllers";
