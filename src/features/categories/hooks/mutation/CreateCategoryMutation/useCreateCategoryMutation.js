import { useMutation } from "@apollo/client";
import { CREATE_CATEGORY } from "../../../../../graphql/mutation/category/createCategory";
import { toast } from "react-toastify";

export const useCreateCategoryMutation = (refetch) => {
  const [createCategory] = useMutation(CREATE_CATEGORY, {
    onCompleted: () => {
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return createCategory;
};
