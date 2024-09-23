import { gql } from "@apollo/client";

export const GET_RECURRING_ORDERS = gql`
  query GetRecurringOrders {
    getRecurringOrders {
      orders {
        id
        status
        startedAt
        completedAt
        parentOrderId
        customer {
          id
          name
          email
          address
          zipcode
          phoneNo
        }
        user {
          id
          name
          email
        }
        organizationId
        createdAt
        deliveryOrder {
          id
          plannedAt
          completedAt
          customerBranch {
            id
            name
            location
          }
          orderGroupId
          asset {
            id
            assetId
            assetCategory
          }
          driver {
            id
            name
            email
          }
          createdAt
          lineItems {
            id
            name
            quantity
            units
            deliveryOrderId
          }
        }
      }
      errors
    }
  }
`;
