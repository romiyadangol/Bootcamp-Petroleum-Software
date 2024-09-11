import { useEffect, useMemo, useState } from 'react'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { useColorModeValue } from '@chakra-ui/react';
import { toast } from 'react-toastify';
import Toastify from '../Toastify';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from '@apollo/client';
import ActionButtons from '../core/ActionButtons';
import AgGridTable from '../core/AgGridTable';
import { GET_CUSTOMER_BRANCH } from '../../graphql/queries/customerBranch/getCustomerBranch';
import { addCustomerBranch, deleteCustomerBranch, fetchCustomerBranchesError, fetchCustomerBranchesRequest, fetchCustomerBranchesSuccess, updateCustomerBranch } from '../../redux/actions/customerBranchActions';
import { useCreateCustomerBranchMutation, useDeleteCustomerBranchMutation, useUpdateCustomerBranchMutation } from '../../hooks/useCustomerBranchMutation';
import CustomerBranchForm from './CustomerBranchForm';
import { useParams } from 'react-router-dom';

export default function CustomerBranchList() {
  const { customerId } = useParams(); 
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [customerBranch, setCustomerBranch] = useState();
  const [mode, setMode] = useState('create');
  const dispatch = useDispatch();

  // Customer branch queries
  const { data, loading, error, refetch } = useQuery(GET_CUSTOMER_BRANCH, {
    variables: { id: customerId },
  });

  useEffect(() => {
    if (loading) {
      dispatch(fetchCustomerBranchesRequest());
    }

    if (error) {
      dispatch(fetchCustomerBranchesError(error.message));
    }

    if(data) {
      dispatch(fetchCustomerBranchesSuccess(data.getCustomerBranch.customerBranches));
    }
  }, [data, error, loading, dispatch]);

  useEffect(() => {
    const url = location.href;
    const urlObj = new URL(url);
    console.log(urlObj.searchParams.get('customerId'));
  },[urlObj])

  const rowData = useSelector(state => state.customerBranch.customerBranches || []);

  // Customer branch mutations
  const createCustomerBranchMutation = useCreateCustomerBranchMutation(refetch);
  const deleteCustomerBranchMutation = useDeleteCustomerBranchMutation(refetch);
  const updateCustomerBranchMutation = useUpdateCustomerBranchMutation(refetch);

  const handleEdit = (customerBranch) => {
    setCustomerBranch(customerBranch);
    setMode('edit');
    setShowModal(true);
  };

  const handleDelete = (id) => {
    deleteCustomerBranchMutation({
      variables: { id },
      onCompleted: () => {
        dispatch(deleteCustomerBranch(id));
        refetch();
        toast.success('Customer Branch Deleted');
      }
    });
  };

  const handleSave = () => {
    if (mode === 'edit') {
      updateCustomerBranchMutation({
        variables: {
          branchInfo: {
            name: customerBranch.name,
            location: customerBranch.location,
            customerId: customerBranch.customerId,
            customerBranchId: customerBranch.customerBranchId
          }
        },
        onCompleted: (data) => {
          dispatch(updateCustomerBranch(data.updateCustomerBranch.customerBranch));
          refetch();
          toast.success('Customer Branch Updated');
          setShowModal(false);
        }
      });
    } else {
      createCustomerBranchMutation({
        variables: {
          branchInfo: {
            name: customerBranch.name,
            location: customerBranch.location,
            customerId: customerBranch.customerId,
          }
        },
        onCompleted: (data) => {
          dispatch(addCustomerBranch(data.createCustomerBranch.customerBranch));
          refetch();
          toast.success('Customer Branch Created');
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

  const [colDefs, setColDefs] = useState([
    { headerName: "Name", field: "name" },
    { headerName: "Location", field: "location" },
    { headerName: "Customer ID", field: "customerId" },
    {
      headerName: "Actions",
      cellRenderer: (params) => (
        <ActionButtons
          onEdit={() => handleEdit(params.data)}
          onDelete={() => handleDelete(params.data.id)}
        />
      ),
      width: 100
    }
  ], []);

  const filteredRowData = rowData.filter((item) => {
    return (
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.customerId.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const theme = useColorModeValue('ag-theme-quartz', 'ag-theme-quartz-dark');
  const inputbg = useColorModeValue('#EDF2F7', '#121212');
  const buttonbg = useColorModeValue('#EDF2F7', '#121212');

  return (
    <div className={theme} style={{ height: 700 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 15, justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: 25, fontWeight: 'bold', padding: 15 }}>Customer Branch List</h2>
        <div>
          <input 
            type="text" 
            placeholder="Search..." 
            style={{ marginRight: 10, padding: 12, width: 400, borderRadius: 5, background: inputbg, border: `1px solid ${inputbg}`, fontSize: 16 }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button 
            style={{ border: `1px solid ${buttonbg}`, padding: 12, borderRadius: 5, background: buttonbg, fontWeight: 'bold', width: 290, fontSize: 16 }} 
            onClick={() => setShowModal(true)}
          >
            <FontAwesomeIcon icon={faCirclePlus} color='orange' />&nbsp; Create New Customer Branch
          </button>
        </div>
      </div>
      <AgGridTable
        rowData={filteredRowData}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
      />
      {showModal && (
        <div>
          <CustomerBranchForm
            customerBranch={customerBranch || {}}
            onChange={(e) => setCustomerBranch({ ...customerBranch, [e.target.name]: e.target.value })}
            onSave={handleSave}
            onClose={() => setShowModal(false)}
          />
        </div>
      )}
      <Toastify />
    </div>
  );
}
