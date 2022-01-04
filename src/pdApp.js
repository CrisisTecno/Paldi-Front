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
    "dataModule",

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
        templateUrl: "partials/views/access.html",
      })
      .state("access.login", {
        url: "/login",
        templateUrl: "js/controllers/login/login.html",
        controller: "LogInCtrl",
        title: "Iniciar Sesion",
        authRequired: false,
      })
      .state("access.forgot-password", {
        url: "/forgot-password",
        templateUrl: "js/controllers/login/forgot-password.html",
        controller: "LogInCtrl",
        title: "Recordar password",
        authRequired: false,
      })

      .state("console", {
        abstract: true,
        url: "/console",
        templateUrl: "partials/views/console.html",
      })
      .state("console.personal-info", {
        url: "/personal-info",
        templateUrl: "partials/views/console/personal-info.html",
        controller: "PersonalInfoCtrl",
        title: "Informacion personal",
        authRequired: true,
      })
      .state("console.change-password", {
        url: "/change-password",
        templateUrl: "js/controllers/login/change-password.html",
        controller: "ChangePasswordCtrl",
        title: "Cambiar password",
        authRequired: true,
      })
      .state("console.exchange-rate", {
        url: "/exchange-rate",
        templateUrl: "partials/views/console/exchange-rate.html",
        controller: "ExchangeRateCtrl",
        title: "Tipo de Cambio",
        authRequired: true,
      })
      // @note Controller quote-new pdApp
      .state("console.quote-new", {
        url: "/new/quote",
        templateUrl: "partials/views/console/quote-new.html",
        controller: "QuoteNewCtrl",
        title: "Cotizar",
        authRequired: true,
      })
      .state("console.quote-new-manual", {
        url: "/new/quote/manual",
        templateUrl: "partials/views/console/quote-new.html",
        controller: "QuoteNewCtrl",
        title: "Cotizar",
        authRequired: true,
      })
      .state("console.quote-edit", {
        url: "/edit/quote/:orderId",
        templateUrl: "partials/views/console/quote-new.html",
        controller: "QuoteNewCtrl",
        title: "Cotizar",
        authRequired: true,
      })
      .state("console.quote-list", {
        url: "/quote-list",
        templateUrl: "partials/views/console/quote-list.html",
        controller: "QuoteListCtrl",
        title: "Cotizaciones",
        authRequired: true,
      })

      .state("console.order-list", {
        url: "/order",
        templateUrl: "js/controllers/order/order-list.html",
        controller: "OrderListCtrl",
        title: "Ordenes",
        authRequired: true,
      })
      .state("console.order-details", {
        url: "/order/:orderId",
        templateUrl: "js/controllers/order/order-details.html",
        controller: "OrderDetailsCtrl",
        title: "Detalles de orden",
        authRequired: true,
      })

      .state("console.user-list", {
        url: "/user",
        templateUrl: "js/controllers/users/user-list.html",
        controller: "UserListCtrl",
        title: "Usuarios",
        authRequired: true,
      })
      .state("console.user-details", {
        url: "/user/:userId",
        templateUrl: "js/controllers/users/user-details.html",
        controller: "UserDetailsCtrl",
        title: "Detalles de usuario",
        authRequired: true,
      })
      .state("console.user-new", {
        url: "/new/user",
        templateUrl: "js/controllers/users/user-new.html",
        controller: "UserNewCtrl",
        title: "Nuevo usuario",
        authRequired: true,
      })

      .state("console.client-list", {
        url: "/client",
        templateUrl: "partials/views/console/client-list.html",
        controller: "ClientListCtrl",
        title: "Clientes",
        authRequired: true,
      })
      .state("console.client-details", {
        url: "/client/:clientId",
        templateUrl: "partials/views/console/client-details.html",
        controller: "ClientDetailsCtrl",
        title: "Detalles del cliente",
        authRequired: true,
      })
      .state("console.client-new", {
        url: "/new/client",
        templateUrl: "partials/views/console/client-new.html",
        controller: "ClientNewCtrl",
        title: "Nuevo cliente",
        authRequired: true,
      })
      .state("console.deadlines", {
        url: "/deadlines",
        templateUrl: "partials/views/console/deadlines.html",
        controller: "DeadlinesCtrl",
        title: "Operaciones",
        authRequired: true,
      })
      .state("console.statistics", {
        url: "/statistics",
        templateUrl: "partials/views/console/statistics.html",
        controller: "StatisticsCtrl",
        title: "Estadísticas",
        authRequired: true,
      })

      .state("console.payments", {
        url: "/payments",
        templateUrl: "partials/views/console/payments.html",
        controller: "PaymentsCtrl",
        title: "Pagos",
        authRequired: true,
      })

      .state("console.commissions", {
        url: "/commissions",
        templateUrl: "partials/views/console/commissions.html",
        controller: "CommissionsCtrl",
        title: "Comisiones",
        authRequired: true,
      })

      .state("console.bills", {
        url: "/bills",
        templateUrl: "js/controllers/costing/bills.html",
        controller: "BillsCtrl",
        title: "Facturas",
        authRequired: true,
      })

      .state("console.costing", {
        url: "/costing",
        templateUrl: "partials/views/console/costing.html",
        controller: "CostingCtrl",
        title: "Costeo",
        authRequired: true,
      })

      .state("console.movements", {
        url: "/movements",
        templateUrl: "js/controllers/costing/movements.html",
        controller: "MovementsCtrl",
        title: "Movimientos de OV",
        authRequired: true,
      })

      .state("console.products", {
        url: "/products",
        templateUrl: "partials/views/console/products.html",
        controller: "ProductsCtrl",
        title: "Productos",
        authRequired: true,
        roles: ["SUPERADMIN", "ADMIN", "MANAGER"],
      })

      .state("console.products-catalog", {
        url: "/products-catalog",
        templateUrl: "partials/views/console/products-catalog.html",
        controller: "ProductsCatalogCtrl",
        title: "Catálogo de productos",
        authRequired: true,
        roles: ["SUPERADMIN", "ADMIN", "MANAGER"],
      })

      .state("console.reports", {
        url: "/reports",
        templateUrl: "partials/views/console/reports/index.html",
        controller: "ReportsController",
        title: "Reportes",
        authRequired: true,
        roles: ["SUPERADMIN", "ADMIN"]
      })

      .state("console.product-details", {
        url: "/pisos/details/:productId",
        templateUrl: "partials/views/console/product-details.html",
        controller: "ProductDetailsCtrl",
        title: "Detalles de producto",
        authRequired: true,
      })
      .state("console.product-new", {
        url: "/product/:productType/new",
        templateUrl: "partials/views/console/product-new.html",
        controller: "ProductNewCtrl",
        title: "Agregar productos",
        authRequired: true,
      })
      .state("console.warehouses", {
        url: "/warehouses",
        templateUrl: "js/controllers/inventory/warehouse/warehouses.html",
        controller: "WarehousesCtrl",
        title: "Almacenes",
        authRequired: true,
      })

      .state("console.warehouse-details", {
        url: "/warehouse/:warehouseId",
        templateUrl: "js/controllers/inventory/warehouse/warehouse-details.html",
        controller: "WarehouseDetailsCtrl",
        title: "Detalles de almacén",
        authRequired: true,
      })

      .state("console.molding-details", {
        url: "/:plus/details/:plusId",
        templateUrl: "partials/views/console/molding-details.html",
        controller: "MoldingDetailsCtrl",
        title: "Detalles de moldura/adicional",
        authRequired: true,
      })

      .state("console.inventory-movements", {
        url: "/inventory/movements",
        templateUrl: "js/controllers/inventory/inventory-movements.html",
        controller: "InventoryMovementsCtrl",
        title: "Reporte de Movimientos",
        authRequired: true,
      })

      .state("console.inventory-report", {
        url: "/inventory/report",
        templateUrl: "js/controllers/inventory/inventory-report.html",
        controller: "InventoryReportCtrl",
        title: "Reporte de Inventarios",
        authRequired: true,
      })

      .state("console.inventory-in", {
        url: "/inventory/in",
        templateUrl: "js/controllers/inventory/inventory-in.html",
        controller: "InventoryInCtrl",
        title: "Entradas",
        authRequired: true,
      })
      .state("console.inventory-cross", {
        url: "/inventory/cross",
        templateUrl: "js/controllers/inventory/inventory-cross.html",
        controller: "InventoryCrossCtrl",
        title: "Traslados",
        authRequired: true,
      })
      .state("console.inventory-adjustments", {
        url: "/inventory/adjustments",
        templateUrl:
          "js/controllers/inventory/inventory-adjustments.html",
        controller: "InventoryAdjustmentsCtrl",
        title: "Ajustes",
        authRequired: true,
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
          //console.log(element)
          //console.log('vvvv', v)
          $scope.$apply(function () {
            //console.log(scope)
            //console.log(model)
            model.$setViewValue(element.val());
          });
        });
      }
    };
  });



export { pdApp };
