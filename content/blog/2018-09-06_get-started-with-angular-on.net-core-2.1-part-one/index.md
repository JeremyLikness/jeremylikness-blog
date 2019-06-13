---
title: "Get Started with Angular on .NET Core 2.1 (Part One)"
author: "Jeremy Likness"
date: 2018-09-06T01:04:49.997Z
lastmod: 2019-06-13T10:45:07-07:00

description: "Learn how Angular and .NET Core provide everything you need to deliver modern single page web applications. Set up a static web app with a dynamic REST API back-end."

subtitle: "Cross-platform client-side JavaScript SPA framework, meet cross-platform server-side .NET Core framework."
tags:
 - JavaScript 
 - Typescript 
 - Angular 
 - Dotnet 
 - Azure 

image: "/blog/2018-09-06_get-started-with-angular-on.net-core-2.1-part-one/images/3.png" 
images:
 - "/blog/2018-09-06_get-started-with-angular-on.net-core-2.1-part-one/images/1.png" 
 - "/blog/2018-09-06_get-started-with-angular-on.net-core-2.1-part-one/images/2.png" 
 - "/blog/2018-09-06_get-started-with-angular-on.net-core-2.1-part-one/images/3.png" 
 - "/blog/2018-09-06_get-started-with-angular-on.net-core-2.1-part-one/images/4.gif" 


aliases:
    - "/get-started-with-angular-on-net-core-2-1-part-one-2effcfe8fae9"
---

#### Cross-platform client-side JavaScript SPA framework, meet cross-platform server-side .NET Core framework.

