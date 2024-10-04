import * as Yup from "yup";

export const driverValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Driver Name is required")
    .matches(
      /^[a-zA-Z\s]+$/,
      "Driver Name must contain only alphabetic characters"
    ),
  phone: Yup.string()
    .required("Phone is required")
    .matches(/^[0-9]+$/, "Phone must contain only numbers")
    .min(10, "Phone number must be at least 10 digits"),
  email: Yup.string()
    .required("Email is required")
    .min(10, "Email must be at least 10 characters long")
    .matches(
      /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
      "Email must be a valid Gmail address (e.g., user@gmail.com)"
    ),
  status: Yup.string().required("Status is required"),
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
