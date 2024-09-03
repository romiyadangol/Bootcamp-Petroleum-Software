import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { Button, FormControl, FormLabel, Input, Select, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from "@chakra-ui/react";

const CustomerForm = ({ customer, onChange, onSave, onClose }) => {
  return (
    <>
      <Modal isOpen={true} onClose={onClose} style={{backgroundColor: "transparent"}} >
        <ModalOverlay />
        <ModalContent style={{maxWidth: "800px"}}>
          <ModalHeader>Customer Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form>
              <FormControl mb={4}>
                <FormLabel>Customer:</FormLabel>
                <Input
                  type="text"
                  name="name"
                  value={customer.name || ''}
                  onChange={onChange}
                />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Phone:</FormLabel>
                <Input
                  type="text"
                  name="phone"
                  value={customer.phone}
                  onChange={onChange}
                />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Email:</FormLabel>
                <Input
                  type="text"
                  name="email"
                  value={customer.email}
                  onChange={onChange}
                />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Address:</FormLabel>
                <Input
                  type="text"
                  name="address"
                  value={customer.address}
                  onChange={onChange}
                />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Status:</FormLabel>
                <Select
                  name="status"
                  value={customer.status} 
                  onChange={(e) => onChange({ target: { name: 'status', value: e.target.value } })}
                >
                  <option value="">Select Status</option>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </Select>
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>City:</FormLabel>
                <Input
                  type="text"
                  name="city"
                  value={customer.city}
                  onChange={onChange}
                />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Zip:</FormLabel>
                <Input
                  type="text"
                  name="zip"
                  value={customer.zip}
                  onChange={onChange}
                />
              </FormControl>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onSave}>Save</Button>
            <Button colorScheme="red" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CustomerForm;