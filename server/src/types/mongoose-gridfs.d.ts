declare module 'mongoose-gridfs' {
  import { Connection } from 'mongoose';

  interface GridFSOptions {
    modelName?: string;
    connection?: Connection;
  }

  interface GridFSModel {
    write(options: any, readStream: any, callback: (error: any, file: any) => void): void;
    read(options: any, callback?: (error: any, buffer: Buffer) => void): any;
    unlink(options: any, callback: (error: any) => void): void;
  }

  export function createModel(options?: GridFSOptions): GridFSModel;
}
