import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  addCategory,
  deleteCategory,
  updateCategory,
} from "../../../redux/actions/categoryActions";
import { useCreateCategoryMutation } from "../hooks/mutation/CreateCategoryMutation/useCreateCategoryMutation";
import { useDeleteCategoryMutation } from "../hooks/mutation/DeleteCategoryMutation/useDeleteCategoryMutation";
import { useUpdateCategoryMutation } from "../hooks/mutation/UpdateCategoryMutation/useUpdateCategoryMutation";

export const useCategoryActions = (refetch) => {
  const dispatch = useDispatch();

  const createCategoryMutation = useCreateCategoryMutation(refetch);
  const updateCategoryMutation = useUpdateCategoryMutation(refetch);
  const deleteCategoryMutation = useDeleteCategoryMutation(refetch);

  const handleSave = async (category, mode, setShowModal) => {
    const variables = {
      categoryInfo: {
        name: category.name,
        categoryClass: category.categoryClass,
      },
    };

    try {
      if (mode === "edit") {
        const { data } = await updateCategoryMutation({
          variables: {
            id: category.id,
            ...variables,
          },
        });
        dispatch(updateCategory(data.editCategory.category));
        toast.success("Category Updated");
      } else {
        const { data } = await createCategoryMutation({
          variables,
        });
        dispatch(addCategory(data.createCategory.category));
        toast.success("Category Created");
      }
      refetch();
      setShowModal(false);
    } catch (error) {
      toast.error("An error occurred while saving the category" + error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCategoryMutation({
        variables: { id },
      });
      dispatch(deleteCategory(id));
      refetch();
      toast.success("Category Deleted");
    } catch (error) {
      toast.error("An error occurred while deleting the category" + error);
    }
  };

  return {
    handleSave,
    handleDelete,
  };
};
