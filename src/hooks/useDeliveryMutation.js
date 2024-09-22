import { useMutation } from "@apollo/client";
import { CREATE_DELIVERY } from "../graphql/mutation/delivery/createDelivery";
import { toast } from "react-toastify";
import { DELETE_DELIVERY } from "../graphql/mutation/delivery/deleteDelivery";
import { UPDATE_DELIVERY } from "../graphql/mutation/delivery/updateDelivery";
import { UPLOAD_DELIVERY } from "../graphql/mutation/delivery/uploadDelivery";

export const useCreateDeliveryMutation = (refetch) => {
  const [createDelivery] = useMutation(CREATE_DELIVERY, {
    onCompleted: (data) => {
      console.log("Delivery created successfully:", data);
      toast.success("Delivery created successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return createDelivery;
};
export const useUploadDeliveryMutation = (refetch) => {
  const [uploadDelivery] = useMutation(UPLOAD_DELIVERY, {
    onCompleted: (data) => {
      console.log("Delivery uploaded successfully:", data);
      toast.success("Delivery uploaded successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return uploadDelivery;
};

export const useUpdateDeliveryMutation = (refetch) => {
  const [updateDelivery] = useMutation(UPDATE_DELIVERY, {
    onCompleted: () => {
      toast.success("Delivery updated successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return updateDelivery;
};

export const useDeleteDeliveryMutation = (refetch) => {
  const [deleteDelivery] = useMutation(DELETE_DELIVERY, {
    onCompleted: () => {
      toast.success("Delivery deleted successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return deleteDelivery;
};
