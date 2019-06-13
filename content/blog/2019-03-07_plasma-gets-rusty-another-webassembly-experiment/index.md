---
title: "Plasma gets Rust-y: Another WebAssembly Experiment"
author: "Jeremy Likness"
date: 2019-03-07T19:35:03.777Z
lastmod: 2019-06-13T10:45:38-07:00

description: ""

subtitle: "Building a plasma canvas effect using Wasm compiled from Rust."
tags:
 - JavaScript 
 - Webassembly 
 - Rust 
 - Web 

image: "/blog/2019-03-07_plasma-gets-rusty-another-webassembly-experiment/images/1.png" 
images:
 - "/blog/2019-03-07_plasma-gets-rusty-another-webassembly-experiment/images/1.png" 
 - "/blog/2019-03-07_plasma-gets-rusty-another-webassembly-experiment/images/2.gif" 


aliases:
    - "/plasma-gets-rust-y-another-webassembly-experiment-bde6abf3061c"
---

#### Building a plasma canvas effect using Wasm compiled from Rust.

I’ve been working on projects to better learn and understand [WebAssembly](https://webassembly.org/) (Wasm for short). Using the [JavaScript implementation](https://jsfiddle.net/jeremylikness/1xfh3c25/) of a plasma effect as the “gold standard” I set out to duplicate the effect in Wasm. For my first attempt, I used Go. You can read about that [here](https://blog.jeremylikness.com/gopher-meet-plasma-a-webassembly-experiment-4048e4d3b8d7). During my research, I discovered that [Rust](https://www.rust-lang.org/) is the ideal language to try out because it has been [specifically optimized](https://opensource.com/article/19/2/why-use-rust-webassembly) to build Wasm modules.

👀 Watch the live demo [here](https://blazorhealthapp.z5.web.core.windows.net/plasma-rust.html)  
🔗 See the full source code [here](https://github.com/JeremyLikness/PlasmaWasmRust)
> Disclaimer: I am not a veteran Rust programmer, so over time I may find out the code can be written/refactored in a better way. If I encounter this, I will post a follow-up with my findings. I welcome your feedback if you have Rust experience.

Armed with my foreknowledge of C and C++, I set out to learn the language and master yet another experiment.




![image](/blog/2019-03-07_plasma-gets-rusty-another-webassembly-experiment/images/1.png)

Rust snippet



### Set up the Environment

There are several steps to set up your environment to build Rust apps and specifically target WebAssembly. To learn how, I followed the excellent online book/tutorial:

🔗 [Introduction to Rust and WebAssembly](https://rustwasm.github.io/book/introduction.html#rust--and-webassembly-)

I suggest you start there, and it will be easier to make sense out of the moving pieces in my solution:

[JeremyLikness/PlasmaWasmRust](https://github.com/JeremyLikness/PlasmaWasmRust)


### Implement the Rust Code

Based on earlier experiments, I chose to build the data for the plasma effect in Rust but render it in JavaScript. Fortunately, Rust has a very mature WebAssembly environment with plenty of support for interop between the two. Here I create a structure to hold color information and the data necessary for the plasma effect. The `#[wasm_bindgen]` tag automatically creates the glue necessary to access the structures from JavaScript.




The `Plasma `structure holds the target width and height, the sine table, the palette, a buffer that is exposed to render the plasma on the JavaScript side, and maintains the state of cycling through the plasma with several positional variables. The implementation of the structure exposes methods to access these properties from JavaScript. This includes the width, height, and a pointer into the memory allocated to hold the pixels.




If you’re new to Rust, notice that there is no need for an explicit `return` statement. The value in the method is implicitly returned.

This is the code to generate the sine table.




Part of the power of Rust is how it handles threading and avoids conflicts and race conditions. Variables by default are immutable, so the `mut` keyword is needed to indicate that the value of `idx` will change. The code iterates from 0 to 511 (the end range is exclusive, the beginning inclusive) and maps the value to a formula that generates the sine information. It is cast as a 32-bit integer and `collect()` is called to turn it into the collection (`Vector`).
> Note: the explicit return is based on my habits from other languages, I could have simplified the code by removing a few lines and implicitly returning the table.



A similar range iterator is used to generate the palette data.




The final piece of code is a `tick` method that advances through the sine table with every frame. Like the other experiments I ran, this code essentially builds out a buffer of pixel data based on the current cycle.




Note that `self` is passed in with `mut` because the buffer will be updated. The buffer itself is mutable as it’s being constructed.

### Build the Wasm

The setup I mentioned earlier creates an environment that will build the WebAssembly and related JavaScript bindings. To build, simply execute:

`wasm-pack build`

In the root directory. The assets are placed in a `pkg` subdirectory.

The first thing I noticed was the size. My Go experiment resulted in a 2 megabyte `.wasm` file. The corresponding Rust file is only 65 kilobytes! That’s a massive difference in size that is very important to consider for consumer-facing apps.

The second thing I noticed was the `plasma_wasm_rust.js` file. To build with Go you use a standard`wasm_exec.js` that is copied “as is” for generic bindings. The Rust environment generates code specific to your own app, including bindings to the methods and structures that were explicitly exposed and marked with `wasm_bind`.




This makes it incredibly easy to wire the Wasm into a JavaScript app.

### The Web App

In the `www` folder is a small Node.js web app that is used to deliver the project to browsers. It is linked to the assets from the Wasm build and will build a distribution with all the files you need. The HTML shell contains some basic styling and boilerplate to bootstrap the application. Everything unique is contained in the `body` tag.




The bootstrap file imports the `index.js` file and generates additional code to load the Wasm environment when the project is built.

The custom code starts by importing the Wasm classes for Plasma and memory management. The `memory` module is very important … stay tuned. The following code creates an instance of the plasma structure, grabs the width and height and configures the canvas.




The rendering loop is called for each animation frame (when the browser is ready to repaint). It advances the sine table, then calls a method to draw it, and repeats.




Finally, to “draw” the plasma, use the following code.




Marshaling data between Wasm and JavaScript often involves passing a copy of the data. WebAssembly allocates a block of linear memory for use by Wasm modules, so why not take advantage of it? The `memory` module allows direct access to the existing memory. The array is created by pointing straight at the memory allocated by Wasm, passing in a pointer to the pixel buffer and the size of the data. This buffer can then be passed “as is” into image data that is drawn on the canvas.

### Conclusion

After doing this experiment in Go and Rust, by far my favorite experience was with Rust. As must as I enjoy Go as a language, the tools for Rust and Wasm are incredibly mature to build robust apps and the resulting modules are streamlined (without even optimizing the Wasm size or compressing it). I am confident all languages that support WebAssembly will mature and grow over time. For now, however, I may need to spend more time mastering the Rust language and exploring ways to inject some performance into JavaScript apps!

👀 Watch the live demo [here](https://blazorhealthapp.z5.web.core.windows.net/plasma-rust.html)  
🔗 See the full source code [here](https://github.com/JeremyLikness/PlasmaWasmRust)

Regards,




![image](/blog/2019-03-07_plasma-gets-rusty-another-webassembly-experiment/images/2.gif)
