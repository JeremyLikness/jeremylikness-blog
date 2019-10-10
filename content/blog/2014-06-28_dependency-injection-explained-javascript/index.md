---
title: "Dependency Injection Explained via JavaScript"
author: "Jeremy Likness"
date: 2014-06-28T12:37:00-07:00
years: "2014"
lastmod: 2014-06-28T12:37:00-07:00

draft: false
comments: true
toc: true

subtitle: "Understand dependency injection by implementing a simple constructor-based framework for managing inversion of control."

description: "Dependency injection is an approach to solve inversion of control that facilitates components that are easier to test and mock. To better understand dependency injection, this article walks through the creation of a simple DI framework and explains step-by-step how it works."

tags:
 - Dependency Injection 
 - JavaScript

image: "/blog/2014-06-28_dependency-injection-explained-javascript/images/hero.jpg" 
images:
 - "/blog/2014-06-28_dependency-injection-explained-javascript/images/hero.jpg" 
 - "/blog/2014-06-28_dependency-injection-explained-javascript/images/chimera.jpg" 
---

When learning a new framework I often find it is useful to examine the source, use the framework, then go into a separate project and build the functionality from scratch to better understand the motivation behind the framework and what it may be saving me by using it. [Angular](https://angularjs.org) is no exception. There are many tools in the AngularJS toolbox, from data-binding to compiling new HTML tags, but one of my favorites is the built-in dependency injection. You can browse [Angular’s DI code here](https://github.com/angular/angular.js/blob/master/src/auto/injector.js) and read my blog posts about [understanding Providers, Services, and Factories](https://csharperimage.jeremylikness.com/2014/01/understanding-providers-services-and.html). A more advanced version is detailed in [Interception using Decorator and Lazy Loading with AngularJS](https://csharperimage.jeremylikness.com/2014/01/interception-using-decorator-and-lazy.html).

![Chimera](/blog/2014-06-28_dependency-injection-explained-javascript/images/chimera.jpg)
<figcaption>Chimera via AKHSMythology</figcaption>

> “Well, Dimitri, every search for a hero must begin with something every hero needs, a villain. So in a search for our hero, Bellerophon, we have created a more effective monster: Chimera.” – _Dr. Nekhorvich, Mission Impossible II_

I don’t believe I created a monster, but in my search to understand JavaScript dependency injection, I did create <i class="fab fa-github"></i>[jsInject](https://github.com/JeremyLikness/jsInject).

{{<github "JeremyLikness/jsInject">}}

This library acts as an dependency injection container for JavaScript components that depend on each other. It is based on _constructor injection_ which inverts control of dependencies by passing them in through the constructor. If you are looking for dependency injection in JavaScript without taking on a full framework, this is an extremely lightweight solution that should do the trick for you.

For example, if your serviceA depends on dependencyB, you might define it like this to return it from a factory:

{{<highlight JavaScript>}}
function serviceA(dependencyB) {
    return {
      id: dependencyB.getId()
    };
}
{{</highlight>}}

Another approach is to use a constructor function. This is required if you use a class-based approach, as code generated from tools like TypeScript doesn’t lend itself well to the factory pattern.

{{<highlight JavaScript>}}
function ServiceA(dependencyB) {
    this.id = dependencyB.getId();
}
{{</highlight>}}

Of course there is always the self-invoking function as well:

{{<highlight JavaScript>}}
var ServiceA = (function() {
    function ServiceA(dependencyB) {
        this.id = dependencyB.getId();
    }
    return ServiceA;
})();
{{</highlight>}}

In all of these cases, the dependency is injected and the purpose of a dependency injection container is to handle that injection for you.

## Why Dependency Injection

A logical first question is: why bother? I often hear this from developers and architects who are concerned that dependency injection adds unnecessary overhead and over-complicates projects. More often than not they have worked on smaller projects with smaller teams and might not have run into the sheer size of project that benefits from dependency injection. I’m used to projects where there are tens of thousands if not hundreds of thousands of lines of client code (yes, I’m talking just the JavaScript part) with hundreds of components that interrelate. Forget module loading, bundling, etc. for a moment (worrying about how the scripts get loaded in the first place), let’s take a look at common problems:

* When A depends on B and B depends on C, without dependency injection you create C from B and B from A and then reference A from a dozen different places. What happens when C now requires something, or B requires D in addition to C? Without dependency injection, that is a lot of refactoring and finding places you create those components. With dependency injection, A only has to worry about B. A doesn’t care what B depends on because that is handled by the DI container.
* Timing is often an issue. What happens when A depends on B but the script for B is loaded _after_ A? Dependency injection removes that concern because you can defer or _lazy load_ the dependency when it’s time. In other words, regardless of how A and B are loaded, you only need to wire them up when you first reference A. On large projects when you have 50 JavaScript components referenced from a single page, the last thing you want to have to worry about is including them in the correct order.
* Dependency injection is critical for testing. If A directly instantiates B then I’m stuck with the implementation of B that A chooses. If B is injected into A, I can create a “mock B” or a “stub B” for testing purposes. For example, you might have a component that depends on a web service. With dependency injection, you can create an implementation that uses hard-coded JSON for testing purposes and then wire in the real component that makes the service call at runtime.
* Single Responsibility – Dependency Injection is actually one of the [SOLID principles](https://csharperimage.jeremylikness.com/2009/05/solid-and-dry.html). It helps to encourage the notion of designing components with a Single Responsibility. You want to be able to focus on one thing in a component an should only have to change it for one reason. This is like building padding around your component, insulting the rest of the system. If the component is responsible for boiling water and mixing shakes, anytime you change it you have to test both scenarios. Having a single responsibility means you can change how you boil water without worrying about making shakes because another component is responsible. That makes it easier to maintain the code.
* Psst … managers. Here’s something else to think about. Forget the technology, let’s talk about teams. When you have a lot of cooks in the kitchen, it is easy for them to bump elbows and step on each other’s toes. Having nice, isolated components means more team members can work in parallel without having to worry about what the other person is doing. I’ve witnessed this on many projects – again, if you have one component boil water and mix shakes, only one person can apply changes at a time. If you have two separate components, you can improve both scenarios at the same time.

I believe there are many benefits and that DI itself is only as complicated as you make it. In my experience, it simplifies things on larger projects.

## Dependency Injection to the Rescue

![Caped Hero](/blog/2014-06-28_dependency-injection-explained-javascript/images/hero.jpg)
<figcaption>DI to the rescue!</figcaption>

The most basic DI solutions provide at least two features: the ability to register a component, and the ability to retrieve an instance of a component. Advanced solutions will allow you to intercept requests, override methods on the fly, register multiple components that satisfy a given interface and even manage the lifetime of a component (whether you get a new instance or the same one each time). The registration is key because that tells the container what you expect to retrieve, and somehow the container must also understand what dependencies to provide.

A naïve implementation will use the constructor parameters to determine dependencies. I call this naïve because naming a parameter doesn’t imply the dependent component has the same name, and when you minify or uglify your JavaScript code you lose information. A more common approach is to annotate the component somehow. I really like the options that Angular provides for annotations. When you register a component, you give it a name that doesn’t necessarily have to match the name of the constructor function or the function being called as a factory. When you annotate a component, you simply provide a list of names of dependencies. There are two ways to do this. You can either mark these up on the component itself by exposing a property as an array, or you can pass these in to the container when you register it.

## Registering the Component

Let’s register a component. For jsInject I decided to mirror Angular’s approach and allow you to either pass dependencies at registration time, or use a static property. Here is an example of providing the information at registration time:

{{<highlight JavaScript>}}
var fn = (function() {
   function Fn(echo) {
      this.echo = echo;
      this.test = function() {
         return echo.echo(expected);
      };
    }
    return Fn;
})();
$jsInject.register("1", ["echoFn", fn]);
{{</highlight>}}

In this case the dependency passed in as “echo” to the constructor is registered as “echoFn” to the container, and the function we are registering called "fn" is labeled “1” in the container. The registration expects an array. The last member should always be the component we are registering (whether it is a constructor function or factory) and the members before it are the names of the dependencies in the order they will be passed in.

The other approach is to annotate the component. Here is an example of using the annotation approach. This service exposes a hard-coded static property called $$deps to list the dependency names:

{{<highlight JavaScript>}}
function ServiceB(serviceA) {
    this.id = serviceA.id + "b";
}
ServiceB.$$deps = ["ServiceA"];
{{</highlight>}}

It is registered like this (notice there are no “annotations” added to the registration array, just the constructor function itself):

{{<highlight JavaScript>}}
$jsInject.register("ServiceA", [ServiceA]);
{{</highlight>}}

jsInject creates a method for instantiating the component but does not try to invoke it right away. It is a lazy-loading function. The first time the component is needed, it will instantiate it, then it will return the same copy for future requests. Here is the general pattern – we’ll expand the magic part, but note how once it’s done, it won’t go through that work again because the function replaces itself with a new one that simply returns the instantiated component.

{{<highlight JavaScript>}}
var _this = this;
this.container[name] = function (level) {
    var result = {}; // magic goes here
    _this.container[name] = function () {
        return result;
    };
    return result;
};
{{</highlight>}}

So how exactly does it wire up the dependencies?

## Retrieving the Component

The magic is in walking through the dependency chain. The algorithm itself is fairly simple. You basically iterate the list of annotations, grab them from the container recursively, and shove them into a list of arguments that you’ll pass to the component’s constructor. If an annotation has been instantiated, it is returned, otherwise it is also scanned for its own annotations and so forth. The trick is understanding the format of what was passed in and generically instantiating it with a dynamic constructor list.

The level keeps track of recursion to avoid infinite loops. You can tweak this as needed but I’ve seldom seen well-written systems go more than a few levels deep (for example, a controller may depend on a service that depends on other services). The dynamic nature of JavaScript makes it easier for us to build a component on the fly. First, we create an empty template:

{{<highlight JavaScript>}}
Template = function () {}
{{</highlight>}}

Next, we get the component itself (which is a function, but it might be a constructor function, a factory, or a self-invoking function):

{{<highlight JavaScript>}}
fn = annotatedArray[annotatedArray.length - 1],
{{</highlight>}}

Then we grab the annotations for the component. Remember, the last element of the array is the component itself. If the array has more than one element, we assume the previous elements are annotations. Otherwise, we check the component itself for the $$deps property, and failing that we assume it has no dependencies.

{{<highlight JavaScript>}}
deps = annotatedArray.length === 1 ? (annotatedArray[0].$$deps || []) :
    annotatedArray.slice(0, annotatedArray.length - 1),
{{</highlight>}}

Now for the magic, we copy the prototype of the supplied component to the prototype of our template:

{{<highlight JavaScript>}}
Template.prototype = fn.prototype;
{{</highlight>}}

Then we create an instance of the template:

{{<highlight JavaScript>}}
instance = new Template();
{{</highlight>}}

Finally, we call a recursively invoked function to push in dependencies. If there are none, we use the instance we created, otherwise we use the fully wired result from the recursive call.

{{<highlight JavaScript>}}
injected = _this.invoke(fn, deps, instance, lvl + 1);
result = injected || instance;
{{</highlight>}}

The recursive call simply checks the recursion level to make sure we haven’t gone too far, then iterates through the dependencies. Each dependency is pushed into an arguments list (as an instance that is also recursively retrieved from the container itself). We use the function to apply to the template we created with the arguments we’ve pushed.

{{<highlight JavaScript>}}
for (; i < deps.length; i += 1) {
    args.push(this.get(deps[i], lvl + 1));
}
return fn.apply(instance, args);
{{</highlight>}}

Voila! Now we are able to retrieve a component with its dependencies. Here is an example of wiring up multiple components, some of them by annotating during registration and others annotated using the $$deps:

{{<highlight JavaScript>}}
function main () {
    var ioc = new $$jsInject();
    ioc.register('courseMap', [CourseMap]);
    ioc.register('instructors', ['log', 'ch', Instructors]);
    ioc.register('courses', ['log', 'ch', Courses]);
    ioc.register('log', [Log]);
    ioc.register('ch', [CollectionHelper]);
    ioc.get('log').log(ioc.get('courseMap').getCourses());
}
{{</highlight>}}

You can see a full working example with [this fiddle](https://jsfiddle.net/jeremylikness/z9DP8). Be sure to open your console log, that is where you can verify the call to the course map returns an expanded instructor and course but all dependent components are only created once even though they were registered in a different order.

## Improvements

You can certainly improve the implementation (and I do accept pull requests). As an exercise, for example, how would you modify it so you could store constant values and not just instances of objects? In other words, what if I want to register the text “Copyright 2014” in a value called “Copyright”? Also, the current implementation for registration doesn’t implement chaining. Instead of `ioc.register(x); ioc.register(y)` it would be far more convenient to chain like this: `ioc.register(x).register(y)` … do you know how to fix it so that’s possible? What about a modification that allows you to determine whether you get the singleton, cached instance vs. force a “fresh” instance when you request it? (Hint: take a look at my Portable IOC project that supports this in C#).

## Wrapping Up

As you can see, dependency injection itself is fairly straightforward and is designed to simplify your solution, not overly complicate it. Angular adds some extra caveats and shortcuts to their solution but in essence it behaves very similar to the example I’ve provided here. In fact, I hope by walking through this you can now go back to the Angular source and better understand what is happening in the $inject implementation. If you are able to use the <i class="fab fa-github"></i>[jsInject](https://github.com/JeremyLikness/jsInject) component in your projects that’s an added bonus, but otherwise I hope you walk away feeling much better about using dependency injection and specifically how it can be implemented in JavaScript.

Regards,

![Jeremy Likness](/images/jeremylikness.gif)
