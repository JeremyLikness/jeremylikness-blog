---
title: "Serverless Twitter Analytics with CosmosDB and Logic Apps"
author: "Jeremy Likness"
date: 2018-01-18T16:22:26.138Z
years: "2018"
lastmod: 2019-06-13T10:44:36-07:00
comments: true
series: "Serverless Link Shortener"

description: "Learn how to use Logic Apps to query CosmosDB documents, authenticate with and search Twitter, and provide insightful analytics without writing code."

subtitle: "Using the Azure cloud to understand click behavior"
tags:
 - Social Media 
 - NoSQL 
 - Cloud 
 - Cosmosdb 

image: "/blog/2018-01-18_serverless-twitter-analytics-with-cosmosdb-and-logic-apps/images/1.png" 
images:
 - "/blog/2018-01-18_serverless-twitter-analytics-with-cosmosdb-and-logic-apps/images/1.png" 
 - "/blog/2018-01-18_serverless-twitter-analytics-with-cosmosdb-and-logic-apps/images/2.png" 
 - "/blog/2018-01-18_serverless-twitter-analytics-with-cosmosdb-and-logic-apps/images/3.png" 
 - "/blog/2018-01-18_serverless-twitter-analytics-with-cosmosdb-and-logic-apps/images/4.png" 
 - "/blog/2018-01-18_serverless-twitter-analytics-with-cosmosdb-and-logic-apps/images/5.png" 
 - "/blog/2018-01-18_serverless-twitter-analytics-with-cosmosdb-and-logic-apps/images/6.png" 
 - "/blog/2018-01-18_serverless-twitter-analytics-with-cosmosdb-and-logic-apps/images/7.png" 
 - "/blog/2018-01-18_serverless-twitter-analytics-with-cosmosdb-and-logic-apps/images/8.png" 
 - "/blog/2018-01-18_serverless-twitter-analytics-with-cosmosdb-and-logic-apps/images/9.png" 
 - "/blog/2018-01-18_serverless-twitter-analytics-with-cosmosdb-and-logic-apps/images/10.png" 
 - "/blog/2018-01-18_serverless-twitter-analytics-with-cosmosdb-and-logic-apps/images/11.gif" 


aliases:
    - "/serverless-twitter-analytics-with-cosmosdb-and-logic-apps-280e5ff6c948"
---

