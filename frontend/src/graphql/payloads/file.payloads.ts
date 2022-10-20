export interface AttachImagePayload {
  id: string | undefined;
  imageId: string;
}

export interface StorageFilePayload {
  fileId: string;
  filename: string;
}

export interface FileUploadPayload {
  fileUploadInfo: {
    policy: string;
    signature: string;
    apiKey: string;
    path: string;
  };
}

export interface FileCreatePayload {
  fileId: string;
  filename: string;
}
