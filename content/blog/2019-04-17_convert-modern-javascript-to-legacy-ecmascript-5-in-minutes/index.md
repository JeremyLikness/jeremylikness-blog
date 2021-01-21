---
title: "Convert Modern JavaScript to Legacy (ECMAScript 5) in Minutes"
author: "Jeremy Likness"
date: 2019-04-17T17:19:54.142Z
years: "2019"
lastmod: 2019-06-13T10:45:44-07:00
comments: true
series: "Vanilla.js"

description: "Learn how to use TypeScript to convert and transform modern JavaScript to legacy ECMAScript 5."

subtitle: "Use TypeScript to bring your New JavaScript to Old Browsers"
tags:
 - JavaScript 
 - Typescript 
 - Ecmascript 5 

image: "/blog/2019-04-17_convert-modern-javascript-to-legacy-ecmascript-5-in-minutes/images/1.png" 
images:
 - "/blog/2019-04-17_convert-modern-javascript-to-legacy-ecmascript-5-in-minutes/images/1.png" 
 - "/blog/2019-04-17_convert-modern-javascript-to-legacy-ecmascript-5-in-minutes/images/2.gif" 

aliases:
    - "/convert-modern-javascript-to-legacy-ecmascript-5-in-minutes-464b3d75f01f"
---

I recently posted a “quick start” guide for building Single Page Apps using the “Vanilla” JavaScript framework:

{{<relativelink "/blog/2019-04-09_vanilla.jsgetting-started">}}

It is intended as a bit of a parody and mimics the quick start of a very popular framework. I’m not trying to state that all frameworks are bad, but it is important to point out how far the JavaScript language specification has evolved. It illustrates what is possible without loading third-party frameworks or involving complicated build processes.

{{<figure src="/blog/2019-04-17_convert-modern-javascript-to-legacy-ecmascript-5-in-minutes/images/1.png" caption="The Vanilla.js App" alt="The Vanilla.js App">}}

I quickly received a comment about whether it is practical to assume clients will have the latest JavaScript. The answer is, “it depends.” Most consumers are on the latest engines because phone and desktop browsers auto-update. It is corporate environments that pose the greatest risk, as they may in some cases be “locked down” into older browser versions.

If you find yourself in this predicament, it _is_ possible to take modern JavaScript and compile it to legacy browsers. This post walks through the process.

> **Note:** the code “as is” uses the new [fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) to load data from a test endpoint. Like the older [XMLHttpRequest API](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest), this is not a language feature but a browser feature that is exposed to JavaScript. This post covers converting modern JavaScript code to ECMAScript 5, not handling browser differences outside of the JavaScript version that is supported.

## Setup

Prerequisites are [git](https://git-scm.com/downloads) and [node.js](https://nodejs.org/) (with npm).

First, clone the repository.

[<i class="fab fa-github"></i> JeremyLikness/VanillaJs](https://github.com/jeremylikness/VanillaJs)

`git clone https://github.com/jeremylikness/VanillaJs.git`

Open `plain\index.html` in your browser to verify it is working. This is the modern version. Make a new directory named `legacy` and copy all three files from `plain` into it. Navigate into your legacy directory.

Initialize a node project.

`npm init -y`

Install TypeScript.

`npm install typescript --save-dev`

Initialize the TypeScript configuration.

`npx tsc --init`

Edit the generated `tsconfig.json` file so that the property `strict` is set to `false`. Make sure that the `target` is `es5` (this should be the default) so you generate legacy code.

## Transform

Next, you’ll transform the JavaScript to TypeScript.

Change the file extension from `.js` to `.ts`. If you’re using an IDE, like the free cross-platform [Visual Studio Code](https://code.visualstudio.com/?WT.mc_id=medium-blog-jeliknes), you’ll notice a few errors. There are two things necessary to finish the transformation.

First, in the constructor for the `Wrapper` class, add the keyword `public` to each of the parameters. This informs TypeScript they are valid properties on the class. The updated constructor should look like this:

`constructor(public element, public text, public display = true) {`

Next, fix the collision between the static `generate` methods by renaming the one on `AnchorWrapper` to `generateAnchor`:

`static generateAnchor(href, text, target = “_blank”) {`

To use the newly renamed method, search and replace the two instances of `AnchorWrapper.generate` with `AnchorWrapper.generateAnchor`.

The last step is to compile the TypeScript to JavaScript.

`npx tsc`

That’s it! You should be able to open the `index.html` file in your `legacy` directory and see the app running successfully. Look at the generated `app.js` code to see how much has changed from earlier versions of JavaScript! You can use this same process to convert your other JavaScript projects by taking advantage of the fact that TypeScript is a superset of JavaScript dialects.

Regards,

![Jeremy Likness](/blog/2019-04-17_convert-modern-javascript-to-legacy-ecmascript-5-in-minutes/images/2.gif)
