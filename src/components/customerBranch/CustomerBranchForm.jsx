import ModalWrapper from "../core/ModalWrapper";
import { InputField, SelectField } from "../core/FormFields";

export default function CustomerBranchForm({
  customerBranch,
  onChange,
  onSave,
  onClose,
}) {
  return (
    <ModalWrapper
      isOpen={true}
      onClose={onClose}
      title="Customer Branch Details"
      onSave={onSave}
      maxWidth={800}
    >
      <InputField
        label="Name"
        name="name"
        value={customerBranch.name || " "}
        onChange={onChange}
      />
      <InputField
        label="Location"
        name="location"
        value={customerBranch.location || " "}
        onChange={onChange}
      />
    </ModalWrapper>
  );
}
