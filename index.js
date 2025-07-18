const addon = require('./index.node');

module.exports = {
  // Node.js zlib compatible API - synchronous
  gzip: (input, options = {}) => {
    const level = options.level || 3;
    return addon.compressGzip(input, level);
  },
  
  gunzip: (input) => {
    return addon.decompressGzip(input);
  },
  
  deflate: (input, options = {}) => {
    const level = options.level || 3;
    return addon.compressDeflate(input, level);
  },
  
  inflate: (input) => {
    return addon.decompressDeflate(input);
  },
  
  // Node.js zlib compatible API - with Sync suffix
  gzipSync: (input, options = {}) => {
    const level = options.level || 3;
    return addon.compressGzip(input, level);
  },
  
  gunzipSync: (input) => {
    return addon.decompressGzip(input);
  },
  
  deflateSync: (input, options = {}) => {
    const level = options.level || 3;
    return addon.compressDeflate(input, level);
  },
  
  inflateSync: (input) => {
    return addon.decompressDeflate(input);
  },
  
  // ZLIB functions (not in Node.js zlib but useful)
  compress: (input, options = {}) => {
    const level = options.level || 3;
    return addon.compressZlib(input, level);
  },
  
  decompress: (input) => {
    return addon.decompressZlib(input);
  },
  
  // Async versions (non-blocking)
  gzipAsync: async (input, options = {}) => {
    const level = options.level || 3;
    return await addon.compressGzipAsync(input, level);
  },
  
  gunzipAsync: async (input) => {
    return await addon.decompressGzipAsync(input);
  },
  
  deflateAsync: async (input, options = {}) => {
    const level = options.level || 3;
    return await addon.compressDeflateAsync(input, level);
  },
  
  inflateAsync: async (input) => {
    return await addon.decompressDeflateAsync(input);
  },
  
  compressAsync: async (input, options = {}) => {
    const level = options.level || 3;
    return await addon.compressZlibAsync(input, level);
  },
  
  decompressAsync: async (input) => {
    return await addon.decompressZlibAsync(input);
  },
  
  // Low-level functions (for advanced usage)
  compressGzip: addon.compressGzip,
  decompressGzip: addon.decompressGzip,
  compressDeflate: addon.compressDeflate,
  decompressDeflate: addon.decompressDeflate,
  compressZlib: addon.compressZlib,
  decompressZlib: addon.decompressZlib,
  
  compressGzipAsync: addon.compressGzipAsync,
  decompressGzipAsync: addon.decompressGzipAsync,
  compressDeflateAsync: addon.compressDeflateAsync,
  decompressDeflateAsync: addon.decompressDeflateAsync,
  compressZlibAsync: addon.compressZlibAsync,
  decompressZlibAsync: addon.decompressZlibAsync,
  
};