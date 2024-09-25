import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Checkbox,
  Input,
  Select,
  Switch,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import ModalWrapper from "../core/ModalWrapper";
import { InputField, SelectField } from "../core/FormFields";
import { useQuery } from "@apollo/client";
import { GET_CUSTOMERS } from "../../graphql/queries/customers/getCustomers";
import { GET_CUSTOMER_BRANCH } from "../../graphql/queries/customerBranch/getCustomerBranch";
import { FIND_PRODUCTS } from "../../graphql/queries/products/findProducts";
import { GET_DRIVERS } from "../../graphql/queries/driver/getDrivers";
import { GET_ASSETS } from "../../graphql/queries/assets/getAssets";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

//dates
const convertToISO8601 = (datetimeLocal) => {
  const date = new Date(datetimeLocal);
  return date.toISOString();
};

const convertToDatetimeLocal = (isoString) => {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export default function DeliveryForm({
  selectedDate,
  order,
  onChange,
  onSave,
  onClose,
}) {
  const [step, setStep] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedLineItems, setSelectedLineItems] = useState([]);
  const [recurring, setRecurring] = useState(false);
  const [newProductName, setNewProductName] = useState("");
  const [newProductUnit, setNewProductUnit] = useState("");
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [plannedAt, setPlannedAt] = useState(() => {
    const now = new Date().toISOString();
    return convertToDatetimeLocal(selectedDate.startDate);
  });

  const { data: customersData } = useQuery(GET_CUSTOMERS);
  const customers = customersData?.getCustomers.customers || [];

  const { data: branchesData, refetch: refetchBranches } = useQuery(
    GET_CUSTOMER_BRANCH,
    {
      variables: { id: selectedCustomer?.id },
      skip: !selectedCustomer,
    }
  );
  const branches = branchesData?.getCustomerBranch.customerBranches || [];

  const { data: productData } = useQuery(FIND_PRODUCTS);
  const products = productData?.findProducts.products || [];

  const { data: driverData } = useQuery(GET_DRIVERS);
  const drivers = driverData?.getDrivers.drivers || [];

  const { data: assetData } = useQuery(GET_ASSETS);
  const assets = assetData?.getAssets.assets || [];

  const getTomorrowDate = (baseDate) => {
    const today = baseDate ? new Date(baseDate) : new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return tomorrow.toISOString();
  };

  const defaultStartDate = convertToDatetimeLocal(getTomorrowDate());

  const handlePlannedAtChange = (e) => {
    const newDatetimeLocal = e.target.value;
    console.log("Local Time Input:", newDatetimeLocal);
    const isoString = convertToISO8601(newDatetimeLocal);
    console.log("Converted ISO 8601:", isoString);
    setPlannedAt(newDatetimeLocal);
  };

  const handleAddLineItem = (product) => {
    const newLineItem = {
      id: product.id,
      name: product.name,
      units: product.productUnit,
      quantity: "",
      deliveryOrderId: order.id,
      checked: false,
    };
    setSelectedLineItems([...selectedLineItems, newLineItem]);
  };

  const handleQuantityChange = (itemId, quantity) => {
    setSelectedLineItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const handleDeleteLineItems = (itemId) => {
    setSelectedLineItems((prevItems) =>
      prevItems.filter((item) => item.id !== itemId)
    );
  };

  const handleCheckboxChange = (itemId, isChecked) => {
    if (isChecked) {
      setSelectedLineItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId ? { ...item, checked: isChecked } : item
        )
      );
    } else {
      setSelectedLineItems((prevItems) =>
        prevItems.filter((item) => item.id !== itemId)
      );
    }
  };

  useEffect(() => {
    if (selectedCustomer) {
      refetchBranches().catch((err) => {
        console.error("Error refetching branches:", err);
      });
    }
  }, [selectedCustomer, refetchBranches]);

  useEffect(() => {
    if (branches.length > 0 && !selectedBranch) {
      const defaultBranch = branches[0];
      setSelectedBranch(defaultBranch);

      const updatedOrder = {
        orderGroupInfo: {
          status: "pending",
          startedAt: convertToISO8601(plannedAt),
          completedAt: null,
          customerId: selectedCustomer?.id || null,
          recurring: recurring
            ? {
                frequency: order.frequency || "Daily",
                startedAt: new Date(order.startedAt).toISOString(),
                endAt: new Date(order.endAt).toISOString(),
              }
            : null,
          deliveryOrderAttributes: {
            name: defaultBranch.name,
            location: defaultBranch.location,
            plannedAt: convertToISO8601(plannedAt),
            customerBranchId: defaultBranch.id,
            assetId: selectedAsset?.id || null,
            driverId: selectedDriver?.id || null,
            lineItemsAttributes: selectedLineItems.map((item) => ({
              name: item.name,
              quantity: parseFloat(item.quantity) || 0,
              units: item.units,
            })),
          },
        },
      };
      onChange({ target: { name: "order", value: updatedOrder } });
    }
  }, [
    branches,
    selectedAsset,
    selectedBranch,
    selectedDriver,
    selectedLineItems,
    selectedCustomer,
    recurring,
    order,
    plannedAt,
    onChange,
  ]);

  const handleNextStep = () => {
    if (step === 1 && selectedCustomer) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else {
      const getValidDate = (date) =>
        date ? new Date(date).toISOString() : null;
      const updatedOrder = {
        status: "pending",
        startedAt: convertToISO8601(plannedAt),
        completedAt: null,
        customerId: selectedCustomer?.id || null,
        recurring: recurring
          ? {
              frequency: order.frequency || "Daily",
              startedAt: getValidDate(order.startedAt),
              endAt: getValidDate(order.endAt),
            }
          : null,
        deliveryOrderAttributes: {
          plannedAt: convertToISO8601(plannedAt),
          completedAt: null,
          customerBranchId: selectedBranch?.id || null,
          orderGroupId: null,
          assetId: selectedAsset?.id || null,
          driverId: selectedDriver?.id || null,
          lineItemsAttributes: selectedLineItems.map((item) => ({
            name: item.name,
            quantity: parseFloat(item.quantity) || 0,
            units: item.units,
          })),
        },
      };
      onSave(updatedOrder);
    }
  };

  const handlePreviousStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSaveNewProduct = () => {
    if (newProductName && newProductUnit) {
      const newProduct = {
        id: Date.now(),
        name: newProductName,
        productUnit: newProductUnit,
        checked: false,
      };
      setSelectedLineItems([...selectedLineItems, newProduct]);
      setIsProductModalOpen(false);
    }
  };

  const handleCustomerChange = (customer) => {
    setSelectedCustomer(customer);
    setSelectedBranch(null);

    const updatedOrder = {
      orderGroupInfo: {
        status: "pending",
        startedAt: convertToISO8601(plannedAt),
        customerId: customer.id || null,
        deliveryOrderAttributes: {
          name: selectedBranch?.name || "",
          location: selectedBranch?.location || "",
          plannedAt: plannedAt,
          customerBranchId: selectedBranch?.id || null,
          assetId: selectedAsset?.id || null,
          driverId: selectedDriver?.id || null,
          lineItemsAttributes: selectedLineItems.map((item) => ({
            name: item.name,
            quantity: parseFloat(item.quantity) || 0,
            units: item.units,
          })),
        },
      },
    };

    onChange({ target: { name: "order", value: updatedOrder } });
  };

  const handleBranchChange = (branch) => {
    setSelectedBranch(branch);

    const updatedOrder = {
      orderGroupInfo: {
        status: "pending",
        startedAt: convertToISO8601(plannedAt),
        customerId: selectedCustomer?.id || null,
        deliveryOrderAttributes: {
          name: branch.name,
          location: branch.location,
          plannedAt: plannedAt,
          customerBranchId: branch.id || null,
          assetId: selectedAsset?.id || null,
          driverId: selectedDriver?.id || null,
          lineItemsAttributes: selectedLineItems.map((item) => ({
            name: item.name,
            quantity: parseFloat(item.quantity) || 0,
            units: item.units,
          })),
        },
      },
    };

    onChange({ target: { name: "order", value: updatedOrder } });
  };

  const handleDriverChange = (driver) => {
    setSelectedDriver(driver);

    const updatedOrder = {
      orderGroupInfo: {
        status: "pending",
        startedAt: convertToISO8601(plannedAt),
        customerId: selectedCustomer?.id || null,
        deliveryOrderAttributes: {
          name: selectedBranch?.name || "",
          location: selectedBranch?.location || "",
          plannedAt: plannedAt,
          customerBranchId: selectedBranch?.id || null,
          assetId: selectedAsset?.id || null,
          driverId: driver.id || null,
          lineItemsAttributes: selectedLineItems.map((item) => ({
            name: item.name,
            quantity: parseFloat(item.quantity) || 0,
            units: item.units,
          })),
        },
      },
    };

    onChange({ target: { name: "order", value: updatedOrder } });
  };

  const handleAssetChange = (asset) => {
    setSelectedAsset(asset);

    const updatedOrder = {
      orderGroupInfo: {
        status: "pending",
        startedAt: convertToISO8601(plannedAt),
        customerId: selectedCustomer?.id || null,
        deliveryOrderAttributes: {
          name: selectedBranch?.name || "",
          location: selectedBranch?.location || "",
          plannedAt: plannedAt,
          customerBranchId: selectedBranch?.id || null,
          assetId: selectedAsset?.id || null,
          driverId: selectedDriver?.id || null,
          lineItemsAttributes: selectedLineItems.map((item) => ({
            name: item.name,
            quantity: parseFloat(item.quantity) || 0,
            units: item.units,
          })),
        },
      },
    };

    onChange({ target: { name: "order", value: updatedOrder } });
  };

  return (
    <>
      <ModalWrapper
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        title="Add New Product"
        onSave={handleSaveNewProduct}
        maxWidth="500px"
        showSaveButton={true}
      >
        <InputField
          label="Product Name"
          name="productName"
          value={newProductName}
          onChange={(e) => setNewProductName(e.target.value)}
        />
        <InputField
          label="Unit"
          name="productUnit"
          value={newProductUnit}
          onChange={(e) => setNewProductUnit(e.target.value)}
        />
      </ModalWrapper>

      <ModalWrapper
        isOpen={true}
        onClose={onClose}
        title="Create Delivery Order"
        onSave={onSave}
        maxWidth={1600}
        showSaveButton={false}
      >
        <Box display="flex" height="100%">
          <Box flex="1" padding="20px">
            <Tabs
              index={step - 1}
              onChange={(index) => setStep(index + 1)}
              isFitted
              variant="enclosed"
            >
              <TabList mb={4}>
                <Tab isDisabled={step === 1}>Step 1: Select Customer</Tab>
                <Tab isDisabled={step === 2}>Step 2: Select Branch</Tab>
                <Tab isDisabled={step === 3}>Step 3: Delivery Details</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  {step === 1 && (
                    <>
                      <SelectField
                        label="Customer"
                        name="customer"
                        value={selectedCustomer ? selectedCustomer.name : ""}
                        onChange={(e) => {
                          const customer = customers.find(
                            (cust) => cust.name === e.target.value
                          );
                          setSelectedCustomer(customer);
                          handleCustomerChange(customer);
                        }}
                        options={customers.map((cust) => cust.name)}
                      />
                      <Button onClick={handleNextStep} mr={4}>
                        Next
                      </Button>
                    </>
                  )}
                </TabPanel>

                <TabPanel>
                  {step === 2 &&
                    selectedCustomer &&
                    (console.log("Selected Customer:", selectedCustomer),
                    (
                      <>
                        <h2>Customer Branch: </h2>
                        <SelectField
                          label="Branch"
                          name="branch"
                          value={selectedBranch ? selectedBranch.name : ""}
                          onChange={(e) => {
                            const branch = branches.find(
                              (b) => b.name === e.target.value
                            );
                            handleBranchChange(branch);
                          }}
                          options={branches.map((branch) => branch.name)}
                        />
                        <SelectField
                          label="Location"
                          name="location"
                          value={selectedBranch ? selectedBranch.location : ""}
                          onChange={(e) => {
                            const branch = branches.find(
                              (b) => b.location === e.target.value
                            );
                            handleBranchChange(branch);
                          }}
                          options={branches.map((branch) => branch.location)}
                        />
                        <Button onClick={handlePreviousStep} mr={4} mt={5}>
                          Back
                        </Button>
                        <Button onClick={handleNextStep} mr={4} mt={5}>
                          Next
                        </Button>
                      </>
                    ))}
                </TabPanel>

                <TabPanel>
                  {step === 3 && selectedCustomer && (
                    <>
                      <Box>
                        <h2>Customer Details</h2>
                        <p>Name: {selectedCustomer.name}</p>
                        <p>Customer Branch: {selectedBranch.name}</p>
                        <p>Location: {selectedBranch.location}</p>
                        <p>Zip: {selectedCustomer.zipcode}</p>
                      </Box>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        bg="gray.800"
                        p={4}
                        borderRadius="md"
                        color="white"
                      >
                        <Box flex="1">
                          <h2>Bulk Delivery</h2>
                          <Select
                            placeholder="Select Product"
                            onChange={(e) => {
                              const selectedProduct = products.find(
                                (product) => product.id === e.target.value
                              );
                              if (selectedProduct) {
                                handleAddLineItem(selectedProduct);
                              }
                            }}
                          >
                            {products.map((product) => (
                              <option key={product.id} value={product.id}>
                                {product.name} - {product.productUnit}
                              </option>
                            ))}
                          </Select>

                          {selectedLineItems.map((item) => (
                            <Box
                              key={item.id}
                              display="flex"
                              justifyContent="space-between"
                              alignItems="center"
                              mb={2}
                              p={2}
                              mt={3}
                              borderWidth={1}
                              borderRadius="md"
                              bg="gray.700"
                            >
                              <Checkbox
                                isChecked={item.checked}
                                onChange={(e) =>
                                  handleCheckboxChange(
                                    item.id,
                                    e.target.checked
                                  )
                                }
                              >
                                {item.name} - {item.units}
                              </Checkbox>
                              <div>
                                <Input
                                  type="number"
                                  placeholder="Quantity"
                                  value={item.quantity}
                                  onChange={(e) =>
                                    handleQuantityChange(
                                      item.id,
                                      e.target.value
                                    )
                                  }
                                  width="100px"
                                  ml={4}
                                  isDisabled={!item.checked}
                                />
                                <button
                                  onClick={() => handleDeleteLineItems(item.id)}
                                >
                                  <FontAwesomeIcon
                                    icon={faXmark}
                                    style={{
                                      color: "gray.500",
                                      fontSize: 20,
                                      margin: "0 10px",
                                    }}
                                  />
                                </button>
                              </div>
                            </Box>
                          ))}
                        </Box>

                        <Box
                          width="35%"
                          bg="gray.700"
                          p={4}
                          borderRadius="md"
                          ml={4}
                        >
                          <h2>Recurring Delivery</h2>
                          <Switch
                            isChecked={recurring}
                            onChange={() => setRecurring(!recurring)}
                            mb={2}
                          />
                          {recurring && (
                            <>
                              <InputField
                                label="Recurrence Start Date"
                                name="startedAt"
                                type="datetime-local"
                                value={
                                  order.startedAt
                                    ? convertToDatetimeLocal(order.startedAt)
                                    : defaultStartDate
                                }
                                onChange={onChange}
                              />
                              <SelectField
                                label="Frequency"
                                name="frequency"
                                value={order.frequency || ""}
                                onChange={onChange}
                                options={["daily", "every_week", "every_month"]}
                              />
                              <InputField
                                label="Recurrence End Date"
                                name="endAt"
                                type="datetime-local"
                                value={
                                  order.endAt
                                    ? convertToDatetimeLocal(order.endAt)
                                    : defaultStartDate
                                }
                                onChange={onChange}
                              />
                            </>
                          )}
                        </Box>
                      </Box>

                      <Box
                        display="flex"
                        justifyContent="space-between"
                        bg="gray.800"
                        p={4}
                        borderRadius="md"
                        color="white"
                        mt={4}
                      >
                        <Box>
                          <h2>Assign Driver</h2>
                          <SelectField
                            label="Driver"
                            name="driver"
                            value={selectedDriver ? selectedDriver.name : ""}
                            onChange={(e) => {
                              const driver = drivers.find(
                                (driver) => driver.name === e.target.value
                              );
                              setSelectedDriver(driver);
                              handleDriverChange(driver);
                            }}
                            options={drivers.map((driver) => driver.name)}
                            width="100%"
                          />
                        </Box>
                        <Box>
                          <SelectField
                            label="Asset Category"
                            name="assetCategory"
                            value={
                              selectedAsset ? selectedAsset.assetCategory : ""
                            }
                            onChange={(e) => {
                              const asset = assets.find(
                                (asset) =>
                                  asset.assetCategory === e.target.value
                              );
                              setSelectedAsset(asset);
                              handleAssetChange(asset);
                            }}
                            options={assets.map((asset) => asset.assetCategory)}
                          />
                        </Box>
                        <Box>
                          <InputField
                            label="Planned_At"
                            name="plannedAt"
                            type="datetime-local"
                            value={plannedAt}
                            onChange={handlePlannedAtChange}
                          />
                        </Box>
                      </Box>
                      <Button onClick={handlePreviousStep} mr={4} mt={4}>
                        Back
                      </Button>
                      <Button
                        onClick={handleNextStep}
                        colorScheme="blue"
                        mt={4}
                      >
                        Create Order
                      </Button>
                    </>
                  )}
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </Box>
      </ModalWrapper>
    </>
  );
}
