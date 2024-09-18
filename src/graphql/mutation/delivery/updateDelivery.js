import { gql } from "@apollo/client";

export const UPDATE_DELIVERY = gql`
mutation EditOrder($orderId: ID!, $orderInfo: OrderGroupInput!){
  editOrder(input: {orderId: $orderId, orderInfo: $orderInfo}){
    updatedOrder {
      id
      status
      startedAt
      completedAt
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
