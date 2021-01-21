---
title: "Atlanta Code Camp 2017: Serverless .NET"
author: "Jeremy Likness"
date: 2017-09-17T17:42:26.534Z
years: "2017"
lastmod: 2019-06-13T10:43:56-07:00
comments: true

description: "Recap of presentation about leveraging Azure Functions, Logic Apps, and Application Insights for .NET Serverless applications."

subtitle: "Recap of presentation about leveraging Azure Functions, Logic Apps, and Application Insights for .NET Serverless applications."
tags:
 - Serverless 
 - Azure 
 - Azure Functions 
 - Logic Apps 
 - Application Insights 

image: "/blog/2017-09-17_atlanta-code-camp-2017-serverless-.net/images/1.jpeg" 
images:
 - "/blog/2017-09-17_atlanta-code-camp-2017-serverless-.net/images/1.jpeg" 
 - "/blog/2017-09-17_atlanta-code-camp-2017-serverless-.net/images/2.jpeg" 
 - "/blog/2017-09-17_atlanta-code-camp-2017-serverless-.net/images/3.gif" 


aliases:
    - "/atlanta-code-camp-2017-serverless-net-da640edd59e9"
---

The [Atlanta Code Camp](https://www.atlantacodecamp.com) is an event I’ve attended for several years now. My past three companies have all sponsored the event. It’s held on the [Kennesaw State University Marietta campus](http://www.kennesaw.edu/maps/), a great venue with free parking, plenty of space for gathering, and good facilities for presenters. Although there are no official tracks, there are often groups of similar sessions that cover topics ranging from soft skills, open source software and JavaScript frameworks to cloud and DevOps. I spoke in a room that had several talks that covered serverless.

![.NET Serverless in Azure](/blog/2017-09-17_atlanta-code-camp-2017-serverless-.net/images/1.jpeg)
<figcaption>.NET Serverless in Azure</figcaption>

Although the presentation was scheduled for early afternoon (the second presentation after lunch) we had a packed room full of enthusiastic developers who were kind enough to consent to this 360° capture:

{{<kuula 7lvGj>}}
<figcaption>“And the crowd goes wild!”</figcaption>

The slide deck (linked at the end of this story) covers the evolution of deployment options from on-premises architecture through Infrastructure-as-a-Service (IaaS) and Platform-as-a-Service (PaaS) to Servless (and I emphasize that the same way NoSQL means “not only” SQL, Serverless really means “less server.”).

{{<customtwitter 909133579216662528>}}

{{<customtwitter 909131172357144576>}}

It also includes several business cases and examples for leveraging serverless functions.

The following (silent) video demonstrates how to set up a simple serverless [Azure Function](https://docs.microsoft.com/en-us/azure/azure-functions/functions-overview?utm_source=jeliknes&utm_medium=blog&utm_campaign=atlcodecode&WT.mc_id=atlcodecamp-blog-jeliknes) that listens to an HTTP endpoint and echoes back the name that is passed to it.

{{<youtube uuu6ZTsKgG8>}}
<figcaption>Part 1: Create an Azure Function from the Portal</figcaption>

Next, I walked through the same experience starting using Visual Studio 2017. In this example, the echo service is enhanced to also store the name in a queue for later processing.

{{<youtube kXPrPvmwd64>}}
<figcaption>Part 2: Create an Azure Function from Visual Studio</figcaption>

After the names are gathered in a queue, I show how easy it is to set up a trigger that listens to the queue, pulls the name from the queue, then uses [Azure Table Storage](https://docs.microsoft.com/en-us/azure/storage/tables/table-storage-overview?utm_source=jeliknes&utm_medium=blog&utm_campaign=atlcodecode&WT.mc_id=atlcodecamp-blog-jeliknes) to count the names.

{{<youtube oUJBa0tPr0Q>}}
<figcaption>Part 3: Create a Queue Trigger and use Table Storage</figcaption>

The audience submitted a few samples to process, and I highlighted my favorite.

![Table Storage Explorer](/blog/2017-09-17_atlanta-code-camp-2017-serverless-.net/images/2.jpeg)
<figcaption>Table Storage Explorer</figcaption>

After demonstrating function apps, I moved on to share the power of [Logic Apps](https://docs.microsoft.com/en-us/azure/logic-apps/logic-apps-overview?utm_source=jeliknes&utm_medium=blog&utm_campaign=atlcodecode&WT.mc_id=atlcodecamp-blog-jeliknes). These are cloud-based integrations and workflows that literally enable you to connect hundreds of end points ranging from web-hooks to APIs and more. Logic Apps support integrations with Office 365, Salesforce.com, Twilio, and many more third party platforms as well as Microsoft’s own Azure APIs like [Cognitive Services](https://docs.microsoft.com/en-us/azure/cognitive-services/?utm_source=jeliknes&utm_medium=blog&utm_campaign=atlcodecode&WT.mc_id=atlcodecamp-blog-jeliknes). This video shows how easy it is to set up a trigger that listens for a Twitter hashtag then posts the content to a Slack channel.

{{<youtube U5x8XJmYqJA>}}
<figcaption>Part 4: Logic App</figcaption>

The last part I covered is an important but often overlooked aspect of serverless: logging and analytics. Fortunately, this is extremely easy to add to your services with Azure [Application Insights](https://docs.microsoft.com/en-us/azure/azure-monitor/overview?utm_source=jeliknes&utm_medium=blog&utm_campaign=atlcodecode&WT.mc_id=atlcodecamp-blog-jeliknes). This feature has so much functionality that I wrote a separate blog post to cover it all:

🔗 [Real-Time Insights with Real-Low Effort](/real-time-insights-with-real-low-effort-7248e90048b1)

Here is the related video:

{{<youtube pxfEVKRwcvI>}}

This is the full deck that I presented:

{{<slideshare "1TNT9k0uCPIiow" "jeremylikness/going-serverless-with-azure-functions-in-net">}}

Thanks to everyone who attended. I had a great time and enjoyed networking with the developers there!

![Jeremy Likness](/blog/2017-09-17_atlanta-code-camp-2017-serverless-.net/images/3.gif)
