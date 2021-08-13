import { pdApp } from "./index";

pdApp.filter("priceType", function () {
	return function (type) {
		switch (type) {
			case "PIECE":
				return "Unidad";
			case "METER":
				return "Metro cuadrado";
			case "WIDTH":
				return "Ancho (metro lineal)";
			case "HEIGHT":
				return "Alto (metro lineal)";
			case "BOX":
				return "Caja";
		}
	};
});
