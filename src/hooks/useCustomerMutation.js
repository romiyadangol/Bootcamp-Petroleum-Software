import { useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import { CREATE_CUSTOMER } from "../graphql/mutation/customers/createCustomer";
import { UPDATE_CUSTOMER } from "../graphql/mutation/customers/updateCustomer";
import { DELETE_CUSTOMER } from "../graphql/mutation/customers/deleteCustomer";


export const useCreateCustomerMutation = (refetch) => {
    const [createCustomer] = useMutation(CREATE_CUSTOMER, {
        onCompleted: () => {
            toast.success('Customer created successfully');
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });
    return createCustomer;
};

export const useUpdateCustomerMutation = (refetch) => {
    const [ updateCustomer ] = useMutation(UPDATE_CUSTOMER, {
        onCompleted: () => {
            toast.success('Customer updated successfully');
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });
    return updateCustomer;
};

export const useDeleteCustomerMutation = (refetch) => {
    const [ deleteCustomer ] = useMutation(DELETE_CUSTOMER, {
        onCompleted: () => {
            toast.success('Customer deleted successfully');
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });
    return deleteCustomer;
}