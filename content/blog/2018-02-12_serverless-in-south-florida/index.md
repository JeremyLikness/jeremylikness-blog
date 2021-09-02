---
title: "Serverless in South Florida"
author: "Jeremy Likness"
date: 2018-02-12T15:03:26.768Z
years: "2018"
lastmod: 2019-06-13T10:44:41-07:00
comments: true

description: "Contains videos of demos, full deck, and photo recap of South Florida Code Camp presentation about serverless applications on Azure including functions, logic apps, event grid, and app insights."

subtitle: "Recap of my presentation about Azure Functions, Logic Apps and Event Grid"
tags:
 - Serverless 
 - Azure 
 - Azure Functions 
 - Logic Apps 
 - Presentation 

image: "/blog/2018-02-12_serverless-in-south-florida/images/1.png" 
images:
 - "/blog/2018-02-12_serverless-in-south-florida/images/1.png" 
 - "/blog/2018-02-12_serverless-in-south-florida/images/2.gif" 


aliases:
    - "/serverless-in-south-florida-2fdc8147d3df"
---

This year I attended the [South Florida Code Camp](http://www.fladotnet.com/codecamp) for the first time. The event is held on the [Nova University](http://www.nova.edu/) campus in Davie, Florida. My main session covered building serverless apps on Azure. I have the full deck including video of demos embedded below, along with a section that contains links to explore further examples and documentation and the GitHub repo for my sample code.

![Presentation](/blog/2018-02-12_serverless-in-south-florida/images/1.png)
<figcaption>Presentation</figcaption>

I have to admit I was a bit spoiled when I left 32°F weather at home to experience 76°F weather in Florida. My hotel room wasn’t ready yet when I landed, so I took advantage of the extra time to explore the beach. I wasn’t disappointed!

{{<custominstagram Be-39E0nJY2>}}

The code camp itself was amazing. There was an overwhelming number of sessions being presented.

{{<customtwitter 962330568913453057>}}

Well over 1,000 developers registered to attend the various talks. I took this quick picture of the lobby area before the first talk began.

{{<customtwitter 962312534048075776>}}

For tradition, I kicked off the talk with a 360 degree photo to better “capture the moment.” Everyone had a great time participating. About 10 more attendees joined after the talk began, so it ended up being standing room only. There is a lot of interest in serverless applcations!

{{<kuula 7l80t>}}
<figcaption>360 view of attendees at my serverless talk</figcaption>

I posted the full deck from the session that also contains videos for the demonstration portions.

{{<slideshare soFcYVUQMeBjPO "jeremylikness/code-first-in-the-cloud-going-serverless-with-azure">}}
<figcaption>Serverless presentation</figcaption>

There were four demos. The first walked through creating a simple serverless function in the Azure portal that triggers when a file is uploaded to blob storage and saves the filename to a queue. The video has no audio.

{{<youtube pxfEVKRwcvI>}}
<figcaption>Create a serverless app in the Azure portal</figcaption>

For the next demo, I walked through creating a function locally and debugging it with the help of Storage Emulator and Cloud Explorer. This is based on a recent blog post titled [Azure Storage for Serverless .NET apps in Minutes](https://aka.ms/storage-article).

{{<youtube QNwZdfx4sp8>}}
<figcaption>Create a serverless app locally with Visual Studio 2017</figcaption>

The source code from this demo is available in my repo: {{<github "JeremyLikness/ShortLink">}}

Next, I demonstrated building a Logic App that pulls the image from the queue from the first demo, connects with the Cognitive Services Vision API and retrieves a caption that describes the image, then posts it into a Slack channel. This video is also silent.

{{<youtube 55eNR8ADpMY>}}
<figcaption>Create a Logic App from the Azure portal</figcaption>

I finished by covering Application Insights and how rich the metrics and analytics are for serverless applications. This video has no audio.

{{<youtube pxfEVKRwcvI>}}
<figcaption>A demonstration of Application Insights</figcaption>

The deck contains several links for further reading. I have them summarized here:

* [Learn more about triggers and bindings](https://docs.microsoft.com/en-us/azure/azure-functions/functions-triggers-bindings?utm_source=jeliknes&utm_medium=presentation&utm_campaign=serverless&WT.mc_id=serverless-presentation-jeliknes)
* [Learn about proxies in Azure Functions](https://docs.microsoft.com/en-us/azure/azure-functions/functions-proxies?utm_source=jeliknes&utm_medium=presentation&utm_campaign=serverless&WT.mc_id=serverless-presentation-jeliknes)
* [Azure Functions documentation](https://docs.microsoft.com/en-us/azure/azure-functions/?utm_source=jeliknes&utm_medium=presentation&utm_campaign=serverless&WT.mc_id=serverless-presentation-jeliknes)
* [An Azure Functions real-world demo: Link Shortener](https://blog.jeremylikness.com/build-a-serverless-link-shortener-with-analytics-faster-than-finishing-your-latte-8c094bb1df2c?WT.mc_id=serverless-presentation-jeliknes)
* [Video: migrate an ASP. NET on premises app with SQL Server to a completely PaaS and serverless application in Azure](https://channel9.msdn.com/Events/Connect/2017/E102?utm_source=jeliknes&utm_medium=presentation&utm_campaign=serverless&WT.mc_id=serverless-presentation-jeliknes)
* [Logic Apps documentation](https://docs.microsoft.com/en-us/azure/logic-apps/logic-apps-overview?utm_source=jeliknes&utm_medium=presentation&utm_campaign=serverless&WT.mc_id=serverless-presentation-jeliknes)
* [Real world Logic Apps example: social media analytics with Twitter](https://blog.jeremylikness.com/serverless-twitter-analytics-with-cosmosdb-and-logic-apps-280e5ff6c948?WT.mc_id=serverless-presentation-jeliknes)

Overall, I received positive feedback.

{{<customtwitter 962395111706554368>}}

{{<customtwitter 962396478990962690>}}

{{<customtwitter 962418795758411776>}}

{{<customtwitter 962452767913709568>}}

I look forward to evolving this talk and sharing it with more developers later this year! As always, you can see my upcoming talk schedule [here](/upcoming-talks-eaf27ff8a3a7).

Regards,

![Jeremy Likness](/blog/2018-02-12_serverless-in-south-florida/images/2.gif)
