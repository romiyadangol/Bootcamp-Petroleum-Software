import { AgGridReact } from 'ag-grid-react'; 
import "ag-grid-community/styles/ag-grid.css"; 
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useMemo, useState, useEffect } from 'react'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import ProductForm from '../products/ProductForm';
import { useColorModeValue } from '@chakra-ui/react';
import { toast, Zoom } from 'react-toastify';
import Toastify from '../Toastify';
import { useSelector, useDispatch } from 'react-redux';
import { addProduct, updateProduct, deleteProduct, fetchProductsError, fetchProductsRequest, fetchProductsSuccess } from '../../redux/actions/productActions';
import { FIND_PRODUCTS } from '../../graphql/queries/products/findProducts';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_PRODUCT } from '../../graphql/mutation/products/createProduct';
import { UPDATE_PRODUCT } from '../../graphql/mutation/products/updateProduct';
import { DELETE_PRODUCT } from '../../graphql/mutation/products/deleteProduct';

export default function ProductList() {
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const dispatch = useDispatch();
    const [product, setProduct] = useState(null);
    const [mode, setMode] = useState('create'); 

    const { data, loading, error, refetch } = useQuery(FIND_PRODUCTS);

    const [createProduct] = useMutation(CREATE_PRODUCT, {
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
    });

    const [updateProductMutation] = useMutation(UPDATE_PRODUCT, {
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

    const [deleteProductMutation] = useMutation(DELETE_PRODUCT, {
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
            dispatch(fetchProductsRequest());
        }

        if (error) {
            dispatch(fetchProductsError(error.message));
        }

        if (data) {
            dispatch(fetchProductsSuccess(data.findProducts.products));
        }
    }, [data, loading, error, dispatch]);

    const rowData = useSelector((state) => state.product.products || []);

    const handleSave = () => {
        if (mode === 'edit') {
            updateProductMutation({ 
                variables: { 
                    productInfo: {
                        id: product.id,
                        name: product.name,
                        productCategory: product.productCategory,
                        productStatus: product.productStatus,
                        productUnit: product.productUnit
                    }
                },
                onCompleted: (data) => {
                    dispatch(updateProduct(data.updateProduct.product));
                    refetch();
                    toast.success('Product Updated');
                    setShowModal(false);
                }
            });
        } else {
            createProduct({ 
                variables: { 
                    productInfo: {
                        name: product.name,
                        productCategory: product.productCategory,
                        productStatus: product.productStatus,
                        productUnit: product.productUnit
                    }
                },
                onCompleted: (data) => {
                    dispatch(addProduct(data.createProduct.product));
                    refetch();
                    toast.success('Product Created');
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
        const status = params.value === 'available' ? 'success' : 'danger';
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
        deleteProductMutation({ 
            variables: { id } ,
            onCompleted: (data) => {
                dispatch(deleteProduct(id));
                refetch();
                toast.success('Product Deleted');
            }
        });
    };

    const handleEdit = (product) => {
        setProduct(product);
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
                <FontAwesomeIcon icon={faTrash} color={trashIcon} />
            </button>
        </>
    );

    const colDefs = useMemo(() => [
        { headerName: "Name", field: "name" },
        { headerName: "Category", field: "productCategory" },
        { headerName: "Status", field: "productStatus", cellRenderer: statusCellRenderer },
        { headerName: "Unit", field: "productUnit" },
        {
            headerName: "Actions",
            cellRenderer: ActionCellRenderer,
            width: 100
        }
    ], []);

    const filteredRowData = rowData.filter((item) => {
        return item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
               item.productCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
               item.productUnit.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const theme = useColorModeValue('ag-theme-quartz', 'ag-theme-quartz-dark');
    const inputbg = useColorModeValue('#EDF2F7', '#121212');
    const buttonbg = useColorModeValue('#EDF2F7', '#121212');
    const trashIcon = useColorModeValue('#364859', '#F1F3F4');

    return (
        <div className={theme} style={{ height: 700 }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 15, justifyContent: 'space-between' }}>
                <h2 style={{ fontSize: 25, fontWeight: 'bold', padding: 15 }}>Product List</h2>
                <div>
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        style={{ marginRight: 10, padding: 12, width: 400, borderRadius: 5, background: inputbg, border: `1px solid ${inputbg}`, fontSize: 16 }}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button 
                        style={{ border: `1px solid ${buttonbg}`, padding: 12, borderRadius: 5, background: buttonbg, fontWeight: 'bold', width: 250, fontSize: 16 }} 
                        onClick={() => {
                            setProduct({
                                id: '',
                                name: '',
                                productCategory: '',
                                productStatus: '',
                                productUnit: ''
                            });
                            setMode('create'); 
                            setShowModal(true);
                        }}
                    >
                        <FontAwesomeIcon icon={faCirclePlus} color='orange' />&nbsp; Create New Product
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
                <ProductForm 
                    product={product || {}}
                    onChange={(e) => setProduct({ ...product, [e.target.name]: e.target.value })}
                    onSave={handleSave}
                    onClose={() => setShowModal(false)}
                />
            )}
            <Toastify/>
        </div>
    );
}
