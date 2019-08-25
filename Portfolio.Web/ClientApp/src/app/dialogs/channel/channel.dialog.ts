import {
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material';

import {
  Component,
  Inject,
  ViewChild,
  ElementRef
} from '@angular/core';

import {
  ChannelService,
  CoreService
} from '../../services';

import { Channel } from '../../models';

@Component({
  selector: 'channel-dialog',
  templateUrl: 'channel.dialog.html',
  providers: [ChannelService]
})
export class ChannelDialog {
  initialized = false;
  validChannelName = true;

  constructor(
    private core: CoreService,
    public channelService: ChannelService,
    public dialogRef: MatDialogRef<ChannelDialog>,
    @Inject(MAT_DIALOG_DATA) public channel: Channel
  ) { }

  @ViewChild('channelInput', { static: false })
  set channelInput(input: ElementRef) {
    if (input && !this.initialized) {
      this.core.generateInputObservable(input)
        .subscribe(async val => {
          this.channel.name = this.core.urlEncode(val);
          this.validChannelName = await this.channelService.validateChannelName(this.channel);
        });
      this.initialized = true;
    }
  }

  updateChannel = async () => await this.channelService.updateChannel(this.channel) && this.dialogRef.close(true);
  addChannel = async () => await this.channelService.addChannel(this.channel) && this.dialogRef.close(true);
}
