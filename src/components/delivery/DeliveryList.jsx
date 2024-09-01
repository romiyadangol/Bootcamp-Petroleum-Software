import { AgGridReact } from 'ag-grid-react'; 
import "ag-grid-community/styles/ag-grid.css"; 
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useMemo, useState } from 'react'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faTrash} from '@fortawesome/free-solid-svg-icons';
import DeliveryForm from  '../delivery/DeliveryForm';
import { useColorModeValue } from '@chakra-ui/react';

export default function DeliveryList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [delivery, setDelivery] = useState({
    pricing: '',
    status: '',
    created_at: '',
    type: '',
    planned_at: '',
    customer: '',
    address: '',
    state: '',
    city: '', 
    zip: '',
  });

  const [rowData, setRowData] = useState([
    { pricing: '$1000', status: 'Active', created_at: '2024-09-01', type: 'Fuel', planned_at: '2024-09-05', customer: 'John Doe', address: '123 Main St', state: 'CA', city: 'Los Angeles', zip: '90001' },
    { pricing: '$2000', status: 'Inactive', created_at: '2024-09-02', type: 'Oil', planned_at: '2024-09-06', customer: 'Jane Smith', address: '456 Oak Ave', state: 'NY', city: 'New York', zip: '10001' },
  ]);

  const handleSave = () => {
    const newDelivery = {
      ...delivery,
      status: delivery.status === 'true' ? 'Active' : 'Inactive',
    };

    setRowData(prevRowData => {
      const updatedRowData = [...prevRowData, newDelivery];
      return updatedRowData;
    });

    setDelivery({
      pricing: '',
      status: '',
      created_at: '',
      type: '',
      planned_at: '',
      customer: '',
      address: '',
      state: '',
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

  const ActionCellRenderer = (params) => (
    <button 
      style={{ color: 'white', border: 'none', borderRadius: '5px', padding: '5px' }}
      onClick={() => handleDelete(params.data.unique_id)}
    >
      <FontAwesomeIcon icon={faTrash} />
    </button>
  );

  const [colDefs, setColDefs] = useState([
    { headerName: "Pricing", field: "pricing" },
    { headerName: "Status", field: "status", cellRenderer: statusCellRenderer, cellEditor: 'agSelectCellEditor', cellEditorParams: { values: ['Active', 'Inactive'] } },
    { headerName: "Created At", field: "created_at" },
    { headerName: "Type", field: "type" },
    { headerName: "Planned At", field: "planned_at" },
    { headerName: "Customer", field: "customer" },
    { headerName: "Address", field: "address" },
    { headerName: "State", field: "state" },
    { headerName: "City", field: "city" },
    { headerName: "Zip", field: "zip" },
    {
      headerName: "Actions",
      cellRenderer: ActionCellRenderer,
      width: 100
    }
  ]);

  const filteredRowData = rowData.filter((item) => {
    return (
      item.pricing.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.created_at.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.planned_at.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.zip.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const theme = useColorModeValue('ag-theme-quartz', 'ag-theme-quartz-dark');
  const inputbg = useColorModeValue('#EDF2F7', '#121212');
  const buttonbg = useColorModeValue('#EDF2F7', '#121212');

  return (
    <div className={theme} style={{ height: 700 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 15, justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: 25, fontWeight: 'bold', padding: 15 }}>Delivery List</h2>
        <div>
          <input 
            type="text" 
            placeholder="Search..." 
            style={{ marginRight: 10, padding: 12, width: 400, borderRadius: 5, background: inputbg, border: `1px solid ${inputbg}`, fontSize: 16  }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button 
            style={{ border: `1px solid ${buttonbg}`, padding: 12, borderRadius: 5, background: buttonbg, fontWeight: 'bold', width: 210, fontSize: 16 }} 
            onClick={() => setShowModal(true)}
          >
          <FontAwesomeIcon icon={faCirclePlus} color='orange' />&nbsp; Create New Delivery
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
      />
      {showModal && (
        <div>
          <DeliveryForm 
            delivery={delivery}
            onChange={(e) => setDelivery({ ...delivery, [e.target.name]: e.target.value })}
            onSave={handleSave}
            onClose={() => setShowModal(false)}
          />
        </div>
      )}
    </div>
  );
}
