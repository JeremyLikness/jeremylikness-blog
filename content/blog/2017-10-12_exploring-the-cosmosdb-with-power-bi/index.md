---
title: "Exploring the CosmosDB with Power BI"
author: "Jeremy Likness"
date: 2017-10-12T15:02:14.205Z
years: "2017"
lastmod: 2019-06-13T10:44:11-07:00

description: "Learn how I leveraged CosmosDB to store telemetry from a URL shortening tool, then analyze the data in a PowerBI dashboard."

subtitle: "Using Azure CosmosDB and PowerBI for data analytics."
tags:
 - Azure 
 - Cosmosdb 
 - Analytics 
 - Business Intelligence 
 - Social Media Marketing 

image: "/blog/2017-10-12_exploring-the-cosmosdb-with-power-bi/images/8.jpeg" 
images:
 - "/blog/2017-10-12_exploring-the-cosmosdb-with-power-bi/images/1.jpeg" 
 - "/blog/2017-10-12_exploring-the-cosmosdb-with-power-bi/images/2.jpeg" 
 - "/blog/2017-10-12_exploring-the-cosmosdb-with-power-bi/images/3.jpeg" 
 - "/blog/2017-10-12_exploring-the-cosmosdb-with-power-bi/images/4.jpeg" 
 - "/blog/2017-10-12_exploring-the-cosmosdb-with-power-bi/images/5.jpeg" 
 - "/blog/2017-10-12_exploring-the-cosmosdb-with-power-bi/images/6.jpeg" 
 - "/blog/2017-10-12_exploring-the-cosmosdb-with-power-bi/images/7.jpeg" 
 - "/blog/2017-10-12_exploring-the-cosmosdb-with-power-bi/images/8.jpeg" 
 - "/blog/2017-10-12_exploring-the-cosmosdb-with-power-bi/images/9.jpeg" 
 - "/blog/2017-10-12_exploring-the-cosmosdb-with-power-bi/images/10.gif" 


aliases:
    - "/exploring-cosmosdb-with-powerbi-9192317087d8"
---

#### The final step in my experiment to leverage serverless data and compute to build a URL shortening empire.

