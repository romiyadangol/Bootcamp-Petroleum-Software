import { gql } from "@apollo/client";

export const UPDATE_DRIVER = gql`
  mutation EditDrivers($id: ID!, $driverInfo: DriverInput!) {
    editDriver(input: { id: $id, driverInfo: $driverInfo }) {
      driver {
        id
        name
        email
        phone
        status
      }
      errors
    }
  }
`;
