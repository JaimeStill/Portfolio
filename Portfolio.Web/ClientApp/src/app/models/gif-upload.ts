import { GifOptions } from './gif-options';
import { Upload } from './api/upload';

export interface GifUpload {
  options: GifOptions;
  video: Upload
}
