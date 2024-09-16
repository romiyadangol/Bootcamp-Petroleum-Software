import { gql } from "@apollo/client";

export const DELETE_CATEGORY = gql`
  mutation DeleteCategory($id: ID!) {
    deleteCategory(input: { id: $id }) {
      message
      errors
    }
  }
`;
