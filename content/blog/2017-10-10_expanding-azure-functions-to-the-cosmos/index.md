---
title: "Expanding Azure Functions to the Cosmos"
author: "Jeremy Likness"
date: 2017-10-10T11:46:25.245Z
lastmod: 2019-06-13T10:44:08-07:00

description: "Serverless data platform CosmosDB meets serverless compute platform Azure Functions in this example based on a URL link shortener that is used to track click-through metrics."

subtitle: "A quick demonstration of creating CosmosDB documents using the DocumentDB interface binding in Azure Functions."
tags:
 - Azure 
 - Azure Functions 
 - Cosmosdb 
 - NoSQL 
 - Serverless 

image: "/blog/2017-10-10_expanding-azure-functions-to-the-cosmos/images/1.gif" 
images:
 - "/blog/2017-10-10_expanding-azure-functions-to-the-cosmos/images/1.gif" 
 - "/blog/2017-10-10_expanding-azure-functions-to-the-cosmos/images/2.jpeg" 
 - "/blog/2017-10-10_expanding-azure-functions-to-the-cosmos/images/3.jpeg" 
 - "/blog/2017-10-10_expanding-azure-functions-to-the-cosmos/images/4.jpeg" 
 - "/blog/2017-10-10_expanding-azure-functions-to-the-cosmos/images/5.jpeg" 
 - "/blog/2017-10-10_expanding-azure-functions-to-the-cosmos/images/6.jpeg" 
 - "/blog/2017-10-10_expanding-azure-functions-to-the-cosmos/images/7.jpeg" 
 - "/blog/2017-10-10_expanding-azure-functions-to-the-cosmos/images/8.gif" 


aliases:
    - "/expanding-azure-functions-to-the-cosmos-423d0cb920a"
---

#### A quick demonstration of creating CosmosDB documents using the DocumentDB interface binding in Azure Functions.

