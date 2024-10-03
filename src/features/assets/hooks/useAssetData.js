import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useQuery } from "@apollo/client";
import { GET_ASSETS } from "../../../graphql/queries/assets/getAssets";
import {
  fetchAssetsRequest,
  fetchAssetsFailure,
  fetchAssetsSuccess,
} from "../../../redux/actions/assetActions";

export function useAssetData() {
  const dispatch = useDispatch();
  const { data, loading, error, refetch } = useQuery(GET_ASSETS);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (loading) {
          dispatch(fetchAssetsRequest());
        }

        if (data) {
          dispatch(fetchAssetsSuccess(data.getAssets.assets));
        }

        if (error) {
          throw new Error(error.message);
        }
      } catch (err) {
        dispatch(fetchAssetsFailure(err.message));
      }
    };

    fetchData();
  }, [data, loading, error, dispatch]);

  console.log("Assets data:", data);

  return { data, loading, error, refetch };
}
