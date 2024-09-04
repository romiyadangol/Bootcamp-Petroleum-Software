import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
mutation UserSession($sessionInfo: UserSessionInput!) {
  userSession(input:{sessionInfo: $sessionInfo}) {
    user {
      id
      name
      email
      roles
    }
    token
    errors
  }
}
`;