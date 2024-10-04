import * as Yup from "yup";

export const assetValidationSchema = Yup.object().shape({
  assetId: Yup.string().required("Asset ID is required"),
  assetCategory: Yup.string().required("Category is required"),
  assetStatus: Yup.string().required("Status is required"),
});

export const validateField = (schema, field, value, context) => {
  try {
    schema.validateSyncAt(field, { ...context, [field]: value });
    return {};
  } catch (validationErrors) {
    const newErrors = {};
    validationErrors.inner.forEach((error) => {
      newErrors[error.path] = error.message;
    });
    return newErrors;
  }
};

export const validateForm = (schema, context) => {
  try {
    schema.validateSync(context, { abortEarly: false });
    return {};
  } catch (validationErrors) {
    const newErrors = {};
    validationErrors.inner.forEach((error) => {
      newErrors[error.path] = error.message;
    });
    return newErrors;
  }
};
