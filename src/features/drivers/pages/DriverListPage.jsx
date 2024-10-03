import { useColorModeValue } from "@chakra-ui/react";
import DriverList from "../components/DriverList";
import { useDriverData } from "../hooks/useDriverData";
import LoadingSpinner from "../../../components/core/LoadingSpinner";

export default function DriverListPage() {
  const { loading, error } = useDriverData();
  const theme = useColorModeValue("ag-theme-quartz", "ag-theme-quartz-dark");

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className={theme} style={{ height: 700 }}>
      <DriverList />
    </div>
  );
}
