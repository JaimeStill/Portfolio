import {
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { MatSliderChange } from '@angular/material';
import { GifUpload } from '../../models';

@Component({
  selector: 'gif-options',
  templateUrl: 'gif-options.component.html'
})
export class GifOptionsComponent {
  @Input() upload: GifUpload;
  @Input() flags: Array<string>;
  @Input() logs: Array<string>;
  @Input() scaleMin = 320;
  @Input() scaleMax = 900;
  @Input() fpsMin = 25;
  @Input() fpsMax = 60;
  @Input() converting = false;

  @Output() create = new EventEmitter<GifUpload>();
  @Output() clear = new EventEmitter();

  updateScale = (event: MatSliderChange) => this.upload.options.scale = event.value;
  updateFps = (event: MatSliderChange) => this.upload.options.fps = event.value;
}
