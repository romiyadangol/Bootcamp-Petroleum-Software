import { AgGridReact } from 'ag-grid-react'; 
import "ag-grid-community/styles/ag-grid.css"; 
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useMemo, useState } from 'react'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faTrash} from '@fortawesome/free-solid-svg-icons';
import ProductForm from  '../products/ProductForm';
import { useColorModeValue } from '@chakra-ui/react';
import { toast, Zoom  } from 'react-toastify';
import Toastify from '../Toastify';
import EditableCellRenderer from '../EditableCellRenderer';
import { useSelector } from 'react-redux';
import { addProduct, deleteProduct } from '../../redux/actions/productActions';
import { useDispatch } from 'react-redux';

export default function ProductList() {
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [hoveredRowIndex, setHoveredRowIndex] = useState(null);
    const dispatch = useDispatch();
    const [product, setProduct] = useState({
        id: '',
        name: '',
        category: '',
        status: '',
        unit: ''
    });

    const rowData = useSelector(state => state.product || []);

    const handleSave = () => {
        const newProduct = {
            ...product,
            status: product.status === 'true' ? 'Active' : 'Inactive',
        };
        dispatch(addProduct(newProduct));
    
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
      
        setProduct({
            id: '',
            name: '',
            category: '',
            status: '',
            unit: ''
        });
        setShowModal(false);
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

    const handleDelete = (name,category,unit) => {
      dispatch(deleteProduct(name,category,unit));
    };
    
    const ActionCellRenderer = (params) => (
        <button 
            style={{ color: 'white', border: 'none', borderRadius: '5px', padding: '5px' }}
            onClick={() => handleDelete(params.data)}
        >
            <FontAwesomeIcon icon={faTrash} color={trashIcon} />
        </button>
    );

    const [colDefs, setColDefs] = useState([
        { headerName: "Name", field: "name", cellRenderer: EditableCellRenderer },
        { headerName: "Category", field: "category", cellRenderer: EditableCellRenderer  ,  cellEditor: 'agSelectCellEditor', cellEditorParams: { values: ['Fuel', 'Oil'] } },
        { headerName: "Status", field: "status", cellRenderer: statusCellRenderer, cellEditor: 'agSelectCellEditor', cellEditorParams: { values: ['Active', 'Inactive'] } },
        { headerName: "Unit", field: "unit", cellRenderer: EditableCellRenderer , cellEditor: 'agSelectCellEditor', cellEditorParams: { values: ['Gallon', 'Litre'] } },
        {
            headerName: "Actions",
            cellRenderer: ActionCellRenderer,
            width: 100
          }
    ]);

    const filteredRowData = rowData.filter((item) => {
        return item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.category.toLowerCase().includes(searchQuery.toLowerCase()) || item.unit.toLowerCase().includes(searchQuery.toLowerCase());
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
                  style={{ marginRight: 10, padding: 12, width: 400, borderRadius: 5, background: inputbg, border: `1px solid {inputbg}`, fontSize: 16  }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button 
                  style={{ border: `1px solid {buttonbg}` , padding: 12, borderRadius: 5, background: buttonbg, fontWeight: 'bold', width: 200, fontSize: 16 }} 
                  onClick={() => setShowModal(true)}
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
              onRowMouseEnter={e => handleRowMouseEnter(e.rowIndex)}
              onRowMouseLeave={handleRowMouseLeave}
          />
          {showModal && (
            <div>
              <ProductForm 
                product={product}
                onChange={(e) => setProduct({ ...product, [e.target.name]: e.target.value })}
                onSave={handleSave}
                onClose={() => setShowModal(false)}
              />
              </div>
          )}
          <Toastify/>
        </div>
    );
}
