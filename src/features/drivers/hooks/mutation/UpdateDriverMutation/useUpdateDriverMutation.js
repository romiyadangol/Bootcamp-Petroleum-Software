import { useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import { UPDATE_DRIVER } from "../../../../../graphql/mutation/driver/updateDriver";

export const useUpdateDriverMutation = (refetch) => {
  const [updateDriver] = useMutation(UPDATE_DRIVER, {
    onCompleted: () => {
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return updateDriver;
};
