import { gql } from "@apollo/client";

export const DELETE_DELIVERY = gql`
mutation DeleteOrder($orderId: ID!) {
  deleteOrder(input:{orderId: $orderId}) {
    deletedOrder {
      id
      status
      startedAt
      completedAt
      customerId
      organizationId
			deliveryOrder {
				id
				plannedAt
				completedAt
				status
				customerBranchId
				orderGroupId
				assetId
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
