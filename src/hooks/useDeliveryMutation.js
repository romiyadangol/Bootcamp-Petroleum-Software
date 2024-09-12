import { useMutation } from "@apollo/client"
import { CREATE_DELIVERY } from "../graphql/mutation/delivery/createDelivery"
import { toast } from "react-toastify";
import { DELETE_DELIVERY } from "../graphql/mutation/delivery/deleteDelivery";
import { UPDATE_DELIVERY } from "../graphql/mutation/delivery/updateDelivery";

export const useCreateDeliveryMutation = (refetch) => {
    const [ createDelivery ] = useMutation(CREATE_DELIVERY, {
        onCompleted: () => {
            toast.success('Delivery created successfully');
            refetch();
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });
    return createDelivery;
};

export const useUpdateDeliveryMutation = (refetch) => {
    const [ updateDelivery ] = useMutation(UPDATE_DELIVERY, {
        onCompleted: () => {
            toast.success('Delivery updated successfully');
            refetch();
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });
    return updateDelivery;
}

export const useDeleteDeliveryMutation = (refetch) => {
    const [ deleteDelivery ] = useMutation(DELETE_DELIVERY, {
        onCompleted: () => {
            toast.success('Delivery deleted successfully');
            refetch();
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });
    return deleteDelivery;
};