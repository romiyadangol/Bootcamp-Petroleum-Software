import { useMutation } from "@apollo/client";
import { UPDATE_CATEGORY } from "../../../../../graphql/mutation/category/updateCategory";
import { toast } from "react-toastify";

export const useUpdateCategoryMutation = (refetch) => {
  const [updateCategory] = useMutation(UPDATE_CATEGORY, {
    onCompleted: () => {
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return updateCategory;
};
