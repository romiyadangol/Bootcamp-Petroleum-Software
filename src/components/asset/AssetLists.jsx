import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import AssetForm from '../asset/AssetForm';
import { useColorModeValue } from '@chakra-ui/react';
import { toast, Zoom  } from 'react-toastify';
import Toastify from '../Toastify';
import EditableCellRenderer from '../EditableCellRenderer';

export default function AssetLists() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [hoveredRowIndex, setHoveredRowIndex] = useState(null);
  const [asset, setAsset] = useState({
    asset_type: '',
    name: '',
    unique_id: '',
    status: ''
  });

  const [rowData, setRowData] = useState([
    { asset_type: 'tank', name: 'Petroleum Storage Tank 1', unique_id: 'ba3af9bb-4871-4e49-879a-3a641db40912', status: 'Active' },
    { asset_type: 'tank-wagon', name: 'Crude Oil Tanker Wagon', unique_id: '0fdf9944-0370-4d0f-a348-d1941dedde20', status: 'Inactive' },
    { asset_type: 'truck', name: 'Fuel Delivery Truck 300', unique_id: 'f3b3b3b3-3b3b-3b3b-3b3b-3b3b3b3b3b3b', status: 'Active' },
    { asset_type: 'trailer', name: 'Fuel Tank Trailer T100', unique_id: 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', status: 'Inactive' },
    { asset_type: 'tank', name: 'Fuel Oil Tank A', unique_id: 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a3a3', status: 'Active' },
  ]);

  const handleSave = () => {
    const newAsset = {
      ...asset,
      status: asset.status === 'true' ? 'Active' : 'Inactive',
    };

    setRowData(prevRowData => {
      const updatedRowData = [...prevRowData, newAsset];
      return updatedRowData;
    });

    toast.success('Assets Created', {
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

    setAsset({
      asset_type: '',
      name: '',
      unique_id: '',
      status: ''
    });
    setShowModal(false);
  };

  const handleDelete = (unique_id) => {
    setRowData(prevRowData => prevRowData.filter(asset => asset.unique_id !== unique_id));
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

  const ActionCellRenderer = (params) => (
    <button 
      style={{ color: 'white', border: 'none', borderRadius: '5px', padding: '5px' }}
      onClick={() => handleDelete(params.data.unique_id)}
    >
      <FontAwesomeIcon icon={faTrash} />
    </button>
  );

  const [colDefs, setColDefs] = useState([
    { headerName: "Asset Type", field: "asset_type", cellRenderer: EditableCellRenderer },
    { headerName: "Name", field: "name", cellRenderer: EditableCellRenderer },
    { headerName: "Unique ID", field: "unique_id" },
    { headerName: "Status", field: "status", cellRenderer: statusCellRenderer, cellEditor: 'agSelectCellEditor', cellEditorParams: { values: ['Active', 'Inactive'] } },
    {
      headerName: "Actions",
      cellRenderer: ActionCellRenderer,
      width: 100
    }
  ]);

  const filteredRowData = rowData.filter((item) => {
    return item.asset_type.toLowerCase().includes(searchQuery.toLowerCase()) || item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.unique_id.toLowerCase().includes(searchQuery.toLowerCase()) || item.status.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const theme = useColorModeValue('ag-theme-quartz', 'ag-theme-quartz-dark');
  const inputbg = useColorModeValue('#EDF2F7', '#121212');
  const buttonbg = useColorModeValue('#EDF2F7', '#121212');

  return (
    <div className={theme} style={{ height: 700 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 15, justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: 25, fontWeight: 'bold', padding: 15 }}>Asset List</h2>
        <div>
          <input 
            type="text" 
            placeholder="Search..." 
            style={{ marginRight: 10, padding: 12, width: 400, borderRadius: 5, background: inputbg, border: `1px solid ${inputbg}`, fontSize: 16  }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button 
            style={{ border: `1px solid ${buttonbg}`, padding: 12, borderRadius: 5, background: buttonbg, fontWeight: 'bold', width: 200, fontSize: 16 }} 
            onClick={() => setShowModal(true)}
          >
            <FontAwesomeIcon icon={faCirclePlus} color='orange' />&nbsp; Create New Asset
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
          <AssetForm 
            asset={asset}
            onChange={(e) => setAsset({ ...asset, [e.target.name]: e.target.value })}
            onSave={handleSave}
            onClose={() => setShowModal(false)}
            onDelete={handleDelete}
          />
        </div>
      )}
      <Toastify/>
    </div>
  );
}
