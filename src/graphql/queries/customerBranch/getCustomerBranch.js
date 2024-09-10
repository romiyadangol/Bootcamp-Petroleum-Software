import { gql } from "@apollo/client";

export const GET_CUSTOMER_BRANCH = gql`
query GetCustomerBranch($id:ID!) {
  getCustomerBranch(id:$id) {
    customerBranches {
      id
      name
      location
      customerId
    }
    errors
  }
}
`;