import { useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import { CREATE_CATEGORY } from "../graphql/mutation/category/createCategory";
import { UPDATE_CATEGORY } from "../graphql/mutation/category/updateCategory";
import { DELETE_CATEGORY } from "../graphql/mutation/category/deleteCategory";

export const useCreateCategoryMutation = (refetch) => {
  const [createCategory] = useMutation(CREATE_CATEGORY, {
    onCompleted: () => {
      toast.success("Category created successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return createCategory;
};

export const useUpdateCategoryMutation = (refetch) => {
  const [updateCategory] = useMutation(UPDATE_CATEGORY, {
    onCompleted: () => {
      toast.success("Category updated successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return updateCategory;
};

export const useDeleteCategoryMutation = (refetch) => {
  const [deleteCategory] = useMutation(DELETE_CATEGORY, {
    onCompleted: () => {
      toast.success("Category deleted successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return deleteCategory;
};
