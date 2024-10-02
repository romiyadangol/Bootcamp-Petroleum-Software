import { useColorModeValue } from "@chakra-ui/react";
import ProductList from "../components/ProductList";
import { useProductData } from "../hooks/useProductData";
import LoadingSpinner from "../../../components/core/LoadingSpinner";

export default function ProductListPage() {
  const { loading, error } = useProductData();
  const theme = useColorModeValue("ag-theme-quartz", "ag-theme-quartz-dark");

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className={theme} style={{ height: 700 }}>
      <ProductList />
    </div>
  );
}
