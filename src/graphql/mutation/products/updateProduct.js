import { gql } from "@apollo/client";

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($productInfo: ProductInput!) {
    updateProduct(input: { productInfo: $productInfo }) {
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