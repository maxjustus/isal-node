export type CompressionLevel = 0 | 1 | 3;

export interface CompressionOptions {
  level?: CompressionLevel;
}

// Node.js zlib compatible API - synchronous
export declare function gzip(input: Buffer, options?: CompressionOptions): Buffer;
export declare function gunzip(input: Buffer): Buffer;
export declare function deflate(input: Buffer, options?: CompressionOptions): Buffer;
export declare function inflate(input: Buffer): Buffer;

// Node.js zlib compatible API - with Sync suffix
export declare function gzipSync(input: Buffer, options?: CompressionOptions): Buffer;
export declare function gunzipSync(input: Buffer): Buffer;
export declare function deflateSync(input: Buffer, options?: CompressionOptions): Buffer;
export declare function inflateSync(input: Buffer): Buffer;

// ZLIB format functions
export declare function zlib(input: Buffer, options?: CompressionOptions): Buffer;
export declare function unzlib(input: Buffer): Buffer;

// Async versions (non-blocking)
export declare function gzipAsync(input: Buffer, options?: CompressionOptions): Promise<Buffer>;
export declare function gunzipAsync(input: Buffer): Promise<Buffer>;
export declare function deflateAsync(input: Buffer, options?: CompressionOptions): Promise<Buffer>;
export declare function inflateAsync(input: Buffer): Promise<Buffer>;
export declare function zlibAsync(input: Buffer, options?: CompressionOptions): Promise<Buffer>;
export declare function unzlibAsync(input: Buffer): Promise<Buffer>;


