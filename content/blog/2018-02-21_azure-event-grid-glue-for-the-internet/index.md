---
title: "Azure Event Grid: Glue for the Internet"
author: "Jeremy Likness"
date: 2018-02-21T13:24:48.860Z
years: "2018"
lastmod: 2019-06-13T10:44:42-07:00
comments: true

description: "Learn about the serverless publisher/subscriber (“pubsub”) service in Azure called Event Grid. Includes presentation, photos, and source code."

subtitle: "Serverless publisher/subscriber for all of us"
tags:
 - Azure 
 - Pub Sub 
 - Serverless 
 - Event Grid 
 - Azure Functions 

image: "/blog/2018-02-21_azure-event-grid-glue-for-the-internet/images/1.jpeg" 
images:
 - "/blog/2018-02-21_azure-event-grid-glue-for-the-internet/images/1.jpeg" 
 - "/blog/2018-02-21_azure-event-grid-glue-for-the-internet/images/2.png" 
 - "/blog/2018-02-21_azure-event-grid-glue-for-the-internet/images/3.png" 
 - "/blog/2018-02-21_azure-event-grid-glue-for-the-internet/images/4.png" 
 - "/blog/2018-02-21_azure-event-grid-glue-for-the-internet/images/5.png" 
 - "/blog/2018-02-21_azure-event-grid-glue-for-the-internet/images/6.gif" 


aliases:
    - "/azure-event-grid-glue-for-the-internet-e770d94cc29"
---

