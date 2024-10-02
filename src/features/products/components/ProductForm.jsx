import ModalWrapper from "../../../components/core/ModalWrapper";
import { InputField, SelectField } from "../../../components/core/FormFields";
import { useQuery } from "@apollo/client";
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

  if (!showModal) return null;

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading categories</p>;

  const categories = data?.getCategories.categories || [];
  const productCategoryOptions = categories.map((category) => category.name);

  const hardcodedStatuses = ["available", "out_of_stock"];
  const hardcodedUnits = ["liters", "gallons"];
  return (
    <ModalWrapper
      isOpen={showModal}
      onClose={onClose}
      title="Product Details"
      onSave={onSave}
      maxWidth={800}
    >
      <InputField
        label="Name"
        name="name"
        value={product.name}
        onChange={onChange}
      />
      <SelectField
        label="Category"
        name="productCategory"
        value={product.productCategory}
        onChange={onChange}
        options={productCategoryOptions}
      />
      <SelectField
        label="Status"
        name="productStatus"
        value={product.productStatus}
        onChange={onChange}
        options={hardcodedStatuses}
      />
      <SelectField
        label="Unit"
        name="productUnit"
        value={product.productUnit}
        onChange={onChange}
        options={hardcodedUnits}
      />
    </ModalWrapper>
  );
}
