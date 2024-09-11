import { gql } from "@apollo/client";

export const DELETE_CUSTOMER = gql`
mutation DeleteCustomer($id: ID!){
  deleteCustomer(input:{id: $id}){
    customer{
      id
      name
      email
      zipcode
      phoneNo
      address
    }
    errors
  }
}
`;