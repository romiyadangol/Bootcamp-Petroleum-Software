import { useColorModeValue } from "@chakra-ui/react";
import CategoryList from "../components/CategoryList";
import LoadingSpinner from "../../../components/core/LoadingSpinner";
import { useCategoryData } from "../hooks/useCategoryData";

export default function CategoryListPage() {
  const { loading, error } = useCategoryData();
  const theme = useColorModeValue("ag-theme-quartz", "ag-theme-quartz-dark");

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className={theme} style={{ height: 700 }}>
      <CategoryList />
    </div>
  );
}
