import { Channel } from './channel';
import { Upload } from './upload';
import { User } from './user';

export interface ChannelMessage {
  id: number;
  channelId: number;
  uploadId: number;
  userId: number;
  value: string;
  isUpload: boolean;
  messageDate: Date;

  channel: Channel;
  upload: Upload;
  user: User;
}
