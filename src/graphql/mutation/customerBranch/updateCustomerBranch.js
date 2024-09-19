import { gql } from "@apollo/client";

export const UPDATE_CUSTOMER_BRANCH = gql`
  mutation UpdateCustomerBranch($id: ID!, $branchInfo: CustomerBranchInput!) {
    updateCustomerBranch(input: { id: $id, branchInfo: $branchInfo }) {
      customerBranch {
        id
        name
        location
        customerId
      }
      errors
    }
  }
`;
