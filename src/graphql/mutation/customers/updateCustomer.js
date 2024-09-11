import { gql } from "@apollo/client";

export const UPDATE_CUSTOMER = gql`
mutation UpdateCustomer($id: ID!, $customerInfo: CustomerRegistrationInput!){
  updateCustomer(input:{id: $id, customerInfo: $customerInfo}){
    customer{
      id
      name
      phoneNo
      email
      zipcode
      address
    }
    errors
  }
}
`;