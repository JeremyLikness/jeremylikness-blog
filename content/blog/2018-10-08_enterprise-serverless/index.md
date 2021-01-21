---
title: "Enterprise Serverless"
author: "Jeremy Likness"
date: 2018-10-08T20:36:37.556Z
years: "2018"
lastmod: 2019-06-13T10:45:15-07:00
comments: true
toc: true

description: "Comprehensive presentation includes information about serverless with implementation illustrated in video demos  featuring Azure Functions, Azure Logic Apps, and Azure Event Grid."

subtitle: "The ghost isn’t in the machine, it is the machine!"
tags:
 - Serverless 
 - Azure 
 - Azure Functions 
 - Logic Apps 
 - Messaging 

image: "/blog/2018-10-08_enterprise-serverless/images/1.png" 
images:
 - "/blog/2018-10-08_enterprise-serverless/images/1.png" 
 - "/blog/2018-10-08_enterprise-serverless/images/2.gif" 


aliases:
    - "/enterprise-serverless-acc826616d4c"
---

I delivered a session at [TechBash 2018](https://techbash.com) about [serverless](https://docs.microsoft.com/en-us/dotnet/architecture/serverless/). It covers:

* What is serverless?
* Why is serverless useful?
* How is serverless implemented (with Azure examples)

![Image of first slide in deck](/blog/2018-10-08_enterprise-serverless/images/1.png)

You can download the full presentation ⬇ [here](https://jlikme.blob.core.windows.net/presentations/Enterprise-Serverless-TechBash.pptx).

{{<customtwitter 1047582372785532929>}}

I delivered several demos during the presentation that I pre-recorded to avoid Internet hiccups and edited to zoom to the right information. These are all “live” in the sense the only editing is cutting out some of the delays. The videos are designed to be self-explanatory and contain no audio.

## Azure Functions

The first demo illustrates creating a [serverless Azure Function](https://docs.microsoft.com/en-us/azure/azure-functions/?WT.mc_id=techbash18-blog-jeliknes) from the portal. In addition, it shows how auto-scale works. After creating the function, I run a load-balancing tool called [artillery](https://artillery.io/?WT.mc_id=techbash18-blog-jeliknes) to hit the endpoint 10,000 times and then show live metrics as it’s happening.

{{<youtube TSRM0zkHxJs>}}
<figcaption>Create an Azure Function and watch it scale</figcaption>

The next demo uses my open source serverless <i class="fab fa-github"></i> [ShortLink project](https://github.com/jeremylikness/shortlink) to illustrate how to publish it to the cloud.

{{<youtube G9tIdh6ZY8c>}}
<figcaption>Publish an Azure Function to Azure</figcaption>

## Logic Apps

I demonstrated a simple workflow to introduce [Logic Apps](https://docs.microsoft.com/en-us/azure/logic-apps/?WT.mc_id=techbash18-blog-jeliknes). The scenario is that I have “the world’s loneliest Slack channel” and need a way to get things going. I create a Logic App that triggers on a file upload. The workflow grabs the stream of bytes for an image, passes it over to the [Cognitive Services Computer Vision API](https://azure.microsoft.com/en-us/services/cognitive-services/computer-vision/?WT.mc_id=techbash18-blog-jeliknes) and applies some machine learning to create an automated caption. It then sends the results into the Slack channel. This is all built and demoed live.

{{<youtube PCkhgH2t6lA>}}
<figcaption>Visual Workflows with Azure Logic Apps</figcaption>

## Event Grid

I concluded the presentation with my favorite topic and what I believe is an underappreciated and underused service in Azure: [Event Grid](https://docs.microsoft.com/en-us/azure/event-grid/overview?WT.mc_id=techbash18-blog-jeliknes). The first demo shows how easy it is to connect different Azure services together with Event Grid by subscribing to a storage event from an Azure Function.

{{<youtube -XsPiF1ET6I>}}
<figcaption>Event Grid inside Azure</figcaption>

The next demo illustrates how to create a custom event that you can publish to from any language or platform and subscribe to from any platform that supports [WebHooks](https://docs.microsoft.com/en-us/azure/event-grid/event-handlers?WT.mc_id=techbash18-blog-jeliknes#webhooks).

{{<youtube MFFQBkFMoOk>}}
<figcaption>Event Grid outside Azure (REST API and WebHooks)</figcaption>

I hope you find this presentation and related demos informative and valuable. As always, comments, feedbacks, and suggestions are welcome. For a comprehensive look at the content from this session, be sure to view/download the free eBook “[Serverless apps: Architecture, patterns, and Azure implementation](https://docs.microsoft.com/en-us/dotnet/architecture/serverless/).”

Regards,

![Jeremy Likness](/blog/2018-10-08_enterprise-serverless/images/2.gif)
