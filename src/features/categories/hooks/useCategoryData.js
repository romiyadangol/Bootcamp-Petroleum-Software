import { useQuery } from "@apollo/client";
import { useDispatch } from "react-redux";
import {
  fetchCategoryRequest,
  fetchCategoryFailure,
  fetchCategorySuccess,
} from "../../../redux/actions/categoryActions";
import { GET_ASSET_CATEGORIES } from "../../../graphql/queries/categories/getAssetCategories";
import { useEffect } from "react";

export const useCategoryData = (categoryClass) => {
  const dispatch = useDispatch();

  if (!categoryClass || typeof categoryClass !== "string") {
    console.warn("Invalid categoryClass provided. Using default value.");
    categoryClass = "default"; // Provide a fallback value
  }
  const { data, loading, error, refetch } = useQuery(GET_ASSET_CATEGORIES, {
    variables: { categoryClass: categoryClass },
  });

  useEffect(() => {
    if (loading) {
      dispatch(fetchCategoryRequest());
    }

    if (data) {
      console.log("category data:", data);
      dispatch(fetchCategorySuccess(data.getCategories.categories));
    }

    if (error) {
      dispatch(fetchCategoryFailure(error.message));
    }
  }, [data, loading, error, dispatch, categoryClass]);

  return { data, loading, error, refetch };
};
