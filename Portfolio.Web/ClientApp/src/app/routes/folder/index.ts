import { Route } from '@angular/router';

import { FolderComponent } from './folder.component';
import { FoldersComponent } from './folders.component';

export const FolderComponents = [
  FolderComponent,
  FoldersComponent
];

export const FolderRoutes: Route[] = [
  { path: 'folders/:id', component: FoldersComponent },
  { path: 'folder/:id/:name', component: FolderComponent }
];
