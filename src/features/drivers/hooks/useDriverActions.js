import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useCreateDriverMutation } from "./mutation/CreateDriverMutation/useCreateDriverMutation";
import { useDeleteDriverMutation } from "./mutation/DeleteDriverMutation/useDeleteDriverMutation";
import { useUpdateDriverMutation } from "./mutation/UpdateDriverMutation/useUpdateDriverMutation";
import {
  addDriver,
  deleteDriver,
  updateDriver,
} from "../../../redux/actions/driverActions";

export const useDriverActions = (refetch) => {
  const dispatch = useDispatch();

  const createDriverMutation = useCreateDriverMutation(refetch);
  const updateDriverMutation = useUpdateDriverMutation(refetch);
  const deleteDriverMutation = useDeleteDriverMutation(refetch);

  const handleEdit = (driver, setDriver, setMode, setShowModal) => {
    setDriver(driver);
    setMode("edit");
    setShowModal(true);
  };

  const handleDelete = (id) => {
    deleteDriverMutation({
      variables: { id },
      onCompleted: () => {
        dispatch(deleteDriver(id));
        refetch();
        toast.success("Driver Deleted");
      },
    });
  };

  const handleSave = (driver, mode, setDriver, setShowModal) => {
    if (mode === "edit") {
      updateDriverMutation({
        variables: {
          id: driver.id,
          driverInfo: {
            name: driver.name,
            phone: driver.phone,
            email: driver.email,
            status: driver.status,
          },
        },
        onCompleted: (data) => {
          dispatch(updateDriver(data.editDriver.driver));
          refetch();
          setDriver({});
          toast.success("Driver Updated");
          setShowModal(false);
        },
      });
    } else {
      createDriverMutation({
        variables: {
          driverInfo: {
            name: driver.name,
            phone: driver.phone,
            email: driver.email,
            status: driver.status,
          },
        },
        onCompleted: (data) => {
          dispatch(addDriver(data.createDriver.driver));
          refetch();
          toast.success("Driver Created");
          setShowModal(false);
        },
      });
    }
  };

  return { handleEdit, handleDelete, handleSave };
};
