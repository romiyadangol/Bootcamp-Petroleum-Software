import { AgGridReact } from 'ag-grid-react'; 
import "ag-grid-community/styles/ag-grid.css"; 
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useMemo, useState } from 'react'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faTrash} from '@fortawesome/free-solid-svg-icons';
import CustomerForm from  '../customers/CustomerForm';
import { useColorModeValue } from '@chakra-ui/react';
import { toast, Zoom  } from 'react-toastify';
import Toastify from '../Toastify';
import { useDispatch, useSelector } from 'react-redux';
import { addCustomer, deleteCustomer } from '../../redux/actions/customerActions';

export default function CustomerLists() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    status: '',
    city: '',
    zip: '',
  });

  const rowData = useSelector(state => state.customer || []);

  const handleSave = () => {
    const newCustomer = {
    ...Customer,
    status: customer.status === 'true' ? 'Active' : 'Inactive',
    };
    dispatch(addCustomer(newCustomer));

    toast.success('Customer Created', {
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

    setCustomer({
      name: '',
      phone: '',
      email: '',
      address: '',
      status: '',
      city: '',
      zip: '',
      });
      setShowModal(false);
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
    dispatch(deleteCustomer(name, phone, email));
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
    { headerName: "Name", field: "name" },
    { headerName: "Phone", field: "phone" },
    { headerName: "Email", field: "email" },
    { headerName: "Address", field: "address" },
    { headerName: "Status", field: "status", cellRenderer: statusCellRenderer, cellEditor: 'agSelectCellEditor', cellEditorParams: { values: ['Active', 'Inactive'] } },
    { headerName: "City", field: "city" },
    { headerName: "Zip", field: "zip" },
    {
      headerName: "Actions",
      cellRenderer: ActionCellRenderer,
      width: 100
    }
  ]);

  const filteredRowData = rowData.filter((item) => {
    return item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.phone.toLowerCase().includes(searchQuery.toLowerCase()) || item.email.toLowerCase().includes(searchQuery.toLowerCase()) || item.address.toLowerCase().includes(searchQuery.toLowerCase()) || item.status.toLowerCase().includes(searchQuery.toLowerCase()) || item.city.toLowerCase().includes(searchQuery.toLowerCase()) || item.zip.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const theme = useColorModeValue('ag-theme-quartz', 'ag-theme-quartz-dark');

  const inputbg = useColorModeValue('#EDF2F7', '#121212');
  const buttonbg = useColorModeValue('#EDF2F7', '#121212');

  return (
    <div className={theme} style={{ height: 700 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 15, justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: 25, fontWeight: 'bold', padding: 15 }}>Customer List</h2>
        <div>
          <input 
            type="text" 
            placeholder="Search..." 
            style={{ marginRight: 10, padding: 12, width: 400, borderRadius: 5, background: inputbg, border: `1px solid {inputbg}`, fontSize: 16  }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button 
            style={{ border: `1px solid {buttonbg}`, padding: 12, borderRadius: 5, background: buttonbg, fontWeight: 'bold', width: 250, fontSize: 16 }} 
            onClick={() => setShowModal(true)}
          >
          <FontAwesomeIcon icon={faCirclePlus} color='orange' />&nbsp; Create New Customer
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
      />
      {showModal && (
        <div>
          <CustomerForm 
          customer={customer}
          onChange={(e) => setCustomer({ ...customer, [e.target.name]: e.target.value })}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
        </div>
      )}
      <Toastify/>
    </div>
  );
}
