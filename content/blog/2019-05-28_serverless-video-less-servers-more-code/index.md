---
title: "Serverless Video: Less Servers, More Code"
author: "Jeremy Likness"
date: 2019-05-28T17:53:15.648Z
years: "2019"
lastmod: 2019-06-13T10:45:51-07:00
canonicalUrl: "https://medium.com/microsoftazure/serverless-video-less-servers-more-code-4b360a50ed7d"

description: "A video that covers the definition of serverless, describes scenarios that serverless makes sense and provides practical, working examples using Azure Functions, Logic Apps, and Event Grid."

subtitle: "Learn about the Azure serverless platform and how Azure Functions, Event Grid, and Logic Apps work together to deliver cloud native experiences."
tags:
 - Serverless 
 - Azure 
 - Azure Functions 
 - Logic Apps 
 - Cloud Native
 - Presentation

image: "/blog/2019-05-28_serverless-video-less-servers-more-code/images/1.png" 
images:
 - "/blog/2019-05-28_serverless-video-less-servers-more-code/images/1.png" 

aliases:
    - "/serverless-video-less-servers-more-code-4b360a50ed7d"
---

_Serverless_. It’s a word that marketing teams around the world love to associate with cloud-based offerings, but what does it really mean? What’s the difference between fully managed offerings and true “serverless?” Are there _really_ no servers involved? Should you migrate existing application services to serverless? How do you decide what new projects should incorporate serverless?

![Image showing elements of serverless](/blog/2019-05-28_serverless-video-less-servers-more-code/images/1.png)

The following video was recorded as part of [Microsoft Ignite | The Tour](https://www.microsoft.com/en-us/events?utm_source=jeliknes&utm_medium=blog&utm_campaign=azuremedium&WT.mc_id=azuremedium-blog-jeliknes) and answers these questions. It starts by explaining the difference between serverless and other cloud application models, then explores various components of the Azure serverless platform including [Azure Functions](https://docs.microsoft.com/en-us/azure/azure-functions/functions-overview?utm_source=jeliknes&utm_medium=blog&utm_campaign=azuremedium&WT.mc_id=azuremedium-blog-jeliknes), [Logic Apps](https://docs.microsoft.com/en-us/azure/logic-apps/logic-apps-overview?utm_source=jeliknes&utm_medium=blog&utm_campaign=azuremedium&WT.mc_id=azuremedium-blog-jeliknes), and [Event Grid](https://docs.microsoft.com/en-us/azure/event-grid/?utm_source=jeliknes&utm_medium=blog&utm_campaign=azuremedium&WT.mc_id=azuremedium-blog-jeliknes). Uncover the scenarios that make sense for serverless and see it in action with hands-on demos you can run yourself.

In this video you will see:

* An example of how serverless automatically scales to handle incoming requests without user intervention
* The use of serverless publisher/subscriber infrastructure to communicate between applications and trigger business events
* How to implement long-running stateful workflows
* Integrations built from scratch that can respond in real-time to events and trigger emails or interact with machine learning services to describe images

Microsoft Ignite | The Tour was an event that spanned the globe and featured presentations about new ways to code, how to optimize your cloud infrastructure and approaches to modernization. The tour introduced Tailwind Traders and a set of integrated applications designed to showcase enterprise cloud applications. This session explains how Tailwind Traders uses serverless to handle inventory transactions including queries at scale, workflows that manage the lifecycle of inventory items, and integrations that send email notifications for important events and auto-generate captions when inventory images are uploaded.

{{<customtwitter 1070729872803282944>}}

All of the code in the presentation is open source and available for you to download, build, run locally and deploy to Azure.

[<i class="fab fa-github"></i> microsoft/IgniteTheTour](https://github.com/microsoft/IgniteTheTour/tree/master/DEV%20-%20Building%20your%20Applications%20for%20the%20Cloud/DEV50)

Without further ado, here is your video!

{{<youtube NZYSID8snjI>}}

This presentation is just one of over [140 videos](https://www.youtube.com/playlist?list=PLdCmSpvbJIBu1pJsda22C8XGTRFMvNB4T) recorded as part of the tour. You can access them all via [this playlist](https://www.youtube.com/playlist?list=PLdCmSpvbJIBu1pJsda22C8XGTRFMvNB4T).

Did the video help clarify for you what serverless is and how it relates to your work? Do you have any questions or feedback? Please use the comments below and let us know your thoughts!
