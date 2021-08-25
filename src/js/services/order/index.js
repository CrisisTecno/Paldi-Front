import {
	getDefaultInitialLoadOrderObject,
	getDefaultProductsSorted,
} from "./defaults";

angular
	.module("paldi-app")
	.service(
		"orderService",
		function (paldiService, _InternalOrderDetailsService) {
			let service = {};

			service.getDefaultProductsSorted = getDefaultProductsSorted;
			service.getInitialLoadOrderObject =
				getDefaultInitialLoadOrderObject;

			service.details = _InternalOrderDetailsService;

			return service;
		}
	);
