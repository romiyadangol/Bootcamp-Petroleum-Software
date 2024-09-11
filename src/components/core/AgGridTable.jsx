import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css"; 
import "ag-grid-community/styles/ag-theme-quartz.css";

export default function AgGridTable({ rowData, columnDefs, defaultColDef, paginationPageSize = 10, paginationPageSizeSelector = [10, 20, 30], onRowClicked }) {
  return (
    <AgGridReact
    rowData={rowData}
    columnDefs={columnDefs}
    defaultColDef={defaultColDef}
    rowSelection='multiple'
    pagination={true}
    paginationPageSize={paginationPageSize}
    paginationPageSizeSelector={paginationPageSizeSelector}
    onRowClicked={onRowClicked}
    />
  )
}
