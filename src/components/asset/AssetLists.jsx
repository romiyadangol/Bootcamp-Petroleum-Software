import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useEffect, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import AssetForm from '../asset/AssetForm';
import { useColorModeValue } from '@chakra-ui/react';
import { toast, Zoom  } from 'react-toastify';
import Toastify from '../Toastify';
import { useDispatch, useSelector } from 'react-redux';
import { GET_ASSETS } from '../../graphql/queries/assets/getAssets';
import { addAsset, deleteAsset, fetchAssetsRequest, fetchAssetsFailure, fetchAssetsSuccess, UPDATE_ASSET, DELETE_ASSET, updateAsset } from '../../redux/actions/assetActions';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_ASSET } from '../../graphql/mutation/assets/createAsset';

export default function AssetLists() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const [asset, setAsset] = useState({
    asset_type: '',
    name: '',
    id: '',
    status: 'Inactive'
  });

  const {data, loading, error, refetch} = useQuery(GET_ASSETS);
  
  const [createAsset] = useMutation(CREATE_ASSET, {
    onCompleted: () => {
      toast.success('Product Created', {
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
      refetch(); 
      setShowModal(false);
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`, {
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
    }
  })

  const [updateAssetMutation] = useMutation(UPDATE_ASSET, {
    onCompleted: () => {
        toast.success('Product Updated', {
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
        refetch(); 
        setShowModal(false);
    },
    onError: (error) => {
        toast.error(`Error: ${error.message}`, {
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
    }
});

const [deleteAssetMutation] = useMutation(DELETE_ASSET, {
    onCompleted: () => {
        toast.success('Product Deleted', {
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
        refetch(); 
    },
    onError: (error) => {
        toast.error(`Error: ${error.message}`, {
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
    }
});
  
  useEffect(() => {
    if (loading) {
      dispatch(fetchAssetsRequest());
    }
  
    if (data) {
      dispatch(fetchAssetsSuccess(data.getAssets.assets));
    }
  
    if (error) {
      dispatch(fetchAssetsFailure(error.message));
    }
  },[data,loading,error,dispatch])


  const rowData = useSelector(state => state.asset.assets || []);
  
  const handleSave = () => {
    if (mode === 'edit') {
      updateAssetMutation({
        variables: {
          assetInfo: {
            id: asset.id,
            name: asset.name,
            assetCategory: asset.assetCategory,
            assetStatus: asset.assetStatus,
          }
        },
        onCompleted: (data) => {
          dispatch(updateAsset(data.updateAsset.Asset));
          refetch();
          toast.success('Asset Updated');
          setShowModal(false);
        }
      });
    }
    else {
      createAsset({
        variables: {
          assetInfo: {
            id: asset.id,
            assetCategory: asset.assetCategory,
            assetStatus: asset.assetStatus
          }
        },
        onCompleted: (data) => {
          dispatch(addAsset(data.createAsset.Asset));
          refetch();
          toast.success('Asset Created');
          setShowModal(false); 
      }
      })
    }

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

  const handleDelete = (id) => {
    deleteAssetMutation({ 
        variables: { id } ,
        onCompleted: (data) => {
            dispatch(deleteAsset(id));
            refetch();
            toast.success('Asset Deleted');
        }
    });
  };

  const handleEdit = (asset) => {
      setAsset(asset);
      setMode('edit'); 
      setShowModal(true);
  };

  const ActionCellRenderer = (params) => (
    <>
    <button
      style={{ color: 'white', border: 'none', borderRadius: '5px', padding: '5px' }}
      onClick={() => handleEdit(params.data)}
    >
      <FontAwesomeIcon icon={faEdit} color='orange' />
    </button>
    <button 
      style={{ color: 'white', border: 'none', borderRadius: '5px', padding: '5px' }}
      onClick={() => handleDelete(params.data.id)}
    >
      <FontAwesomeIcon icon={faTrash} />
    </button>
    </>
  );

  const [colDefs, setColDefs] = useState([
    { headerName: "Asset Type", field: "assetCategory"},
    { headerName: "Asset ID", field: "id"},
    // { headerName: "Name", field: "name", cellRenderer: EditableCellRenderer },
    { headerName: "Status", field: "status", cellRenderer: statusCellRenderer },
    {
      headerName: "Actions",
      cellRenderer: ActionCellRenderer,
      width: 100
    }
  ]);

  const filteredRowData = rowData.filter((item) => {
    return item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           item.assetCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
            onClick={() => {
              setAsset({
                id: '',
                name: '',
                assetCategory: '',
                createdAt: '',
                updatedAt: '',
              })
            }}
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
}