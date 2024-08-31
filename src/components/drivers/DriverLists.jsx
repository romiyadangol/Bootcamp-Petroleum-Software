import { AgGridReact } from 'ag-grid-react'; 
import "ag-grid-community/styles/ag-grid.css"; 
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useMemo, useState } from 'react'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus} from '@fortawesome/free-solid-svg-icons';
import DriverForm from  '../drivers/DriverForm';
import { useColorModeValue } from '@chakra-ui/react';


export default function DriverLists() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [driver, setDriver] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    status: ''
  });

  const [rowData, setRowData] = useState([
    { name: 'Ram', phone: '1234567890', email: 'user1@gmail.com', address: 'Dallas, Texas', status: 'Active' },
    { name: 'Hari', phone: '1234567890', email: 'user2@gmail.com', address: 'Kathmandu, Nepal', status: 'InActive' },
  ]);

  const handleSave = () => {
    const newDriver = {
    ...driver,
    status: driver.status === 'true' ? 'Active' : 'Inactive',
  };

  setRowData(prevRowData => {
    const updatedRowData = [...prevRowData, newDriver];
    return updatedRowData;
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

  const defaultColDef = useMemo(() => ({
    sortable: true,
    flex: 1,
    editable: true,
  }), []);

  const [colDefs, setColDefs] = useState([
    { headerName: "Name", field: "name" },
    { headerName: "Phone", field: "phone" },
    { headerName: "Email", field: "email" },
    { headerName: "Address", field: "address" },
    { headerName: "Status", field: "status" },
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
    </div>
  );
}
