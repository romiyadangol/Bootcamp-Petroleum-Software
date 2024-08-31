import { AgGridReact } from 'ag-grid-react'; 
import "ag-grid-community/styles/ag-grid.css"; 
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useMemo, useState } from 'react'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faTrash} from '@fortawesome/free-solid-svg-icons';
import ProductForm from  '../products/ProductForm';
import { useColorModeValue } from '@chakra-ui/react';

export default function ProductList() {
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [product, setProduct] = useState({
        name: '',
        category: '',
        status: '',
        unit: ''
    });

    const [rowData, setRowData] = useState([
        { name: 'Petrol', category: 'Fuel', status: 'Active', unit: 'Gallon' },
        { name: 'Diesel', category: 'Fuel', status: 'Active', unit: 'Litre' },
        { name: 'Engine Oil', category: 'Oil', status: 'Active', unit: 'Litre' },
        { name: 'Gear Oil', category: 'Oil', status: 'Inactive', unit: 'Litre' },
        { name: 'Brake Oil', category: 'Oil', status: 'Active', unit: 'Litre' },
        { name: 'Coolant', category: 'Oil', status: 'Inactive', unit: 'Litre' },
        { name: 'Power Steering Oil', category: 'Oil', status: 'Active', unit: 'Litre' },
        { name: 'Transmission Oil', category: 'Oil', status: 'Active', unit: 'Litre' },
        { name: 'Hydraulic Oil', category: 'Oil', status: 'Inactive', unit: 'Litre' },
        { name: 'Grease', category: 'Oil', status: 'Active', unit: 'Litre' },
        { name: 'Washer Fluid', category: 'Oil', status: 'Inactive', unit: 'Litre' },
        { name: 'Battery Water', category: 'Oil', status: 'Active', unit: 'Litre' },
        { name: 'Distilled Water', category: 'Oil', status: 'Inactive', unit: 'Litre' },
    ]);

    const handleSave = () => {
        const newProduct = {
            ...product,
            status: product.status === 'true' ? 'Active' : 'Inactive',
        };
    
        setRowData(prevRowData => {
            const updatedRowData = [...prevRowData, newProduct];
            return updatedRowData;
        });
    
        setProduct({
            name: '',
            category: '',
            status: '',
            unit: ''
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
        { headerName: "Name", field: "name" },
        { headerName: "Category", field: "category" , cellEditor: 'agSelectCellEditor', cellEditorParams: { values: ['Fuel', 'Oil'] } },
        { headerName: "Status", field: "status", cellRenderer: statusCellRenderer, cellEditor: 'agSelectCellEditor', cellEditorParams: { values: ['Active', 'Inactive'] } },
        { headerName: "Unit", field: "unit", cellEditor: 'agSelectCellEditor', cellEditorParams: { values: ['Gallon', 'Litre'] } },
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
        </div>
    );
}
