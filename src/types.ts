export type UploadResult = {
  imageLink: string;
  filename: string;
};

export type UploadParams = {
  imagePath: string;
  clientId: string;
};

export type PackageMeta = {
  version: string;
  name: string;
};
