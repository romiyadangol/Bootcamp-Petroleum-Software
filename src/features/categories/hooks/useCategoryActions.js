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

  const handleSave = (category, mode, setShowModal) => {
    if (mode === "edit") {
      updateCategoryMutation({
        variables: {
          id: category.id,
          categoryInfo: {
            name: category.name,
          },
        },
        onCompleted: (data) => {
          dispatch(updateCategory(data.editCategory.category));
          refetch();
          toast.success("Category Updated");
          setShowModal(false);
        },
      });
    } else {
      createCategoryMutation({
        variables: {
          categoryInfo: {
            name: category.name,
            categoryClass: category.categoryClass,
          },
        },
        onCompleted: (data) => {
          dispatch(
            addCategory({
              ...data.createCategory.category,
            })
          );
          refetch();
          toast.success("Category Created");
          setShowModal(false);
        },
      });
    }
  };

  const handleDelete = (id) => {
    deleteCategoryMutation({
      variables: { id },
      onCompleted: () => {
        dispatch(deleteCategory(id));
        refetch();
        toast.success("Category Deleted");
      },
    });
  };

  return {
    handleSave,
    handleDelete,
  };
};
