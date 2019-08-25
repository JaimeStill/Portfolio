import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatSliderChange
} from '@angular/material';

import {
  Component,
  OnInit,
  Inject
} from '@angular/core';

import { ConfirmDialog } from '../confirm.dialog';

import {
  CoreService,
  UploadService
} from '../../services';

import {
  Upload,
  User
} from '../../models';

@Component({
  selector: 'upload-selector-dialog',
  templateUrl: 'upload-selector.dialog.html',
  providers: [ UploadService ]
})
export class UploadSelectorDialog implements OnInit {
  private initialized = false;
  files: File[];
  formData: FormData;
  uploading = false;
  size = 600;

  constructor(
    public core: CoreService,
    public upload: UploadService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<UploadSelectorDialog>,
    @Inject(MAT_DIALOG_DATA) public user: User
  ) {
    if (!user || !user.id) {
      this.dialogRef.close(null);
    }
  }

  ngOnInit() {
    this.upload.getUploads(this.user.id);
  }

  setSize = (event: MatSliderChange) => this.size = event.value;

  fileChange(fileDetails: [File[], FormData]) {
    this.files = fileDetails[0];
    this.formData = fileDetails[1];
  }

  clearFiles() {
    this.files = null;
    this.formData = null;
  }

  async uploadFiles() {
    this.uploading = true;
    const res = await this.upload.uploadFiles(this.formData, this.user.id);
    this.uploading = false;
    this.clearFiles();
    res && this.upload.getUploads(this.user.id);
  }

  async deleteUpload(u: Upload) {
    await this.dialog
      .open(ConfirmDialog)
      .afterClosed()
      .subscribe(async result => {
        if (result) {
          const res = await this.upload.toggleUploadDeleted(u);
          res && this.upload.getUploads(this.user.id);
        }
      });
  }

  selectUpload = (upload: Upload) => this.dialogRef.close(upload);
}
