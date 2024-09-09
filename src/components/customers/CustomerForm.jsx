import { InputField, SelectField } from "../core/FormFields";
import ModalWrapper from "../core/ModalWrapper";

 export default function CustomerForm({ customer, onChange, onSave, onClose}) {

  return (
    <ModalWrapper isOpen={true} onClose={onClose} title="Customer Details" onSave={onSave}>
      <InputField label="Name" name="name" value={customer.name} onChange={onChange}/>
    </ModalWrapper>
  )
 }