import { useState } from "react";
import moment from "moment";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Box,
  Flex,
  Text,
  Divider,
} from "@chakra-ui/react";

const DeliveryForm = ({ delivery, onChange, onSave, onClose }) => {
  const [step, setStep] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const customers = [
    { name: "customer 1", email: "customer1@example.com", phone: "123-456-7890" },
    { name: "customer 2", email: "customer2@example.com", phone: "234-567-8901" },
    { name: "customer 3", email: "customer3@example.com", phone: "345-678-9012" },
    { name: "customer 4", email: "customer4@example.com", phone: "456-789-0123" },
    { name: "customer 5", email: "customer5@example.com", phone: "567-890-1234" },
  ];

  const handleNextStep = () => {
    if (step === 1 && selectedCustomer) {
      setStep(2);
      onChange({ target: { name: 'customer', value: selectedCustomer.name } });
    } else {
      onSave();
    }
  };

  const formatDateTime = (date) => {
    return date ? moment(date).format('YYYY-MM-DDTHH:mm') : '';
  };

  return (
    <>
      <Modal isOpen={true} onClose={onClose} style={{ backgroundColor: "transparent" }}>
        <ModalOverlay />
        <ModalContent style={{ maxWidth: "800px" }}>
          <ModalHeader>Delivery Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box p={4} background="gray.800" color="white" >
              <Flex justifyContent="space-between" alignItems="center">
                <Text fontSize="xl" fontWeight="bold" marginLeft={100} color={step === 1 ? "orange.400" : "white"}>
                  1. Select Customer
                </Text>
                <Text fontSize="xl" fontWeight="bold" marginRight={120} color={step === 2 ? "orange.400" : "white"}>
                  2. Create Orders
                </Text>
              </Flex>
            </Box>

            <Divider my={4} />

            {step === 1 && (
              <form>
                <FormControl mb={4}>
                  <FormLabel>Select Customer</FormLabel>
                  <Select
                    placeholder="Select Customer"
                    value={selectedCustomer ? selectedCustomer.name : ""}
                    onChange={(e) => {
                      const customer = customers.find(cust => cust.name === e.target.value);
                      setSelectedCustomer(customer);
                    }}
                  >
                    {customers.map((cust, index) => (
                      <option key={index} value={cust.name}>
                        {cust.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </form>
            )}

            {step === 2 && selectedCustomer && (
              <form>
                <Box mb={4} p={4} border="1px solid" borderColor="gray.200" borderRadius="md">
                  <Text fontSize="md" fontWeight="bold">Customer Details</Text>
                  <Text>Name: {selectedCustomer.name}</Text>
                  <Text>Email: {selectedCustomer.email}</Text>
                  <Text>Phone: {selectedCustomer.phone}</Text>
                </Box>

                <FormControl mb={4}>
                  <FormLabel>Pricing</FormLabel>
                  <Input
                    type="text"
                    name="pricing"
                    onChange={onChange}
                    value={delivery.pricing}
                  />
                </FormControl>

                <FormControl mb={4}>
                  <FormLabel>Status</FormLabel>
                  <Select
                    placeholder="Select Status"
                    name="status"
                    onChange={onChange}
                    value={delivery.status}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </Select>
                </FormControl>

                <FormControl mb={4}>
                  <FormLabel>Created At</FormLabel>
                  <Input
                    type="date"
                    name="created_at"
                    onChange={onChange}
                    value={delivery.created_at}
                  />
                </FormControl>

                <FormControl mb={4}>
                  <FormLabel>Type</FormLabel>
                  <Input
                    type="text"
                    name="type"
                    onChange={onChange}
                    value={delivery.type}
                  />
                </FormControl>

                <FormControl mb={4}>
                  <FormLabel>Planned At</FormLabel>
                  <Input
                    type="date"
                    name="planned_at"
                    onChange={onChange}
                    value={delivery.planned_at}
                  />
                </FormControl>

                <FormControl mb={4}>
                  <FormLabel>Address</FormLabel>
                  <Input
                    type="text"
                    name="address"
                    onChange={onChange}
                    value={delivery.address}
                  />
                </FormControl>

                <FormControl mb={4}>
                  <FormLabel>State</FormLabel>
                  <Input
                    type="text"
                    name="state"
                    onChange={onChange}
                    value={delivery.state}
                  />
                </FormControl>

                <FormControl mb={4}>
                  <FormLabel>City</FormLabel>
                  <Input
                    type="text"
                    name="city"
                    onChange={onChange}
                    value={delivery.city}
                  />
                </FormControl>

                <FormControl mb={4}>
                  <FormLabel>Zip Code</FormLabel>
                  <Input
                    type="text"
                    name="zip"
                    onChange={onChange}
                    value={delivery.zip}
                  />
                </FormControl>

              </form>
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleNextStep}>
              {step === 1 ? "Next" : "Save"}
            </Button>
            <Button colorScheme="red" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DeliveryForm;
