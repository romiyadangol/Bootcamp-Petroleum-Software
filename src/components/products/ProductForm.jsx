import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { Button, FormControl, FormLabel, Input, Select, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from "@chakra-ui/react";

const ProductForm = ({ product, onChange, onSave, onClose }) => {
  return (
    <>
      <Modal isOpen={true} onClose={onClose} style={{backgroundColor: "transparent"}} >
        <ModalOverlay />
        <ModalContent style={{maxWidth: "800px"}}>
          <ModalHeader>Product Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form>
              <FormControl mb={4}>
                <FormLabel>Name:</FormLabel>
                <Input
                  type="text"
                  name="name"
                  value={product.name}
                  onChange={onChange}
                />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Category:</FormLabel>
                <Select
                  name="category"
                  value={product.category}
                  onChange={onChange}
                >
                  <option value="">Select Category</option>
                  <option value="Fuel">Fuel</option>
                  <option value="Oil">Oil</option>
                </Select>  
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Status:</FormLabel>
                <Select
                  name="status"
                  value={product.status} 
                  onChange={(e) => onChange({ target: { name: 'status', value: e.target.value } })}
                >
                  <option value="">Select Status</option>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </Select>
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Unit:</FormLabel>
                <Select
                  name="unit"
                  value={product.unit}
                  onChange={onChange}
                >
                  <option value="">Select Unit</option>
                  <option value="Gallon">Gallon</option>
                  <option value="Litre">Litre</option>
                </Select>
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

export default ProductForm;