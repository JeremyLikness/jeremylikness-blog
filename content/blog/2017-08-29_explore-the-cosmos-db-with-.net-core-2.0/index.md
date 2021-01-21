---
title: "Explore the Cosmos (DB) with .NET Core 2.0"
author: "Jeremy Likness"
date: 2017-08-29T11:40:48.294Z
years: "2017"
lastmod: 2019-06-13T10:43:44-07:00
comments: true

description: "Learn about the Azure CosmosDB database w/ DocumentDB, MongoDB, Gremlin (Graph) and Table storage APIs and .NET Core 2.0 examples."

subtitle: "Learn about the Azure CosmosDB database w/ DocumentDB, MongoDB, Gremlin (Graph) and Table storage APIs and .NET Core 2.0 examples."
tags:
 - Presentation 
 -  .NET Core 
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

I presented a talk about what I consider to be Azure’s premiere serverless database offering to the [Atlanta .NET User Group](https://www.meetup.com/Atlanta-Net-User-Group/) on the evening of Monday, August 28th 2017. Here is the [link to the event](https://www.meetup.com/Atlanta-Net-User-Group/events/242342714/).

![Explore the Cosmos (DB)](/blog/2017-08-29_explore-the-cosmos-db-with-.net-core-2.0/images/1.png)
<figcaption>Explore the Cosmos (DB)</figcaption>

Technology moves at such a fast pace it is often difficult to keep up with the latest innovations. I was happy to learn that many of the attendees did not have much exposure to [CosmosDB](http://bit.ly/2wexUIF) and therefore had the opportunity to learn something new. The audience was kind enough to participate in a group 360° photo.

{{<kuula 7lkF6>}}

The presentation was fun, especially due to some technical challenges I faced when trying to run Docker containers. I’m not sure why my Docker host was resisting, but fortunately I prepare for all contingencies and had the Docker images available in a repository and running in an Azure Container Instance to demo.

{{<customtwitter 902322865655209985>}}

Despite the challenges, feedback was positive.

{{<customtwitter 902325305477664768>}}

I received a lot of great questions, and promised to follow-up with answers:

* Does CosmosDB support sharding? Short answer is yes, that concept is supported. Here is more information about [how to partition and scale a CosmosDB](https://docs.microsoft.com/en-us/azure/cosmos-db/partitioning-overview?utm_source=jeliknes&utm_medium=blog&utm_campaign=link&WT.mc_id=link-blog-jeliknes).
* Strong consistency and eventual consistency were well-understood, but there were a lot of questions about the other consistency levels available. You can learn more about those in this article about [tuning data consistency levels](https://docs.microsoft.com/en-us/azure/cosmos-db/consistency-levels?utm_source=jeliknes&utm_medium=blog&utm_campaign=link&WT.mc_id=link-blog-jeliknes).
* How does CosmosDB integrate with Azure’s serverless “functions” offering? Read about [CosmosDB Azure Functions bindings](https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-cosmosdb?utm_source=jeliknes&utm_medium=blog&utm_campaign=link&WT.mc_id=link-blog-jeliknes).
* Can you use the MongoDB driver if you choose the DocumentDB API? No, not in the current implementation. You must specify MongoDB as the API in order to use the MongoDB driver.
* How do you migrate data into CosmosDB? Use the [data migration tool](https://docs.microsoft.com/en-us/azure/cosmos-db/import-data?utm_source=jeliknes&utm_medium=blog&utm_campaign=link&WT.mc_id=link-blog-jeliknes).
* Is it possible to test CosmosDB applications locally? Yes, there is a [local emulator](https://docs.microsoft.com/en-us/azure/cosmos-db/local-emulator?utm_source=jeliknes&utm_medium=blog&utm_campaign=link&WT.mc_id=link-blog-jeliknes).

If you have other questions, take a look at the [CosmosDB FAQ](https://docs.microsoft.com/en-us/azure/cosmos-db/faq?utm_source=jeliknes&utm_medium=blog&utm_campaign=link&WT.mc_id=link-blog-jeliknes) and if that doesn’t answer them, reach out to me!

I also had a question about understanding document databases from the perspective of a relational developer. I recently published a blog post to address those concerns directly:

{{<relativelink "/blog/2017-08-27_json-and-the-mongodb-driver-for-the-.net-developer">}}

I also published a public GitHub repository with .NET Core 2.0 code that:

* Imports data from the USDA nutrient database into a CosmosDB instance
* Exposes a Web API to query the data
* Provides a simple single page web application to browse the data

{{<github "JeremyLikness/explore-cosmos-db">}}

Finally, here is the full deck from my presentation.

{{<slideshare "11x1KZfgLbJQ2U" "jeremylikness/explore-the-cosmos-db-with-net-core-20">}}

Thank you,

![Jeremy Likness](/blog/2017-08-29_explore-the-cosmos-db-with-.net-core-2.0/images/2.gif)
