import { useState, useEffect } from 'react';
import { InputField, SelectField } from "../core/FormFields";
import ModalWrapper from "../core/ModalWrapper";
import { Box, Button, Checkbox, Switch, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { useQuery } from '@apollo/client';
import { GET_CUSTOMERS } from '../../graphql/queries/customers/getCustomers';
import { GET_CUSTOMER_BRANCH } from '../../graphql/queries/customerBranch/getCustomerBranch';

export default function DeliveryForm({ order, onChange, onSave, onClose }) {
  const [step, setStep] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [recurring, setRecurring] = useState(false);
  const { data: customersData } = useQuery(GET_CUSTOMERS);
  const customers = customersData?.getCustomers.customers || [];
  
  const { data: branchesData, refetch: refetchBranches } = useQuery(GET_CUSTOMER_BRANCH, {
    variables: { id: selectedCustomer?.id },
    skip: !selectedCustomer,
  });
  
  const branches = branchesData?.getCustomerBranch.customerBranches || [];
  
  const [bulkDeliveries, setBulkDeliveries] = useState([
    { id: 1, name: "Tankdef-DEF", supplier: "WesRock", availableQuantity: 950, orderQuantity: 0 },
    { id: 2, name: "Petro - Gasoline", supplier: "SunOil", availableQuantity: 500, orderQuantity: 0 },
  ]);

  useEffect(() => {
    if (selectedCustomer) {
      refetchBranches().catch(err => {
        console.error('Error refetching branches:', err);
      });
    }
  }, [selectedCustomer, refetchBranches]);
  

  useEffect(() => {
    if (branches.length > 0) {
      const defaultBranch = branches[0];
      if (defaultBranch && (!selectedBranch || defaultBranch.id !== selectedBranch.id)) {
        setSelectedBranch(defaultBranch);
        onChange({ target: { name: "orderGroupInfo.branchId", value: defaultBranch.id } });
        onChange({ target: { name: "orderGroupInfo.location", value: defaultBranch.location } });
      }
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

  const handleBulkDeliveryChange = (id, newQuantity) => {
    setBulkDeliveries((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, orderQuantity: newQuantity } : item
      )
    );
  };

  return (
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
                        setSelectedBranch(null); // Reset branch selection
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

                    <Button onClick={handlePreviousStep} mr={4}>Back</Button>
                    <Button onClick={handleNextStep} mr={4}>Next</Button>
                  </>
                )}
              </TabPanel>

              <TabPanel>
                {step === 3 && selectedCustomer && (
                  <>
                    <Box display="flex" justifyContent="space-between" bg="gray.800" p={4} borderRadius="md" color="white">
                    <Box>
                      <h2>Bulk Delivery</h2>
                      {bulkDeliveries.map((item) => (
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          ml={10}
                        >
                          <Checkbox />
                          <Box style={{ display: "flex"}} ml={10}>
                            <span>{item.name}</span>
                          </Box>
                          <Box mx={40}>{item.supplier}</Box>
                          <InputField
                            name="orderQuantity"
                            value={item.orderQuantity}
                            onChange={(e) => handleBulkDeliveryChange(item.id, e.target.value)}
                            type="number"
                          />
                          <Box>{item.availableQuantity} gal</Box>
                        </Box>
                      ))}
                      <Button mt={4} colorScheme="teal">Add Product</Button>
                    </Box>

                      {/* Recurring Delivery Section */}
                      <Box width="35%" bg="gray.700" p={4} borderRadius="md">
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

                    <Button onClick={handlePreviousStep} mr={4}>Back</Button>
                    <Button onClick={onSave} mt={4} colorScheme="blue">Create Order</Button>
                  </>
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Box>
    </ModalWrapper>
  );
}
