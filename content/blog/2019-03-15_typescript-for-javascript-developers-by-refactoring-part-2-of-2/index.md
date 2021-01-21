---
title: "TypeScript for JavaScript Developers by Refactoring Part 2 of 2"
author: "Jeremy Likness"
date: 2019-03-15T19:17:09.915Z
years: "2019"
lastmod: 2019-06-13T10:45:39-07:00
comments: true
toc: true
series: "TypeScript for JavaScript Developers"

description: "Learn advanced TypeScript features by refactoring JavaScript to use interfaces, apply type guards, and create aspect-oriented reusable behaviors with experimental decorators."

subtitle: "Advanced concepts like interfaces and decorators are introduced."
tags:
 - Typescript 
 - Javscript 
 - Nodejs 
 - Training 
 - Presentation

image: "/blog/2019-03-15_typescript-for-javascript-developers-by-refactoring-part-2-of-2/images/1.png" 
images:
 - "/blog/2019-03-15_typescript-for-javascript-developers-by-refactoring-part-2-of-2/images/1.png" 
 - "/blog/2019-03-15_typescript-for-javascript-developers-by-refactoring-part-2-of-2/images/2.gif" 

aliases:
    - "/typescript-for-javascript-developers-by-refactoring-part-2-of-2-1efee67003bc"
---

This is the second and last part of a series of steps designed to teach TypeScript by refactoring a JavaScript application. Be sure to read and step through [part one](https://blog.jeremylikness.com/typescript-for-javascript-developers-by-refactoring-part-1-of-2-1c3f97115b1f) if you haven’t already! Here’s a sample of the code we’ll end up with.

{{<figure src="/blog/2019-03-15_typescript-for-javascript-developers-by-refactoring-part-2-of-2/images/1.png" caption="Sample code" alt="Sample code">}}

## 10. Simple Refactoring

To kick off the second half, I start with a simple refactoring. I add a `debugDelay` method to simplify messages I am logging for tracing purposes.

{{<youtube 2Cz3bct8n-U>}}

## 11. Interfaces

Interfaces start to take us into more advanced and unique features of TypeScript. Interfaces don’t exist in generated JavaScript code and help boost productivity during development. Unlike other languages, TypeScript doesn’t treat the interface name as a unique type, but the signature. Two differently named interfaces with the same set of properties and/or functions are the same interface. Learn how to define and apply an interface.

{{<youtube EUGNhz7y5TQ>}}

🔗[Learn more about interfaces](http://www.typescriptlang.org/docs/handbook/interfaces.html?utm_source=jeliknes&utm_medium=blog&utm_campaign=tsforjs&WT.mc_id=tsforjs-blog-jeliknes)

## 12. Recursive Print

The interface is extended to include an optional property. Create a generic function that takes any item that implements `ICanPrint` and recursively calls `print()` on the item and the function on its children (if they exist). A read-only property is implemented using a “getter” on the `ContactList` class, then the code is refactored to use the recursive print function.

{{<youtube rSER94B3Uyg>}}

🔗 [Learn more about optional parameters in interfaces](http://www.typescriptlang.org/docs/handbook/interfaces.html?utm_source=jeliknes&utm_medium=blog&utm_campaign=tsforjs&WT.mc_id=tsforjs-blog-jeliknes#optional-properties)  
🔗 [Learn more about accessors (getters and setters)](http://www.typescriptlang.org/docs/handbook/classes.html?utm_source=jeliknes&utm_medium=blog&utm_campaign=tsforjs&WT.mc_id=tsforjs-blog-jeliknes#accessors)

## 13. Format the Print Output

A few helper functions format the print by making it possible to pass a property and output a label with its corresponding value. The code is refactored to use the new functions and a new defect appears; name is no longer printing and shows as `undefined`. Fortunately, TypeScript is ready to fix it in the next iteration.

{{<youtube 1n2cvHyuA50>}}

## 14. Key Types to the Rescue

TypeScript supports a special convention `keyof` (called an “index type”) that will inspect the signature of a class or interface, then create a list of allowed string values based on that signature. In this step, a custom key type is created for properties of `IAmContact`. This immediately reveals the defect and provides an auto-completion suggestion to fix it.

{{<youtube tJrF1l6by60>}}

🔗 [Learn more about index types](https://www.typescriptlang.org/docs/handbook/advanced-types.html?utm_source=jeliknes&utm_medium=blog&utm_campaign=tsforjs&WT.mc_id=tsforjs-blog-jeliknes#index-types)

## 15. Type Guards

Type guards are another extremely useful feature that help improve productivity and catch errors before the JavaScript is even compiled. They allow you to specify tests that determine the type of a variable and allow the compiler to understand the characteristics of the variable when the test succeeds. This enables auto-completion and catches errors based on accessing properties or methods that aren’t part of that type.

{{<youtube QIE1rZJoXJM>}}

🔗 [Learn more about type guards](https://www.typescriptlang.org/docs/handbook/advanced-types.html?utm_source=jeliknes&utm_medium=blog&utm_campaign=tsforjs&WT.mc_id=tsforjs-blog-jeliknes#type-guards-and-differentiating-types)

## 16. Strict Types

At the start of the project, “strict types” was turned off to avoid several errors introduced after migrating the JavaScript app over. Enough refactoring has been done that this can get switched on without any errors. A new method is added that takes and age to compute “year born” … but that’s not the point. It sets up the next step that has some truly powerful features to show.

{{<youtube 89IkjFMXmfM>}}

## 17. Type Decorators

Decorators are one of the most powerful aspects of TypeScript. They enable aspect-oriented development. You can create a piece of functionality, or a “behavior”, and apply that behavior to code using attributes. If you’ve done any [Angular](https://angular.io/) development, decorators are used extensively in the framework. See how to build and apply your own decorator in this step.

{{<youtube sgAa9NHShGw>}}

🔗 [Learn more about decorators](https://www.typescriptlang.org/docs/handbook/decorators.html?utm_source=jeliknes&utm_medium=blog&utm_campaign=tsforjs&WT.mc_id=tsforjs-blog-jeliknes)

## 18. Compilation Targets

I love that TypeScript keeps me current with the latest JavaScript versions by keeping pace with updated specifications. I can use new language features, and they are translated to legacy JavaScript when I target old versions, or “passed through” when I am writing for modern browsers. See this in action!

{{<youtube 6ozpF7Of7Do>}}

## The End

That’s it for this series. I hope by using JavaScript as a starting point, I was able to convey:

* How it works in the TypeScript world
* The flexibility of TypeScript
* The benefits TypeScript brings including finding and auto-suggesting fixes for common defects _before your code reaches production_

I’m curious to hear your thoughts and feedback, so please feel comfortable sharing them in the comments below!

Regards,

![Jeremy Likness](/blog/2019-03-15_typescript-for-javascript-developers-by-refactoring-part-2-of-2/images/2.gif)
