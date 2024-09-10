import { gql } from "@apollo/client";

export const UPDATE_DRIVER = gql`
mutation EditDrivers($driverInfo: DriverInput!){
	editDriver(input:{driverInfo: $driverInfo}){
  	driver{
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