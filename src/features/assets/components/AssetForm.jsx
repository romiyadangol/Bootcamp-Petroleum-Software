import { useQuery } from "@apollo/client";
import { useState } from "react";
import ModalWrapper from "../../../components/core/ModalWrapper";
import { InputField, SelectField } from "../../../components/core/FormFields";
import { GET_ASSET_CATEGORIES } from "../../../graphql/queries/categories/getAssetCategories";
import {
  assetValidationSchema,
  validateField,
  validateForm,
} from "../validation/assetValidationUtils";

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange(e);
    const fieldErrors = validateField(
      assetValidationSchema,
      name,
      value,
      asset
    );
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: fieldErrors[name] || "",
    }));
  };

  const handleSave = () => {
    const formErrors = validateForm(assetValidationSchema, asset);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      setErrors({});
      onSave(asset);
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
          onChange={handleChange}
          isInvalid={!!errors.assetId}
          errorMessage={errors.assetId}
        />
      )}
      <SelectField
        label="Category"
        name="assetCategory"
        value={asset?.assetCategory ?? ""}
        onChange={handleChange}
        options={assetCategoryOptions}
        isInvalid={!!errors.assetCategory}
        errorMessage={errors.assetCategory}
      />
      <SelectField
        label="Status"
        name="assetStatus"
        value={asset?.assetStatus ?? ""}
        onChange={handleChange}
        options={hardcodedStatuses}
        isInvalid={!!errors.assetStatus}
        errorMessage={errors.assetStatus}
      />
    </ModalWrapper>
  );
}
