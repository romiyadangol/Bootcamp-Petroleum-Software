import { gql } from "@apollo/client";

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(input: { id: $id }) {
      product {
        id
        name
        productStatus
        productUnit
        productCategory
      }
      errors
    }
  }
`;