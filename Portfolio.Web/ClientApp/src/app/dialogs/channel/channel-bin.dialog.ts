import {
  Component,
  OnInit,
  Inject
} from '@angular/core';

import { MAT_DIALOG_DATA } from '@angular/material';
import { ChannelService } from '../../services';
import { Channel } from '../../models';

@Component({
  selector: 'channel-bin-dialog',
  templateUrl: 'channel-bin.dialog.html',
  providers: [ ChannelService ]
})
export class ChannelBinDialog implements OnInit {
  constructor(
    public service: ChannelService,
    @Inject(MAT_DIALOG_DATA) public data: number
  ) { }

  ngOnInit() {
    this.service.getDeletedUserCreatedChannels(this.data);
  }

  restoreChannel = async (channel: Channel) => {
    const res = await this.service.toggleChannelDeleted(channel);
    res && this.service.getDeletedUserCreatedChannels(this.data);
  }

  removeChannel = async (channel: Channel) => {
    const res = await this.service.removeChannel(channel);
    res && this.service.getDeletedUserCreatedChannels(this.data);
  }
}
