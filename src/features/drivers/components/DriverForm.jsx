import { useState } from "react";
import ModalWrapper from "../../../components/core/ModalWrapper";
import { InputField, SelectField } from "../../../components/core/FormFields";
import {
  driverValidationSchema,
  validateField,
  validateForm,
} from "../validation/driverValidationUtils";

export default function DriverForm({
  showModal,
  driver,
  onChange,
  onSave,
  onClose,
}) {
  const hardcodedStatuses = ["active", "inactive"];
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange(e);
    const fieldErrors = validateField(
      driverValidationSchema,
      name,
      value,
      driver
    );
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: fieldErrors[name] || "",
    }));
  };

  const handleSave = () => {
    const formErrors = validateForm(driverValidationSchema, driver);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      setErrors({});
      onSave();
    }
  };

  return (
    <ModalWrapper
      isOpen={showModal}
      onClose={onClose}
      title="Driver Details"
      onSave={handleSave}
      maxWidth={800}
    >
      <InputField
        label="Name"
        name="name"
        value={driver.name || ""}
        onChange={handleChange}
        isInvalid={!!errors.name}
        errorMessage={errors.name}
      />
      <InputField
        label="Phone"
        name="phone"
        value={driver.phone || ""}
        onChange={handleChange}
        isInvalid={!!errors.phone}
        errorMessage={errors.phone}
      />
      <InputField
        label="Email"
        name="email"
        value={driver.email || ""}
        onChange={handleChange}
        isInvalid={!!errors.email}
        errorMessage={errors.email}
      />
      <SelectField
        label="Status"
        name="status"
        value={driver.status || ""}
        onChange={onChange}
        options={hardcodedStatuses}
      />
    </ModalWrapper>
  );
}
