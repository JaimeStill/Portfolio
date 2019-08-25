import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { SnackerService } from '../snacker.service';

import {
  Channel,
  ChannelMessage,
  ChannelUser,
  User
} from '../../models';

@Injectable()
export class ChannelService {
  private channels = new BehaviorSubject<Channel[]>(null);
  private created = new BehaviorSubject<Channel[]>(null);
  private joined = new BehaviorSubject<Channel[]>(null);
  private users = new BehaviorSubject<ChannelUser[]>(null);
  private admins = new BehaviorSubject<ChannelUser[]>(null);
  private messages = new BehaviorSubject<ChannelMessage[]>(null);

  private channel = new BehaviorSubject<Channel>(null);
  private user = new BehaviorSubject<ChannelUser>(null);

  channels$ = this.channels.asObservable();
  created$ = this.created.asObservable();
  joined$ = this.joined.asObservable();
  users$ = this.users.asObservable();
  admins$ = this.admins.asObservable();
  messages$ = this.messages.asObservable();

  channel$ = this.channel.asObservable();
  user$ = this.user.asObservable();

  constructor(
    private http: HttpClient,
    private snacker: SnackerService
  ) { }

  getChannels = () => this.http.get<Channel[]>(`/api/channel/getChannels`)
    .subscribe(
      data => this.channels.next(data),
      err => this.snacker.sendErrorMessage(err.error)
    );

  searchChannels = (search: string) => this.http.get<Channel[]>(`/api/channel/searchChannels/${search}`)
    .subscribe(
      data => this.channels.next(data),
      err => this.snacker.sendErrorMessage(err.error)
    );

  getUserCreatedChannels = (userId: number) => this.http.get<Channel[]>(`/api/channel/getUserCreatedChannels/${userId}`)
    .subscribe(
      data => this.created.next(data),
      err => this.snacker.sendErrorMessage(err.error)
    );

  getDeletedUserCreatedChannels = (userId: number) => this.http.get<Channel[]>(`/api/channel/getDeletedUserCreatedChannels/${userId}`)
    .subscribe(
      data => this.created.next(data),
      err => this.snacker.sendErrorMessage(err.error)
    );

  getUserJoinedChannels = (userId: number) => this.http.get<Channel[]>(`/api/channel/getUserJoinedChannels/${userId}`)
    .subscribe(
      data => this.joined.next(data),
      err => this.snacker.sendErrorMessage(err.error)
    );

  getChannelUsers = (channelId: number) => this.http.get<ChannelUser[]>(`/api/channel/getChannelUsers/${channelId}`)
    .subscribe(
      data => this.users.next(data),
      err => this.snacker.sendErrorMessage(err.error)
    );

  getChannelAdmins = (channelId: number) => this.http.get<ChannelUser[]>(`/api/channel/getChannelAdmins/${channelId}`)
    .subscribe(
      data => this.admins.next(data),
      err => this.snacker.sendErrorMessage(err.error)
    );

  getChannelMessages = (channelId: number) => this.http.get<ChannelMessage[]>(`/api/channel/getChannelMessages/${channelId}`)
    .subscribe(
      data => this.messages.next(data),
      err => this.snacker.sendErrorMessage(err.error)
    );

  getChannel = (name: string): Promise<boolean> =>
    new Promise((resolve) => {
      this.http.get<Channel>(`/api/channel/getChannel/${name}`)
        .subscribe(
          data => {
            this.channel.next(data);
            resolve(true);
          },
          err => {
            this.snacker.sendErrorMessage(err.error);
            resolve(false);
          }
        )
    });

  getChannelUser = (channelId: number, userId: number): Promise<boolean> =>
    new Promise((resolve) => {
      this.http.get<ChannelUser>(`/api/channel/getChannelUser/${channelId}/${userId}`)
        .subscribe(
          data => {
            this.user.next(data);
            resolve(true);
          },
          err => {
            this.snacker.sendErrorMessage(err.error);
            resolve(false);
          }
        )
    });

  validateChannelName = (channel: Channel): Promise<boolean> =>
    new Promise((resolve) => {
      this.http.post<boolean>(`/api/channel/validateChannelName`, channel)
        .subscribe(
          data => resolve(data),
          err => {
            this.snacker.sendErrorMessage(err.error);
            resolve(false);
          }
        )
    });

