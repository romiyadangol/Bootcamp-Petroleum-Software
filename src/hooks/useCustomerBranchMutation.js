import { useMutation } from "@apollo/client"
import { CREATE_CUSTOMER_BRANCH } from "../graphql/mutation/customerBranch/createCustomerBranch"
import { toast } from "react-toastify";
import { DELETE_CUSTOMER_BRANCH } from "../graphql/mutation/customerBranch/deleteCustomerBranch";
import { UPDATE_CUSTOMER_BRANCH } from "../graphql/mutation/customerBranch/updateCustomerBranch";

export const useCreateCustomerBranchMutation = (refetch) => {
    const[ createCustomerBranch ] = useMutation(CREATE_CUSTOMER_BRANCH, {
        onCompleted: () => {
            toast.success('Customer Branch created successfully');
            refetch();
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });
    return createCustomerBranch;
}

export const useDeleteCustomerBranchMutation = (refetch) => {
    const[ deleteCustomerBranch ] = useMutation(DELETE_CUSTOMER_BRANCH, {
        onCompleted: () => {
            toast.success('Customer Branch deleted successfully');
            refetch();
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });
    return deleteCustomerBranch;
}

export const useUpdateCustomerBranchMutation = (refetch) => {
    const[ updateCustomerBranch ] = useMutation(UPDATE_CUSTOMER_BRANCH, {
        onCompleted: () => {
            toast.success('Customer Branch updated successfully');
            refetch();
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });
    return updateCustomerBranch;
}