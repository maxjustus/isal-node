const isal = require('../index');
const assert = require('assert');

function test(name, fn) {
    try {
        fn();
        console.log(`✓ ${name}`);
    } catch (error) {
        console.error(`✗ ${name}: ${error.message}`);
        process.exit(1);
    }
}

const testData = Buffer.from('Hello, World! This is a test string for compression. '.repeat(100));

test('GZIP compression and decompression', () => {
    const compressed = isal.gzip(testData);
    const decompressed = isal.gunzip(compressed);
    assert(decompressed.equals(testData));
    assert(compressed.length < testData.length);
});

test('GZIP with Sync suffix', () => {
    const compressed = isal.gzipSync(testData);
    const decompressed = isal.gunzipSync(compressed);
    assert(decompressed.equals(testData));
    assert(compressed.length < testData.length);
});

test('DEFLATE with Sync suffix', () => {
    const compressed = isal.deflateSync(testData);
    const decompressed = isal.inflateSync(compressed);
    assert(decompressed.equals(testData));
    assert(compressed.length < testData.length);
});

test('DEFLATE compression and decompression', () => {
    const compressed = isal.deflate(testData);
    const decompressed = isal.inflate(compressed);
    assert(decompressed.equals(testData));
    assert(compressed.length < testData.length);
});

test('ZLIB compression and decompression', () => {
    const compressed = isal.zlib(testData);
    const decompressed = isal.unzlib(compressed);
    assert(decompressed.equals(testData));
    assert(compressed.length < testData.length);
});


test('Compression levels', () => {
    const level0 = isal.gzip(testData, { level: 0 });
    const level1 = isal.gzip(testData, { level: 1 });
    const level3 = isal.gzip(testData, { level: 3 });
    
    assert(isal.gunzip(level0).equals(testData));
    assert(isal.gunzip(level1).equals(testData));
    assert(isal.gunzip(level3).equals(testData));
    
    // Note: For ISA-L, level 3 might not always be smaller than level 1
    assert(level3.length > 0);
    assert(level1.length > 0);
    assert(level0.length > 0);
});


test('Empty buffer compression', () => {
    const empty = Buffer.alloc(0);
    const compressed = isal.gzip(empty);
    const decompressed = isal.gunzip(compressed);
    assert(decompressed.equals(empty));
});

console.log('\nAll tests passed! 🎉');