import { gql } from "@apollo/client";

export const GET_ORDERS = gql`
query GetOrders {
  getOrders {
    orders {
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