---
title: "Blazor State Management"
author: "Jeremy Likness"
date: 2020-01-14T06:03:07-08:00
years: "2020"
lastmod: 2020-01-14T06:03:07-08:00

draft: true
comments: true
toc: true

subtitle: "Don't forget to add memory to your Blazor apps"

description: "There will be blood."

tags:
 - Blazor 
 - .NET
 - ASP.NET
 - State 

image: "/blog/blazor-state-management/images/blazor-architecture.png" 
images:
 - "/blog/blazor-state-management/images/blazor-architecture.png" 
---
Imagine for a moment you are filling out the world's longest form. You've spent 30 minutes entering detailed information from your address to your date of birth to a list of the last seven countries you visited. You click the "submit" button and are immediately rewarded with a "The connection has been lost" message. No worries, right? Simply click the back button and ... _oh, no!_ The form is **empty**. You sound your barbaric yalp and pledge never to revisit the site again.

This is _not_ the experience you want for your website visitors. This is why it is important to understand how to manage state in Blazor apps. Managing state while minimizing the amount of code you have to write to manage state? "Yes, please!"

## Definition of Blazor State

First, let's be clear on what we mean by "state" in a Blazor app. For the best possible user experience, it's important to provide a consistent experience to the end user when their connection is temporarily lost and when they refresh or navigate back to the page. The components of this experience include:

* The HTML Document Object Model (DOM) that represents the user interface (UI)
* The fields and properties representing the data being input and/or output on the page
* The state of registered services that are running as part of code for the page

In the absence of any special code, state is maintained in two places depending on the [Blazor hosting model](https://jlik.me/g64). For Blazor WebAssembly (client-side) apps, state is held in browser memory until the user refreshes or navigates away from the page. In Blazor Server apps, state is held in special "buckets" allocated to each client session known as _circuits_. These circuits can lose state when they time out after a disconnection, and may be obliterated even during an active connection when the server is under memory pressure.

## The Reference App

To illustrate the nuances of state, I started with the [Blazor Health App](/blog/2019-01-03_from-angular-to-blazor-the-health-app):

{{<relativelink "/blog/2019-01-03_from-angular-to-blazor-the-health-app">}}

I extended it to include two pages to illustrate some nuances of navigation. In the related GitHub repository:

{{<github "JeremyLikness/BlazorState">}}

There are several sample projects. The problem manifests differently in Blazor WebAssembly and Blazor Server projects.

### State in Blazor WebAssembly

In Blazor WebAssembly (client projects) the state is held in memory. This means a refresh or forced navigation will destroy state. To see this in action:

1. Set `BlazorState.Wasm` as the start up project and run it
2. Update the form information
3. Navigate to "results" and verify the same results exist
4. Navigate back to "home" and force a refresh (usually `CTRL+F5`). Note the form reverts to defaults.
5. Update the form information, then manually navigate by adding `/results` to the URL bar in your browser and press `ENTER`. Note it also uses defaults.

Not a great experience! With Blazor Server, it's slightly different.

### State in Blazor Server

Change the startup project to `BlazorState.Server` and run that project. Try the same steps you did for the client version and note the state is maintained because it is held in the server memory. While the app is open, stop and restart the web server. You should see a disconnect message. After the server comes back up, click the "reload" option and note that although the app recovers, it loses all of its state.

Now we have a problem. Let's work on the solution!

### Solutions Architecture

The following solutions uses an approach to architecture designed to maximize reuse. The `Blazor.ViewModel` project hosts an interface, properties and business logic for the app. It is a .NET Standard library implementation of the [Model-View-ViewModel (MVVM) pattern](/blog/model-view-viewmodel-mvvm-explained/) that can be comfortably referenced from any type of .NET Core project, from WPF to Xamarin and even Blazor. Maximum reuse!

For UI and user experience logic, as well as shareable assets such as images, stylesheets, JavaScript code and even Razor view components, `Blazor.Shared` takes advantage of [Razor Class Libraries](https://jlik.me/g7b). The solution implements a `HealthModelBase` to avoid duplicate MVVM code. It also implements all of the state management solutions described here as services and/or components that are easily applied to both Blazor WebAssembly and Blazor Server projects. This further maximizes code reuses, as the "host" projects simply provide some structure to reference the share components and resources.

![Blazor Architecture](/blog/blazor-state-management/images/blazor-architecture.png)

Now that I've covered the problem and the approach for solutions, let's move on to managing state in our Blazor app!

## Service Registration

The first step may not be so obvious, but for the sake of being thorough I want to address services. 

## Browser Cache

## Server-side Management

## Conclusion