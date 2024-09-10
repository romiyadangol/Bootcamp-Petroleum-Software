import { useMutation } from "@apollo/client";
import { CREATE_DRIVER } from "../graphql/mutation/driver/createDriver";
import { toast } from "react-toastify";
import { UPDATE_DRIVER } from "../graphql/mutation/driver/updateDriver";
import { DELETE_DRIVER } from "../graphql/mutation/driver/deleteDriver";

export const useCreateDriverMutation = (refetch) => {
    const [ createDriver ] = useMutation(CREATE_DRIVER, {
        onCompleted: () => {
            toast.success('Driver created successfully');
            refetch();
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });
    return createDriver;
};

export const useUpdateDriverMutation = (refetch) => {
    const [ updateDriver] = useMutation(UPDATE_DRIVER, {
        onCompleted: () => {
            toast.success('Driver updated successfully');
            refetch();
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });
    return updateDriver;
};

export const useDeleteDriverMutation = (refetch) => {
    const [ deleteDriver ] = useMutation(DELETE_DRIVER, {
        onCompleted: () => {
            toast.success('Driver deleted successfully');
            refetch();
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });
    return deleteDriver;
};