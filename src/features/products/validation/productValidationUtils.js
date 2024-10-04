import * as Yup from "yup";

export const productValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .matches(/^[a-zA-Z\s]+$/, "Name must contain alphanumeric characters"),
  productCategory: Yup.string().required("Category is required"),
  productStatus: Yup.string().required("Status is required"),
  productUnit: Yup.string().required("Unit is required"),
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
