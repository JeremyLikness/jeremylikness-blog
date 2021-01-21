---
title: "The Angular .NET Core 2.1 Template (Part Two)"
author: "Jeremy Likness"
date: 2018-09-11T21:21:01.845Z
years: "2018"
lastmod: 2019-06-13T10:45:08-07:00
comments: true
series: "Angular and .NET Core"

description: "Learn how to use the ASP.NET Core Angular template to create a single project with front-end and API code that supports seamless debugging between the browser and the server."

subtitle: "One project to rule them all!"
tags:
 - JavaScript 
 - Typescript 
 - Net Core 
 - Angular 
 - Csharp 

image: "/blog/2018-09-11_angular.net-core-2.1-template-part-two/images/1.png" 
images:
 - "/blog/2018-09-11_angular.net-core-2.1-template-part-two/images/1.png" 
 - "/blog/2018-09-11_angular.net-core-2.1-template-part-two/images/2.gif" 

aliases:
    - "/the-angular-net-core-2-1-template-part-two-d4db52550764"
---

In the [previous post](/get-started-with-angular-on-net-core-2-1-part-one-2effcfe8fae9), I shared how Angular and .NET Core can work together to deliver modern web applications. In this post, you learn how to tightly integrate the client and server in a single project.

This is a four-part series. You can navigate to the parts below (links will become active as articles are available:

1. [Get Started with Angular on .NET Core 2.1](/get-started-with-angular-on-net-core-2-1-part-one-2effcfe8fae9)
2. **The Angular .NET Core 2.1 Template (you are here)**
3. [Server-side Rendering (SSR) with Angular in .NET Core 2.1](/server-side-rendering-ssr-with-angular-in-net-core-2-1-part-three-481cb42d1ed2)
4. [Deploy Angular and .NET Core 2.1 to the Azure Cloud](/deploy-angular-and-net-core-2-1-to-the-azure-cloud-part-four-d68594807c7a)

## Approach Two: One Project to Rule them All

For the second approach, you generate a project that integrates Angular and .NET Core together. The client-side app will get built with the server-side app, deployed together, and it is even possible to debug the client and server in the same session. Why would you take this approach?

* You still retain full control of the Angular app using the Angular CLI (including being able to run `ng update` in the `ClientApp` folder)
* Source maps are automatically generated for you to debug TypeScript from the browser
* Client code is auto-recompiled for live development
* The production build automatically leverages the [Ahead of Time (AoT) compiler](https://angular.io/guide/aot-compiler?utm_source=jeliknes&utm_medium=blog&utm_campaign=medium&WT.mc_id=medium-blog-jeliknes)
* You can deploy everything in one step
* There is support for server-side rendering (SSR) — but we’ll cover that in the next section

The template produces a fully functional app that fetches data from the server and features navigation. Simply do:

`dotnet new angular`

`dotnet run`

…and you’re there!

![Standard template for Angular and .NET Core integration](/blog/2018-09-11_angular.net-core-2.1-template-part-two/images/1.png)
<figcaption>Standard template for Angular and .NET Core integration</figcaption>

You can debug the app directly from Visual Studio. If you are using Visual Studio Code, [create a debug profile](https://code.visualstudio.com/Docs/editor/debugging?utm_source=jeliknes&utm_medium=blog&utm_campaign=medium&WT.mc_id=medium-blog-jeliknes), install the [Chrome debugger](https://jlikme/d87), and populate `launch.json` with the following:

{{<highlight JSON>}}
{
    "version": "0.2.0",
    "compounds": [
        {
            "name": "ASP.NET Core and Browser",
            "configurations": [
                ".NET Core Launch (web)",
                "Launch Chrome"
            ]
        }
    ],
    "configurations": [
        {
            "name": ".NET Core Launch (web)",
            "type": "coreclr",
            "request": "launch",
            "preLaunchTask": "build",
            "program": "${workspaceFolder}/bin/Debug/netcoreapp2.1/ng-ssr.dll",
            "args": [],
            "cwd": "${workspaceFolder}",
            "stopAtEntry": false,
            "internalConsoleOptions": "openOnSessionStart",
            "launchBrowser": {
                "enabled": false
            },
            "env": {
                "ASPNETCORE_ENVIRONMENT": "Development"
            },
            "sourceFileMap": {
                "/Views": "${workspaceFolder}/Views"
            }
        },
        {
            "name": "Launch Chrome",
            "type": "chrome",
            "request": "launch",
            "sourceMaps": true,
            "url": "https://localhost:5001",
            "webRoot": "${workspaceFolder}/ClientApp",
            "runtimeArgs": [
                "--remote-debugging-port=9222"
            ]
        },
        {
            "name": ".NET Core Attach",
            "type": "coreclr",
            "request": "attach",
            "processId": "${command:pickProcess}"
        },
    ]
}
{{</highlight>}}

This creates two profiles, one for the browser and one for the back-end. You can choose the combined “ASP.NET Core and Browser” profile to set breakpoints in the TypeScript and C# source and debug seamlessly between the client and server. Now that you’re up and running, in the next article you’ll see how to [pre-render pages using server-side rendering (SSR)](/server-side-rendering-ssr-with-angular-in-net-core-2-1-part-three-481cb42d1ed2).

[**Learn more about using the Angular template with .NET Core**](https://docs.microsoft.com/en-us/aspnet/core/client-side/spa/angular?view=aspnetcore-2.1&tabs=visual-studio&utm_source=jeliknes&utm_medium=blog&utm_campaign=medium&WT.mc_id=medium-blog-jeliknes)**.**

Regards,

![Jeremy Likness](/blog/2018-09-11_angular.net-core-2.1-template-part-two/images/2.gif)

Previous: [Get Started with Angular on .NET Core 2.1](/get-started-with-angular-on-net-core-2-1-part-one-2effcfe8fae9)

Next: [Server-side Rendering (SSR) with Angular in .NET Core 2.1](/server-side-rendering-ssr-with-angular-in-net-core-2-1-part-three-481cb42d1ed2)

This is a four-part series. You can navigate to the parts below (links will become active as articles are available:

1. [Get Started with Angular on .NET Core 2.1](/get-started-with-angular-on-net-core-2-1-part-one-2effcfe8fae9)
2. **The Angular .NET Core 2.1 Template (you are here)**
3. [Server-side Rendering (SSR) with Angular in .NET Core 2.1](/server-side-rendering-ssr-with-angular-in-net-core-2-1-part-three-481cb42d1ed2)
4. [Deploy Angular and .NET Core 2.1 to the Azure Cloud](/deploy-angular-and-net-core-2-1-to-the-azure-cloud-part-four-d68594807c7a)
