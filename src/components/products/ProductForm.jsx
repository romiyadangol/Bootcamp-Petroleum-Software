import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { Button, FormControl, FormLabel, Input, Select, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from "@chakra-ui/react";
import { FIND_PRODUCTS } from "../../graphql/queries/products/findProducts";
import { useQuery } from '@apollo/client';

const ProductForm = ({ product, onChange, onSave, onClose }) => {
  const { data, loading, error } = useQuery(FIND_PRODUCTS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // const products = data?.findProducts?.products || [];

  const hardcodedCategories = ['petrol', 'diesel', 'luburicants', 'lpg'];
  const hardcodedStatuses = ['available', 'out_of_stock'];
  const hardcodedUnits = ['liters', 'gallons'];
  

  return (
    <>
      <Modal isOpen={true} onClose={onClose} style={{ backgroundColor: "transparent" }}>
        <ModalOverlay />
        <ModalContent style={{ maxWidth: "800px" }}>
          <ModalHeader>Product Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form>
              <FormControl mb={4}>
                <FormLabel>Name:</FormLabel>
                <Input
                  type="text"
                  name="name"
                  value={product.name || ''}
                  onChange={onChange}
                />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Category:</FormLabel>
                <Select
                  name="productCategory"
                  value={product.productCategory || ''}
                  onChange={onChange}
                >
                  <option value="">Select Category</option>
                  {hardcodedCategories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Status:</FormLabel>
                <Select
                  name="productStatus"
                  value={product.productStatus || ''}
                  onChange={onChange}
                >
                  <option value="">Select Status</option>
                  {hardcodedStatuses.map((status, index) => (
                    <option key={index} value={status}>
                      {status}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Unit:</FormLabel>
                <Select
                  name="productUnit"
                  value={product.productUnit || ''}
                  onChange={onChange}
                >
                  <option value="">Select Unit</option>
                  {hardcodedUnits.map((unit, index) => (
                    <option key={index} value={unit}>
                      {unit}
                    </option>
                  ))}
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
