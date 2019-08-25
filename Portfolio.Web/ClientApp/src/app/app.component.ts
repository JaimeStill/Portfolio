import {
  Component,
  OnInit
} from '@angular/core';

import { MatDialog } from '@angular/material';

import {
  SidepanelService,
  ThemeService,
  UserService
} from './services';

import { UserSettingsDialog } from './dialogs';
import { User } from './models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  constructor(
    private dialog: MatDialog,
    public identity: UserService,
    public sidepanel: SidepanelService,
    public theme: ThemeService
  ) { }

  ngOnInit() {
    this.identity.syncUser();
  }

  viewSettings = (user: User) => this.dialog.open(UserSettingsDialog, {
    data: Object.assign({}, user),
    width: '600px',
    disableClose: true
  })
  .afterClosed()
  .subscribe(() => this.identity.syncUser());
}
