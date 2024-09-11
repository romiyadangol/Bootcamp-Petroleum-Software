import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";

export default function ModalWrapper({ isOpen, onClose, title, children, onSave, showSaveButton = true }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} style={{ background: "transparent" }}>
            <ModalOverlay />
            <ModalContent style={{ maxWidth: "800px" }}>
                <ModalHeader>{title}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {children}
                </ModalBody>
                <ModalFooter>
                    {showSaveButton && (
                        <>
                        <Button colorScheme="blue" mr={3} onClick={onSave}>
                            Save
                        </Button>
                        <Button colorScheme="red" onClick={onClose}>
                            Cancel
                        </Button>
                        </>
                    )}
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
