import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  addProduct,
  deleteProduct,
  updateProduct,
} from "../../../redux/actions/productActions";
import { useCreateProductMutation } from "./mutation/CreateProductMutation/useCreateProductMutation";
import { useUpdateProductMutation } from "./mutation/UpdateProductMutation/useUpdateProductMutation";
import { useDeleteProductMutation } from "./mutation/DeleteProductMutation/useDeleteProductMutation";
import { useProductData } from "./useProductData";

export function useProductActions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [product, setProduct] = useState(null);
  const [mode, setMode] = useState("create");

  const dispatch = useDispatch();

  const { refetch } = useProductData();

  const createProductMutation = useCreateProductMutation(refetch);
  const updateProductMutation = useUpdateProductMutation(refetch);
  const deleteProductMutation = useDeleteProductMutation(refetch);

  const handleEdit = (product) => {
    console.log("Editing product:", product);
    setProduct(product);
    setMode("edit");
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteProductMutation({
        variables: { id },
      });
      dispatch(deleteProduct(id));
      toast.success("Product Deleted");
      refetch();
    } catch (error) {
      toast.error(`Failed to delete product: ${error.message}`);
    }
  };

  const handleSave = async () => {
    console.log("Product:", product);
    const trimmedProduct = {
      ...product,
      name: product.name.trim(),
      productCategory: product.productCategory.trim(),
      productStatus: product.productStatus.trim(),
      productUnit: product.productUnit.trim(),
    };

    const productInfo = {
      name: trimmedProduct.name,
      productCategory: trimmedProduct.productCategory,
      productStatus: trimmedProduct.productStatus,
      productUnit: trimmedProduct.productUnit,
    };

    try {
      if (mode === "edit") {
        const { data } = await updateProductMutation({
          variables: { id: trimmedProduct.id, productInfo },
        });
        setShowModal(false);
        handleMutationSuccess(data.updateProduct.product, "Product Updated");
        refetch();
      } else {
        const { data } = await createProductMutation({
          variables: { productInfo },
        });
        handleMutationSuccess(data.createProduct.product, "Product Created");
        refetch();
      }
    } catch (error) {
      toast.error(
        `Failed to ${mode === "edit" ? "update" : "create"} product: ${
          error.message
        }`
      );
    }
  };

  const handleMutationSuccess = (productData, message) => {
    console.log("Mutation succeeded:", productData);
    if (mode === "edit") {
      dispatch(updateProduct(productData));
    } else {
      dispatch(addProduct(productData));
    }
    setShowModal(false);
    toast.success(message);
  };

  return {
    searchQuery,
    setSearchQuery,
    showModal,
    setShowModal,
    product,
    setProduct,
    mode,
    setMode,
    handleEdit,
    handleDelete,
    handleSave,
  };
}
