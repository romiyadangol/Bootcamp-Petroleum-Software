import Toastify from '../Toastify';
import { toast } from 'react-toastify';
import { useQuery } from '@apollo/client';
import AgGridTable from '../core/AgGridTable';
import { Spinner, Box } from '@chakra-ui/react';
import ActionButtons from '../core/ActionButtons';
import DeliveryForm from '../delivery/DeliveryForm';
import { useColorModeValue } from '@chakra-ui/react';
import { useCallback, useEffect, useMemo, useState } from 'react'; 
import { useDispatch, useSelector } from 'react-redux';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GET_ORDERS } from '../../graphql/queries/delivery/getOrders';
import { useCreateDeliveryMutation, useDeleteDeliveryMutation, useUpdateDeliveryMutation } from '../../hooks/useDeliveryMutation';
import { addDelivery, deleteDelivery, fetchDeliveriesError, fetchDeliveriesRequest, fetchDeliveriesSuccess, updateDelivery } from '../../redux/actions/deliveryActions';

export default function DeliveryList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [order, setOrder] = useState(null);
  // console.log('Order:', order);
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState('create');
  const [gridRef, setGridRef] = useState(null);
  const dispatch = useDispatch();

  // delivery queries
  const { data, loading, error, refetch } = useQuery(GET_ORDERS);

  useEffect(() => {
    if (loading) {
      dispatch(fetchDeliveriesRequest());
    }

    if (error) {
      dispatch(fetchDeliveriesError(error.message));
    }

    if (data) {
      dispatch(fetchDeliveriesSuccess(data.getOrders.orders));
    }
  }, [data, error, loading, dispatch]);

  const rowData = useSelector(state => state.delivery.orders);

  // delivery mutations
  const createDeliveryMutation = useCreateDeliveryMutation(refetch);
  const deleteDeliveryMutation = useDeleteDeliveryMutation(refetch);
  const updateDeliveryMutation = useUpdateDeliveryMutation(refetch);
 
  const handleEdit = (order) => {
    setOrder(order);
    setMode('edit');
    setShowModal(true);
  };

  const handleDelete = (id) => {
    deleteDeliveryMutation({
      variables: { id },
      onCompleted: () => {
        dispatch(deleteDelivery(id));
        refetch();
        toast.success('Delivery Deleted');
      }
    });
  };

  const handleSave = () => {
    if (order) {
      if (mode === 'edit') {
        updateDeliveryMutation({
          variables: {
            orderId: order?.id,
            orderGroupInfo: {
              status: order?.status,
              startedAt: order?.startedAt,
              customerId: order?.customerId,
              deliveryOrderAttributes: {
                plannedAt: order?.deliveryOrder?.plannedAt,
                completedAt: order?.deliveryOrder?.completedAt,
                customerBranchId: order?.deliveryOrder?.customerBranchId,
                assetId: order?.deliveryOrder?.assetId,
                driverId: order?.deliveryOrder?.driverId,
                lineItems: order?.deliveryOrder?.lineItems.map(item => ({
                  id: item?.id,
                  name: item?.name,
                  quantity: item?.quantity,
                  units: item?.units,
                })),
              }
            }
          },
          onCompleted: (data) => {
            dispatch(updateDelivery(data.editOrder.orders));
            refetch();
            toast.success('Delivery Updated');
            setShowModal(false);
          }
        });
      } else {
        console.log('Creating new delivery:', order);
        createDeliveryMutation({
          variables: {
            orderGroupInfo: {
              status: order?.status,
              startedAt: order?.startedAt,
              customerId: order?.customerId,
              recurring: {
                frequency: order?.recurring?.frequency,
                startedAt: order?.recurring?.startedAt,
                endAt: order?.recurring?.endAt,
              },
              deliveryOrderAttributes: {
                plannedAt: order?.deliveryOrder?.plannedAt,
                completedAt: order?.deliveryOrder?.completedAt,
                customerBranchId: order?.deliveryOrder?.customerBranchId,
                orderGroupId: order?.deliveryOrder?.orderGroupId,
                assetId: order?.deliveryOrder?.assetId,
                driverId: order?.deliveryOrder?.driverId,
                lineItems: order?.deliveryOrder?.lineItems.map(item => ({
                  name: item?.name,
                  quantity: item?.quantity,
                  units: item?.units,
                })),
              }
            }
          },
          onCompleted: (data) => {
            dispatch(addDelivery(data.createDelivery.order));
            console.log(data.createDelivery.order);
            refetch();
            toast.success('Delivery Created');
            setShowModal(false);
          }
        });
      }
    }
  };
  

  const onBtnExport = useCallback(() => {
    gridRef.api.exportDataAsCsv();
  }, [gridRef]);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    flex: 1,
    editable: true,
  }), []);

  const statusCellRenderer = (params) => {
    const status = params.value === 'Active' ? 'success' : 'danger';
    const dotStyle = {
      display: 'inline-block',
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      marginRight: '8px',
      backgroundColor: status === 'success' ? 'green' : 'red',
    };
    return (
      <span>
        <span style={dotStyle}></span>
        <span className={`badge rounded-pill bg-${status}`}>{params.value}</span>
      </span>
    );
  };

  const [colDefs, setColDefs] = useState([
    { headerName: "Status", field: "status", cellRenderer: statusCellRenderer },
    { headerName: "Started At", field: "startedAt" },
    { headerName: "Completed At", field: "completedAt" },
    { headerName: "Customer Name", field: "customer.name" },
    { headerName: "Customer Email", field: "customer.email" },
    { headerName: "Asset Category", field: "deliveryOrder.asset.assetCategory" },
    { headerName: "Driver Name", field: "deliveryOrder.driver.name" },
    { headerName: "Actions", 
      cellRenderer: (params) => (
        <ActionButtons
          onEdit={() => handleEdit(params.data)}
          onDelete={() => handleDelete(params.data.id)}
        />
      ),
      width: 100
    }
  ], []);
  
  const filteredRowData = rowData.filter(item => {
    return (
      item.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.customer?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.customer?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.deliveryOrder?.asset?.assetId.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });
  
  const theme = useColorModeValue('ag-theme-quartz', 'ag-theme-quartz-dark');
  const inputbg = useColorModeValue('#EDF2F7', '#121212');
  const buttonbg = useColorModeValue('#EDF2F7', '#121212');

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      </Box>
    );
  }

  return (
    <div className={theme} style={{ height: 700 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 15, justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: 25, fontWeight: 'bold', padding: 15 }}>Delivery List</h2>
        <div>
          <input 
            type="text" 
            placeholder="Search..." 
            style={{ marginRight: 10, padding: 12, width: 400, borderRadius: 5, background: inputbg, border: `1px solid ${inputbg}`, fontSize: 16 }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button 
            style={{ border: `1px solid ${buttonbg}`, padding: 12, borderRadius: 5, background: buttonbg, fontWeight: 'bold', width: 210, fontSize: 16, marginRight: 10 }} 
            onClick={() => setShowModal(true)}
          >
            <FontAwesomeIcon icon={faCirclePlus} color='orange' />&nbsp; Create New Delivery
          </button>
          <button 
            style={{ border: `1px solid ${buttonbg}`, padding: 12, borderRadius: 5, background: buttonbg, fontWeight: 'bold', fontSize: 16 }} 
            onClick={onBtnExport}
          >
            Export to CSV
          </button>
        </div>
      </div>
      <AgGridTable
        rowData={filteredRowData}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
        gridRef={(ref) => setGridRef(ref)}
        pagination={true}
      />
      {showModal && 
      <DeliveryForm 
        order={order} 
        mode={mode} 
        onSave={handleSave} 
        onClose={() => setShowModal(false)} 
        onChange={(e) => setOrder({ ...order, [e.target.name]: e.target.value })}/>}
    </div>
  );
}
