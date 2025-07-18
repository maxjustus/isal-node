const isal = require('../index');
const zlib = require('zlib');
const fs = require('fs');
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

function benchmark(name, fn, iterations = 100) {
    console.log(`\n--- ${name} ---`);
    
    // Warm up
    for (let i = 0; i < Math.min(10, iterations); i++) {
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
    
    console.log(`Iterations: ${iterations}`);
    console.log(`Average: ${formatTime(avg)}`);
    console.log(`Median:  ${formatTime(median)}`);
    console.log(`Min:     ${formatTime(min)}`);
    console.log(`Max:     ${formatTime(max)}`);
    
    return { avg, median, min, max };
}

// Generate different types of test data
function generateTextData(size) {
    const words = ['the', 'quick', 'brown', 'fox', 'jumps', 'over', 'lazy', 'dog', 'Lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua'];
    const sentences = [];
    
    for (let i = 0; i < 50; i++) {
        const sentence = [];
        const sentenceLength = Math.floor(Math.random() * 15) + 5;
        for (let j = 0; j < sentenceLength; j++) {
            sentence.push(words[Math.floor(Math.random() * words.length)]);
        }
        sentences.push(sentence.join(' ') + '.');
    }
    
    const baseText = sentences.join(' ');
    const buffer = Buffer.alloc(size);
    let pos = 0;
    
    while (pos < size) {
        const chunk = baseText.slice(0, Math.min(baseText.length, size - pos));
        buffer.write(chunk, pos, 'utf8');
        pos += Buffer.byteLength(chunk, 'utf8');
    }
    
    return buffer;
}

function generateBinaryData(size) {
    const buffer = Buffer.alloc(size);
    const patterns = [
        Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]), // PNG header
        Buffer.from([0xFF, 0xD8, 0xFF, 0xE0]), // JPEG header
        Buffer.from([0x50, 0x4B, 0x03, 0x04]), // ZIP header
        Buffer.from([0x25, 0x50, 0x44, 0x46]), // PDF header
    ];
    
    let pos = 0;
    while (pos < size) {
        const pattern = patterns[Math.floor(Math.random() * patterns.length)];
        const remaining = size - pos;
        const copySize = Math.min(pattern.length, remaining);
        pattern.copy(buffer, pos, 0, copySize);
        pos += copySize;
        
        // Add some random bytes
        if (pos < size) {
            const randomSize = Math.min(Math.floor(Math.random() * 1024), size - pos);
            crypto.randomFillSync(buffer, pos, randomSize);
            pos += randomSize;
        }
    }
    
    return buffer;
}

function generateRandomData(size) {
    return crypto.randomBytes(size);
}

function generateMixedData(size) {
    const buffer = Buffer.alloc(size);
    let pos = 0;
    
    while (pos < size) {
        const chunkSize = Math.min(Math.floor(Math.random() * 10000) + 1000, size - pos);
        const dataType = Math.floor(Math.random() * 3);
        
        let chunk;
        switch (dataType) {
            case 0: // Text
                chunk = generateTextData(chunkSize);
                break;
            case 1: // Binary patterns
                chunk = generateBinaryData(chunkSize);
                break;
            case 2: // Random
                chunk = generateRandomData(chunkSize);
                break;
        }
        
        const copySize = Math.min(chunk.length, size - pos);
        chunk.copy(buffer, pos, 0, copySize);
        pos += copySize;
    }
    
    return buffer;
}

// Generate test data of different sizes and types
const testDataSizes = {
    small: 1024,           // 1KB
    medium: 64 * 1024,     // 64KB
    large: 512 * 1024,     // 512KB
    huge: 2 * 1024 * 1024, // 2MB
    massive: 10 * 1024 * 1024, // 10MB
    enormous: 50 * 1024 * 1024  // 50MB (reduced from 100MB for reasonable test times)
};

