import { format } from "date-fns";
import { EditIcon, Trash2Icon } from "lucide-react";
import { useQuery } from "@apollo/client";
import DatePicker from "react-datepicker";
import { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import ModalWrapper from "../core/ModalWrapper";
import { SelectField } from "../core/FormFields";
import "react-datepicker/dist/react-datepicker.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import DeliveryDetailsForm from "./DeliveryDetailsForm";
import { GET_DRIVERS } from "../../graphql/queries/driver/getDrivers";
import {
  Box,
  VStack,
  HStack,
  Text,
  Grid,
  GridItem,
  IconButton,
  Button,
} from "@chakra-ui/react";
import { useCallback } from "react";
import { toast } from "react-toastify";

const DeliveryDetails = ({ order, onClose, onSave, onChange }) => {
  const [rowData, setRowData] = useState([]);
  const [editingField, setEditingField] = useState(null);
  const [showDetailsForm, setShowDetailsForm] = useState(false);
  const [editingLineItem, setEditingLineItem] = useState(null);
  const [plannedAt, setPlannedAt] = useState(
    order.deliveryOrder?.plannedAt
      ? new Date(order.deliveryOrder.plannedAt).toISOString()
      : null
  );
  const [selectedDriver, setSelectedDriver] = useState(
    order.deliveryOrder?.driver?.name || ""
  );
  const [status, setStatus] = useState(order.status || "");

  const [deliveryOrderAttributes, setDeliveryOrderAttributes] = useState(() => {
    console.log("Initializing deliveryOrderAttributes:", order.deliveryOrder);
    return {
      plannedAt: order.deliveryOrder?.plannedAt || null,
      driverId: order.deliveryOrder?.driver?.id || "",
      lineItemsAttributes: order.deliveryOrder?.lineItemsAttributes || [],
    };
  });

  const lineItems = order.deliveryOrder?.lineItems || [];
  console.log("Line Items:", lineItems);

  const updateParent = useCallback(
    (updatedOrder) => {
      console.log("Updating parent with:", updatedOrder);
      onChange(updatedOrder);
    },
    [onChange]
  );

  useEffect(() => {
    console.log("Order updated:", order);
    setDeliveryOrderAttributes((prev) => ({
      ...prev,
      lineItemsAttributes: order.deliveryOrder?.lineItems || [],
    }));
  }, [order]);

  useEffect(() => {
    updateRowData();
  }, [deliveryOrderAttributes.lineItemsAttributes]);

  const { data: driverData } = useQuery(GET_DRIVERS);
  const drivers = driverData?.getDrivers.drivers || [];

  const formatDate = (date) =>
    date ? format(new Date(date), "eee MMM d, HH:mm") : "N/A";

  const columnDefs = [
    { headerName: "NAME", field: "name" },
    { headerName: "QUANTITY", field: "quantity" },
    { headerName: "UNITS", field: "units" },
    {
      headerName: "ACTIONS",
      field: "actions",
      cellRenderer: (params) => (
        <HStack>
          <IconButton
            size="sm"
            icon={<EditIcon size={16} />}
            onClick={() => handleEditLineItem(params.data.id)}
            aria-label="edit"
          />
          ,
          <IconButton
            size="sm"
            icon={<Trash2Icon size={16} />}
            onClick={() => handleDeleteLineItem(params.data.id)}
            aria-label="edit"
          />
          ,
        </HStack>
      ),
    },
  ];

  const defaultColDef = {
    sortable: true,
    flex: 1,
  };

  const updateRowData = () => {
    const updatedRowData = deliveryOrderAttributes.lineItemsAttributes.map(
      (item) => ({
        id: item.id,
        name: item.name || "N/A",
        quantity: item.quantity || "N/A",
        units: item.units || "N/A",
      })
    );
    console.log("Updated row data:", updatedRowData);
    setRowData(updatedRowData);
  };

  const InfoItem = ({ label, value, editable, onEdit }) => (
    <HStack justify="space-between" w="100%">
      <Text color="gray.500">{label}</Text>
      <HStack>
        <Text>{value}</Text>
        {editable && (
          <IconButton
            size="sm"
            icon={<EditIcon size={16} />}
            onClick={onEdit}
            aria-label="edit"
          />
        )}
      </HStack>
    </HStack>
  );

  const handleChange = (field, value) => {
    console.log(`Updating field: ${field} with value:`, value);

    let updatedDeliveryOrderAttributes;
    if (field.includes(".")) {
      const [parentField, childField] = field.split(".");
      updatedDeliveryOrderAttributes = {
        ...deliveryOrderAttributes,
        [parentField]: {
          ...deliveryOrderAttributes[parentField],
          [childField]: value,
        },
      };
    } else {
      updatedDeliveryOrderAttributes = {
        ...deliveryOrderAttributes,
        [field]: value,
      };
    }
    setDeliveryOrderAttributes(updatedDeliveryOrderAttributes);
    const updateOrder = {
      ...order,
      deliveryOrderAttributes: updatedDeliveryOrderAttributes,
    };
    console.log("Updated order:", updateOrder);
    onChange(updateOrder);
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    const updatedOrder = {
      ...order,
      status: newStatus,
      deliveryOrder: {
        ...order.deliveryOrder,
        completedAt:
          newStatus === "completed"
            ? new Date().toISOString()
            : order.deliveryOrder?.completedAt,
      },
    };
    handleChange("status", newStatus);
    onChange(updatedOrder);
  };

  // Save planned date
  const savePlannedAt = (newDate) => {
    setEditingField(null);
    const isoDate = newDate.toISOString();
    setPlannedAt(isoDate);
    handleChange("plannedAt", isoDate);
  };

  // Save driver selection
  const saveDriver = (newDriver) => {
    setEditingField(null);
    setSelectedDriver(newDriver);
    const selectedDriverObj = drivers.find(
      (driver) => driver.name === newDriver
    );
    if (selectedDriverObj) {
      handleChange("driverId", selectedDriverObj.id);
    }
  };

  const handleAddLineItem = (newLineItem) => {
    console.log("Adding new line item:", newLineItem);
    const updatedLineItems = [
      ...deliveryOrderAttributes.lineItemsAttributes,
      newLineItem,
    ];
    setDeliveryOrderAttributes((prev) => ({
      ...prev,
      lineItemsAttributes: updatedLineItems,
    }));

    const updatedOrder = {
      ...order,
      deliveryOrder: {
        ...order.deliveryOrder,
        lineItems: updatedLineItems,
      },
    };
    updateParent(updatedOrder);
    toast.success("Line item added successfully");
    setShowDetailsForm(false);
  };

  const handleEditLineItem = (lineItemId) => {
    console.log("Editing line item with id:", lineItemId);
    const lineItem = deliveryOrderAttributes.lineItemsAttributes.find(
      (item) => item.id === lineItemId
    );
    setEditingLineItem(lineItem);
    setShowDetailsForm(true);
  };

  const handleUpdateLineItem = (updatedLineItem) => {
    console.log("Updating line item:", updatedLineItem);
    const updatedLineItems = deliveryOrderAttributes.lineItemsAttributes.map(
      (item) => (item.id === updatedLineItem.id ? updatedLineItem : item)
    );
    setDeliveryOrderAttributes((prev) => ({
      ...prev,
      lineItemsAttributes: updatedLineItems,
    }));

    const updatedOrder = {
      ...order,
      deliveryOrder: {
        ...order.deliveryOrder,
        lineItems: updatedLineItems,
      },
    };
    updateParent(updatedOrder);
    toast.success("Line item edited successfully");
    setShowDetailsForm(false);
    setEditingLineItem(null);
  };

  const handleDeleteLineItem = (lineItemId) => {
    console.log("Deleting line item with id:", lineItemId);
    const updatedLineItems = deliveryOrderAttributes.lineItemsAttributes.filter(
      (item) => item.id !== lineItemId
    );
    setDeliveryOrderAttributes((prev) => ({
      ...prev,
      lineItemsAttributes: updatedLineItems,
    }));

    const updatedOrder = {
      ...order,
      deliveryOrder: {
        ...order.deliveryOrder,
        lineItems: updatedLineItems,
      },
    };
    updateParent(updatedOrder);
    toast.success("Line item deleted successfully");
  };

  const handleSaveWrapper = () => {
    const updatedOrder = {
      id: order.id,
      status: status,
      startedAt: order.startedAt,
      customerId: order.customer?.id || "defaultCustomerId",
      recurring: order.recurring,
      deliveryOrderAttributes: {
        plannedAt: plannedAt,
        completedAt: order.deliveryOrder?.completedAt,
        driverId: deliveryOrderAttributes.driverId,
        lineItemsAttributes: deliveryOrderAttributes.lineItemsAttributes,
        customerBranchId: order.deliveryOrder?.customerBranch?.id,
        assetId: order.deliveryOrder?.asset?.id,
      },
    };

    console.log("Sending updated order:", updatedOrder);
    onSave(updatedOrder);
  };

  return (
    <ModalWrapper
      isOpen={true}
      onClose={onClose}
      title="Delivery Order"
      maxWidth={1600}
      onSave={handleSaveWrapper}
    >
      <Box bg="gray.800" p={4} color="white" borderRadius={5}>
        <VStack align="stretch" spacing={4}>
          <HStack justify="space-between">
            <Text fontSize="xl">Delivery Order</Text>
          </HStack>

          <HStack spacing={4} maxWidth="70%">
            <SelectField
              label="Status"
              value={status}
              name="status"
              onChange={handleStatusChange}
              options={["pending", "completed", "cancelled"]}
            />
            <Text color="cyan.300" w={700}>
              {order.customer?.name}
            </Text>
            <Text color="cyan.300" w={700}>
              {order.deliveryOrder?.customerBranch?.name}
            </Text>
          </HStack>

          <Grid templateColumns="repeat(3, 1fr)" gap={4}>
            <GridItem>
              <VStack align="stretch" bg="gray.700" p={4} borderRadius="md">
                <Text fontWeight="bold">Customer Details</Text>
                <InfoItem label="NAME" value={order.customer?.name || "N/A"} />
                <InfoItem
                  label="EMAIL"
                  value={order.customer?.email || "N/A"}
                />
                <InfoItem
                  label="ADDRESS"
                  value={order.customer?.address || "N/A"}
                />
                <InfoItem
                  label="ZIPCODE"
                  value={order.customer?.zipcode || "N/A"}
                />
                <InfoItem
                  label="PHONE NO"
                  value={order.customer?.phoneNo || "N/A"}
                />
              </VStack>
            </GridItem>
            <GridItem>
              <VStack align="stretch" bg="gray.700" p={4} borderRadius="md">
                <Text fontWeight="bold">Delivery Details</Text>
                {editingField === "plannedAt" ? (
                  <DatePicker
                    selected={plannedAt ? new Date(plannedAt) : null}
                    onChange={(date) => savePlannedAt(date)}
                    showTimeSelect
                    dateFormat="eee MMM d, HH:mm"
                  />
                ) : (
                  <InfoItem
                    label="PLANNED AT"
                    value={formatDate(plannedAt)}
                    editable
                    onEdit={() => setEditingField("plannedAt")}
                  />
                )}
                <InfoItem
                  label="CREATED AT"
                  value={formatDate(order.deliveryOrder?.createdAt)}
                />
                <InfoItem
                  label="STARTED AT"
                  value={formatDate(order.startedAt)}
                />
                <InfoItem
                  label="COMPLETED AT"
                  value={formatDate(order.deliveryOrder?.completedAt) || "N/A"}
                />
                {editingField === "driver" ? (
                  <SelectField
                    label="Driver"
                    name="driver"
                    value={selectedDriver}
                    onChange={(e) => saveDriver(e.target.value)}
                    options={
                      drivers?.length > 0 ? drivers.map((d) => d.name) : []
                    }
                  />
                ) : (
                  <InfoItem
                    label="DRIVER NAME"
                    value={selectedDriver || "N/A"}
                    editable
                    onEdit={() => setEditingField("driver")}
                  />
                )}
              </VStack>
            </GridItem>
            <GridItem>
              <VStack align="stretch" bg="gray.700" p={4} borderRadius="md">
                <Text fontWeight="bold">Asset Details</Text>
                <InfoItem
                  label="ASSET ID"
                  value={order.deliveryOrder?.asset?.assetId || "N/A"}
                />
                <InfoItem
                  label="ASSET CATEGORY"
                  value={order.deliveryOrder?.asset?.assetCategory || "N/A"}
                />
              </VStack>
            </GridItem>
          </Grid>

          <HStack justify="space-between">
            <Text fontWeight="bold">LineItems</Text>
            <Button colorScheme="cyan" onClick={() => setShowDetailsForm(true)}>
              Add LineItem
            </Button>
          </HStack>

          <Box className="ag-theme-quartz-dark" height="200px" width="100%">
            <AgGridReact
              defaultColDef={defaultColDef}
              columnDefs={columnDefs}
              rowData={rowData}
              domLayout="autoHeight"
            />
          </Box>

          {showDetailsForm && (
            <DeliveryDetailsForm
              onClose={() => setShowDetailsForm(false)}
              onSave={
                editingLineItem ? handleUpdateLineItem : handleAddLineItem
              }
              initialLineItem={editingLineItem}
            />
          )}
        </VStack>
      </Box>
    </ModalWrapper>
  );
};

export default DeliveryDetails;
