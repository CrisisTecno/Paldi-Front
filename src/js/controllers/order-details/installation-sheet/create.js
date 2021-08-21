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
		materials: {},
		otherMaterials: [],
		// TODO: este es el onsubmit, te trae un form de angular, pero si usas
		// installationForm.propertyName te regresa el valor del coso
		// le puse installationSheet.postalCode
		save: async (installationForm) => {
			const data = $scope.installationSheet;

			const extras = data.extras;
			const material = data.materials;

			const finalExtras = data.otherExtra.filter(
				(extraItem) => data.extras[extraItem]
			);
			const finalMaterials = data.otherMaterials.filter(
				(materialItem) => data.materials[materialItem]
			);

			const phone = formatTelephone(data.telephone);

			const order = $scope.order;
			const sheetData = {
				// luego se hace esto bonito 8)
				order_id: order.id,
				data: {
					receiver: data.receivingPerson,
					phone_number: phone,
					address: data.address,
					address_guide: data.addressReference,
					cp: data.postalCode,
				},
				tools: {
					rotomartillo: extras.rotomartillo,
					andamios: extras.andamios,
					escaleras: extras.bomberoStaircase,
					other_1: finalExtras[0],
					other_2: finalExtras[1],
					other_3: finalExtras[2],
					other_4: finalExtras[3],
					other_5: finalExtras[4],
					other_6: finalExtras[5],
				},
				material: {
					acero: material.acero,
					tablarroca: material.tablarroca,
					aluminio: material.aluminio,
					other_1: finalMaterials[0],
					other_2: finalMaterials[1],
					other_3: finalMaterials[2],
					other_4: finalMaterials[3],
				},
			};

			// try {
			// 	await $scope.paldiService.installationSheet.create(sheetData);
			// 	$scope.dialog.close();
			// 	callback();
			// } catch (error) {
			// 	console.log(error);
			// 	if (
			// 		error.data.code ===
			// 		"api.errors.installation.sheet.duplicated"
			// 	) {
			// 		callback();
			// 		return;
			// 	}
			// 	showSwal("messages.error");
			// }
		}, // mando el post aqui asi nomas sin miedo al esito? 8)
		addOtherExtra: (otherName, arrayName) => {
			if (
				!otherName ||
				$scope.installationSheet[arrayName].includes(otherName) ||
				(arrayName === "otherExtra"
					? $scope.installationSheet[arrayName].length === 6
					: $scope.installationSheet[arrayName].length === 4)
			) {
				return;
			}
			$scope.installationSheet[arrayName].push(otherName);
			const objName = getObjName(arrayName);
			$scope.installationSheet[objName][otherName] = true;
		},
		onChangeCheck: (installationForm, changedName, arrayName) => {
			console.log(
				installationForm,
				changedName,
				$scope.installationSheet
			);
		},
		removeOtherExtra: (otherName, arrayName) => {
			$scope.installationSheet[arrayName] = $scope.installationSheet[
				arrayName
			].filter((extra) => extra !== otherName);
			const objName = getObjName(arrayName);
			delete $scope.installationSheet[objName][otherName];
		},
	};
  console.log($scope)
	$scope.dialog = $scope.ngDialog.open({
		template: "partials/views/console/installation-sheet/form-create.html",
		scope: $scope,
		showClose: false,
	});
};

const getObjName = (arrayName) =>
	arrayName === "otherExtra" ? "extras" : "materials";

const getInstallationSheetSaveHandler = ($scope) => (form, data) => {
	console.log({ form, data });
};

const formatTelephone = (tel) => {
	if (!tel) {
		return "";
	}

	var value = tel.toString().trim().replace(/^\+/, "");

	if (value.match(/[^0-9]/)) {
		return tel;
	}

	var country, city, number;

	switch (value.length) {
		case 10: // +1PPP####### -> C (PPP) ###-####
			country = 1;
			city = value.slice(0, 3);
			number = value.slice(3);
			break;

		case 11: // +CPPP####### -> CCC (PP) ###-####
			country = value[0];
			city = value.slice(1, 4);
			number = value.slice(4);
			break;

		case 12: // +CCCPP####### -> CCC (PP) ###-####
			country = value.slice(0, 3);
			city = value.slice(3, 5);
			number = value.slice(5);
			break;

		default:
			return tel;
	}

	if (country == 1) {
		country = "";
	}

	number = number.slice(0, 3) + "-" + number.slice(3);

	return (country + " (" + city + ") " + number).trim();
};
