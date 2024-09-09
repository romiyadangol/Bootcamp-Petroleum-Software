import { useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import { CREATE_PRODUCT } from "../graphql/mutation/products/createProduct";
import { UPDATE_PRODUCT } from "../graphql/mutation/products/updateProduct";
import { DELETE_PRODUCT } from "../graphql/mutation/products/deleteProduct";

export const useCreateProductMutation = (refetch) => {
    const [ createProduct ] = useMutation(CREATE_PRODUCT, {
        onCompleted: () => {
            toast.success('Product created successfully');
            refetch();
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });
    return createProduct;
};

export const useUpdateProductMutation = (refetch) => {
    const [ updateProduct ] = useMutation(UPDATE_PRODUCT, {
        onCompleted: () => {
            toast.success('Product updated successfully');
            refetch();
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });
    return updateProduct;
};

export const useDeleteProductMutation = (refetch) => {
    const [ deleteProduct ] = useMutation(DELETE_PRODUCT, {
        onCompleted: () => {
            toast.success('Product deleted successfully');
            refetch();
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });
    return deleteProduct;
}

