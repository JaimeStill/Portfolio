import { Folder } from './folder';
import { Upload } from './upload';

export interface FolderUpload {
  id: number;
  folderId: number;
  uploadId: number;

  folder: Folder;
  upload: Upload;
}
