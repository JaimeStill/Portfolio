import {
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { Channel } from '../../models';

@Component({
  selector: 'channel-card',
  templateUrl: 'channel-card.component.html'
})
export class ChannelCardComponent {
  @Input() channel: Channel;
  @Input() size = 420;
  @Input() editable = false;
  @Input() deletable = false;
  @Output() edit = new EventEmitter<Channel>();
  @Output() delete = new EventEmitter<Channel>();
  @Output() select = new EventEmitter<Channel>();
}
