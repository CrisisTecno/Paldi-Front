import { attachTo } from "../../../../utils/attach";

import { showSwal } from "../../../../utils/swal/show";

import { formatTelephone, deformatTelephone } from "./formatTelephone";
import { getExtraNames, getInstallationSheetSaveHandler, getObjName, isExtraPresent } from "./helpers"

const getInstallationSheetState = async ($scope, order) => {
  const previousInstallationSheet = await $scope.paldiService.installationSheet.fetchState($scope.order.id)
  const data = previousInstallationSheet.data ?? {}

  // Joins all the elements in the following structure {name: true, ...}
  const getAllItems = (items) => {
    return Object.fromEntries(
      [
        ...Object.entries(items).filter(([k, v]) => !k.includes('other_')),
        ...getOtherItems(items).map(v => [v, true])
      ]
    )
  }
  // only retrieves an array of extra items (names)
  const getOtherItems = (items) => {
    return Object.entries(items)
      .filter(([k, _]) => k.includes('other_'))
      .map(([_, v]) => v)
      .filter(v => v !== "")
  }

  return {
    orderNo: order.orderNo | order.quoteNo,

    receivingPerson: data.receiver,
    telephone: deformatTelephone(data.phone_number),
    address: data.address,
    addressReference: data.address_guide,
    postalCode: data.cp,

    extras: getAllItems(previousInstallationSheet.tools ?? {}),
    otherExtra: getOtherItems(previousInstallationSheet.tools ?? {}),
    materials: getAllItems(previousInstallationSheet.material ?? {}),
    otherMaterials: getOtherItems(previousInstallationSheet.material ?? {}),

    extraError: false,
  }
}


export const showCreateInstallationSheetDialog = async (
  $scope,
  callback,
  mode = "create"
) => {
  $scope.installationSheet = {
    ...(await getInstallationSheetState($scope, $scope.order)),
    save: async (installationForm) => {

      // console.log($scope)
      const data = $scope.installationSheet;
      // console.log(data)

      const extras = data.extras;
      const material = data.materials;

      // if (!isExtraPresent(extras, material)) {
      //   $scope.installationSheet.extraError = true;
      //   return
      // } else {
      //   $scope.installationSheet.extraError = false;
      // }

      const finalExtras = data.otherExtra.filter(
        (extraItem) => data.extras[extraItem]
      );

      const finalMaterials = data.otherMaterials.filter(
        (materialItem) => data.materials[materialItem]
      );

      const phone = formatTelephone(data.telephone);

      const order = $scope.order;
      const sheetData = {
        order_id: order.id,
        data: {
          receiver: data.receivingPerson,
          phone_number: data.telephone,
          address: data.address,
          address_guide: data.addressReference,
          cp: data.postalCode,
        },
        tools: {
          rotomartillo: extras.rotomartillo,
          andamios: extras.andamios,
          escaleras: extras.escaleras,
          other_1: finalExtras[0] || "",
          other_2: finalExtras[1] || "",
          other_3: finalExtras[2] || "",
          other_4: finalExtras[3] || "",
          other_5: finalExtras[4] || "",
          other_6: finalExtras[5] || "",
        },
        material: {
          acero: material.acero,
          tablarroca: material.tablarroca,
          aluminio: material.aluminio,
          madera: material.madera,
          other_1: finalMaterials[0] || "",
          other_2: finalMaterials[1] || "",
          other_3: finalMaterials[2] || "",
          other_4: finalMaterials[3] || "",
        },
      };

      let response = await $scope.paldiService.installationSheet.create(sheetData);
      if (!["api.errors.installation.sheet.duplicated", "api.success.installation.sheet.create"].includes(response.data.code)) {
        return showSwal("messages.error");
      }
      if (response.data.code === "api.errors.installation.sheet.duplicated") {
        response = await $scope.paldiService.installationSheet.edit(sheetData);
        if (response.data.code !== "api.success.installation.sheet.edit")
          return showSwal("messages.error")
      }
      $scope.dialog.close()
      callback()

    },
    addOtherExtra: (otherName, arrayName) => {
      if (!otherName || $scope.installationSheet[arrayName].includes(otherName)
        || (arrayName === "otherExtra" ? $scope.installationSheet[arrayName].length === 6 : $scope.installationSheet[arrayName].length === 4)) {
        return;
      }
      $scope.installationSheet[arrayName].push(otherName);
      const objName = getObjName(arrayName);
      $scope.installationSheet[objName][otherName] = true;
    },
    removeOtherExtra: (otherName, arrayName) => {
      const objName = getObjName(arrayName);

      const otherPositionIdx = Object.values($scope.installationSheet[objName]).findIndex((value) => value === otherName);

      const otherNameInInstallationSheet = Object.keys($scope.installationSheet[objName])[otherPositionIdx]

      $scope.installationSheet[arrayName] = $scope.installationSheet[arrayName].filter((extra) => extra !== otherName);
      delete $scope.installationSheet[objName][otherName];
      delete $scope.installationSheet[objName][otherNameInInstallationSheet];

    },
  };
  // console.log($scope);
  // console.log($scope);
  $scope.dialog = $scope.ngDialog.open({
    template: "partials/views/console/installation-sheet/form-create.html",
    scope: $scope,
    showClose: false,
  });

};

