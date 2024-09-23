import { gql } from "@apollo/client";

export const UPDATE_DELIVERY = gql`
mutation EditOrder($orderId: ID!, $orderInfo: OrderGroupInput!){
  editOrder(input: {orderId: $orderId, orderInfo: $orderInfo}){
    message
    errors
  }
}
`;
