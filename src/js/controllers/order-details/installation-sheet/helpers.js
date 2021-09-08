export const getObjName = (arrayName) =>
  arrayName === "otherExtra" ? "extras" : "materials";

export const getInstallationSheetSaveHandler = ($scope) => (form, data) => {
  console.log({ form, data });
};

export const getExtraNames = (obj) => {
  const otherKeys = Object.keys({ ...obj }).filter((key) =>
    key.includes("other_")
  )

  const res = Array.from(new Set(otherKeys.map((keyName) => obj[keyName]))).filter((val) => val !== "");

  return res;
};

export const isExtraPresent = (extras, materials) => {

    return Object.values(extras).some((extra) => extra) || Object.values(materials).some((material) => material);

}