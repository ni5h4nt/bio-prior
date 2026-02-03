#!/bin/bash
set -e
wasm-pack build --target web --out-dir pkg
echo "WASM build complete: rust-core/pkg/"
