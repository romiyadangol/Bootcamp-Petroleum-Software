import { gql } from "@apollo/client";

export const GET_ASSET_CATEGORIES = gql`
query GetCategories($categoryClass: String!){
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