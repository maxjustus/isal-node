use neon::prelude::*;
use neon::types::buffer::TypedArray;
use isal::{compress, decompress, CompressionLevel, Codec};
use std::io::Cursor;

fn compress_gzip(mut cx: FunctionContext) -> JsResult<JsBuffer> {
    let input = cx.argument::<JsBuffer>(0)?;
    let level = cx.argument::<JsNumber>(1)?.value(&mut cx) as u8;
    
    let level = match level {
        0 => CompressionLevel::Zero,
        1 => CompressionLevel::One,
        3 => CompressionLevel::Three,
        _ => return cx.throw_error("Invalid compression level. Must be 0, 1, or 3"),
    };
    
    let input_data = input.as_slice(&cx);
    
    match compress(input_data, level, Codec::Gzip) {
        Ok(compressed) => {
            let mut output = cx.buffer(compressed.len())?;
            output.as_mut_slice(&mut cx).copy_from_slice(&compressed);
            Ok(output)
        }
        Err(e) => cx.throw_error(format!("Compression failed: {}", e)),
    }
}

fn decompress_gzip(mut cx: FunctionContext) -> JsResult<JsBuffer> {
    let input = cx.argument::<JsBuffer>(0)?;
    let input_data = input.as_slice(&cx);
    
    match decompress(input_data, Codec::Gzip) {
        Ok(decompressed) => {
            let mut output = cx.buffer(decompressed.len())?;
            output.as_mut_slice(&mut cx).copy_from_slice(&decompressed);
            Ok(output)
        }
        Err(e) => cx.throw_error(format!("Decompression failed: {}", e)),
    }
}

fn compress_deflate(mut cx: FunctionContext) -> JsResult<JsBuffer> {
    let input = cx.argument::<JsBuffer>(0)?;
    let level = cx.argument::<JsNumber>(1)?.value(&mut cx) as u8;
    
    let level = match level {
        0 => CompressionLevel::Zero,
        1 => CompressionLevel::One,
        3 => CompressionLevel::Three,
        _ => return cx.throw_error("Invalid compression level. Must be 0, 1, or 3"),
    };
    
    let input_data = input.as_slice(&cx);
    
    match compress(input_data, level, Codec::Deflate) {
        Ok(compressed) => {
            let mut output = cx.buffer(compressed.len())?;
            output.as_mut_slice(&mut cx).copy_from_slice(&compressed);
            Ok(output)
        }
        Err(e) => cx.throw_error(format!("Compression failed: {}", e)),
    }
}

fn decompress_deflate(mut cx: FunctionContext) -> JsResult<JsBuffer> {
    let input = cx.argument::<JsBuffer>(0)?;
    let input_data = input.as_slice(&cx);
    
    match decompress(input_data, Codec::Deflate) {
        Ok(decompressed) => {
            let mut output = cx.buffer(decompressed.len())?;
            output.as_mut_slice(&mut cx).copy_from_slice(&decompressed);
            Ok(output)
        }
        Err(e) => cx.throw_error(format!("Decompression failed: {}", e)),
    }
}

fn compress_zlib(mut cx: FunctionContext) -> JsResult<JsBuffer> {
    let input = cx.argument::<JsBuffer>(0)?;
    let level = cx.argument::<JsNumber>(1)?.value(&mut cx) as u8;
    
    let level = match level {
        0 => CompressionLevel::Zero,
        1 => CompressionLevel::One,
        3 => CompressionLevel::Three,
        _ => return cx.throw_error("Invalid compression level. Must be 0, 1, or 3"),
    };
    
    let input_data = input.as_slice(&cx);
    
    match compress(input_data, level, Codec::Zlib) {
        Ok(compressed) => {
            let mut output = cx.buffer(compressed.len())?;
            output.as_mut_slice(&mut cx).copy_from_slice(&compressed);
            Ok(output)
        }
        Err(e) => cx.throw_error(format!("Compression failed: {}", e)),
    }
}

fn decompress_zlib(mut cx: FunctionContext) -> JsResult<JsBuffer> {
    let input = cx.argument::<JsBuffer>(0)?;
    let input_data = input.as_slice(&cx);
    
    match decompress(input_data, Codec::Zlib) {
        Ok(decompressed) => {
            let mut output = cx.buffer(decompressed.len())?;
            output.as_mut_slice(&mut cx).copy_from_slice(&decompressed);
            Ok(output)
        }
        Err(e) => cx.throw_error(format!("Decompression failed: {}", e)),
    }
}

// Async versions
fn compress_gzip_async(mut cx: FunctionContext) -> JsResult<JsPromise> {
    let input = cx.argument::<JsBuffer>(0)?;
    let level = cx.argument::<JsNumber>(1)?.value(&mut cx) as u8;
    
    let level = match level {
        0 => CompressionLevel::Zero,
        1 => CompressionLevel::One,
        3 => CompressionLevel::Three,
        _ => return cx.throw_error("Invalid compression level. Must be 0, 1, or 3"),
    };
    
    let input_data = input.as_slice(&cx).to_vec();
    
    let promise = cx.task(move || {
        compress(Cursor::new(&input_data), level, Codec::Gzip)
    }).promise(|mut cx, result| {
        match result {
            Ok(compressed) => {
                let mut output = cx.buffer(compressed.len())?;
                output.as_mut_slice(&mut cx).copy_from_slice(&compressed);
                Ok(output)
            }
            Err(e) => cx.throw_error(format!("Compression failed: {}", e)),
        }
    });
    
    Ok(promise)
}