const testDataTypes = {
    text: 'Text Data (realistic text with varied vocabulary)',
    binary: 'Binary Data (simulated file headers and binary patterns)',
    random: 'Random Data (cryptographically random, incompressible)',
    mixed: 'Mixed Data (combination of text, binary, and random)'
};

function generateTestData() {
    const testData = {};
    
    for (const [sizeName, size] of Object.entries(testDataSizes)) {
        testData[sizeName] = {};
        for (const [typeName, typeDesc] of Object.entries(testDataTypes)) {
            console.log(`Generating ${sizeName} ${typeName} data (${formatBytes(size)})...`);
            
            switch (typeName) {
                case 'text':
                    testData[sizeName][typeName] = generateTextData(size);
                    break;
                case 'binary':
                    testData[sizeName][typeName] = generateBinaryData(size);
                    break;
                case 'random':
                    testData[sizeName][typeName] = generateRandomData(size);
                    break;
                case 'mixed':
                    testData[sizeName][typeName] = generateMixedData(size);
                    break;
            }
        }
    }
    
    return testData;
}

console.log('='.repeat(60));
console.log('ISA-L vs Node.js zlib Compression Benchmark');
console.log('='.repeat(60));

console.log('\n🔧 Generating test data...');
const testData = generateTestData();

console.log('\n🚀 Starting benchmarks...');

