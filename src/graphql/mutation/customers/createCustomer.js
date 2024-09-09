import { gql } from '@apollo/client';

export const CREATE_CUSTOMER = gql`
mutation CreateCustomer($customerInfo: CustomerRegistrationInput!) {
  createCustomer(input: {customerInfo: $customerInfo}) {
    customer {
      id
      name
    }
    message
    errors
  }
}
`;