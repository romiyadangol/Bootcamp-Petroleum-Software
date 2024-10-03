import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import {
  addAsset,
  deleteAsset,
  updateAsset,
} from "../../../redux/actions/assetActions";
import { useCreateAssetMutation } from "./mutation/CreateAssetMutation/useCreateAssetMutation";
import { useUpdateAssetMutation } from "./mutation/UpdateAssetMutation/useUpdateAssetMutation";
import { useDeleteAssetMutation } from "./mutation/DeleteAssetMutation/useDeleteAssetMutation";
import { useAssetData } from "./useAssetData";

export function useAssetActions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [asset, setAsset] = useState(null);
  const [mode, setMode] = useState("create");

  const dispatch = useDispatch();

  const { refetch } = useAssetData();

  const createAssetMutation = useCreateAssetMutation(refetch);
  const updateAssetMutation = useUpdateAssetMutation(refetch);
  const deleteAssetMutation = useDeleteAssetMutation(refetch);

  const handleEdit = (asset) => {
    console.log("Editing asset:", asset);
    setAsset(asset);
    setMode("edit");
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteAssetMutation({
        variables: { id },
      });
      dispatch(deleteAsset(id));
      toast.success("Asset Deleted");
      refetch();
    } catch (error) {
      toast.error(`Failed to delete asset: ${error.message}`);
    }
  };

  const handleSave = async () => {
    console.log("Asset:", asset);
    const trimmedAsset = {
      ...asset,
      assetId: asset.assetId.trim(),
      assetCategory: asset.assetCategory.trim(),
      assetStatus: asset.assetStatus.trim(),
    };

    const assetInfo = {
      assetId: trimmedAsset.assetId,
      assetCategory: trimmedAsset.assetCategory,
      assetStatus: trimmedAsset.assetStatus,
    };

    try {
      if (mode === "edit") {
        const { data } = await updateAssetMutation({
          variables: { id: trimmedAsset.id, assetInfo },
        });
        setShowModal(false);
        handleMutationSuccess(data.editAsset.asset, "Asset Updated");
        refetch();
      } else {
        const { data } = await createAssetMutation({
          variables: { assetInfo },
        });
        handleMutationSuccess(data.createAsset.asset, "Asset Created");
        refetch();
      }
    } catch (error) {
      toast.error(
        `Failed to ${mode === "edit" ? "update" : "create"} asset: ${
          error.message
        }`
      );
    }
  };

  const handleMutationSuccess = (assetData, message) => {
    console.log("Mutation succeeded:", assetData);
    if (mode === "edit") {
      dispatch(updateAsset(assetData));
    } else {
      dispatch(addAsset(assetData));
    }
    setShowModal(false);
    toast.success(message);
  };

  return {
    searchQuery,
    setSearchQuery,
    showModal,
    setShowModal,
    asset,
    setAsset,
    mode,
    setMode,
    handleEdit,
    handleDelete,
    handleSave,
  };
}
