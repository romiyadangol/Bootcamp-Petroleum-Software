import { useMutation } from "@apollo/client";
import { DELETE_ASSET } from "../../../../../graphql/mutation/assets/deleteAsset";
import { toast } from "react-toastify";

export const useDeleteAssetMutation = (refetch) => {
  const [deleteAsset] = useMutation(DELETE_ASSET, {
    onCompleted: () => {
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return deleteAsset;
};
