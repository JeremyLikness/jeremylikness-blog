---
title: "Explore WebAssembly System Interface (WASI for Wasm) From Your Browser"
author: "Jeremy Likness"
date: 2020-01-09T11:16:57-08:00
years: "2020"
lastmod: 2020-01-09T11:16:57-08:00

draft: false
comments: true
toc: true

subtitle: "One conceptual OS to rule them all"

description: "WebAssembly now lives outside of the browser thanks to the WebAssembly System Interface (WASI) and runtimes like Wasmer and Wasmtime. Learn how to build and run your own WASI modules without leaving your favorite browser."

tags:
 - WebAssembly 
 - Wasm
 - WASI
 - Wasmer
 - Wasmtime

image: "/blog/explore-wasi-from-your-browser/images/qr2text.png" 
images:
 - "/blog/explore-wasi-from-your-browser/images/wat.png" 
 - "/blog/explore-wasi-from-your-browser/images/qr2text.png"
 - "/blog/explore-wasi-from-your-browser/images/firstwasi.png"
 - "/blog/explore-wasi-from-your-browser/images/jeremy_dance.gif"
---

[WebAssembly](/tags/webassembly/) is a powerful virtual machine implemented by all the popular modern browsers. It enables significant performance benefits over pure JavaScript and empowers developers to build web experiences using the language of their choice. Projects like [Blazor](/tags/blazor/) that take advantage of WebAssembly are experiencing a tremendous surge of interest and popularity. Although WebAssembly has created a new frontier on the web, it has recently broken free from the constraints of the browser to run almost anywhere.

