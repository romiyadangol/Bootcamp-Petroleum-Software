import { gql } from '@apollo/client';

export const GET_CUSTOMERS = gql`
query GetCustomers {
  getCustomers {
    customers {
      id
      name
			email
      phoneNo
			address
			zipcode
    }
    errors
  }
}
`;