import {
  Component,
  OnInit,
  Inject
} from '@angular/core';

import { MAT_DIALOG_DATA } from '@angular/material';
import { FolderService } from '../../services';
import { Folder } from '../../models';

@Component({
  selector: 'folder-bin-dialog',
  templateUrl: 'folder-bin.dialog.html',
  providers: [FolderService]
})
export class FolderBinDialog implements OnInit {
  constructor(
    public service: FolderService,
    @Inject(MAT_DIALOG_DATA) public data: number
  ) { }

  ngOnInit() {
    this.service.getDeletedFolders(this.data);
  }

  restoreFolder = async (folder: Folder) => {
    const res = await this.service.toggleFolderDeleted(folder);
    res && this.service.getDeletedFolders(this.data);
  }

  removeFolder = async (folder: Folder) => {
    const res = await this.service.removeFolder(folder);
    res && this.service.getDeletedFolders(this.data);
  }
}
