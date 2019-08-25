import {
  Component,
  Inject,
  OnInit,
  ViewChild,
  ElementRef
} from '@angular/core';

import {
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material';

import {
  CoreService,
  FolderService
} from '../../services';

import { Folder } from '../../models';

@Component({
  selector: 'folder-dialog',
  templateUrl: 'folder.dialog.html',
  providers: [FolderService]
})
export class FolderDialog implements OnInit {
  validFolderName = true;
  initialized = false;
  dialogTitle = 'Add Folder';
  folder: Folder;

  constructor(
    private core: CoreService,
    private dialogRef: MatDialogRef<FolderDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Folder,
    public service: FolderService
  ) { }

  @ViewChild('folderInput', { static: false })
  set folderInput(input: ElementRef) {
    if (input && !this.initialized) {
      this.core.generateInputObservable(input)
        .subscribe(async val => {
          this.folder.name = this.core.urlEncode(val);
          this.validFolderName = await this.service.validateFolderName(this.folder, this.folder.userId);
        });

      this.initialized = true;
    }
  }

  ngOnInit() {
    this.folder = this.data ?
      this.data :
      { } as Folder;

    this.dialogTitle = this.folder && this.folder.id ?
      'Update Folder' :
      'Add Folder';
  }

  saveFolder = async () => {
    const res = this.folder.id ?
      await this.service.updateFolder(this.folder) :
      await this.service.addFolder(this.folder);

    res && this.dialogRef.close(true);
  }
}
