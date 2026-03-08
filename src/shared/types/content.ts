export type MediaDto = {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
  width?: number | null;
  height?: number | null;
  url?: string;
};

export type ContentDto = {
  id: string;
  title: string;
  body: string;
  imageId?: string | null;
  image?: MediaDto | null;
};
