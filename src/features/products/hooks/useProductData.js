import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useQuery } from "@apollo/client";
import {
  fetchProductsRequest,
  fetchProductsError,
  fetchProductsSuccess,
} from "../../../redux/actions/productActions";
import { FIND_PRODUCTS } from "../../../graphql/queries/products/findProducts";

export function useProductData() {
  const dispatch = useDispatch();
  const { data, loading, error, refetch } = useQuery(FIND_PRODUCTS);

  useEffect(() => {
    if (loading) {
      dispatch(fetchProductsRequest());
    }

    if (data) {
      console.log("Products data:", data);
      dispatch(fetchProductsSuccess(data.findProducts.products));
    }

    if (error) {
      dispatch(fetchProductsError(error.message));
    }
  }, [data, loading, error, dispatch]);

  return { loading, error, refetch };
}
