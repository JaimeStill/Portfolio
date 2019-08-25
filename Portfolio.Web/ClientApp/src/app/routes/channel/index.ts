import { Route } from '@angular/router';

import { ChannelComponent } from './channel.component';
import { ChannelsComponent } from './channels.component';

export const ChannelComponents = [
  ChannelComponent,
  ChannelsComponent
];

export const ChannelRoutes: Route[] = [
  { path: 'channels', component: ChannelsComponent },
  { path: 'channel/:name', component: ChannelComponent }
];
