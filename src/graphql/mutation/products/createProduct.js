import { gql } from "@apollo/client";

export const CREATE_PRODUCT = gql`
  mutation CreateProduct($productInfo: ProductInput!) {
    createProduct(input: { productInfo: $productInfo }) {
      product {
        id
        name
        productCategory
        productUnit
        productStatus
      }
      errors
    }
  }
`;