import ModalWrapper from "../../../components/core/ModalWrapper";
import { InputField, SelectField } from "../../../components/core/FormFields";
import { useQuery } from "@apollo/client";
import { useState } from "react";
import { GET_PRODUCT_CATEGORIES } from "../../../graphql/queries/categories/getProductCategories";
import {
  productValidationSchema,
  validateField,
  validateForm,
} from "../validation/productValidationUtils";

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange(e);
    const fieldErrors = validateField(
      productValidationSchema,
      name,
      value,
      product
    );
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: fieldErrors[name] || "",
    }));
  };

  const handleSave = () => {
    const formErrors = validateForm(productValidationSchema, product);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      setErrors({});
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
        onChange={handleChange}
        isInvalid={!!errors.name}
        errorMessage={errors.name}
      />
      <SelectField
        label="Category"
        name="productCategory"
        value={product.productCategory}
        onChange={handleChange}
        options={productCategoryOptions}
        isInvalid={!!errors.productCategory}
        errorMessage={errors.productCategory}
      />
      <SelectField
        label="Status"
        name="productStatus"
        value={product.productStatus}
        onChange={handleChange}
        options={hardcodedStatuses}
        isInvalid={!!errors.productStatus}
        errorMessage={errors.productStatus}
      />
      <SelectField
        label="Unit"
        name="productUnit"
        value={product.productUnit}
        onChange={handleChange}
        options={hardcodedUnits}
        isInvalid={!!errors.productUnit}
        errorMessage={errors.productUnit}
      />
    </ModalWrapper>
  );
}
