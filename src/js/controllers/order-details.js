import { pdApp } from "./index";

import { getConfirmPayment } from "./order-details/confirm-payment";
import { showSwal } from "../utils/swal/show";
import { merge, mergeDeep } from "../utils/merge";
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

    const loadOrder = async function () {
      var id = $stateParams.orderId;
      mergeDeep($scope, orderService.getInitialLoadOrderObject())
      mergeDeep($scope, await orderService.details.getOrderObject(id, $scope.productsSorted))

      $scope.permissions = permissionsHelper.get($scope.order, $rootScope.currentUser);
      $scope.canManagePayments = ["MANAGER", "INSTALLATION_MANAGER"].includes($scope.currentUser.role)

      $scope.perms = permissionService.setDependencies([
        ['user', $rootScope.currentUser],
        ['order', $scope.order],
        ['installationSheet', $scope.installationSheet]
      ])
      console.log($scope.perms)


      $scope.$evalAsync(() => $scope.loadAdditionals())
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
      swal(
        {
          title:
            "¿Seguro que desea enviar la " +
            objName +
            " al correo del proveedor?",
          type: "input",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Enviar",
          cancelButtonText: "Cancelar",
          closeOnConfirm: true,
          closeOnCancel: false,
          inputValue: order.products[0].productType,
        },
        function (value) {
          //console.log(value)
          if (value.trim() === "") {
            swal.showInputError(
              "Es necesario escribir una dirección de correo"
            );
            return false;
          }
          var id = $stateParams.orderId;
          paldiService.orders
            .sendOrderTo(id, value)
            .then(function (order) {
              swal({
                title: "Enviado",
                text: "Se envió la " + objName,
                type: "success",
                confirmButtonText: "Aceptar",
              });
            });
        }
      );
    };

    $scope.createInstallationSheet = () => {
      showCreateInstallationSheetDialog($scope, () => {
        showSwal("messages.installation_sheet.created")
      })
    }

    $scope.editInstallationSheet = () => {

    }

    var createSuborders = function (model, order) {
      paldiService.orders
        .getByOrderParent($scope.order.id)
        .then(function (suborders) {
          var suborderNo = 0;
          suborders.forEach(function (suborder) {
            if (suborder.products && suborder.products.length > 0) {
              suborderNo++;
              var updatedOrder = suborder;
              updatedOrder.suborderNo = suborderNo;
              updatedOrder.orderNo = order.orderNo;

              paldiService.orders
                .updateStatus(updatedOrder, "LINE")
                .then(
                  function (order) {
                    $scope.isPaying = false;
                  },
                  function (error) {
                    console.error(error);
                    $scope.isPaying = false;
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
            } else {
              paldiService.orders
                .deleteSuborder($scope.order.id, suborder.type)
                .then(
                  function (order) {
                    $scope.isPaying = false;
                  },
                  function (error) {
                    console.error(error);
                    $scope.isPaying = false;
                    swal({
                      title: "Ocurrió un error",
                      type: "error",
                      confirmButtonText: "Aceptar",
                    });
                    loadOrder();
                  }
                );
            }
          });
        });
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
      const confirmPayment = getConfirmPayment(this, $scope);
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
          template: "partials/views/console/order-send.html",
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
              console.log($scope.newStatus)
              if (status === 'PENDING') {
                showCreateInstallationSheetDialog($scope, () => showSwal('messages.installation_sheet.created', () => $scope.statusNotesDialog()))
                return
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
              //console.log(error);

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
                  //console.log(error);
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
      var maxDate = angular.copy($scope.currentDate);
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
