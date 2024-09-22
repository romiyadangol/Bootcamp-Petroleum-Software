import { gql } from "@apollo/client";

export const UPLOAD_DELIVERY = gql`
  mutation UploadOrder($file: String!) {
    uploadOrder(input: { file: $file }) {
      message
      errors
    }
  }
`;
