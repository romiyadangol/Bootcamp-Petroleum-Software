import { gql } from "@apollo/client";

export const UPDATE_ASSET = gql`
  mutation EditAssest($id: ID!, $assetInfo: AssetInput!) {
    editAsset(input: { id: $id, assetInfo: $assetInfo }) {
      asset {
        id
        assetStatus
        assetId
        assetCategory
      }
      errors
    }
  }
`;
