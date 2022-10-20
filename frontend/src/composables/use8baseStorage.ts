import type { FileCreatePayload, FileUploadPayload } from "@/graphql/payloads";
import { useMutation, useQuery } from "@vue/apollo-composable";

import gql from "graphql-tag";

const IMAGE_UPLOAD_QUERY = gql`
  query {
    fileUploadInfo {
      policy
      signature
      apiKey
      path
    }
  }
`;

const FILE_CREATE_MUTATION = gql`
  mutation CREATE_FILE($fileId: String!, $filename: String!) {
    fileCreate(data: { fileId: $fileId, filename: $filename }) {
      id
    }
  }
`;

export function useStorage() {
  const { result } = useQuery<FileUploadPayload>(IMAGE_UPLOAD_QUERY);
  const { mutate: createFileIn8base } = useMutation<any, FileCreatePayload>(
    FILE_CREATE_MUTATION
  );

  async function uploadAsset(file: File) {
    if (!result.value) {
      throw new Error("File Upload info not yet available");
    }

    const { apiKey, policy, signature, path } = result.value.fileUploadInfo;
    const res = await fetch(
      `https://www.filestackapi.com/api/store/S3?key=${apiKey}&policy=${policy}&signature=${signature}&path=${path}`,
      {
        method: "POST",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      }
    );
    const { url, filename }: { url: string; filename: string } =
      await res.json();

    const fileId = url.split("/")[url.split("/").length - 1];
    return createFileIn8base({
      fileId,
      filename,
    });
  }
  return {
    uploadAsset,
  };
}
export default useStorage;
