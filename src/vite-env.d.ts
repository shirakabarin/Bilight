/// <reference types="vite/client" />
declare module 'dashjs' {
  export function MediaPlayer(): any;
  export type MediaPlayerClass = any;
  const defaultExport: {
    MediaPlayer: () => any;
    [key: string]: any;
  };
  export default defaultExport;
}
