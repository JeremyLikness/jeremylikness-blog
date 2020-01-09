---
title: "Explore WebAssembly System Interface (WASI) From Your Browser"
author: "Jeremy Likness"
date: 2020-01-09T11:16:57-08:00
years: "2020"
lastmod: 2020-01-09T11:16:57-08:00

draft: true
comments: true
toc: false

subtitle: "One conceptual OS to rule them all"

description: "WebAssembly now lives outside of the browser thanks to the WebAssembly System Interface (WASI) and runtimes like Wasmer and Wasmtime. Learn how to build and run your own WASI modules without leaving your favorite browser."

tags:
 - WebAssembly 
 - Wasm
 - WASI
 - Web

image: "/blog/explore-wasi-from-your-browser/images/1.png" 
images:
 - "/blog/explore-wasi-from-your-browser/images/1.png" 
---

[WebAssembly](/tags/webassembly/) is a powerful new "conceptual machine" implemented in all of the popular modern browsers. It enables significant performance benefits over pure JavaScript and empowers developers to build web experiences using the language of their choice. Projects like [Blazor](/tags/blazor/) that take advantage of WebAssembly are experiencing a tremendous surge of interest and popularity. Although WebAssembly has created a new frontier on the web, it has recently broken free from the constraints of the browser to run almost anywhere.

WebAssembly System Interface, or WASI for short, is a new standard for running WebAssembly (or "Wasm" for short) outside the web. To better understand the _what_ and _why_ I recommend reading the <i class="fas fa-external-link-alt"></i> [Standardizing WASI](https://hacks.mozilla.org/2019/03/standardizing-wasi-a-webassembly-system-interface/) blog post. If Wasm represents a conceptual machine, WASI represents a conceptual operating system. I find many technology topics are easier done than said, so let's go hands on to explore what this means. Your only prerequisite is your browser!

## Your Online Studio

