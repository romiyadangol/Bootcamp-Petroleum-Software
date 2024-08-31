import { AgGridReact } from 'ag-grid-react'; 
import "ag-grid-community/styles/ag-grid.css"; 
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useMemo, useState } from 'react'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus} from '@fortawesome/free-solid-svg-icons';
import UserForm from  '../users/UserForm';
import { useColorModeValue } from '@chakra-ui/react';


export default function UserLists() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState({
    name: '',
    phone: '',
    email: '',
    role: '',
    status: ''
  });

  const [rowData, setRowData] = useState([
    { name: 'User 1', phone: '1234567890', email: 'user1@gmail.com', role: 'dispatcher,admin', status: 'Active' },
    { name: 'User 2', phone: '1234567890', email: 'user2@gmail.com', role: 'accounting', status: 'InActive' },
  ]);

  const handleSave = () => {
    const newUser = {
    ...user,
    status: user.status === 'true' ? 'Active' : 'Inactive',
  };

  setRowData(prevRowData => {
    const updatedRowData = [...prevRowData, newUser];
    return updatedRowData;
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

  const [colDefs, setColDefs] = useState([
    { headerName: "Name", field: "name" },
    { headerName: "Phone", field: "phone" },
    { headerName: "Email", field: "email" },
    { headerName: "Role", field: "role" },
    { headerName: "Status", field: "status" },
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
    </div>
  );
}
