import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
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
  useQuery,
} from "@chakra-ui/react";
import { GET_ASSETS } from "../../graphql/queries/assets/getAssets";

const AssetForm = ({ asset, onChange, onSave, onClose }) => {
  const { loading, error, data } = useQuery(GET_ASSETS);
  console.log(data); 
  if (loading) return <p>Loading Asset Types...</p>;
  if (error) return <p>Error loading Asset Types. Please try again later.</p>;

  // const assetCategories = data?.getAssets?.assets?.assetCategory || [];

  const hardcodedCategories = ['tank', 'truck', 'tank-wagon'];
  const hardcodedStatuses = ['available', 'out_of_stock'];

  return (
    <>
      <Modal isOpen={true} onClose={onClose} style={{ backgroundColor: "transparent" }}>
        <ModalOverlay />
        <ModalContent style={{ maxWidth: "800px" }}>
          <ModalHeader>Asset Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form>
              <FormControl mb={4}>
                <FormLabel>Asset Type:</FormLabel>
                <Select
                  name="assetCategory"
                  value={asset.assetCategory || ""}
                  onChange={onChange}
                >
                  <option value="">Select Asset Type</option>
                  {hardcodedCategories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Asset ID:</FormLabel>
                <Input
                  type="text"
                  name="id"
                  onChange={onChange}
                  value={asset.id || ""}
                />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Status:</FormLabel>
                <Select
                  name="assetStatus"
                  value={product.assetStatus || ''}
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
            </form>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onSave}>
              Save
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

export default AssetForm;
