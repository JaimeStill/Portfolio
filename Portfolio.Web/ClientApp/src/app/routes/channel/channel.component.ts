import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import { MatSliderChange } from '@angular/material';

import {
  ChannelService,
  ChannelSocketService,
  UserService
} from '../../services';

import {
  Channel,
  ChannelMessage,
  ChannelUser
} from '../../models';

@Component({
  selector: 'channel-route',
  templateUrl: 'channel.component.html',
  providers: [ ChannelService ]
})
export class ChannelComponent implements OnInit, OnDestroy {
  channel: Channel;
  message = {} as ChannelMessage;
  connected = false;
  error: any;
  initialized: boolean;
  sending = false;
  size = 600;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private socket: ChannelSocketService,
    public identity: UserService,
    public channelService: ChannelService
  ) { }

  private navigate = () => this.router.navigate(['/channels']);

  private initializeChannel = () => this.route.paramMap.subscribe(async val => {
    val.has('name') || this.navigate();
    const res = await this.channelService.getChannel(val.get('name'));
    !res && this.navigate();

    this.identity.currentUser$.subscribe(user => {
      this.channelService.syncChannelUser(val.get('name'), user);
    });

    this.channelService.channel$.subscribe(c => {
      if (c) {
        this.channel = c;
        this.initializeChannelSocket(c);
      }
    });
  });

  private initializeChannelSocket = (c: Channel) => {
    this.channelService.getChannelMessages(c.id);

    if (this.connected && !this.initialized) {
      this.socket.triggerJoinChannel(c.name);
      this.socket.trigger$.subscribe(res => res && this.channelService.getChannelMessages(c.id));
      this.initialized = true;
    }
  }

  private setMessageProperties = (message: ChannelMessage, user: ChannelUser) => {
    message.channelId = this.channel.id;
    message.userId = user.userId;
  }

  ngOnInit() {
    this.socket.connected$.subscribe(status => {
      this.connected = status;
      status && this.initializeChannel();
    })
  }

  ngOnDestroy() {
    if (this.connected && this.channel) {
      this.socket.triggerLeaveChannel(this.channel.name);
    }
  }

  setSize = (event: MatSliderChange) => this.size = event.value;

  async sendMessage(message: ChannelMessage, user: ChannelUser) {
    this.setMessageProperties(message, user);
    this.sending = true;
    const res = await this.channelService.addChannelMessage(message);
    this.sending = false;
    this.message = {} as ChannelMessage;
    res && this.socket.triggerChannelMessage(this.channel.name);
  }

  async editMessage(message: ChannelMessage) {
    this.sending = true;
    const res = await this.channelService.updateChannelMessage(message);
    this.sending = false;
    res && this.socket.triggerChannelMessage(this.channel.name);
  }

  async deleteMessage(message: ChannelMessage) {
    this.sending = true;
    const res = await this.channelService.removeChannelMessage(message);
    this.sending = false;
    res && this.socket.triggerChannelMessage(this.channel.name);
  }
}
