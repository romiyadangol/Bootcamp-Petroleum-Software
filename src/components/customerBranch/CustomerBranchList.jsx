import Toastify from "../Toastify";
import { toast } from "react-toastify";
import { useQuery } from "@apollo/client";
import AgGridTable from "../core/AgGridTable";
import { Spinner, Box } from "@chakra-ui/react";
import ActionButtons from "../core/ActionButtons";
import { useSearchParams } from "react-router-dom";
import { useColorModeValue } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import CustomerBranchForm from "./CustomerBranchForm";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { GET_CUSTOMER_BRANCH } from "../../graphql/queries/customerBranch/getCustomerBranch";
import {
  useCreateCustomerBranchMutation,
  useDeleteCustomerBranchMutation,
  useUpdateCustomerBranchMutation,
} from "../../hooks/useCustomerBranchMutation";
import {
  addCustomerBranch,
  deleteCustomerBranch,
  fetchCustomerBranchesError,
  fetchCustomerBranchesRequest,
  fetchCustomerBranchesSuccess,
  updateCustomerBranch,
} from "../../redux/actions/customerBranchActions";

export default function CustomerBranchList() {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [customerBranch, setCustomerBranch] = useState({});
  const [mode, setMode] = useState("create");
  const dispatch = useDispatch();

  // Customer branch queries
  const { data, loading, error, refetch } = useQuery(GET_CUSTOMER_BRANCH, {
    variables: { id: searchParams.get("customerId") },
  });

  useEffect(() => {
    if (loading) {
      dispatch(fetchCustomerBranchesRequest());
    }

    if (error) {
      dispatch(fetchCustomerBranchesError(error.message));
    }

    if (data) {
      dispatch(
        fetchCustomerBranchesSuccess(data.getCustomerBranch.customerBranches)
      );
    }
  }, [data, error, loading, dispatch]);

  const rowData = useSelector(
    (state) => state.customerBranch.customerBranches || []
  );

  // Customer branch mutations
  const createCustomerBranchMutation = useCreateCustomerBranchMutation(refetch);
  const deleteCustomerBranchMutation = useDeleteCustomerBranchMutation(refetch);
  const updateCustomerBranchMutation = useUpdateCustomerBranchMutation(refetch);

  const handleEdit = (customerBranch) => {
    setCustomerBranch(customerBranch);
    setMode("edit");
    setShowModal(true);
  };

  const handleDelete = (id) => {
    deleteCustomerBranchMutation({
      variables: { id },
      onCompleted: () => {
        dispatch(deleteCustomerBranch(id));
        refetch();
        toast.success("Customer Branch Deleted");
      },
    });
  };
  const handleSave = () => {
    if (mode === "edit") {
      updateCustomerBranchMutation({
        variables: {
          id: customerBranch.id,
          branchInfo: {
            name: customerBranch.name,
            location: customerBranch.location,
            customerId: searchParams.get("customerId"),
          },
        },
        onCompleted: (data) => {
          refetch();
          setCustomerBranch({});
          toast.success("Customer Branch Updated");
          setShowModal(false);
          dispatch(
            updateCustomerBranch(data.updateCustomerBranch.customerBranch)
          );
          // setCustomerBranch({});
        },
      });
    } else {
      createCustomerBranchMutation({
        variables: {
          branchInfo: {
            name: customerBranch.name,
            location: customerBranch.location,
            customerId: searchParams.get("customerId"),
          },
        },
        onCompleted: (data) => {
          dispatch(addCustomerBranch(data.createCustomerBranch.customerBranch));
          refetch();
          toast.success("Customer Branch Created");
          setShowModal(false);
        },
      });
    }
  };

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      flex: 1,
      editable: true,
    }),
    []
  );

  const [colDefs, setColDefs] = useState(
    [
      { headerName: "Name", field: "name" },
      { headerName: "Location", field: "location" },
      { headerName: "Customer ID", field: "customerId" },
      {
        headerName: "Actions",
        cellRenderer: (params) => (
          <ActionButtons
            onEdit={() => handleEdit(params.data)}
            onDelete={() => handleDelete(params.data.id)}
          />
        ),
        width: 100,
      },
    ],
    []
  );

  const filteredRowData = rowData.filter((item) => {
    return (
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.customerId.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

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
          Customer Branch List
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
              width: 290,
              fontSize: 16,
            }}
            onClick={() => {
              setMode("create");
              setCustomerBranch({});
              setShowModal(true);
            }}
          >
            <FontAwesomeIcon icon={faCirclePlus} color="orange" />
            &nbsp; Create New Customer Branch
          </button>
        </div>
      </div>
      <AgGridTable
        rowData={filteredRowData}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
      />
      {showModal && (
        <div>
          <CustomerBranchForm
            mode={mode}
            customerBranch={customerBranch || {}}
            onChange={(e) =>
              setCustomerBranch({
                ...customerBranch,
                [e.target.name]: e.target.value,
              })
            }
            onSave={handleSave}
            onClose={() => setShowModal(false)}
          />
        </div>
      )}
      <Toastify />
    </div>
  );
}
