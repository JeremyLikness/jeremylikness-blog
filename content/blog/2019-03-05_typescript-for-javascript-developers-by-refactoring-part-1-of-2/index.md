---
title: "TypeScript for JavaScript Developers by Refactoring Part 1 of 2"
author: "Jeremy Likness"
date: 2019-03-05T18:57:22.675Z
years: "2019"
lastmod: 2019-06-13T10:45:36-07:00
comments: true
toc: true
series: "TypeScript for JavaScript Developers"

description: "Learn TypeScript by taking a journey refactoring an existing JavaScript application. Step by step, with short 1–2 minute video clips, you discover the immediate benefits of using TypeScript."

subtitle: "Learn TypeScript by taking an existing JavaScript application and migrating it to TypeScript."
tags:
 - JavaScript 
 - Typescript 
 - Web Development 
 - Nodejs 

image: "/blog/2019-03-05_typescript-for-javascript-developers-by-refactoring-part-1-of-2/images/1.jpeg" 
images:
 - "/blog/2019-03-05_typescript-for-javascript-developers-by-refactoring-part-1-of-2/images/1.jpeg" 
 - "/blog/2019-03-05_typescript-for-javascript-developers-by-refactoring-part-1-of-2/images/2.gif" 


aliases:
    - "/typescript-for-javascript-developers-by-refactoring-part-1-of-2-1c3f97115b1f"
---

I created a repository with the goal of teaching TypeScript to JavaScript developers.

> This is a two-part series. You can [jump to part 2](https://blog.jeremylikness.com/typescript-for-javascript-developers-by-refactoring-part-2-of-2-1efee67003bc).

Imagine if you could use a tool that finds defects for you automatically and makes it easier to squash bugs before they make it to production! This walk through demonstrates how.

{{<github "JeremyLikness/TypeScript-from-JavaScript">}}

The repository contains documentation paired with several commits to walk through the process. If you’re a hands-on person and want to dive in, visit the repository and get started right now! I recorded a companion video series to guide you through each step.

{{<figure src="/blog/2019-03-05_typescript-for-javascript-developers-by-refactoring-part-1-of-2/images/1.jpeg" caption="TypeScript logo" alt="TypeScript logo">}}

Each video is only a few minutes long so feel free to bookmark this page and come back often. You may have already found these videos from my Twitter thread.

{{<customtwitter 1096203599946801152>}}

## 1. Introduction

In this step I introduce a simple JavaScript app that doesn’t behave properly when run with Node.js. I begin the migration to TypeScript by adding the TypeScript compiler, initializing its configuration, and renaming the `index.js` file to `index.ts`.

{{<youtube 6FEakIehnls>}}

> Note: an alternative way to initialize TypeScript’s configuration file is to use the `npx` command, like this: `npx tsc --init`

## 2. Configuration and the Spread (Rest) Operator

The TypeScript configuration is updated to turn off the requirement for strict typing. This removes all errors but one. The error happens to be a bug that was discovered by TypeScript. To fix the defect, a “spread operator” is used to allow a list of parameters to be passed in and parsed as an array. Because the older version of JavaScript doesn’t support the spread operator, TypeScript automatically generates the compatible code. This fix improves the application, but a few defects remain.

{{<youtube 1GJy74OwOzc>}}

🔗 [Learn more about the] (https://jlik.me/e63)`[tsconfig.json](https://jlik.me/e63)` [file](https://jlik.me/e63)  
🔗 [Learn more about “rest parameters”](https://jlik.me/e64)

## 3. Classes and Types

A major benefit of using TypeScript, as you may be able to guess from the name, is the ability to use classes and types. I refactor the code to use classes instead of function constructors and annotate the properties with types. This immediately uncovers another bug for us that will be easy to fix in the next step.

{{<youtube WXbOjEkoPDA>}}

🔗 [Learn more about basic types](https://jlik.me/e65)  
🔗 [Learn more about classes](https://jlik.me/e66)

## 4. Custom Types

The class refactoring revealed a property that wasn’t named consistently. This is fixed by updating the constructor function to match the names use in other code. Next, a custom type is defined that declares the two possible string values for `contactType`: `mobile` and `home`. This reveals a defect that, when fixed, corrects the phone display logic.

{{<youtube 0wpWbEKUge8>}}

🔗 [Learn more about custom types](https://jlik.me/e67)

## 5. Scope and the “let” Keyword

A bug has surfaced due to the way variables are captured in scope in JavaScript. Rather than wrap the call with additional code that adds complexity, a simple change is to specify the variable with `let`. The TypeScript compiler then knows to manage scope for older versions of JavaScript and passes through to modern implementations.

{{<youtube gXZq-CzzPo0>}}

🔗 [Learn more about let declarations](https://jlik.me/e9e)

## 6. Lambda Expressions

Anyone familiar with JavaScript has encountered the issue of understanding exactly what `this` is. By default, scope is at a function level, so `this.x` has a different meaning in a nested function. Lambda expressions not only simplify the definition of functions, but also capture outer scope for a consistent hierarchy of variable access.

{{<youtube 8boMVNdXXkU>}}

🔗 [Learn more about “this” and arrow functions](https://jlik.me/fa9)

## 7. String Templates

In TypeScript, as with modern JavaScript, you can use string templates for interpolation. This gives you a cleaner way to embed variables and evaluate expressions for output. TypeScript will turn it into string concatenation for older JavaScript versions and leverage the new syntax for modern targets.

{{<youtube 2VTJO8YP6fM>}}

🔗 [Learn more about string templates](https://jlik.me/fbf)

## 8. Generic Types

Generics, or “generic types” are a development/compile-time feature that I like to think of as syntax to implement the strategy pattern. It involves building a template for a type that opens a new world of possibilities when the type is resolved. The resulting JavaScript doesn’t contain any notation or syntax, but as you will see in this video the use of generics can help quickly capture and fix defects before they are sent to production.

{{<youtube R4gkIzZitOE>}}

🔗 [Learn more about generics](https://jlik.me/fcd)

## 9. Custom Types with Generics

To simplify the code, a custom type is created that uses generics to define a predicate. You can think of a predicate as a test. Given an item `T` it returns either `true` or `false`. This type can then be used to define the second parameter in the `find` function. The result? Source code that is easier to read and maintain with no changes to the generated JavaScript.

{{<youtube 9vs-LgJlfHQ>}}

## Summary

This concludes part one. Hopefully by now you feel comfortable with TypeScript and can see some of its immediate benefits. [Part Two](https://blog.jeremylikness.com/typescript-for-javascript-developers-by-refactoring-part-2-of-2-1efee67003bc) tackles more advanced concepts, including interfaces, “key types,” type guards, strict typing, type decorators and what happens when you target different versions of JavaScript.

▶ [Continue to part two](https://blog.jeremylikness.com/typescript-for-javascript-developers-by-refactoring-part-2-of-2-1efee67003bc)

Regards,

![Jeremy Likness](/blog/2019-03-05_typescript-for-javascript-developers-by-refactoring-part-1-of-2/images/2.gif)
