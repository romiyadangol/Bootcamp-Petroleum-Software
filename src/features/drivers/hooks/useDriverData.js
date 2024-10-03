import { useQuery } from "@apollo/client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GET_DRIVERS } from "../../../graphql/queries/driver/getDrivers";
import {
  fetchDriversFailure,
  fetchDriversRequest,
  fetchDriversSuccess,
} from "../../../redux/actions/driverActions";

export const useDriverData = () => {
  const dispatch = useDispatch();
  const { data, loading, error, refetch } = useQuery(GET_DRIVERS);

  useEffect(() => {
    if (loading) {
      dispatch(fetchDriversRequest());
    }

    if (error) {
      dispatch(fetchDriversFailure(error.message));
    }

    if (data) {
      dispatch(fetchDriversSuccess(data.getDrivers.drivers));
    }
  }, [data, loading, error, dispatch]);

  const rowData = useSelector((state) => state.driver.drivers || []);

  return { rowData, loading, error, refetch };
};
