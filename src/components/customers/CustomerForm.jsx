import { InputField } from "../core/FormFields";
import ModalWrapper from "../core/ModalWrapper";

 export default function CustomerForm({ customer, onChange, onSave, onClose}) {

  return (
    <ModalWrapper isOpen={true} onClose={onClose} title="Customer Details" onSave={onSave}>
      <InputField label="Name" name="name" type="text"  value={customer.name} onChange={onChange}/>
      <InputField label="Phone No" type="text" name="phoneNo" value={customer.phoneNo} onChange={onChange}/>
      <InputField label="Email" name="email" type="text"  value={customer.email} onChange={onChange}/>
      <InputField label="Address" name="address" type="text"  value={customer.address} onChange={onChange}/>
      <InputField label="Zipcode" name="zipcode" type="number" value={customer.zipcode} onChange={onChange}/>
    </ModalWrapper>
  )
 }  