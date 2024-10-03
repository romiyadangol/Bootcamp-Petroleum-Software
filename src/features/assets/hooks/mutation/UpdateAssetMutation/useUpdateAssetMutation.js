import { useMutation } from "@apollo/client";
import { UPDATE_ASSET } from "../../../../../graphql/mutation/assets/updateAsset";
import { toast } from "react-toastify";

export const useUpdateAssetMutation = (refetch) => {
  const [updateAsset] = useMutation(UPDATE_ASSET, {
    onCompleted: () => {
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return updateAsset;
};
