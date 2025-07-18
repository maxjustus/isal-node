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

// ZLIB functions (not in Node.js zlib but useful)
export declare function compress(input: Buffer, options?: CompressionOptions): Buffer;
export declare function decompress(input: Buffer): Buffer;

// Async versions (non-blocking)
export declare function gzipAsync(input: Buffer, options?: CompressionOptions): Promise<Buffer>;
export declare function gunzipAsync(input: Buffer): Promise<Buffer>;
export declare function deflateAsync(input: Buffer, options?: CompressionOptions): Promise<Buffer>;
export declare function inflateAsync(input: Buffer): Promise<Buffer>;
export declare function compressAsync(input: Buffer, options?: CompressionOptions): Promise<Buffer>;
export declare function decompressAsync(input: Buffer): Promise<Buffer>;

// Low-level functions (for advanced usage)
export declare function compressGzip(input: Buffer, level: number): Buffer;
export declare function decompressGzip(input: Buffer): Buffer;
export declare function compressDeflate(input: Buffer, level: number): Buffer;
export declare function decompressDeflate(input: Buffer): Buffer;
export declare function compressZlib(input: Buffer, level: number): Buffer;
export declare function decompressZlib(input: Buffer): Buffer;

export declare function compressGzipAsync(input: Buffer, level: number): Promise<Buffer>;
export declare function decompressGzipAsync(input: Buffer): Promise<Buffer>;
export declare function compressDeflateAsync(input: Buffer, level: number): Promise<Buffer>;
export declare function decompressDeflateAsync(input: Buffer): Promise<Buffer>;
export declare function compressZlibAsync(input: Buffer, level: number): Promise<Buffer>;
export declare function decompressZlibAsync(input: Buffer): Promise<Buffer>;

