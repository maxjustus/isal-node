const addon = require('./index.node');

module.exports = {
  // Synchronous functions
  compressGzip: addon.compressGzip,
  decompressGzip: addon.decompressGzip,
  compressDeflate: addon.compressDeflate,
  decompressDeflate: addon.decompressDeflate,
  compressZlib: addon.compressZlib,
  decompressZlib: addon.decompressZlib,
  
  // Asynchronous functions
  compressGzipAsync: addon.compressGzipAsync,
  decompressGzipAsync: addon.decompressGzipAsync,
  compressDeflateAsync: addon.compressDeflateAsync,
  decompressDeflateAsync: addon.decompressDeflateAsync,
  compressZlibAsync: addon.compressZlibAsync,
  decompressZlibAsync: addon.decompressZlibAsync,
  
  // Synchronous convenience functions
  gzip: (input, options = {}) => {
    const level = options.level || 3;
    return addon.compressGzip(input, level);
  },
  
  ungzip: (input) => {
    return addon.decompressGzip(input);
  },
  
  deflate: (input, options = {}) => {
    const level = options.level || 3;
    return addon.compressDeflate(input, level);
  },
  
  inflate: (input) => {
    return addon.decompressDeflate(input);
  },
  
  compress: (input, options = {}) => {
    const level = options.level || 3;
    return addon.compressZlib(input, level);
  },
  
  decompress: (input) => {
    return addon.decompressZlib(input);
  },
  
  // Asynchronous convenience functions
  gzipAsync: async (input, options = {}) => {
    const level = options.level || 3;
    return await addon.compressGzipAsync(input, level);
  },
  
  ungzipAsync: async (input) => {
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
  }
};