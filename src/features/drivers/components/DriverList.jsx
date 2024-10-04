import { useMemo, useState } from "react";
import { Box, Spinner, useColorModeValue } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import AgGridTable from "../../../components/core/AgGridTable";
import ActionButtons from "../../../components/core/ActionButtons";
import DriverForm from "./DriverForm";
import Toastify from "../../../components/Toastify";
import { useDriverData } from "../hooks/useDriverData";
import { useDriverActions } from "../hooks/useDriverActions";
import StatusCellRenderer from "../../../components/core/StatusCellRenderer";

export default function DriverList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [driver, setDriver] = useState(null);
  const [mode, setMode] = useState("create");

  const { rowData, loading, error, refetch } = useDriverData();
  const { handleEdit, handleDelete, handleSave } = useDriverActions(refetch);

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      flex: 1,
      editable: true,
    }),
    []
  );

  const colDefs = useMemo(
    () => [
      { headerName: "Name", field: "name" },
      { headerName: "Phone", field: "phone" },
      { headerName: "Email", field: "email" },
      {
        headerName: "Status",
        field: "status",
        cellRenderer: StatusCellRenderer,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: { values: ["Active", "Inactive"] },
      },
      {
        headerName: "Actions",
        cellRenderer: (params) => (
          <ActionButtons
            onEdit={() =>
              handleEdit(params.data, setDriver, setMode, setShowModal)
            }
            onDelete={() => handleDelete(params.data.id)}
          />
        ),
      },
    ],
    [handleEdit, handleDelete]
  );

  const filteredRowData = rowData.filter((item) =>
    Object.values(item).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const theme = useColorModeValue("ag-theme-quartz", "ag-theme-quartz-dark");
  const inputbg = useColorModeValue("#EDF2F7", "#121212");
  const buttonbg = useColorModeValue("#EDF2F7", "#121212");

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

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className={theme} style={{ height: 700 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: 15,
          justifyContent: "space-between",
        }}
      >
        <h2 style={{ fontSize: 25, fontWeight: "bold", padding: 15 }}>
          Driver List
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
              setMode("create");
              setDriver({});
              setShowModal(true);
            }}
          >
            <FontAwesomeIcon icon={faCirclePlus} color="orange" />
            &nbsp; Create New Driver
          </button>
        </div>
      </div>
      <AgGridTable
        rowData={filteredRowData}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
      />
      {showModal && (
        <DriverForm
          showModal={showModal}
          mode={mode}
          driver={driver || {}}
          onChange={(e) =>
            setDriver({ ...driver, [e.target.name]: e.target.value })
          }
          onSave={() => handleSave(driver, mode, setDriver, setShowModal)}
          onClose={() => setShowModal(false)}
        />
      )}
      <Toastify />
    </div>
  );
}
