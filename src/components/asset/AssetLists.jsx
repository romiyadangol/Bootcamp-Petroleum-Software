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
import { useDispatch, useSelector } from 'react-redux';
import { GET_ASSETS } from '../../graphql/queries/getAssets';
import { addAsset, deleteAsset, fetchAssetsRequest, fetchAssetsFailure, fetchAssetsSuccess } from '../../redux/actions/assetActions';
import { useQuery } from '@apollo/client';

export default function AssetLists() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [hoveredRowIndex, setHoveredRowIndex] = useState(null);
  const dispatch = useDispatch();
  const [asset, setAsset] = useState({
    asset_type: '',
    name: '',
    id: '',
    status: 'Inactive'
  });
  const {data, loading, error, refetch} = useQuery(GET_ASSETS);
  if (loading) {
    dispatch(fetchAssetsRequest());
  }

  if (data) {
    dispatch(fetchAssetsSuccess(data.getAssets.assets));
  }

  if (error) {
    dispatch(fetchAssetsFailure(error.message));
  }


  const rowData = useSelector(state => state.asset.assets || []);
  
  const handleSave = () => {
    const newAsset = {
      ...asset,
      status: asset.status === 'true' ? 'Active' : 'Inactive',
    };
    dispatch(addAsset(newAsset));

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
    refetch();
    setShowModal(false);
  };

  const handleDelete = (id) => {
    dispatch(deleteAsset(id));
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
    { headerName: "Asset ID", field: "asset_id", cellRenderer: EditableCellRenderer },
    // { headerName: "Name", field: "name", cellRenderer: EditableCellRenderer },
    { headerName: "Status", field: "status", cellRenderer: statusCellRenderer, cellEditor: 'agSelectCellEditor', cellEditorParams: { values: ['Active', 'Inactive'] } },
    {
      headerName: "Actions",
      cellRenderer: ActionCellRenderer,
      width: 100
    }
  ]);

  const filteredRowData = rowData.filter((item) => {
    return item.asset_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
          //  item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           item.asset_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
           item.status.toLowerCase().includes(searchQuery.toLowerCase());
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
            style={{ marginRight: 10, padding: 12, width: 400, borderRadius: 5, background: inputbg, border: `1px solid ${inputbg}`, fontSize: 16 }}
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
      <Toastify />
    </div>
  )
}  