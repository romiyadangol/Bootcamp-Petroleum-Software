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

export function useAssetActions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [asset, setAsset] = useState(null);
  const [mode, setMode] = useState("create");

  const dispatch = useDispatch();

  const createAssetMutation = useCreateAssetMutation();
  const updateAssetMutation = useUpdateAssetMutation();
  const deleteAssetMutation = useDeleteAssetMutation();

  const handleEdit = (asset) => {
    console.log("Editing asset:", asset);
    setAsset(asset);
    setMode("edit");
    setShowModal(true);
  };

  const handleDelete = (id) => {
    deleteAssetMutation({
      variables: { id },
      onCompleted: () => {
        dispatch(deleteAsset(id));
        toast.success("Asset Deleted");
      },
      onError: (error) => {
        toast.error(`Failed to delete asset: ${error.message}`);
      },
    });
  };

  const handleSave = () => {
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

    if (mode === "edit") {
      updateAssetMutation({
        variables: { id: trimmedAsset.id, assetInfo },
        onCompleted: (data) => {
          setShowModal(false);
          handleMutationSuccess(data.editAsset.asset, "Asset Updated");
        },
        onError: (error) => {
          toast.error(`Failed to update asset: ${error.message}`);
        },
      });
    } else {
      createAssetMutation({
        variables: { assetInfo },
        onCompleted: (data) => {
          handleMutationSuccess(data.createAsset.asset, "Asset Created");
        },
        onError: (error) => {
          toast.error(`Failed to create asset: ${error.message}`);
        },
      });
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
