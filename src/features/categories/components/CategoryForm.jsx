import ModalWrapper from "../../../components/core/ModalWrapper";
import { InputField, SelectField } from "../../../components/core/FormFields";
import { useEffect, useState } from "react";
import {
  categoryValidationSchema,
  validateField,
  validateForm,
} from "../validation/categoryValidationUtils";

export default function CategoryForm({
  mode,
  category,
  onChange,
  onSave,
  onClose,
  categoryClass,
}) {
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (mode === "create") {
      onChange({ target: { name: "categoryClass", value: categoryClass } });
    }
  }, [mode, categoryClass, onChange]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange(e);
    const fieldErrors = validateField(
      categoryValidationSchema,
      name,
      value,
      category
    );
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: fieldErrors[name] || "",
    }));
  };

  const handleSave = () => {
    const formErrors = validateForm(categoryValidationSchema, category);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      setErrors({});
      onSave();
    }
  };

  return (
    <ModalWrapper
      isOpen={true}
      onClose={onClose}
      title="Category Details"
      onSave={handleSave}
    >
      <InputField
        label="Category Name"
        name="name"
        value={category.name || ""}
        onChange={handleChange}
        isInvalid={!!errors.name}
        errorMessage={errors.name}
      />
      {mode === "create" && (
        <SelectField
          label="Category Class"
          name="categoryClass"
          value={category.categoryClass || categoryClass}
          onChange={onChange}
          options={[categoryClass]}
          isDisabled={true}
        />
      )}
    </ModalWrapper>
  );
}
