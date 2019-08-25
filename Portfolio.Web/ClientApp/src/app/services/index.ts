import { ChannelSocketService } from './sockets/channel-socket.service';
import { CoreService } from './core.service';
import { ObjectMapService } from './object-map.service';
import { SidepanelService } from './sidepanel.service';
import { SnackerService } from './snacker.service';
import { ThemeService } from './theme.service';

import { UserService } from './api/user.service';

export const Services = [
  ChannelSocketService,
  CoreService,
  ObjectMapService,
  SidepanelService,
  SnackerService,
  ThemeService,
  UserService
];

export * from './core.service';
export * from './object-map.service';
export * from './sidepanel.service';
export * from './snacker.service';
export * from './theme.service';

export * from './api/channel.service';
export * from './api/folder.service';
export * from './api/gif.service';
export * from './api/upload.service';
export * from './api/user.service';

export * from './sockets/channel-socket.service';
