---
title: "Client-side JavaScript Databinding without a Framework"
author: "Jeremy Likness"
date: 2019-11-27T10:47:18-08:00
years: "2019"
lastmod: 2019-11-27T10:47:18-08:00

draft: false
comments: true
toc: true
series: "Vanilla.js"

subtitle: "This module brought to you by Vanilla.js"

description: "A simple look at how databinding works with a pure JavaScript implementation."

tags:
 - JavaScript 
 - Vanilla.js
 - Databinding 

image: "/blog/client-side-javascript-databinding-without-a-framework/images/data-binding-example.png" 
images:
 - "/blog/client-side-javascript-databinding-without-a-framework/images/data-binding-example.png" 
 - "/blog/client-side-javascript-databinding-without-a-framework/images/DataBinding.gif" 
---
Recently I've been thinking a lot about the capabilities of pure JavaScript. It is a language that has evolved significantly over the last few years. Many popular libraries (such as module loaders) and frameworks (like Angular, Vue.js and React) were created to address deficiencies and gaps that existed in the original, outdated implementation. With [ECMAScript 6 / 2015](https://www.w3schools.com/Js/js_es6.asp) I believe  that most of those limitations have gone away. Many important features exist out of the box, such as:

- Support for [modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export) and dynamic loading
- The ability to intercept and manage routes
- A built-in [DOM query mechanism](https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelector) that obviates the need for jQuery
- Native [template](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template) support
- Re-usable [web components](https://developer.mozilla.org/en-US/docs/Web/Web_Components)

I've written about the "3 D's" of modern web development in the past:

{{<relativelink "/blog/2016-04-24_three-ds-of-modern-web-development">}}

The one feature that is not fully supported natively by the latest JavaScript versions is _databinding_. But how hard is it to implement? If your only motivation for using a heavy framework is databinding support, you may be surprised! Let's roll up our sleeves and try it out.

![Databinding example](/blog/client-side-javascript-databinding-without-a-framework/images/DataBinding.gif)

## Observing Changes

The first thing needed is the ability to observe changes. This is easily implemented by an `Observable` class. The class needs to do three things:

1. Keep track of a value
2. Allow listeners to subscribe to changes
3. Notify listeners when the value mutates

Here is a simple implementation:

{{<highlight JavaScript>}}
class Observable {

  constructor(value) {
    this._listeners = [];
    this._value = value;
  }

  notify() {
    this._listeners.forEach(listener => listener(this._value));
  }

  subscribe(listener) {
    this._listeners.push(listener);
  }

  get value() {
    return this._value;
  }

  set value(val) {
    if (val !== this._value) {
      this._value = val;
      this.notify();
    }
  }
}
{{</highlight>}}

This simple class, taking advantage of built-in class suport (no [TypeScript](/tags/typescript) required!) handles everything nicely. Here is an example of our new class in use that creates an observable, listens for changes, and logs them out to the console.

{{<highlight JavaScript>}}
const name = new Observable("Jeremy");
name.subscribe((newVal) => console.log(`Name changed to ${newVal}`));
name.value = "Doreen";
// logs "Name changed to Doreen" to the console
{{</highlight>}}

That was easy, but what about computed values? For example, you may have an output property that depends on multiple inputs. Let's assume we need to track first name and last name so we can expose a property for the full name. How does that work?

## Computed Values ("Observable Chains")

It turns out that with JavaScript's support for inheritance, we can extend the `Observable` class to handle computed values as well. This class needs to do some extra work:

1. Keep track of the function that computes the new property
2. Understand the dependencies, i.e. the observed properties the computed property depends on
3. Subscribe to changes in dependencies so the computed property can be re-evaluated

This class is a bit easier to implement:

{{<highlight JavaScript>}}
class Computed extends Observable {
  constructor(value, deps) {
    super(value());
    const listener = () => {
      this._value = value();
      this.notify();
    }
    deps.forEach(dep => dep.subscribe(listener));
  }

  get value() {
    return this._value;
  }

  set value(_) {
    throw "Cannot set computed property";
  }
}
{{</highlight>}}

This takes the function and dependencies and seeds the initial value. It listens for dependent changes and re-evaluates the computed value. Finally, it overrides the setter to throw an exception because it is read-only (computed). Here it is in use:

{{<highlight JavaScript>}}
const first = new Observable("Jeremy");
const last = new Observable("Likness");
const full = new Computed(() => `${first.value} ${last.value}`.trim(), [first, last]);
first.value = "Doreen";
console.log(full.value);
// logs "Doreen Likness" to the console
{{</highlight>}}

Now we can track our data, but what about the HTML DOM?

## Bi-directional Databinding

For bi-directional databinding, we need to initialize a DOM property with the observed value and update it when that value changes. We also need to detect when the DOM updates, so the new value is relayed to data. Using built-in DOM events, this is what the code looks like to set-up two-way databinding with an input element:

{{<highlight JavaScript>}}
const bindValue = (input, observable) => {
    input.value = observable.value;
    observable.subscribe(() => input.value = observable.value);
    input.onkeyup = () => observable.value = input.value;
}
{{</highlight>}}

Doesn't seem to difficult, does it? Assuming I have an input element with the `id` attribute set to `first` I can wire it up like this:

{{<highlight JavaScript>}}
const first = new Observable("Jeremy");
const firstInp = document.getElementById("first");
bindValue(firstInp, first);
{{</highlight>}}

This can be repeated for the other values.

> <i class="fa fa-lightbulb"></i> **Tip:** This is, of course, a simple example. You may have to convert values if you are expecting numeric inputs and write different handlers for elements like radio lists, but the general concept remains the same.

Going back to the "3 D's" it would be nice if we could minimize code-behind and databind declaratively. Let's explore that.

## Declarative Databinding

The goal is to avoid having to load elements by their id, and instead simply bind them to observables directly. I chose a descriptive attribute for the task and called it `data-bind`. I declare the attribute with a value that points to a property on some context, so it looks like this:

{{<highlight html>}}
<label for="firstName">
  <div>First Name:</div><input type="text" data-bind="first" id="firstName" />
</label>
{{</highlight>}}

To wire things up, I can reuse the existing `dataBind` implementation. First, I set a context to bind to. Then, I configure the context and apply the bindings.

{{<highlight JavaScript>}}
const bindings = {};

const app = () => {
  bindings.first = new Observable("Jeremy");
  bindings.last = new Observable("");
  bindings.full = new Computed(() => 
      `${bindings.first.value} ${bindings.last.value}`.trim(), 
      [bindings.first, bindings.last]);
  applyBindings();
};

setTimeout(app, 0);
{{</highlight>}}

The `setTimeout` gives the initial rendering cycle time to complete. Now I implement the code to parse the declarations and bind them:

{{<highlight JavaScript>}}
const applyBindings = () => {
	document.querySelectorAll("[data-bind]").forEach(elem => {
  	const obs = bindings[elem.getAttribute("data-bind")];
    bindValue(elem, obs);
  });
}
{{</highlight>}}

The code grabs every tag with a `data-bind` attribute, uses it as an index to reference the observable on the context, then calls the `dataBind` operation.

That's it. We're done. Here's the full implementation:

{{<jsfiddle "jeremylikness/o8sg7wy5">}}

[Click here](https://jsfiddle.net/jeremylikness/o8sg7wy5) to open the full code example.

## Side Note: Evaluation Contexts

Databinding isn't always as simple as pointing to the name of an observable. In many cases, you may want to evaluate an expression. It would be nice if you could constrain the context so the expression doesn't clobber other expressions or perform unsafe operations. That, too, is possible. Consider the expression `a+b`. There are a few ways to constrain it "in context." The first, and least safe, is to use `eval` in a specific context. Here is sample code:

{{<highlight JavaScript>}}
const strToEval = "this.x = this.a + this.b";
const context1 = { a: 1, b: 2 };
const context2 = { a: 3, b: 5 };
const showContext = ctx => console.log(`x=${ctx.x}, a=${ctx.a}, b=${ctx.b}`);
const evalInContext = (str, ctx) => (function (js) { return eval(js); }).call(ctx, str);
showContext(context1);
// x=undefined, a=1, b=2
showContext(context2);
// x=undefined, a=3, b=5
evalInContext(strToEval, context1);
evalInContext(strToEval, context2);
showContext(context1);
// x=3, a=1, b=2
showContext(context2);
// x=8, a=3, b=5
{{</highlight>}}

This allows the context to be mutated but has several flaws. The convention of using `this` is awkward and there are many potential security exploits. Just add a `window.location.href=` statement and you get the point. A safer method is to only allow evaluations that return values, then wrap them in a dynamic function. The following code does the trick, with no navigation side effects:

{{<highlight JavaScript>}}
const strToEval = "a + b; window.location.href='https://blog.jeremylikness.com/';";
const context1 = { a: 1, b: 2 };
const context2 = { a: 3, b: 5 };
const evalInContext = (str, ctx) => (new Function(`with(this) { return ${str} }`)).call(ctx);
console.log(evalInContext(strToEval, context1));
// 3
console.log(evalInContext(strToEval, context2));
// 8
{{</highlight>}}

With this little trick you can safely evaluate expressions in a specific context.

## Conclusion

I'm not against frameworks. I've built some incredibly large enterprise web applications that were successful largely due to the benefits we gained from using frameworks like Angular. However, it is important to keep pace with the latest native advancements and not look at frameworks as the "golden tool" that can solve every problem. Relying on frameworks means exposing yourself to overhead via setup, configuration, and maintenance, risk security vulnerabilities, and, in many cases, deploy large payloads. You have to hire talent familiar with the nuances of that framework or train them on it and keep pace with updates. Understanding native code may just save you a build process and enable scenarios that "just work" in modern browsers without a lot of code.

As always, I welcome your feedback, thoughts, comments, and questions.

Regards,

![Jeremy Likness](/images/jeremylikness.gif)