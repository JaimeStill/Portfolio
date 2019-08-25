import {
  Component,
  AfterViewInit,
  OnChanges,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef
} from '@angular/core';

import { MatDialog } from '@angular/material';
import { UploadSelectorDialog } from '../../dialogs';

import {
  ChannelMessage,
  ChannelUser,
  Upload
} from '../../models';

@Component({
  selector: 'message-board',
  templateUrl: 'message-board.component.html',
  styleUrls: [ 'message-board.component.css' ]
})
export class MessageBoardComponent implements OnChanges, AfterViewInit {
  @Input() messages: ChannelMessage[];
  @Input() message: ChannelMessage;
  @Input() user: ChannelUser;
  @Input() sending = false;
  @Input() size = 200;
  @Output() update = new EventEmitter();
  @Output() send = new EventEmitter<ChannelMessage>();
  @Output() edit = new EventEmitter<ChannelMessage>();
  @Output() delete = new EventEmitter<ChannelMessage>();

  @ViewChild('messageBoard', { static: true }) messageBoard: ElementRef;

  constructor(
    public dialog: MatDialog
  ) { }

  scrollBoard = () =>
    this.messageBoard.nativeElement.scrollTop = this.messageBoard.nativeElement.scrollHieght + 100;

  ngAfterViewInit() {
    this.scrollBoard();
  }

  ngOnChanges() {
    this.scrollBoard();
  }

  selectUpload = () => this.dialog.open(UploadSelectorDialog, {
    data: this.user.user,
    width: '1920px',
    disableClose: true
  })
  .afterClosed()
  .subscribe((u: Upload) => {
    if (u) {
      this.message.uploadId = u.id;
      this.message.value = u.url;
      this.message.isUpload = true;

      this.send.emit(this.message);
    }
  });
}
