import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { Button, FormControl, FormLabel, Input, Select, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from "@chakra-ui/react";

const UserForm = ({ user, onChange, onSave, onClose }) => {
  return (
    <>
      <Modal isOpen={true} onClose={onClose} style={{backgroundColor: "transparent"}} >
        <ModalOverlay />
        <ModalContent style={{maxWidth: "800px"}}>
          <ModalHeader>User Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form>
              <FormControl mb={4}>
                <FormLabel>User:</FormLabel>
                <Input
                  type="text"
                  name="name"
                  value={user.name || ''}
                  onChange={onChange}
                />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Phone:</FormLabel>
                <Input
                  type="text"
                  name="phone"
                  value={user.phone}
                  onChange={onChange}
                />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Email:</FormLabel>
                <Input
                  type="text"
                  name="email"
                  value={user.email}
                  onChange={onChange}
                />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Roles:</FormLabel>
                <Select
                  name="role"
                  value={user.role}
                  onChange={onChange}
                >
                  <option value="">Select Roles</option>
                  <option value="dispatcher">Dispatcher</option>
                  <option value="accounting">Accounting</option>
                  <option value="admin">Admin</option>
                </Select>  
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Status:</FormLabel>
                <Select
                  name="status"
                  value={user.status ? 'true' : 'false'} 
                  onChange={(e) => onChange({ target: { name: 'status', value: e.target.value === 'true' } })}
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
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UserForm;