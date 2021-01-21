---
title: "Migrating Azure Functions from v1 (.NET) to v2 (.NET Standard)"
author: "Jeremy Likness"
date: 2019-02-13T15:58:12.364Z
years: "2019"
lastmod: 2019-06-13T10:45:33-07:00
comments: true
toc: true

description: "This post explains how a production serverless C# app that uses Azure Functions, Azure Table Storage, and Azure Cosmos DB was successfully migrated from v1 using .NET to v2 using .NET Standard."

subtitle: "Lessons learned moving my link shortener app to the new platform."
tags:
 - Azure 
 - Azure Functions 
 - Serverless 
 - Net Core 
 - Cloud Computing 

image: "/blog/2019-02-13_migrating-azure-functions-from-v1-.net-to-v2-.net-standard/images/1.png" 
images:
 - "/blog/2019-02-13_migrating-azure-functions-from-v1-.net-to-v2-.net-standard/images/1.png" 
 - "/blog/2019-02-13_migrating-azure-functions-from-v1-.net-to-v2-.net-standard/images/2.png" 
 - "/blog/2019-02-13_migrating-azure-functions-from-v1-.net-to-v2-.net-standard/images/3.png" 
 - "/blog/2019-02-13_migrating-azure-functions-from-v1-.net-to-v2-.net-standard/images/4.png" 
 - "/blog/2019-02-13_migrating-azure-functions-from-v1-.net-to-v2-.net-standard/images/5.gif" 


aliases:
    - "/migrating-azure-functions-from-v1-net-to-v2-net-standard-b2d724f9faf"
---

