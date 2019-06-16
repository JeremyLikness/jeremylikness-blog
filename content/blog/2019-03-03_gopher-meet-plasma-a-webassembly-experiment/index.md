---
title: "Gopher meet Plasma: A WebAssembly Experiment"
author: "Jeremy Likness"
date: 2019-03-03T16:32:05.940Z
years: "2019"
lastmod: 2019-06-13T10:45:35-07:00
comments: true
toc: true

description: "A walk through to building a high performance plasma effect using JavaScript’s canvas in conjunction with WebAssembly by compiling Go to WASM."

subtitle: "Using WASM coded in Go to generate a plasma effect"
tags:
 - JavaScript 
 - Webassembly 
 - Wasm 
 - Go 
 - Graphics 

image: "/blog/2019-03-03_gopher-meet-plasma-a-webassembly-experiment/images/1.jpeg" 
images:
 - "/blog/2019-03-03_gopher-meet-plasma-a-webassembly-experiment/images/1.jpeg" 
 - "/blog/2019-03-03_gopher-meet-plasma-a-webassembly-experiment/images/2.gif" 
 - "/blog/2019-03-03_gopher-meet-plasma-a-webassembly-experiment/images/3.gif" 


aliases:
    - "/gopher-meet-plasma-a-webassembly-experiment-4048e4d3b8d7"
---