[Angular](https://angular.io/) is one of the top “go to” frameworks for developing client-side Single Page Applications (SPA). It supports the “[3 D’s of Modern Web Development](https://blog.jeremylikness.com/the-three-ds-of-modern-web-development-55d69fe048da)” out of the box with built-in declarative templates that support data-binding and a highly configurable dependency injection (DI) framework. I’ve worked with Angular since it was “[AngularJS](https://angularjs.org/).” I have no ambition to compare it with other frameworks (like [ReactJs] (https://reactjs.org/)or [Vuejs](https://vuejs.org/)) in this post; the goal is to illustrate how Angular works with [.NET Core](https://jlik.me/d8t).




![image](/blog/2018-09-06_get-started-with-angular-on.net-core-2.1-part-one/images/1.png)



.NET Core is a cross-platform and open source implementation of the APIs defined by the [.NET Standard](https://jlik.me/d8u). Apps written for .NET Core are capable of running on Windows machines (as far back as Windows 7), Mac OS and several flavors of Linux. Apps are authored in several languages; [C#](https://jlik.me/d8v) and [F#](https://jlik.me/d8w) are the most popular. Write everything from back-end APIs to dynamic websites, and as a bonus there is a [template to integrate Angular with .NET Core](https://jlik.me/d8x). There are many options to deploy and host the apps in the Azure cloud.

Recently, I presented a session about Angular and .NET Core. This series is based on the content and demos of the session. Click or tap to download the presentation: [Angular in the .NET World](https://jlik.me/d9y). The code is all contained in the [Angular and .NET GitHub repo](https://github.com/JeremyLikness/angular-net).

You can watch the full presentation here:






This is a four-part series. You can navigate to the parts below (links will become active as articles are available):

1.  **Get Started with Angular on .NET Core 2.1 (you are here)**
2.  [The Angular .NET Core 2.1 Template](https://blog.jeremylikness.com/the-angular-net-core-2-1-template-part-two-d4db52550764)
3.  [Server-side Rendering (SSR) with Angular in .NET Core 2.1](https://blog.jeremylikness.com/server-side-rendering-ssr-with-angular-in-net-core-2-1-part-three-481cb42d1ed2)
4.  [Deploy Angular and .NET Core 2.1 to the Azure Cloud](https://blog.jeremylikness.com/deploy-angular-and-net-core-2-1-to-the-azure-cloud-part-four-d68594807c7a)

In this post I’ll share three specific ways Angular and .NET Core can work together, along with a few pointers for hosting the finished apps. I assume you have some familiarity with both frameworks. If not, follow the links earlier in this article because the documentation for both technologies is very thorough with easy-to-follow tutorials.

#### Approach One: “Gotta Keep ’em Separated”

A common approach to building SPA applications is to package the website as a set of static assets and host as static web pages, then stand up a separate set of back-end services that the application communicates with. .NET Core supports [building REST APIs](https://jlik.me/d8z) out of the box, with integrated [support for various authentication and authorization schemes](https://jlik.me/d8y) as well as [Swagger] (https://jlik.me/d80)to document the end points.

In this approach, you take the [standard steps to stand up your Angular app](https://jlik.me/d81) as a separate project. For the [sample app](https://github.com/JeremyLikness/angular-net) we’ll make a few tweaks, but first I want to walk through the .NET Core back-end. After you [install .NET Core](https://jlik.me/d82), create a directory and run the command to create a new Web API project:

`dotnet new webapi`

Rename the `ValuesController `to `BifurcController `and populate it with the following code:




The `HttpGet `attribute defines the verbs this endpoint can take and includes a route designation that expects a variable called `r`. This will automatically get parsed and passed to the method. The method also takes query parameters (flagged by `FromQuery`) that indicate how many iterations to run (`iterations`) and how many results to ignore (`skip`). It then recursively runs:

`r(x) = x *n*(1.0-x)`

The results are stored in an array and returned. At this point you can launch the app with:

`dotnet run`

Then navigate to a properly constructed URL to see the results:




![image](/blog/2018-09-06_get-started-with-angular-on.net-core-2.1-part-one/images/2.png)

A sample API run



On the Angular side, this is a simple service that fetches results based on a passed in `r` value:




Add a `canvas `declaration to the main `app.component.html` page:

`&lt;canvas id=”mainCanvas” #mainCanvas&gt;&lt;/canvas&gt;`

Then add the code to call the service and render the results:




This is when I add a simple disclaimer:
> I’m cutting corners to keep the demo simple. Ordinarily you’d inject the base URL from a service and build the graph as it’s own component. We’re keeping it simple here!

If all goes well you’ll see something like this:




![image](/blog/2018-09-06_get-started-with-angular-on.net-core-2.1-part-one/images/3.png)

Static app with .NET Core backend



… and that’s how we use fractals to teach code!

[**Learn more about .NET Core here.**](https://jlik.me/d8t)

Although this approach works perfectly fine, there are a few drawbacks. You have to manage two separate projects and debug them separately as well. In the [next article](https://blog.jeremylikness.com/the-angular-net-core-2-1-template-part-two-d4db52550764), you will learn how to leverage a built-in .NET Core template to manage the client and server components of your web app in a single project.

Regards,




![image](/blog/2018-09-06_get-started-with-angular-on.net-core-2.1-part-one/images/4.gif)



Next: [The Angular .NET Core 2.1 Template](https://blog.jeremylikness.com/the-angular-net-core-2-1-template-part-two-d4db52550764)

This is a four-part series. You can navigate to the parts below (links will become active as articles are available:

1.  **Get Started with Angular on .NET Core 2.1 (you are here)**
2.  [The Angular .NET Core 2.1 Template](https://blog.jeremylikness.com/the-angular-net-core-2-1-template-part-two-d4db52550764)
3.  [Server-side Rendering (SSR) with Angular in .NET Core 2.1](https://blog.jeremylikness.com/server-side-rendering-ssr-with-angular-in-net-core-2-1-part-three-481cb42d1ed2)
4.  [Deploy Angular and .NET Core 2.1 to the Azure Cloud](https://blog.jeremylikness.com/deploy-angular-and-net-core-2-1-to-the-azure-cloud-part-four-d68594807c7a)
