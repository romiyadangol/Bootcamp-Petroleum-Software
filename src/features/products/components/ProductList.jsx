import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useColorModeValue } from "@chakra-ui/react";
import AgGridTable from "../../../components/core/AgGridTable";
import ActionButtons from "../../../components/core/ActionButtons";
import { useProductActions } from "../hooks/useProductActions";
import StatusCellRenderer from "../../../components/core/StatusCellRenderer";
import Toastify from "../../../components/Toastify";
import Header from "../../../components/core/Header";
import ProductForm from "./ProductForm";

export default function ProductList() {
  const products = useSelector((state) => state.product.products || []);
  const {
    mode,
    product,
    handleSave,
    searchQuery,
    showModal,
    setSearchQuery,
    setShowModal,
    setProduct,
    setMode,
    handleEdit,
    handleDelete,
  } = useProductActions();

  const inputbg = useColorModeValue("#EDF2F7", "#121212");
  const buttonbg = useColorModeValue("#EDF2F7", "#121212");

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      flex: 1,
      editable: true,
    }),
    []
  );

  const colDefs = [
    { headerName: "Name", field: "name" },
    { headerName: "Category", field: "productCategory" },
    {
      headerName: "Status",
      field: "productStatus",
      cellRenderer: StatusCellRenderer,
    },
    { headerName: "Unit", field: "productUnit" },
    {
      headerName: "Actions",
      cellRenderer: (params) => (
        <ActionButtons
          onEdit={() => handleEdit(params.data)}
          onDelete={() => handleDelete(params.data.id)}
        />
      ),
    },
  ];

  const filteredRowData = products.filter((item) => {
    const matchSearchQuery =
      item?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item?.productCategory
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      item?.productUnit?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchSearchQuery;
  });

  return (
    <>
      <Header
        title="Products"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setShowModal={setShowModal}
        setItem={setProduct}
        setMode={setMode}
        inputbg={inputbg}
        buttonbg={buttonbg}
        placeholder="Search products..."
        onCreateNewItem={() => console.log("Creating new product")}
      />
      <AgGridTable
        rowData={filteredRowData}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
      />
      {showModal && (
        <ProductForm
          showModal={showModal}
          mode={mode}
          product={product || {}}
          onChange={(e) =>
            setProduct({ ...product, [e.target.name]: e.target.value })
          }
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}
      <Toastify />
    </>
  );
}
