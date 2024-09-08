import { gql } from '@apollo/client';

export const GET_ASSETS = gql`
  query GetAssets {
    getAssets {
      assets {
        id
        name
        assetCategory
        assetStatus
        createdAt
        updatedAt
        organizationId
        userId
      }
      errors
    }
  }
`;