import { Box, VStack, HStack, Text, Button, Grid, GridItem } from '@chakra-ui/react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { EditIcon } from 'lucide-react';
import ModalWrapper from '../core/ModalWrapper';
import { SelectField } from '../core/FormFields';

const DeliveryDetails = ({order, onClose, onChange }) => {
  const columnDefs = [
    { headerName: 'ASSET NAME', field: 'assetName', sortable: true, filter: true },
    { headerName: 'PRODUCT TYPE', field: 'productType', sortable: true, filter: true },
    { headerName: 'STATUS', field: 'status', sortable: true, filter: true },
    { headerName: 'ORDERED GAL', field: 'orderedGal', sortable: true, filter: true },
    { headerName: 'DELIVERED GAL', field: 'deliveredGal', sortable: true, filter: true },
  ];

  const rowData = [
    { assetName: 'Tank-Blend', productType: 'Clear#1', status: 'Scheduled', orderedGal: '142', deliveredGal: 'N/A' },
  ];

  const InfoItem = ({ label, value, editable }) => (
    <HStack justify="space-between" w="100%">
      <Text color="gray.500">{label}</Text>
      <HStack>
        <Text>{value}</Text>
        {editable && <EditIcon size={16} />}
      </HStack>
    </HStack>
  );

  return (
    <ModalWrapper isOpen={true} onClose={onClose} title="Delivery Order" maxWidth={1600}>
    <Box bg="gray.800" p={4} color="white" borderRadius={5}>
      <VStack align="stretch" spacing={4}>
        <HStack justify="space-between">
          <Text fontSize="xl">Delivery Order</Text>
          <HStack>
            <Button size="sm" variant="outline">Duplicate Order</Button>
            <Button size="sm" variant="outline">Update Order</Button>
          </HStack>
        </HStack>

        <HStack spacing={4} maxWidth="70%">
            <SelectField
            label="Status"
            value={order.status || ''}  
            name="status"
            onChange={onChange}
            options={["Scheduled", "Pending", "Completed", "Canceled"]}
            />
          <Text color="cyan.300" w={700}>{order.customer?.name}</Text>
          <Text color="cyan.300" w={700}>{order.deliveryOrder?.customerBranch?.name}</Text>

        </HStack>

        <Grid templateColumns="repeat(3, 1fr)" gap={4}>
          <GridItem>
            <VStack align="stretch" bg="gray.700" p={4} borderRadius="md">
              <Text fontWeight="bold">Customer Details</Text>
              <InfoItem label="Name" value={order.customer?.name || "N/A"} />
              <InfoItem label="Email" value={order.customer?.email || "N/A"} />
            </VStack>
          </GridItem>
          <GridItem>
            <VStack align="stretch" bg="gray.700" p={4} borderRadius="md">
              <Text fontWeight="bold">Delivery Details</Text>
              <InfoItem label="HUB" value="Acme branch 2" editable />
              <InfoItem label="PLANNED AT" value="Fri May 3 17:31" editable />
              <InfoItem label="ARRIVED AT" value="N/A" />
              <InfoItem label="COMPLETED AT" value="N/A" />
              <InfoItem label="GEO IN" value="N/A: Please verify customer's address" />
              <InfoItem label="GEO OUT" value="N/A: Please verify customer's address" />
              <InfoItem label="COMMON CARRIER" value="N/A" />
              <InfoItem label="DRIVER NAME" value="Ramesh Shrestha" editable />
            </VStack>
          </GridItem>
          <GridItem>
            <VStack align="stretch" bg="gray.700" p={4} borderRadius="md">
              <Text fontWeight="bold">Shipment Details</Text>
              <InfoItem label="SHIP TO ADDRESS" value="Texas A&M University, Bizzell Street, College Station, TX, USA" />
              <InfoItem label="ERP ID" value="54" />
              <InfoItem label="LOS" value="CC" />
            </VStack>
          </GridItem>
        </Grid>

        <HStack justify="space-between">
          <Text fontWeight="bold">Delivery Details</Text>
          <HStack>
            <Button size="sm" colorScheme="blue">Add Asset</Button>
            <Button size="sm" colorScheme="blue">Add Customer Asset</Button>
          </HStack>
        </HStack>

        <Box className="ag-theme-quartz-dark" height="200px" width="100%">
          <AgGridReact
            columnDefs={columnDefs}
            rowData={rowData}
            domLayout='autoHeight'
          />
        </Box>
      </VStack>
    </Box>
    </ModalWrapper>
  );
};

export default DeliveryDetails;