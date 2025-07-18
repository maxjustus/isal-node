export interface IsalBindings {
  // Synchronous functions
  compressGzip(input: Buffer, level: number): Buffer;
  decompressGzip(input: Buffer): Buffer;
  compressDeflate(input: Buffer, level: number): Buffer;
  decompressDeflate(input: Buffer): Buffer;
  compressZlib(input: Buffer, level: number): Buffer;
  decompressZlib(input: Buffer): Buffer;
  
  // Asynchronous functions
  compressGzipAsync(input: Buffer, level: number): Promise<Buffer>;
  decompressGzipAsync(input: Buffer): Promise<Buffer>;
  compressDeflateAsync(input: Buffer, level: number): Promise<Buffer>;
  decompressDeflateAsync(input: Buffer): Promise<Buffer>;
  compressZlibAsync(input: Buffer, level: number): Promise<Buffer>;
  decompressZlibAsync(input: Buffer): Promise<Buffer>;
}

// Synchronous exports
export const compressGzip: IsalBindings['compressGzip'];
export const decompressGzip: IsalBindings['decompressGzip'];
export const compressDeflate: IsalBindings['compressDeflate'];
export const decompressDeflate: IsalBindings['decompressDeflate'];
export const compressZlib: IsalBindings['compressZlib'];
export const decompressZlib: IsalBindings['decompressZlib'];

// Asynchronous exports
export const compressGzipAsync: IsalBindings['compressGzipAsync'];
export const decompressGzipAsync: IsalBindings['decompressGzipAsync'];
export const compressDeflateAsync: IsalBindings['compressDeflateAsync'];
export const decompressDeflateAsync: IsalBindings['decompressDeflateAsync'];
export const compressZlibAsync: IsalBindings['compressZlibAsync'];
export const decompressZlibAsync: IsalBindings['decompressZlibAsync'];

export type CompressionLevel = 0 | 1 | 3;

export interface CompressionOptions {
  level?: CompressionLevel;
}

// Synchronous convenience functions
export declare function gzip(input: Buffer, options?: CompressionOptions): Buffer;
export declare function ungzip(input: Buffer): Buffer;
export declare function deflate(input: Buffer, options?: CompressionOptions): Buffer;
export declare function inflate(input: Buffer): Buffer;
export declare function compress(input: Buffer, options?: CompressionOptions): Buffer;
export declare function decompress(input: Buffer): Buffer;

// Asynchronous convenience functions
export declare function gzipAsync(input: Buffer, options?: CompressionOptions): Promise<Buffer>;
export declare function ungzipAsync(input: Buffer): Promise<Buffer>;
export declare function deflateAsync(input: Buffer, options?: CompressionOptions): Promise<Buffer>;
export declare function inflateAsync(input: Buffer): Promise<Buffer>;
export declare function compressAsync(input: Buffer, options?: CompressionOptions): Promise<Buffer>;
export declare function decompressAsync(input: Buffer): Promise<Buffer>;