import { gql } from "@apollo/client";

export const DELETE_DELIVERY = gql`
  mutation DeleteOrder($orderId: ID!) {
    deleteOrder(input: { orderId: $orderId }) {
      deletedOrder {
        id
        status
        startedAt
        completedAt
        cancelledAt
        customer {
          id
          name
          email
        }
        user {
          id
          name
          email
        }
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
