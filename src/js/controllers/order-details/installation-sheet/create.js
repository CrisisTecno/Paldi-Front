import { attachTo } from "../../../utils/attach";

export const showCreateInstallationSheetDialog = ($scope, updatedOrder, callback) => {
  attachTo($scope, 'installationSheet.save', getInstallationSheetSaveHandler($scope))

  $scope.dialog = $scope.ngDialog.open({
    template: "partials/views/console/installation-sheet/form-create.html",
    scope: $scope,
    showClose: false,
  });
}


const getInstallationSheetSaveHandler = ($scope) => (form, data) => {

}

