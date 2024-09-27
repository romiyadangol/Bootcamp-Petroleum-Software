import Toastify from "../Toastify";
import { toast } from "react-toastify";
import { useQuery } from "@apollo/client";
import AgGridTable from "../core/AgGridTable";
import { Spinner, Box } from "@chakra-ui/react";
import ActionButtons from "../core/ActionButtons";
import { useEffect, useMemo, useState } from "react";
import { useColorModeValue } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { GET_ASSET_CATEGORIES } from "../../graphql/queries/categories/getAssetCategories";
import {
  addCategory,
  deleteCategory,
  fetchCategoryRequest,
  fetchCategoryFailure,
  fetchCategorySuccess,
  updateCategory,
} from "../../redux/actions/categoryActions";
import DatePicker from "../core/DatePicker";
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
} from "../../hooks/useCategoryMutation";
import CategoryForm from "./CategoryForm";
import { SelectField } from "../core/FormFields";

export default function CategoryList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [category, setCategory] = useState(null);
  const [mode, setMode] = useState("create");
  const [categoryClass, setCategoryClass] = useState("assets");
  const hardcodedCategoryClass = ["assets", "product"];
  const dispatch = useDispatch();

  const { data, loading, error, refetch } = useQuery(GET_ASSET_CATEGORIES, {
    variables: { categoryClass: categoryClass },
  });

  useEffect(() => {
    if (loading) {
      dispatch(fetchCategoryRequest());
    }

    if (data) {
      console.log("category data:", data);
      dispatch(fetchCategorySuccess(data.getCategories.categories));
    }

    if (error) {
      dispatch(fetchCategoryFailure(error.message));
    }
  }, [data, loading, error, dispatch, categoryClass]);

  const rowData = useSelector((state) => state.category.category || []);

  const createCategoryMutation = useCreateCategoryMutation(refetch);
  const updateCategoryMutation = useUpdateCategoryMutation(refetch);
  const deleteCategoryMutation = useDeleteCategoryMutation(refetch);

  const handleEdit = (category) => {
    setCategory(category);
    setMode("edit");
    setShowModal(true);
  };

  const handleDelete = (id) => {
    deleteCategoryMutation({
      variables: { id },
      onCompleted: () => {
        dispatch(deleteCategory(id));
        refetch();
        toast.success("Category Deleted");
      },
    });
  };

  const handleSave = () => {
    if (mode === "edit") {
      updateCategoryMutation({
        variables: {
          id: category.id,
          categoryInfo: {
            name: category.name,
          },
        },
        onCompleted: (data) => {
          dispatch(updateCategory(data.editCategory.category));
          refetch();
          toast.success("Category Updated");
          setShowModal(false);
        },
      });
    } else {
      createCategoryMutation({
        variables: {
          categoryInfo: {
            name: category.name,
            categoryClass: category.categoryClass,
          },
        },
        onCompleted: (data) => {
          dispatch(
            addCategory({
              ...data.createCategory.category,
            })
          );
          //   setCategoryClass(categoryClass);
          refetch();
          toast.success("Category Created");
          setShowModal(false);
        },
      });
    }
  };

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      flex: 1,
      editable: true,
    }),
    []
  );

  const statusCellRenderer = (params) => {
    const status = params.value === "active" ? "success" : "danger";
    const dotStyle = {
      display: "inline-block",
      width: "10px",
      height: "10px",
      borderRadius: "50%",
      marginRight: "8px",
      backgroundColor: status === "success" ? "green" : "red",
    };
    return (
      <span>
        <span style={dotStyle}></span>
        <span className={`badge rounded-pill bg-${status}`}>
          {params.value}
        </span>
      </span>
    );
  };

  const [colDefs, setColDefs] = useState(
    [
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
    ],
    []
  );

  const filteredRowData = rowData.filter((item) => {
    const matchSearchQuery =
      item?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item?.categoryClass?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchDate = selectedDate
      ? new Date(item.createdAt).toDateString() === selectedDate.toDateString()
      : true;

    return matchSearchQuery && matchDate;
  });

  const theme = useColorModeValue("ag-theme-quartz", "ag-theme-quartz-dark");
  const inputbg = useColorModeValue("#EDF2F7", "#121212");
  const buttonbg = useColorModeValue("#EDF2F7", "#121212");

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      </Box>
    );
  }

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
          <DatePicker selected={selectedDate} onChange={setSelectedDate} />
          <button
            style={{
              border: `1px solid ${buttonbg}`,
              padding: 12,
              borderRadius: 5,
              background: buttonbg,
              fontWeight: "bold",
              width: 200,
              fontSize: 16,
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
          onSave={handleSave}
          onClose={() => setShowModal(false)}
          categoryClass={categoryClass}
        />
      )}
      <Toastify />
    </div>
  );
}
