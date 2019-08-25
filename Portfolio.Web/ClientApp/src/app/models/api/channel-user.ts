import { Channel } from './channel';
import { User } from './user';

export interface ChannelUser {
  id: number;
  channelId: number;
  userId: number;
  isAdmin: boolean;

  channel: Channel;
  user: User;
}
