import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { SnackerService } from '../snacker.service';

import {
  Folder,
  FolderUpload,
  Upload
} from '../../models';

@Injectable()
export class FolderService {
  private folders = new BehaviorSubject<Folder[]>(null);
  private uploads = new BehaviorSubject<Upload[]>(null);

  private folder = new BehaviorSubject<Folder>(null);

  folders$ = this.folders.asObservable();
  uploads$ = this.uploads.asObservable();

  folder$ = this.folder.asObservable();

  constructor(
    private http: HttpClient,
    private snacker: SnackerService
  ) { }

  getFolders = (userId: number) => this.http.get<Folder[]>(`/api/folder/getFolders/${userId}`)
    .subscribe(
      data => this.folders.next(data),
      err => this.snacker.sendErrorMessage(err.error)
    );

  getDeletedFolders = (userId: number) => this.http.get<Folder[]>(`/api/folder/getDeletedFolders/${userId}`)
    .subscribe(
      data => this.folders.next(data),
      err => this.snacker.sendErrorMessage(err.error)
    );

  searchFolders = (userId: number, search: string) => this.http.get<Folder[]>(`/api/folder/searchFolders/${userId}/${search}`)
    .subscribe(
      data => this.folders.next(data),
      err => this.snacker.sendErrorMessage(err.error)
    );

  searchDeletedFolders = (userId: number, search: string) => this.http.get<Folder[]>(`/api/folder/searchDeletedFolders/${userId}/${search}`)
    .subscribe(
      data => this.folders.next(data),
      err => this.snacker.sendErrorMessage(err.error)
    );

  getFolder = (id: number): Promise<boolean> =>
    new Promise((resolve) => {
      this.http.get<Folder>(`/api/folder/getFolder/${id}`)
        .subscribe(
          data => {
            this.folder.next(data);
            resolve(true);
          },
          err => {
            this.snacker.sendErrorMessage(err.error);
            resolve(false);
          }
        )
    });

  getFolderByName = (name: string, userId: number): Promise<boolean> =>
    new Promise((resolve) => {
      this.http.get<Folder>(`/api/folder/getFolderByName/${userId}/${name}`)
        .subscribe(
          data => {
            this.folder.next(data);
            resolve(true);
          },
          err => {
            this.snacker.sendErrorMessage(err.error);
            resolve(false);
          }
        )
    });

  getFolderUploads = (name: string, userId: number) => this.http.get<Upload[]>(`/api/folder/getFolderUploads/${userId}/${name}`)
    .subscribe(
      data => this.uploads.next(data),
      err => this.snacker.sendErrorMessage(err.error)
    );

  getExcludedFolders = (file: string, userId: number) => this.http.get<Folder[]>(`/api/folder/getExcludedFolders/${userId}/${file}`)
    .subscribe(
      data => this.folders.next(data),
      err => this.snacker.sendErrorMessage(err.error)
    );

  validateFolderName = (folder: Folder, userId: number): Promise<boolean> =>
    new Promise((resolve) => {
      this.http.post<boolean>(`/api/folder/validateFolderName/${userId}`, folder)
        .subscribe(
          data => resolve(data),
          err => {
            this.snacker.sendErrorMessage(err.error);
            resolve(false);
          }
        )
    });

  addFolder = (folder: Folder): Promise<boolean> =>
    new Promise((resolve) => {
      this.http.post(`/api/folder/addFolder`, folder)
        .subscribe(
          () => {
            this.snacker.sendSuccessMessage(`${folder.name} successfully created`);
            resolve(true);
          },
          err => {
            this.snacker.sendErrorMessage(err.error);
            resolve(false);
          }
        )
    });

  updateFolder = (folder: Folder): Promise<boolean> =>
    new Promise((resolve) => {
      this.http.post(`/api/folder/updateFolder`, folder)
        .subscribe(
          () => {
            this.snacker.sendSuccessMessage(`${folder.name} successfully updated`);
            resolve(true);
          },
          err => {
            this.snacker.sendErrorMessage(err.error);
            resolve(false);
          }
        )
    });

  toggleFolderDeleted = (folder: Folder): Promise<boolean> =>
    new Promise((resolve) => {
      this.http.post(`/api/folder/toggleFolderDeleted`, folder)
        .subscribe(
          () => {
            const message = folder.isDeleted ?
              `${folder.name} successfully restored` :
              `${folder.name} successfully deleted`;

            this.snacker.sendSuccessMessage(message);
            resolve(true);
          },
          err => {
            this.snacker.sendErrorMessage(err.error);
            resolve(false);
          }
        )
    });

  removeFolder = (folder: Folder): Promise<boolean> =>
    new Promise((resolve) => {
      this.http.post(`/api/folder/removeFolder`, folder)
        .subscribe(
          () => {
            this.snacker.sendSuccessMessage(`${folder.name} permanently deleted`);
            resolve(true);
          },
          err => {
            this.snacker.sendErrorMessage(err.error);
            resolve(false);
          }
        )
    });

  addFolderUploads = (folderUploads: FolderUpload[]): Promise<boolean> =>
    new Promise((resolve) => {
      this.http.post(`/api/folder/addFolderUploads`, folderUploads)
        .subscribe(
          () => {
            this.snacker.sendSuccessMessage(`Uploads successfully added to folder`);
            resolve(true);
          },
          err => {
            this.snacker.sendErrorMessage(err.error);
            resolve(false);
          }
        )
    });

  removeFolderUpload = (name: string, upload: Upload): Promise<boolean> =>
    new Promise((resolve) => {
      this.http.post(`/api/folder/removeFolderUpload/${name}`, upload)
        .subscribe(
          () => {
            this.snacker.sendSuccessMessage(`${upload.name} successfully removed from ${name}`);
            resolve(true);
          },
          err => {
            this.snacker.sendErrorMessage(err.error);
            resolve(false);
          }
        )
    });
}
