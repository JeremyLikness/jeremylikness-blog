---
title: "NoSQL and Azure Cosmos DB in 20 Minutes"
author: "Jeremy Likness"
date: 2018-05-10T19:57:15.332Z
years: "2018"
lastmod: 2019-06-13T10:44:59-07:00

description: "A brief overview of NoSQL (including key/value stores, column databases, document databases, and graphs) for SQL developers and how to implement a fully managed cloud solution using Azure Cosmos DB."

subtitle: "Everything you need to know about non-relational databases and how to use Azure Cosmos DB to stand up your own cloud-based solutions."
tags:
 - Big Data 
 - Azure 
 - Cosmosdb 
 - NoSQL 
 - Mongodb 

image: "/blog/2018-05-10_nosql-and-azure-cosmos-db-in-20-minutes/images/1.png" 
images:
 - "/blog/2018-05-10_nosql-and-azure-cosmos-db-in-20-minutes/images/1.png" 
 - "/blog/2018-05-10_nosql-and-azure-cosmos-db-in-20-minutes/images/2.gif" 


aliases:
    - "/nosql-and-azure-cosmos-db-in-20-minutes-9d0c3e0279dc"
---

#### Everything you need to know about non-relational databases and how to use Azure Cosmos DB to stand up your own cloud-based solutions.

At [Build 2018](https://www.youtube.com/playlist?list=PLlrxD0HtieHg7uB3_amVXvaRgxIcXLtYD) I had the opportunity to present a short theater session focused on Azure Cosmos DB. I decided to divide the presentation into two parts. The first is an overview of relational databases and how they relate (see what I did there?) to non-relational or NoSQL databases. The second part demonstrates how Azure Cosmos DB provides a fully managed implementation of NoSQL that supports multiple APIs.




![image](/blog/2018-05-10_nosql-and-azure-cosmos-db-in-20-minutes/images/1.png)

Photo: [https://twitter.com/remotesynth/status/994344640751943680](https://twitter.com/remotesynth/status/994344640751943680)



I demoed two projects as part of the talk. The full USDA database example implemented with the Mongo DB API is available here:

[JeremyLikness/explore-cosmos-db](https://github.com/JeremyLikness/explore-cosmos-db)


The flights example leveraging the Gremlin Graph API and the SQL API is available here:

[anthonychu/cosmosdb-gremlin-flights](https://github.com/anthonychu/cosmosdb-gremlin-flights)


You can download the full deck by [clicking here](https://jlikme.blob.core.windows.net/presentations/THR3511_Likness.pptx). One topic I was not able to cover in detail is consistency levels. This can be confusing to developers who haven’t worked with distributed non-relational databases, so I wrote a blog post to help explain consistency levels using the analogy of a billiards tournament.

[Getting Behind the 9-Ball: CosmosDB Consistency Levels](https://blog.jeremylikness.com/cloud-nosql-azure-cosmosdb-consistency-levels-cfe8348686e6)


This is the full video of my Build presentation:






If you like what you see and want to dig deeper, be sure to check out the recap from my [full hour presentation](https://blog.jeremylikness.com/dotnext-piter-2018-recap-91fbd02c67fa#a219) at the DotNext conference. You can download the larger deck that has more explanations and details, as well as watch that presentation once the video becomes publicly available.

A few other blog posts you may want to explore:

*   [Video: getting started with the SQL API](https://blog.jeremylikness.com/getting-started-with-cosmosdb-sql-api-da52719f30de)
*   [Integrating Azure Cosmos DB with Power BI](https://blog.jeremylikness.com/exploring-cosmosdb-with-powerbi-9192317087d8)
*   [Expanding Azure Functions to the Cosmos](https://blog.jeremylikness.com/expanding-azure-functions-to-the-cosmos-423d0cb920a)

Ready to get started? You can [click here](https://jlik.me/dhi) to get started with the full Azure Cosmos DB documentation.

Regards,




![image](/blog/2018-05-10_nosql-and-azure-cosmos-db-in-20-minutes/images/2.gif)
