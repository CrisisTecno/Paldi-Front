import { pdApp } from "./index";
pdApp.factory("permissionsHelper", function ($http, $q, $filter, $rootScope) {
	var service = {
		get: function (order, user) {
			var canMail = false;
			var canEdit = false;
			var canSend = false;
			var canApprove = false;
			var canBackorder = false;
			var canPay = false;
			var canProduction = false;
			var canTransit = false;
			var canFinish = false;
			var canInstall = false;
			var canPartialInstall = false;
			var canSetInstallDate = false;
			var canCancel = false;
			var canDownload = false;
			var canUpdateProvider = false;
			var canChangeStatus = false;
			var canChangeDeadline = false;

			if (order.status != "CANCELED") {
				if (
					user.role != "MANAGER" &&
					user.role != "INSTALLATION_MANAGER" &&
					user.role != "BUYER"
				) {
					canMail = true;
				}

				if (
					(order.status == "QUOTE" ||
						(order.status == "REJECTED" && order.rejected < 2)) &&
					(user.role == "SUPERADMIN" ||
						user.role == "SALES_MANAGER" ||
						user.id == order.user.id)
				) {
					canEdit = true;
				}

				if (
					order.status == "QUOTE" &&
					(user.role == "CONSULTANT" ||
						user.role == "SALES_MANAGER" ||
						user.role == "SUPERADMIN")
				) {
					canSend = true;
				}

				if (
					order.rejected < 2 &&
					order.status == "REJECTED" &&
					(user.role == "CONSULTANT" || user.role == "SUPERADMIN")
				) {
					canSend = true;
				}

				if (
					order.status == "PENDING" &&
					(user.role == "ADMIN" || user.role == "SUPERADMIN")
				) {
					canApprove = true;
				}

				if (
					order.status == "LINE" &&
					(user.role == "MANAGER" ||
						user.role == "SUPERADMIN" ||
						user.role == "BUYER")
				) {
					canBackorder = true;
				}

				if (
					order.balance >= 0.01 &&
					order.status != "QUOTE" &&
					order.status != "REJECTED" &&
					order.status != "PENDING" &&
					user.role != "MANAGER" &&
					user.role != "BUYER" &&
					user.role != "INSTALLATION_MANAGER" &&
					EXECUTION_ENV!="EXTERNAL"
				) {
					canPay = true;
				}

				if (
					(order.status == "LINE" || order.status == "BACKORDER") &&
					(user.role == "MANAGER" ||
						user.role == "SUPERADMIN" ||
						user.role == "PROVIDER" ||
						user.role == "BUYER")
				) {
					canProduction = true;
				}

				if (
					order.status == "PRODUCTION" &&
					(user.role == "MANAGER" ||
						user.role == "SUPERADMIN" ||
						user.role == "BUYER" ||
						user.role == "PROVIDER")
				) {
					canTransit = true;
				}

				if (
					order.status == "TRANSIT" &&
					(user.role == "MANAGER" ||
						user.role == "SUPERADMIN" ||
						user.role == "BUYER")
				) {
					canFinish = true;
				}

				if (
					(order.status == "PROGRAMMED" ||
						order.status == "INSTALLED_INCOMPLETE" ||
						order.status == "INSTALLED_NONCONFORM") &&
					(user.role == "INSTALLATION_MANAGER" ||
						user.role == "SUPERADMIN")
				) {
					canInstall = true;
				}

				if (
					order.status == "PROGRAMMED" &&
					(user.role == "INSTALLATION_MANAGER" ||
						user.role == "SUPERADMIN")
				) {
					canPartialInstall = true;
				}
				if (
					order.status != "QUOTE" &&
					order.status != "PENDING" &&
					order.status != "REJECTED" &&
					order.status != "INSTALLED" &&
					order.status != "PROGRAMMED" &&
					(user.role == "INSTALLATION_MANAGER" ||
						user.role == "SUPERADMIN")
				) {
					canSetInstallDate = true;
				}
				if (user.role == "SUPERADMIN" || user.role == "ADMIN") {
					canCancel = true;
				}

				if (
					(user.role == "SUPERADMIN"  || user.role == "MANAGER") &&
					order.status != "QUOTE" &&
					order.status != "REJECTED" &&
					order.status != "PENDING" &&
					(order.providerStatus || order.status=="BACKORDER" )
		
				) {
					canChangeStatus = true;
				}

				if (
					(user.role == "SUPERADMIN" ||
						user.role == "MANAGER" ||
						user.role == "PROVIDER"||
						user.role == "INSTALLATION_MANAGER" ||
						user.role == "BUYER") &&
					order.status != "QUOTE" &&
					order.status != "REJECTED" &&
					order.status != "PENDING" &&
					order.providerId
				) {
					canUpdateProvider = true;
				}
				if (user.role != "SALES_MANAGER" && user.role != "BUYER") {
					canChangeDeadline = true;
				}

				canDownload = true;
			}

			return {
				canMail: canMail,
				canEdit: canEdit,
				canSend: canSend,
				canApprove: canApprove,
				canBackorder: canBackorder,
				canPay: canPay,
				canProduction: canProduction,
				canTransit: canTransit,
				canFinish: canFinish,
				canInstall: canInstall,
				canPartialInstall: canPartialInstall,
				canSetInstallDate: canSetInstallDate,
				canCancel: canCancel,
				canDownload: canDownload,
				canChangeStatus: canChangeStatus,
				canUpdateProvider: canUpdateProvider,
			};
		},

		getStatusList: function (list) {
			// console.log(list)
			var statusList = [
				"QUOTE",
				"PENDING",
				"REJECTED",
				"LINE",
				"BACKORDER",
				"PRODUCTION",
				"TRANSIT",
				"FINISHED",
				"INSTALLED",
				"PROGRAMMED",
				"INSTALLED_NONCONFORM",
				"INSTALLED_INCOMPLETE",
				"ORDER_CANCELED",
			];

			if (list == "ADMIN") {
				statusList = [
					"LINE",
					"BACKORDER",
					"PRODUCTION",
					"TRANSIT",
					"FINISHED",
					"PROGRAMMED",
					"INSTALLED",
					"INSTALLED_NONCONFORM",
					"INSTALLED_INCOMPLETE",
					"ORDER_CANCELED",
				
				];
			}

			// if (list == "PROVIDER") {
			// 	statusList = [
			// 		"LINE",
			// 		"BACKORDER",
			// 		"PRODUCTION",
			// 		"TRANSIT",
			// 		"FINISHED",
			// 		"PROGRAMMED",
			// 		"INSTALLED",
			// 		"INSTALLED_NONCONFORM",
			// 		"INSTALLED_INCOMPLETE",
			// 		"ORDER_CANCELED",
			// 	];
			// }

			if (list == "SALES_MANAGER") {
				statusList = [
					"LINE",
					"BACKORDER",
					"PRODUCTION",
					"TRANSIT",
					"FINISHED",
					"PROGRAMMED",
					"INSTALLED",
					"INSTALLED_NONCONFORM",
					"INSTALLED_INCOMPLETE",
					"ORDER_CANCELED",
				];
			}

			if (list == "SUPERADMIN") {
				statusList = [
					"LINE",
					"BACKORDER",
					"PRODUCTION",
					"TRANSIT",
					"FINISHED",
					"PROGRAMMED",
					"INSTALLED",
					"INSTALLED_NONCONFORM",
					"INSTALLED_INCOMPLETE",
					"ORDER_CANCELED",
					"AUTHORIZED",
					"PENDING_INFO",
					"QUOTE",
					"QUOTED"
				];
			}

			if (list == "MANAGER" || list == "BUYER") {
				statusList = [
					"LINE",
					"BACKORDER",
					"PRODUCTION",
					"TRANSIT",
					"FINISHED",
					"PROGRAMMED",
					"INSTALLED",
					"INSTALLED_NONCONFORM",
					"INSTALLED_INCOMPLETE",
					"ORDER_CANCELED",
					"AUTHORIZED",
					"PENDING_INFO",
					"QUOTE",
					"QUOTED"
				];
			}

			if (list == "INSTALLATION_MANAGER") {
				statusList = [
					"LINE",
					"BACKORDER",
					"PRODUCTION",
					"TRANSIT",
					"FINISHED",
					"PROGRAMMED",
					"INSTALLED",
					"INSTALLED_NONCONFORM",
					"INSTALLED_INCOMPLETE",
					"ORDER_CANCELED",
				];
			}

			if (list == "CONSULTANT" || list=="EXTERNAL_CONSULTANT") {
				statusList = [
					"LINE",
					"BACKORDER",
					"PRODUCTION",
					"TRANSIT",
					"FINISHED",
					"PROGRAMMED",
					"INSTALLED",
					"INSTALLED_NONCONFORM",
					"INSTALLED_INCOMPLETE",
					"ORDER_CANCELED",
				];
			}
			

			if (list == "QUOTE") {
				statusList = [
					"NEW",
					"DUPLICATE",
					"LOST_SALE",
					"FOLLOWING",
					"REJECTED",
					"PENDING",
				];
			}

			return statusList;
		},

		getChangePermissions: function (order) {
			var canLine = false;
			var canBackorder = false;
			var canProduction = false;
			var canTransit = false;
			var canFinished = false;
			var canProgrammed = false;
			var canIncomplete = false;
			var canNonConform = false;
			var canQuote = false;
			var canInfo = false;
			var canAuth = false;
			var canQuoted= false;

			if(order.providerStatus!="QUOTE"){
				canQuote=true
			}
			if(order.providerStatus!="PENDING_INFO" && order.providerStatus!="PENDING_INFO"){
				canInfo=true
			}
			if(order.providerStatus!="PENDING_INFO" && order.providerStatus!="PENDING_INFO" && order.providerStatus!="QUOTED"){
				canQuoted=true
			}
			
			if(order.status != "LINE" || order.providerStatus){
				canLine = true;
			}
			if (order.status != "LINE") {
				
			
				canAuth = true
			}

			if (order.status != "BACKORDER" && order.status != "LINE") {
				canBackorder = true;
			}

			if (
				order.status != "PRODUCTION" &&
				order.status != "BACKORDER" &&
				order.status != "LINE"
			) {
				canProduction = true;
			}

			if (
				order.status != "TRANSIT" &&
				order.status != "PRODUCTION" &&
				order.status != "BACKORDER" &&
				order.status != "LINE"
			) {
				canTransit = true;
			}

			if (
				order.status == "PROGRAMMED" ||
				order.status == "INSTALLED_INCOMPLETE" ||
				order.status == "INSTALLED_NONCONFORM" ||
				order.status == "INSTALLED"
			) {
				canFinished = true;
			}

			if (
				order.status == "INSTALLED_INCOMPLETE" ||
				order.status == "INSTALLED_NONCONFORM" ||
				order.status == "INSTALLED"
			) {
				canProgrammed = true;
			}

			if (order.status == "INSTALLED") {
				canIncomplete = true;
			}

			if (order.status == "INSTALLED") {
				canNonConform = true;
			}


			return {
				canLine: canLine,
				canBackorder: canBackorder,
				canProduction: canProduction,
				canTransit: canTransit,
				canFinished: canFinished,
				canProgrammed: canProgrammed,
				canIncomplete: canIncomplete,
				canNonConform: canNonConform,
				canQuote:canQuote,
				canInfo:canInfo,
				canAuth:canAuth,
				canQuoted:canQuoted
			};
		},
	};

	return service;
});
