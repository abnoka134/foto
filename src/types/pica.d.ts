declare module "pica" {
  interface PicaOptions {
    tile?: number;
    features?: string[];
    idle?: number;
    concurrency?: number;
  }

  interface ResizeOptions {
    filter?: string;
    unsharpAmount?: number;
    unsharpRadius?: number;
    unsharpThreshold?: number;
    transferable?: boolean;
  }

  interface Pica {
    resize(
      from: HTMLCanvasElement | HTMLImageElement | ImageBitmap,
      to: HTMLCanvasElement,
      options?: ResizeOptions
    ): Promise<HTMLCanvasElement>;
    toBlob(
      canvas: HTMLCanvasElement,
      mimeType: string,
      quality?: number
    ): Promise<Blob>;
    resizeBuffer(options: {
      src: Uint8Array;
      width: number;
      height: number;
      toWidth: number;
      toHeight: number;
    }): Promise<Uint8Array>;
  }

  class PicaClass implements Pica {
    constructor(options?: PicaOptions);
    resize(
      from: HTMLCanvasElement | HTMLImageElement | ImageBitmap,
      to: HTMLCanvasElement,
      options?: ResizeOptions
    ): Promise<HTMLCanvasElement>;
    toBlob(
      canvas: HTMLCanvasElement,
      mimeType: string,
      quality?: number
    ): Promise<Blob>;
    resizeBuffer(options: {
      src: Uint8Array;
      width: number;
      height: number;
      toWidth: number;
      toHeight: number;
    }): Promise<Uint8Array>;
  }

  export default PicaClass;
}
