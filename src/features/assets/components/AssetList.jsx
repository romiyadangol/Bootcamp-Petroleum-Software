import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useColorModeValue } from "@chakra-ui/react";
import AgGridTable from "../../../components/core/AgGridTable";
import ActionButtons from "../../../components/core/ActionButtons";
import { useAssetActions } from "../hooks/useAssetActions";
import StatusCellRenderer from "./StatusCellRenderer";
import Toastify from "../../../components/Toastify";
import Header from "./Header";
import AssetForm from "./AssetForm";

export default function AssetList() {
  const assets = useSelector((state) => state.asset.assets || []);
  const {
    mode,
    asset,
    handleSave,
    searchQuery,
    showModal,
    setSearchQuery,
    setShowModal,
    setAsset,
    setMode,
    handleEdit,
    handleDelete,
  } = useAssetActions();

  const inputbg = useColorModeValue("#EDF2F7", "#121212");
  const buttonbg = useColorModeValue("#EDF2F7", "#121212");

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      flex: 1,
      editable: true,
    }),
    []
  );

  const colDefs = [
    { headerName: "Asset Type", field: "assetCategory" },
    { headerName: "Asset ID", field: "assetId" },
    {
      headerName: "Status",
      field: "assetStatus",
      cellRenderer: StatusCellRenderer,
    },
    {
      headerName: "Actions",
      cellRenderer: (params) => (
        <ActionButtons
          onEdit={() => handleEdit(params.data)}
          onDelete={() => handleDelete(params.data.id)}
        />
      ),
    },
  ];

  const filteredRowData = assets.filter((item) => {
    const matchSearchQuery =
      item?.assetId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item?.assetCategory?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item?.assetStatus?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchSearchQuery;
  });

  return (
    <>
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setShowModal={setShowModal}
        setAsset={setAsset}
        setMode={setMode}
        inputbg={inputbg}
        buttonbg={buttonbg}
      />
      <AgGridTable
        rowData={filteredRowData}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
      />
      {showModal && (
        <AssetForm
          showModal={showModal}
          mode={mode}
          asset={asset || {}}
          onChange={(e) =>
            setAsset({ ...asset, [e.target.name]: e.target.value })
          }
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}
      <Toastify />
    </>
  );
}
