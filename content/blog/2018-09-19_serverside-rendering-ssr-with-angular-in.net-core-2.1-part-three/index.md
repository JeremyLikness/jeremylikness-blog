---
title: "Server-side Rendering (SSR) with Angular in .NET Core 2.1 (Part Three)"
author: "Jeremy Likness"
date: 2018-09-19T14:11:46.980Z
years: "2018"
lastmod: 2019-06-13T10:45:10-07:00

description: "Take advantage of Angular Universal and integration with .NET Core to pre-render single page application pages using server-side rendering (SSR)."

subtitle: "Deliver the goods faster with Angular Universal."
tags:
 - JavaScript 
 - Angular 
 - Angular Univ 
 - Net Core 
 - Server Side Rendering 

image: "/blog/2018-09-19_serverside-rendering-ssr-with-angular-in.net-core-2.1-part-three/images/1.png" 
images:
 - "/blog/2018-09-19_serverside-rendering-ssr-with-angular-in.net-core-2.1-part-three/images/1.png" 
 - "/blog/2018-09-19_serverside-rendering-ssr-with-angular-in.net-core-2.1-part-three/images/2.gif" 


aliases:
    - "/server-side-rendering-ssr-with-angular-in-net-core-2-1-part-three-481cb42d1ed2"
---

#### Deliver the goods faster with Angular Universal.

In the [previous post](https://blog.jeremylikness.com/the-angular-net-core-2-1-template-part-two-d4db52550764), you learned how to set up a project that will build the client and server side components at the same time. It also supported seamless debugging between TypeScript client code and C# server code. In this post, you’ll learn how to leverage an Angular feature to enable server-side rendering.

This is a four-part series. You can navigate to the parts below (links will become active as articles are available:

1.  [Get Started with Angular on .NET Core 2.1](https://blog.jeremylikness.com/get-started-with-angular-on-net-core-2-1-part-one-2effcfe8fae9)
2.  [The Angular .NET Core 2.1 Template](https://blog.jeremylikness.com/the-angular-net-core-2-1-template-part-two-d4db52550764)
3.  **Server-side Rendering (SSR) with Angular in .NET Core 2.1 (you are here)**
4.  [Deploy Angular and .NET Core 2.1 to the Azure Cloud](https://blog.jeremylikness.com/deploy-angular-and-net-core-2-1-to-the-azure-cloud-part-four-d68594807c7a)

#### Approach Three: Server-Side Rendering (SSR)

You can add a few simple modifications to the code to leverage [Angular Universal](https://jlik.me/d84) and server-side or pre-rendered pages. The server will render a first pass of the page for faster delivery to the client, then immediately refresh with client code. In most cases, network speeds should be sufficient to accommodate the standard approach. In the rare case you need to explore SSR, there are a few caveats to consider:

*   This requires Node.js is installed on the host machine to facilitate the pre-rendering step
*   The full `node_modules` sub-directory must be published, and this will cause the Internet to break and your lights to dim
*   Your code must make additional checks to ensure it is not accessing features that aren’t available on the server, such as the `window `object and local storage

If you’re still convinced you want to try this out, follow the documentation for [Angular Server-Side Rendering (SSR) with .NET Core](https://jlik.me/d85). To prove it’s working, I modified `main.ts` to provide this value:

`{ provide: ‘OS’, useValue: ‘This is on the client.’}`

I then updated `main.server.ts` to provide this:

`{ provide: &#39;OS&#39;, useValue: params.data.os }`

Injected it into `app/home/home.component.ts`:




Finally, I render it in app/home/home.component.html:

`&lt;h1&gt;Hello, {{ os }}!&lt;/h1&gt;`

You may have to set a break point (I recommend using `main.ts`) to see the pre-rendered page, but before the client render takes over it will look something like this:




![image](/blog/2018-09-19_serverside-rendering-ssr-with-angular-in.net-core-2.1-part-three/images/1.png)

Server-side rendering



It’s nice to have an app up and running, but if you’re going to scale you’ll need to host it somewhere besides your laptop. In the [next post](https://blog.jeremylikness.com/deploy-angular-and-net-core-2-1-to-the-azure-cloud-part-four-d68594807c7a), we’ll explore how to deploy your Angular apps to the cloud using Azure.

**Read the documentation for** [**server-side rendering (SSR) Angular in .NET Core 2.1**](https://jlik.me/edw)**.**

Regards,




![image](/blog/2018-09-19_serverside-rendering-ssr-with-angular-in.net-core-2.1-part-three/images/2.gif)



Previous: [The Angular .NET Core 2.1 Template](https://blog.jeremylikness.com/the-angular-net-core-2-1-template-part-two-d4db52550764)

Next: [Deploy Angular and .NET Core 2.1 to the Azure Cloud](https://blog.jeremylikness.com/deploy-angular-and-net-core-2-1-to-the-azure-cloud-part-four-d68594807c7a)

This is a four-part series. You can navigate to the parts below (links will become active as articles are available:

1.  [Get Started with Angular on .NET Core 2.1](https://blog.jeremylikness.com/get-started-with-angular-on-net-core-2-1-part-one-2effcfe8fae9)
2.  [The Angular .NET Core 2.1 Template](https://blog.jeremylikness.com/the-angular-net-core-2-1-template-part-two-d4db52550764)
3.  **Server-side Rendering (SSR) with Angular in .NET Core 2.1(you are here)**
4.  [Deploy Angular and .NET Core 2.1 to the Azure Cloud](https://blog.jeremylikness.com/deploy-angular-and-net-core-2-1-to-the-azure-cloud-part-four-d68594807c7a)
