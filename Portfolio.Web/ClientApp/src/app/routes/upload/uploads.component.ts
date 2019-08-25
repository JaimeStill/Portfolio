import {
  Component,
  OnInit
} from '@angular/core';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  ConfirmDialog,
  UploadBinDialog
} from '../../dialogs';

import { MatDialog } from '@angular/material';
import { UploadService } from '../../services';
import { Upload } from '../../models';

@Component({
  selector: 'uploads-route',
  templateUrl: 'uploads.component.html',
  providers: [ UploadService ]
})
export class UploadsComponent implements OnInit {
  userId: number;
  files: File[];
  formData: FormData;
  uploading = false;

  constructor(
    public service: UploadService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) { }

  private navigate = () => this.router.navigate(['home']);

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      params.has('id') || this.navigate();

      this.userId = parseInt(params.get('id'), 10);
      this.userId ?
        this.service.getUploads(this.userId) :
        this.navigate();
    });
  }

  fileChange = (fileDetails: [File[], FormData]) => {
    this.files = fileDetails[0];
    this.formData = fileDetails[1];
  }

  clearFiles = () => {
    this.files = null;
    this.formData = null;
  }

  async uploadFiles() {
    this.uploading = true;
    const res = await this.service.uploadFiles(this.formData, this.userId);
    this.uploading = false;
    this.clearFiles();
    res && this.service.getUploads(this.userId);
  }

  selectUpload = (upload: Upload) => upload && this.router.navigate(['upload', upload.userId, upload.file]);

  deleteUpload = (upload: Upload) => this.dialog.open(ConfirmDialog)
    .afterClosed()
    .subscribe(async result => {
      const res = result && await this.service.toggleUploadDeleted(upload);
      res && this.service.getUploads(this.userId);
    });

  openUploadBin = () => this.dialog.open(UploadBinDialog, {
    data: this.userId,
    width: '800px'
  })
  .afterClosed()
  .subscribe(() => this.service.getUploads(this.userId));
}
