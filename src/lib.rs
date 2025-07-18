use neon::prelude::*;
use neon::types::buffer::TypedArray;
use isal::{compress, decompress, CompressionLevel, Codec};
use std::io::Cursor;

// Helper function to parse compression level
fn parse_compression_level(level: u8) -> Result<CompressionLevel, &'static str> {
    match level {
        0 => Ok(CompressionLevel::Zero),
        1 => Ok(CompressionLevel::One),
        3 => Ok(CompressionLevel::Three),
        _ => Err("Invalid compression level. Must be 0, 1, or 3"),
    }
}

// Macro to generate synchronous compression functions
macro_rules! generate_compression_fn {
    ($fn_name:ident, $codec:expr) => {
        fn $fn_name(mut cx: FunctionContext) -> JsResult<JsBuffer> {
            let input = cx.argument::<JsBuffer>(0)?;
            let level = cx.argument::<JsNumber>(1)?.value(&mut cx) as u8;
            
            let level = match parse_compression_level(level) {
                Ok(level) => level,
                Err(msg) => return cx.throw_error(msg),
            };
            
            let input_data = input.as_slice(&cx);
            
            match compress(input_data, level, $codec) {
                Ok(compressed) => {
                    let mut output = cx.buffer(compressed.len())?;
                    output.as_mut_slice(&mut cx).copy_from_slice(&compressed);
                    Ok(output)
                }
                Err(e) => cx.throw_error(format!("Compression failed: {}", e)),
            }
        }
    };
}

// Macro to generate synchronous decompression functions
macro_rules! generate_decompression_fn {
    ($fn_name:ident, $codec:expr) => {
        fn $fn_name(mut cx: FunctionContext) -> JsResult<JsBuffer> {
            let input = cx.argument::<JsBuffer>(0)?;
            let input_data = input.as_slice(&cx);
            
            match decompress(input_data, $codec) {
                Ok(decompressed) => {
                    let mut output = cx.buffer(decompressed.len())?;
                    output.as_mut_slice(&mut cx).copy_from_slice(&decompressed);
                    Ok(output)
                }
                Err(e) => cx.throw_error(format!("Decompression failed: {}", e)),
            }
        }
    };
}

// Macro to generate asynchronous compression functions
macro_rules! generate_async_compression_fn {
    ($fn_name:ident, $codec:expr) => {
        fn $fn_name(mut cx: FunctionContext) -> JsResult<JsPromise> {
            let input = cx.argument::<JsBuffer>(0)?;
            let level = cx.argument::<JsNumber>(1)?.value(&mut cx) as u8;
            
            let level = match parse_compression_level(level) {
                Ok(level) => level,
                Err(msg) => return cx.throw_error(msg),
            };
            
            let input_data = input.as_slice(&cx).to_vec();
            
            let promise = cx.task(move || {
                compress(Cursor::new(&input_data), level, $codec)
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
    };
}

// Macro to generate asynchronous decompression functions
macro_rules! generate_async_decompression_fn {
    ($fn_name:ident, $codec:expr) => {
        fn $fn_name(mut cx: FunctionContext) -> JsResult<JsPromise> {
            let input = cx.argument::<JsBuffer>(0)?;
            let input_data = input.as_slice(&cx).to_vec();
            
            let promise = cx.task(move || {
                decompress(Cursor::new(&input_data), $codec)
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
    };
}

// Generate all the functions using macros
generate_compression_fn!(compress_gzip, Codec::Gzip);
generate_compression_fn!(compress_deflate, Codec::Deflate);
generate_compression_fn!(compress_zlib, Codec::Zlib);

generate_decompression_fn!(decompress_gzip, Codec::Gzip);
generate_decompression_fn!(decompress_deflate, Codec::Deflate);
generate_decompression_fn!(decompress_zlib, Codec::Zlib);

generate_async_compression_fn!(compress_gzip_async, Codec::Gzip);
generate_async_compression_fn!(compress_deflate_async, Codec::Deflate);
generate_async_compression_fn!(compress_zlib_async, Codec::Zlib);

generate_async_decompression_fn!(decompress_gzip_async, Codec::Gzip);
generate_async_decompression_fn!(decompress_deflate_async, Codec::Deflate);
generate_async_decompression_fn!(decompress_zlib_async, Codec::Zlib);

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