import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { CoreService } from '../core.service';
import { SnackerService } from '../snacker.service';

import {
  Folder,
  Upload
} from '../../models';

@Injectable()
export class UploadService {
  private uploads = new BehaviorSubject<Upload[]>(null);
  private folders = new BehaviorSubject<Folder[]>(null);
  private videos = new BehaviorSubject<Upload[]>(null);
  private gifs = new BehaviorSubject<Upload[]>(null);

  private upload = new BehaviorSubject<Upload>(null);

  uploads$ = this.uploads.asObservable();
  folders$ = this.folders.asObservable();
  videos$ = this.videos.asObservable();
  gifs$ = this.gifs.asObservable();

  upload$ = this.upload.asObservable();

  constructor(
    private core: CoreService,
    private http: HttpClient,
    private snacker: SnackerService
  ) { }

  getUploads = (userId: number) => this.http.get<Upload[]>(`/api/upload/getUploads/${userId}`)
    .subscribe(
      data => this.uploads.next(data),
      err => this.snacker.sendErrorMessage(err.error)
    );

  getDeletedUploads = (userId: number) => this.http.get<Upload[]>(`/api/upload/getDeletedUploads/${userId}`)
    .subscribe(
      data => this.uploads.next(data),
      err => this.snacker.sendErrorMessage(err.error)
    );

  searchUploads = (userId: number, search: string) => this.http.get<Upload[]>(`/api/upload/searchUploads/${userId}/${search}`)
    .subscribe(
      data => this.uploads.next(data),
      err => this.snacker.sendErrorMessage(err.error)
    );

  searchDeletedUploads = (userId: number, search: string) => this.http.get<Upload[]>(`/api/upload/searchDeletedUploads/${userId}/${search}`)
    .subscribe(
      data => this.uploads.next(data),
      err => this.snacker.sendErrorMessage(err.error)
    );

  getVideos = (userId: number) => this.http.get<Upload[]>(`/api/upload/getVideos/${userId}`)
    .subscribe(
      data => this.videos.next(data),
      err => this.snacker.sendErrorMessage(err.error)
    );

  getGifs = (userId: number) => this.http.get<Upload[]>(`/api/upload/getGifs/${userId}`)
    .subscribe(
      data => this.gifs.next(data),
      err => this.snacker.sendErrorMessage(err.error)
    );

  getUpload = (id: number): Promise<boolean> =>
    new Promise((resolve) => {
      this.http.get<Upload>(`/api/upload/getUpload/${id}`)
        .subscribe(
          data => {
            this.upload.next(data);
            resolve(true);
          },
          err => {
            this.snacker.sendErrorMessage(err.error);
            resolve(false);
          }
        )
    });

  getUploadByName = (file: string, userId: number): Promise<boolean> =>
    new Promise((resolve) => {
      this.http.get<Upload>(`/api/upload/getUploadByName/${userId}/${file}`)
        .subscribe(
          data => {
            this.upload.next(data);
            resolve(true);
          },
          err => {
            this.snacker.sendErrorMessage(err.error);
            resolve(false);
          }
        )
    });

  getUploadFolders = (uploadId: number) => this.http.get<Folder[]>(`/api/upload/getUploadFolders/${uploadId}`)
    .subscribe(
      data => this.folders.next(data),
      err => this.snacker.sendErrorMessage(err.error)
    );

  getExcludedUploads = (userId: number, name: string) => this.http.get<Upload[]>(`/api/upload/getExcludedUploads/${userId}/${name}`)
    .subscribe(
      data => this.uploads.next(data),
      err => this.snacker.sendErrorMessage(err.error)
    );

  uploadFiles = (formData: FormData, userId: number): Promise<Upload[]> =>
    new Promise((resolve) => {
      this.http.post<Upload[]>(`/api/upload/uploadFiles/${userId}`, formData, { headers: this.core.getUploadOptions() })
        .subscribe(
          data => {
            this.snacker.sendSuccessMessage('Uploads successfully processed');
            resolve(data);
          },
          err => {
            this.snacker.sendErrorMessage(err.error);
            resolve(null);
          }
        )
    });

  toggleUploadDeleted = (upload: Upload): Promise<boolean> =>
    new Promise((resolve) => {
      this.http.post(`/api/upload/toggleUploadDeleted`, upload)
        .subscribe(
          () => {
            const message = upload.isDeleted ?
              `${upload.file} successfully restored` :
              `${upload.file} successfully deleted`;

            this.snacker.sendSuccessMessage(message);
            resolve(true);
          },
          err => {
            this.snacker.sendErrorMessage(err.error);
            resolve(false);
          }
        )
    });

  removeUpload = (upload: Upload): Promise<boolean> =>
    new Promise((resolve) => {
      this.http.post(`/api/upload/removeUpload`, upload)
        .subscribe(
          () => {
            this.snacker.sendSuccessMessage(`${upload.file} permanently deleted`);
            resolve(true);
          },
          err => {
            this.snacker.sendErrorMessage(err.error);
            resolve(false);
          }
        )
    });
}
