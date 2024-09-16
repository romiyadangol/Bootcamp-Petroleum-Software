import { gql } from "@apollo/client";

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: ID!, $productInfo: ProductInput!) {
    updateProduct(input: { id: $id, productInfo: $productInfo }) {
      product {
        id
        name
        productCategory
        productStatus
        productUnit
      }
      errors
    }
  }
`;
