import { useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import { DELETE_PRODUCT } from "../../../../../graphql/mutation/products/deleteProduct";

export const useDeleteProductMutation = (refetch) => {
  const [deleteProduct] = useMutation(DELETE_PRODUCT, {
    onCompleted: () => {
      toast.success("Asset created successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return deleteProduct;
};
