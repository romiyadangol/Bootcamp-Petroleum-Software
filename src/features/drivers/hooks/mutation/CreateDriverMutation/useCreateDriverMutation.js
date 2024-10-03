import { useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import { CREATE_DRIVER } from "../../../../../graphql/mutation/driver/createDriver";

export const useCreateDriverMutation = (refetch) => {
  const [createDriver] = useMutation(CREATE_DRIVER, {
    onCompleted: () => {
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return createDriver;
};
