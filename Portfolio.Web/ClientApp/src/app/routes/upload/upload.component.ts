import {
  Component,
  OnInit
} from '@angular/core';

import {
  ActivatedRoute,
  Router,
  ParamMap
} from '@angular/router';

import {
  AddFolderDialog,
  ConfirmDialog
} from '../../dialogs';

import { MatDialog } from '@angular/material';
import { UploadService } from '../../services';
import { Upload } from '../../models';

@Component({
  selector: 'upload-route',
  templateUrl: 'upload.component.html',
  providers: [UploadService]
})
export class UploadComponent implements OnInit {
  private navigate = () => this.router.navigate(['uploads']);

  constructor(
    public service: UploadService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(async (params: ParamMap) => {
      (params.has('id') && params.has('file')) || this.navigate();
      const userId = parseInt(params.get('id'), 10);
      const file = params.get('file');
      const res = file && userId ?
        await this.service.getUploadByName(file, userId) :
        this.navigate();

      !res && this.navigate();
    });
  }

  addFolders = (upload: Upload) => this.dialog.open(AddFolderDialog, {
    data: Object.assign({} as Upload, upload),
    width: '800px',
    disableClose: true
  })
  .afterClosed()
  .subscribe(res => res && this.service.getUploadByName(upload.file, upload.userId));

  deleteUpload = (upload: Upload) => this.dialog.open(ConfirmDialog)
    .afterClosed()
    .subscribe(async result => {
      const res = result && await this.service.toggleUploadDeleted(upload);
      res && this.navigate();
    });
}