for (const [sizeName, sizeData] of Object.entries(testData)) {
    const size = testDataSizes[sizeName];
    
    for (const [typeName, data] of Object.entries(sizeData)) {
        const typeDesc = testDataTypes[typeName];
        
        console.log(`\n${'='.repeat(80)}`);
        console.log(`${sizeName.toUpperCase()} ${typeName.toUpperCase()} (${formatBytes(size)})`);
        console.log(`${typeDesc}`);
        console.log(`${'='.repeat(80)}`);
        
        // Adjust iterations based on data size
        let iterations = 100;
        if (size > 1024 * 1024) iterations = 50;      // 1MB+
        if (size > 10 * 1024 * 1024) iterations = 20;  // 10MB+
        if (size > 50 * 1024 * 1024) iterations = 10;  // 50MB+
        
        // GZIP Compression
        console.log('\n📦 GZIP COMPRESSION');
        
        const islGzipResult = benchmark('ISA-L GZIP', () => {
            return isal.gzip(data, { level: 3 });
        }, iterations);
        
        const nodeGzipResult = benchmark('Node.js GZIP', () => {
            return zlib.gzipSync(data, { level: 6 }); // Node.js default level
        }, iterations);
        
        const gzipSpeedup = nodeGzipResult.avg / islGzipResult.avg;
        const gzipWinner = gzipSpeedup > 1 ? 'ISA-L' : 'Node.js';
        const gzipMultiplier = gzipSpeedup > 1 ? gzipSpeedup : 1 / gzipSpeedup;
        console.log(`🚀 ${gzipWinner} is ${gzipMultiplier.toFixed(2)}x faster for GZIP compression`);
        
        // GZIP Decompression
        const compressedGzip = isal.gzip(data, { level: 3 });
        const nodeCompressedGzip = zlib.gzipSync(data, { level: 6 });
        
        console.log('\n📦 GZIP DECOMPRESSION');
        
        const islGunzipResult = benchmark('ISA-L GUNZIP', () => {
            return isal.gunzip(compressedGzip);
        }, iterations);
        
        const nodeGunzipResult = benchmark('Node.js GUNZIP', () => {
            return zlib.gunzipSync(nodeCompressedGzip);
        }, iterations);
        
        const gunzipSpeedup = nodeGunzipResult.avg / islGunzipResult.avg;
        const gunzipWinner = gunzipSpeedup > 1 ? 'ISA-L' : 'Node.js';
        const gunzipMultiplier = gunzipSpeedup > 1 ? gunzipSpeedup : 1 / gunzipSpeedup;
        console.log(`🚀 ${gunzipWinner} is ${gunzipMultiplier.toFixed(2)}x faster for GZIP decompression`);
        
        // Compression ratio comparison
        const islCompressed = isal.gzip(data, { level: 3 });
        const nodeCompressed = zlib.gzipSync(data, { level: 6 });
        
        const islRatio = ((data.length - islCompressed.length) / data.length * 100).toFixed(2);
        const nodeRatio = ((data.length - nodeCompressed.length) / data.length * 100).toFixed(2);
        
        console.log(`\n📊 COMPRESSION RATIOS:`);
        console.log(`ISA-L (level 3):   ${formatBytes(islCompressed.length)} (${islRatio}% reduction)`);
        console.log(`Node.js (level 6): ${formatBytes(nodeCompressed.length)} (${nodeRatio}% reduction)`);
        
        // Throughput calculations
        const islThroughputMBps = (size / 1024 / 1024) / (islGzipResult.avg / 1000000000);
        const nodeThroughputMBps = (size / 1024 / 1024) / (nodeGzipResult.avg / 1000000000);
        
        console.log(`\n📈 COMPRESSION THROUGHPUT:`);
        console.log(`ISA-L:   ${islThroughputMBps.toFixed(2)} MB/s`);
        console.log(`Node.js: ${nodeThroughputMBps.toFixed(2)} MB/s`);
        
        // Skip DEFLATE for random data (similar results) and very large sizes to save time
        if (typeName !== 'random' && size <= 2 * 1024 * 1024) {
            // DEFLATE Compression
            console.log('\n📦 DEFLATE COMPRESSION');
            
            const islDeflateResult = benchmark('ISA-L DEFLATE', () => {
                return isal.deflate(data, { level: 3 });
            }, iterations);
            
            const nodeDeflateResult = benchmark('Node.js DEFLATE', () => {
                return zlib.deflateSync(data, { level: 6 });
            }, iterations);
            
            const deflateSpeedup = nodeDeflateResult.avg / islDeflateResult.avg;
            const deflateWinner = deflateSpeedup > 1 ? 'ISA-L' : 'Node.js';
            const deflateMultiplier = deflateSpeedup > 1 ? deflateSpeedup : 1 / deflateSpeedup;
            console.log(`🚀 ${deflateWinner} is ${deflateMultiplier.toFixed(2)}x faster for DEFLATE compression`);
            
            // DEFLATE Decompression
            const compressedDeflate = isal.deflate(data, { level: 3 });
            const nodeCompressedDeflate = zlib.deflateSync(data, { level: 6 });
            
            console.log('\n📦 DEFLATE DECOMPRESSION');
            
            const islInflateResult = benchmark('ISA-L INFLATE', () => {
                return isal.inflate(compressedDeflate);
            }, iterations);
            
            const nodeInflateResult = benchmark('Node.js INFLATE', () => {
                return zlib.inflateSync(nodeCompressedDeflate);
            }, iterations);
            
            const inflateSpeedup = nodeInflateResult.avg / islInflateResult.avg;
            const inflateWinner = inflateSpeedup > 1 ? 'ISA-L' : 'Node.js';
            const inflateMultiplier = inflateSpeedup > 1 ? inflateSpeedup : 1 / inflateSpeedup;
            console.log(`🚀 ${inflateWinner} is ${inflateMultiplier.toFixed(2)}x faster for DEFLATE decompression`);
        }
    }
}

console.log('\n' + '='.repeat(80));
console.log('🎯 Benchmark Complete!');
console.log('='.repeat(80));
console.log('\n📝 Notes:');
console.log('• ISA-L uses compression level 3 (highest available)');
console.log('• Node.js uses compression level 6 (default)');
console.log('• All benchmarks include warm-up iterations');
console.log('• Iterations reduced for larger data sizes for reasonable test times');
console.log('• Random data is largely incompressible and shows minimal compression ratios');
console.log('• Results may vary depending on hardware, system load, and data characteristics');
console.log('• Mixed data represents real-world scenarios with varied content types');