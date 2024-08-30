import { AgGridReact } from 'ag-grid-react'; 
import "ag-grid-community/styles/ag-grid.css"; 
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useMemo, useState } from 'react'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';

export default function ProductList() {
const [searchQuery, setSearchQuery] = useState('');

    const [rowData, setRowData] = useState([
        { name: 'Petrol', category: 'Fuel', status: true, unit: 'Gallon' },
        { name: 'Diesel', category: 'Fuel', status: false, unit: 'Litre' },
        { name: 'Engine Oil', category: 'Lubricant', status: true, unit: 'Gallon' },
        { name: 'Gasoline', category: 'Fuel', status: false, unit: 'Quartz' },
        { name: 'Kerosene', category: 'Fuel', status: true, unit: 'Gallon' },
        { name: 'Jet Fuel', category: 'Fuel', status: true, unit: 'Gallon' },
        { name: 'LPG', category: 'Fuel', status: true, unit: 'Gallon' },
        { name: 'Bitumen', category: 'Fuel', status: true, unit: 'Gallon' },
        { name: 'Naphtha', category: 'Fuel', status: true, unit: 'Gallon' },
        { name: 'Asphalt', category: 'Fuel', status: true, unit: 'Gallon' },
        { name: 'Lubricating Oil', category: 'Lubricant', status: true, unit: 'Gallon' },
        { name: 'Paraffin Wax', category: 'Fuel', status: true, unit: 'Gallon' },
        { name: 'Petroleum Coke', category: 'Fuel', status: true, unit: 'Gallon' },
        { name: 'Residual Fuel Oil', category: 'Fuel', status: true, unit: 'Gallon' },
        { name: 'Propane', category: 'Fuel', status: true, unit: 'Gallon' },
        { name: 'Butane', category: 'Fuel', status: true, unit: 'Gallon' },
        { name: 'Ethane', category: 'Fuel', status: true, unit: 'Gallon' },
        { name: 'Methane', category: 'Fuel', status: true, unit: 'Gallon' },
        { name: 'Natural Gas', category: 'Fuel', status: true, unit: 'Gallon' },
        { name: 'Liquefied Natural Gas', category: 'Fuel', status: true, unit: 'Gallon' },
    ]);

    const defaultColDef = useMemo(() => {
        return {
            sortable: true,
            filter: true,
            flex: 1,
            editable: true,
            
        }
    })

    const [colDefs, setColDefs] = useState([
        { headerName: "Name", field: "name", cellEditor: 'agSelectCellEditor',
            cellEditorParams: {
                values: ['Petrol', 'Diesel', 'Engine Oil', 'Gasoline']
            }
        },
        { headerName: "Category", field: "category", cellEditor: 'agSelectCellEditor',
            cellEditorParams: {
                values: ['Fuel', 'Lubricant', 'Coolant', 'Brake Fluid']
            }
        },
        { headerName: "Status", field: "status", cellEditor: 'agSelectCellEditor',
            cellEditorParams: {
                values: ['true', 'false']
            }
        },
        { headerName: "Unit", field: "unit" , cellEditor: 'agSelectCellEditor',
            cellEditorParams: {
                values: ['Gallon', 'Liter', 'Quart', 'Pint']
            }
        }
    ]);

    const filteredRowData = rowData.filter((item) => {
        return item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.category.toLowerCase().includes(searchQuery.toLowerCase()) || item.unit.toLowerCase().includes(searchQuery.toLowerCase());

    })
return (
    <div className='ag-theme-quartz-dark' style={{ height: 780}}>
        <div style={{display: 'flex', alignItems: 'center', marginBottom: 15, justifyContent: 'space-between'}}>
            <h2 style={{fontSize: 25, fontWeight: 'bold', padding: 15}}>Product List</h2>
            <div>
                <input 
                    type="text" 
                    placeholder="Search" 
                    style={{marginRight: 10, padding: 10, width: 400, borderRadius:5, background: '#171923'}}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    />
                <button style={{border: '1px solid #171923', padding: 9, borderRadius:5, background: '#171923', fontWeight: 'bold', width: 200}} >
                    <FontAwesomeIcon icon={faCirclePlus} color='orange' />&nbsp;
                    Create New Product
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
    </div>
)
}
