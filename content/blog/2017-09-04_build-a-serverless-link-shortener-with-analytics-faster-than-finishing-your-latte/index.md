---
title: "Build a Serverless Link Shortener with Analytics Faster than Finishing your Latte"
author: "Jeremy Likness"
date: 2017-09-04T16:18:59.417Z
years: "2017"
lastmod: 2019-06-13T10:43:45-07:00
comments: true
toc: true
series: "Serverless Link Shortener"

description: "How to leverage Azure Functions, Azure Table Storage, and Application Insights to build a serverless custom URL shortening tool."

subtitle: "How to leverage Azure Functions, Azure Table Storage, and Application Insights to build a serverless custom URL shortening tool."
tags:
 - Azure 
 -  .NET 
 - Serverless 
 - Cloud Computing 
 - Azure Functions 

image: "/blog/2017-09-04_build-a-serverless-link-shortener-with-analytics-faster-than-finishing-your-latte/images/3.png" 
images:
 - "/blog/2017-09-04_build-a-serverless-link-shortener-with-analytics-faster-than-finishing-your-latte/images/1.png" 
 - "/blog/2017-09-04_build-a-serverless-link-shortener-with-analytics-faster-than-finishing-your-latte/images/2.png" 
 - "/blog/2017-09-04_build-a-serverless-link-shortener-with-analytics-faster-than-finishing-your-latte/images/3.png" 
 - "/blog/2017-09-04_build-a-serverless-link-shortener-with-analytics-faster-than-finishing-your-latte/images/4.png" 
 - "/blog/2017-09-04_build-a-serverless-link-shortener-with-analytics-faster-than-finishing-your-latte/images/5.png" 
 - "/blog/2017-09-04_build-a-serverless-link-shortener-with-analytics-faster-than-finishing-your-latte/images/6.png" 
 - "/blog/2017-09-04_build-a-serverless-link-shortener-with-analytics-faster-than-finishing-your-latte/images/7.png" 
 - "/blog/2017-09-04_build-a-serverless-link-shortener-with-analytics-faster-than-finishing-your-latte/images/8.png" 
 - "/blog/2017-09-04_build-a-serverless-link-shortener-with-analytics-faster-than-finishing-your-latte/images/9.png" 
 - "/blog/2017-09-04_build-a-serverless-link-shortener-with-analytics-faster-than-finishing-your-latte/images/10.png" 
 - "/blog/2017-09-04_build-a-serverless-link-shortener-with-analytics-faster-than-finishing-your-latte/images/11.jpeg" 
 - "/blog/2017-09-04_build-a-serverless-link-shortener-with-analytics-faster-than-finishing-your-latte/images/12.gif" 


aliases:
    - "/build-a-serverless-link-shortener-with-analytics-faster-than-finishing-your-latte-8c094bb1df2c"
---

Our team thrives on real world data. I continuously analyze my online presence to better understand what topics people are interested in so that I can focus on curating content that will drive value. A lot of what I share goes through social media feeds like Facebook, Google+ (yes, it’s still around), LinkedIn and of course Twitter. I can’t afford to take a “fire and forget” approach or I could end up sharing content and topics no one really cares about.

![Application Insights Dashboard for Redirects](/blog/2017-09-04_build-a-serverless-link-shortener-with-analytics-faster-than-finishing-your-latte/images/1.png)
<figcaption>Application Insights Dashboard for Redirects</figcaption>

Although there are plenty of freely available online URL shortening and tracking utilities, I was frustrated with my options. Today, Twitter doesn’t count the full link size you tweet against your 140 character budget, so it’s not really about making the links short. Instead, it’s more about tagging and tracking. I tag links so that know which medium is the most effective. Most freely available tools require me to painstakingly paste each variation of the link in order to get a short URL, and then I don’t have full control over the analytics. What’s more, the scheduling tool that promises to shorten URLs automatically ends up taking over the tracking tags so my data is corrupted.

