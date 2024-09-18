import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

export default function AgGridTable({
  rowData,
  columnDefs,
  defaultColDef,
  paginationPageSize = 20,
  paginationPageSizeSelector = [20, 30, 40],
  onRowClicked,
  onGridReady,
  isRowClickable,
}) {
  return (
    <AgGridReact
      rowData={rowData}
      columnDefs={columnDefs}
      defaultColDef={defaultColDef}
      rowSelection="multiple"
      pagination={true}
      paginationPageSize={paginationPageSize}
      paginationPageSizeSelector={paginationPageSizeSelector}
      onRowClicked={onRowClicked}
      onGridReady={onGridReady}
      rowStyle={{ cursor: isRowClickable ? "pointer" : "default" }}
    />
  );
}
