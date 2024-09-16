import { gql } from "@apollo/client";

export const UPDATE_CATEGORY = gql`
  mutation EditCategory($id: ID!, $categoryInfo: CategoryInput!) {
    editCategory(input: { id: $id, categoryInfo: $categoryInfo }) {
      category {
        name
        categoryClass
        id
        userId
        organizationId
      }
      errors
    }
  }
`;
