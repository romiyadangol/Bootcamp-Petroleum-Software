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

  const handleDelete = async (id) => {
    try {
      await deleteDriverMutation({
        variables: { id },
      });
      dispatch(deleteDriver(id));
      refetch();
      toast.success("Driver Deleted");
    } catch (error) {
      toast.error("An error occurred while deleting the driver" + error);
    }
  };

  const handleSave = async (driver, mode, setDriver, setShowModal) => {
    const variables = {
      driverInfo: {
        name: driver.name,
        phone: driver.phone,
        email: driver.email,
        status: driver.status,
      },
    };

    try {
      if (mode === "edit") {
        const { data } = await updateDriverMutation({
          variables: {
            id: driver.id,
            ...variables,
          },
        });
        dispatch(updateDriver(data.editDriver.driver));
        toast.success("Driver Updated");
      } else {
        const { data } = await createDriverMutation({
          variables,
        });
        dispatch(addDriver(data.createDriver.driver));
        toast.success("Driver Created");
      }
      refetch();
      setDriver({});
      setShowModal(false);
    } catch (error) {
      toast.error("An error occurred while saving the driver" + error);
    }
  };

  return { handleEdit, handleDelete, handleSave };
};
