---
title: "Explore the Cosmos (DB) with .NET Core 2.0"
author: "Jeremy Likness"
date: 2017-08-29T11:40:48.294Z
lastmod: 2019-06-13T10:43:44-07:00

description: "Learn about the Azure CosmosDB database w/ DocumentDB, MongoDB, Gremlin (Graph) and Table storage APIs and .NET Core 2.0 examples."

subtitle: "Learn about the Azure CosmosDB database w/ DocumentDB, MongoDB, Gremlin (Graph) and Table storage APIs and .NET Core 2.0 examples."
tags:
 - Presentations 
 - Dotnet Core 
 - Cosmosdb 
 - NoSQL 
 - Mongodb 

image: "/blog/2017-08-29_explore-the-cosmos-db-with-.net-core-2.0/images/1.png" 
images:
 - "/blog/2017-08-29_explore-the-cosmos-db-with-.net-core-2.0/images/1.png" 
 - "/blog/2017-08-29_explore-the-cosmos-db-with-.net-core-2.0/images/2.gif" 


aliases:
    - "/explore-the-cosmos-db-with-net-core-2-0-aab48423dcdc"
---

#### Learn about Azure’s CosmosDB database offering that provides DocumentDB, MongoDB, Gremlin (Graph) and Table storage APIs with examples written in C# on .NET Core 2.0.

I presented a talk about what I consider to be Azure’s premiere serverless database offering to the [Atlanta .NET User Group](https://www.meetup.com/Atlanta-Net-User-Group/) on the evening of Monday, August 28th 2017. Here is the [link to the event](https://www.meetup.com/Atlanta-Net-User-Group/events/242342714/).




![image](/blog/2017-08-29_explore-the-cosmos-db-with-.net-core-2.0/images/1.png)

Explore the Cosmos (DB)



Technology moves at such a fast pace it is often difficult to keep up with the latest innovations. I was happy to learn that many of the attendees did not have much exposure to [CosmosDB](http://bit.ly/2wexUIF) and therefore had the opportunity to learn something new. The audience was kind enough to participate in a group 360° photo.






The presentation was fun, especially due to some technical challenges I faced when trying to run Docker containers. I’m not sure why my Docker host was resisting, but fortunately I prepare for all contingencies and had the Docker images available in a repository and running in an Azure Container Instance to demo.

> {{<twitter 902322865655209985>}}


Despite the challenges, feedback was positive.

> {{<twitter 902325305477664768>}}


I received a lot of great questions, and promised to follow-up with answers:

*   Does CosmosDB support sharding? Short answer is yes, that concept is supported. Here is more information about [how to partition and scale a CosmosDB](http://bit.ly/2wl72p3).
*   Strong consistency and eventual consistency were well-understood, but there were a lot of questions about the other consistency levels available. You can learn more about those in this article about [tuning data consistency levels](http://bit.ly/2iFmXeD).
*   How does CosmosDB integrate with Azure’s serverless “functions” offering? Read about [CosmosDB Azure Functions bindings](http://bit.ly/2wZJ5FQ).
*   Can you use the MongoDB driver if you choose the DocumentDB API? No, not in the current implementation. You must specify MongoDB as the API in order to use the MongoDB driver.
*   How do you migrate data into CosmosDB? Use the [data migration tool](http://bit.ly/2vAGizu).
*   Is it possible to test CosmosDB applications locally? Yes, there is a [local emulator](http://bit.ly/2wFU7QM).

If you have other questions, take a look at the [CosmosDB FAQ](http://bit.ly/2xJfgGI) and if that doesn’t answer them, reach out to me!

I also had a question about understanding document databases from the perspective of a relational developer. I recently published a blog post to address those concerns directly:

[JSON and the MongoDB Driver for the .NET Developer](https://blog.jeremylikness.com/json-and-the-mongodb-driver-for-the-net-developer-d4a6aacd8bcd)


I also published a public GitHub repository with .NET Core 2.0 code that:

*   Imports data from the USDA nutrient database into a CosmosDB instance
*   Exposes a Web API to query the data
*   Provides a simple single page web application to browse the data
[JeremyLikness/explore-cosmos-db](https://github.com/JeremyLikness/explore-cosmos-db)


Finally, here is the full deck from my presentation.




Slideshare Presentation Deck



(Video is coming soon!)

Thank you,




![image](/blog/2017-08-29_explore-the-cosmos-db-with-.net-core-2.0/images/2.gif)
