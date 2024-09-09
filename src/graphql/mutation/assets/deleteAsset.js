import { gql } from '@apollo/client'

export const DELETE_ASSET = gql`
mutation DeleteAsset($id:ID!){
  deleteAsset(input:{id: $id}) {
		asset {
			id
			assetId
			assetStatus
			assetCategory
			userId
			organizationId
		}
    message
    errors
  }
}
`;
