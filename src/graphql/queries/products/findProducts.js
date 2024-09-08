import { gql } from '@apollo/client';

export const FIND_PRODUCTS = gql`
query FindProducts {
    findProducts {
      products {
        id
        name
        productStatus
        productUnit
        productCategory
        userId
        organizationId
      }
      errors
    }
  }
`;