import {
  Component,
  OnInit
} from '@angular/core';

import {
  ActivatedRoute,
  ParamMap,
  Router
} from '@angular/router';

import {
  AddUploadDialog,
  FolderDialog,
  ConfirmDialog
} from '../../dialogs';

import {
  Folder,
  Upload
} from '../../models';

import { MatDialog } from '@angular/material';
import { FolderService } from '../../services';

@Component({
  selector: 'folder-route',
  templateUrl: 'folder.component.html',
  providers: [FolderService]
})
export class FolderComponent implements OnInit {
  private userId: number;
  private name: string;
  private navigate = () => this.router.navigate(['folders']);

  constructor(
    public service: FolderService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(async (params: ParamMap) => {
      (params.has('id') && params.has('name')) || this.navigate();
      this.userId = parseInt(params.get('id'), 10);
      this.name = params.get('name');
      const res = this.userId && this.name ?
        await this.service.getFolderByName(this.name, this.userId) :
        this.navigate();

      res ?
        this.service.getFolderUploads(this.name, this.userId) :
        this.navigate();
    });
  }

  addUploads = (folder: Folder) => this.dialog.open(AddUploadDialog, {
    data: Object.assign({} as Folder, folder),
    width: '800px',
    disableClose: true
  })
  .afterClosed()
  .subscribe(res => res && this.service.getFolderUploads(folder.name, this.userId));

  editFolder = (folder: Folder) => this.dialog.open(FolderDialog, {
    data: Object.assign({} as Folder, folder),
    width: '800px',
    disableClose: true
  })
  .afterClosed()
  .subscribe(res => res && this.service.getFolderByName(folder.name, folder.userId));

  deleteFolder = (folder: Folder) => this.dialog.open(ConfirmDialog)
    .afterClosed()
    .subscribe(async result => {
      const res = result && await this.service.toggleFolderDeleted(folder);
      res && this.navigate();
    });

  selectUpload = (upload: Upload) => this.router.navigate(['upload', upload.userId, upload.file]);

  deleteUpload = (upload: Upload) => this.dialog.open(ConfirmDialog)
    .afterClosed()
    .subscribe(async result => {
      const res = result && await this.service.removeFolderUpload(this.name, upload);
      res && this.service.getFolderUploads(this.name, this.userId);
    });
}
