import { useState } from "react";
import ModalWrapper from "../../../components/core/ModalWrapper";
import { InputField, SelectField } from "../../../components/core/FormFields";

export default function DriverForm({
  showModal,
  mode,
  driver,
  onChange,
  onSave,
  onClose,
}) {
  const hardcodedStatuses = ["active", "inactive"];
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (mode === "create") {
      if (!driver.name) {
        newErrors.name = "Driver Name is required";
      } else if (!/^[a-zA-Z\s]+$/.test(driver.name)) {
        newErrors.name = "Driver Name must contain only alphabetic characters";
      }
    }

    if (!driver.phone) {
      newErrors.phone = "Phone is required";
    } else if (!/^[0-9]+$/.test(driver.phone)) {
      newErrors.phone = "Phone must contain only numbers";
    } else if (driver.phone.length < 10) {
      newErrors.phone = "Phone number must be at least 10 digits";
    }

    if (!driver.email) {
      newErrors.email = "Email is required";
    } else if (driver.email.length < 10) {
      newErrors.email = "Email must be at least 10 characters long";
    } else if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(driver.email)) {
      newErrors.email =
        "Email must be a valid Gmail address (e.g., user@gmail.com)";
    }
    return newErrors;
  };

  const handleSave = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
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
        onChange={onChange}
        isInvalid={!!errors.name}
        errorMessage={errors.name}
      />
      <InputField
        label="Phone"
        name="phone"
        value={driver.phone || ""}
        onChange={onChange}
        isInvalid={!!errors.phone}
        errorMessage={errors.phone}
      />
      <InputField
        label="Email"
        name="email"
        value={driver.email || ""}
        onChange={onChange}
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