I decided to build a tool of my own, but I didn’t want to spin up VMs and configure expensive infrastructure to handle the load of a ton of redirects going through my servers. So, I decided to go serverless: the perfect task for &lt;⚡&gt; [Azure Functions](https://docs.microsoft.com/en-us/azure/azure-functions/functions-overview?utm_source=jeliknes&utm_medium=blog&WT.mc_id=link-blog-jeliknes) to take on!

![Getting Started Templates for Azure Functions](/blog/2017-09-04_build-a-serverless-link-shortener-with-analytics-faster-than-finishing-your-latte/images/2.png)
<figcaption>Getting Started Templates for Azure Functions</figcaption>

This post walks through how the entire site was set up, but you don’t have to manually repeat the same steps. Instead, you can navigate directly to my GitHub repository:

{{<github "JeremyLikness/serverless-url-shortener">}}

Click on the [Deploy to Azure button](https://azuredeploy.net/?repository=https://github.com/JeremyLikness/serverless-url-shortener&WT.mc_id=medium-blog-jeliknes) and you will be prompted to fill out a few values before the template engine creates and configures a fully functioning serverless app for you! Here’s a quick video that demonstrates the full process.

{{<youtube KmH1qqb4eF8>}}
<figcaption>Walk-through of Azure Deployment and Testing</figcaption>

To get started, I simply added a new function app from the portal and checked the box for [Application Insights](https://docs.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview?WT.mc_id=medium-blog-jeliknes). This gives me all of the data and metrics I’ll ever need or hope for with minimal effort. For storage, I chose to go with [Azure Table Storage](https://docs.microsoft.com/en-us/azure/storage/?WT.mc_id=medium-blog-jeliknes). It’s a key/value store and is perfect for matching the key (short URL) to the value (long URL). It does its job fast!

![Azure Table Storage Speeds](/blog/2017-09-04_build-a-serverless-link-shortener-with-analytics-faster-than-finishing-your-latte/images/3.png)
<figcaption>Azure Table Storage Speeds</figcaption>

As you can see from the chart, even the “slow” operations finish in a few hundred milliseconds and the vast majority are faster — closer to six milliseconds.

## Shortening the URL

The first function to build is the URL shortening code. It’s a good idea to keep this function secure so not just anyone can make new links. I created an HTTP binding to make it straightforward to hook up a small web app utility to generate the links, with an input binding for table storage.

![Input Binding](/blog/2017-09-04_build-a-serverless-link-shortener-with-analytics-faster-than-finishing-your-latte/images/4.png)
<figcaption>Input Binding</figcaption>

The parameters to the input binding automatically bring in the latest key to generate a new id for the shortening utility. I also created an output binding to write the new key out. This is the full bindings file for the “ingest” function that takes a long URL and makes a short one:

{{<highlight json>}}
{
  "bindings": [
    {
      "type": "table",
      "name": "keyTable",
      "tableName": "urls",
      "partitionKey": "1",
      "rowKey": "KEY",
      "take": 1,
      "connection": "AzureWebJobsStorage",
      "direction": "in"
    },
    {
      "type": "table",
      "name": "tableOut",
      "tableName": "urls",
      "connection": "AzureWebJobsStorage",
      "direction": "out"
    },
    {
      "type": "httpTrigger",
      "name": "req",
      "authLevel": "function",
      "direction": "in"
    },
    {
      "type": "http",
      "name": "$return",
      "direction": "out"
    }
  ],
  "disabled": false
}
{{</highlight>}}

Notice that I’m reusing the existing storage credentials created for the function — no need to create a new storage instance. The nice thing about table storage is that you also don’t have to worry about creating the table, because it will be automatically built the first time you insert a value. You can map tables to strongly typed classes, so I created a common “models.csx” file to use in the project.

{{<highlight CSharp>}}
using Microsoft.WindowsAzure.Storage.Table;

public class NextId : TableEntity
{
    public int Id { get; set; }
}

public class ShortUrl : TableEntity
{
    public string Url { get; set; }
    public string Medium { get; set; }
}

public class Request 
{
    public bool? TagSource { get; set; }
    public bool? TagMediums { get; set; }
    public string Input { get; set; }
}

public class Result 
{
    public string ShortUrl { get; set; }
    public string LongUrl { get; set; }
}
{{</highlight>}}

The “NextId” is a special entity used to keep track of the short URL. I simply increment the id and use an algorithm to turn it into a smaller alphanumeric value. I didn’t see the need for any exotic hash algorithms or unique generators when I can just use a simple identity field that is incremented each time. The “ShortUrl” holds the URL and the “Medium” property (i.e. did this link come from Twitter, LinkedIn, etc.). Both are based on “TableEntity” that provides some basic fields including “PartitionKey” and “RowKey.”

For the next-up identifier (“NextId”) I hard coded a partition of “1” and a row of “KEY” to always grab a single value. For the short URLs, I partition the data by the first character of the short URL. For example, a value of “ab” will go to partition “a” and row “ab” and a value of “1z” will go to partition “1” and row “1z”. This ensures an even distribution across partitions with values for performance.

The algorithm to generate a short URL simply takes the integer identifier and converts it into an alphanumeric value that is based on using all digits and alphabet values.

{{<highlight CSharp>}}
public static readonly string Alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
public static readonly int Base = Alphabet.Length;

public static string Encode(int i)
{
  if (i == 0)
  {
    return Alphabet[0].ToString();
  }
  var s = string.Empty;
  while (i > 0)
  {
      s += Alphabet[i % Base];
      i = i / Base;
  }

  return string.Join(string.Empty, s.Reverse());
}
{{</highlight>}}

The code for the function first casts the request to a strongly typed class and ensures all values are present. Note in the parameters that because the input binding for the table is set to retrieve a single value, we can pass in a strongly typed model for it (“keyTable”). The output table requires some additional operations and is cast to “CloudTable.” This type of automatic binding makes functions extremely flexible and easy to use.

{{<highlight CSharp>}}
public static async Task<HttpResponseMessage> Run(HttpRequestMessage req, NextId keyTable, CloudTable tableOut, TraceWriter log)
{
    if (req == null)
    {
        return req.CreateResponse(HttpStatusCode.NotFound);
    }

    Request input = await req.Content.ReadAsAsync<Request>();

    if (input == null)
    {
        return req.CreateResponse(HttpStatusCode.NotFound);
    }

    var url = input.Input;
    bool tagMediums = input.TagMediums.HasValue ? input.TagMediums.Value : true;
    bool tagSource = (input.TagSource.HasValue ? input.TagSource.Value : true) || tagMediums;
    
    if (String.IsNullOrWhiteSpace(url))
    {
        throw new Exception("Need a URL to shorten!");
    }
}
{{</highlight>}}

The first time the function is called, the key doesn’t exist so it is passed in as null. On subsequent operations the current value will be automatically bound and passed in. A little logic checks for a null key and seeds the first value.

{{<highlight CSharp>}}
if (keyTable == null)
{
  keyTable = new NextId
  {
    PartitionKey = "1",
    RowKey = "KEY",
    Id = 1024
  };
  var keyAdd = TableOperation.Insert(keyTable);
  await tableOut.ExecuteAsync(keyAdd); 
}    
{{</highlight>}}

The new URL is generated based on the “next up” key, and stored in the table. The result is collected in a list that is returned to the client in order to display the shortened URLs. If “tag mediums” is set to “true” the code will iterate through an array of mediums (Twitter, LinkedIn, etc.) and generate URLs for each variation.

{{<highlight CSharp>}}
var shortUrl = Encode(keyTable.Id++);

var newUrl = new ShortUrl 
{
    PartitionKey = $"{shortUrl.First()}",
    RowKey = $"{shortUrl}",
    Url = url
};
var singleAdd = TableOperation.Insert(newUrl);
await tableOut.ExecuteAsync(singleAdd);

result.Add(new Result 
{
    ShortUrl = $"{SHORTENER_URL}{newUrl.RowKey}",
    LongUrl = WebUtility.UrlDecode(newUrl.Url)
});
{{</highlight>}}

The final step is to save the new key value to the database and return the results.

> Because is this is a “personal use” URL shortening tool, I’m not worried about concurrency (i.e. what if two clients request short URLs at the exact same time) or I might code the key logic differently.

{{<highlight CSharp>}}
var operation = TableOperation.Replace(keyTable);
await tableOut.ExecuteAsync(operation);
return req.CreateResponse(HttpStatusCode.OK, result);
{{</highlight>}}

That’s it! You can now pass in a value and receive the short URL. This is an example of what a request/response looks like:

{{<highlight json>}}
{
  "req": {
    "tagSource": false,
    "tagMediums": true,
    "input": "https://blog.jeremylikness.com/"
  },
  "response": [{
    "ShortUrl":"https://jlik.me/az52",
    "LongUrl":"https://blog.jeremylikness.com/?utm_medium=twitter"
  }, {
    "ShortUrl":"https://jlik.me/az53",
    "LongUrl":"https://blog.jeremylikness.com/?utm_medium=linkedin"
  }]
}
{{</highlight>}}

## A Simple Client

To make it easier to shorten URLs, I created a simple single page web application using the [Vue.js](https://vuejs.org/) framework. Because it is just for personal use, I didn’t bother with a full web application or complex authentication. Instead, the app has a hard-coded endpoint to the function with the function secret embedded in the URL. The app simply accepts input, calls the function app and displays the results.

![The Shortening Utility](/blog/2017-09-04_build-a-serverless-link-shortener-with-analytics-faster-than-finishing-your-latte/images/5.png)
<figcaption>The Shortening Utility</figcaption>

Use <i class="fab fa-github"></i> [this link](https://github.com/JeremyLikness/serverless-url-shortener/tree/master/webApp) to browse the source code for the web app. It includes a Dockerfile that builds a tiny docker image that I run locally when I’m using it to post URLs. I keep the Docker image local and run it when needed. Because the function to generate short URLs is secured, I added a Cross-Origin Resource Sharing entry to the function app so the browser will allow requests from “localhost” and a custom port. Use this link to: [Learn how to configure CORS](https://docs.microsoft.com/en-us/azure/azure-functions/functions-how-to-use-azure-function-app-settings?WT.mc_id=medium-blog-jeliknes#cors).

## Redirection and Custom Telemetry

The next step is to provide an endpoint for the redirection. This is done with the “UrlRedirect” function. The route is set up so that the short URL is passed as part of the path. The function itself accepts an input binding to the table and the short URL itself.

The logic is simple. A fallback URL is used to redirect to a common website if the URL is invalid. Table storage is queried for the matching entry, and if it is found the redirect URL is updated from the default to the URL from the table. Finally, the method returns a “302” redirect code with the target URL.

{{<highlight CSharp>}}
public static HttpResponseMessage Run(HttpRequestMessage req, CloudTable inputTable,
  string shortUrl, TraceWriter log)
{
    var redirectUrl = FALLBACK_URL;
    if (!String.IsNullOrWhiteSpace(shortUrl))
    {
        shortUrl = shortUrl.Trim().ToLower();
        var partitionKey = $"{shortUrl.First()}";
        TableOperation operation = TableOperation.Retrieve<ShortUrl>(partitionKey, shortUrl);
        TableResult result = inputTable.Execute(operation);
        ShortUrl fullUrl = result.Result as ShortUrl;
        if (fullUrl != null)
        {
            redirectUrl = WebUtility.UrlDecode(fullUrl.Url);
        }
    }    
    var res = req.CreateResponse(HttpStatusCode.Redirect);
    res.Headers.Add("Location", redirectUrl);
    return res;
}
{{</highlight>}}

Now all of the pieces are in place: a function to encode short URLs and a function to decode and redirect. Earlier I mentioned checking a box for “Application Insights” when creating the function. Application Insights provides a ton of metrics “out of the box” but really shines in its ability to track custom telemetry.

## Application Insights

Application insights provides rich functionality out of the box without changing a single line of code. I can see the overall health of my functions including average response time.

![Application Insights Request Data](/blog/2017-09-04_build-a-serverless-link-shortener-with-analytics-faster-than-finishing-your-latte/images/6.png)
<figcaption>Application Insights Request Data</figcaption>

You can see there was a slow spike at one point that I can investigate by clicking on the spike and drilling into individual transactions. The majority of redirects happen quickly. “Smart detection” uses machine learning to scan data and notify you when behaviors falls outside of norms, such as failed responses or extremely slow response times. In this snapshot, the host allocated a second server to accommodate requests based on request rates and response times. I didn’t have to do a thing — the functions scale themselves automatically.

Of course, seeing how long it takes to return a request is important, but I need more data to troubleshoot why slower responses happen. For example, it would be great to see how much time in a request is spent looking up the redirect URL in table storage.

Adding custom telemetry is very straightforward. I added a “project.json” file to reference the Application Insights SDK for use by the function.

{{<highlight json>}}
{
  "frameworks": {
    "net46":{
      "dependencies": {
        "Microsoft.ApplicationInsights": "2.2.0"
      }
    }
  }
}
{{</highlight>}}

Upon saving that, the function app loads the NuGet package and installs it to be available to the function. At the top of the function app I use a special keyword for package references “#r” to include the NuGet package followed by a standard “using” statement for the code.

{{<highlight CSharp>}}
#r "Microsoft.WindowsAzure.Storage"
using Microsoft.ApplicationInsights;
{{</highlight>}}

With that, I am able to instantiate a client in the function for use. Notice that I pass it a key that is already configured in the application settings to connect to the right instance of Application Insights.

{{<highlight CSharp>}}
public static TelemetryClient telemetry = new TelemetryClient()
{
    InstrumentationKey = 
       System.Environment.GetEnvironmentVariable("APPINSIGHTS_INSTRUMENTATIONKEY")
};
{{</highlight>}}

Next, I capture the current date and start a timer before calling the table operation. After it completes, I use the telemetry client to log the results.

{{<highlight CSharp>}}
var startTime = DateTime.UtcNow;
var timer = System.Diagnostics.Stopwatch.StartNew();

TableOperation operation = TableOperation.Retrieve<ShortUrl>(
  partitionKey, shortUrl);
TableResult result = inputTable.Execute(operation);

telemetry.TrackDependency("AzureTableStorage", "Retrieve", 
  startTime, timer.Elapsed, result.Result != null);
{{</highlight>}}

This allows me to view the dependency data in Application Insights and see that the table queries happen very fast — at the 50th percentile in less than seven milliseconds for an overall average of about 15ms!

![Viewing Telemetry for Azure Table Storage Queries](/blog/2017-09-04_build-a-serverless-link-shortener-with-analytics-faster-than-finishing-your-latte/images/7.png)
<figcaption>Viewing Telemetry for Azure Table Storage Queries</figcaption>

For my own analytics, I capture a custom event to track the medium used and a “page view” for the target URL.

{{<highlight CSharp>}}
telemetry.TrackEvent(fullUrl.Medium);
telemetry.TrackPageView(redirectUrl);
{{</highlight>}}

This enables me to see which mediums are the most popular.

![Redirects by Medium](/blog/2017-09-04_build-a-serverless-link-shortener-with-analytics-faster-than-finishing-your-latte/images/8.png)
<figcaption>Redirects by Medium</figcaption>

I can also see which page views have been the most popular and learn what my audience is interested in and likely wants to see more of.

![Top Page Views in 24 Hours](/blog/2017-09-04_build-a-serverless-link-shortener-with-analytics-faster-than-finishing-your-latte/images/9.png)
<figcaption>Top Page Views in 24 Hours</figcaption>

The analytics tool is actually very comprehensive and allows you to build your own queries and aggregations and create your own charts and graphs for insights. All of this is part of the free “out of the box” insights offering. The only thing limited in the free version is the amount of data that is stored. You can opt-in to paid models that retain more data for a longer period of time to get monthly, yearly, and other trends as needed.

## The Finishing Touches: Proxies and Hosts

There are a few steps I took to make my URL shortening tool production-ready. First, a URL like this:

> “http://hostname.azurewebsites.net/api/UrlRedirect/aaa”

is hardly short! Therefore, I used a proxy to map the root path or route to the API. Proxy configuration is a powerful feature for functions because it enables precise control over the endpoints of your APIs. Even if you implement five different function apps with different URLs, you can use a proxy to aggregate them under the same path. Here is the proxy configuration that is setup for this project:

{{<highlight json>}}
{
  "$schema": "http://json.schemastore.org/proxies",
  "proxies": {
    "Domain Redirect": {
      "matchCondition": {
        "route": "/{*shortUrl}"
      },
      "backendUri": "http://%WEBSITE_HOSTNAME%/api/UrlRedirect/{shortUrl}"
    },
    "Api": {
      "matchCondition": {
        "route": "/api/{*path}"
      },
      "backendUri": "http://%WEBSITE_HOSTNAME%.azurewebsites.net/api/{path}"
    }
  }
}
{{</highlight>}}

The first rule flattens the root redirect, so that:

> “http://hostname.azurewebsites.net/abc”

maps to:

> “http://hostname.azurewebsites.net/api/UrlRedirect/abc”

The second rule ensures the original “api” path is preserved, so that the full path is still valid and essentially “passes through.”

I acquired a domain name to use for the short URL. One of the settings for the function app is “Custom Domains.”

![Custom Domains Setting](/blog/2017-09-04_build-a-serverless-link-shortener-with-analytics-faster-than-finishing-your-latte/images/10.png)
<figcaption>Custom Domains Setting</figcaption>

The subsequent dialog will walk you through the steps needed to verify you own the domain and point it to your function app by pointing your domain to the public IP address Azure configured. After the step is completed, the function app recognizes the custom domain and allows the redirect to work with a custom URL:

![Using Proxies](/blog/2017-09-04_build-a-serverless-link-shortener-with-analytics-faster-than-finishing-your-latte/images/11.jpeg)
<figcaption>Using Proxies</figcaption>

There are several options to secure your endpoint with SSL. If you own your own SSL certificate, you can upload it to the site and leverage it for secure calls. I personally prefer to use [CloudFlare](https://www.cloudflare.com/) as a free and easy to configure option. CloudFlare allows me to configure my domain for secured connections and generates their own SSL certificate. CloudFlare connects to my Azure function app “behind the scenes” but presents a valid certificate to the client that secures the connection. It also offers various security features and caches requests to improve the responsive of the site. It will even serve cached content when your website goes down!

Now the URL shortening tool is fully up and running, allowing me to generate short URLs and happily routing users to their final destination. Now is the perfect time to mention one of the biggest benefits I received by going serverless: cost. As of this writing, the [Azure Functions pricing model](https://azure.microsoft.com/en-us/pricing/details/functions/?WT.mc_id=medium-blog-jeliknes) grants the first million function calls and 400,000 gigabyte seconds (GB-s) of consumption for free. My site has low risk of hitting those levels, so my main cost is storage. How much is storage?

Update: I recently spent thirty minutes in an interview discussing and demoing the link shortener that I use. Check that out here:

[Azure Functions: Less-Server and More Code](https://channel9.msdn.com/Shows/Visual-Studio-Toolbox/Azure-Functions-Less-Server-and-More-Code?utm_source=jeliknes&utm_medium=blog&utm_campaign=linkshortener&WT.mc_id=linkshortener-blog-jeliknes)

> **Although actual results will differ for everyone, in my experience, running the site for a week while generating around 1,000 requests per day resulted in a massive seven cent U.S.D. charge to my bill. I don’t think I’ll have any problem affording this!**

What are you waiting for? Head over to the <i class="fab fa-github"></i> [repository](https://github.com/JeremyLikness/serverless-url-shortener/) and click the button to get started on your own to see just how powerful functions are!

![Jeremy Likness](/blog/2017-09-04_build-a-serverless-link-shortener-with-analytics-faster-than-finishing-your-latte/images/12.gif)

Read the next article in this series:

{{<relativelink "/blog/2017-10-10_expanding-azure-functions-to-the-cosmos">}}
