import {
  Component,
  OnInit
} from '@angular/core';

import {
  ObjectMapService,
  UserService
} from '../../services';

import { AdUser } from '../../models';

@Component({
  selector: 'user-route',
  templateUrl: 'user.component.html'
})
export class UserComponent implements OnInit {
  switching = false;
  newUser: AdUser;
  constructor(
    public identity: UserService,
    public mapper: ObjectMapService
  ) { }

  ngOnInit() {
    this.identity.getDomainUsers();
  }

  switchUser = async () => {
    if (this.newUser) {
      this.switching = true;
      const res = await this.identity.switchUser(this.newUser);
      res && this.identity.syncUser();
      this.newUser = {} as AdUser;
      this.switching = false;
    }
  }
}
