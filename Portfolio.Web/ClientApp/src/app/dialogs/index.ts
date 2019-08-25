import { ConfirmDialog } from './confirm.dialog';

import { ChannelDialog } from './channel/channel.dialog';
import { ChannelBinDialog } from './channel/channel-bin.dialog';

import { AddUploadDialog } from './folder/add-upload.dialog';
import { FolderBinDialog } from './folder/folder-bin.dialog';
import { FolderDialog } from './folder/folder.dialog';

import { AddFolderDialog } from './upload/add-folder.dialog';
import { UploadBinDialog } from './upload/upload-bin.dialog';
import { UploadSelectorDialog } from './upload/upload-selector.dialog';
import { VideoUploadDialog } from './upload/video-upload.dialog';

import { UserSettingsDialog } from './user/user-settings.dialog';

export const Dialogs = [
  ConfirmDialog,
  ChannelDialog,
  ChannelBinDialog,
  AddUploadDialog,
  FolderBinDialog,
  FolderDialog,
  AddFolderDialog,
  UploadBinDialog,
  UploadSelectorDialog,
  VideoUploadDialog,
  UserSettingsDialog
];

export * from './confirm.dialog';

export * from './channel/channel.dialog';
export * from './channel/channel-bin.dialog';

export * from './folder/add-upload.dialog';
export * from './folder/folder-bin.dialog';
export * from './folder/folder.dialog';

export * from './upload/add-folder.dialog';
export * from './upload/upload-bin.dialog';
export * from './upload/upload-selector.dialog';
export * from './upload/video-upload.dialog';

export * from './user/user-settings.dialog';
