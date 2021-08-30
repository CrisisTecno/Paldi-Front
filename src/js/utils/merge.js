export const merge = (root, additional) => {
	Object.entries(additional).forEach(([key, value]) => (root[key] = value));
	return root;
};

export function isObject(item) {
	return item && typeof item === "object" && !Array.isArray(item);
}

export function mergeDeep(target, ...sources) {
	if (!sources.length) return target;
	const source = sources.shift();

	if (isObject(target) && isObject(source)) {
		for (const key in source) {
			if (isObject(source[key])) {
				if (!target[key]) Object.assign(target, { [key]: {} });
				mergeDeep(target[key], source[key]);
			} else {
				Object.assign(target, { [key]: source[key] });
			}
		}
	}

	return mergeDeep(target, ...sources);
}
// TODO:  Esto no deberia de existir
export function moveToScope(scope, additionalObject) {
	Object.keys(additionalObject).forEach((key) => {
		// if (scope[key] !== undefined) {

		// 		console.log(
		// 			`cuidado, estas sobreescribiendo la llave ${key}`,
		// 			scope[key],
		// 			additionalObject[key]
		// 		);

		// }
		scope[key] = additionalObject[key];
	});
}
