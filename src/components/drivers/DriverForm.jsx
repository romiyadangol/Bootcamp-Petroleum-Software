import { InputField, SelectField } from "../core/FormFields";
import ModalWrapper from "../core/ModalWrapper";

export default function DriverForm({ driver, onChange, onSave, onClose }) {
  const hardcodedStatuses = ['active', 'inactive'];
  return (
    <ModalWrapper isOpen={true} onClose={onClose} title="Asset Details" onSave={onSave} maxWidth={800}>
      <InputField label="Name" name="name" value={driver.name || ''} onChange={onChange}/>
      <InputField label="Phone" name="phone" value={driver.phone} onChange={onChange}/>
      <InputField label="Email" name="email" value={driver.email} onChange={onChange}/>
      <SelectField label="Status" name="status" value={driver.status} onChange={onChange} options={hardcodedStatuses}/>
    </ModalWrapper>
  )
}
