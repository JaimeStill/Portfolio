import { FolderUpload } from './folder-upload';
import { User } from './user';

export interface Folder {
  id: number;
  userId: number;
  name: string;
  description: string;
  isDeleted: boolean;

  user: User;

  folderUploads: FolderUpload[];
}
