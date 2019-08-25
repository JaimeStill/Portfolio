import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit
} from '@angular/core';

import { Upload } from '../../models';

@Component({
  selector: 'upload-card',
  templateUrl: 'upload-card.component.html'
})
export class UploadCardComponent implements OnInit {
  classes: {};
  expandable: boolean;
  filetype: string;
  @Input() upload: Upload;
  @Input() expanded = false;
  @Input() clickable = true;
  @Input() deletable = true;
  @Input() elevated = true;
  @Input() stacked = false;
  @Input() size = 600;
  @Output() select = new EventEmitter<Upload>();
  @Output() delete = new EventEmitter<Upload>();

  private setClasses = () => {
    return {
      'stacked': this.stacked,
      'card': !this.stacked,
      'elevated': this.elevated
    }
  }

  toggleExpanded = () => this.expanded = !this.expanded;

  ngOnInit() {
    this.filetype = this.upload.fileType.split('/')[0];

    switch (this.filetype) {
      case 'image':
      case 'audio':
      case 'video':
        this.expandable = true;
        break;
      default:
        this.expandable = false;
        this.expanded = false;
    }

    this.classes = this.setClasses();
  }
}
