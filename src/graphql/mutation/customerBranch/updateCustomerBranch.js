import { gql } from "@apollo/client";

export const UPDATE_CUSTOMER_BRANCH = gql`
mutation UpdateCustomerBranch($branchInfo: CustomerBranchInput!){
  updateCustomerBranch(input:{branchInfo: $branchInfo}){
    customerBranch {
      name
      location
      customerId
    
		}
  }
}
`;