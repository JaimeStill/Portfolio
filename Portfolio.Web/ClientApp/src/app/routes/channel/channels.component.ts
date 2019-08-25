import {
  Component,
  OnInit
} from '@angular/core';

import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { Channel } from '../../models';

import {
  ChannelService,
  CoreService,
  UserService
} from '../../services';

import {
  ChannelDialog,
  ChannelBinDialog,
  ConfirmDialog
} from '../../dialogs';

@Component({
  selector: 'channels-route',
  templateUrl: 'channels.component.html',
  providers: [ ChannelService ]
})
export class ChannelsComponent implements OnInit {
  constructor(
    private core: CoreService,
    private dialog: MatDialog,
    private router: Router,
    public channelService: ChannelService,
    public identity: UserService
  ) { }

  ngOnInit() {
    this.channelService.getChannels();
  }

  addChannel = (userId: number) => {
    this.dialog.open(ChannelDialog, {
      data: { userId: userId } as Channel,
      width: '600px',
      disableClose: true
    })
    .afterClosed()
    .subscribe(res => res && this.channelService.getChannels());
  }

  viewChannel = (channel: Channel) => this.router.navigate(['/channel', channel.name]);

  editChannel = (channel: Channel) => this.dialog.open(ChannelDialog, {
    data: Object.assign({} as Channel, channel),
    width: '800px',
    disableClose: true
  })
  .afterClosed()
  .subscribe(res => res && this.channelService.getChannels());

  deleteChannel = (channel: Channel) => this.dialog.open(ConfirmDialog)
    .afterClosed()
    .subscribe(async result => {
      const res = result && await this.channelService.toggleChannelDeleted(channel);
      res && this.channelService.getChannels();
    });

  openChannelBin = (userId: number) => this.dialog.open(ChannelBinDialog, {
    data: userId,
    width: '800px'
  })
  .afterClosed()
  .subscribe(() => this.channelService.getChannels());
}
