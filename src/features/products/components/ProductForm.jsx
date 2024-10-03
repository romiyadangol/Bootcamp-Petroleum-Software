import ModalWrapper from "../../../components/core/ModalWrapper";
import { InputField, SelectField } from "../../../components/core/FormFields";
import { useQuery } from "@apollo/client";
import { useState } from "react";
import { GET_PRODUCT_CATEGORIES } from "../../../graphql/queries/categories/getProductCategories";

export default function ProductForm({
  showModal,
  product,
  onChange,
  onSave,
  onClose,
}) {
  const { data, loading, error } = useQuery(GET_PRODUCT_CATEGORIES, {
    variables: { categoryClass: "product" },
  });

  const [errors, setErrors] = useState({});

  if (!showModal) return null;

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading categories</p>;

  const categories = data?.getCategories.categories || [];
  const productCategoryOptions = categories.map((category) => category.name);

  const hardcodedStatuses = ["available", "out_of_stock"];
  const hardcodedUnits = ["liters", "gallons"];

  const validate = () => {
    const newErrors = {};
    if (!product.name) {
      newErrors.name = "Name is required";
    } else if (!/^[a-zA-Z0-9]+$/.test(product.name)) {
      newErrors.name = "Name must contain alphanumeric";
    }
    if (!product.productCategory) {
      newErrors.productCategory = "Category is required";
    }
    if (!product.productStatus) {
      newErrors.productStatus = "Status is required";
    }
    if (!product.productUnit) {
      newErrors.productUnit = "Unit is required";
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
      title="Product Details"
      onSave={handleSave}
      maxWidth={800}
    >
      <InputField
        label="Name"
        name="name"
        value={product.name}
        onChange={onChange}
        isInvalid={!!errors.name}
        errorMessage={errors.name}
      />
      <SelectField
        label="Category"
        name="productCategory"
        value={product.productCategory}
        onChange={onChange}
        options={productCategoryOptions}
        isInvalid={!!errors.productCategory}
        errorMessage={errors.productCategory}
      />
      <SelectField
        label="Status"
        name="productStatus"
        value={product.productStatus}
        onChange={onChange}
        options={hardcodedStatuses}
        isInvalid={!!errors.productStatus}
        errorMessage={errors.productStatus}
      />
      <SelectField
        label="Unit"
        name="productUnit"
        value={product.productUnit}
        onChange={onChange}
        options={hardcodedUnits}
        isInvalid={!!errors.productUnit}
        errorMessage={errors.productUnit}
      />
    </ModalWrapper>
  );
}
