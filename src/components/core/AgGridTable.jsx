import { forwardRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

const AgGridTable = forwardRef(({
  rowData,
  columnDefs,
  defaultColDef,
  paginationPageSize = 20,
  paginationPageSizeSelector = [20, 30, 40],
  onRowClicked,
  isRowClickable,
  onGridReady,
}, ref) => {
  return (
    <AgGridReact
      rowData={rowData}
      columnDefs={columnDefs}
      defaultColDef={defaultColDef}
      pagination={true}
      paginationPageSize={paginationPageSize}
      paginationPageSizeSelector={paginationPageSizeSelector}
      onRowClicked={onRowClicked}
      onGridReady={onGridReady}
      ref={ref}
      rowStyle={{ cursor: isRowClickable ? "pointer" : "default" }}
    />
  );
});
export default AgGridTable;
