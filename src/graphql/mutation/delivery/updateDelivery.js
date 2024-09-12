import { gql } from "@apollo/client";

export const UPDATE_DELIVERY = gql`
mutation EditOrder($orderId: ID!, $orderInfo: OrderGroupInput!){
  editOrder(input: {orderId: $orderId, orderInfo: $orderInfo}){
    updatedOrder {
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
				driverId
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
