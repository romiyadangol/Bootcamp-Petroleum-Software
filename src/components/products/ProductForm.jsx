import { InputField, SelectField } from "../core/FormFields";
import ModalWrapper from "../core/ModalWrapper";

export default function ProductForm({ product, onChange, onSave, onClose }) {
  const hardcodedCategories = ['petrol', 'diesel', 'lubricants', 'lpg'];
  const hardcodedStatuses = ['available', 'out_of_stock'];
  const hardcodedUnits = ['liters', 'gallons'];
  return (
    <ModalWrapper isOpen={true} onClose={onClose} title="Product Details" onSave={onSave} maxWidth={800}>
      <InputField label="Name" name="name" value={product.name} onChange={onChange}/>
      <SelectField label="Category" name="productCategory" value={product.productCategory} onChange={onChange} options={hardcodedCategories}/>
      <SelectField label="Status" name="productStatus" value={product.productStatus} onChange={onChange} options={hardcodedStatuses}/>
      <SelectField label="Unit" name="productUnit" value={product.productUnit} onChange={onChange} options={hardcodedUnits}/>
    </ModalWrapper>
  )
}
