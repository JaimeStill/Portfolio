import {
  Component,
  OnInit,
  Inject
} from '@angular/core';

import { MAT_DIALOG_DATA } from '@angular/material';
import { UploadService } from '../../services';
import { Upload } from '../../models';

@Component({
  selector: 'upload-bin-dialog',
  templateUrl: 'upload-bin.dialog.html',
  providers: [UploadService]
})
export class UploadBinDialog implements OnInit {
  constructor(
    public service: UploadService,
    @Inject(MAT_DIALOG_DATA) public data: number
  ) { }

  ngOnInit() {
    this.service.getDeletedUploads(this.data);
  }

  restoreUpload = async (upload: Upload) => {
    const res = await this.service.toggleUploadDeleted(upload);
    res && this.service.getDeletedUploads(this.data);
  }

  removeUpload = async (upload: Upload) => {
    const res = await this.service.removeUpload(upload);
    res && this.service.getDeletedUploads(this.data);
  }
}
