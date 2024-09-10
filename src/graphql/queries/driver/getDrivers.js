import { gql } from "@apollo/client";

export const GET_DRIVERS = gql` 
query GetDrivers{
  getDrivers {
    drivers {
			id
			name
			email
			status
			phone
    }
    errors
  }
}
`;