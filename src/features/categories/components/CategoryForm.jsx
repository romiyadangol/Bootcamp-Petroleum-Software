import ModalWrapper from "../../../components/core/ModalWrapper";
import { InputField, SelectField } from "../../../components/core/FormFields";
import { useEffect, useState } from "react";

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

  const validate = () => {
    const newErrors = {};
    if (!category.name) {
      newErrors.name = "Category Name is required";
    } else if (!/^[a-zA-Z\s]+$/.test(category.name)) {
      newErrors.name = "Category Name must contain only alphabetic characters";
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
      isOpen={true}
      onClose={onClose}
      title="Category Details"
      onSave={handleSave}
    >
      <InputField
        label="Category Name"
        name="name"
        value={category.name || ""}
        onChange={onChange}
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
