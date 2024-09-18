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
        }
        userId
        organizationId
        createdAt
        recurring {
          frequency
          startedAt
          endAt
        }
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
