import Toastify from "../../../components/Toastify";
import AgGridTable from "../../../components/core/AgGridTable";
import ActionButtons from "../../../components/core/ActionButtons";
import { useEffect, useMemo, useState } from "react";
import { useColorModeValue } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
// import DatePicker from "../../../components/core/DatePicker";
import CategoryForm from "./CategoryForm";
import { SelectField } from "../../../components/core/FormFields";
import { useCategoryActions } from "../hooks/useCategoryActions";
import { useCategoryData } from "../hooks/useCategoryData";

export default function CategoryList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  // const [selectedDate, setSelectedDate] = useState(null);
  const [category, setCategory] = useState(null);
  const [mode, setMode] = useState("create");
  const [categoryClass, setCategoryClass] = useState("assets");
  const hardcodedCategoryClass = ["assets", "product"];
  const validCategoryClass = hardcodedCategoryClass.includes(categoryClass)
    ? categoryClass
    : "default";

  const { refetch } = useCategoryData(validCategoryClass);
  const { handleSave, handleDelete } = useCategoryActions(refetch);

  const rowData = useSelector((state) => state.category.category || []);
  useEffect(() => {
    refetch();
  }, [categoryClass, refetch]);

  const handleEdit = (category) => {
    setCategory(category);
    setMode("edit");
    setShowModal(true);
  };

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      flex: 1,
      editable: true,
    }),
    []
  );

  const colDefs = [
    { headerName: "Category Name", field: "name" },
    { headerName: "Category Class", field: "categoryClass" },
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

  const filteredRowData = rowData.filter((item) => {
    const matchSearchQuery =
      item?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item?.categoryClass?.toLowerCase().includes(searchQuery.toLowerCase());

    // const matchDate = selectedDate
    //   ? new Date(item.createdAt).toDateString() === selectedDate.toDateString()
    //   : true;

    return matchSearchQuery;
  });

  const theme = useColorModeValue("ag-theme-quartz", "ag-theme-quartz-dark");
  const inputbg = useColorModeValue("#EDF2F7", "#121212");
  const buttonbg = useColorModeValue("#EDF2F7", "#121212");

  return (
    <div className={theme} style={{ height: 700 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: 15,
          justifyContent: "space-between",
        }}
      >
        <h2 style={{ fontSize: 25, fontWeight: "bold", padding: 15 }}>
          Category List
        </h2>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 15,
            justifyContent: "space-between",
          }}
        >
          <div
            style={{ width: "200px", marginRight: "10px", marginTop: "12px" }}
          >
            <SelectField
              name="categoryClass"
              value={categoryClass}
              onChange={(e) => setCategoryClass(e.target.value)}
              options={hardcodedCategoryClass}
            />
          </div>
          <input
            type="text"
            placeholder="Search..."
            style={{
              marginRight: 10,
              padding: 12,
              width: 400,
              borderRadius: 5,
              background: inputbg,
              border: `1px solid ${inputbg}`,
              fontSize: 16,
            }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {/* <DatePicker selected={selectedDate} onChange={setSelectedDate} /> */}
          <button
            style={{
              border: `1px solid ${buttonbg}`,
              padding: 12,
              borderRadius: 5,
              background: buttonbg,
              fontWeight: "bold",
              width: 200,
              fontSize: 16,
              whiteSpace: "nowrap",
            }}
            onClick={() => {
              setCategory({});
              setMode("create");
              setShowModal(true);
            }}
          >
            <FontAwesomeIcon icon={faCirclePlus} color="orange" />
            &nbsp; Create New Category
          </button>
        </div>
      </div>
      <AgGridTable
        rowData={filteredRowData}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
      />
      {showModal && (
        <CategoryForm
          mode={mode}
          category={category || {}}
          onChange={(e) =>
            setCategory({ ...category, [e.target.name]: e.target.value })
          }
          onSave={() => handleSave(category, mode, setShowModal)}
          onClose={() => setShowModal(false)}
          categoryClass={categoryClass}
        />
      )}
      <Toastify />
    </div>
  );
}
