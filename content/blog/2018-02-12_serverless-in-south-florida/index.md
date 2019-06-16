---
title: "Serverless in South Florida"
author: "Jeremy Likness"
date: 2018-02-12T15:03:26.768Z
years: "2018"
lastmod: 2019-06-13T10:44:41-07:00

description: "Contains videos of demos, full deck, and photo recap of South Florida Code Camp presentation about serverless applications on Azure including functions, logic apps, event grid, and app insights."

subtitle: "Recap of my presentation about Azure Functions, Logic Apps and Event Grid"
tags:
 - Serverless 
 - Azure 
 - Azure Functions 
 - Logic Apps 
 - Presentations 

image: "/blog/2018-02-12_serverless-in-south-florida/images/1.png" 
images:
 - "/blog/2018-02-12_serverless-in-south-florida/images/1.png" 
 - "/blog/2018-02-12_serverless-in-south-florida/images/2.gif" 


aliases:
    - "/serverless-in-south-florida-2fdc8147d3df"
---

#### Recap of my presentation about Azure Functions, Logic Apps and Event Grid

This year I attended the [South Florida Code Camp](http://www.fladotnet.com/codecamp) for the first time. The event is held on the [Nova University](http://www.nova.edu/) campus in Davie, Florida. My main session covered building serverless apps on Azure. I have the [full deck](#a66d) including video of demos embedded below, along with a section that contains [links to explore further examples and documentation](#9f32) and the GitHub repo for my sample code.




![image](/blog/2018-02-12_serverless-in-south-florida/images/1.png)

Presentation



I have to admit I was a bit spoiled when I left 32°F weather at home to experience 76°F weather in Florida. My hotel room wasn’t ready yet when I landed, so I took advantage of the extra time to explore the beach. I wasn’t disappointed!




The code camp itself was amazing. There was an overwhelming number of sessions being presented.

> {{<twitter 962330568913453057>}}


Well over 1,000 developers registered to attend the various talks. I took this quick picture of the lobby area before the first talk began.

> {{<twitter 962312534048075776>}}


For tradition, I kicked off the talk with a 360 degree photo to better “capture the moment.” Everyone had a great time participating. About 10 more attendees joined after the talk began, so it ended up being standing room only. There is a lot of interest in serverless applcations!




360 view of attendees at my serverless talk



I posted the full deck from the session that also contains videos for the demonstration portions.




Serverless presentation



There were four demos. The first walked through creating a simple serverless function in the Azure portal that triggers when a file is uploaded to blob storage and saves the filename to a queue. The video has no audio.




Create a serverless app in the Azure portal



For the next demo, I walked through creating a function locally and debugging it with the help of Storage Emulator and Cloud Explorer. This is based on a recent blog post titled [Azure Storage for Serverless .NET apps in Minutes](https://aka.ms/storage-article).




Create a serverless app locally with Visual Studio 2017



The source code from this demo is available in my [GitHub repo](https://github.com/JeremyLikness/ShortLink).

Next, I demonstrated building a Logic App that pulls the image from the queue from the first demo, connects with the Cognitive Services Vision API and retrieves a caption that describes the image, then posts it into a Slack channel. This video is also silent.




Create a Logic App from the Azure portal



I finished by covering Application Insights and how rich the metrics and analytics are for serverless applications. This video has no audio.




A demonstration of Application Insights



The deck contains several links for further reading. I have them summarized here:

*   [Learn more about triggers and bindings](https://jlik.me/cl7)
*   [Learn about proxies in Azure Functions](https://jlik.me/cl8)
*   [Azure Functions documentation](https://jlik.me/cl9)
*   [An Azure Functions real-world demo: Link Shortener](https://jlik.me/cma)
*   [Video: migrate an ASP. NET on premises app with SQL Server to a completely PaaS and serverless application in Azure](https://jlik.me/cmb)
*   [Logic Apps documentation](https://jlik.me/cmc)
*   [Real world Logic Apps example: social media analytics with Twitter](https://jlik.me/cmd)

Overall, I received positive feedback.

> {{<twitter 962395111706554368>}}

> {{<twitter 962396478990962690>}}

> {{<twitter 962418795758411776>}}

> {{<twitter 962452767913709568>}}

> {{<twitter 962480662233124864>}}


I look forward to evolving this talk and sharing it with more developers later this year! As always, you can see my upcoming talk schedule [here](https://blog.jeremylikness.com/upcoming-talks-eaf27ff8a3a7).

Regards,




![image](/blog/2018-02-12_serverless-in-south-florida/images/2.gif)
