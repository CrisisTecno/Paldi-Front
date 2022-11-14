import angular from "angular";
import "lkmx-inspinia/inspinia";

import "angular-ui-router";
import "angular-datatables";

import "ng-yokozuna";
import "angular-bootstrap";
import "angular-ui-scrollpoint";
import "ng-currency";
import "ngPrint";
import "ng-dialog";
import "angular-pageslide-directive";
import "angularjs-dropdown-multiselect";
import "angular-chart.js";
import "angular-sticky";
import "angularjs-google-maps/dist/angularjs-google-maps" // nomedigas que va a ser gm 

import { globals } from "./index";

import "./js/directives/load"

const pdApp = angular
  .module("paldi-app", [
    "inspinia",
    "ng-yokozuna",
    "ui.router",
    "datatables",
    "datatables.buttons",
    "ui.bootstrap",
    "ui.scrollpoint",
    "ng-currency",
    "ngPrint",
    "ngDialog",
    "pageslide-directive",
    "angularjs-dropdown-multiselect",
    "chart.js",
    "hl.sticky",
    "gm",
    // "dataModule",

    "formDirectives"
  ])
  .config(function (yokozunaConfigProvider) {
    yokozunaConfigProvider.setLoginState("access.login");
    yokozunaConfigProvider.setURL(globals.apiURL);
  })
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state("access", {
        abstract: true,
        url: "/access",
        templateUrl: "js/controllers/login/access.html",
        env:EXECUTION_ENV=="EXTERNAL"?"PLD Blinds":"Paldi"
      })
      .state("access.login", {
        url: "/login",
        templateUrl: "js/controllers/login/login.html",
        controller: "LogInCtrl",
        title: EXECUTION_ENV=="EXTERNAL"?"LogIn":"Iniciar Sesion",
        authRequired: false,
        env:EXECUTION_ENV=="EXTERNAL"?"PLD Blinds":"Paldi"
      })
      .state("access.forgot-password", {
        url: "/forgot-password",
        templateUrl: "js/controllers/login/forgot-password.html",
        controller: "LogInCtrl",
        title: EXECUTION_ENV=="EXTERNAL"?"Forgot Password":"Recordar password",
        authRequired: false,
        env:EXECUTION_ENV=="EXTERNAL"?"PLD Blinds":"Paldi"
      })
      .state("console.provider-list", {
        url: "/providers",
        templateUrl: "js/controllers/order/provider-list.html",
        controller: "ProviderListCtrl",
        title: EXECUTION_ENV=="EXTERNAL"?"Orders":"Ordenes",
        authRequired: true,
        env:EXECUTION_ENV=="EXTERNAL"?"PLD Blinds":"Paldi"
      })
      .state("console", {
        abstract: true,
        url: "/console",
        templateUrl: "js/controllers/login/console.html",
        env:EXECUTION_ENV=="EXTERNAL"?"PLD Blinds":"Paldi"
      })
      .state("console.personal-info", {
        url: "/personal-info",
        templateUrl: "partials/views/console/personal-info.html",
        controller: "PersonalInfoCtrl",
        title: EXECUTION_ENV=="EXTERNAL"?"Personal Info":"Informacion personal",
        authRequired: true,
        env:EXECUTION_ENV=="EXTERNAL"?"PLD Blinds":"Paldi"
      })
      .state("console.change-password", {
        url: "/change-password",
        templateUrl: "js/controllers/login/change-password.html",
        controller: "ChangePasswordCtrl",
        title: EXECUTION_ENV=="EXTERNAL"?"Change Password":"Cambiar password",
        authRequired: true,
        env:EXECUTION_ENV=="EXTERNAL"?"PLD Blinds":"Paldi"
      })
      .state("console.exchange-rate", {
        url: "/exchange-rate",
        templateUrl: "partials/views/console/exchange-rate.html",
        controller: "ExchangeRateCtrl",
        title: EXECUTION_ENV=="EXTERNAL"?"Exchange Rate":"Tipo de Cambio",
        authRequired: true,
        env:EXECUTION_ENV=="EXTERNAL"?"PLD Blinds":"Paldi"
      })
      // @note Controller quote-new pdApp
      .state("console.quote-new", {
        url: "/new/quote",
        templateUrl: "js/controllers/order/quote-new.html",
        controller: "QuoteNewCtrl",
        title: EXECUTION_ENV=="EXTERNAL"?"Quote":"Cotizar",
        authRequired: true,
        env:EXECUTION_ENV=="EXTERNAL"?"PLD Blinds":"Paldi"
      })
      .state("console.quote-new-manual", {
        url: "/new/quote/manual",
        templateUrl: "js/controllers/order/quote-new.html",
        controller: "QuoteNewCtrl",
        title: EXECUTION_ENV=="EXTERNAL"?"Quote":"Cotizar",
        authRequired: true,
        env:EXECUTION_ENV=="EXTERNAL"?"PLD Blinds":"Paldi"
      })
      .state("console.quote-edit", {
        url: "/edit/quote/:orderId",
        templateUrl: "js/controllers/order/quote-new.html",
        controller: "QuoteNewCtrl",
        title: EXECUTION_ENV=="EXTERNAL"?"Quote":"Cotizar",
        authRequired: true,
        env:EXECUTION_ENV=="EXTERNAL"?"PLD Blinds":"Paldi"
      })
      .state("console.quote-list", {
        url: "/quote-list",
        templateUrl: "js/controllers/order/quote-list.html",
        controller: "QuoteListCtrl",
        title: EXECUTION_ENV=="EXTERNAL"?"Quotes":"Cotizaciones",
        authRequired: true,
        env:EXECUTION_ENV=="EXTERNAL"?"PLD Blinds":"Paldi"
      })

      .state("console.order-list", {
        url: "/order",
        templateUrl: "js/controllers/order/order-list.html",
        controller: "OrderListCtrl",
        title: EXECUTION_ENV=="EXTERNAL"?"Orders":"Ordenes",
        authRequired: true,
        env:EXECUTION_ENV=="EXTERNAL"?"PLD Blinds":"Paldi"
      })
      .state("console.order-details", {
        url: "/order/:orderId",
        templateUrl: "js/controllers/order/order-details.html",
        controller: "OrderDetailsCtrl",
        title: EXECUTION_ENV=="EXTERNAL"?"Order Details":"Detalles de orden",
        authRequired: true,
        env:EXECUTION_ENV=="EXTERNAL"?"PLD Blinds":"Paldi"
      })
      .state("console.provider-order-details", {
        url: "/order/provider/:orderId",
        templateUrl: "js/controllers/order/provider-order-details.html",
        controller: "ProviderOrderDetailsCtrl",
        title: EXECUTION_ENV=="EXTERNAL"?"Order Details":"Detalles de orden",
        authRequired: true,
        env:EXECUTION_ENV=="EXTERNAL"?"PLD Blinds":"Paldi"
      })

      .state("console.user-list", {
        url: "/user",
        templateUrl: "js/controllers/users/user-list.html",
        controller: "UserListCtrl",
        title: EXECUTION_ENV=="EXTERNAL"?"Users":"Usuarios",
        authRequired: true,
        env:EXECUTION_ENV=="EXTERNAL"?"PLD Blinds":"Paldi"

      })
      .state("console.resource-list", {
        url: "/resource",
        templateUrl: "partials/views/console/resource-list.html",
        controller: "ResourcesCtrl",
        title: EXECUTION_ENV=="EXTERNAL"?"Resources":"Recursos",
        authRequired: true,
        env:EXECUTION_ENV=="EXTERNAL"?"PLD Blinds":"Paldi"
      })
      .state("console.calendar-install", {
        url: "/installCalendar",
        templateUrl: "js/controllers/order/installation-calendar.html",
        controller: "InstallCalendarCtrl",
        title: EXECUTION_ENV=="EXTERNAL"?"Installs":"Instalaciones",
        authRequired: true,
        env:EXECUTION_ENV=="EXTERNAL"?"PLD Blinds":"Paldi"
      })
      .state("console.user-details", {
        url: "/user/:userId",
        templateUrl: "js/controllers/users/user-details.html",
        controller: "UserDetailsCtrl",
        title: EXECUTION_ENV=="EXTERNAL"?"User Details":"Detalles de usuario",
        authRequired: true,
        env:EXECUTION_ENV=="EXTERNAL"?"PLD Blinds":"Paldi"
      })
      .state("console.user-new", {
        url: "/new/user",
        templateUrl: "js/controllers/users/user-new.html",
        controller: "UserNewCtrl",
        title: "Nuevo usuario",
        authRequired: true,
        env:EXECUTION_ENV=="EXTERNAL"?"PLD Blinds":"Paldi"
      })

      .state("console.client-list", {
        url: "/client",
        templateUrl: "js/controllers/clients/client-list.html",
        controller: "ClientListCtrl",
        title: EXECUTION_ENV=="EXTERNAL"?"Clients":"Clientes",
        authRequired: true,
        env:EXECUTION_ENV=="EXTERNAL"?"PLD Blinds":"Paldi"
      })
      .state("console.client-details", {
        url: "/client/:clientId",
        templateUrl: "js/controllers/clients/client-details.html",
        controller: "ClientDetailsCtrl",
        title: EXECUTION_ENV=="EXTERNAL"?"Client Details":"Detalles del cliente",
        authRequired: true,
        env:EXECUTION_ENV=="EXTERNAL"?"PLD Blinds":"Paldi"
      })
      .state("console.client-new", {
        url: "/new/client",
        templateUrl: "js/controllers/clients/client-new.html",
        controller: "ClientNewCtrl",
        title: EXECUTION_ENV=="EXTERNAL"?"New Client":"Nuevo cliente",
        authRequired: true,
        env:EXECUTION_ENV=="EXTERNAL"?"PLD Blinds":"Paldi"
      })
      .state("console.deadlines", {
        url: "/deadlines",
        templateUrl: "partials/views/console/deadlines.html",
        controller: "DeadlinesCtrl",
        title: "Operaciones",
        authRequired: true,
        env:EXECUTION_ENV=="EXTERNAL"?"PLD Blinds":"Paldi"
      })
      .state("console.statistics", {
        url: "/statistics",
        templateUrl: "partials/views/console/statistics.html",
        controller: "StatisticsCtrl",
        title: "Estadísticas",
        authRequired: true,
        env:EXECUTION_ENV=="EXTERNAL"?"PLD Blinds":"Paldi"
      })

      .state("console.payments", {
        url: "/payments",
        templateUrl: "partials/views/console/payments.html",
        controller: "PaymentsCtrl",
        title: "Pagos",
        authRequired: true,
        env:EXECUTION_ENV=="EXTERNAL"?"PLD Blinds":"Paldi"
      })

      .state("console.commissions", {
        url: "/commissions",
        templateUrl: "partials/views/console/commissions.html",
        controller: "CommissionsCtrl",
        title: "Comisiones",
        authRequired: true,
        env:EXECUTION_ENV=="EXTERNAL"?"PLD Blinds":"Paldi"
      })

      .state("console.bills", {
        url: "/bills",
        templateUrl: "js/controllers/costing/bills.html",
        controller: "BillsCtrl",
        title: "Facturas",
        authRequired: true,
        env:EXECUTION_ENV=="EXTERNAL"?"PLD Blinds":"Paldi"
      })

      .state("console.costing", {
        url: "/costing",
        templateUrl: "partials/views/console/costing.html",
        controller: "CostingCtrl",
        title: "Costeo",
        authRequired: true,
        env:EXECUTION_ENV=="EXTERNAL"?"PLD Blinds":"Paldi"
      })

      .state("console.movements", {
        url: "/movements",
        templateUrl: "js/controllers/costing/movements.html",
        controller: "MovementsCtrl",
        title: "Movimientos de OV",
        authRequired: true,
        env:EXECUTION_ENV=="EXTERNAL"?"PLD Blinds":"Paldi"
      })



      .state("console.products-catalog", {
        url: "/products-catalog",
        templateUrl: "partials/views/console/products-catalog.html",
        controller: "ProductsCatalogCtrl",
        title: "Catálogo de productos",
        authRequired: true,
        roles: ["SUPERADMIN", "ADMIN", "MANAGER"],
        env:EXECUTION_ENV=="EXTERNAL"?"PLD Blinds":"Paldi"
      })

      .state("console.reports", {
        url: "/reports",
        templateUrl: "js/controllers/reports/reports.html",
        controller: "ReportsController",
        title: "Reportes",
        authRequired: true,
        roles: ["SUPERADMIN", "ADMIN"],
        env:EXECUTION_ENV=="EXTERNAL"?"PLD Blinds":"Paldi"
      })



      .state("console.warehouses", {
        url: "/warehouses",
        templateUrl: "js/controllers/inventory/warehouse/warehouses.html",
        controller: "WarehousesCtrl",
        title: "Almacenes",
        authRequired: true,
        env:EXECUTION_ENV=="EXTERNAL"?"PLD Blinds":"Paldi"
      })

      .state("console.warehouse-details", {
        url: "/warehouse/:warehouseId",
        templateUrl: "js/controllers/inventory/warehouse/warehouse-details.html",
        controller: "WarehouseDetailsCtrl",
        title: "Detalles de almacén",
        authRequired: true,
        env:EXECUTION_ENV=="EXTERNAL"?"PLD Blinds":"Paldi"
      })

      .state("console.molding-details", {
        url: "/:plus/details/:plusId",
        templateUrl: "partials/views/console/molding-details.html",
        controller: "MoldingDetailsCtrl",
        title: "Detalles de moldura/adicional",
        authRequired: true,
        env:EXECUTION_ENV=="EXTERNAL"?"PLD Blinds":"Paldi"
      })

      .state("console.inventory-movements", {
        url: "/inventory/movements",
        templateUrl: "js/controllers/inventory/inventory-movements.html",
        controller: "InventoryMovementsCtrl",
        title: "Reporte de Movimientos",
        authRequired: true,
        env:EXECUTION_ENV=="EXTERNAL"?"PLD Blinds":"Paldi"
      })

      .state("console.inventory-report", {
        url: "/inventory/report",
        templateUrl: "js/controllers/inventory/inventory-report.html",
        controller: "InventoryReportCtrl",
        title: "Reporte de Inventarios",
        authRequired: true,
        env:EXECUTION_ENV=="EXTERNAL"?"PLD Blinds":"Paldi"
      })

      .state("console.inventory-in", {
        url: "/inventory/in",
        templateUrl: "js/controllers/inventory/inventory-in.html",
        controller: "InventoryInCtrl",
        title: "Entradas",
        authRequired: true,
        env:EXECUTION_ENV=="EXTERNAL"?"PLD Blinds":"Paldi"
      })
      .state("console.inventory-cross", {
        url: "/inventory/cross",
        templateUrl: "js/controllers/inventory/inventory-cross.html",
        controller: "InventoryCrossCtrl",
        title: "Traslados",
        authRequired: true,
        env:EXECUTION_ENV=="EXTERNAL"?"PLD Blinds":"Paldi",
      })
      .state("console.inventory-adjustments", {
        url: "/inventory/adjustments",
        templateUrl:
          "js/controllers/inventory/inventory-adjustments.html",
        controller: "InventoryAdjustmentsCtrl",
        title: "Ajustes",
        authRequired: true,
        env:EXECUTION_ENV=="EXTERNAL"?"PLD Blinds":"Paldi",
      });

    $urlRouterProvider.otherwise("/access/login");
  })
  .directive('googleplace', function () {
    return {
      require: 'ngModel',
      link: function ($scope, element, attrs, model) {
        var options = {
          types: [],
          bounds: {
            north: 32.5149 + 1,
            south: 32.5149 - 1,
            east: 117.0382 - 1,
            west: 117.0382 + 1
          },
          strictBounds: true,
          componentRestrictions: {
            country: "MX",
          }
        };


        $scope.gPlace = new google.maps.places.Autocomplete(element[0], options);

        google.maps.event.addListener($scope.gPlace, 'place_changed', function (v) {
          // console.log(element)
          // console.log('vvvv', v)
          $scope.$apply(function () {
            // console.log(scope)
            // console.log(model)
            model.$setViewValue(element.val());
          });
        });
      }
    };
  });



export { pdApp };