I recently added a [Logic App](https://docs.microsoft.com/en-us/azure/logic-apps/logic-apps-overview?WT.mc_id=logicapp-blog-jeliknes&utm_source=jeliknes&utm_medium=blog&utm_campaign=logicapp) to my Azure portfolio, and the insights it provides are amazing. I chose Logic Apps because I needed an [easy way to query Twitter](https://docs.microsoft.com/en-us/azure/connectors/connectors-create-api-twitter?WT.mc_id=logicapp-blog-jeliknes&utm_source=jeliknes&utm_medium=blog&utm_campaign=logicapp). In the Logic Apps designer, I simply clicked “Twitter”, logged in, and specified my search. It does the rest. I didn’t have to write a line of code or even worry about the nuances of authentication. It was all handled for me!

![Logic App workflow](/blog/2018-01-18_serverless-twitter-analytics-with-cosmosdb-and-logic-apps/images/1.png)
<figcaption>Logic App workflow</figcaption>

It’s been several months and tens of thousands of clicks since I started using my [custom link shortener](/build-a-serverless-link-shortener-with-analytics-faster-than-finishing-your-latte-8c094bb1df2c). I use this tool daily and leverage the analytics to refine the information I send out to social media. The goal is simply to find out how developers react to various topics so that I can eliminate the ones that are not interesting and focus on the ones that generate interest and excitement. In the context of the tool, a “click” is a “vote” for a particular topic.

I can look at the past 24 hours, for example, and see that although <i class="fab fa-twitter"></i> [Twitter](https://twitter.com/JeremyLikness)is by far the most active social medium I use, there is plenty of activity from my [Channel 9 videos](https://channel9.msdn.com/Niners/JeremyLikness?utm_source=jeliknes&utm_medium=blog&utm_campaign=jeremyliknessblog&WT.mc_id=jeremyliknessblog-blog-jeliknes), this blog, and even <i class="fab fa-github"></i> [GitHub](https://github.com/JeremyLikness).

![Redirects by medium (pasts 24 hours) on January 18, 2018](/blog/2018-01-18_serverless-twitter-analytics-with-cosmosdb-and-logic-apps/images/2.png)
<figcaption>Redirects by medium (pasts 24 hours) on January 18, 2018</figcaption>

I also started tracking data like the target host pages. This gives me an interesting visual of where most of the clicks through my URL tracker end up.

![Clicks by host](/blog/2018-01-18_serverless-twitter-analytics-with-cosmosdb-and-logic-apps/images/3.png)
<figcaption>Clicks by host</figcaption>

Recently, I realized that I was missing some important information. Although it’s not consistent, some sources are kind enough to provide referral information. Every request also provides a user agent. Combined, this information gives me valuable insights such as the browsers being used, whether my content is read on mobile or desktop, and where the clicks originate.

I’ll get into more of the user agent code in a different blog post, but adding referral information to the tracking data was as simple as:

{{<highlight CSharp>}}
if (parsed.Referrer != null)
{
    doc.referrerUrl = parsed.Referrer.AsPage(HttpUtility.ParseQueryString);
    doc.referrerHost = parsed.Referrer.DnsSafeHost;
}
{{</highlight>}}

This gives me both a page and a host so I can organize data at different levels. I love that 🌎 [CosmosDB](https://docs.microsoft.com/en-us/azure/cosmos-db/introduction?WT.mc_id=logicapp-blog-jeliknes&utm_source=jeliknes&utm_medium=blog&utm_campaign=logicapp) is a schema-less database, so it’s trivial to add new properties as an afterthought. I just ignore the old data in my analytics that need referral information. After running with the new information for awhile, I noticed an interesting trend.

![Referring hosts](/blog/2018-01-18_serverless-twitter-analytics-with-cosmosdb-and-logic-apps/images/4.png)
<figcaption>Referring hosts</figcaption>

A large number of referrals were coming from “t.co” which is Twitter’s own link shortener. In fact, I realized that every new tweet gets a unique “short link.” This means that I can search Twitter for the exact short link URL, and find the original tweet that the referral came from! This is useful to me to analyze what tweets generate the most engagement, and to “fact check” my counts compared to Twitter’s stats.

> Note: it would be great to understand activity at a retweet level, but this is not possible. A retweet simply references the original tweet, so there is no way of determining whether the click came from the original or a retweet. Therefore, I set up the logic to track the original tweet information, and from there I can always query statistics from twitter about likes and retweets.

I knew that Logic Apps would be the easiest way to process the Tweets, so I logged into my [Azure portal](https://portal.azure.com/?WT.mc_id=logicapp-blog-jeliknes&utm_source=jeliknes&utm_medium=blog&utm_campaign=logicapp) and added a new Logic App. The designer makes it incredibly easy to connect to various resources and assets. Here is the first part of my workflow. The trigger is a timer I run every two hours and will tweak as needed based on activity. I initialize a variable to represent the current document and the Twitter link, then grab all documents that have a Twitter referral but haven’t yet been mapped to the original tweet.

![Grabbing documents for processing](/blog/2018-01-18_serverless-twitter-analytics-with-cosmosdb-and-logic-apps/images/5.png)
<figcaption>Grabbing documents for processing</figcaption>

Notice the flexibility of the SQL syntax in being able to find a document that doesn’t have a property defined yet (`not(is_defined(…))`). CosmosDB automatically indexes all properties, so these queries execute blazing fast.

I add a “for…each” loop to iterate the resulting documents.

![Iterate over each document](/blog/2018-01-18_serverless-twitter-analytics-with-cosmosdb-and-logic-apps/images/6.png)
<figcaption>Iterate over each document</figcaption>

I set the “document id” variable to the current id, and the “twitter URL” variable to the Twitter website. This is the default I’ll use in case the search turns up empty.

> Note: Logic Apps by default runs for loops in parallel. Although this is great for scale, the process I’m writing is sequential because I need to map the document directly to the link I find. Therefore, I set the parallelism under “settings” to “1.” I may refactor this in the future if I learn a way to scope the variables to the parallel process.

If you’re curious, here is a sample document that has a Twitter referral but hasn’t yet been mapped to the original tweet.

{{<highlight json>}}
{
"id": "07adda00-6b81-48a2-8ead-7acb52d9f1fc",
"page": "thenewstack.io/less-proving-enterprises",
"shortUrl": "CLM",
"campaign": "link",
"referrerUrl": "t.co/kX8cELXEYm?amp=1",
"referrerHost": "t.co",
"agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 9_2 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13C75 Safari/601.1 Mozilla/5.0,(iPhone; CPU iPhone OS 9_2 like Mac OS X),AppleWebKit/601.1.46,(KHTML, like Gecko),Version/9.0,Mobile/13C75,Safari/601.1",
"browser": "Safari",
"browserVersion": 9,
"browserWithVersion": "Safari 9",
"mobile": 1,
"mobileManufacturer": "Apple",
"mobileModel": "IPhone",
"mobileDevice": "Apple IPhone",
"platform": "Unknown",
"count": 1,
"timestamp": "2018-01-18T15:44:20",
"host": "thenewstack.io",
"twitter": 1,
"_rid": "[REDACTED]",
"_self": "[REDACTED]",
"_etag": "\"08001fba-0000-0000-0000-5a60c0d40000\"",
"_attachments": "attachments/",
"_ts": 1516290260
}
{{</highlight>}}

Now I search Twitter for tweets containing the link.

![Search tweets](/blog/2018-01-18_serverless-twitter-analytics-with-cosmosdb-and-logic-apps/images/7.png)
<figcaption>Search tweets</figcaption>

I only need one result. I also modify the referral URL a bit because sometimes there is a querystring attached that I don’t need. Here is the backing code for the step.

{{<highlight json>}}
{
    "inputs": {
        "host": {
            "connection": {
                "name": "@parameters('$connections')['twitter']['connectionId']"
            }
        },
        "method": "get",
        "path": "/searchtweets",
        "queries": {
            "searchQuery": "@{concat('https://', replace(item()['referrerUrl'], '?amp=1', ''))}",
            "maxResults": 1
        },
        "authentication": "@parameters('$authentication')"
    }
}
{{</highlight>}}

I then iterate the results (which at most I’ll get one) and branch based on whether or not an “original tweet” exists.

![Branch based on original tweet](/blog/2018-01-18_serverless-twitter-analytics-with-cosmosdb-and-logic-apps/images/8.png)
<figcaption>Branch based on original tweet</figcaption>

The variables are set either using the original tweet or the current tweet. “Original tweet” is a nested object, so the easiest way to check for its existence is to coalesce with a known value. Here is the expression I compare to the text literal “null”:

`coalesce(items('For_each_2')['OriginalTweet'], 'null')`

The twitter URL variable now contains one of three possible values:

1. The Twitter URL because the search did not return results
2. The Original Tweet because the search returned a retweet
3. The Tweet itself because the search returned an original tweet

The next step involves adding the new property to the document. There isn’t a direct connector for this in Logic Apps, but Logic Apps play well with [Azure Functions](https://docs.microsoft.com/en-us/azure/azure-functions/?utm_source=jeliknes&utm_medium=blog&utm_campaign=logicapp&WT.mc_id=logicapp-blog-jeliknes) and adding the function was trivial:

{{<highlight CSharp>}}
[FunctionName(name: "UpdateTwitter")]
public static async Task<HttpResponseMessage> Twitter([HttpTrigger(AuthorizationLevel.Function, 
    "post",
    Route = "UpdateTwitter/{id}")]HttpRequestMessage req,
    [DocumentDB(Utility.URL_TRACKING, Utility.URL_STATS, CreateIfNotExists = false, 
       ConnectionStringSetting = "CosmosDb", Id = "{id}")]dynamic doc,
    string id,
    TraceWriter log)
{
    if (doc == null)
    {
        log.Error($"Doc not found with id: {id}.");
        return req.CreateResponse(HttpStatusCode.NotFound);
    }
    var link = await req.Content.ReadAsStringAsync();
    if (!string.IsNullOrWhiteSpace(link))
    {
        doc.referralTweet = link;
    }
    return req.CreateResponse(HttpStatusCode.OK);
}
{{</highlight>}}

Functions make life so easy! By providing a [CosmosDB (DocumentDB interface) binding](https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-cosmosdb?utm_source=jeliknes&utm_medium=blog&utm_campaign=logicapp&WT.mc_id=logicapp-blog-jeliknes), I don’t have to do anything to retrieve the document. The binding automatically retrieves the id from the header, finds the corresponding document (if it exists) and then passes it into the function method. All I need to do is pull the URL that is passed as a simple text string as the body of the post and add it as a new `referralTweet` property to the document. The binding even does the update for me!

There are two ways to call functions from Logic Apps. You can connect to certain functions directly, or you can call the function endpoint as a client. I chose the latter.

![POST to the function endpoint](/blog/2018-01-18_serverless-twitter-analytics-with-cosmosdb-and-logic-apps/images/9.png)
<figcaption>POST to the function endpoint</figcaption>

Notice I use the variables to add the document id to the route and include the twitter URL in the body. The design allows me to run this any time to capture unprocessed documents, and already is providing me with new insights on my dashboard.

![Referring tweets](/blog/2018-01-18_serverless-twitter-analytics-with-cosmosdb-and-logic-apps/images/10.png)
<figcaption>Referring tweets</figcaption>

Of course, now that I have the tweet, I can take it a step further and grab the tweet text to show more context or even a preview on the dashboard. But that’s a task for a different day!

If you haven’t already tapped into the power of Logic Apps, I encourage you to [check them out](https://docs.microsoft.com/en-us/azure/logic-apps/logic-apps-overview?WT.mc_id=logicapp-blog-jeliknes&utm_source=jeliknes&utm_medium=blog&utm_campaign=logicapp) today.

Until next time,

![Jeremy Likness](/blog/2018-01-18_serverless-twitter-analytics-with-cosmosdb-and-logic-apps/images/11.gif)
