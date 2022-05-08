import {
	cancel,
	error,
	orders,
	sent as success,
	installationSheet,
} from "./messages";

import {  messages as reports } from "./messages/reports";

import * as msgs from '../general'


export const showSwal = (tag, callback = undefined) => {
	const swalInvoker = getSwal(tag);
	swalInvoker(callback);
};

const getSwal = (tag) => {
	const path = tag.split(".");
	let actual = swals;
	for (const subKey of path) {
		actual = actual[subKey];
		// console.log(actual)
	}
	return actual;
};

const swals = {
	messages: {
		cancel: cancel,
		error: error,
		payment: {
			success: success,
		},
		orders: orders,
		installation_sheet: installationSheet,
    reports: reports,
	...msgs.default
	},
};

// console.log(swals)