WebAssembly System Interface, or WASI for short, is a new standard for running WebAssembly (or "Wasm" for short) outside the web. To better understand the _what_ and _why_ I recommend reading the <i class="fas fa-external-link-alt"></i> [Standardizing WASI](https://hacks.mozilla.org/2019/03/standardizing-wasi-a-webassembly-system-interface/) blog post. If Wasm represents a conceptual machine, WASI represents a conceptual operating system. I find many technology topics are easier done than said, so let's go hands on to explore what this means. The only prerequisite is your browser!

## An Online Studio

The first step is to generate the byte code WebAssembly runs on, called Wasm. The easiest way to do this is to navigate to [WebAssembly.studio](https://webassembly.studio), where you can create, build, and run projects online. Let's do a simple exercise. Create an empty "Wat" project.

![Empty Wat](/blog/explore-wasi-from-your-browser/images/wat.png)

"Wat" is short for "WebAssembly text" and is a visual/textual way of representing the Wasm byte code. Navigate to `main.html` and note that it is straightforward HTML with some JavaScript. Open `main.js`:

{{<highlight JavaScript>}}
fetch('../out/main.wasm').then(response =>
  response.arrayBuffer()
).then(bytes => WebAssembly.instantiate(bytes)).then(results => {
  instance = results.instance;
  document.getElementById("container").textContent = instance.exports.add(1,1);
}).catch(console.error);
{{</highlight>}}

This code fetches the byte code and passes it to the `WebAssembly` API to construct a new instance. The instance contains a property called `exports` that exposes a method named `add`. Let's see where those come from by opening `main.wat`:

{{<highlight asm>}}
(module
  (func $add (param $lhs i32) (param $rhs i32) (result i32)
    get_local $lhs
    get_local $rhs
    i32.add)
  (export "add" (func $add))
)
{{</highlight>}}

This is the low-level code WebAssembly compiles to. By itself, WebAssembly is a "black box" that cannot interact with anything external. The only way for it to interface with the DOM is to either expose _exports_ that are called from JavaScript, or _imports_ that can be called from WebAssembly. This is a model of "least privilege" security. Here, the function `$add` is defined as taking two 32-bit integer parameters and returning a 32-bit integer result. The `get_local` instructions place values on the stack, and `i32.add` simply pops those values off, adds them, and pushes the result to the stack. The function is exported as `add`.

Build the project and notice that a new file is generated called `main.wasm`. This is the byte code. If you click on it, you'll see the textual representation that looks similar to the source.

{{<highlight asm>}}
(module
  (type $t0 (func (param i32 i32) (result i32)))
  (func $add (export "add") (type $t0) (param $lhs i32) (param $rhs i32) (result i32)
    get_local $lhs
    get_local $rhs
    i32.add))
{{</highlight>}}

Go ahead an run the project. OK, great. So now what? Let's try one more example, this time compiling from a higher-level language. Open a new tab or refresh the current page. Create a new project, this time choosing [AssemblyScript](https://github.com/AssemblyScript/assemblyscript). Based on TypeScript, AssemblyScript provides a set of type definitions to enable compiling from TypeScript to Wasm. Open `main.ts`:

{{<highlight TypeScript>}}
declare function sayHello(): void;

sayHello();

export function add(x: i32, y: i32): i32 {
  return x + y;
}
{{</highlight>}}

A few things are going on. The `declare` indicates a method named `sayHello` is going to be _imported_. It is immediately called. A function named `add` is also exported and does essentially the same thing as the previous example. When you build this project, the `main.wasm` is a little larger:

{{<highlight asm>}}
(module
  (type $t0 (func))
  (type $t1 (func (param i32 i32) (result i32)))
  (import "main" "sayHello" (func $main.sayHello (type $t0)))
  (func $add (export "add") (type $t1) (param $p0 i32) (param $p1 i32) (result i32)
    get_local $p0
    get_local $p1
    i32.add)
  (func $f2 (type $t0)
    call $main.sayHello)
  (memory $memory (export "memory") 0)
  (start 2))
{{</highlight>}}

There are now two "types" for the two calls. One is imported as a function named `$main.sayHello` and the other is defined as `$add` and exported as `add`. An anonymous function `$f2` is created to call the "hello" method and the `start` instruction ensures this will be called. Open `main.js` to see how the `sayHello` import is passed to the `WebAssembly` API with JSON configuration.

{{<highlight JavaScript>}}
WebAssembly.instantiateStreaming(fetch("../out/main.wasm"), {
  main: {
    sayHello() {
      console.log("Hello from WebAssembly!");
    }
  },
  env: {
    abort(_msg, _file, line, column) {
      console.error("abort called at main.ts:" + line + ":" + column);
    }
  },
}).then(result => {
  const exports = result.instance.exports;
  document.getElementById("container").textContent = "Result: " + exports.add(19, 23);
}).catch(console.error);
{{</highlight>}}

Build and run the project see the console "hello" message and the "add" result. This example illustrates:

* WebAssembly cannot directly interact with the DOM, but can call methods that are explicitly _imported_
* WebAssembly can run code when instantiated, but must explicitly _export_ functions to be called externally
* WebAssembly is a suitable compile target for high level languages like C, C#, Go, Rust and even TypeScript

## WASI and Wasm

Let's expand our example a bit. First, a general note:

> <i class="fa fa-star"></i> All WASI is Wasm, but not all Wasm is WASI

In other words, a WASI module has byte code with imports and exports like any other WebAssembly modules. There are two things that distinguish WASI modules from "ordinary" Wasm:

1. WASI modules may import one or many pre-defined [WASI interfaces](https://github.com/bytecodealliance/wasmtime/blob/master/docs/WASI-api.md)
2. Although the Wasm `start` instruction is valid, WASI modules export by convention a function as `_start` to be called by the host runtime

_Whoa_. Let's back up a second. Did I say, "runtime?" _I did_. Remember I mentioned earlier that Wasm is a conceptual machine, and WASI describes a conceptual OS? The same way browsers implement the Wasm "machine", there must be a host process the provides the "hooks" for the WASI interface. In other words, when a WASI module calls [`__wasi_fd_write()`](https://github.com/bytecodealliance/wasmtime/blob/master/docs/WASI-api.md#fd_write) there needs to be a host to pass that imported function so it is able to actually _do_ something.

There are several runtimes available, including [Wasmer](https://wasmer.io/) and [Wasmtime](https://wasmtime.dev/). They can be hosted on various platforms and even integrate with other languages and runtimes (for example, it is entirely possible to call a WASI module from inside a Go or C# application). The runtimes solve some interesting problems such as security and filesystem access. WASI cannot access the host machine (a good thing) but some WASI modules read and write files. This is possible because they interact with a _file descriptor_ that is passed in from the host process. This means they can only access files or folders on an _opt-in_ basis. If you don't allow the access, the module simply cannot perform the operation.

To keep things simple, however, I'm going to keep you in your browser and introduce you to a browser-based runtime called the [WebAssembly shell (https://webassembly.sh)](https://webassembly.sh).

## The WebAssembly Shell

The WebAssembly Shell is an implementation of Wasmer in your browser. It provides support for managing modules via the [WebAssembly Package Manager (WAPM)](https://wapm.io/). You can even install it as a Progressive Web App (PWA) and run it offline. Let's start with a simple example. Open the shell and install the `qr2text` module:

`wapm install qr2text`

Now you can run the installed module like this:

`qr2text https://blog.jeremylikness.com`

![Running qr2text](/blog/explore-wasi-from-your-browser/images/qr2text.png)

The module itself is written in Rust that is compiled to WebAssembly with WASI. If you're curious, the source code is available in this repository:

{{<github "wapm-packages/qr2text">}}

This module will run without modification on _any_ platform that has a WASI-capable host, including Linux, Windows, MacOS, and even ARM-based devices. There are some other cool packages you can play with like `cowsay` (quote text from an ASCII cow) and `rustpython` that provides an interactive Python interpreter (written in Rust, compiled to Wasm). If you're like me, however, you're ready to build your own module. There are different tool chains available based on the language you use, so I'll stick with pure WebAssembly for this example.

## Your First WASI Module

Go back to the WebAssembly Studio and create a new, empty Wat project. Don't build it yet. Instead, open `main.wat` and delete everything then overwrite it with the following code:

{{<highlight asm>}}
(module $hello

    (import "wasi_unstable" "fd_write"
        (func $fd_write (param i32 i32 i32 i32) (result i32))
    )

    (memory 1)
    (export "memory" (memory 0))

    (data (i32.const 8) "My first WASI module!\n")

    (func $main (export "_start")
        
        (i32.store (i32.const 0) (i32.const 8))  
        (i32.store (i32.const 4) (i32.const 22)) 

        (call $fd_write
            (i32.const 1) 
            (i32.const 0) 
            (i32.const 1) 
            (i32.const 30) 
        )
        drop 
    )
)
{{</highlight>}}

(The code is based on [this "Hello, World" project](https://github.com/chai2010/wasi-hello)).

Click on the `Save` button in the upper right and build it. The generated code is simple. At this stage, the code builds fine even though you didn't include any WASI package. This is because the imports are always provided by the host, so no compile-time checking is necessary. Let's look at the code:

* A WASI module is imported called `fd_write` that takes four (4) 32-bit integers and returns an integer
* Some memory is defined and populated with a string constant. It is offset by 8 bytes so there is room for two   32-bit (4-byte) integers before it
* The memory is exported (so it can be read by external processes)
* The 32-bit (4-byte) offset of the string constant (8) is stored in memory at location 0
* The 32-bit length of the string constant (22) is stored in memory at location 4, or immediately after the previous 4 bytes
* The `fd_write` function is called with four parameters:
  * Where to write (`1` is for `stdout` or standard output)
  * The location in memory with the offset of the string constant (0) and its length
  * The number of strings to expect
  * The location in memory to store the number of bytes written (we ignore this)
* `drop` does nothing but unlike `nop` it clears unneeded values from the stack ([see here](https://github.com/sunfishcode/wasm-reference-manual/blob/master/WebAssembly.md#additional-memory-related-instructions) for clarification)

Conceptually, the memory looks like this:

* 0..3 = 8
* 4..7 = 22
* 8..29 = text
* 30 = a value we ignore

Fortunately, you don't have to deal with manually counting the length of a string or computing memory offsets when you use higher level languages like Rust. If you try to run this example from the studio, you'll get an error. This is because the import isn't implemented. No problem! Click the "Download" button to download a package. Unzip the package, navigate to the `out` directory, and you'll find the compiled `main.wasm` file.

Next, go back to your WebAssembly Shell and type `wapm upload`. This will open a file dialog. Navigate to the Wasm file you just downloaded and select it. After it is uploaded, type `main` and hit enter.

![First WASI](/blog/explore-wasi-from-your-browser/images/firstwasi.png)

I don't know about you, but seeing it working made me dance.

![Jeremy Dance](/blog/explore-wasi-from-your-browser/images/jeremy_dance.gif)

## Summary

Now you have created your first WASI module without having to leave the comfort of your web browser. Of course, it is possible to install the runtimes locally on your machine and work from there. I have it in my Ubuntu instance running via Windows Subsystem for Linux (WSL) on my Windows 10 machine. If you're interested in digging deeper, any of the links in this blog post should provide a solid point to start from. As always, I welcome your feedback and if you end up building your own WASI module, feel free to post it here!

Happy coding,

![Jeremy Likness](/images/jeremylikness.gif)