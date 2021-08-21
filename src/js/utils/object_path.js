export const buildGetFromObjectPath = (object) => (tag) => {
  const path = tag.split(".");
  let actual = object
	for (const subKey of path) {
		actual = actual[subKey];
	}
	return actual;
}