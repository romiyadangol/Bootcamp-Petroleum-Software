import { useMemo } from 'react';
import ModalWrapper from '../core/ModalWrapper';
import { Box, FormControl, SimpleGrid, Text, useColorModeValue } from '@chakra-ui/react';
import { SelectField } from '../core/FormFields';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

const DeliveryDetails = ({ order, onClose, onChange }) => {
    const { data: driverData, isLoading } = useQuery(GET_DRIVERS);
    const drivers = driverData?.getDrivers?.drivers || [];

    const theme = useColorModeValue("ag-theme-quartz", "ag-theme-quartz-dark");

    const rowData = [
        { label: 'Planned At', value: order.deliveryOrder?.plannedAt || 'N/A' },
        { label: 'Created At', value: order.deliveryOrder?.createdAt || 'N/A' },
        { 
            label: 'Driver Name', 
            value: (order.drivers && order.drivers.name) || 
                (order.deliveryOrder?.driver && order.deliveryOrder.driver.name) || 
                'N/A' 
        },
    ];

    const defaultColDef = useMemo(() => ({
        flex: 1,
        resizable: true,
        sortable: true,
        editable: true,
    }), []);

    const columnDefs = [
        { headerName: "Delivery Details", field: "label" },
        { 
            headerName: "Value", 
            field: "value",
            cellEditorFramework: (props) => {
                if (props.data.label === 'Driver Name') {
                    return (
                        <select
                            value={props.value}
                            onChange={(e) => {
                                const newValue = e.target.value;
                                props.node.setDataValue('value', newValue);
                                props.api.stopEditing();
                                onChange({ ...order, driverName: newValue });
                            }}
                        >
                            {isLoading 
                                ? <option>Loading...</option>
                                : drivers.map(driver => (
                                    <option key={driver.id} value={driver.name}>
                                        {driver.name}
                                    </option>
                                ))
                            }
                        </select>
                    );
                }
                return <span>{props.value}</span>;
            },
        },
    ];

    return (
        <ModalWrapper isOpen={true} onClose={onClose} title="Delivery Details" onSave={() => {}} maxWidth={1400}>
            <Box p={1} bg="gray.800" borderRadius={5}>
                <SimpleGrid columns={2} spacing={10} marginTop={3} marginLeft={10}>
                    <FormControl w={150}>
                        <SelectField
                            name="status"
                            value={order.status || ''}
                            onChange={onChange}
                            options={['PENDING', 'COMPLETED', 'CANCELLED']}
                        />
                    </FormControl>

                    <FormControl ml={50}>
                        <Text fontSize={18} mt={2}>{order.customer?.name || 'N/A'}</Text>
                        <Text fontSize={18} mt={2}>{order.deliveryOrder.customerBranch?.name || 'N/A'}</Text>
                    </FormControl>
                </SimpleGrid>
            </Box>

            <Box mt={6} className={theme} style={{ height: '300px', width: '400px' }}>
                <AgGridReact
                    rowData={rowData}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    domLayout="autoHeight"
                    animateRows={true}
                />
            </Box>
        </ModalWrapper>
    );
};

export default DeliveryDetails;