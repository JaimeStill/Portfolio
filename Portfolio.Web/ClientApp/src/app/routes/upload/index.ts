import { Route } from '@angular/router';

import { UploadComponent } from './upload.component';
import { UploadsComponent } from './uploads.component';

export const UploadComponents = [
  UploadComponent,
  UploadsComponent
];

export const UploadRoutes: Route[] = [
  { path: 'uploads/:id', component: UploadsComponent },
  { path: 'upload/:id/:file', component: UploadComponent }
];
