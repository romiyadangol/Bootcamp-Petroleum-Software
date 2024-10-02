import { useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import { CREATE_PRODUCT } from "../../../../../graphql/mutation/products/createProduct";

export const useCreateProductMutation = (refetch) => {
  const [createProduct] = useMutation(CREATE_PRODUCT, {
    onCompleted: () => {
      toast.success("Asset created successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return createProduct;
};
