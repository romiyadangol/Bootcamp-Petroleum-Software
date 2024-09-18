import Toastify from "../Toastify";
import { toast } from "react-toastify";
import { useQuery } from "@apollo/client";
import AgGridTable from "../core/AgGridTable";
import { Spinner, Box } from "@chakra-ui/react";
import ActionButtons from "../core/ActionButtons";
import DeliveryForm from "../delivery/DeliveryForm";
import { useColorModeValue } from "@chakra-ui/react";
import DatePicker from "../core/DatePicker";
import dayjs from "dayjs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GET_ORDERS } from "../../graphql/queries/delivery/getOrders";
import { GET_RECURRING_ORDERS } from "../../graphql/queries/delivery/getRecurringOrders";
import {
  useCreateDeliveryMutation,
  useDeleteDeliveryMutation,
  useUpdateDeliveryMutation,
} from "../../hooks/useDeliveryMutation";
import {
  addDelivery,
  deleteDelivery,
  fetchDeliveriesError,
  fetchDeliveriesRequest,
  fetchDeliveriesSuccess,
  updateDelivery,
} from "../../redux/actions/deliveryActions";
import { SelectField } from "../core/FormFields";

export default function DeliveryList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [order, setOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState({ startDate: dayjs() });
  const [mode, setMode] = useState("create");
  const [gridRef, setGridRef] = useState(null);
  const [orderType, setOrderType] = useState("Order Group");
  const dispatch = useDispatch();

  const orderFilterTypes = ["Order Group", "Recurring Order"];

  // delivery queries
  const { data, loading, error, refetch } = useQuery(
    orderType === "Order Group" ? GET_ORDERS : GET_RECURRING_ORDERS
  );

  useEffect(() => {
    if (loading) {
      dispatch(fetchDeliveriesRequest());
    }

    if (error) {
      dispatch(fetchDeliveriesError(error.message));
      toast.error("Error fetching deliveries: " + error.message);
    }

    if (data) {
      dispatch(
        fetchDeliveriesSuccess(
          orderType === "Order Group"
            ? data.getOrders.orders
            : data.getRecurringOrders.orders
        )
      );
    }
  }, [data, error, loading, dispatch, orderType]);

  const rowData = useSelector((state) => state.delivery.orders);

  // delivery mutations
  const createDeliveryMutation = useCreateDeliveryMutation(refetch);
  const deleteDeliveryMutation = useDeleteDeliveryMutation(refetch);
  const updateDeliveryMutation = useUpdateDeliveryMutation(refetch);

  const handleEdit = (order) => {
    setOrder(order);
    setMode("edit");
    setShowModal(true);
  };

  const handleDelete = (id) => {
    deleteDeliveryMutation({
      variables: { id },
      onCompleted: () => {
        dispatch(deleteDelivery(id));
        refetch();
        toast.success("Delivery Deleted");
      },
    });
  };

  const handleSave = (order) => {
    if (order) {
      if (mode === "edit") {
        updateDeliveryMutation({
          variables: {
            orderId: order.id,
            orderGroupInfo: {
              status: order.status,
              startedAt: order.startedAt,
              completedAt: order.completedAt,
              customerId: order.customerId,
              recurring: {
                frequency: order.recurring?.frequency,
                startedAt: order.recurring?.startedAt,
                endAt: order.recurring?.endAt,
              },
              deliveryOrderAttributes: {
                plannedAt: order.deliveryOrder?.plannedAt,
                completedAt: order.deliveryOrder?.completedAt,
                customerBranchId: order.deliveryOrder?.customerBranchId,
                assetId: order.deliveryOrder?.assetId,
                driverId: order.deliveryOrder?.driverId,
                lineItems: order.deliveryOrder?.lineItems.map((item) => ({
                  name: item.name,
                  quantity: item.quantity,
                  units: item.units,
                })),
              },
            },
          },
          onCompleted: (data) => {
            dispatch(updateDelivery(data.editOrder.UpdateOrder));
            refetch();
            toast.success("Delivery Updated");
            setShowModal(false);
          },
          onError: (error) => {
            toast.error("Error updating delivery: " + error.message);
          },
        });
      } else {
        console.log("Order:", order);

        createDeliveryMutation({
          variables: {
            orderGroupInfo: {
              status: order.status,
              startedAt: order.startedAt,
              customerId: order.customerId,
              recurring: order.recurring
                ? {
                    frequency: order.recurring.frequency || "Daily",
                    startedAt: order.recurring.startedAt || getTomorrowDate(),
                    endAt: order.recurring.endAt || null,
                  }
                : null,
              deliveryOrderAttributes: {
                plannedAt: order.deliveryOrderAttributes?.plannedAt,
                completedAt: order.deliveryOrderAttributes?.completedAt,
                customerBranchId:
                  order.deliveryOrderAttributes?.customerBranchId,
                assetId: order.deliveryOrderAttributes?.assetId,
                driverId: order.deliveryOrderAttributes?.driverId,
                lineItemsAttributes:
                  order.deliveryOrderAttributes?.lineItemsAttributes.map(
                    (item) => ({
                      name: item.name,
                      quantity: item.quantity,
                      units: item.units,
                    })
                  ),
              },
            },
          },
          onCompleted: (data) => {
            setShowModal(false);
            console.log("Order created:", data);
            refetch();
            toast.success("Order Created");
            dispatch(addDelivery(data.createOrder.order));
          },
        });
      }
    };
  };
  
  const handleSave = (order) => {
    if (!order) return;
  
    const orderData = prepareOrderData(order, mode === 'edit');
  
    const mutation = mode === 'edit' ? updateDeliveryMutation : createDeliveryMutation;
    const successMessage = mode === 'edit' ? 'Delivery Updated' : 'Order Created';
    const dispatchAction = mode === 'edit' ? updateDelivery : addDelivery;
  
    mutation({
      variables: {
        ...(mode === 'edit' ? { orderId: order.id } : {}),
        ...orderData
      },
      onCompleted: (data) => {
        toast.success(successMessage);
        dispatch(dispatchAction(mode === 'edit' ? data.editOrder.UpdateOrder : data.createOrder.order));
        refetch();
        setShowModal(false);
      },
      onError: (error) => {
        toast.error('Error updating delivery: ' + error.message);
      }
    });
  };
  
  const handleRowClicked = (params) => {
    // setOrder(params.data);
    // setMode('edit');
    // setShowModal(true);
  };

  const onBtnExport = useCallback(() => {
    gridRef.current.api.exportDataAsCsv();
  }, []);

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      flex: 1,
      editable: true,
    }),
    []
  );

  const statusCellRenderer = (params) => {
    const status = params.value === "Active" ? "success" : "danger";
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

  const [colDefs, setColDefs] = useState(
    [
      {
        headerName: "Status",
        field: "status",
        cellRenderer: statusCellRenderer,
      },
      { headerName: "Started At", field: "startedAt" },
      { headerName: "Completed At", field: "completedAt" },
      { headerName: "Customer Name", field: "customer.name" },
      { headerName: "Customer Email", field: "customer.email" },
      {
        headerName: "Asset Category",
        field: "deliveryOrder.asset.assetCategory",
      },
      { headerName: "Driver Name", field: "deliveryOrder.driver.name" },
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

  // const filteredRowData = rowData && rowData.filter((item) => {
  //     return (
  //       item.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //       item.customer?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //       item.customer?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //       item.deliveryOrder?.asset?.assetId.toLowerCase().includes(searchQuery.toLowerCase())
  //     );
  //   });

  const filteredRowData = useMemo(() => {
    if (!rowData) return [];

    return rowData.filter((item) => {
      const createdAt = dayjs(item.createdAt);
      const isDateInRange =
        !selectedDate || createdAt.isSame(selectedDate.startDate, "day");

      const matchesQuery =
        searchQuery === "" ||
        item.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.customer?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.customer?.email
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        item.deliveryOrder?.asset?.assetId
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      return isDateInRange && matchesQuery;
    });
  }, [rowData, searchQuery, selectedDate]);

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
          Orders List
        </h2>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 15,
            justifyContent: "space-between",
            marginTop: 15,
          }}
        >
          <div
            style={{ width: "200px", marginRight: "10px", marginTop: "12px" }}
          >
            <SelectField
              name="categoryClass"
              value={orderType}
              onChange={(e) => setOrderType(e.target.value)}
              options={orderFilterTypes}
            />
          </div>
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
          <DatePicker selected={selectedDate} onChange={setSelectedDate} />
          <button
            style={{
              border: `1px solid ${buttonbg}`,
              padding: 12,
              borderRadius: 5,
              background: buttonbg,
              fontWeight: "bold",
              width: "max-content",
              fontSize: 16,
              marginRight: 10,
              whiteSpace: "nowrap",
            }}
            onClick={() => setShowModal(true)}
          >
            <FontAwesomeIcon icon={faCirclePlus} color="orange" />
            &nbsp; Create New Delivery Order
          </button>
          <button
            style={{
              border: `1px solid ${buttonbg}`,
              padding: 12,
              borderRadius: 5,
              background: buttonbg,
              fontWeight: "bold",
              fontSize: 16,
            }}
            onClick={onBtnExport}
          >
            Export to CSV
          </button>
        </div>
      </div>
      <AgGridTable
        rowData={filteredRowData}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
        onGridReady={(params) => setGridRef(params)}
        pagination={true}
        onRowClicked={handleRowClicked}
      />
      {showModal && (
        <DeliveryForm
          order={order}
          mode={mode}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
          onChange={(e) =>
            setOrder({ ...order, [e.target.name]: e.target.value })
          }
        />
      )}
    </div>
  );
}
