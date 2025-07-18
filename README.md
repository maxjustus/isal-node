# isal-node

Node.js bindings for the Intel Storage Acceleration Library (ISA-L), providing high-performance compression and decompression for GZIP, DEFLATE, and ZLIB formats.

## Installation

```bash
npm install isal-node
```

The package automatically detects your platform and either:
1. ✅ **Uses a pre-built binary** (no compilation needed)
2. 🔧 **Falls back to building from source** (if no pre-built binary available)

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

### System Dependencies

**None!** This library uses static linking, so no system dependencies are required. The Intel Storage Acceleration Library (ISA-L) is compiled and linked statically during the build process.

## Usage

### Synchronous API (Node.js zlib compatible)

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

### When to Use Async vs Sync

**Use Async (`*Async` functions) when:**
- Processing large amounts of data (> 1MB)
- You need to keep the event loop responsive
- Running multiple compression operations in parallel
- In web servers or I/O-intensive applications

**Use Sync (regular functions) when:**
- Processing small amounts of data (< 100KB)
- Simple, one-off operations
- You prefer simpler code without async/await

## API

### Node.js zlib Compatible API

**Synchronous:**
- `gzip(input, options?)` - Compress using GZIP
- `gunzip(input)` - Decompress GZIP data
- `deflate(input, options?)` - Compress using DEFLATE
- `inflate(input)` - Decompress DEFLATE data
- `gzipSync(input, options?)` - Compress using GZIP (explicit sync)
- `gunzipSync(input)` - Decompress GZIP data (explicit sync)
- `deflateSync(input, options?)` - Compress using DEFLATE (explicit sync)
- `inflateSync(input)` - Decompress DEFLATE data (explicit sync)

**Asynchronous (Non-blocking):**
- `gzipAsync(input, options?)` - Compress using GZIP (async)
- `gunzipAsync(input)` - Decompress GZIP data (async)
- `deflateAsync(input, options?)` - Compress using DEFLATE (async)
- `inflateAsync(input)` - Decompress DEFLATE data (async)

**Additional Formats:**
- `compress(input, options?)` - Compress using ZLIB
- `decompress(input)` - Decompress ZLIB data
- `compressAsync(input, options?)` - Compress using ZLIB (async)
- `decompressAsync(input)` - Decompress ZLIB data (async)

### Low-level API (Advanced Usage)

**Synchronous:**
- `compressGzip(input, level)` - Direct GZIP compression
- `decompressGzip(input)` - Direct GZIP decompression
- `compressDeflate(input, level)` - Direct DEFLATE compression
- `decompressDeflate(input)` - Direct DEFLATE decompression
- `compressZlib(input, level)` - Direct ZLIB compression
- `decompressZlib(input)` - Direct ZLIB decompression

**Asynchronous (Non-blocking):**
- `compressGzipAsync(input, level)` - Direct GZIP compression (async)
- `decompressGzipAsync(input)` - Direct GZIP decompression (async)
- `compressDeflateAsync(input, level)` - Direct DEFLATE compression (async)
- `decompressDeflateAsync(input)` - Direct DEFLATE decompression (async)
- `compressZlibAsync(input, level)` - Direct ZLIB compression (async)
- `decompressZlibAsync(input)` - Direct ZLIB decompression (async)


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

### Sample Results (Apple M2 Pro)

#### Text Data Performance
```
LARGE TEXT DATA (1 MB)
🚀 ISA-L is 5.21x faster for compression
📈 ISA-L: 255.02 MB/s, Node.js: 48.91 MB/s
📊 Compression: ISA-L 78.0%, Node.js 85.5%
```

#### Random Data Performance
```
MEDIUM RANDOM (64 KB)
🚀 ISA-L is 3.07x faster for compression
📈 ISA-L: 293.64 MB/s, Node.js: 95.64 MB/s
📊 Compression: ISA-L -0.11%, Node.js -0.06% (incompressible)
```

### Enhanced Benchmark Features

**📊 Data Types:**
- **Text Data**: Realistic text with varied vocabulary
- **Binary Data**: Simulated file headers and binary patterns  
- **Random Data**: Cryptographically random, incompressible data
- **Mixed Data**: Combination of text, binary, and random content

**📈 Data Sizes:**
- Small: 1KB - 64KB
- Medium: 512KB - 2MB  
- Large: 10MB - 50MB
- Multiple iterations with statistical analysis

**⚡ Metrics:**
- Compression/decompression speed
- Throughput (MB/s)
- Compression ratios
- Statistical analysis (avg, median, min, max)

### Performance Notes

- **ISA-L excels with**: Large text data, random data, consistent performance
- **Node.js excels with**: Small binary data, some ARM64 optimizations
- **Data characteristics matter**: Compression ratios vary significantly by data type
- **Throughput scales**: ISA-L shows better scaling with larger data sizes
- **Random data**: Shows minimal compression but ISA-L maintains better performance

## License

MIT