At the end of the day, the entire reason I [built a URL shortening tool](https://blog.jeremylikness.com/build-a-serverless-link-shortener-with-analytics-faster-than-finishing-your-latte-8c094bb1df2c) then [shoved the data into CosmosDB](https://blog.jeremylikness.com/expanding-azure-functions-to-the-cosmos-423d0cb920a) is for analytics. I want to understand which social mediums work best, what blog posts and articles people are interested in and when they engage. The database is slowly filling with metrics.




![image](/blog/2017-10-12_exploring-the-cosmosdb-with-power-bi/images/1.jpeg)

CosmosDB Activity



For now, I can leverage the data stored in Azure to answer my initial questions, but down the road I have even more ambitious plans, like:

*   Setting up a logic app to connect with the original post on Twitter or LinkedIn to map the difference between when it was tweeted vs. when the link was actually clicked
*   In the same logic app, grab keywords and hashtags from the post to analyze which words grab the most attention and result in the most engagement
*   Better understand the patterns that drive likes and shares/retweets
*   Add code to grab metadata like title and search terms from the target pages to better understand topics that people are clicking to, and possibly leverage machine learning to understand how the content of the tweet compared to the content of the landing page influences engagement

These are lofty goals, but the journey of a thousand miles starts with the first step. In my case, that step was cleaning up some data. I previously wrote about how I collect the data here:

[Expanding Azure Functions to the Cosmos](https://blog.jeremylikness.com/expanding-azure-functions-to-the-cosmos-423d0cb920a)


#### Watch the Video!

See this in action in my Channel 9 Visual Studio Toolbox interview:

[CosmosDB: Serverless NoSQL for the .NET Developer](https://jlik.me/b35)


#### A Quick Tangent: Clean Data

Initially when I scanned the CosmosDB data, I recognized some inconsistencies. Here’s what a sample entry in my collection looks like:




![image](/blog/2017-10-12_exploring-the-cosmosdb-with-power-bi/images/2.jpeg)

A CosmosDB Document



My algorithm to strip query strings from the pages wasn’t normalizing endings, so I was tracking this:

`docs.microsoft.com`

As a different page view than this:

`docs.microsoft.com/`

Changing the function that stores the data was easy enough, but I wanted to go back to previous documents and normalize those as well (basically just strip off the trailing `/` from documents that stored it that way). I created a simple Windows console application and added the NuGet package for the DocumentDB interface.

`Install-Package Microsoft.Azure.DocumentDB`

The following code to creates the database client and calls an asynchronous method to do the processing. The endpoint and key are both available in the Azure Portal.




The helpful `UriFactory` class (part of the DocumentDB library) generates endpoints for resources such as collections within a specific database. In this code, I create an endpoint and use it to specify a query. The query grabs all documents that have a “page” property ending with `/`.




I iterate the query to grab each document. Because the documents don’t conform to a specific schema (I have a property that counts the social medium that can change from “twitter” to “linkedin” etc.), I use the `dynamic` type for the documents. It’s as simple as grabbing the `page` property, confirm it ends with `/`, then strip the last character and replace the new document in the collection.




That’s it — I ran this program and in a few seconds my data was clean. One handy feature in the portal is the “Data Explorer” that lets you run queries directly, no programming required.




![image](/blog/2017-10-12_exploring-the-cosmosdb-with-power-bi/images/3.jpeg)

A Query in the Azure Portal



I ran it again and confirmed no new records were found. Ouch. They got me! Charged 84 request units to confirm there’s nothing there.

#### PowerBI for CosmosDB

[PowerBI] (https://jlik.me/bqi)is an enterprise business intelligence tool with a lot of functionality. There have been books written about it. You can download it from the link at the beginning of this paragraph. It’s free.

I’m no PowerBI expert, and only started using it recently to create my dashboard. Fortunately, the interface is intuitive enough that even I was able to figure things out. After launching the program, I was prompted to “Get Data”. Obviously, I picked “Azure” and “Cosmos DB” for my data source.




![image](/blog/2017-10-12_exploring-the-cosmosdb-with-power-bi/images/4.jpeg)

Selecting the Data Source



To access the data, I provided an endpoint and a read-only access key. I received a fun warning about how the connector to CosmosDB is in beta and my reports may break in the future, etc. I wasn’t too concerned because I’m not building a very complex dashboard (yet). The next step prompted me to select the columns to use for my analysis. I just said, “nah” to the internal columns and checked the interesting ones.




![image](/blog/2017-10-12_exploring-the-cosmosdb-with-power-bi/images/5.jpeg)

Picking Columns



I was then presented with a preview of the data. From the preview, I right-clicked on the column headers to change the types from alphanumeric to whole number, date/time, etc. and rename the columns to more “human readable” labels.




![image](/blog/2017-10-12_exploring-the-cosmosdb-with-power-bi/images/6.jpeg)

Changing the Column Type



Whew! Now that my data was mapped and loaded, I was ready to create my dashboard. I dragged a table widget onto the dashboard and chose the “page” and “count” columns. PowerBI recognized the count column was numeric and provided me a set of aggregate functions, so I chose to get the sum of values by page. After a bit of tweaking, I had my top page views. Note how huge the gap is between the top ten clicked pages and the rest of the data.

_Oops — my strategy for stripping query string backfired, as evidenced by the .NET Rocks! podcast which uses the query string to track the specific podcast number. I need those guys to change their strategy. OK, so I can make my code smarter to handle this too. Adding a backlog item now._




![image](/blog/2017-10-12_exploring-the-cosmosdb-with-power-bi/images/7.jpeg)

Top Page Views



A nice donut-hole graph gives me insights into the source of click-through events.




![image](/blog/2017-10-12_exploring-the-cosmosdb-with-power-bi/images/8.jpeg)

Redirects by Medium



Finally, a bar graph shows me the distribution of clicks by hour of day.




![image](/blog/2017-10-12_exploring-the-cosmosdb-with-power-bi/images/9.jpeg)



As you can see, noon is “prime time.” The times are Coordinated Universal Time (UTC) so adjusting for my time zone on the east coast, the most click-through events happen around 8:00 am.

#### Summary

The power of the cloud never ceases to amaze me. I am using both serverless compute and data without relying on a database administrator to not only provide production infrastructure for a useful tool, but also to track and analyze important data. The PowerBI dashboard makes it easy for me to filter based on time (i.e. last 24 hours vs. past month) or resource (i.e. just show me stats for “Facebook.”) This is incredibly useful to me.

As a developer, the entire project “start to finish” took probably around 20 hours total of investment. That’s not bad for the value it provides, and that included standing up infrastructure. I still have a few more steps. I am working with other [cloud developer advocates](https://jlik.me/bqj) to consolidate the tool across the team, add command line support, and hopefully extend the data-mining capabilities and ultimately leverage machine learning to help us optimize our online presence. I also will add the code to a CI/CD DevOps pipeline so it publishes via automated build rather than right-click.
> “Friends don’t let friends right-click publish.”> — [Damian Brady](https://jlik.me/bql)

In the meantime, you can [learn more about CosmosDB](https://jlik.me/bqk) and get started on your own journey. Let me know how it’s going in the comments below and be sure to clap to show your appreciation if you received value from this article.

Thanks,




![image](/blog/2017-10-12_exploring-the-cosmosdb-with-power-bi/images/10.gif)
