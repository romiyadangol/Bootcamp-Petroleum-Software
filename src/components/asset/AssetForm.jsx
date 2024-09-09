import { InputField, SelectField } from "../core/FormFields";
import ModalWrapper from "../core/ModalWrapper";

export default function AssetForm({ asset, onChange, onSave, onClose }) {
  const hardcodedCategories = ['trailer', 'truck', 'tank-wagon', 'tanker'];
  const hardcodedStatuses = ['active', 'inactive'];
  return (
    <ModalWrapper isOpen={true} onClose={onClose} title="Product Details" onSave={onSave}>
      <InputField label="Asset ID" name="assetId" value={asset.assetId || ' '} onChange={onChange}/>
      <SelectField label="Category" name="assetCategory" value={asset.assetCategory} onChange={onChange} options={hardcodedCategories}/>
      <SelectField label="Status" name="assetStatus" value={asset.assetStatus} onChange={onChange} options={hardcodedStatuses}/>
    </ModalWrapper>
  )
}
