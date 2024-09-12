import Toastify from '../Toastify';
import { toast  } from 'react-toastify';
import { useQuery } from '@apollo/client';
import AgGridTable from '../core/AgGridTable';
import DriverForm from  '../drivers/DriverForm';
import { Spinner, Box } from '@chakra-ui/react';
import ActionButtons from '../core/ActionButtons';
import { useColorModeValue } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react'; 
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { GET_DRIVERS } from '../../graphql/queries/driver/getDrivers';
import { useCreateDriverMutation, useDeleteDriverMutation, useUpdateDriverMutation } from '../../hooks/useDriverMutation';
import { addDriver, deleteDriver, fetchDriversFailure, fetchDriversRequest, fetchDriversSuccess } from '../../redux/actions/driverActions';
export default function DriverLists() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [driver, setDriver] = useState(null);
  const [mode, setMode] = useState('create');
  const dispatch = useDispatch();

  const { data, loading, error, refetch } = useQuery(GET_DRIVERS);

  useEffect(() => {
      if (loading) {
          dispatch(fetchDriversRequest());
      }

      if (error) {
          dispatch(fetchDriversFailure(error.message));
      }

      if (data) {
          dispatch(fetchDriversSuccess(data.getDrivers.drivers));
      }
  }, [data, loading, error, dispatch]);

  const rowData = useSelector(state => state.driver.drivers || []);

  const createDriverMutation = useCreateDriverMutation(refetch);
  const updateDriverMutation = useUpdateDriverMutation(refetch);
  const deleteDriverMutation = useDeleteDriverMutation(refetch);

  const handleEdit = (driver) => {
    setDriver(driver);
    setMode('edit');
    setShowModal(true);
  };

  const handleDelete = (id) => {
    deleteDriverMutation({
      variables: { id },
      onCompleted: () => {
        dispatch(deleteDriver(id));
        refetch();
        toast.success('Driver Deleted');
      }
    })
  }

  const handleSave = () => {
    if (mode === 'edit') {
        updateDriverMutation({ 
            variables: { 
                driverInfo: {
                    id: driver.id,
                    name: driver.name,
                    phone: driver.phone,
                    email: driver.email,
                    status: driver.status
                }
            },
            onCompleted: (data) => {
                dispatch(updateDriver(data.editDriver.driver));
                refetch();
                toast.success('Driver Updated');
                setShowModal(false);
            }
        });
    } else {
        createDriverMutation({ 
            variables: { 
              driverInfo: {
                    name: driver.name,
                    phone: driver.phone,
                    email: driver.email,
                    status: driver.status
                }
            },
            onCompleted: (data) => {
                dispatch(addDriver(data.createDriver.driver));
                refetch();
                toast.success('Driver Created');
                setShowModal(false); 
            }
        });
    }
};


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
    { headerName: "Name", field: "name" },
    { headerName: "Phone", field: "phone" },
    { headerName: "Email", field: "email"},
    { headerName: "Status", field: "status", cellRenderer: statusCellRenderer, cellEditor: 'agSelectCellEditor', cellEditorParams: { values: ['Active', 'Inactive'] } },
    {
      headerName: "Actions",
      cellRenderer: (params) => (
        <ActionButtons
          onEdit={() => handleEdit(params.data)}
          onDelete={() => handleDelete(params.data.id)}
        />
      ),
    }
  ], []);

  const filteredRowData = rowData.filter((item) => {
    return item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
          item.phone.toLowerCase().includes(searchQuery.toLowerCase()) || 
          item.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
          item.status.toLowerCase().includes(searchQuery.toLowerCase());
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
        <h2 style={{ fontSize: 25, fontWeight: 'bold', padding: 15 }}>Driver List</h2>
        <div>
          <input 
            type="text" 
            placeholder="Search..." 
            style={{ marginRight: 10, padding: 12, width: 400, borderRadius: 5, background: inputbg, border: `1px solid {inputbg}`, fontSize: 16  }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button 
            style={{ border: `1px solid {buttonbg}`, padding: 12, borderRadius: 5, background: buttonbg, fontWeight: 'bold', width: 200, fontSize: 16 }} 
            onClick={() => setShowModal(true)}
          >
          <FontAwesomeIcon icon={faCirclePlus} color='orange' />&nbsp; Create New Driver
          </button>
        </div>
      </div>
      <AgGridTable
        rowData={filteredRowData}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
      />
      {showModal && (
        <div>
          <DriverForm 
          driver={driver || {}}
          onChange={(e) => setDriver({ ...driver, [e.target.name]: e.target.value })}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
        </div>
      )}
      <Toastify/>
    </div>
  );
}
