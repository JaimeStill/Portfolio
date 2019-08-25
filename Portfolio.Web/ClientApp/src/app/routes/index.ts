import { Route } from '@angular/router';
import { ConvertGifComponent } from './convert-gif/convert-gif.component';
import { HomeComponent } from './home/home.component';
import { UserComponent } from './user/user.component';

import {
  ChannelComponents,
  ChannelRoutes
} from './channel';

import {
  FolderComponents,
  FolderRoutes
} from './folder';

import {
  UploadComponents,
  UploadRoutes
} from './upload';

export const RouteComponents = [
  ConvertGifComponent,
  HomeComponent,
  UserComponent,
  [...ChannelComponents],
  [...FolderComponents],
  [...UploadComponents]
];

export const Routes: Route[] = [
  { path: 'convert-gif/:id', component: ConvertGifComponent },
  { path: 'home', component: HomeComponent },
  { path: 'switch-user', component: UserComponent },
  ...ChannelRoutes,
  ...FolderRoutes,
  ...UploadRoutes,
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];
