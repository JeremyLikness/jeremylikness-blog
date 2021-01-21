---
title: "Lift and Shift your .NET App to Azure"
author: "Jeremy Likness"
date: 2017-11-17T21:46:10.703Z
years: "2017"
lastmod: 2019-06-13T10:44:17-07:00
comments: true

description: "Learn how to transform a legacy application to take advantage of advanced cloud architectures including Platform-as-a-Service and serverless using Azure App Services, Azure Functions, and Proxies."

subtitle: "Leverage Azure PaaS (Application Service) and Serverless (Azure Functions) to migrate from .NET Core on iron to the cloud."
tags:
 - Serverless 
 - Lift And Shift 
 - Azure 
 - Azure Functions 
 - Cloud Computing 

image: "/blog/2017-11-17_lift-and-shift-your-.net-app-to-azure/images/1.jpeg" 
images:
 - "/blog/2017-11-17_lift-and-shift-your-.net-app-to-azure/images/1.jpeg" 
 - "/blog/2017-11-17_lift-and-shift-your-.net-app-to-azure/images/2.jpeg" 
 - "/blog/2017-11-17_lift-and-shift-your-.net-app-to-azure/images/3.jpeg" 
 - "/blog/2017-11-17_lift-and-shift-your-.net-app-to-azure/images/4.jpeg" 
 - "/blog/2017-11-17_lift-and-shift-your-.net-app-to-azure/images/5.gif" 


aliases:
    - "/lift-and-shift-your-net-app-to-azure-41c1fd6a9e43"
---

Cloud services continue to evolve and developers today are trying to understand what “cloud native” means and how to transform their legacy applications to take advantage of benefits including:

* Reduced overhead of maintenance — let the cloud handle the operating system, security patches, etc.
* Improved DevOps workflows with features like deployment slots
* Automated backups, logging, and analytics
* Pay-for-use rather than “pay-for-just-in-case”

The transition to the cloud is about reducing overhead and focusing more on the core business logic that is unique to your team. It is a DevOps journey and requires more than technology, but a cultural shift as well. There is a tangible evolution of application architectures from on-premises apps through Infrastructure-as-a-Service (IaaS) (the “low risk” on-ramp for cloud migrations, but often a more expensive approach), through Platform-as-a-Service (PaaS) and ultimately “serverless” or “less-server.”

![The Evolution of Apps from Iron-bound to Cloud Native](/blog/2017-11-17_lift-and-shift-your-.net-app-to-azure/images/1.jpeg)
<figcaption>The Evolution of Apps from Iron-bound to Cloud Native</figcaption>

I recently presented a use case for [Connect() 2017](https://channel9.msdn.com/Events/Connect/2017) that focused on “[lift and shift](https://aka.ms/byoa)” for a .NET Core “Todo” N-tier application with a single page application front-end talking to a Web API tier that uses Entity Framework core to connect to a SQL database. The source code for the application is on GitHub:

{{<github "JeremyLikness/bring-own-app-connect-17">}}

Here is what the running application looks like:

![Simple “Todo” App](/blog/2017-11-17_lift-and-shift-your-.net-app-to-azure/images/2.jpeg)
<figcaption>Simple “Todo” App</figcaption>

In the training I talk about transforming your software through a series of steps, all geared towards lifting and shifting the application without having to deal with the overhead of maintaining full-size virtual machines. The first step is to create a set of [Azure App Service](https://docs.microsoft.com/en-us/azure/app-service/?utm_source=jeliknes&utm_medium=blog&utm_campaign=connect17&WT.mc_id=connect17-blog-jeliknes) resources to host the web site and Web API, then migrate the SQL database to [Azure SQL](https://docs.microsoft.com/en-us/azure/azure-sql/?utm_source=jeliknes&utm_medium=blog&utm_campaign=connect17&WT.mc_id=connect17-blog-jeliknes). You can read guidance for migrating SQL to the cloud here: [https://aka.ms/migrate-sql](https://aka.ms/migrate-sql.).

![Simple Application](/blog/2017-11-17_lift-and-shift-your-.net-app-to-azure/images/3.jpeg)
<figcaption>Simple Application</figcaption>

Although moving the application “as-is” is often the logical first step, it makes sense in many cases to take advantage of microservices by transforming traditional monolithic applications. Azure’s serverless offerings include [Azure Functions](https://docs.microsoft.com/en-us/azure/azure-functions/functions-overview?utm_source=jeliknes&utm_medium=blog&utm_campaign=connect17&WT.mc_id=connect17-blog-jeliknes) and [Logic Apps](https://docs.microsoft.com/en-us/azure/logic-apps/logic-apps-overview?utm_source=jeliknes&utm_medium=blog&utm_campaign=connect17&WT.mc_id=connect17-blog-jeliknes). For apps that have hundreds or thousands of APIs, leveraging serverless provides the ability to scale endpoints independently (consider the case of one endpoint being called millions of times compared to other endpoints that may be called more infrequently), deploy updates out of band from other APIs, and even empower teams to iterate multiple APIs separately in parallel.

It’s not always feasible to transform a complete legacy application at once, so I demonstrate a hybrid approach that allows me to refactor a single end point without changing the main web app. This is done through the power of [Proxies](https://docs.microsoft.com/en-us/azure/azure-functions/functions-proxies?utm_source=jeliknes&utm_medium=blog&utm_campaign=connect17&WT.mc_id=connect17-blog-jeliknes).

![Refactored to use Proxies for Hybrid Cloud Native](/blog/2017-11-17_lift-and-shift-your-.net-app-to-azure/images/4.jpeg)
<figcaption>Refactored to use Proxies for Hybrid Cloud Native</figcaption>

The final step in the application is to instrument custom telemetry to measure dependencies and answer questions like:

* How long does it take for an API call to complete?
* How much time was spent opening the SQL Connection?
* How long did it take to insert a new item into the database?

The incredible truth is that with our modern set of tools and features, these transformations take place quickly. In fact, I was able to lift the reference application to the cloud, refactor the API to use serverless and instrument custom telemetry live in just under an hour. That included creating the Azure resources from scratch! See for yourself: this is my lift and shift training video.

🎦 [Azure: Bring your app to the cloud with serverless Azure Functions](https://channel9.msdn.com/Events/Connect/2017/E102)

I am curious to know your thoughts and challenges, so please share this with your colleagues and post your comments and feedback. For more lift-and-shift resources, check out this “Bring Your Own Application” link: [https://aka.ms/byoa](https://aka.ms/byoa). Thanks!

![Jeremy Likness](/blog/2017-11-17_lift-and-shift-your-.net-app-to-azure/images/5.gif)
