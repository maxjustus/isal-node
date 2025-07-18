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
  
  // ZLIB format functions
  zlib: (input, options = {}) => {
    const level = options.level || 3;
    return addon.compressZlib(input, level);
  },
  
  unzlib: (input) => {
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
  
  zlibAsync: async (input, options = {}) => {
    const level = options.level || 3;
    return await addon.compressZlibAsync(input, level);
  },
  
  unzlibAsync: async (input) => {
    return await addon.decompressZlibAsync(input);
  },
  
  
};