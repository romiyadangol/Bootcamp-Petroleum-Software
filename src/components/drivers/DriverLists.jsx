import { AgGridReact } from 'ag-grid-react'; 
import "ag-grid-community/styles/ag-grid.css"; 
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useMemo, useState } from 'react'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faTrash} from '@fortawesome/free-solid-svg-icons';
import DriverForm from  '../drivers/DriverForm';
import { useColorModeValue } from '@chakra-ui/react';
import { toast, Zoom  } from 'react-toastify';
import Toastify from '../Toastify';
import { useDispatch, useSelector } from 'react-redux';
import { addDriver, deleteDriver } from '../../redux/actions/driverActions';
import EditableCellRenderer from '../EditableCellRenderer';

export default function DriverLists() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [hoveredRowIndex, setHoveredRowIndex] = useState(null);
  const dispatch = useDispatch();
  const [driver, setDriver] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    status: ''
  });

  const rowData = useSelector(state => state.driver || []);

  const handleSave = () => {
    const newDriver = {
    ...driver,
    status: driver.status === 'true' ? 'Active' : 'Inactive',
    };
    dispatch(addDriver(newDriver));

    toast.success('Driver Created', {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Zoom,
    });

    setDriver({
      name: '',
      phone: '',
      email: '',
      address: '',
      status: ''
      });
      setShowModal(false);
  };


  const handleRowMouseEnter = (rowIndex) => {
    setHoveredRowIndex(rowIndex);
  };

  const handleRowMouseLeave = () => {
    setHoveredRowIndex(null);
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

  const handleDelete = (name, phone, email) => {
   dispatch(deleteDriver(name, phone, email));
  };

  const ActionCellRenderer = (params) => (
      <button 
          style={{ color: 'white', border: 'none', borderRadius: '5px', padding: '5px' }}
          onClick={() => handleDelete(params.data)}
      >
          <FontAwesomeIcon icon={faTrash} />
      </button>
  );


  const [colDefs, setColDefs] = useState([
    { headerName: "Name", field: "name" , cellRenderer: EditableCellRenderer},
    { headerName: "Phone", field: "phone", cellRenderer: EditableCellRenderer },
    { headerName: "Email", field: "email", cellRenderer: EditableCellRenderer },
    { headerName: "Address", field: "address", cellRenderer: EditableCellRenderer },
    { headerName: "Status", field: "status", cellRenderer: statusCellRenderer, cellEditor: 'agSelectCellEditor', cellEditorParams: { values: ['Active', 'Inactive'] } },
    {
      headerName: "Actions",
      cellRenderer: ActionCellRenderer,
      width: 100
    }
  ]);

  const filteredRowData = rowData.filter((item) => {
    return item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.phone.toLowerCase().includes(searchQuery.toLowerCase()) || item.email.toLowerCase().includes(searchQuery.toLowerCase()) || item.address.toLowerCase().includes(searchQuery.toLowerCase()) || item.status.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const theme = useColorModeValue('ag-theme-quartz', 'ag-theme-quartz-dark');

  const inputbg = useColorModeValue('#EDF2F7', '#121212');
  const buttonbg = useColorModeValue('#EDF2F7', '#121212');

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
      <AgGridReact
        rowData={filteredRowData}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
        rowSelection='multiple'
        pagination={true}
        paginationPageSize={10}
        paginationPageSizeSelector={[10, 20, 30]}
        onRowMouseEnter={e => handleRowMouseEnter(e.rowIndex)}
        onRowMouseLeave={handleRowMouseLeave}
      />
      {showModal && (
        <div>
          <DriverForm 
          driver={driver}
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
