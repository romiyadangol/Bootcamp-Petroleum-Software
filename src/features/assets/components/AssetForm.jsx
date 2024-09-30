import { useQuery } from "@apollo/client";
import ModalWrapper from "../../../components/core/ModalWrapper";
import { InputField, SelectField } from "../../../components/core/FormFields";
import { GET_ASSET_CATEGORIES } from "../../../graphql/queries/categories/getAssetCategories";

export default function AssetForm({
  showModal,
  onClose,
  mode,
  asset,
  handleSave,
  onChange,
}) {
  const { data, loading, error } = useQuery(GET_ASSET_CATEGORIES, {
    variables: { categoryClass: "assets" },
  });

  if (!showModal) return null;

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading categories</p>;

  const categories = data?.getCategories.categories || [];
  const assetCategoryOptions = categories.map((category) => category.name);

  const hardcodedStatuses = ["active", "inactive"];
  console.log(showModal, "showModal>>>>>");

  return (
    <ModalWrapper
      isOpen={showModal}
      onClose={onClose}
      title="Asset Details"
      onSave={handleSave}
    >
      {mode === "create" && (
        <InputField
          label="Asset ID"
          name="assetId"
          value={asset?.assetId ?? ""}
          onChange={onChange}
        />
      )}
      <SelectField
        label="Category"
        name="assetCategory"
        value={asset?.assetCategory ?? ""}
        onChange={onChange}
        options={assetCategoryOptions}
      />
      <SelectField
        label="Status"
        name="assetStatus"
        value={asset?.assetStatus ?? ""}
        onChange={onChange}
        options={hardcodedStatuses}
      />
    </ModalWrapper>
  );
}
