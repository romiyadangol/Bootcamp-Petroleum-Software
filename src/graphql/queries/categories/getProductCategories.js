import { gql } from "@apollo/client";

export const GET_PRODUCT_CATEGORIES = gql`
  query GetCategories($categoryClass: String!) {
    getCategories(categoryClass: $categoryClass) {
      categories {
        id
        name
        categoryClass
        userId
        organizationId
      }
      errors
    }
  }
`;
