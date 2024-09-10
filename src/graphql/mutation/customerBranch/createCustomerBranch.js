import { gql } from "@apollo/client";

export const CREATE_CUSTOMER_BRANCH = gql`
mutation CreateCustomerBranch($branchInfo: CustomerBranchInput!){
  createCustomerBranch(input: {branchInfo: $branchInfo}){
    customerBranch {
      id
      name
      location
      customerId
    }
    message
    errors
  }
}
`;