import { useQuery } from "@apollo/client";
import { useState } from "react";
import ModalWrapper from "../../../components/core/ModalWrapper";
import { InputField, SelectField } from "../../../components/core/FormFields";
import { GET_ASSET_CATEGORIES } from "../../../graphql/queries/categories/getAssetCategories";

export default function AssetForm({
  showModal,
  onClose,
  mode,
  asset,
  onSave,
  onChange,
}) {
  const { data, loading, error } = useQuery(GET_ASSET_CATEGORIES, {
    variables: { categoryClass: "assets" },
  });

  const [errors, setErrors] = useState({});

  if (!showModal) return null;

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading categories</p>;

  const categories = data?.getCategories.categories || [];
  const assetCategoryOptions = categories.map((category) => category.name);

  const hardcodedStatuses = ["active", "inactive"];
  console.log(showModal, "showModal>>>>>");

  const validate = () => {
    const newErrors = {};
    if (mode === "create") {
      if (!asset?.assetId) {
        newErrors.assetId = "Asset ID is required";
      } else if (!/^[a-zA-Z0-9]+$/.test(asset.assetId)) {
        newErrors.assetId = "Asset ID must be alphanumeric";
      }
      return newErrors;
    }
    if (!asset?.assetCategory) {
      newErrors.assetCategory = "Category is required";
    }
    if (!asset?.assetStatus) {
      newErrors.assetStatus = "Status is required";
    }
    return newErrors;
  };

  const handleSave = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      onSave();
    }
  };

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
          isInvalid={!!errors.assetId}
          errorMessage={errors.assetId}
        />
      )}
      <SelectField
        label="Category"
        name="assetCategory"
        value={asset?.assetCategory ?? ""}
        onChange={onChange}
        options={assetCategoryOptions}
        isInvalid={!!errors.assetCategory}
        errorMessage={errors.assetCategory}
      />
      <SelectField
        label="Status"
        name="assetStatus"
        value={asset?.assetStatus ?? ""}
        onChange={onChange}
        options={hardcodedStatuses}
        isInvalid={!!errors.assetStatus}
        errorMessage={errors.assetStatus}
      />
    </ModalWrapper>
  );
}
