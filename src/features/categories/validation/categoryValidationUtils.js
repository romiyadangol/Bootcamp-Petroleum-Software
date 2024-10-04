import * as Yup from "yup";

export const categoryValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Category Name is required")
    .matches(
      /^[a-zA-Z\s]+$/,
      "Category Name must contain only alphabetic characters"
    ),
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
