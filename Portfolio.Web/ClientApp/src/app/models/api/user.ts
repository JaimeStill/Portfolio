import { Channel } from './channel';
import { ChannelMessage } from './channel-message';
import { ChannelUser } from './channel-user';
import { Folder } from './folder';
import { Upload } from './upload';

export interface User {
  id: number;
  guid: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  socketName: string;
  theme: string;
  sidepanel: string;
  isAdmin: boolean;
  isDeleted: boolean;

  channels: Channel[];
  channelMessages: ChannelMessage[];
  userChannels: ChannelUser[];
  folders: Folder[];
  uploads: Upload[];
}
