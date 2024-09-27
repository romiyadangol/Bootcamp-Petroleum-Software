import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@apollo/client";
import { toast } from "react-toastify";
import { Spinner, Box, useColorModeValue } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";

import Toastify from "../Toastify";
import AssetForm from "../assets/AssetForm";
import AgGridTable from "../core/AgGridTable";
import ActionButtons from "../core/ActionButtons";
import { GET_ASSETS } from "../../graphql/queries/assets/getAssets";
import {
  useCreateAssetMutation,
  useDeleteAssetMutation,
  useUpdateAssetMutation,
} from "../../hooks/useAssetMutation";
import {
  addAsset,
  deleteAsset,
  fetchAssetsRequest,
  fetchAssetsFailure,
  fetchAssetsSuccess,
  updateAsset,
} from "../../redux/actions/assetActions";

export default function AssetLists() {
  // State variables
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [asset, setAsset] = useState(null);
  const [mode, setMode] = useState("create");

  // Redux dispatch
  const dispatch = useDispatch();

  // GraphQL query
  const { data, loading, error, refetch } = useQuery(GET_ASSETS);

  // Fetch assets on component mount and when data changes
  useEffect(() => {
    if (loading) {
      dispatch(fetchAssetsRequest());
    }

    if (data) {
      console.log("Assets data:", data);
      dispatch(fetchAssetsSuccess(data.getAssets.assets));
    }

    if (error) {
      dispatch(fetchAssetsFailure(error.message));
    }
  }, [data, loading, error, dispatch]);

  // Redux state selector
  const rowData = useSelector((state) => state.asset.assets || []);

  // GraphQL mutations
  const createAssetMutation = useCreateAssetMutation(refetch);
  const updateAssetMutation = useUpdateAssetMutation(refetch);
  const deleteAssetMutation = useDeleteAssetMutation(refetch);

  // Handlers
  const handleEdit = (asset) => {
    setAsset(asset);
    setMode("edit");
    setShowModal(true);
  };

  const handleDelete = (id) => {
    deleteAssetMutation({
      variables: { id },
      onCompleted: () => {
        dispatch(deleteAsset(id));
        refetch();
        toast.success("Asset Deleted");
      },
    });
  };

  const handleSave = () => {
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
        onCompleted: (data) =>
          handleMutationSuccess(data.editAsset.asset, "Asset Updated"),
      });
    } else {
      createAssetMutation({
        variables: { assetInfo },
        onCompleted: (data) =>
          handleMutationSuccess(data.createAsset.asset, "Asset Created"),
      });
    }
  };

  const handleMutationSuccess = (assetData, message) => {
    if (mode === "edit") {
      dispatch(updateAsset(assetData));
    } else {
      dispatch(addAsset(assetData));
    }
    refetch();
    toast.success(message);
    setShowModal(false);
  };

  // Column definitions
  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      flex: 1,
      editable: true,
    }),
    []
  );

  const statusCellRenderer = (params) => {
    const status = params.value === "active" ? "success" : "danger";
    const dotStyle = {
      display: "inline-block",
      width: "10px",
      height: "10px",
      borderRadius: "50%",
      marginRight: "8px",
      backgroundColor: status === "success" ? "green" : "red",
    };
    return (
      <span>
        <span style={dotStyle}></span>
        <span className={`badge rounded-pill bg-${status}`}>
          {params.value}
        </span>
      </span>
    );
  };

  const [colDefs, setColDefs] = useState([
    { headerName: "Asset Type", field: "assetCategory" },
    { headerName: "Asset ID", field: "assetId" },
    {
      headerName: "Status",
      field: "assetStatus",
      cellRenderer: statusCellRenderer,
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
  ]);

  // Filtered row data
  const filteredRowData = rowData.filter((item) => {
    const matchSearchQuery =
      item?.assetId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item?.assetCategory?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item?.assetStatus?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchSearchQuery;
  });

  // Theme and styles
  const theme = useColorModeValue("ag-theme-quartz", "ag-theme-quartz-dark");
  const inputbg = useColorModeValue("#EDF2F7", "#121212");
  const buttonbg = useColorModeValue("#EDF2F7", "#121212");

  // Loading state
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      </Box>
    );
  }

  // Main JSX return
  return (
    <div className={theme} style={{ height: 700 }}>
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
    </div>
  );
}

// Header Component
const Header = ({
  searchQuery,
  setSearchQuery,
  setShowModal,
  setAsset,
  setMode,
  inputbg,
  buttonbg,
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      marginBottom: 15,
      justifyContent: "space-between",
    }}
  >
    <h2 style={{ fontSize: 25, fontWeight: "bold", padding: 15 }}>
      Asset List
    </h2>
    <div>
      <input
        type="text"
        placeholder="Search..."
        style={{
          marginRight: 10,
          padding: 12,
          width: 400,
          borderRadius: 5,
          background: inputbg,
          border: `1px solid ${inputbg}`,
          fontSize: 16,
        }}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button
        style={{
          border: `1px solid ${buttonbg}`,
          padding: 12,
          borderRadius: 5,
          background: buttonbg,
          fontWeight: "bold",
          width: 200,
          fontSize: 16,
        }}
        onClick={() => {
          setAsset({
            id: "",
            assetId: "",
            assetCategory: "",
            assetStatus: "",
          });
          setMode("create");
          setShowModal(true);
        }}
      >
        <FontAwesomeIcon icon={faCirclePlus} color="orange" />
        &nbsp; Create New Asset
      </button>
    </div>
  </div>
);
