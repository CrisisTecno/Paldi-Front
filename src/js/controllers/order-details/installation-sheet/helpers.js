export const getObjName = (arrayName) =>
  arrayName === "otherExtra" ? "extras" : "materials";

export const getInstallationSheetSaveHandler = ($scope) => (form, data) => {
  console.log({ form, data });
};

// @note getExtraNames clean
export const getExtraNames = (obj) => {
  if (!obj) {
    return []
  }
  const otherNames = Object.keys(obj).filter((key) => key.includes("other_"))
  // const res = Array.from(new Set(otherKeys.map((keyName) => obj[keyName]))).filter((val) => val !== "");
  return otherNames.map(k => obj[k]).filter(v => v !== '')
};

export const isExtraPresent = (extras, materials) => {
    return Object.values(extras).some((extra) => extra) || Object.values(materials).some((material) => material);
}