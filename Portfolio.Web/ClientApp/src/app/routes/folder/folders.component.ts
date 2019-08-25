import {
  Component,
  OnInit
} from '@angular/core';

import {
  Router,
  ActivatedRoute
} from '@angular/router';

import {
  FolderDialog,
  FolderBinDialog,
  ConfirmDialog
} from '../../dialogs';

import { MatDialog } from '@angular/material';
import { FolderService } from '../../services';
import { Folder } from '../../models';

@Component({
  selector: 'folders-route',
  templateUrl: 'folders.component.html',
  providers: [ FolderService ]
})
export class FoldersComponent implements OnInit {
  userId: number;
  private navigate = () => this.router.navigate(['home']);

  constructor(
    public service: FolderService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      params.has('id') || this.navigate();
      this.userId = parseInt(params.get('id'), 10);
      this.userId ?
        this.service.getFolders(this.userId) :
        this.navigate();
    });
  }

  selectFolder = (folder: Folder) => folder && this.router.navigate(['folder', this.userId, folder.name]);

  addFolder = () => this.dialog.open(FolderDialog, {
    data: { userId: this.userId } as Folder,
    width: '800px',
    disableClose: true
  })
  .afterClosed()
  .subscribe(res => res && this.service.getFolders(this.userId));

  editFolder = (folder: Folder) => this.dialog.open(FolderDialog, {
    data: Object.assign({} as Folder, folder),
    width: '800px',
    disableClose: true
  })
  .afterClosed()
  .subscribe(res => res && this.service.getFolders(this.userId));

  deleteFolder = (folder: Folder) => this.dialog.open(ConfirmDialog)
    .afterClosed()
    .subscribe(async result => {
      const res = result && await this.service.toggleFolderDeleted(folder);
      res && this.service.getFolders(this.userId);
    });

  openFolderBin = () => this.dialog.open(FolderBinDialog, {
    data: this.userId,
    width: '800px'
  })
  .afterClosed()
  .subscribe(() => this.service.getFolders(this.userId));
}
