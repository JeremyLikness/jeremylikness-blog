---
title: "Presentation: WebAssembly, C#, and Blazor at CodeStock 2019"
author: "Jeremy Likness"
date: 2019-04-16T18:19:04.371Z
years: "2019"
lastmod: 2019-06-13T10:45:43-07:00
comments: true

description: "Get the presentation, source code and step-by-step demo instructions for a session that covers how to run C# and .NET in the browser without plugins using Blazor over WebAssembly."

subtitle: "How the browser is now your new cross-platform OS."
tags:
 - JavaScript 
 - Single Page Applications 
 - Blazor 
 -  .NET
 - Presentation

image: "/blog/2019-04-16_presentation-webassembly-c-sharp-and-blazor-at-codestock-2019/images/2.png" 
images:
 - "/blog/2019-04-16_presentation-webassembly-c-sharp-and-blazor-at-codestock-2019/images/1.png" 
 - "/blog/2019-04-16_presentation-webassembly-c-sharp-and-blazor-at-codestock-2019/images/2.png" 
 - "/blog/2019-04-16_presentation-webassembly-c-sharp-and-blazor-at-codestock-2019/images/3.gif" 


aliases:
    - "/presentation-webassembly-c-and-blazor-at-codestock-2019-ab2f8636356"
---

Knoxville, Tennessee is not only a fun city and great place to visit; it happens to be the host city of the [CodeStock](https://codestock.org) developers’ conference.

![CodeStock logo](/blog/2019-04-16_presentation-webassembly-c-sharp-and-blazor-at-codestock-2019/images/1.png)

The conference started back in 2007 and for 12 years has helped deliver the latest content to developers with topics ranging from women in technology and leadership skills to database design, cloud native applications, and more. This year I was asked to open the conference with a keynote.

{{<customtwitter 1116706599807139840>}}

In addition to the keynote, I delivered a presentation about WebAssembly and Blazor. I don’t just have a passing interest in WebAssembly; I believe it’s the future.

{{<customtwitter 1111646069320871936>}}

If you’re not familiar with WebAssembly, take a minute to read this high-level overview that I wrote (it only takes a few minutes to read):

[🔗 Learn | PASS Blog](https://www.pass.org/Community/PASSBlog/tabid/1476/entryid/912/WebAssembly-Bringing-Diversity-of-Language-to-the-Web.aspx)

WebAssembly, or Wasm for short, is so powerful that teams of developers were able to port the entire .NET framework to run on it! This means that many existing .NET libraries can run “as is” with DLLs that are loaded directly into your browser. It also means that if you want to write applications for the browser, JavaScript and TypeScript are no longer the only language options available. You can create fully functional Single Page Applications (SPA) in C#!

All of this is made possible with [Blazor](https://docs.microsoft.com/en-us/aspnet/core/blazor/?view=aspnetcore-5.0&utm_source=jeliknes&utm_medium=blog&utm_campaign=medium&WT.mc_id=medium-blog-jeliknes&viewFallbackFrom=aspnetcore-3.0), a framework for SPA apps built on top of .NET over WebAssembly. There are two parts to the presentation. First, you can download the deck [here](https://jlikme.blob.core.windows.net/presentations/Likness-WebAssembly-CodeStock.pptx?utm_source=jeliknes&utm_medium=blog&utm_campaign=medium&WT.mc_id=medium-blog-jeliknes).

![Main slide of presentation deck](/blog/2019-04-16_presentation-webassembly-c-sharp-and-blazor-at-codestock-2019/images/2.png)

Second, I built a GitHub repository with several demos. It includes a set of step-by-step instructions. You are welcome to fork the repository and walk through on your own or use these demos in your own presentations.

{{<github "JeremyLikness/blazor-wasm">}}

The demos cover everything from components, class libraries, JavaScript interoperability, and code-behind to implementing the MVVM pattern and debugging. I accept feedback and of course pull requests.

Regards,

![Jeremy Likness](/blog/2019-04-16_presentation-webassembly-c-sharp-and-blazor-at-codestock-2019/images/3.gif)
