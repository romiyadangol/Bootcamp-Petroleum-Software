import { useMutation } from "@apollo/client"
import { toast } from "react-toastify";
import { CREATE_ASSET } from "../graphql/mutation/assets/createAsset"
import { UPDATE_ASSET } from "../graphql/mutation/assets/updateAsset";
import { DELETE_ASSET } from "../graphql/mutation/assets/deleteAsset";

export const useCreateAssetMutation = (refetch) => {
    const [ createAsset ] = useMutation(CREATE_ASSET, {
        onCompleted: () => {
            toast.success('Asset created successfully');
            refetch();
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });
    return createAsset;
};

export const useUpdateAssetMutation = (refetch) => {
    const [ updateAsset ] = useMutation(UPDATE_ASSET, {
        onCompleted: () => {
            toast.success('Asset updated successfully');
            refetch();
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });
    return updateAsset;
};

export const useDeleteAssetMutation = (refetch) => {
    const [ deleteAsset ] = useMutation(DELETE_ASSET, {
        onCompleted: () => {
            toast.success('Asset deleted successfully');
            refetch();
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });
    return deleteAsset;
};