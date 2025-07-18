const isal = require('../index');

function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

async function runAsyncBenchmark() {
    console.log('='.repeat(60));
    console.log('Async vs Sync Performance Benchmark');
    console.log('='.repeat(60));
    
    const testData = Buffer.alloc(1024 * 1024, 'a'); // 1MB of 'a'
    console.log(`\nTest data size: ${formatBytes(testData.length)}`);
    
    // Sync benchmark
    console.log('\n🔄 Synchronous Operations:');
    const syncStart = Date.now();
    
    for (let i = 0; i < 10; i++) {
        const compressed = isal.gzip(testData);
        const decompressed = isal.gunzip(compressed);
    }
    
    const syncEnd = Date.now();
    const syncTime = syncEnd - syncStart;
    console.log(`10 sync operations took: ${syncTime}ms`);
    
    // Async benchmark (sequential)
    console.log('\n⏳ Asynchronous Operations (Sequential):');
    const asyncSeqStart = Date.now();
    
    for (let i = 0; i < 10; i++) {
        const compressed = await isal.gzipAsync(testData);
        const decompressed = await isal.gunzipAsync(compressed);
    }
    
    const asyncSeqEnd = Date.now();
    const asyncSeqTime = asyncSeqEnd - asyncSeqStart;
    console.log(`10 async operations (sequential) took: ${asyncSeqTime}ms`);
    
    // Async benchmark (parallel)
    console.log('\n🚀 Asynchronous Operations (Parallel):');
    const asyncParStart = Date.now();
    
    const promises = [];
    for (let i = 0; i < 10; i++) {
        promises.push(
            isal.gzipAsync(testData).then(compressed => isal.gunzipAsync(compressed))
        );
    }
    
    await Promise.all(promises);
    
    const asyncParEnd = Date.now();
    const asyncParTime = asyncParEnd - asyncParStart;
    console.log(`10 async operations (parallel) took: ${asyncParTime}ms`);
    
    // Event loop blocking test
    console.log('\n🔄 Event Loop Blocking Test:');
    
    // Sync operations (blocking)
    let syncTicks = 0;
    const syncInterval = setInterval(() => syncTicks++, 1);
    
    const syncBlockStart = Date.now();
    for (let i = 0; i < 5; i++) {
        isal.gzip(testData);
    }
    const syncBlockEnd = Date.now();
    clearInterval(syncInterval);
    
    // Async operations (non-blocking)
    let asyncTicks = 0;
    const asyncInterval = setInterval(() => asyncTicks++, 1);
    
    const asyncBlockStart = Date.now();
    const asyncPromises = [];
    for (let i = 0; i < 5; i++) {
        asyncPromises.push(isal.gzipAsync(testData));
    }
    await Promise.all(asyncPromises);
    const asyncBlockEnd = Date.now();
    clearInterval(asyncInterval);
    
    console.log(`\nSync operations (${syncBlockEnd - syncBlockStart}ms):`);
    console.log(`  Event loop ticked ${syncTicks} times (blocked)`);
    console.log(`\nAsync operations (${asyncBlockEnd - asyncBlockStart}ms):`);
    console.log(`  Event loop ticked ${asyncTicks} times (non-blocking)`);
    
    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 Summary:');
    console.log('='.repeat(60));
    console.log(`Sync operations:           ${syncTime}ms`);
    console.log(`Async operations (seq):    ${asyncSeqTime}ms`);
    console.log(`Async operations (par):    ${asyncParTime}ms`);
    console.log(`\nAsync parallel speedup:    ${(syncTime / asyncParTime).toFixed(2)}x`);
    console.log(`Event loop blocking:       ${syncTicks < asyncTicks ? 'Sync blocks, Async does not' : 'Both similar'}`);
    console.log('\n💡 Key Takeaways:');
    console.log('• Async operations don\'t block the event loop');
    console.log('• Parallel async operations can be faster than sequential');
    console.log('• Use async for I/O-bound operations or when you need responsiveness');
    console.log('• Use sync for simple, fast operations where blocking is acceptable');
}

runAsyncBenchmark().catch(console.error);