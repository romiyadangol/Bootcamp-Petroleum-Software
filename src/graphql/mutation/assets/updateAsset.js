import { gql } from '@apollo/client'

export const UPDATE_ASSET = gql`
mutation EditAssets($assetInfo: AssetInput!){
	editAsset(input:{assetInfo: $assetInfo}){
  	asset{
      id
      assetId
      assetStatus
      assetCategory
    }
    errors
  }
}
`;