February 20th, 2018 I attended the [Azure in the ATL meetup group](https://www.meetup.com/Azure-in-the-ATL/events/243464450/) to share a presentation about [Event Grid](https://aka.ms/event-docs). The feature reached [general availability](https://azure.microsoft.com/en-us/blog/announcing-the-general-availability-of-azure-event-grid/?utm_source=jeliknes&utm_medium=blog&utm_campaign=link&WT.mc_id=link-blog-jeliknes) in January and I expect it is more powerful than many developers are aware. I like to think of Event Grid as “serverless publisher/subscriber” because with a few clicks you can have a fully functional event-driven pubsub backbone up and running without worrying about the infrastructure.

![Event Grid meetup](/blog/2018-02-21_azure-event-grid-glue-for-the-internet/images/1.jpeg)
<figcaption>Event Grid meetup</figcaption>

The features Event Grid provides include:

* Event routing
* Near real-time event delivery
* Automated publications and subscriptions from Azure resources
* Platform and language agnostic services (yes, you can publish from your Go app running on Linux and subscribe with AWS Lambda if you like)

As of this writing, the [pricing of Event Grid](https://azure.microsoft.com/en-us/pricing/details/event-grid/?utm_source=jeliknes&utm_medium=blog&utm_campaign=link&WT.mc_id=link-blog-jeliknes) is U.S. $0.60 per million operations with the first 100,000 each month free. That comes with some very impressive service level agreements.

![Event Grid performance](/blog/2018-02-21_azure-event-grid-glue-for-the-internet/images/2.png)
<figcaption>Event Grid performance</figcaption>

I shared a comparison between Event Grid and other services like [Event Hubs](https://docs.microsoft.com/en-us/azure/event-hubs/?utm_source=jeliknes&utm_medium=blog&utm_campaign=link&WT.mc_id=link-blog-jeliknes) and [Service Bus](https://docs.microsoft.com/en-us/azure/service-bus-messaging/?utm_source=jeliknes&utm_medium=blog&utm_campaign=link&WT.mc_id=link-blog-jeliknes). For a more in-depth explanation I recommend the excellent blog post by [Clemens Vasters](https://twitter.com/clemensv) titled [Events, Data Points, and Messages: Choosing the right Azure messaging service for your data](https://azure.microsoft.com/en-us/blog/events-data-points-and-messages-choosing-the-right-azure-messaging-service-for-your-data/?utm_source=jeliknes&utm_medium=blog&utm_campaign=link&WT.mc_id=link-blog-jeliknes). I walked through the components of Event Grid and then jumped into two demos.

The audience had a great time participating in our 360 degree picture.

{{<kuula 7lxGH >}}
<figcaption>A fun crowd in glorious 360 degrees</figcaption>

For the first demo I created a custom Event Grid topic, then live-coded a cross-platform .NET Core 2.0 console app. The goal was to demonstrate how easy it is to publish to Event Grid even without using any special SDKs — the demo relied solely on the built-in HTTP client that ships with .NET Core. After creating the publisher, I hooked up a [Logic App](https://docs.microsoft.com/en-us/azure/logic-apps/?utm_source=jeliknes&utm_medium=blog&utm_campaign=link&WT.mc_id=link-blog-jeliknes) to receive the messages that sent me an email almost immediately. Although that part was written live, all of the functionality is part of the second demo that I have [available on GitHub](https://github.com/JeremyLikness/Event-Grid-Glue).

The second demo was more involved.

![Image app architecture](/blog/2018-02-21_azure-event-grid-glue-for-the-internet/images/3.png)
<figcaption>Image app architecture</figcaption>

The flow looks like this:

* A console app publishes a message with the URL to an image
* An <i class="fab fa-github"></i> [Azure function](https://github.com/JeremyLikness/Event-Grid-Glue/blob/master/ImageGrabber/ImageGrabberHost.cs#L22-L92) is invoked that reads the image, stores the bytes into [Blob Storage](https://docs.microsoft.com/en-us/azure/storage/blobs/storage-blobs-introduction?utm_source=jeliknes&utm_medium=blog&utm_campaign=link&WT.mc_id=link-blog-jeliknes) and then loads some metadata into [Table Storage](https://docs.microsoft.com/en-us/azure/storage/tables/table-storage-overview?utm_source=jeliknes&utm_medium=blog&utm_campaign=link&WT.mc_id=link-blog-jeliknes)
* A Logic App also subscribes to the same event, and leverages the [Computer Vision API](https://docs.microsoft.com/en-us/azure/cognitive-services/computer-vision/overview?utm_source=jeliknes&utm_medium=blog&utm_campaign=link&WT.mc_id=link-blog-jeliknes) to obtain a caption for the image, then updates Table Storage with the description

![Logic App for captioning](/blog/2018-02-21_azure-event-grid-glue-for-the-internet/images/4.png)
<figcaption>Logic App for captioning</figcaption>

* An <i class="fab fa-github"></i> [Angular client app](https://github.com/JeremyLikness/Event-Grid-Glue/tree/master/imageApp/src/app) then uses <i class="fab fa-github"></i> [this function](https://github.com/JeremyLikness/Event-Grid-Glue/blob/master/ImageGrabber/ImageGrabberHost.cs#L193-L209) to list images and <i class="fab fa-github"></i> [this function](https://github.com/JeremyLikness/Event-Grid-Glue/blob/master/ImageGrabber/ImageGrabberHost.cs#L138-L191) to render them

Although I’ve seen a few misses (for example, in one pass the API decided a toy figure of superman was a woman wearing a costume), for the most part the results are impressive and match the pictures provided. Here are some of the images I’ve loaded over time. All of these were triggered by Event Grid and captioned with the Computer Vision API.

![Event Grid image app](/blog/2018-02-21_azure-event-grid-glue-for-the-internet/images/5.png)
<figcaption>Event Grid image app</figcaption>

You can view the full deck here:

{{<slideshare Krce2CoRcbrtyx "jeremylikness/azure-event-grid-glue-for-the-internet">}}
<figcaption>Event Grid: Glue for the Internet</figcaption>

All of the source code is available <i class="fab fa-github"></i> [here](https://github.com/JeremyLikness/Event-Grid-Glue).

Until next time,

![Jeremy Likness](/blog/2018-02-21_azure-event-grid-glue-for-the-internet/images/6.gif)