fn decompress_gzip_async(mut cx: FunctionContext) -> JsResult<JsPromise> {
    let input = cx.argument::<JsBuffer>(0)?;
    let input_data = input.as_slice(&cx).to_vec();
    
    let promise = cx.task(move || {
        decompress(Cursor::new(&input_data), Codec::Gzip)
    }).promise(|mut cx, result| {
        match result {
            Ok(decompressed) => {
                let mut output = cx.buffer(decompressed.len())?;
                output.as_mut_slice(&mut cx).copy_from_slice(&decompressed);
                Ok(output)
            }
            Err(e) => cx.throw_error(format!("Decompression failed: {}", e)),
        }
    });
    
    Ok(promise)
}

fn compress_deflate_async(mut cx: FunctionContext) -> JsResult<JsPromise> {
    let input = cx.argument::<JsBuffer>(0)?;
    let level = cx.argument::<JsNumber>(1)?.value(&mut cx) as u8;
    
    let level = match level {
        0 => CompressionLevel::Zero,
        1 => CompressionLevel::One,
        3 => CompressionLevel::Three,
        _ => return cx.throw_error("Invalid compression level. Must be 0, 1, or 3"),
    };
    
    let input_data = input.as_slice(&cx).to_vec();
    
    let promise = cx.task(move || {
        compress(Cursor::new(&input_data), level, Codec::Deflate)
    }).promise(|mut cx, result| {
        match result {
            Ok(compressed) => {
                let mut output = cx.buffer(compressed.len())?;
                output.as_mut_slice(&mut cx).copy_from_slice(&compressed);
                Ok(output)
            }
            Err(e) => cx.throw_error(format!("Compression failed: {}", e)),
        }
    });
    
    Ok(promise)
}

fn decompress_deflate_async(mut cx: FunctionContext) -> JsResult<JsPromise> {
    let input = cx.argument::<JsBuffer>(0)?;
    let input_data = input.as_slice(&cx).to_vec();
    
    let promise = cx.task(move || {
        decompress(Cursor::new(&input_data), Codec::Deflate)
    }).promise(|mut cx, result| {
        match result {
            Ok(decompressed) => {
                let mut output = cx.buffer(decompressed.len())?;
                output.as_mut_slice(&mut cx).copy_from_slice(&decompressed);
                Ok(output)
            }
            Err(e) => cx.throw_error(format!("Decompression failed: {}", e)),
        }
    });
    
    Ok(promise)
}

fn compress_zlib_async(mut cx: FunctionContext) -> JsResult<JsPromise> {
    let input = cx.argument::<JsBuffer>(0)?;
    let level = cx.argument::<JsNumber>(1)?.value(&mut cx) as u8;
    
    let level = match level {
        0 => CompressionLevel::Zero,
        1 => CompressionLevel::One,
        3 => CompressionLevel::Three,
        _ => return cx.throw_error("Invalid compression level. Must be 0, 1, or 3"),
    };
    
    let input_data = input.as_slice(&cx).to_vec();
    
    let promise = cx.task(move || {
        compress(Cursor::new(&input_data), level, Codec::Zlib)
    }).promise(|mut cx, result| {
        match result {
            Ok(compressed) => {
                let mut output = cx.buffer(compressed.len())?;
                output.as_mut_slice(&mut cx).copy_from_slice(&compressed);
                Ok(output)
            }
            Err(e) => cx.throw_error(format!("Compression failed: {}", e)),
        }
    });
    
    Ok(promise)
}

fn decompress_zlib_async(mut cx: FunctionContext) -> JsResult<JsPromise> {
    let input = cx.argument::<JsBuffer>(0)?;
    let input_data = input.as_slice(&cx).to_vec();
    
    let promise = cx.task(move || {
        decompress(Cursor::new(&input_data), Codec::Zlib)
    }).promise(|mut cx, result| {
        match result {
            Ok(decompressed) => {
                let mut output = cx.buffer(decompressed.len())?;
                output.as_mut_slice(&mut cx).copy_from_slice(&decompressed);
                Ok(output)
            }
            Err(e) => cx.throw_error(format!("Decompression failed: {}", e)),
        }
    });
    
    Ok(promise)
}

#[neon::main]
fn main(mut cx: ModuleContext) -> NeonResult<()> {
    // Synchronous functions
    cx.export_function("compressGzip", compress_gzip)?;
    cx.export_function("decompressGzip", decompress_gzip)?;
    cx.export_function("compressDeflate", compress_deflate)?;
    cx.export_function("decompressDeflate", decompress_deflate)?;
    cx.export_function("compressZlib", compress_zlib)?;
    cx.export_function("decompressZlib", decompress_zlib)?;
    
    // Asynchronous functions
    cx.export_function("compressGzipAsync", compress_gzip_async)?;
    cx.export_function("decompressGzipAsync", decompress_gzip_async)?;
    cx.export_function("compressDeflateAsync", compress_deflate_async)?;
    cx.export_function("decompressDeflateAsync", decompress_deflate_async)?;
    cx.export_function("compressZlibAsync", compress_zlib_async)?;
    cx.export_function("decompressZlibAsync", decompress_zlib_async)?;
    
    Ok(())
}