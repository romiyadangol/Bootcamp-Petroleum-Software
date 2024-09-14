import Toastify from '../Toastify';
import { toast } from 'react-toastify';
import { useQuery } from '@apollo/client';
import AssetForm from '../asset/AssetForm';
import AgGridTable from '../core/AgGridTable';
import { Spinner, Box } from '@chakra-ui/react';
import ActionButtons from '../core/ActionButtons';
import { useEffect, useMemo, useState } from 'react';
import { useColorModeValue } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { GET_ASSETS } from '../../graphql/queries/assets/getAssets';
import { useCreateAssetMutation, useDeleteAssetMutation, useUpdateAssetMutation } from '../../hooks/useAssetMutation';
import { addAsset, deleteAsset, fetchAssetsRequest, fetchAssetsFailure, fetchAssetsSuccess, updateAsset } from '../../redux/actions/assetActions';
import DatePicker from '../core/DatePicker';

export default function AssetLists() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [asset, setAsset] = useState(null);
  const [mode, setMode] = useState('create');
  const dispatch = useDispatch();

  const { data, loading, error, refetch } = useQuery(GET_ASSETS);

  useEffect(() => {
    if (loading) {
      dispatch(fetchAssetsRequest());
    }

    if (data) {
      console.log('Assets data:', data);
      dispatch(fetchAssetsSuccess(data.getAssets.assets));
    }

    if (error) {
      dispatch(fetchAssetsFailure(error.message));
    }
  }, [data, loading, error, dispatch]);

  const rowData = useSelector(state => state.asset.assets || []);
  // console.log('Row data:', rowData);

  const createAssetMutation = useCreateAssetMutation(refetch);
  const updateAssetMutation = useUpdateAssetMutation(refetch);
  const deleteAssetMutation = useDeleteAssetMutation(refetch);

  const handleEdit = (asset) => {
    setAsset(asset);
    setMode('edit');
    setShowModal(true);
  };

  const handleDelete = (id) => {
    deleteAssetMutation({
      variables: { id },
      onCompleted: () => {
        dispatch(deleteAsset(id));
        refetch();
        toast.success('Asset Deleted');
      }
    });
  };

  const handleSave = () => {
    const currentDate = new Date().toISOString();
    if (mode === 'edit') {
      updateAssetMutation({
        variables: {
          assetInfo: {
            id: asset.id,
            assetId: asset.assetId,
            assetCategory: asset.assetCategory,
            assetStatus: asset.assetStatus,
            createdAt: asset.createdAt || currentDate,
          }
        },
        onCompleted: (data) => {
          dispatch(updateAsset(data.editAsset.asset));
          refetch();
          toast.success('Asset Updated');
          setShowModal(false);
        }
      });
    } else {
      createAssetMutation({
        variables: {
          assetInfo: {
            assetId: asset.assetId,
            assetCategory: asset.assetCategory,
            assetStatus: asset.assetStatus,
            createdAt: currentDate,
          }
        },
        onCompleted: (data) => {
          dispatch(addAsset({
            ...data.createAsset.asset,
            createdAt: currentDate,
          }));
          refetch();
          toast.success('Asset Created');
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
    const status = params.value === 'active' ? 'success' : 'danger';
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
    { headerName: "Asset Type", field: "assetCategory" },
    { headerName: "Asset ID", field: "assetId" },
    { headerName: "Status", field: "assetStatus", cellRenderer: statusCellRenderer },
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
    const matchSearchQuery = item?.assetId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
           item?.assetCategory?.toLowerCase().includes(searchQuery.toLowerCase()) ||
           item?.assetStatus?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchDate = selectedDate ? new Date(item.createdAt).toDateString() === selectedDate.toDateString() : true;

    return matchSearchQuery && matchDate;
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
        <h2 style={{ fontSize: 25, fontWeight: 'bold', padding: 15 }}>Asset List</h2>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 15, justifyContent: 'space-between' }}>
          <input
            type="text"
            placeholder="Search..."
            style={{ marginRight: 10, padding: 12, width: 400, borderRadius: 5, background: inputbg, border: `1px solid ${inputbg}`, fontSize: 16 }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
           <DatePicker selected={selectedDate} onChange={setSelectedDate} />
          <button
            style={{ border: `1px solid ${buttonbg}`, padding: 12, borderRadius: 5, background: buttonbg, fontWeight: 'bold', width: 200, fontSize: 16, }}
            onClick={() => {
              setAsset({
                id: '',
                assetId: '',
                assetCategory: '',
                assetStatus: ''
              });
              setMode('create');
              setShowModal(true);
            }}
          >
            <FontAwesomeIcon icon={faCirclePlus} color='orange' />&nbsp; Create New Asset
          </button>
        </div>
      </div>
      <AgGridTable
        rowData={filteredRowData}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
      />
      {showModal && (
        <AssetForm
          asset={asset || {}}
          onChange={(e) => setAsset({ ...asset, [e.target.name]: e.target.value })}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}
      <Toastify />
    </div>
  )
}
