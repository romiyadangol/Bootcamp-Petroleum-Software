import { gql } from "@apollo/client";

export const CREATE_CATEGORY = gql`
  mutation CreateCategory($categoryInfo: CategoryInput!) {
    createCategory(input: { categoryInfo: $categoryInfo }) {
      errors
      category {
        id
        name
        categoryClass
        userId
        organizationId
      }
    }
  }
`;
