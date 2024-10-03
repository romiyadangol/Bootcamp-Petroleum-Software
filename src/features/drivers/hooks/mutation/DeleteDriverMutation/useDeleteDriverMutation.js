import { useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import { DELETE_DRIVER } from "../../../../../graphql/mutation/driver/deleteDriver";

export const useDeleteDriverMutation = (refetch) => {
  const [deleteDriver] = useMutation(DELETE_DRIVER, {
    onCompleted: () => {
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return deleteDriver;
};
