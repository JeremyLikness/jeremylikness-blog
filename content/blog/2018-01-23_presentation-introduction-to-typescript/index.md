---
title: "Presentation: Introduction to TypeScript"
author: "Jeremy Likness"
date: 2018-01-23T13:49:03.335Z
years: "2018"
lastmod: 2019-06-13T10:44:39-07:00
comments: true

description: "Recap of presentation with full source code repository and interactive presentation introducing TypeScript to JavaScript developers."

subtitle: "A gentle introduction for JavaScript Developers"
tags:
 - JavaScript 
 - Typescript 
 - Web Development 

image: "/blog/2018-01-23_presentation-introduction-to-typescript/images/1.png" 
images:
 - "/blog/2018-01-23_presentation-introduction-to-typescript/images/1.png" 
 - "/blog/2018-01-23_presentation-introduction-to-typescript/images/2.gif" 


aliases:
    - "/presentation-introduction-to-typescript-a655df16c8e6"
---

Last night, I kicked off 2018 with my [first talk](https://www.meetup.com/AtlantaJavaScript/events/245257740/) of the year for the [Atlanta JavaScript Meetup group](https://www.meetup.com/AtlantaJavaScript). This is a great group I’ve been involved with for several years now. I named the talk “Introduction to TypeScript (for JavaScript Developers).”

* <i class="fab fa-github"></i> [GitHub repository with code samples](https://github.com/JeremyLikness/intro-to-typescript)
* 👀 [Online interactive presentation](https://jeremylikness.github.io/intro-to-typescript/presentation/intrototypescript.html#/)

Special thanks to [Women who Code Atlanta](https://www.womenwhocode.com/atl) for choosing this talk as their first field trip!

{{<customtwitter 955467086213582848>}}

Scores of enthusiastic developers braved rain and Atlanta traffic to attend the talk.

{{<customtwitter 955598202530664448>}}

As with most my of my talks ([Conferences - Collection](https://kuula.co/explore/collection/7fy4R)), I asked for a little audience partition to create a 360 degree photo. Here is the [Creative Circus venue](https://creativecircus.edu/) in full three-dimensional surround.

{{<kuula 7ldkd>}}
<figcaption>…and the crowd goes wild! Or at least, the speaker does!</figcaption>

Because my camera was mounted a little low, here is another perspective.

{{<customtwitter 955602128113987585>}}

I started with a brief exercise around the nuances of JavaScript, looking at expressions that evaluate to … [WAT?!](https://jeremylikness.github.io/intro-to-typescript/presentation/intrototypescript.html#/3) You can click the button to evaluate the expression and puzzle over the results.

> Special credit to [Gary Bernhardt](https://twitter.com/garybernhardt) for the idea — if you haven’t seen his video, [check it out](https://www.destroyallsoftware.com/talks/wat) now.

I talked briefly about the evolution of JavaScript over time.

![The evolution of JavaScript](/blog/2018-01-23_presentation-introduction-to-typescript/images/1.png)
<figcaption>The evolution of JavaScript</figcaption>

The presentation includes examples across a variety of TypeScript features. It was fun to show, for example, how constructs like `class`, `let`, and the _spread operator_ (`…`) compile to legacy code for older versions of JavaScript but “pass through” unchanged when the target is ECMAScript 2015. I also added some sections with advanced features, such as how to <i class="fab fa-github"></i> [build and apply decorators](https://github.com/JeremyLikness/intro-to-typescript/blob/master/samples/008-decorators.ts).

If you haven’t had the chance to review some of the latest features, they are pretty amazing. For example, did you know you can apply value constraints to variables? Take a look at the following code:

{{<highlight TypeScript>}}
type Awesomeness = "Low" | "Medium" | "High";

interface Advocate {
    name: string;
    twitter: string;
    awesome: Awesomeness;
}

var advocate: Advocate = { name: "Jeremy Likness", twitter: "@JeremyLikness", awesome: "High" };
// var advocate: Advocate = { name: "John Papa", twitter: "@John_Papa", awesome: "Unmeasurable" };
{{</highlight>}}

For all practical purposes, the `awesome` property is a string, but it’s been constrained to only three possible values. If I try to run the “John Papa” code, it will fail because “unmeasurable” is not an allowed value. To build upon that idea, check this out:

{{<highlight TypeScript>}}
type AdvocateProperty = keyof Advocate;

const getProperty = (adv: Advocate, key: AdvocateProperty) => adv[key];
console.log(getProperty(advocate, "twitter"));
//console.log(getProperty(advocate, "linkedin"));
{{</highlight>}}

`AdvocateProperty` is also a string, but the list of potential values is taken from the type information for `Advocate`. Constraining values to known property names is useful when you implement functions like `getProperty` that allow you to fetch properties from an object based on their key (string) value. Using the special `keyof `statement, the possible values are now constrained to known properties on the type, so the attempt to fetch a key of “linkedin” will not compile. Imagine how much extra safety this provides for various library and framework implementations!

The last cool feature I’d like to highlight is type guards. Consider the following code:

{{<highlight TypeScript>}}
// explicit type guard
const isNumber = (inp: any): inp is number => {
    console.log(`inp: ${inp} typeof inp: ${typeof inp}`);
    return typeof inp === "number";
}

var test:any = 5;
console.log(test.toFixed(0)); // no intellisense
if (isNumber(test)) {
    console.log(test.toFixed(0)); // intellisense
}
{{</highlight>}}

Because “test’ is declared as type `any`, the IDE doesn’t provide hints or auto-completion when you reference it. It doesn’t make sense to show methods that could be part of any type, class, or function. However, the `isNumber` method has a type guard declared: `inp is number`. Because of this, the TypeScript engine knows that inside the scope of the `if` condition the type _must_ be `number`. It’s the only way it can pass the test! Therefore it provides auto-completion for numeric functions and properties in that scope. This is the same concept using an implicit type guard:

{{<highlight TypeScript>}}
var secret:any = "my secret";
console.log(secret.charAt(0)); // no intellisense
if (typeof secret === "string") { // implicit type guard
    console.log(secret.charAt(0)); // intellisense
}
{{</highlight>}}

You can view many more examples in the actual presentation content:

* <i class="fab fa-github"></i> [GitHub repository with code samples](https://github.com/JeremyLikness/intro-to-typescript)
* 👀 [Online interactive presentation](https://jeremylikness.github.io/intro-to-typescript/presentation/intrototypescript.html#/)

Here is the full video of the presentation!

{{<youtube kxkzbMCc8Gg>}}

In conclusion, I give special thanks to the organizers and attendees of the event. It was a great way to kick off 2018!

Regards,

![JeremyLikness](/blog/2018-01-23_presentation-introduction-to-typescript/images/2.gif)
