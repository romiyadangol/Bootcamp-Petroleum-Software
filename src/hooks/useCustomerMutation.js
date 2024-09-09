import { useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import { CREATE_CUSTOMER } from "../graphql/mutation/customers/createCustomer";


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