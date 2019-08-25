import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  AfterViewChecked
} from '@angular/core';

import { ConsoleOutput } from '../../models';

@Component({
  selector: 'console',
  templateUrl: 'console.component.html'
})
export class ConsoleComponent implements AfterViewChecked {
  @ViewChild('console', { static: false }) console: ElementRef;

  @Input() output: ConsoleOutput[];
  @Input() converting = false;
  @Input() font = 'Consolas';
  @Input() background = '#333';
  @Input() margin = 10;
  @Input() padding = 8;
  @Input() overflow = 'auto';
  @Input() borderRadius = 2;
  @Input() height = 320;
  @Input() innerMargin = 4;
  @Input() result = '#00e676';
  @Input() info = '#00b0ff';
  @Input() warning = '#ffea00';
  @Input() error = '#ff1744';
  @Input() expanded = true;
  @Input() testable = false;
  @Output() clear = new EventEmitter();
  @Output() test = new EventEmitter();

  private scrollConsole = () =>
    this.console.nativeElement.scrollTop = this.console.nativeElement.scrollHeight + 100;

  private toggleExpanded = () => this.expanded = !this.expanded;

  ngAfterViewChecked() {
    this.scrollConsole();
  }
}
