import {
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material';

import {
  Component,
  Inject
} from '@angular/core';

import { UploadService } from '../../services';
import { User } from '../../models';

@Component({
  selector: 'video-upload-dialog',
  templateUrl: 'video-upload.dialog.html',
  providers: [ UploadService ]
})
export class VideoUploadDialog {
  files: File[];
  formData: FormData;
  uploading = false;

  constructor(
    private dialogRef: MatDialogRef<VideoUploadDialog>,
    public upload: UploadService,
    @Inject(MAT_DIALOG_DATA) public userId: number
  ) {
    if (!userId) {
      this.dialogRef.close();
    }
  }

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
    const res = await this.upload.uploadFiles(this.formData, this.userId);
    this.uploading = false;
    this.clearFiles();
    res && this.dialogRef.close(true);
  }
}
