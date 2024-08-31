import { AgGridReact } from 'ag-grid-react'; 
import "ag-grid-community/styles/ag-grid.css"; 
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useMemo, useState } from 'react'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus} from '@fortawesome/free-solid-svg-icons';
import ProductForm from  './ProductForm';

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
        { name: 'Petrol', category: 'Fuel', status: true, unit: 'Gallon' },
        { name: 'Diesel', category: 'Fuel', status: false, unit: 'Litre' },
        { name: 'Engine Oil', category: 'Oil', status: true, unit: 'Litre' },
        { name: 'Gear Oil', category: 'Oil', status: false, unit: 'Litre' },
        { name: 'Brake Oil', category: 'Oil', status: true, unit: 'Litre' },
        { name: 'Coolant', category: 'Oil', status: true, unit: 'Litre' },
        { name: 'Power Steering Oil', category: 'Oil', status: false, unit: 'Litre' },
        { name: 'Transmission Oil', category: 'Oil', status: true, unit: 'Litre' },
        { name: 'Hydraulic Oil', category: 'Oil', status: true, unit: 'Litre' },
        { name: 'Grease', category: 'Oil', status: false, unit: 'Litre' },
        { name: 'Washer Fluid', category: 'Oil', status: true, unit: 'Litre' },
        { name: 'Battery Water', category: 'Oil', status: true, unit: 'Litre' },
        { name: 'Distilled Water', category: 'Oil', status: false, unit: 'Litre' },
    ]);

    const handleSave = () => {
        const newProduct = {
            ...product,
            status: product.status === 'true'
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

    const [colDefs, setColDefs] = useState([
        { headerName: "Name", field: "name" },
        { headerName: "Category", field: "category" },
        { headerName: "Status", field: "status" },
        { headerName: "Unit", field: "unit" },
    ]);

    const filteredRowData = rowData.filter((item) => {
        return item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.category.toLowerCase().includes(searchQuery.toLowerCase()) || item.unit.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        <div className='ag-theme-quartz-dark' style={{ height: 700 }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 15, justifyContent: 'space-between' }}>
                <h2 style={{ fontSize: 25, fontWeight: 'bold', padding: 15 }}>Product List</h2>
                <div>
                    <input 
                        type="text" 
                        placeholder="Search" 
                        style={{ marginRight: 10, padding: 10, width: 400, borderRadius: 5, background: '#171923' }}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button 
                        style={{ border: '1px solid #171923', padding: 9, borderRadius: 5, background: '#171923', fontWeight: 'bold', width: 200 }} 
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
