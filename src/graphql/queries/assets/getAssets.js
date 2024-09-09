import { gql } from '@apollo/client';

export const GET_ASSETS = gql`
query GetAssets{
  getAssets {
    assets {
      id
      assetId
      assetCategory
      assetStatus
			userId
			organizationId
    }
    errors
  }
}
`;