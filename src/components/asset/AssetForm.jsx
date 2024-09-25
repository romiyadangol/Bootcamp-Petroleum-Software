import ModalWrapper from "../core/ModalWrapper";
import { InputField, SelectField } from "../core/FormFields";
import { useQuery } from "@apollo/client";
import { GET_ASSET_CATEGORIES } from "../../graphql/queries/categories/getAssetCategories";

export default function AssetForm({ mode, asset, onChange, onSave, onClose }) {
  const { data, loading, error } = useQuery(GET_ASSET_CATEGORIES, {
    variables: { categoryClass: "assets" },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading categories</p>;

  const categories = data?.getCategories.categories || [];
  const assetCategoryOptions = categories.map((category) => category.name);

  const hardcodedStatuses = ["active", "inactive"];
  return (
    <ModalWrapper
      isOpen={true}
      onClose={onClose}
      title="Asset Details"
      onSave={onSave}
    >
      {mode == "create" && (
        <InputField
          label="Asset ID"
          name="assetId"
          value={asset.assetId ?? ""}
          onChange={onChange}
        />
      )}
      <SelectField
        label="Category"
        name="assetCategory"
        value={asset.assetCategory}
        onChange={onChange}
        options={assetCategoryOptions}
      />
      <SelectField
        label="Status"
        name="assetStatus"
        value={asset.assetStatus}
        onChange={onChange}
        options={hardcodedStatuses}
      />
    </ModalWrapper>
  );
}
