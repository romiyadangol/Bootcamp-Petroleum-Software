import { useMutation } from "@apollo/client";
import { DELETE_CATEGORY } from "../../../../../graphql/mutation/category/deleteCategory";
import { toast } from "react-toastify";

export const useDeleteCategoryMutation = (refetch) => {
  const [deleteCategory] = useMutation(DELETE_CATEGORY, {
    onCompleted: () => {
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return deleteCategory;
};
