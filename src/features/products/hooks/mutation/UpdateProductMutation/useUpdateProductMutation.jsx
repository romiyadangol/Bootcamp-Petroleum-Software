import { useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import { UPDATE_PRODUCT } from "../../../../../graphql/mutation/products/updateProduct";

export const useUpdateProductMutation = (refetch) => {
  const [updateProduct] = useMutation(UPDATE_PRODUCT, {
    onCompleted: () => {
      toast.success("Asset created successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return updateProduct;
};
