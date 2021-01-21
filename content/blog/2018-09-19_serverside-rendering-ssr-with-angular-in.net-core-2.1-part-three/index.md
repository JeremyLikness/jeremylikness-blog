---
title: "Server-side Rendering (SSR) with Angular in .NET Core 2.1 (Part Three)"
author: "Jeremy Likness"
date: 2018-09-19T14:11:46.980Z
years: "2018"
lastmod: 2019-06-13T10:45:10-07:00
comments: true
series: "Angular and .NET Core"

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

In the [previous post](/the-angular-net-core-2-1-template-part-two-d4db52550764), you learned how to set up a project that will build the client and server side components at the same time. It also supported seamless debugging between TypeScript client code and C# server code. In this post, you’ll learn how to leverage an Angular feature to enable server-side rendering.

This is a four-part series. You can navigate to the parts below (links will become active as articles are available:

1. [Get Started with Angular on .NET Core 2.1](/get-started-with-angular-on-net-core-2-1-part-one-2effcfe8fae9)
2. [The Angular .NET Core 2.1 Template](/the-angular-net-core-2-1-template-part-two-d4db52550764)
3. **Server-side Rendering (SSR) with Angular in .NET Core 2.1 (you are here)**
4. [Deploy Angular and .NET Core 2.1 to the Azure Cloud](/deploy-angular-and-net-core-2-1-to-the-azure-cloud-part-four-d68594807c7a)

## Approach Three: Server-Side Rendering (SSR)

You can add a few simple modifications to the code to leverage [Angular Universal](https://angular.io/guide/universal?utm_source=jeliknes&utm_medium=blog&utm_campaign=medium&WT.mc_id=medium-blog-jeliknes) and server-side or pre-rendered pages. The server will render a first pass of the page for faster delivery to the client, then immediately refresh with client code. In most cases, network speeds should be sufficient to accommodate the standard approach. In the rare case you need to explore SSR, there are a few caveats to consider:

* This requires Node.js is installed on the host machine to facilitate the pre-rendering step
* The full `node_modules` sub-directory must be published, and this will cause the Internet to break and your lights to dim
* Your code must make additional checks to ensure it is not accessing features that aren’t available on the server, such as the `window` object and local storage

If you’re still convinced you want to try this out, follow the documentation for [Angular Server-Side Rendering (SSR) with .NET Core](https://docs.microsoft.com/en-us/aspnet/core/client-side/spa/angular?view=aspnetcore-2.1&tabs=visual-studio&utm_source=jeliknes&utm_medium=blog&utm_campaign=medium&WT.mc_id=medium-blog-jeliknes#server-side-rendering). To prove it’s working, I modified `main.ts` to provide this value:

`{ provide: 'OS', useValue: 'This is on the client.'}`

I then updated `main.server.ts` to provide this:

`{ provide: 'OS', useValue: params.data.os }`

Injected it into `app/home/home.component.ts`:

{{<highlight TypeScript>}}
import { Component, Inject } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {

  os: string = null;

  constructor(@Inject('OS') public osinject: string) {
    console.log(osinject);
    this.os = osinject;
  }
}
{{</highlight>}}

Finally, I render it in app/home/home.component.html:

`<h1>Hello, {{ os }}!</h1>`

You may have to set a break point (I recommend using `main.ts`) to see the pre-rendered page, but before the client render takes over it will look something like this:

![Server-side rendering](/blog/2018-09-19_serverside-rendering-ssr-with-angular-in.net-core-2.1-part-three/images/1.png)
<figcaption>Server-side rendering</figcaption>

It’s nice to have an app up and running, but if you’re going to scale you’ll need to host it somewhere besides your laptop. In the [next post](/deploy-angular-and-net-core-2-1-to-the-azure-cloud-part-four-d68594807c7a), we’ll explore how to deploy your Angular apps to the cloud using Azure.

**Read the documentation for** [**server-side rendering (SSR) Angular in .NET Core 2.1**](https://docs.microsoft.com/en-us/aspnet/core/client-side/spa/angular?view=aspnetcore-2.1&tabs=visual-studio&WT.mc_id=medium-blog-jeliknes#server-side-rendering)**.**

Regards,

![Jeremy Likness](/blog/2018-09-19_serverside-rendering-ssr-with-angular-in.net-core-2.1-part-three/images/2.gif)

Previous: [The Angular .NET Core 2.1 Template](/the-angular-net-core-2-1-template-part-two-d4db52550764)

Next: [Deploy Angular and .NET Core 2.1 to the Azure Cloud](/deploy-angular-and-net-core-2-1-to-the-azure-cloud-part-four-d68594807c7a)

This is a four-part series. You can navigate to the parts below (links will become active as articles are available:

1. [Get Started with Angular on .NET Core 2.1](/get-started-with-angular-on-net-core-2-1-part-one-2effcfe8fae9)
2. [The Angular .NET Core 2.1 Template](/the-angular-net-core-2-1-template-part-two-d4db52550764)
3. **Server-side Rendering (SSR) with Angular in .NET Core 2.1(you are here)**
4. [Deploy Angular and .NET Core 2.1 to the Azure Cloud](/deploy-angular-and-net-core-2-1-to-the-azure-cloud-part-four-d68594807c7a)
