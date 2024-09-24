import Toastify from "../Toastify";
import { toast } from "react-toastify";
import { useQuery } from "@apollo/client";
import DatePicker from "../core/DatePicker";
import AgGridTable from "../core/AgGridTable";
import ActionButtons from "../core/ActionButtons";
import DeliveryForm from "../delivery/DeliveryForm";
import { useColorModeValue } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { Spinner, Box } from "@chakra-ui/react";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useEffect, useMemo, useState } from "react";
import { GET_ORDERS } from "../../graphql/queries/delivery/getOrders";
import { GET_RECURRING_ORDERS } from "../../graphql/queries/delivery/getRecurringOrders";
import {
  useCreateDeliveryMutation,
  useDeleteDeliveryMutation,
  useUpdateDeliveryMutation,
  useUploadDeliveryMutation,
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
import { convertFileToBase64 } from "../../helper/utils";
import DeliveryDetails from "../delivery/DeliveryDetails";
import { format, isSameDay, parseISO } from "date-fns";

export default function DeliveryList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [order, setOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState({ startDate: new Date() });
  const [mode, setMode] = useState("create");
  const [gridRef, setGridRef] = useState(null);
  const [orderType, setOrderType] = useState("Order Group");
  const dispatch = useDispatch();

  const orderFilterTypes = ["Order Group", "Recurring Order"];

  // delivery queries
  const { data, loading, error, refetch } = useQuery(
    orderType === "Order Group" ? GET_ORDERS : GET_RECURRING_ORDERS
  );

  const getTomorrowDate = (baseDate) => {
    const today = baseDate ? new Date(baseDate) : new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return tomorrow.toISOString();
  };

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

  // Refetch on orderType change
  useEffect(() => {
    refetch();
  }, [orderType, refetch]);

  const rowData = useSelector((state) => state.delivery.orders);

  // delivery mutations
  const uploadDeliveryMutation = useUploadDeliveryMutation(refetch);
  const createDeliveryMutation = useCreateDeliveryMutation(refetch);
  const deleteDeliveryMutation = useDeleteDeliveryMutation(refetch);
  const updateDeliveryMutation = useUpdateDeliveryMutation(refetch);

  const handleEdit = (order) => {
    setOrder(order);
    setMode("edit");
    setShowDeliveryModal(true);
  };

  const handleDelete = (orderId) => {
    deleteDeliveryMutation({
      variables: { orderId },
      onCompleted: () => {
        setShowDeliveryModal(false);
        console.log("order deleted>>>>");
        toast.success("Order deleted successfully");
        refetch();
        dispatch(deleteDelivery(orderId));
      },
    });
  };

  const handleFileChange = async (e) => {
    const csv_file = await convertFileToBase64(e.target.files[0]);

    if (csv_file) {
      console.log("Selected file:", csv_file);

      uploadDeliveryMutation({
        variables: { file: csv_file },
        onCompleted: (data) => {
          console.log("Order created csv:", data);
          refetch();
          toast.success("Order uploaded successfully");
        },
      });
    } else {
      toast.error("Please select a valid CSV file.");
    }
  };
  const formatDate = (date) =>
    date ? format(parseISO(date), "eee MMM d, HH:mm") : "N/A";

  // Inside DeliveryList.jsx

  const handleSave = (order) => {
    if (order) {
      const startedAt = order.startedAt
        ? format(parseISO(order.startedAt), "yyyy-MM-dd'T'HH:mm:ss")
        : null;
      const completedAt = order.completedAt
        ? format(parseISO(order.completedAt), "yyyy-MM-dd'T'HH:mm:ss")
        : null;
      const cancelledAt = order.cancelledAt
        ? format(parseISO(order.cancelledAt), "yyyy-MM-dd'T'HH:mm:ss")
        : null;

      const mappedDeliveryOrderAttributes = {
        status: order.status,
        startedAt: startedAt,
        completedAt: completedAt,
        cancelledAt: cancelledAt,
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
          customerBranchId: order.deliveryOrderAttributes?.customerBranchId,
          assetId: order.deliveryOrderAttributes?.assetId,
          driverId: order.deliveryOrderAttributes?.driverId,
          lineItemsAttributes:
            order.deliveryOrderAttributes?.lineItemsAttributes?.map((item) => ({
              name: item.name,
              quantity: item.quantity,
              units: item.units,
            })) || [],
        },
      };
      console.log(
        "Mapped Delivery Order Attributes:",
        mappedDeliveryOrderAttributes
      );

      if (mode === "edit") {
        updateDeliveryMutation({
          variables: {
            orderId: order.id,
            orderInfo: mappedDeliveryOrderAttributes,
          },
          onCompleted: (data) => {
            if (data.editOrder.errors && data.editOrder.errors.length > 0) {
              toast.error(
                "Error updating delivery: " + data.editOrder.errors.join(", ")
              );
            } else {
              dispatch(updateDelivery(order)); // Dispatch the updated order
              toast.success(data.editOrder.message);
              setShowDeliveryModal(false);
              refetch();
            }
          },
          onError: (error) => {
            toast.error("Error updating delivery: " + error.message);
          },
        });
      } else {
        createDeliveryMutation({
          variables: {
            orderGroupInfo: mappedDeliveryOrderAttributes,
          },
          onCompleted: (data) => {
            dispatch(addDelivery(data.createOrder.order));
            toast.success("Order Created");
            setShowModal(false);
            refetch();
          },
          onError: (error) => {
            toast.error("Error creating delivery: " + error.message);
          },
        });
      }
    }
  };

  const handleRowClicked = (params) => {
    console.log("Row Clicked Data:", params.data);
    setOrder(params.data);
    setMode("edit");
    setShowDeliveryModal(true);
  };

  const onBtnExport = useCallback(() => {
    const dataToExport = rowData.map((order) => ({
      status: order.status,
      startedAt: order.startedAt,
      completedAt: order.completedAt ?? "N/A",
      cancelledAt: order.cancelledAt ?? "N/A",
      // customerId: order.customer?.id,
      customerName: order.customer?.name,
      recurring: order.recurring
        ? JSON.stringify({
            frequency: order.recurring.frequency || "Daily",
            startedAt: order.recurring.startedAt || getTomorrowDate(),
            endAt: order.recurring.endAt || "N/A",
          })
        : "null",
      deliveryOrderAttributes: JSON.stringify({
        plannedAt: order.deliveryOrder?.plannedAt,
        completedAt: order.deliveryOrder?.completedAt,
        // customerBranchId: order.deliveryOrder?.customerBranch?.id,
        customerBranchName: order.deliveryOrder?.customerBranch?.name,
        // assetId: order.deliveryOrder?.asset?.id,
        assetCategory: order.deliveryOrder?.asset?.assetCategory,
        // driverId: order.deliveryOrder?.driver?.id,
        driverName: order.deliveryOrder?.driver?.name,
      }),
      lineItemsAttributes: JSON.stringify(
        order.deliveryOrder?.lineItems?.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          units: item.units,
        })) || []
      ),
    }));
    console.log("Data to export:", dataToExport);

    const csvContent = [
      // CSV Header
      "status,started_at,completedAt,cancelledAt,customer_name,recurring,delivery_order_attributes,line_items_attributes",
      // CSV Rows
      ...dataToExport.map((row) =>
        Object.values(row)
          .map((value) =>
            typeof value === "string" ? `"${value.replace(/"/g, '""')}"` : value
          )
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `delivery_list_${format(new Date(), "yyyy-MM-dd")}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [rowData]);

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      flex: 1,
    }),
    []
  );

  const statusCellRenderer = (params) => {
    let statusColor;
    switch (params.value) {
      case "completed":
        statusColor = "green";
        break;
      case "pending":
        statusColor = "orange";
        break;
      case "cancelled":
        statusColor = "red";
        break;
      default:
        statusColor = "gray";
    }
    return (
      <div
        style={{
          borderRadius: "12px",
          color: "white",
          backgroundColor: statusColor,
          fontWeight: "bold",
          textAlign: "center",
          width: "60%",
          padding: "15px",
          height: "25px",
          marginTop: "5px",
          position: "relative",
        }}
      >
        <span
          style={{
            display: "block",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          {params.value}
        </span>
      </div>
    );
  };

  const [colDefs, setColDefs] = useState(
    [
      {
        headerName: "Status",
        field: "status",
        cellRenderer: statusCellRenderer,
      },
      {
        headerName: "Started At",
        field: "startedAt",
        valueGetter: (params) => formatDate(params.data.startedAt),
      },
      {
        headerName: "Created By",
        field: "user?.name",
        valueGetter: (params) => params.data.user?.name || "N/A",
      },
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

  const filteredRowData = useMemo(() => {
    if (!rowData) return [];

    return rowData.filter((item) => {
      const createdAt = item.createdAt ? parseISO(item.createdAt) : null;
      const isDateInRange =
        !selectedDate || isSameDay(createdAt, selectedDate.startDate);

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
          <DatePicker
            selected={selectedDate ? selectedDate.startDate : new Date()}
            onChange={setSelectedDate}
            refetch={refetch}
          />
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
          <label
            style={{
              background: "blue",
              padding: "12px",
              fontWeight: "bold",
              borderRadius: "5px",
              fontSize: "16px",
              color: "white",
              marginRight: "10px",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            Import from CSV
            <input
              type="file"
              id="upload-photo"
              className="file-input"
              accept=".csv"
              onChange={(e) => handleFileChange(e)}
              style={{ display: "none" }}
            />
          </label>
          <button
            style={{
              border: `1px solid ${buttonbg}`,
              padding: 12,
              borderRadius: 5,
              fontWeight: "bold",
              fontSize: 16,
              background: "blue",
              whiteSpace: "nowrap",
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
        gridRef={gridRef}
        onGridReady={(params) => setGridRef(params)}
        pagination={true}
        onRowClicked={(row) => {
          if (
            row.event.target.tagName === "BUTTON" ||
            row.event.target.tagName === "svg"
          ) {
            return;
          } else {
            handleRowClicked(row);
          }
        }}
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

      {showDeliveryModal && (
        <DeliveryDetails
          order={order}
          mode={mode}
          setMode={setMode}
          onChange={(order) => setOrder(order)}
          onSave={handleSave}
          onClose={() => setShowDeliveryModal(false)}
        />
      )}
      <Toastify />
    </div>
  );
}
