import { gql } from "@apollo/client";

export const DELETE_CUSTOMER_BRANCH = gql`
mutation DeleteCustomerBranch($id: ID!){
  deleteCustomerBranch(input:{id:$id}){
    customerBranch{
      id
      name
      location
      customerId
    }
  }
}
`;