import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { SnackerService } from '../snacker.service';

import {
  ConsoleOutput,
  GifOptions,
  GifUpload,
  Upload
} from '../../models';

@Injectable()
export class GifService {
  private console = new Array<ConsoleOutput>();
  private consoleStream = new BehaviorSubject<ConsoleOutput[]>(this.console);
  private flags = new BehaviorSubject<string[]>(null);
  private logs = new BehaviorSubject<string[]>(null);

  console$ = this.consoleStream.asObservable();
  flags$ = this.flags.asObservable();
  logs$ = this.logs.asObservable();

  constructor(
    private http: HttpClient,
    private snacker: SnackerService
  ) { }

  setDefaultOptions = (): GifOptions => {
    return {
      flags: 'bicubic',
      log: 'panic',
      fps: 25,
      scale: 480
    } as GifOptions;
  }

  clearConsole = () => {
    this.console = new Array<ConsoleOutput>();
    this.consoleStream.next(this.console);
  }

  updateConsole = (output: ConsoleOutput) => {
    this.console.push(output);
    this.consoleStream.next(this.console);
  }

  populateTestOutput = () => {
    this.console.push({
      hasError: false,
      result: 'powershell completed something',
      information: 'powershell is giving information',
      warning: 'powershell provides a warning',
      error: 'powershell threw an error'
    });

    this.consoleStream.next(this.console);
  }

  getFlagOptions = () => this.http.get<string[]>(`/api/gif/getFlagOptions`)
    .subscribe(
      data => this.flags.next(data),
      err => this.snacker.sendErrorMessage(err.error)
    );

  getLogOptions = () => this.http.get<string[]>(`/api/gif/getLogOptions`)
    .subscribe(
      data => this.logs.next(data),
      err => this.snacker.sendErrorMessage(err.error)
    );

  createGif = (upload: GifUpload): Promise<boolean> =>
    new Promise((resolve) => {
      this.http.post<ConsoleOutput>(`/api/gif/createGif`, upload)
        .subscribe(
          data => {
            this.console.push(data);
            this.consoleStream.next(this.console);
            resolve(true);
          },
          err => {
            this.snacker.sendErrorMessage(err.error);
            resolve(false);
          }
        )
    });
}
