---
title: "Build a Single Page Application (SPA) Site With Vanilla.js"
author: "Jeremy Likness"
date: 2020-02-21T09:06:36-08:00
years: "2020"
lastmod: 2020-02-21T09:06:36-08:00

draft: true
comments: true
toc: true
series: "Vanilla.js"

subtitle: "The one framework you don't have to install"

description: "Modern JavaScript has all of the capabilities and features necessary to build a complete Single Page Application (SPA) experience without relying on a framework. Learn how to use the latest language features like modules and web components to handle templates, animation, routing and databinding."

tags:
 - Vanilla.js 
 - JavaScript
 - Databinding
 - Web Components 

image: "/blog/build-a-spa-site-with-vanillajs/images/vanillin.png" 
images:
 - "/blog/build-a-spa-site-with-vanillajs/images/vanillin.png" 
---
Modern JavaScript frameworks exist to address deficiencies in the capabilities provided out of the box by HTML5, JavaScript, CSS, and WebAssembly. The latest stable version of JavaScript evolved significantly compared to earlier versions, with better control over scope, powerful string manipulation capabilities, destructuring, parameter enhancements, and the built-in implementation of classes and modules (there is no longer a need to use IIFEs or immediately-invoked function expressions). The purpose of this post is to explore how to build modern apps using the latest JavaScript features.

![Vanillin molecule](/blog/build-a-spa-site-with-vanillajs/images/vanillin.png)

## The Project

I implemented a Single Page Application (SPA) app based completely on pure JavaScript ("Vanilla.js"). It includes routing (you can bookmark and navigate pages), databinding, reusable web components and uses JavaScript's native module functionality. You can run and install the application (it is a Progressive Web App or PWA) here:

<i class="fas fa-external-link-alt"></i> [https://jlik.me/vanilla-js](https://jlik.me/vanilla-js)

The source code repository is available here:

{{<github "JeremyLikness/vanillajs-deck">}}

If you open `index.html` you'll notice a script is included with a special type of "module":

{{<highlight html>}}
<script type="module" src="./js/app.js"></script>
{{</highlight>}}

The module simply imports and activates web components from several other modules.

## Modules

Native JavaScript modules are similar to ordinary JavaScript files with a few key differences. They should be loaded with the `type="module"` modifier. Some developers prefer to use the `.mjs` suffix to distinguish them from other JavaScript source, but that is not necessarily. Modules behave a differently in a few ways:

* By default, they are parsed and executed in "strict mode"
* Modules can provide _exports_ to be consumed by other modules
* Modules can _import_ variables, functions, and objects from child modules
* Modules operate in their own scope and don't have to be wrapped in immediately-invoked function expressions

There are four steps in the lifecycle of a module.

1. First, the module is parsed and validated
2. Second, the module is loaded
3. Third, related modules are linked based on their imports and exports
4. Finally, modules are executed

Any code not wrapped in a function is executed immediately in step 4.

This is what the parent level `app.js` module looks like:

{{<highlight JavaScript>}}
import { registerDeck } from "./navigator.js"
import { registerControls } from "./controls.js"
import { registerKeyHandler } from "./keyhandler.js"

const app = async () => {
    registerDeck();
    registerControls();
    registerKeyHandler();
};

document.addEventListener("DOMContentLoaded", app);
{{</highlight>}}

Taking a step back, the overall structure or hierarchy of the application looks like this:

{{<highlight text>}}
app.js 
-- navigator.js 
   -- slideLoader.js
      .. slide.js ⤵
   -- slide.js
      -- dataBinding.js
         -- observable.js
   -- router.js
   -- animator.js
-- controls.js
   .. navigator.js ⤴
-- keyhandler.js
   .. navigator.js ⤴
{{</highlight>}}

This post will explore the module from the bottom-up, starting with modules that don't have dependencies and working our way up to the `navigator.js` web component.

## Observable

The `observable.js` module contains a simple implementation of the observer pattern. A class wraps a value and notifies subscribers when the value changes. A computed observable is available that can handle values derived from other observables (for example, the result of an equation where the variables are being observed). I covered this implementation in depth in the previous article:

{{<relativelink "/blog/client-side-javascript-databinding-without-a-framework">}}

## Databinding

The databinding module provides databinding services to the application. 

## Slide and Slide Loader

## Router

## Animator

## Navigator

## Key Handler

## Controls

## Conclusion
