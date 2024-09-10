import { useMutation } from "@apollo/client"
import { CREATE_DELIVERY } from "../graphql/mutation/delivery/createDelivery"
import { toast } from "react-toastify";
import { DELETE_DELIVERY } from "../graphql/mutation/delivery/deleteDelivery";

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