  addChannel = (channel: Channel): Promise<boolean> =>
    new Promise((resolve) => {
      this.http.post(`/api/channel/addChannel`, channel)
        .subscribe(
          () => {
            this.snacker.sendSuccessMessage(`${channel.name} successfully created`);
            resolve(true);
          },
          err => {
            this.snacker.sendErrorMessage(err.error);
            resolve(false);
          }
        )
    });

  updateChannel = (channel: Channel): Promise<boolean> =>
    new Promise((resolve) => {
      this.http.post(`/api/channel/updateChannel`, channel)
        .subscribe(
          () => {
            this.snacker.sendSuccessMessage(`${channel.name} successfully updated`);
            resolve(true);
          },
          err => {
            this.snacker.sendErrorMessage(err.error);
            resolve(false);
          }
        )
    });

  toggleChannelDeleted = (channel: Channel): Promise<boolean> =>
    new Promise((resolve) => {
      this.http.post(`/api/channel/toggleChannelDeleted`, channel)
        .subscribe(
          () => {
            const message = channel.isDeleted ?
              `${channel.name} successfully restored` :
              `${channel.name} successfully deleted`;

            this.snacker.sendSuccessMessage(message);
            resolve(true);
          },
          err => {
            this.snacker.sendErrorMessage(err.error);
            resolve(false);
          }
        )
    });

  removeChannel = (channel: Channel): Promise<boolean> =>
    new Promise((resolve) => {
      this.http.post(`/api/channel/removeChannel`, channel)
        .subscribe(
          () => {
            this.snacker.sendSuccessMessage(`${channel.name} permanently deleted`);
            resolve(true);
          },
          err => {
            this.snacker.sendErrorMessage(err.error);
            resolve(false);
          }
        )
    });

  syncChannelUser = (channelName: string, user: User): Promise<boolean> =>
    new Promise((resolve) => {
      this.http.post<ChannelUser>(`/api/channel/syncChannelUser/${channelName}`, user)
        .subscribe(
          data => {
            this.user.next(data);
            resolve(true);
          },
          err => {
            this.snacker.sendErrorMessage(err.error);
            resolve(false);
          }
        )
    });

  addChannelUser = (user: ChannelUser): Promise<boolean> =>
    new Promise((resolve) => {
      this.http.post(`/api/channel/addChannelUser`, user)
        .subscribe(
          () => resolve(true),
          err => {
            this.snacker.sendErrorMessage(err.error);
            resolve(false);
          }
        )
    });

  toggleChannelAdmin = (user: ChannelUser): Promise<boolean> =>
    new Promise((resolve) => {
      this.http.post(`/api/channel/toggleChannelAdmin`, user)
        .subscribe(
          () => {
            const message = user.isAdmin ?
              'User removed from channel administrators' :
              'User added to channel administrators';

            this.snacker.sendSuccessMessage(message);
            resolve(true);
          },
          err => {
            this.snacker.sendErrorMessage(err.error);
            resolve(false);
          }
        )
    });

  removeChannelUser = (user: ChannelUser): Promise<boolean> =>
    new Promise((resolve) => {
      this.http.post(`/api/channel/removeChannelUser`, user)
        .subscribe(
          () => resolve(true),
          err => {
            this.snacker.sendErrorMessage(err.error);
            resolve(false);
          }
        )
    });

  addChannelMessage = (message: ChannelMessage): Promise<boolean> =>
    new Promise((resolve) => {
      this.http.post(`/api/channel/addChannelMessage`, message)
        .subscribe(
          () => resolve(true),
          err => {
            this.snacker.sendErrorMessage(err.error);
            resolve(false);
          }
        )
    });

  updateChannelMessage = (message: ChannelMessage): Promise<boolean> =>
    new Promise((resolve) => {
      this.http.post(`/api/channel/updateChannelMessage`, message)
        .subscribe(
          () => resolve(true),
          err => {
            this.snacker.sendErrorMessage(err.error);
            resolve(false);
          }
        )
    });

  removeChannelMessage = (message: ChannelMessage): Promise<boolean> =>
    new Promise((resolve) => {
      this.http.post(`/api/channel/removeChannelMessage`, message)
        .subscribe(
          () => resolve(true),
          err => {
            this.snacker.sendErrorMessage(err.error);
            resolve(false);
          }
        )
    });
}
