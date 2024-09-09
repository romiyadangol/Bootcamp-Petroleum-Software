import { useMemo, useState, useEffect } from 'react'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import ProductForm from '../products/ProductForm';
import { useColorModeValue } from '@chakra-ui/react';
import { toast } from 'react-toastify';
import Toastify from '../Toastify';
import { useSelector, useDispatch } from 'react-redux';
import { addProduct, updateProduct, deleteProduct, fetchProductsError, fetchProductsRequest, fetchProductsSuccess } from '../../redux/actions/productActions';
import { useQuery } from '@apollo/client';
import { FIND_PRODUCTS } from '../../graphql/queries/products/findProducts';
import AgGridTable from '../core/AgGridTable';
import { useCreateProductMutation, useDeleteProductMutation, useUpdateProductMutation } from '../../hooks/useProductMutation';
import ActionButtons from '../core/ActionButtons';

export default function ProductList() {
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [product, setProduct] = useState(null);
    const [mode, setMode] = useState('create'); 
    const dispatch = useDispatch();

    //product queries
    const { data, loading, error, refetch } = useQuery(FIND_PRODUCTS);

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

    const rowData = useSelector((state) => state.product.products || []);4

    //product mutations
    const createProductMutation = useCreateProductMutation(refetch);
    const updateProductMutation = useUpdateProductMutation(refetch);
    const deleteProductMutation = useDeleteProductMutation(refetch);

    const handleEdit = (product) => {
        setProduct(product);
        setMode('edit');
        setShowModal(true);
    };

    const handleDelete = (id) => {
        deleteProductMutation({
            variables: { id },
            onCompleted: () => {
                dispatch(deleteProduct(id));
                refetch();
                toast.success('Product Deleted');
            }
        })
    }

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
            createProductMutation({ 
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

    const colDefs = useMemo(() => [
        { headerName: "Name", field: "name" },
        { headerName: "Category", field: "productCategory" },
        { headerName: "Status", field: "productStatus", cellRenderer: statusCellRenderer },
        { headerName: "Unit", field: "productUnit" },
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
        return item?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
               item?.productCategory?.toLowerCase().includes(searchQuery.toLowerCase()) ||
               item?.productUnit?.toLowerCase().includes(searchQuery.toLowerCase());
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
            <AgGridTable rowData={filteredRowData} columnDefs={colDefs} defaultColDef={defaultColDef} />
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


