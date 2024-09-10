import { gql } from "@apollo/client";

 export const CREATE_DELIVERY = gql`
 mutation CreateOrder($orderGroupInfo: OrderGroupInput!) {
  createOrder(input: {orderGroupInfo: $orderGroupInfo}) {
    order {
		id
      status
      startedAt
      completedAt
      customerId
      organizationId
			userId
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