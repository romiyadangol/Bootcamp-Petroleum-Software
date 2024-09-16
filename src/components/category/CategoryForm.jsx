import ModalWrapper from "../core/ModalWrapper";
import { InputField, SelectField } from "../core/FormFields";
import { useEffect } from "react";

export default function CategoryForm({
  mode,
  category,
  onChange,
  onSave,
  onClose,
  categoryClass,
}) {
  useEffect(() => {
    if (mode === "create") {
      onChange({ target: { name: "categoryClass", value: categoryClass } });
    }
  }, [mode, categoryClass]);
  return (
    <ModalWrapper
      isOpen={true}
      onClose={onClose}
      title="Category Details"
      onSave={onSave}
    >
      <InputField
        label="Category Name"
        name="name"
        value={category.name || " "}
        onChange={onChange}
      />
      {mode == "create" && (
        <SelectField
          label="Category Class"
          name="categoryClass"
          value={categoryClass}
          onChange={onChange}
          options={[categoryClass]}
          isDisabled={true}
        />
      )}
    </ModalWrapper>
  );
}