In the early days of programming, hackers around the world participated in what was referred to as the “[demo scene](http://www.pouet.net/).” It still thrives today but I am mostly familiar with the “old school” phase that mainly involved using hardware hacks and other tricks to push personal computers to their limits. We could “trick” the video processor into drawing in areas it wasn’t supposed to and with clever timing produce more colors or sprites than were “allowed.” It was a fun time and I learned a lot.

{{<figure src="/blog/2019-03-03_gopher-meet-plasma-a-webassembly-experiment/images/1.jpeg" caption="I don’t have a gopher picture. Settle for a marmot?" alt="Picture of a marmot">}}

One popular effect is called plasma. It not only looks cool but can be processor intensive so pulling it off is considered a great trick. Really good programmers were able to generate transparent plasma and overlay multiple layers, generate “interference” patterns and even rotate the canvas on the fly.

In 2010 I decided to take some “old school” effects and implement them [in Silverlight](https://csharperimage.jeremylikness.com/2010/12/old-school-silverlight-effects.html). Later, I brought them over [to Windows 8](https://csharperimage.jeremylikness.com/2012/12/going-old-school-on-windows-8.html) and finally made a [JavaScript implementation](https://jsfiddle.net/jeremylikness/bVY6t/) using the canvas. Now that I’m dabbling in WebAssembly, plasma seemed to be a perfectly reasonable effect to try out. I chose to tackle it with the Go language to continue to improve my knowledge. I always enjoy learning new languages.

👀 See it in action [here](https://blazorhealthapp.z5.web.core.windows.net/plasma.html)  
🔗 Access the source code [here](https://github.com/JeremyLikness/PlasmaWasmGo/)

## First Attempt: Go All the Way

For my first attempt, I followed the excellent “[The world’s easiest introduction to WebAssembly with Go](https://medium.freecodecamp.org/webassembly-with-golang-is-fun-b243c0e34f02)” tutorial. I took a similar approach and set up everything inside the Go app to perform interop with the HTML DOM. I won’t duplicate the effort here to get started, but in general after you have a current copy of `wasm_exec.js` and some bootstrap code, compiling Go to WASM is as simple as:

`GOOS=js GOARCH=wasm go build -o plasma.wasm plasma.go`

My setup looked like this:

{{<highlight Go>}}
func setup() {

	createSineTable()
	createPalette()

	window = js.Global()
	doc = window.Get("document")
	body = doc.Get("body")

	canvas = doc.Call("createElement", "canvas")
	canvas.Set("height", h)
	canvas.Set("width", w)
	body.Call("appendChild", canvas)

	drawCtx = canvas.Call("getContext", "2d")
}
{{</highlight>}}

This uses the `syscall/js` library (experimental and not supported) to create references back into the HTML and JavaScript world. The palette was built was an array of strings ready to set as fill styles for the canvas.

{{<highlight Go>}}
func createPalette() {
	idx := 0
	for idx < 64 {
		r := idx << 2
		g := 255 - ((idx << 2) + 1)
		color[idx] = "rgb(" + fmt.Sprint(r) + "," + fmt.Sprint(g) + ",0)"
		g = (idx << 2) + 1
		color[idx+64] = "rgb(255," + fmt.Sprint(g) + ",0)"
		r = 255 - ((idx << 2) + 1)
		g = 255 - ((idx << 2) + 1)
		color[idx+128] = "rgb(" + fmt.Sprint(r) + "," + fmt.Sprint(g) + ",0)"
		g = (idx << 2) + 1
		color[idx+192] = "rgb(0," + fmt.Sprint(g) + ",0)"
		idx++
	}
}
{{</highlight>}}

Another method sets up a sine table. This is what produces the plasma cycling effect. It is generated into an array to minimize the overhead of real-time computations.

{{<highlight Go>}}
func createSineTable() {
	idx := 0
	for idx < 512 {
		rad := (float64(idx) * 0.703125) * 0.0174532
		sine[idx] = int(math.Sin(rad) * 1024)
		idx++
	}
}
{{</highlight>}}

The “main loop” is concerned with advancing pointers through the sine table and mapping the palette based on the position. It updates several variables that are part of the global state and cycle through the sine table and palette. For the first attempt, I set the fill style and rendered the pixels directly from Go.

{{<highlight Go>}}
func updatePlasma() {
	tpos4 = 0
	tpos3 = pos3
	idx := 0
	for idx < h {
		tpos1 = pos1 + 5
		tpos2 = 3
		tpos3 &= 511
		tpos4 &= 511
		jdx := 0
		for jdx < w {
			tpos1 &= 511
			tpos2 &= 511
			x := sine[tpos1] + sine[tpos2] + sine[tpos3] + sine[tpos4]
			pidx := (128 + uint8(x>>4))
			drawCtx.Set("fillStyle", color[pidx])
			drawCtx.Call("fillRect", jdx, idx, jdx+1, idx+1)
			tpos1 += 5
			tpos2 += 3
			jdx++
		}
		tpos4 += 3
		tpos3++
		idx++
	}
	pos1 += 9
	pos3 += 8
}
{{</highlight>}}

The last piece is to kick off the application, ensure it always stays loaded, and repeatedly call the update method.

{{<highlight Go>}}
func main() {
	setup()
	plasmaLoop := make(chan bool)
	var renderer js.Func
	renderer = js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		updatePlasma()
		window.Call("setTimeout", renderer)
		return nil
	})
	window.Call("setTimeout", renderer)
	<-plasmaLoop
}
{{</highlight>}}

The `plasmaLoop` is a channel that never clears so everything continues to run. The `renderer` wraps the call to `updatePlasma `in a JavaScript callback that can be passed into `setTimeout `(yes, I am aware this could be `requestAnimationFrame `as well).

I compiled the app to WASM and ran it. The result was dismal. I was able to produce the plasma effect, but it was so slow it looked horrible. It ran far slower than the JavaScript-only version!

## Drawing in JavaScript

My next attempt was to build the pixel buffer in Go, pass it to JavaScript and render it there. First, I moved the JavaScript to a new `plasma.js` file and added this method to parse and render the buffer.

{{<highlight JavaScript>}}
window.plasmaRender = (w, h, ctx, buffer64) => {
    let buffer = atob(buffer64);
    for (let i = 0; i < h; i += 1) {
        for (let j = 0; j < w; j += 1) {
            let base = (i * w + j) * 3;
            ctx.fillStyle = `rgb(${buffer.charCodeAt(base)},${buffer.charCodeAt(base+1)}, ${buffer.charCodeAt(base+2)})`;
            ctx.fillRect(j, i, j + 1, i + 1);
        }
    }
};
{{</highlight>}}

Notice that I can’t accept an array directly (hmmm … or can I? If you know a better way, please weigh in!) so I accept a base-64 encoded string and convert it back to a string. Then I simply iterate the pixels, set the fill style and draw the rectangles.

To pass the array, I changed the colors from string to structures with bytes for the red, green, and blue values (I don’t use blue but have it there in case I ever go back to change the palette) and added a buffer to pass back.

{{<highlight Go>}}
var (
	color [256]struct {
		r, g, b byte
	}
	buffer  [w * h * 3]byte
)
{{</highlight>}}

The palette is populated by setting the values rather than generating strings.

{{<highlight Go>}}
func createPalette() {
	idx := byte(0)
	for idx < 64 {
		r := byte(idx) << 2
		g := byte(255) - ((idx << 2) + 1)
		color[idx].r = r
		color[idx].g = g
		g = (idx << 2) + 1
		color[idx+64].r = 255
		color[idx+64].g = g
		r = 255 - ((idx << 2) + 1)
		g = 255 - ((idx << 2) + 1)
		color[idx+128].r = r
		color[idx+128].g = g
		g = (idx << 2) + 1
		color[idx+192].g = g
		idx++
	}
}
{{</highlight>}}

Instead of calling into JavaScript every pixel, the values are pushed into the buffer.

{{<highlight Go>}}
base := ((idx * w) + jdx) * 3
buffer[base] = color[pidx].r
buffer[base+1] = color[pidx].g
{{</highlight>}}

Finally, the rendering function base-64 encodes the bytes and passes them to the JavaScript function.

{{<highlight JavaScript>}}
renderer = js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		updatePlasma()
		bufferParm := buffer[:]
		pixelBuffer := base64.StdEncoding.EncodeToString(bufferParm)
		window.Call("plasmaRender", w, h, drawCtx, pixelBuffer)
		window.Call("requestAnimationFrame", renderer)
		return nil
	})
{{</highlight>}}

This improved the speed tremendously, but the performance still wasn’t as fluid as I wanted.

## Pixels are Pixels

Part of the performance problem is that the plasma map represents pixels, but I was drawing them using little rectangles. This means the canvas must track every point as an entity to render. Fortunately, there is another way. JavaScript supports an `ImageData `class that is a buffer of pixel information for a bitmap. You can create an instance and populate it. It expects the bytes to represent red, green, blue, and alpha channel, so there are four bytes for every pixel.

Building the buffer is easy. Instead of making it three bytes per pixel, I simply set it to four bytes and always set the alpha channel to its maximum value (255). The Go code passes the array the same way as before, the only change is on the JavaScript side.

The code needs to decompose the base-64 encoded value into an unsigned byte array. It is simple enough to iterate through each byte and populate the target array. Then, the image data is created and drawn in one pass on the canvas.

{{<highlight JavaScript>}}
window.plasmaRender = (w, h, ctx, buffer64) => {
    let bytes = atob(buffer64);
    let buffer = new Uint8ClampedArray(bytes.length);
    for (let i = 0; i < bytes.length; i+=1) {
        buffer[i] = bytes.charCodeAt(i);
    }
    let imageData = new ImageData(buffer, w, h);
    ctx.putImageData(imageData, 0, 0);
};
{{</highlight>}}

The performance for this approach is amazing!

{{<figure src="/blog/2019-03-03_gopher-meet-plasma-a-webassembly-experiment/images/2.gif" caption="The final result" alt="Animation of plasma effect">}}

Only now, I realized my main optimization is in the JavaScript code. So, for an 🍎 to 🍎 comparison, I updated the JavaScript version to use the bitmap approach as well. You can [see for yourself](https://jsfiddle.net/jeremylikness/1xfh3c25/):

{{<jsfiddle "jeremylikness/1xfh3c25">}}

...it performs as well, if not better, than the WASM approach, so there is still work to be done! For now, however, it was a fun way to learn Go, WebAssembly, and dabble in some old school effects.

👀 Watch the live demo [here](https://blazorhealthapp.z5.web.core.windows.net/plasma.html)  
🔗 See the full source code with instructions [here](https://github.com/JeremyLikness/PlasmaWasmGo/)

Regards,

![Jeremy Likness](/blog/2019-03-03_gopher-meet-plasma-a-webassembly-experiment/images/3.gif)