On September 18th, 2017 I [committed the first version](https://github.com/JeremyLikness/jlik.me/commit/6b026f4e00321b19c513cb4e655f9ed8e2e54b32) of my serverless link shortener app to GitHub. The ⚡ [serverless app](https://blog.jeremylikness.com/build-a-serverless-link-shortener-with-analytics-faster-than-finishing-your-latte-8c094bb1df2c?WT.mc_id=medium-blog-jeliknes) allows me to tag links with short URLs that I share in tweets, blog posts, presentations, and other media. A user clicks on the link and is redirected to the target site, then I collect rudimentary data such as the referring URL (if it’s available) and the user agent information to parse the browser and platform being used. This feeds into an [Azure Cosmos DB database](https://docs.microsoft.com/en-us/azure/cosmos-db/introduction?WT.mc_id=medium-blog-jeliknes) that [I analyze with Power BI](https://blog.jeremylikness.com/exploring-cosmosdb-with-powerbi-9192317087d8?WT.mc_id=medium-blog-jeliknes) to determine what topics and links are popular (or not). I also have a [Logic App](https://docs.microsoft.com/en-us/azure/logic-apps/?WT.mc_id=medium-blog-jeliknes) that runs to [parse additional metadata from Twitter-sourced referrals](https://blog.jeremylikness.com/serverless-twitter-analytics-with-cosmosdb-and-logic-apps-280e5ff6c948?WT.mc_id=medium-blog-jeliknes).

The overall architecture looks like this, using serverless functions, table storage, queues, a NoSQL database and cloud-based integrations to Twitter:

{{<figure src="/blog/2019-02-13_migrating-azure-functions-from-v1-.net-to-v2-.net-standard/images/1.png" caption="Link Shortener Application" alt="Chart showing components of application">}}

I wrote extensively about the process and published all of the code to GitHub, so you can follow the links in the previous paragraph if you want to learn more of the background story. At the time I built the [Azure Functions](https://docs.microsoft.com/en-us/azure/azure-functions/?WT.mc_id=medium-blog-jeliknes) portions of the app, the production version was v1 and used the .NET Framework. As of this writing, the production version is v2 and uses .NET Core and .NET Standard libraries. To take advantage of all the updates rolling into the latest version and keep current, I chose to migrate my functions to the latest version.

## Background

The original functions engine hosted .NET applications. Due to numerous reasons, including compatibility and performance, the second version hosts .NET Core applications (the functions app is essentially a [.NET Standard 2.0](https://docs.microsoft.com/en-us/dotnet/standard/net-standard?utm_source=jeliknes&utm_medium=blog&utm_campaign=medium&WT.mc_id=medium-blog-jeliknes) class but implemented as .NET Core app). To keep current and take advantage of the latest updates, I decided to migrate my application to .NET Core. The path I chose to follow was:

1. Create a .NET Core Azure Functions v2 project
2. Migrate existing business classes over
3. Recreate all the function endpoints in the new project
4. Test locally
5. Deploy to the existing function app host and overwrite the legacy version

I knew I wasn’t risking much with the migration, because I could roll back to the previous version at any time.

## Migrating Business Logic

The classes used to hold data all migrated 100% “as is.” I could have changed the class library to a .NET Standard library, but for the sake of expediency I simply pulled the class library into the new project under the `Domain` namespace. Code like the `AnalyticsEntry` designed to capture metadata migrated without changes.

{{<highlight CSharp>}}
public class AnalyticsEntry
{
    public string ShortUrl { get; set; }
    public Uri LongUrl { get; set; }
    public DateTime TimeStamp { get; set; }
    public Uri Referrer { get; set; }
    public string Agent { get; set; }
}
{{</highlight>}}

Even classes with business logic didn’t require any code changes. Part of this is because I am a firm believer in the strategy pattern. Instead of parsing URL fragments directly with a class that is specific to the framework, the strategy is defined as an action that takes a URL and returns a name/value collection of its parts. This code was the same in v1 and v2:

{{<highlight CSharp>}}
public static string AsPage(this Uri uri, Func<string, NameValueCollection> parseQuery)
{
    var pageUrl = new UriBuilder(uri)
    {
        Port = -1
    };
    var parameters = parseQuery(pageUrl.Query);
    foreach (var check in new[] {
        Utility.UTM_CAMPAIGN,
        Utility.UTM_MEDIUM,
        Utility.UTM_SOURCE,
        Utility.WTMCID })
    {
        if (parameters[check] != null)
        {
            parameters.Remove(check);
        }
    }
    pageUrl.Query = parameters.ToString();
    return $"{pageUrl.Host}{pageUrl.Path}{pageUrl.Query}{pageUrl.Fragment}";
}
{{</highlight>}}

The call to the extension method is also the same:

`var page = parsed.LongUrl.AsPage(HttpUtility.ParseQueryString);`

If the `ParseQueryString` method ever went away from the framework, the strategy pattern would allow me to implement the same functionality in my own method and pass that instead. For security, I built in a check to ensure the function is running under HTTPS. The check looked like this in v1:

{{<highlight CSharp>}}
private static HttpResponseMessage SecurityCheck(HttpRequestMessage req)
{
    return req.IsLocal() || req.RequestUri.Scheme == "https" ? null :
        req.CreateResponse(HttpStatusCode.Forbidden);
}
{{</highlight>}}

In .NET Core, the extension method `isLocal` does not exist. The goal is to allow HTTP only when running/debugging locally. This was a simple fix: in the existing static `Utility` class, I simply added this extension method to keep the security check “as is”:

{{<highlight CSharp>}}
public static bool IsLocal(this HttpRequestMessage request)
{
    return request.RequestUri.IsLoopback;
}
{{</highlight>}}

Another important but subtle change is logging. In v1 the original strategy was to pass in a `TraceWriter` instance to the function. The built-in dependency injection engine in the functions host would pass an appropriate instance, and logging looked like this:

`log.Info($"Attempting to retrieve file at path {filePath}.&");`

In v2, an interface is used instead. This gives more flexibility to swap a different implementation, both at run-time and for testing. The parameter becomes an `ILogger` instance and logging looks like this:

`log.LogInformation($"Attempting to retrieve file at path {filePath}.");`

There were only two other areas of the application that had to change. The first was a utility used to parse the user agent string to extract data about the browser. This class doesn’t exist in .NET Core and it forced me to pull in a third-party open source library that does a better job. I’ll discuss that more in a bit. The second change was required for the bindings to connect with storage and Cosmos DB.

## HTTP Responses

In v1 it was possible to use some helper methods to create appropriate response codes. For example, when a request came in for `ROBOTS.TXT`, the code to return the result looked like this:

{{<highlight CSharp>}}
var robotResponse = req.CreateResponse(HttpStatusCode.OK, Utility.ROBOT_RESPONSE, "text/plain");
 return robotResponse;
{{</highlight>}}

This throws an exception in some circumstances in v2 due to internal nuances around how the extension method is implemented and the scope of the response (as far as I can understand, the response goes out of scope before the content is serialized). The solution when/if the error does occur is to explicitly create the response. I changed the code to this:

{{<highlight CSharp>}}
var resp = new HttpResponseMessage(HttpStatusCode.OK);
resp.Content = new StringContent(Utility.ROBOT_RESPONSE,
    System.Text.Encoding.UTF8,
    "text/plain");
return resp;
{{</highlight>}}

…and that works fine.

## Adding Extensions

By default, v1 provided access to many existing triggers (to execute the functions code) and bindings (to make it easier to connect to resources). In v2, the philosophy is to start with the bare minimum and add only what’s needed. The short links are stored in table storage as key/value pairs, and the only requirement to make the same code work in v2 was to add a package reference to:

`Microsoft.Azure.WebJobs.Extensions.Storage`

A binding is used to insert analytics data into a Cosmos DB database. In v1, the API used and therefore the binding was named `DocumentDB`. For v2, I simply renamed it to `CosmosDB` and added this reference:

`Microsoft.Azure.WebJobs.Extensions.CosmosDB`

I also track some custom telemetry with application insights, so I brought in the .NET Core version of the package. All of the APIs are the same so none of my code had to change.

## Migrating Proxies

[Proxies](https://docs.microsoft.com/en-us/azure/azure-functions/functions-proxies?utm_source=jeliknes&utm_medium=blog&utm_campaign=medium&WT.mc_id=medium-blog-jeliknes) are another great feature of Azure Functions. They provide the ability to modify incoming requests and responses and route public APIs to internal endpoints that may be different. In v1, my proxies definition looked like this:

{{<highlight JSON>}}
{
  "$schema": "http://json.schemastore.org/proxies",
  "proxies": {
    "Domain Redirect": {
      "matchCondition": {
        "route": "/{shortUrl}"
      },
      "backendUri": "http://%WEBSITE_HOSTNAME%/api/UrlRedirect/{shortUrl}"
    },
    "Root": {
      "matchCondition": {
        "route": "/"
      },
      "responseOverrides": {
        "response.statusCode": "301",
        "response.statusReason": "Moved Permanently",
        "response.headers.location": "https://blog.jeremylikness.com/?utm_source=jlikme&utm_medium=link&utm_campaign=url-shortener"
      }
    }
  }
}
{{</highlight>}}

The “Domain Redirect” route takes anything at the root and passes it to the full API. This essentially transforms a call to `https://jlik.me/XYZ` to `http://jlikme.azurewebsites.net/api/UrlRedirect/XYZ`. The “Root” route takes any “empty” calls (no short code) and redirects those to my blog.

The v2 engine fully supports proxies with an additional feature: you can define `localhost` to access any endpoints hosted in the same function app. For this reason, my “Domain Redirect” route changed to this:

`"backendUri": "http://localhost/api/UrlRedirect/{shortUrl}"`

Proxies are part of the functions engine so they are parsed and can be tested locally.

## UA Parser

A large part of my motivation for creating my own link shortener was to have control over my own data. I look at dashboards weekly to determine what topics are popular (and which links have no interest) and to understand what platforms are being used. The main source of metadata for this is the “user agent” that is passed in the HTTP request header. A typical user agent looks something like this:

`Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.16 Safari/537.36`

Through arcane wizardry you can parse the user agent and extract information about the browser, platform, and whether the agent is an automated bot. In the above example, the browser is Chrome version 31 and the platform is Windows 7. In v1, I used a .NET class that helps parse browser capabilities. The logic looked like this:

{{<highlight CSharp>}}
var capabilities = new HttpBrowserCapabilities()
{
    Capabilities = new Hashtable { { string.Empty, parsed.Agent } }
};
var factory = new BrowserCapabilitiesFactory();
factory.ConfigureBrowserCapabilities(new NameValueCollection(), capabilities);
factory.ConfigureCustomCapabilities(new NameValueCollection(), capabilities);
if (!string.IsNullOrEmpty(capabilities.Browser))
{
    var browser = capabilities.Browser;
    var version = capabilities.MajorVersion;
    var browserVersion = $"{browser} {capabilities.MajorVersion}";
    doc.browser = browser;
    doc.browserVersion = version;
    doc.browserWithVersion = browserVersion;
}
if (capabilities.Crawler)
{
    doc.crawler = 1;
}
if (capabilities.IsMobileDevice)
{
    doc.mobile = 1;
    var manufacturer = capabilities.MobileDeviceManufacturer;
    var model = capabilities.MobileDeviceModel;
    doc.mobileManufacturer = manufacturer;
    doc.mobileModel = model;
    doc.mobileDevice = $"{manufacturer} {model}";
}
else
{
    doc.desktop = 1;
}
if (!string.IsNullOrWhiteSpace(capabilities.Platform))
{
    doc.platform = capabilities.Platform;
}
{{</highlight>}}

The functionality was very limited. Here’s a snapshot of stats gathered with the old method:

{{<figure src="/blog/2019-02-13_migrating-azure-functions-from-v1-.net-to-v2-.net-standard/images/2.png" alt="Image of a pie chart" caption="v1 Browser Data">}}

The “browser capabilities” functionality doesn’t exist out of the box in .NET Core, so I did some research and landed on the [UA Parser](https://github.com/tobie/ua-parser?utm_source=jeliknes&utm_medium=blog&utm_campaign=medium&WT.mc_id=medium-blog-jeliknes) project. It contains some advanced logic to generically parse user agent strings and can be augmented with a set of configuration files that contain metadata about known agents. I have no desire to keep up with the latest files, so I chose to go with the basic metadata. This is a great aspect of Azure Functions: the ability to integrate third-party packages. The logic changed to this:

{{<highlight CSharp>}}
var parser = UAParser.Parser.GetDefault();
var client = parser.Parse(parsed.Agent);
{
    var browser = client.UserAgent.Family;
    var version = client.UserAgent.Major;
    var browserVersion = $"{browser} {version}";
    doc.browser = browser;
    doc.browserVersion = version;
    doc.browserWithVersion = browserVersion;
}
if (client.Device.IsSpider)
{
    doc.crawler = 1;
}
if (parsed.Agent.ToLowerInvariant().Contains("mobile"))
{
    doc.mobile = 1;
    var manufacturer = client.Device.Brand;
    doc.mobileManufacturer = manufacturer;
    var model = client.Device.Model;
    doc.mobileModel = model;
    doc.mobileDevice = $"{manufacturer} {model}";
}
else
{
    doc.desktop = 1;
}
if (!string.IsNullOrWhiteSpace(client.OS.Family))
{
    doc.platform = client.OS.Family;
    doc.platformVersion = client.OS.Major;
    doc.platformWithVersion = $"{client.OS.Family} {client.OS.Major}";
}
{{</highlight>}}

The data is richer, as this snapshot shows:

![Image of a pie chart](/blog/2019-02-13_migrating-azure-functions-from-v1-.net-to-v2-.net-standard/images/3.png)
<figcaption>v2 Browser Data</figcaption>

I am still figuring out what information I can collect and how to instrument it, but it’s nice to have the extra fidelity and have options to increase granularity.

## Testing

Many people focus on the “serverless” aspect of Azure Functions, without recognizing it is a cross-platform engine that can run on Windows, Linux, or macOS machines and even execute from within containers. This makes it incredibly easy to test. I was able to test all endpoints using the [Azure Storage Emulator](https://docs.microsoft.com/en-us/azure/storage/common/storage-use-emulator?utm_source=jeliknes&utm_medium=blog&utm_campaign=medium&WT.mc_id=medium-blog-jeliknes). I could have installed an emulator for Cosmos DB as well, but it was just as easy to create a test instance of the database and update my local connection string to test the analytics metadata. I was even able to test proxies locally prior to deploying.

## Deploying

> “Friends don’t let friends right-click deploy.”

I have a confession to make: I have not yet built a CI/CD pipeline for my functions app. Fortunately, both Visual Studio and Visual Studio Code are smart enough to do everything necessary to deploy the updated code. I _did_ right-click and deploy to my existing functions endpoint. All my configuration for custom domains, connection strings, etc. remained the same. The deployment process automatically detected a different version of the runtime and updated the configuration appropriately. Within seconds I had a production deployment of the updated link shortener and was able to start using it immediately.

## Summary

I have a bucket list of “next steps” I’d like to take with the project. I want to set up CI/CD. I want to create a deployment script to make it easier for anyone to create their own link shortener. I also wanted to migrate to the latest version and am happy not only for checking it off my list, but also for how easy it was. All told, the migration took me a few hours and has been running flawlessly for over a month now. As for performance compared to v1, it appears to be about the same.

The following snapshot is from an hour of activity. The “failed” indicator you see is not a failure in the service, but a failed look up meaning someone passed an invalid code.

![Image of connected nodes with performance data](/blog/2019-02-13_migrating-azure-functions-from-v1-.net-to-v2-.net-standard/images/4.png)
<figcaption>Application Insights</figcaption>

As you can see, performance is great across the board. Do you have a v1 functions app you are considering migrating? Have you already gone through the process? I would love to hear your thoughts and feedback in the comments below!

💡 For a complete list of considerations when migrating to v2, read the [breaking changes notice](https://github.com/Azure/app-service-announcements/issues/129?utm_source=jeliknes&utm_medium=blog&utm_campaign=medium&WT.mc_id=medium-blog-jeliknes)

Regards,

![Jeremy Likness](/blog/2019-02-13_migrating-azure-functions-from-v1-.net-to-v2-.net-standard/images/5.gif)
