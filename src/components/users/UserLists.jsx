import { AgGridReact } from 'ag-grid-react'; 
import "ag-grid-community/styles/ag-grid.css"; 
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useMemo, useState } from 'react'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faTrash} from '@fortawesome/free-solid-svg-icons';
import UserForm from  '../users/UserForm';
import { useColorModeValue } from '@chakra-ui/react';
import { toast, Zoom } from 'react-toastify';
import Toastify from '../Toastify';
import { useDispatch, useSelector } from 'react-redux';
import { addUser, deleteUser } from '../../redux/actions/userActions';

export default function UserLists() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [hoveredRowIndex, setHoveredRowIndex] = useState(null);
  const dispatch = useDispatch();
  const [user, setUser] = useState({
    name: '',
    phone: '',
    email: '',
    role: '',
    status: ''
  });

  const rowData = useSelector(state => state.user || []);

  const handleSave = () => {
    const newUser = {
    ...user,
    status: user.status === 'true' ? 'Active' : 'Inactive',
    id: rowData.length + 1,
    };
    dispatch(addUser(newUser));

    toast.success('User Created', {
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

    setUser({
      name: '',
      phone: '',
      email: '',
      role: '',
      status: ''
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
    dispatch(deleteUser(name, phone, email));
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
    { headerName: "Name", field: "name"},
    { headerName: "Phone", field: "phone"},
    { headerName: "Email", field: "email"},
    { headerName: "Role", field: "role" , cellEditor: 'agSelectCellEditor', cellEditorParams: { values: ['dispatcher', 'accounting', 'admin'] } },
    { headerName: "Status", field: "status", cellRenderer: statusCellRenderer , cellEditor: 'agSelectCellEditor', cellEditorParams: { values: ['Active', 'Inactive'] } },
    {
      headerName: "Actions",
      cellRenderer: ActionCellRenderer,
      width: 100
    }
  ]);

  const filteredRowData = rowData.filter((item) => {
    return item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.phone.toLowerCase().includes(searchQuery.toLowerCase()) || item.email.toLowerCase().includes(searchQuery.toLowerCase()) || item.role.toLowerCase().includes(searchQuery.toLowerCase()) || item.role.toLowerCase().includes(searchQuery.toLowerCase()) || item.status.toString().toLowerCase().includes(searchQuery.toLowerCase());
  });

  const theme = useColorModeValue('ag-theme-quartz', 'ag-theme-quartz-dark');

  const inputbg = useColorModeValue('#EDF2F7', '#121212');
  const buttonbg = useColorModeValue('#EDF2F7', '#121212');

  return (
    <div className={theme} style={{ height: 700 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 15, justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: 25, fontWeight: 'bold', padding: 15 }}>User List</h2>
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
          <FontAwesomeIcon icon={faCirclePlus} color='orange' />&nbsp; Create New User
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
          <UserForm 
          user={user}
          onChange={(e) => setUser({ ...user, [e.target.name]: e.target.value })}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
        </div>
      )}
      <Toastify/>
    </div>
  );
}
