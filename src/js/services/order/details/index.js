import { buildGetOrderObject } from "./getOrderObject";

angular
	.module("paldi-app")
	.service("_InternalOrderDetailsService", function (paldiService) {
		let service = {};

		service.getOrderObject = buildGetOrderObject(paldiService);

		return service;
	});
