import { useColorModeValue } from "@chakra-ui/react";
import AssetList from "../components/AssetList";
import { useAssetData } from "../hooks/useAssetData";
import LoadingSpinner from "../components/LoadingSpinner";

export default function AssetListPage() {
  const { loading, error } = useAssetData();
  const theme = useColorModeValue("ag-theme-quartz", "ag-theme-quartz-dark");

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className={theme} style={{ height: 700 }}>
      <AssetList />
    </div>
  );
}
