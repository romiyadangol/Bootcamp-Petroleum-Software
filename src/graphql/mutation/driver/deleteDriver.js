import { gql } from "@apollo/client";

export const DELETE_DRIVER = gql`
mutation DeleteDriver($id:ID!){
  deleteDriver(input:{id: $id}) {
    message
    errors
  }
}
`;