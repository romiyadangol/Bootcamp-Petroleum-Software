import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { v4 as uuidv4 } from 'uuid';
import { Button, FormControl, FormLabel, Input, Select, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from "@chakra-ui/react";

const assetNames = {
  tank: [
    "Petroleum Storage Tank 1",
    "Fuel Oil Tank A",
    "Crude Oil Tank 5",
    "Diesel Storage Tank X",
  ],
  "tank-wagon": [
    "Petroleum Tank Wagon 101",
    "Crude Oil Tanker Wagon",
    "Diesel Tank Wagon Z",
    "Gasoline Tank Wagon B",
  ],
  truck: [
    "Fuel Delivery Truck 300",
    "Petroleum Tank Truck P1",
    "Gasoline Transport Truck 202",
    "Crude Oil Truck C-5",
  ],
  trailer: [
    "Fuel Tank Trailer T100",
    "Petroleum Transport Trailer 2",
    "Gasoline Trailer G4",
    "Diesel Trailer D7",
  ],
};

const AssetForm = ({ asset, onChange, onSave, onClose }) => {
  const handleGenerateUniqueId = () => {
    const newUniqueId = uuidv4();
    onChange({ target: { name: 'unique_id', value: newUniqueId } });
  };

  return (
    <>
      <Modal isOpen={true} onClose={onClose} style={{backgroundColor: "transparent"}} >
        <ModalOverlay />
        <ModalContent style={{maxWidth: "800px"}}>
          <ModalHeader>Asset Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form>
              <FormControl mb={4}>
                <FormLabel>Asset_Type:</FormLabel>
                <Select
                  name="asset_type"
                  value={asset.asset_type}
                  onChange={onChange}
                >
                  <option value="">Select Asset Type</option>
                  <option value="tank">tank</option>
                  <option value="tank-wagon">tank-wagon</option>
                  <option value="truck">truck</option>
                  <option value="trailer">trailer</option>
                </Select>  
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Asset_Name:</FormLabel>
                <Select
                  name="name"
                  value={asset.name}
                  onChange={onChange}
                  disabled={!asset.asset_type}
                >
                  <option value="">Select Asset Name</option>
                  {asset.asset_type && assetNames[asset.asset_type].map((name, index) => (
                    <option key={index} value={name}>{name}</option>
                  ))}
                </Select>  
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Unique ID:</FormLabel>
                <Input
                  type="text"
                  value={asset.unique_id || ''}
                  readOnly
                />
                <Button mt={2} onClick={handleGenerateUniqueId}>Generate Unique ID</Button>
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Status:</FormLabel>
                <Select
                  name="status"
                  value={asset.status} 
                  onChange={(e) => onChange({ target: { name: 'status', value: e.target.value } })}
                >
                  <option value="">Select Status</option>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
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

export default AssetForm;
