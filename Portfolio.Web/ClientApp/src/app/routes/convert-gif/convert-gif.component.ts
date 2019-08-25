import {
  Component,
  OnInit
} from '@angular/core';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import { MatDialog } from '@angular/material';

import {
  GifService,
  UploadService
} from '../../services';

import {
  ConsoleOutput,
  GifUpload,
  Upload
} from '../../models';

import { VideoUploadDialog } from '../../dialogs';

@Component({
  selector: 'convert-gif-route',
  templateUrl: 'convert-gif.component.html',
  providers: [
    UploadService,
    GifService
  ]
})
export class ConvertGifComponent implements OnInit {
  private userId: number;
  videosExpanded = true;
  gifsExpanded = true;
  converting = false;
  gifUpload = {
    options: this.gif.setDefaultOptions(),
    video: null
  } as GifUpload;

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    public gif: GifService,
    public upload: UploadService
  ) { }

  private navigate = () => this.router.navigate(['home']);

  toggleVideosExpanded = () => this.videosExpanded = !this.videosExpanded;
  toggleGifsExpanded = () => this.gifsExpanded = !this.gifsExpanded;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      params.has('id') || this.navigate();
      this.userId = parseInt(params.get('id'), 10);
      this.upload.getVideos(this.userId);
      this.upload.getGifs(this.userId);
      this.gif.getFlagOptions();
      this.gif.getLogOptions();
    });
  }

  reset = () => this.gifUpload = {
    options: this.gif.setDefaultOptions(),
    video: null
  };

  create = async () => {
    this.converting = true;
    this.gif.updateConsole({
      information: `Converting ${this.gifUpload.video.name} to .gif...`,
      warning: null,
      hasError: false,
      error: null,
      result: null
    } as ConsoleOutput);
    const res = await this.gif.createGif(this.gifUpload);
    this.converting = false;
    res && this.upload.getGifs(this.userId);
  }

  selectVideo = (video: Upload) => this.gifUpload.video = video;

  addVideo = () => this.dialog.open(VideoUploadDialog, {
    data: this.userId,
    width: '800px',
    disableClose: true
  })
  .afterClosed()
  .subscribe(res => res && this.upload.getVideos(this.userId));
}
