---
title: "Dependency Injection in Javascript 101"
author: "Jeremy Likness"
date: 2019-01-02T13:12:08-07:00
years: "2019"
lastmod: 2019-01-02T13:12:08-07:00
draft: false
comments: false
toc: false
canonicalUrl: "https://dev.to/azure/dependency-injection-in-javascript-101-2b1e"

subtitle: "A primer on what dependency injection is and why it is useful in JavaScript."

description: "Large JavaScript projects may have dozens or even hundreds of related components interacting with each other. Managing dependencies between components can become incredibly complex if you aren't taking advantage of dependency injection. Learn what DI is and how to implement it with a simple reference application."

tags:
 - JavaScript 
 - Dependency injection 

image: "/blog/dependency-injection-in-javascript-101/images/dependencyinjection.png" 
images:
 - "/blog/dependency-injection-in-javascript-101/images/dependencyinjection.png" 
 - "/blog/dependency-injection-in-javascript-101/images/sampleoutput.png" 
---
In my article and presentation "The 3 D's of Modern Web Development" I explain what I believe are critical elements for success in modern JavaScript frameworks.

> *Wait, you didn't see my presentation?* That's OK ... when you have just under an hour of time to invest, I believe you will receive value by watching it <i class="fab fa-vimeo"></i> [here](https://www.recallact.com/presentation/three-ds-modern-web-development). 

![What/Why/How Dependency Injection?](/blog/dependency-injection-in-javascript-101/images/dependencyinjection.png)

Dependency Injection is one of those elements. I find developers often struggle to understand what it is, how it works, and why it's even necessary.

I learn by doing and hope a simple code example will help explain. To begin with, I wrote a very small application that assembles and runs a car. The dependencies look like this:

```
Car
|
|--Engine
|  |  
|  |--Pistons
|
|--Wheels
```

Think of the parts as dependencies between components. 

{{<highlight JavaScript>}}
function Wheels() {
  this.action = () => log("The wheels go 'round and 'round.");
  log("Made some wheels.");
}

function Pistons() {
  this.action = () => log("The pistons fire up and down.");
  log("Made some pistons.");
}

function Engine() {
  this.pistons = new Pistons();
  this.action = () => {
    this.pistons.action();
    log("The engine goes vroom vroom.");
  };
  log("Made an engine.");
}

function Car() {
  this.wheels = new Wheels();
  this.engine = new Engine();
  this.action = () => {
    this.wheels.action();
    this.engine.action();
    log("The car drives by.");
  };
  log("Made a car.");
}

var car = new Car();
car.action();
{{</highlight>}}

You can see the code and run it interactively here:

[https://jsfiddle.net/jeremylikness/gzt6o1L5/](https://jsfiddle.net/jeremylikness/gzt6o1L5/).

{{<jsfiddle gzt6o1L5>}}

The output should be what you expected.

![Sample output](/blog/dependency-injection-in-javascript-101/images/sampleoutput.png)

Great! So far, we have something that works, and we didn't even have to install a fancy framework. So, what's the problem?

The code works but is very simple. The problems come into play in a much larger application. Imagine having hundreds of components with dependencies ... now you will run into some issues:

1. The components depend directly on each other. If you attempt break each component (wheel, piston, etc.) into its own file, you will have to ensure everything is included in the right order for it to work. If you create or include the engine before defining the piston, the code will fail.
2. You cannot develop components in parallel. The tight coupling means it's not possible to have a developer working on engines while another is working on pistons. (For that matter, you can't easily make an empty set of objects as placeholders for pistons while you work on engines). 
3. The components create their own dependencies so there is no way to effectively test them without dependencies. You can't easily swap out "piston" with "test piston." In web apps this is important for unit tests. For example, you want to be able to mock web API calls rather than make real HTTP requests in your tests.

A little of refactoring will solve the third problem. Have you heard of a pattern called *Inversion of Control*? It is a simple pattern. Right now, the components are in control of their own dependencies. Let's invert that, so the components are no longer in control. We'll create the dependencies elsewhere and inject them. Inversion of control removes the direct dependencies, and dependency injection is how instances are passed to components.

To keep it simple, I'll just include the code that changed. Notice that instead of directly creating dependencies, the dependencies are now passed into the constructor functions. 

{{<highlight JavaScript>}}
function TestPistons() {
  this.action = () => log("The test pistons do nothing.");
  log("Made some test pistons.");
}

function Engine(pistons) {
  this.pistons = pistons;
  this.action = () => {
    this.pistons.action();
    log("The engine goes vroom vroom.");
  };
  log("Made an engine.");
}

function Car(wheels, engine) {
  this.wheels = wheels;
  this.engine = engine;
  this.action = () => {
    this.wheels.action();
    this.engine.action();
    log("The car drives by.");
  }
  log("Made a car.");
}

var pistons = new Pistons();
var testPistons = new TestPistons();
var wheels = new Wheels();
var engine = new Engine(pistons);
var testEngine = new Engine(testPistons);
var car = new Car(wheels, engine);
car.action();
testEngine.action();
{{</highlight>}}

You can view the entire app and run it interactively here: [https://jsfiddle.net/jeremylikness/8r35saz6/](https://jsfiddle.net/jeremylikness/8r35saz6/)

{{<jsfiddle 8r35saz6>}}

Now we've applied the *Inversion of Control* pattern and are doing some simple *Dependency Injection*. However, we still have a problem in a large code base. The previous issues (#1 and #2) have not been addressed. Notice that the objects must be created in the right order. Including or creating them out of order will result in failure. This makes it complicated to develop in parallel or out of sequence (and believe me, it happens with larger teams). A new developer on your team will have to understand all the dependencies to instantiate a component in their own code.

Again, what we can do?

The solution is to bring in an IoC (short for Inversion of Control) container to manage Dependency Injection. There are many types of containers, but here's how they typically work:

* You get one global instance of the container (you can have multiple containers but we'll stick with one to keep it simple)
* You register your components with the container
* You request components from the container, and it handles dependencies for you

First, I'll include a very small library I wrote named <i class="fab fa-github"></i> [jsInject](https://github.com/JeremyLikness/jsInject). This is a library I wrote specifically to learn about and understand dependency injection. You can read about it here: [Dependency Injection Explained via JavaScript](https://csharperimage.jeremylikness.com/2014/06/dependency-injection-explained-via.html), but I recommend you wait until *after* this article. After you are comfortable with DI and IoC, you can dig deeper to see how I created the container. The library does many things but, in a nutshell, you pass it a label and a constructor function to register a component. If you have dependencies, you pass an array with those dependencies. Here is how I define the `Pistons` class. Notice the code is almost 100% the same as the last iteration, except for the line of code that registers the component.

{{<highlight JavaScript>}}
function Pistons() {
    this.action = () => log("The pistons fire up and down.");
    log("Made some pistons.");
}

$jsInject.register("pistons", [Pistons]);
{{</highlight>}}

To get an instance of the class, instead of creating it directly, you "ask" the container for it:

```JavaScript
var pistons = $jsInject.get("pistons");
```

Easy enough! What's important to understand is that you can now develop in parallel and independently. For example, here is the `Engine` definition. Notice it depends on pistons but doesn't explicitly reference the implementation and simply references the label.

{{<highlight JavaScript>}}
function Engine(pistons) {
    this.pistons = pistons;
    this.action = () => {
        this.pistons.action();
        log("The engine goes vroom vroom.");
    };
    log("Made an engine.");
}

$jsInject.register("engine", ["pistons", Engine]);
{{</highlight>}}

In fact, in the example I created, I define the `Car` and `Engine` classes *before* their dependencies, and it's completely fine! 

You can see the full example here (the `$$jsInject` library is included at the bottom in minified code): [https://jsfiddle.net/jeremylikness/8y0ro5gx/](https://jsfiddle.net/jeremylikness/8y0ro5gx/).

{{<jsfiddle 8y0ro5gx>}}

The solution works, but there's an added benefit that may not be obvious. In the example I explicitly register a "test engine" with "test pistons." However, you could just as easily register the "pistons" label with the `TestPistons` constructor, and everything would work fine. In fact, I put the registrations with the function definitions for a reason. In a full project, these might be separate components. Imagine if you put the pistons in `pistons.js` and the engine in `engine.js`. You could do something like this:

```
main.js
--engine.js 
--pistons.js
```

That would work to create the engine. Now you want to write unit tests. You implement `TestPiston` in `testPiston.js` like this:

{{<highlight JavaScript>}}
function TestPistons() {
  this.action = () => log("The test pistons do nothing.");
  log("Made some test pistons.");
}
$jsInject.register("pistons", [TestPistons]);
{{</highlight>}}

Notice that you still use the label "pistons" even though you register the `TestPistons` constructor. Now you can set up this:

```
test.js
--engine.js
--testPistons.js

```

Boom! You're golden.

DI isn't just good for testing. The IoC container makes it possible to build your components in parallel. Dependencies are defined in a single place instead of throughout your app, and components that depend on other components can easily request them without having to understand the full dependency chain. "Car" can request "engine" without knowing that "engine" depends on "pistons." There is no magic order to include files, because everything gets resolved at run time.

This is a very simple example. For a more advanced solution, take a look at [Angular's dependency injection](https://angular.io/guide/architecture-services). You can define different registrations (called `Providers`) such as types (via TypeScript), hard-coded values and even factories that are functions that return the desired value. You can also manage *lifetime* or *scope*, for example:

* Always give me the same instance when I request a car (singleton)
* Always give me a new instance when I request a car (factory)

As you can see, although people often use them interchangeably, Inversion of Control (IoC) and Dependency Injection (DI) are related but not the same thing. This example demonstrated how to implement IoC, how to add DI, and how to use an IoC container to solve problems. 

Regards,

![Jeremy Likness](/images/jeremylikness.gif)
