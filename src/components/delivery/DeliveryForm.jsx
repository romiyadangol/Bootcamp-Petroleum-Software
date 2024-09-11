import { useState } from 'react';
import { InputField, SelectField } from "../core/FormFields";
import ModalWrapper from "../core/ModalWrapper";
import { Box, Button, Checkbox, Tabs, TabList, TabPanels, Tab, TabPanel, Switch } from "@chakra-ui/react";

export default function DeliveryForm({ order, onChange, onSave, onClose }) {
  const [step, setStep] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [recurring, setRecurring] = useState(false);
  const [bulkDeliveries, setBulkDeliveries] = useState([
    { id: 1, name: "Tankdef - DEF", supplier: "WesRock", availableQuantity: 950, orderQuantity: 0 },
    { id: 2, name: "Petro - Gasoline", supplier: "SunOil", availableQuantity: 500, orderQuantity: 0 },
  ]);

  const customers = [
    { id: "1", name: "Acme Fuel Co" },
    { id: "2", name: "Texas City Fuel" },
  ];

  const handleNextStep = () => {
    if (step === 1 && selectedCustomer) {
      setStep(2);
      onChange({ target: { name: "orderGroupInfo.customerId", value: selectedCustomer.id } });
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
      showSaveButton={false}
    >
      <Box display="flex" height="100%" maxWidth="1200px">
        <Box flex="1" padding="20px">
          <Tabs index={step - 1} onChange={(index) => setStep(index + 1)} isFitted variant="enclosed">
            <TabList mb={4}>
              <Tab isDisabled={step === 1}>Step 1: Select Customer</Tab>
              <Tab isDisabled={step === 2}>Step 2: Select Branch</Tab>
              <Tab isDisabled={step === 3}>Step 3: Delivery Details</Tab>
            </TabList>

            <TabPanels>
              {/* Step 1: Select Customer */}
              <TabPanel>
                {step === 1 && (
                  <>
                    <SelectField
                      label="Select Customer"
                      name="customer"
                      value={selectedCustomer ? selectedCustomer.name : ""}
                      onChange={(e) => {
                        const customer = customers.find((cust) => cust.name === e.target.value);
                        setSelectedCustomer(customer);
                        onChange({ target: { name: "orderGroupInfo.customerId", value: customer.id } });
                      }}
                      options={customers.map((cust) => cust.name)}
                    />
                    <Button onClick={handleNextStep} mr={4} style={{ display: "flex", justifyContent: "flex-end" }}>Next</Button>
                  </>
                )}
              </TabPanel>

              {/* Step 2: Select Branch */}
              <TabPanel>
                {step === 2 && selectedCustomer && (
                  <>
                    <h2>Customer Branch</h2>
                    <InputField
                      label="Branch Name"
                      name="branchName"
                      value={order.branchName || ""}
                      onChange={onChange}
                    />
                    <InputField
                      label="Location"
                      name="location"
                      value={order.location || ""}
                      onChange={onChange}
                    />
                    <Button onClick={handlePreviousStep} mr={4}>Back</Button>
                    <Button onClick={handleNextStep} mr={4}>Next</Button>
                  </>
                )}
              </TabPanel>

              {/* Step 3: Delivery Details */}
              <TabPanel>
                {step === 3 && selectedCustomer && (
                  <>
                    <Box display="flex" justifyContent="space-between" bg="gray.800" p={4} borderRadius="md" color="white">
                      
                      {/* Bulk Delivery Section */}
                      <Box width="60%">
                        <h2>Bulk Delivery</h2>
                        {bulkDeliveries.map((item) => (
                          <Box display="flex" justifyContent="space-between" p={2} bg="gray.900" borderRadius="md" my={2} key={item.id}>
                            <Checkbox />
                            <Box flex="1" mx={2}>
                              <span>{item.name}</span>
                            </Box>
                            <Box mx={2}>{item.supplier}</Box>
                            <Box mx={2}>{item.availableQuantity} gal</Box>
                            <InputField 
                              label="Order"
                              name="orderQuantity"
                              value={item.orderQuantity}
                              onChange={(e) => handleBulkDeliveryChange(item.id, e.target.value)}
                              type="number"
                              width="100px"
                            />
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
