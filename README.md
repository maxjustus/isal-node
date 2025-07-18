# isal-node

Node.js bindings for the Intel Storage Acceleration Library (ISA-L), providing high-performance compression and decompression for GZIP, DEFLATE, and ZLIB formats.

I built this largely with the help of claude-code.

## Installation

```bash
npm install isal-node
```

The package automatically detects your platform and either:
1. **Uses a pre-built binary** (no compilation needed)
2. **Falls back to building from source** (if no pre-built binary available)

### Supported Platforms (Pre-built Binaries)

- **macOS ARM64** (Apple Silicon)
- **Linux x86_64** (Intel/AMD 64-bit)
- **Linux ARM64** (ARM 64-bit)

### Build Requirements (Fallback Only)

If no pre-built binary is available, the package will build from source. You'll need:
- **Rust toolchain** (`curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs/ | sh`)
- **Build tools** for your platform:
  - **macOS**: Xcode command line tools (`xcode-select --install`)
  - **Linux**: build-essential package (`sudo apt-get install build-essential`)
  - **Windows**: Visual Studio Build Tools or Visual Studio Community

## Usage

### Synchronous API

```javascript
const isal = require('isal-node');

// Simple compression/decompression
const data = Buffer.from('Hello, World!');

// GZIP (Node.js zlib compatible)
const gzipped = isal.gzip(data);
const ungzipped = isal.gunzip(gzipped);

// DEFLATE (Node.js zlib compatible)
const deflated = isal.deflate(data);
const inflated = isal.inflate(deflated);

// With Sync suffix (Node.js zlib compatible)
const gzippedSync = isal.gzipSync(data);
const ungzippedSync = isal.gunzipSync(gzippedSync);

// ZLIB (additional formats)
const compressed = isal.compress(data);
const decompressed = isal.decompress(compressed);
```

### Asynchronous API (Non-blocking)

```javascript
const isal = require('isal-node');

async function compressData() {
    const data = Buffer.from('Hello, World!');

    // GZIP (Node.js zlib compatible naming)
    const gzipped = await isal.gzipAsync(data);
    const ungzipped = await isal.gunzipAsync(gzipped);

    // DEFLATE (Node.js zlib compatible naming)
    const deflated = await isal.deflateAsync(data);
    const inflated = await isal.inflateAsync(deflated);

    // ZLIB (additional formats)
    const compressed = await isal.compressAsync(data);
    const decompressed = await isal.decompressAsync(compressed);
}

// Parallel compression for better performance
async function compressMultiple(dataArray) {
    const promises = dataArray.map(data => isal.gzipAsync(data));
    const compressed = await Promise.all(promises);
    return compressed;
}
```

## API

### Node.js zlib Compatible API

**Sync:**
- `gzip(input, options?)` - Compress using GZIP
- `gunzip(input)` - Decompress GZIP data
- `deflate(input, options?)` - Compress using DEFLATE
- `inflate(input)` - Decompress DEFLATE data
- `gzipSync(input, options?)` - Compress using GZIP (explicit sync)
- `gunzipSync(input)` - Decompress GZIP data (explicit sync)
- `deflateSync(input, options?)` - Compress using DEFLATE (explicit sync)
- `inflateSync(input)` - Decompress DEFLATE data (explicit sync)

**Async:**
- `gzipAsync(input, options?)` - Compress using GZIP (async)
- `gunzipAsync(input)` - Decompress GZIP data (async)
- `deflateAsync(input, options?)` - Compress using DEFLATE (async)
- `inflateAsync(input)` - Decompress DEFLATE data (async)

**Additional Formats:**
- `compress(input, options?)` - Compress using ZLIB
- `decompress(input)` - Decompress ZLIB data
- `compressAsync(input, options?)` - Compress using ZLIB (async)
- `decompressAsync(input)` - Decompress ZLIB data (async)


### Options

- `level` - Compression level (0, 1, or 3). Default: 3
  - 0: No compression (fastest)
  - 1: Fast compression
  - 3: Best compression

## Building

```bash
npm install
npm run build
```

## Testing

```bash
npm test        # Run synchronous tests
npm run test:async    # Run asynchronous tests  
npm run test:all      # Run all tests
```

## Benchmarks

Run benchmarks to compare performance against Node.js built-in zlib:

- `npm run benchmark` - Full benchmark with multiple data sizes and types
- `npm run benchmark:quick` - Quick benchmark with smaller data sets
- `npm run benchmark:async` - Async vs sync performance comparison

## License

MIT
