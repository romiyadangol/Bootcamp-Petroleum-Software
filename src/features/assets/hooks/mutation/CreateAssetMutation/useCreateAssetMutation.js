import { useMutation } from "@apollo/client";
import { CREATE_ASSET } from "../../../../../graphql/mutation/assets/createAsset";
import { toast } from "react-toastify";

export const useCreateAssetMutation = (refetch) => {
  const [createAsset] = useMutation(CREATE_ASSET, {
    onCompleted: () => {
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return createAsset;
};
