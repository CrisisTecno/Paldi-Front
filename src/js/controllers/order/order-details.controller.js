import { pdApp } from "../index";

import { getConfirmPayment } from "./order-details/confirm-payment";
import { showSwal } from "../../utils/swal/show";
import { merge, mergeDeep, moveToScope } from "../../utils/merge";
import { showCreateInstallationSheetDialog } from "./order-details/installation-sheet/create";

pdApp.controller(
  "OrderDetailsCtrl",
  function (
    $rootScope,
    $scope,
    $state,
    $stateParams,
    $timeout,
    $uibModal,
    DTOptionsBuilder,
    DTColumnDefBuilder,
    paldiService,
    colorPriceService,
    permissionsHelper,
    ngDialog,
    orderService,
    permissionService
  ) {
    var loadOrder = function () {
      var id = $stateParams.orderId;
      $scope.step = "loading";
      $scope.showNotes = false;
      $scope.newStatus = '';
      $scope.productNotes = '';
      $scope.productsSorted = [];
      $scope.productsSorted.push({ type: "Balance", products: [] });
      $scope.productsSorted.push({ type: "Shutter", products: [] });
      $scope.productsSorted.push({ type: "Toldo", products: [] });
      $scope.productsSorted.push({ type: "Enrollable", products: [] });
      $scope.productsSorted.push({ type: "Filtrasol", products: [] });
      $scope.productsSorted.push({ type: "Persiana o Filtrasol", products: [] });
      $scope.productsSorted.push({ type: "Piso", products: [] });
      $scope.productsSorted.push({ type: "Cortina", products: [] });
      $scope.productsSorted.push({ type: "Custom", products: [] });
      $scope.suborders = [];
      $scope.limitDays = 20;
      $scope.maxDate;

      paldiService.orders.get(id).then(async function (order) {
        $scope.order = order;
        $scope.quoteStatus = order.quoteStatus;
        $scope.quoteSubStatus = order.quoteSubStatus;
        $scope.products = order.products;
        $scope.isSuborder = false;
        $scope.isMaster = false;

        if (order.type === 'Mixta') {
          $scope.isMaster = true;
          (order.mixedLabel !== null) ? $scope.mixedLabel = order.mixedLabel : $scope.mixedLabel = "Mixta";
          paldiService.orders.getByOrderParent($scope.order.id).then(function (suborders) {
            suborders.forEach(function (suborder) {
              $scope.suborders.push(suborder);
              if (suborder.products) {
                suborder.products.forEach(function (product) {
                  orderProductsByType(product);
                })
              }

            })

          })
        } else {
          if ($scope.products) {
            $scope.products.forEach(function (product) {
              orderProductsByType(product);
            })
          }
        }
        // console.log(order)

        if (order.orderParent) {
          $scope.isSuborder = true;
        }

        $scope.cycleStartDate = order.cycleStartDate ? moment(order.cycleStartDate) : null;
        $scope.cycleFinishDate = order.cycleFinishDate ? moment(order.cycleFinishDate) : null;
        $scope.commitmentDate = order.commitmentDate ? moment(order.commitmentDate) : null;
        $scope.productionStartDate = order.productionDate ? moment(order.productionDate) : null;
        $scope.productionFinishDate = order.productionFinishDate ? moment(order.productionFinishDate) : null;
        $scope.productionLimitDate = order.productionLimitDate ? moment(order.productionLimitDate) : null;
        $scope.transitStartDate = order.transitDate ? moment(order.transitDate) : null;
        $scope.transitFinishDate = order.transitFinishDate ? moment(order.transitFinishDate) : null;
        $scope.transitLimitDate = order.transitLimitDate ? moment(order.transitLimitDate) : null;
        $scope.currentDate = moment();
        $scope.cycleDays = getCycleDays($scope.currentDate, $scope.cycleStartDate, $scope.cycleFinishDate);
        $scope.dpfcStatus = '';
        $scope.dpfcTotalStatus = '';
        $scope.dpfcTotalDays = 0;
        $scope.dpfcDays = getDPFCDays($scope.cycleStartDate, $scope.commitmentDate, $scope.cycleFinishDate);
        $scope.productionStatus = '';
        $scope.productionTotalStatus = '';
        $scope.productionTotalDays = '-';
        $scope.productionDays = getProductionDays($scope.productionStartDate, $scope.productionLimitDate, $scope.productionFinishDate);

        $scope.transitDays = getTransitDays($scope.currentDate, $scope.transitStartDate, $scope.transitFinishDate, $scope.transitLimitDate);


        $scope.client = order.client;
        $scope.step = order ? "loaded" : "empty";
        $scope.productType = order.type;
        $scope.order.type = $scope.productType;
        $timeout(function () {
          $scope.loadAdditionals();
        }, 200)

        $scope.order.pdfLink = paldiService.orders.getPdfLink(order);
        $scope.order.pdfOrderLink = paldiService.orders.getPdfOrderLink(order);
        if (order.payments) {
          $scope.order.payments = paldiService.orders.getReceiptLinks(order);
        }
        paldiService.orders.getLog(order.id).then(function (log) {
          $scope.order.events = log;
        });
        $scope.order.installationPlusTotal = order.installationPlusTotal ? order.installationPlusTotal : 0;

        const res = (await paldiService.orders.getPdfInstallationSheetLink(order))
        $scope.order.installationSheetPdfLink = res
        // document.getElementById('download_installation_sheet').href = $scope.installationSheet.pdfLink
        // $("#download_installation_sheet").attr('href', $scope.installationSheet.pdfLink)


        // console.log($scope.order.pdfInstallationSheetLink)
        $scope.perms = permissionService.setDependencies([
          ["user", $rootScope.currentUser],
          ["order", $scope.order],
          ["installationSheet", {
            pdfLink: res,
          }],
        ]);

        // console.log($scope.perms)
        $timeout(async function () {
          $scope.permissions = permissionsHelper.get(order, $rootScope.currentUser);
          $scope.canManagePayments = $scope.currentUser.role != 'MANAGER' && $scope.currentUser.role != 'INSTALLATION_MANAGER';
          // $scope.canManagePayments = [
          //   "MANAGER",
          //   "INSTALLATION_MANAGER",
          // // ].includes($scope.currentUser.role);
          // console.log('FINISHED LOADING SOMETHING')
          // console.log($scope)
        });

      }, function (error) {
        $scope.step = "empty";
        // console.log(error);
      });
    }

    $scope.loadOrder = loadOrder;
    $scope.paldiService = paldiService;
    $scope.ngDialog = ngDialog;

    $scope.showLog = false;
    $scope.isPaying = false;
    $scope.isCancellingPayment = false;
    loadOrder();

    $scope.sendToClient = function (order) {
      var objName;
      if (order.status == "QUOTE") {
        objName = "cotización";
      } else {
        objName = "orden";
      }

      swal(
        {
          title:
            "¿Seguro que deseas enviar la " +
            objName +
            " al cliente?",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Enviar",
          cancelButtonText: "Cancelar",
          closeOnConfirm: true,
          closeOnCancel: false,
        },
        function (isConfirm) {
          if (isConfirm) {
            var id = $stateParams.orderId;
            paldiService.orders
              .sendOrder(id)
              .then(function (order) {
                swal({
                  title: "Enviado",
                  text: "Se envió la " + objName,
                  type: "success",
                  confirmButtonText: "Aceptar",
                });
              });
          } else {
            swal({
              title: "Cancelado",
              type: "error",
              confirmButtonText: "Aceptar",
            });
          }
        }
      );
    };

    $scope.sendToSpecialEmail = function (order) {

      var objName;
      if (order.status == "QUOTE") {
        objName = "cotización";
      } else {
        objName = "orden";
      }
      // console.log(order)

      const getProviderEmail = (type) => {
        const emails = {
          "Persianas": "atencion.premium@gabin.com.mx",
          "Enrollable": "atencion.premium@gabin.com.mx",
          "Filtrasol": "gabriela@farz.com.mx",
        }
        if (!Object.keys(emails).includes(type))
          return "Correo"
        return emails[type]
      }
      // console.log("------ PROVIDER EMAIL")
      // console.log(order.type)
      // console.log(getProviderEmail(order.products[0].productType))
      
      swal({
        title: "¿Seguro que desea enviar la " + objName + " al correo?",
        type: "input",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Enviar",
        cancelButtonText: "Cancelar",
        closeOnConfirm: true,
        closeOnCancel: true,
        inputValue: getProviderEmail(order.products[0].productType)
      },
        function (value) {
          if (!value)
            return
          // console.log(value)
          if (value.trim() === "") {
            swal.showInputError("Es necesario escribir una dirección de correo");
            return false
          }
          var id = $stateParams.orderId;
          paldiService.orders.sendOrderTo(id, value).then(function (order) {
            swal({
              title: "Enviado",
              text: "Se envió la " + objName,
              type: "success",
              confirmButtonText: "Aceptar"
            });
          });
        });
    };


    $scope.createInstallationSheet = () => {
      showCreateInstallationSheetDialog($scope, () => {
        showSwal("messages.installation_sheet.created");
      });
    };

    $scope.editInstallationSheet = () => {
      showCreateInstallationSheetDialog(
        $scope,
        () => {
          showSwal("messages.installation_sheet.edited");
        },
        "edit"
      );
    };

    var createSuborders = function (model, order) {
      paldiService.orders.getByOrderParent($scope.order.id).then(function (suborders) {
        var suborderNo = 0;
        suborders.forEach(function (suborder) {
          if (suborder.products && suborder.products.length > 0) {
            suborderNo++;
            var updatedOrder = suborder;
            updatedOrder.suborderNo = suborderNo;
            updatedOrder.orderNo = order.orderNo;

            paldiService.orders.updateStatus(updatedOrder, 'LINE').then(function (order) {
              $scope.isPaying = false;

            }, function (error) {
              console.error(error);
              $scope.isPaying = false;
              if (error.data.exception == 'io.lkmx.paldi.quote.components.error.InventoryNotEnoughException') {
                swal({ title: 'No hay inventario suficiente', type: 'error', confirmButtonText: 'Aceptar' });
              } else {
                swal({ title: 'Ocurrió un error', type: 'error', confirmButtonText: 'Aceptar' });
                loadOrder();
              }

            });

          } else {
            paldiService.orders.deleteSuborder($scope.order.id, suborder.type).then(function (order) {
              $scope.isPaying = false;

            }, function (error) {
              console.error(error);
              $scope.isPaying = false;
              swal({ title: 'Ocurrió un error', type: 'error', confirmButtonText: 'Aceptar' });
              loadOrder();
            });
          }
          // console.log(suborder)
        })

      })
    };
    $scope.createSuborders = createSuborders;

    //========================= PAYMENTS ===========================

    $scope.paymentDialog = function (paymentType) {
      $scope.paymentType = paymentType;

      $scope.minPayment =
        paymentType == "payment"
          ? 0.01
          : parseFloat($scope.order.total / 2).toFixed(2);
      $scope.maxPayment = parseFloat($scope.order.balance).toFixed(2);

      $scope.payment = {
        min: $scope.minPayment,
        max: $scope.maxPayment,
        exchangeRate: 1,
        isDiscountPayment: false,
        sendToClient: false,
      };
      $scope.dialog = ngDialog.open({
        template: "partials/views/console/payment.html",
        scope: $scope,
        showClose: false,
      });
    };

    $scope.pay = function (form, model) {
      const confirmPayment = getConfirmPayment(this, $scope, model);
      if (form.$valid) {
        $scope.dialog.close();
        confirmPayment(model);
      } else {
        form.$validated = true;
      }
    };

    $scope.currencyChange = function (model) {
      model.exchangeRate = 1;
      model.advance = 0;
      $scope.exchangeRateChange(model);
    };

    $scope.exchangeRateChange = function (model) {
      model.min =
        $scope.minPayment > 0.01
          ? parseFloat(
            $scope.minPayment / model.exchangeRate
          ).toFixed(2)
          : $scope.minPayment;
      model.max = parseFloat(
        $scope.maxPayment / model.exchangeRate
      ).toFixed(2);
      model.advance = 0;
    };

    //========================= STATUS ===========================

    $scope.sendToOrderDialog = function () {
      if (!$scope.order.user.warehouse) {
        swal({
          title: "El vendedor no está asignado a un almacén",
          type: "error",
          confirmButtonText: "Continuar",
        });
      } else {
        $scope.dialog = ngDialog.open({
          scope: $scope,
          template: "js/controllers/order/order-send.html",
          // template: "partials/views/console/order-send.html",
          showClose: false,
        });
      }
    };

    $scope.updateProviderDialog = function () {
      $scope.providerId = $scope.order.providerId;
      $scope.dialog = ngDialog.open({
        scope: $scope,
        template: "partials/views/console/update-provider.html",
        showClose: false,
      });
    };

    $scope.updateProvider = function (form, providerId) {
      if (form.$valid) {
        $scope.dialog.close();
        paldiService.orders
          .updateProvider($scope.order, providerId)
          .then(function (order) {
            swal({
              title: "Proveedor Actualizado",
              type: "success",
              confirmButtonText: "Aceptar",
            });
            loadOrder();
          });
      } else {
        form.$validated = true;
      }
    };

    $scope.changeQuoteStatusDialog = function (quoteStatus) {
      swal(
        {
          title:
            "¿Cambiar estado de la cotización a " +
            quoteStatus +
            "?",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Aceptar",
          cancelButtonText: "Cancelar",
          closeOnConfirm: true,
          closeOnCancel: false,
        },
        function (isConfirm) {
          if (isConfirm) {
            changeQuoteStatus();
          } else {
            swal({
              title: "Cancelado",
              type: "error",
              confirmButtonText: "Aceptar",
            });
          }
        }
      );
    };

    $scope.changeStatusDialog = function (status) {
      if (status && status == "LINE" && !$scope.order.user.warehouse) {
        swal({
          title: "El vendedor no está asignado a un almacén",
          type: "error",
          confirmButtonText: "Continuar",
        });
      } else if (status) {
        swal(
          {
            title:
              "¿Cambiar estado de la orden a " +
              $scope.pretty("orderStatus", status) +
              "?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Aceptar",
            cancelButtonText: "Cancelar",
            closeOnConfirm: true,
            closeOnCancel: false,
          },
          function (isConfirm) {
            if (isConfirm) {
              $scope.newStatus = status;
              //	// console.log($scope.newStatus);
              if (status === "PENDING") {
                showCreateInstallationSheetDialog($scope, () =>
                  showSwal(
                    "messages.installation_sheet.created",
                    () => $scope.statusNotesDialog()
                  )
                );
                return;
              }
              if (
                $scope.newStatus != "TRANSIT" &&
                $scope.newStatus != "PRODUCTION"
              ) {
                $scope.statusNotesDialog();
              } else {
                var statusToLimit =
                  $scope.newStatus === "PRODUCTION"
                    ? "production"
                    : "transit";
                setTimeout(function () {
                  $scope.limitDays = 0;
                  paldiService.orders
                    .getLimitDays(
                      $stateParams.orderId,
                      statusToLimit
                    )
                    .then(function (limitDays) {
                      if (limitDays) {
                        $scope.limitDays = limitDays;
                      }

                      var maxDate = getMaxDate(
                        $scope.limitDays
                      );

                      $scope.dateOptions.maxDate =
                        new Date(maxDate);
                      $scope.changeStatus();
                    });
                }, 200);
              }
            } else {
              swal({
                title: "Cancelado",
                type: "error",
                confirmButtonText: "Aceptar",
              });
            }
          }
        );
      } else {
        $scope.changePermissions =
          permissionsHelper.getChangePermissions($scope.order);
        $scope.dialog = ngDialog.open({
          scope: $scope,
          template: "partials/views/console/change-status.html",
          showClose: false,
        });
      }
    };

    $scope.changeOrderStatus = function (form, status) {
      if (form.$valid) {
        $scope.dialog.close();
        paldiService.orders
          .updateRetroStatus($scope.order, status)
          .then(function (order) {
            swal({
              title: "Estado Actualizado",
              type: "success",
              confirmButtonText: "Aceptar",
            });
            loadOrder();
            if (order.orderParent !== null) {
              $scope.statusOrderMaster(
                order.orderParent,
                order.status,
                true
              );
            }
          });
      } else {
        form.$validated = true;
      }
    };

    var changeQuoteStatus = function () {
      if (
        $scope.quoteStatus != "Venta Perdida" &&
        $scope.quoteSubStatus
      ) {
        $scope.quoteSubStatus = null;
      }

      if (
        $scope.quoteStatus != "Venta Perdida" ||
        $scope.quoteSubStatus
      ) {
        paldiService.orders
          .setQuoteStatus(
            $scope.order.id,
            $scope.quoteStatus,
            $scope.quoteSubStatus
          )
          .then(function (order) {
            loadOrder();
          });
      }
    };

    $scope.statusNotesDialog = function () {
      $scope.dialog = ngDialog.open({
        template: "partials/views/console/status-notes.html",
        scope: $scope,
        showClose: false,
      });
    };

    $scope.changeStatus = function (form, model) {
      if (form && form.$valid) {
        $scope.dialog.close();
        var updatedOrder = $scope.order;
        updatedOrder.statusNotes = model;

        paldiService.orders
          .updateStatus(updatedOrder, $scope.newStatus)
          .then(
            function (order) {
              swal({
                title:
                  "Estado: " +
                  $scope.pretty(
                    "orderStatus",
                    $scope.newStatus
                  ),
                text: "Estado de orden cambiado",
                type: "success",
                confirmButtonText: "Aceptar",
              });

              if (
                order.type === "Mixta" &&
                $scope.newStatus === "LINE"
              ) {
                createSuborders(model, order);
              }

              if ($scope.newStatus === "CANCELED") {
                $state.go("console.quote-list");
              } else {
                loadOrder();
              }

              if (order.orderParent !== null) {
                $scope.statusOrderMaster(
                  order.orderParent,
                  order.status,
                  false
                );
              }
            },
            function (error) {
              // console.log(error);

              if (
                error.data.exception ==
                "io.lkmx.paldi.quote.components.error.InventoryNotEnoughException"
              ) {
                swal({
                  title: "No hay inventario suficiente",
                  type: "error",
                  confirmButtonText: "Aceptar",
                });
              } else {
                swal({
                  title: "Ocurrió un error",
                  type: "error",
                  confirmButtonText: "Aceptar",
                });
                loadOrder();
              }
            }
          );
      } else if ($scope.newStatus == "TRANSIT") {
        $scope.dateDialog("arrival");
      } else if ($scope.newStatus == "PRODUCTION") {
        $scope.dateDialog("endProduction");
      }
    };

    $scope.confirmTransit = function (model) {
      $scope.dialog.close();
      var updatedOrder = $scope.order;
      updatedOrder.statusNotes = model.notes;
      paldiService.orders
        .updateStatus(updatedOrder, "TRANSIT")
        .then(function (order) {
          paldiService.orders
            .setDate(
              updatedOrder.id,
              $scope.dateType,
              $scope.date,
              model.notes
            )
            .then(
              function () {
                swal({
                  title: "Orden en Tránsito",
                  text: "Se marcó la orden como en tránsito",
                  type: "success",
                  confirmButtonText: "Aceptar",
                });
                loadOrder();
                if (order.orderParent !== null) {
                  $scope.statusOrderMaster(
                    order.orderParent,
                    order.status,
                    false
                  );
                }
              },
              function (error) {
                swal({
                  title: "Ocurrió un error",
                  type: "error",
                  confirmButtonText: "Aceptar",
                });
                loadOrder();
              }
            );
        });
      $scope.dateModel = {};
    };

    $scope.confirmProduction = function (model, form) {
      form.$validated = true;
      if (model.providerId && model.notes) {
        $scope.dialog.close();
        var updatedOrder = $scope.order;
        updatedOrder.statusNotes = model.notes;
        updatedOrder.providerId = model.providerId;
        paldiService.orders
          .updateStatus(updatedOrder, "PRODUCTION")
          .then(function (order) {
            paldiService.orders
              .setDate(
                updatedOrder.id,
                $scope.dateType,
                $scope.date,
                model.notes
              )
              .then(
                function () {
                  swal({
                    title: "Orden en Producción",
                    text: "Se marcó la orden como en producción",
                    type: "success",
                    confirmButtonText: "Aceptar",
                  });
                  loadOrder();

                  if (order.orderParent !== null) {
                    $scope.statusOrderMaster(
                      order.orderParent,
                      order.status,
                      false
                    );
                  }
                },
                function (error) {
                  swal({
                    title: "Ocurrió un error",
                    type: "error",
                    confirmButtonText: "Aceptar",
                  });
                  loadOrder();
                }
              );
          });
        $scope.dateModel = {};
      }
    };

    $scope.statusOrderMaster = function (
      orderParent,
      suborderStatus,
      retroStatus
    ) {
      var status = {
        LINE: 1,
        BACKORDER: 2,
        PRODUCTION: 3,
        TRANSIT: 4,
        FINISHED: 5,
        PROGRAMMED: 6,
        INSTALLED_INCOMPLETE: 7,
        INSTALLED_NONCONFORM: 8,
        INSTALLED: 9,
      };

      var currentStatus = suborderStatus;
      paldiService.orders
        .getByOrderParent(orderParent.id)
        .then(function (suborders) {
          suborders.forEach(function (suborder) {
            if (status[currentStatus] > status[suborder.status]) {
              currentStatus = suborder.status;
            }
          });

          if (currentStatus !== orderParent.status) {
            if (!retroStatus) {
              var updatedOrder = orderParent;
              updatedOrder.statusNotes = "";
              updatedOrder.providerId = "";
              paldiService.orders
                .updateStatus(updatedOrder, currentStatus)
                .then(function (order) { });
            } else {
              paldiService.orders.updateRetroStatus(
                orderParent,
                currentStatus
              );
            }
          }
        });
    };

    //=================================================================

    $scope.editOrder = function () {
      $state.go("console.quote-edit", { orderId: $scope.order.id });
    };

    //===========================================================

    $scope.showProductNotes = function (notes) {
      if (notes) {
        $scope.showNotes = true;
        $scope.productNotes = notes;
      } else {
        $scope.showNotes = false;
        $scope.productNotes = "";
      }
    };
    //============================ DATES ===============================
    $scope.date = new Date();
    $scope.date.setHours(0, 0, 0, 0);

    $scope.dateDialog = function (dateType) {
      $scope.dateModel = {};
      $scope.dateType = dateType;

      $scope.dialog = ngDialog.open({
        template: "partials/views/console/datepicker.html",
        scope: $scope,
        showClose: false,
      });
    };

    $scope.changeDate = function (model, form) {
      if ($scope.dateType == "install") {
        $scope.confirmInstallDate(model);
      }
      if ($scope.dateType == "arrival") {
        $scope.confirmTransit(model);
      }
      if ($scope.dateType == "endProduction") {
        $scope.confirmProduction(model, form);
      }
    };

    $scope.dateOptions = {
      dateDisabled: disabled,
      formatYear: "yy",
      startingDay: 1,
      minDate: new Date(),
    };

    function disabled(data) {
      var date = data.date,
        mode = data.mode;
      return mode === "day" && date.getDay() === 0;
    }

    $scope.dateChanged = function (calendar) {
      $scope.date = calendar.date;
    };

    $scope.confirmInstallDate = function (model) {
      $scope.dialog.close();
      paldiService.orders
        .setDate(
          $scope.order.id,
          $scope.dateType,
          $scope.date,
          model.notes
        )
        .then(
          function () {
            swal({
              title: "Fecha de Instalación",
              text: "Se capturó la fecha de instalación",
              type: "success",
              confirmButtonText: "Aceptar",
            });
            loadOrder();
            if ($scope.order.orderParent !== null) {
              $scope.statusOrderMaster(
                $scope.order.orderParent,
                $scope.order.status,
                false
              );
            }
          },
          function (error) {
            swal({
              title: "Ocurrió un error",
              type: "error",
              confirmButtonText: "Aceptar",
            });
            loadOrder();
          }
        );
    };

    $scope.toggleLog = function () {
      $scope.showLog = !$scope.showLog;
    };

    $scope.needsBill = function () {
      swal(
        {
          title: "¿Seguro que deseas marcar la orden como Necesita Factura?",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Aceptar",
          cancelButtonText: "Cancelar",
          closeOnConfirm: false,
          closeOnCancel: false,
        },
        function (isConfirm) {
          if (isConfirm) {
            paldiService.bills
              .needsBill($scope.order.id, "true")
              .then(
                function (order) {
                  swal({
                    title: "Orden marcada como Necesita factura",
                    type: "success",
                    confirmButtonText: "Aceptar",
                  });
                  loadOrder();
                },
                function (error) {
                  // console.log(error);
                }
              );
          } else {
            swal({
              title: "Cancelado",
              type: "error",
              confirmButtonText: "Aceptar",
            });
          }
        }
      );
    };

    $scope.cancelPaymentDialog = function (paymentId) {
      $scope.paymentId = paymentId;
      $scope.dialog = ngDialog.open({
        template: "partials/views/console/payment-cancel.html",
        scope: $scope,
        showClose: false,
      });
    };

    $scope.cancelPayment = function (form, notes) {
      if (form.$valid) {
        swal(
          {
            title: "¿Seguro que desea cancelar el Pago?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Aceptar",
            cancelButtonText: "Cancelar",
            closeOnConfirm: false,
            closeOnCancel: false,
          },
          function (isConfirm) {
            if (isConfirm && !$scope.isCancellingPayment) {
              $scope.isCancellingPayment = true;
              var cancelRequest = {
                user: $scope.currentUser,
                paymentId: $scope.paymentId,
                notes: notes,
              };
              paldiService.payments.cancel(cancelRequest).then(
                function () {
                  swal({
                    title: "Pago cancelado",
                    type: "success",
                    confirmButtonText: "Aceptar",
                  });
                  loadOrder();
                  $scope.dialog.close();
                  $scope.isCancellingPayment = false;
                },
                function (error) {
                  swal({
                    title: "Ocurrió un error",
                    type: "error",
                    confirmButtonText: "Aceptar",
                  });
                  $scope.isCancellingPayment = false;
                  loadOrder();
                }
              );
            } else {
              swal({
                title: "Cancelado",
                type: "error",
                confirmButtonText: "Aceptar",
              });
            }
          }
        );
      } else {
        form.$validated = true;
      }
    };

    $scope.loadAdditionals = function () {
      $scope.plusList = [];
      $scope.motorList = [];
      $scope.installationPlusList = [];

      $scope.productsSorted.forEach(function (productTypeArray) {
        productTypeArray.products.forEach(function (product) {
          if (product.plusList && product.plusList.length > 0) {
            product.plusList.forEach(function (plus) {
              plus.item = product.item;
              $scope.plusList.push(plus);
            });
          }

          if (
            product.installationPlusList &&
            product.installationPlusList.length > 0
          ) {
            product.installationPlusList.forEach(function (
              installationPlus
            ) {
              installationPlus.item = product.item;
              $scope.installationPlusList.push(installationPlus);
            });
          }

          if (product.motorList.length > 0) {
            product.motorList.forEach(function (motor) {
              motor.item = product.item;
              $scope.plusList.push(motor);
            });
          }
        });
      });
    };

    $scope.getPositionOfProduct = function (type) {
      return $scope.productsSorted.findIndex(function (t) {
        return t.type === type;
      });
    };

    var getMaxDate = function (limitDays) {
      var START_CYCLE = 1;
      var SATURDAY = 6;
      var SUNDAY = 7;

      var maxDate = $scope.currentDate.clone();

      var limit = limitDays;

      var count = START_CYCLE;
      do {
        if (
          maxDate.isoWeekday() === SATURDAY ||
          maxDate.isoWeekday() === SUNDAY
        ) {
          count--;
        }

        if (count < limit) {
          maxDate = maxDate.add(1, "days");
          count++;
        }

        if (
          count === limit &&
          (maxDate.isoWeekday() === SATURDAY ||
            maxDate.isoWeekday() === SUNDAY)
        ) {
          if (maxDate.isoWeekday() === SATURDAY) {
            maxDate = maxDate.add(2, "days");
          } else {
            maxDate = maxDate.add(1, "days");
          }
        }
      } while (count < limit);

      return maxDate;
    };

    var item = 0;
    var orderProductsByType = function (product) {
      var pos;
      if ($scope.mixedLabel != undefined && ($scope.mixedLabel.indexOf("Persianas") != -1 && $scope.mixedLabel.indexOf("Filtrasol") != -1)) {
        if (product.productType == "Enrollable" || product.productType == "Filtrasol") {
          pos = $scope.productsSorted.findIndex(function (t) {
            return t.type === "Persiana o Filtrasol"
          });
        } else {
          pos = $scope.productsSorted.findIndex(function (t) {
            return t.type === product.productType
          });
        }
      } else {
        pos = $scope.productsSorted.findIndex(function (t) {
          return t.type === product.productType
        });
      }

      product.item = ++item;
      $scope.productsSorted[pos].products.push(product);

    }

    var getCycleDays = function (currentDate, startDate, endDate) {
      var cycle = 0;
      var days;
      var daysExcludingWeekends = 0;
      var START_CYCLE = 1;

      if (startDate) {
        if (!endDate) {
          cycle = currentDate.diff(startDate, 'days');
        } else {
          cycle = endDate.diff(startDate, 'days');
        }
        days = (cycle <= 0) ? 0 : cycle;
        daysExcludingWeekends = getDaysExcludingWeekends(startDate, days);
        daysExcludingWeekends += START_CYCLE;

        return daysExcludingWeekends;
      } else {
        return " - ";
      }
    }

    var getRemainingDays = function (startDate, commitmentDate, endDate) {
      var currentDate = moment();
      var days = 0;
      var daysLeft = 0;
      var comparisonDate;
      if (startDate && commitmentDate) {
        days = commitmentDate.diff(startDate, 'days');
        if (!endDate) {
          comparisonDate = angular.copy(currentDate);
        } else {
          comparisonDate = angular.copy(endDate);
        }
        days = getDaysExcludingWeekends(startDate, days);
        daysLeft = getDaysLeft(startDate, comparisonDate, days);
        return daysLeft;
      } else {
        return " - ";
      }
    }

    var getDaysExcludingWeekends = function (startDate, days) {
      var daysExcludingWeekends = angular.copy(days);
      var date = angular.copy(startDate);
      for (var i = 0; i < days; i++) {
        date = date.add(1, 'days');
        if (date.isoWeekday() === 6 || date.isoWeekday() === 7) {
          daysExcludingWeekends--;
        }
      }
      return daysExcludingWeekends;
    }

    var getDaysLeft = function (startDate, comparisonDate, commitmentDays) {
      var leftDays = angular.copy(commitmentDays);
      var date = angular.copy(startDate);
      var passedDays = comparisonDate.diff(date, 'days');
      for (var i = 0; i < passedDays; i++) {
        date = date.add(1, 'days');
        if (date.isoWeekday() !== 6 && date.isoWeekday() !== 7) {
          leftDays -= 1;
        }
      }
      return leftDays;
    }

    var getDPFCDays = function (startDate, commitmentDate, endDate) {
      var days;
      var absDays;
      var START_CYCLE = 1;
      var dpfcDays;

      if (startDate && commitmentDate) {
        days = getRemainingDays(startDate, commitmentDate, endDate);
        $scope.dpfcStatus = getCountdownStatus(startDate, days, commitmentDate, endDate);
        $scope.dpfcTotalStatus = getCountdownStatus(startDate, days, commitmentDate, endDate);
        absDays = isNaN(days) ? days : Math.abs(days);
        var businessDays = commitmentDate.diff(startDate, 'days');
        businessDays = getDaysExcludingWeekends(startDate, businessDays);
        var totalDays = (businessDays + START_CYCLE) - days;
        dpfcDays = absDays + "/" + (businessDays + START_CYCLE);

        if (endDate === null) {
          dpfcDays = absDays;
        } else {
          dpfcDays = totalDays;
        }
        $scope.dpfcTotalDays = businessDays + START_CYCLE;


      } else {
        dpfcDays = " - "
      }
      return dpfcDays;

    }

    var getProductionDays = function (startDate, commitmentDate, endDate) {
      var days;

      var START_CYCLE = 1;
      var productionDays;
      if (startDate && commitmentDate) {

        days = getRemainingDays(startDate, commitmentDate, endDate);
        $scope.productionStatus = getCountdownStatus(startDate, days, commitmentDate, endDate);
        $scope.productionTotalStatus = getCountdownStatus(startDate, days, commitmentDate, endDate);
        var absDays = isNaN(days) ? days : Math.abs(days);
        var businessDays = commitmentDate.diff(startDate, 'days');
        businessDays = getDaysExcludingWeekends(startDate, businessDays);
        var totalDays = (businessDays + START_CYCLE) - days;
        if (endDate === null) {
          productionDays = absDays;
        } else {
          productionDays = totalDays;

        }
        $scope.productionTotalDays = businessDays + START_CYCLE;

      } else {
        productionDays = "-";
      }
      return productionDays;
    }

    var getCountdownStatus = function (startCycle, days, commitmentDate, endDate) {
      var status = '';
      if (startCycle && commitmentDate) {
        if (!endDate) {
          status = (days >= 0) ? 'START' : 'LATE';
        } else {
          status = 'END';
        }
      } else {
        status = '';
      }
      return status;

    }

    var getTransitDays = function (currentDate, startDate, endDate, commitmentDate) {
      var cycle = 0;
      var days;
      var daysExcludingWeekends = 0;
      var transitDays;
      var START_CYCLE = 1;

      if (startDate && commitmentDate) {
        if (!endDate) {
          cycle = currentDate.diff(startDate, 'days');
        } else {
          cycle = endDate.diff(startDate, 'days');
        }
        var businessDays = commitmentDate.diff(startDate, 'days');
        businessDays = getDaysExcludingWeekends(startDate, businessDays);
        days = (cycle <= 0) ? 0 : cycle;
        daysExcludingWeekends = getDaysExcludingWeekends(startDate, days);
        daysExcludingWeekends += START_CYCLE;
        transitDays = daysExcludingWeekends + "/" + (businessDays + START_CYCLE);

        return transitDays;
      } else {
        return " - ";
      }
    }

    //============= Data tables =============
    $scope.tableOptions = DTOptionsBuilder.newOptions()
      .withDisplayLength(25)
      .withOption("ordering", false)
      .withDOM("rt")
      .withLanguage("lang/table_lang.json");

    $scope.tableColumns = [
      DTColumnDefBuilder.newColumnDef(1).withOption(
        "responsivePriority",
        1
      ),
    ];
  }

);
