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
    console.log("Editing asset:", product);
    setProduct(product);
    setMode("edit");
    setShowModal(true);
  };

  const handleDelete = (id) => {
    deleteProductMutation({
      variables: { id },
      onCompleted: () => {
        dispatch(deleteProduct(id));
        toast.success("Product Deleted");
        refetch();
      },
      onError: (error) => {
        toast.error(`Failed to delete product: ${error.message}`);
      },
    });
  };

  const handleSave = () => {
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

    if (mode === "edit") {
      updateProductMutation({
        variables: { id: trimmedProduct.id, productInfo },
        onCompleted: (data) => {
          setShowModal(false);
          handleMutationSuccess(data.updateProduct.product, "Product Updated");
          refetch();
        },
        onError: (error) => {
          toast.error(`Failed to update product: ${error.message}`);
        },
      });
    } else {
      createProductMutation({
        variables: { productInfo },
        onCompleted: (data) => {
          handleMutationSuccess(data.createProduct.product, "Product Created");
          refetch();
        },
        onError: (error) => {
          toast.error(`Failed to create product: ${error.message}`);
        },
      });
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
