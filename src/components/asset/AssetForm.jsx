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

const AssetForm = ({ asset, onChange, onSave, onClose, onDelete }) => {
  const handleGenerateUniqueId = () => {
    const newUniqueId = uuidv4();
    onChange({ target: { name: 'unique_id', value: newUniqueId } });
  };

  return (
    <>
      <Modal isOpen={true} onClose={onClose} style={{backgroundColor: "transparent"}} >
        <ModalOverlay />
        <ModalContent style={{maxWidth: "80%", maxHeight: "90%"}}>
          <ModalHeader>{asset.unique_id ? "Edit Asset" : "Create New Asset"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Asset Type</FormLabel>
              <Select name="asset_type" value={asset.asset_type} onChange={onChange}>
                <option value="">Select Asset Type</option>
                <option value="tank">Tank</option>
                <option value="tank-wagon">Tank Wagon</option>
                <option value="truck">Truck</option>
                <option value="trailer">Trailer</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Select
                name="name"
                value={asset.name}
                onChange={onChange}
                placeholder="Select Asset Name"
                isDisabled={!asset.asset_type}
              >
                {asset.asset_type && assetNames[asset.asset_type].map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Unique ID</FormLabel>
              <Input
                name="unique_id"
                value={asset.unique_id}
                onChange={onChange}
                readOnly
              />
              <Button onClick={handleGenerateUniqueId} mt={2}>Generate Unique ID</Button>
            </FormControl>
            <FormControl>
              <FormLabel>Status</FormLabel>
              <Select name="status" value={asset.status} onChange={onChange}>
                <option value="">Select Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            {asset.unique_id && (
              <Button colorScheme="red" onClick={() => onDelete(asset.unique_id)} mr={3}>
                Delete
              </Button>
            )}
            <Button colorScheme="blue" onClick={onSave}>
              Save
            </Button>
            <Button colorScheme="gray" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AssetForm;
