import customerBranchReducer from "../../redux/reducers/customerBranchReducer";
import { InputField, SelectField } from "../core/FormFields";
import ModalWrapper from "../core/ModalWrapper";

export default function CustomerBranchForm({ customerBranch, onChange, onSave, onClose }) {
  return (
    <ModalWrapper isOpen={true} onClose={onClose} title="Customer Branch Details" onSave={onSave} maxWidth={800}>
      <InputField label="Name" name="name" value={customerBranch.name || ' '} onChange={onChange}/>
      <InputField label="Location" name="location" value={customerBranch.location || ' '} onChange={onChange}/>
        <InputField label="Customer ID" name="customerId" value={customerBranch.customerId || ' '} onChange={onChange}/>
    </ModalWrapper>
  )
}
