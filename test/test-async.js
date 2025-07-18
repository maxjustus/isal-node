const isal = require('../index');
const assert = require('assert');

async function test(name, fn) {
    try {
        await fn();
        console.log(`✓ ${name}`);
    } catch (error) {
        console.error(`✗ ${name}: ${error.message}`);
        process.exit(1);
    }
}

async function runAsyncTests() {
    console.log('Running async tests...\n');
    
    const testData = Buffer.from('Hello, World! This is a test string for async compression. '.repeat(10));

    await test('Async GZIP compression and decompression', async () => {
        const compressed = await isal.gzipAsync(testData);
        const decompressed = await isal.ungzipAsync(compressed);
        assert(decompressed.equals(testData));
        assert(compressed.length < testData.length);
    });

    await test('Async DEFLATE compression and decompression', async () => {
        const compressed = await isal.deflateAsync(testData);
        const decompressed = await isal.inflateAsync(compressed);
        assert(decompressed.equals(testData));
        assert(compressed.length < testData.length);
    });

    await test('Async ZLIB compression and decompression', async () => {
        const compressed = await isal.compressAsync(testData);
        const decompressed = await isal.decompressAsync(compressed);
        assert(decompressed.equals(testData));
        assert(compressed.length < testData.length);
    });

    await test('Direct async GZIP functions', async () => {
        const compressed = await isal.compressGzipAsync(testData, 3);
        const decompressed = await isal.decompressGzipAsync(compressed);
        assert(decompressed.equals(testData));
    });

    await test('Direct async DEFLATE functions', async () => {
        const compressed = await isal.compressDeflateAsync(testData, 3);
        const decompressed = await isal.decompressDeflateAsync(compressed);
        assert(decompressed.equals(testData));
    });

    await test('Direct async ZLIB functions', async () => {
        const compressed = await isal.compressZlibAsync(testData, 3);
        const decompressed = await isal.decompressZlibAsync(compressed);
        assert(decompressed.equals(testData));
    });

    await test('Async compression levels', async () => {
        const level0 = await isal.gzipAsync(testData, { level: 0 });
        const level1 = await isal.gzipAsync(testData, { level: 1 });
        const level3 = await isal.gzipAsync(testData, { level: 3 });
        
        const decompressed0 = await isal.ungzipAsync(level0);
        const decompressed1 = await isal.ungzipAsync(level1);
        const decompressed3 = await isal.ungzipAsync(level3);
        
        assert(decompressed0.equals(testData));
        assert(decompressed1.equals(testData));
        assert(decompressed3.equals(testData));
    });

    await test('Async empty buffer compression', async () => {
        const empty = Buffer.alloc(0);
        const compressed = await isal.gzipAsync(empty);
        const decompressed = await isal.ungzipAsync(compressed);
        assert(decompressed.equals(empty));
    });

    await test('Async operations are non-blocking', async () => {
        const largeData = Buffer.alloc(1024 * 1024, 'a'); // 1MB of 'a'
        
        let counter = 0;
        const interval = setInterval(() => {
            counter++;
        }, 1);

        // Start multiple async operations
        const promises = [];
        for (let i = 0; i < 5; i++) {
            promises.push(isal.gzipAsync(largeData));
        }
        
        await Promise.all(promises);
        clearInterval(interval);
        
        // If async operations were blocking, counter would be 0
        assert(counter > 0, 'Async operations should not block the event loop');
        console.log(`    Event loop ticked ${counter} times during async operations`);
    });

    console.log('\nAll async tests passed! 🎉');
}

runAsyncTests().catch(console.error);