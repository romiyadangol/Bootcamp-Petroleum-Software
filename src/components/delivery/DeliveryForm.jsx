import React, { useState, useEffect } from 'react';
import { Box, Button, Checkbox, Input, Select, Switch, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import ModalWrapper from '../core/ModalWrapper';
import { InputField, SelectField } from '../core/FormFields';
import { useQuery } from '@apollo/client';
import { GET_CUSTOMERS } from '../../graphql/queries/customers/getCustomers';
import { GET_CUSTOMER_BRANCH } from '../../graphql/queries/customerBranch/getCustomerBranch';
import { GET_ORDERS } from '../../graphql/queries/delivery/getOrders';
import { FIND_PRODUCTS } from '../../graphql/queries/products/findProducts';
import { GET_DRIVERS } from '../../graphql/queries/driver/getDrivers';

export default function DeliveryForm({ order, onChange, onSave, onClose }) {
  const [step, setStep] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedLineItems, setSelectedLineItems] = useState([]);
  const [recurring, setRecurring] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductUnit, setNewProductUnit] = useState('');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);

  const { data: customersData } = useQuery(GET_CUSTOMERS);
  const customers = customersData?.getCustomers.customers || [];

  const { data: branchesData, refetch: refetchBranches } = useQuery(GET_CUSTOMER_BRANCH, {
    variables: { id: selectedCustomer?.id },
    skip: !selectedCustomer,
  });
  const branches = branchesData?.getCustomerBranch.customerBranches || [];

  const { data: lineItemsData } = useQuery(GET_ORDERS);
  const lineItems = lineItemsData?.getOrders.orders || [];

  const { data: productData } = useQuery(FIND_PRODUCTS);
  const products = productData?.findProducts.products || [];

  const { data: driverData } = useQuery(GET_DRIVERS);
  const drivers = driverData?.getDrivers.drivers || [];
  console.log(drivers);

  const handleAddLineItem = (product) => {
    const newLineItem = {
      id: product.id,
      name: product.name,
      units: product.productUnit,
      quantity: "",
      checked: false 
    };
    setSelectedLineItems([...selectedLineItems, newLineItem]);
  };

  const handleQuantityChange = (itemId, quantity) => {
    setSelectedLineItems((prevItems) =>
      prevItems.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const handleCheckboxChange = (itemId, isChecked) => {
    setSelectedLineItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, checked: isChecked } : item
      )
    );
  };

  useEffect(() => {
    if (selectedCustomer) {
      refetchBranches().catch(err => {
        console.error('Error refetching branches:', err);
      });
    }
  }, [selectedCustomer, refetchBranches]);

  useEffect(() => {
    if (branches.length > 0 && !selectedBranch) {
      const defaultBranch = branches[0];
      setSelectedBranch(defaultBranch);
      onChange({ target: { name: 'orderGroupInfo.name', value: defaultBranch.name } });
      onChange({ target: { name: 'orderGroupInfo.location', value: defaultBranch.location } });
    }
  }, [branches, selectedBranch, onChange]);

  const handleNextStep = () => {
    if (step === 1 && selectedCustomer) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else {
      onSave();
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
        checked: false
      };
      setSelectedLineItems([...selectedLineItems, newProduct]); 
      setIsProductModalOpen(false);
    }
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
        onSave={handleNextStep}
        maxWidth={1600}
        showSaveButton={false}
      >
        <Box display="flex" height="100%">
          <Box flex="1" padding="20px">
            <Tabs index={step - 1} onChange={(index) => setStep(index + 1)} isFitted variant="enclosed">
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
                          const customer = customers.find((cust) => cust.name === e.target.value);
                          setSelectedCustomer(customer);
                          setSelectedBranch(null);
                          onChange({ target: { name: "orderGroupInfo.customerId", value: customer.id } });
                        }}
                        options={customers.map((cust) => cust.name)}
                      />
                      <Button onClick={handleNextStep} mr={4}>Next</Button>
                    </>
                  )}
                </TabPanel>

                <TabPanel>
                  {step === 2 && selectedCustomer && (
                    <>
                      <h2>Customer Branch: </h2>
                      <SelectField
                        label="Branch"
                        name="branch"
                        value={selectedBranch ? selectedBranch.name : ""}
                        onChange={(e) => {
                          const branch = branches.find((b) => b.name === e.target.value);
                          setSelectedBranch(branch);
                          onChange({ target: { name: "orderGroupInfo.name", value: branch.name } });
                        }}
                        options={branches.map((branch) => branch.name)}
                      />
                      <SelectField
                        label="Location"
                        name="location"
                        value={selectedBranch ? selectedBranch.location : ""}
                        onChange={(e) => {
                          const branch = branches.find((b) => b.location === e.target.value);
                          setSelectedBranch(branch);
                          onChange({ target: { name: "orderGroupInfo.location", value: branch.location } });
                        }}
                        options={branches.map((branch) => branch.location)}
                      />
                      <Button onClick={handlePreviousStep} mr={4} mt={5}>Back</Button>
                      <Button onClick={handleNextStep} mr={4} mt={5}>Next</Button>
                    </>
                  )}
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
                      <Box display="flex" justifyContent="space-between" bg="gray.800" p={4} borderRadius="md" color="white">
                        <Box flex="1">
                          <h2>Bulk Delivery</h2>
                          <Select
                            placeholder="Select Product"
                            onChange={(e) => {
                              const selectedProduct = products.find(product => product.id === e.target.value);
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
                                onChange={(e) => handleCheckboxChange(item.id, e.target.checked)}
                              >
                                {item.name} - {item.units}
                              </Checkbox>
                              <Input
                                type="number"
                                placeholder="Quantity"
                                value={item.quantity}
                                onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                width="100px"
                                ml={4}
                                isDisabled={!item.checked}
                              />
                            </Box>
                          ))}
                        </Box>

                        <Box width="35%" bg="gray.700" p={4} borderRadius="md" ml={4}>
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
                                name="recurrenceStartDate"
                                type="date"
                                value={order.recurrenceStartDate || ""}
                                onChange={onChange}
                              />
                              <SelectField
                                label="Frequency"
                                name="recurrenceFrequency"
                                value={order.recurrenceFrequency || ""}
                                onChange={onChange}
                                options={["Daily", "Weekly", "Monthly"]}
                              />
                            </>
                          )}
                        </Box>
                      </Box>

                      <Box display="flex" justifyContent="space-between" bg="gray.800" p={4} borderRadius="md" color="white" mt={4}>
                        <Box>
                        <h2>Assign Driver</h2>
                          <SelectField
                            label="Driver"
                            name="driver"
                            value={selectedDriver ? selectedDriver.name : ""}
                            onChange={(e) => {
                              const driver = drivers.find((driver) => driver.name === e.target.value);
                              setSelectedDriver(driver);
                              onChange({ target: { name: "driverInfo.id", value: driver.id } });
                            }}
                            options={drivers.map((driver) => driver.name)}
                            width="100%"
                          />
                        </Box>
                        <Box>
                          <InputField
                            label="Planned_At"
                            name="plannedAt"
                            type="datetime-local"
                            value={order.plannedAt || ""}
                            onChange={onChange}
                          />
                        </Box>
                      </Box>
                      <Button onClick={handlePreviousStep} mr={4} mt={4}>Back</Button>
                      <Button onClick={onSave} colorScheme="blue" mt={4}>Create Order</Button>
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
