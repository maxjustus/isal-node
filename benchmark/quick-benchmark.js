const isal = require('../index');
const zlib = require('zlib');
const crypto = require('crypto');

function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatTime(nanoseconds) {
    if (nanoseconds < 1000) return `${nanoseconds.toFixed(2)}ns`;
    if (nanoseconds < 1000000) return `${(nanoseconds / 1000).toFixed(2)}μs`;
    if (nanoseconds < 1000000000) return `${(nanoseconds / 1000000).toFixed(2)}ms`;
    return `${(nanoseconds / 1000000000).toFixed(2)}s`;
}

function benchmark(name, fn, iterations = 20) {
    console.log(`\n--- ${name} ---`);
    
    // Warm up
    for (let i = 0; i < 5; i++) {
        fn();
    }
    
    const times = [];
    for (let i = 0; i < iterations; i++) {
        const start = process.hrtime.bigint();
        const result = fn();
        const end = process.hrtime.bigint();
        times.push(Number(end - start));
    }
    
    const avg = times.reduce((a, b) => a + b, 0) / times.length;
    const min = Math.min(...times);
    const max = Math.max(...times);
    const median = times.sort((a, b) => a - b)[Math.floor(times.length / 2)];
    
    console.log(`Average: ${formatTime(avg)}`);
    console.log(`Median:  ${formatTime(median)}`);
    
    return { avg, median, min, max };
}

// Generate test data
function generateTextData(size) {
    const words = ['the', 'quick', 'brown', 'fox', 'jumps', 'over', 'lazy', 'dog', 'hello', 'world', 'test', 'data', 'compression', 'benchmark'];
    let text = '';
    while (text.length < size) {
        text += words[Math.floor(Math.random() * words.length)] + ' ';
    }
    return Buffer.from(text.slice(0, size));
}

function generateRandomData(size) {
    return crypto.randomBytes(size);
}

console.log('='.repeat(50));
console.log('Quick ISA-L vs Node.js Benchmark');
console.log('='.repeat(50));

const testSizes = [
    { name: 'Small', size: 1024 },      // 1KB
    { name: 'Medium', size: 64 * 1024 }, // 64KB
    { name: 'Large', size: 1024 * 1024 } // 1MB
];

for (const { name, size } of testSizes) {
    console.log(`\n${name.toUpperCase()} TEXT DATA (${formatBytes(size)})`);
    console.log('='.repeat(40));
    
    const textData = generateTextData(size);
    
    // GZIP Compression
    const islGzipResult = benchmark('ISA-L GZIP Compression', () => {
        return isal.gzip(textData, { level: 3 });
    });
    
    const nodeGzipResult = benchmark('Node.js GZIP Compression', () => {
        return zlib.gzipSync(textData, { level: 6 });
    });
    
    // Get compressed data for decompression tests
    const islCompressed = isal.gzip(textData, { level: 3 });
    const nodeCompressed = zlib.gzipSync(textData, { level: 6 });
    
    // GZIP Decompression
    const islGunzipResult = benchmark('ISA-L GZIP Decompression', () => {
        return isal.gunzip(islCompressed);
    });
    
    const nodeGunzipResult = benchmark('Node.js GZIP Decompression', () => {
        return zlib.gunzipSync(islCompressed);
    });
    
    // Compression performance
    const gzipSpeedup = nodeGzipResult.avg / islGzipResult.avg;
    const gzipWinner = gzipSpeedup > 1 ? 'ISA-L' : 'Node.js';
    const gzipMultiplier = gzipSpeedup > 1 ? gzipSpeedup : 1 / gzipSpeedup;
    console.log(`🚀 Compression: ${gzipWinner} is ${gzipMultiplier.toFixed(2)}x faster`);
    
    // Decompression performance
    const gunzipSpeedup = nodeGunzipResult.avg / islGunzipResult.avg;
    const gunzipWinner = gunzipSpeedup > 1 ? 'ISA-L' : 'Node.js';
    const gunzipMultiplier = gunzipSpeedup > 1 ? gunzipSpeedup : 1 / gunzipSpeedup;
    console.log(`🚀 Decompression: ${gunzipWinner} is ${gunzipMultiplier.toFixed(2)}x faster`);
    
    // Throughput
    const islCompressThroughput = (size / 1024 / 1024) / (islGzipResult.avg / 1000000000);
    const nodeCompressThroughput = (size / 1024 / 1024) / (nodeGzipResult.avg / 1000000000);
    const islDecompressThroughput = (size / 1024 / 1024) / (islGunzipResult.avg / 1000000000);
    const nodeDecompressThroughput = (size / 1024 / 1024) / (nodeGunzipResult.avg / 1000000000);
    
    console.log(`📈 Compression   - ISA-L: ${islCompressThroughput.toFixed(2)} MB/s, Node.js: ${nodeCompressThroughput.toFixed(2)} MB/s`);
    console.log(`📈 Decompression - ISA-L: ${islDecompressThroughput.toFixed(2)} MB/s, Node.js: ${nodeDecompressThroughput.toFixed(2)} MB/s`);
    
    // Compression ratio
    const islRatio = ((textData.length - islCompressed.length) / textData.length * 100).toFixed(1);
    const nodeRatio = ((textData.length - nodeCompressed.length) / textData.length * 100).toFixed(1);
    console.log(`📊 Compression ratio: ISA-L ${islRatio}%, Node.js ${nodeRatio}%`);
}

console.log('\n' + '='.repeat(50));
console.log('Quick benchmark complete!');
console.log('='.repeat(50));