import { attachTo } from "../../../utils/attach";

import { showSwal } from "../../../utils/swal/show";

export const showCreateInstallationSheetDialog = (
	$scope,
	callback
) => {
	attachTo(
		$scope,
		"installationSheet.save",
		getInstallationSheetSaveHandler($scope)
	);

	// TODO: Ojo, esto no se hace
	// eu sabes como verificar numeros de telefono? 8)
	$scope.installationSheet = {
		orderNo: $scope.order.orderNo,
		extras: {},
		otherExtra: [],
		// TODO: este es el onsubmit, te trae un form de angular, pero si usas
		// installationForm.propertyName te regresa el valor del coso
		// le puse installationSheet.postalCode
		save: async (installationForm) => {
			const data = $scope.installationSheet;
			const extras = data.extras;
			const material = data.material;
			const order = $scope.order;
			const sheetData = {
				// luego se hace esto bonito 8)
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
					escaleras: extras.bomberoStaircase,
					other_1: extras.other_1,
					other_2: extras.other_2,
					other_3: extras.other_3,
					other_4: extras.other_4,
					other_5: extras.other_5,
					other_6: extras.other_6,
				},
				material: {
					madera: material.madera,
					acero: material.acero,
					tablarroca: material.tablarroca,
					aluminio: material.aluminio,
					other_1: material.other_1,
					other_2: material.other_2,
					other_3: material.other_3,
					other_4: material.other_4,
				},
			};
			try {
				await $scope.paldiService.installationSheet.create(sheetData);
				$scope.dialog.close();
				callback();
			} catch (error) {
				console.log(error);
				if (
					error.data.code ===
					"api.errors.installation.sheet.duplicated"
				) {
					callback();
					return;
				}
				showSwal("messages.error");
			}

			console.log(
				"On Submit",
				$scope.installationSheet,
				installationForm,
				$scope
			);
		}, // mando el post aqui asi nomas sin miedo al esito? 8)
		addOtherExtra: (otherName) => {
			$scope.installationSheet.otherExtra.push(otherName);
		},
		onChangeCheck: (installationForm, changedName) => {},
	};
  console.log($scope)
	$scope.dialog = $scope.ngDialog.open({
		template: "partials/views/console/installation-sheet/form-create.html",
		scope: $scope,
		showClose: false,
	});
};

const getInstallationSheetSaveHandler = ($scope) => (form, data) => {
	console.log({ form, data });
};
