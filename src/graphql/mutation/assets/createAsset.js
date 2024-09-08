import { gql } from '@apollo/client';

export const CREATE_ASSET = gql`
  mutation CreateAsset($assetInfo:AssetInput!){
    createAsset(input:{assetInfo: $assetInfo}) {
      asset {
        id
        assetId
        assetStatus
        assetCategory
      }
      errors
    }
  }
`;