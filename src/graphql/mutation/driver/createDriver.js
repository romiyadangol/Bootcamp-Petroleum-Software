import { gql } from "@apollo/client";

export const CREATE_DRIVER = gql`
mutation CreateDriver($driverInfo:DriverInput!){
  createDriver(input:{driverInfo:$driverInfo}) {
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