Although I’m already [tracking basic metrics](https://youtu.be/pxfEVKRwcvI) with my [custom URL Shortener](https://blog.jeremylikness.com/build-a-serverless-link-shortener-with-analytics-faster-than-finishing-your-latte-8c094bb1df2c), it’s always been the plan to expand those analytics to gain deeper insights. I want answers to questions like, “What time of day results in the most click-throughs?” and “What keywords in the title are the most popular?” Collecting that data requires a bit more than generating custom events in [Application Insights](https://jlik.me/bog). Instead, I am collecting the data in a [CosmosDB] (https://jlik.me/boh)database instance.




![image](/blog/2017-10-10_expanding-azure-functions-to-the-cosmos/images/1.gif)

Exploring data in CosmosDB



If you’re not familiar with CosmosDB, take a minute to review the recap of a user group presentation I recently gave.

[Explore the Cosmos (DB) with .NET Core 2.0](https://blog.jeremylikness.com/explore-the-cosmos-db-with-net-core-2-0-aab48423dcdc)


Also, this article is based on the URL shortening tool I described here:

[Build a Serverless Link Shortener with Analytics Faster than Finishing your Latte](https://blog.jeremylikness.com/build-a-serverless-link-shortener-with-analytics-faster-than-finishing-your-latte-8c094bb1df2c)


You can see this in more detail (and it action) by watching the online demo and interview I did for Channel 9’s Visual Studio Toolbox:

[CosmosDB: Serverless NoSQL for the .NET Developer](https://jlik.me/b35)


After sharing my URL shortening strategy in the previous article, I updated the application to build my functions in C# from Visual Studio. I compile them and publish them rather than using the scripted version (.CSX) that is available from the portal for better performance. The source code for the updated project is available here:

[JeremyLikness/jlik.me](https://github.com/JeremyLikness/jlik.me)


The “goods” or source code for most of the functions is available in`[FunctionHost.cs](https://github.com/JeremyLikness/jlik.me/blob/master/FunctionHost.cs)`. Check it out!

#### The Spark of Creation

The first step is to create the account to host the database. In the Azure Portal, it’s as easy as choosing the CosmosDB option.




![image](/blog/2017-10-10_expanding-azure-functions-to-the-cosmos/images/2.jpeg)

Create a new CosmosDB instance



The next step is to specify a unique name for the database and choose your interface. This example will use the DocumentDB interface, a NoSQL document database option that supports queries using a SQL-like syntax.




![image](/blog/2017-10-10_expanding-azure-functions-to-the-cosmos/images/3.jpeg)

Filling out parameters for the new database



The final step I took was to set the consistency to “eventual.” This is because I’m only writing documents to query later so I don’t need transactions or heavy consistency across regions if I decide to scale later on.




![image](/blog/2017-10-10_expanding-azure-functions-to-the-cosmos/images/4.jpeg)

Choosing eventual consistency



That’s all I needed to do on the database side.

#### Keeping the Cosmos Secure

To connect securely to the database instance, my function app needs to know the end point and appropriate secret or “account key.” To get the keys, I navigated to the Keys section and clicked the clipboard next to “Primary Connection String.” The string contains both the end point and the access key. Notice that there are tabs for read/write and read-only connection strings. I’m choosing the former because I need to write data.




![image](/blog/2017-10-10_expanding-azure-functions-to-the-cosmos/images/5.jpeg)

Get the connection string



After the connection string was successfully copied to the clipboard, I navigated to my function app and chose “Application Settings.” I added a new setting named “CosmosDb” and pasted the connection string there.




![image](/blog/2017-10-10_expanding-azure-functions-to-the-cosmos/images/6.jpeg)

Adding the connection string to application settings



Now my secrets are safe. Next, I’ll focus on adding the binding to my function.

#### Gravitational Pull

A tremendous advantage of functions is the bindings system. This makes it easy to interact with other resources and helps avoid a lot of repeated code necessary just to set up connections. From my Visual Studio project, I used the NuGet package manager to install the client library for DocumentDB:

`Install-Package Microsoft.Azure.DocumentDB`

I also installed the extension that allows me to use attributes for bindings from source code:

`Install-Package Microsoft.Azure.WebJobs.Extensions.DocumentDB`

I already had a function in place to process the queue. The redirect function needs to execute as fast as possible, so it processes the redirect and puts information about the redirect into a queue. Another function is triggered by the queue and picks up the information to write out custom events and page views. Here is the signature for the function, with a parameter added for the database binding.




Notice that in the “DocumentDB” attribute, I specify the database name, the collection name, ask the binding to create these if they don’t exist, and pass the name of the application setting that holds the connection string. I don’t have to create the database or collection ahead of time! Also notice that the parameter is specified as “dynamic” and “out.” This enables me to set the value of the parameter to the document I wish to store, and the binding takes care of the rest!

At the end of my method after I’ve parsed out the page name and whether or not it has a custom event (the “custom event” points to the source, i.e. Twitter, LinkedIn, my blog, etc.) I assign the data I wish to store to the “doc” parameter.




I’m basically creating a unique identifier, storing the page and a count of “1” (remember, I write a new document for _every_ request because I want to process the times) and then optionally add the custom event. There is _no other code to write_. I’m done! The binding takes the parameter and writes it out, so I don’t need to write code to add to the collection. After updating this, I published it out and waited for the queue to process …




![image](/blog/2017-10-10_expanding-azure-functions-to-the-cosmos/images/7.jpeg)

Successfully processing a queue entry



Then used the data explorer in the portal to confirm the document was written properly.




And that’s it! I successfully added a CosmosDB binding to my pre-compiled C# function. Now I’m on the hook to build a dashboard on top of the data to start analyzing and answering questions, but that’s a task for a different day. For now I’m looking forward to storing a ton of data and monitoring my costs to see just how much this serverless database is going to charge me.

Read the next article to see how I process the CosmosDB information to produce an analytics dashboard in PowerBI:

[Exploring the CosmosDB with Power BI](https://blog.jeremylikness.com/exploring-cosmosdb-with-powerbi-9192317087d8)




![image](/blog/2017-10-10_expanding-azure-functions-to-the-cosmos/images/8.gif)
