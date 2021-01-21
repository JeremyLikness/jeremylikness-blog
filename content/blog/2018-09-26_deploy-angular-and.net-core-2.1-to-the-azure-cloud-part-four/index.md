---
title: "Deploy Angular and .NET Core 2.1 to the Azure Cloud (Part Four)"
author: "Jeremy Likness"
date: 2018-09-26T15:46:58.653Z
years: "2018"
lastmod: 2019-06-13T10:45:12-07:00
comments: true
toc: true
series: "Angular and .NET Core"

description: "Learn how to deploy an Angular application with a .NET Core backend to the cloud using serverless, static websites, and Platform-as-a-Service (PaaS) on Azure."

subtitle: "A tale of static websites, Web Apps, serverless functions and containers."
tags:
 - Angular 
 -  .NET 
 -  .NET Core 
 - Azure 
 - Serverless 

image: "/blog/2018-09-26_deploy-angular-and.net-core-2.1-to-the-azure-cloud-part-four/images/7.png" 
images:
 - "/blog/2018-09-26_deploy-angular-and.net-core-2.1-to-the-azure-cloud-part-four/images/1.png" 
 - "/blog/2018-09-26_deploy-angular-and.net-core-2.1-to-the-azure-cloud-part-four/images/2.png" 
 - "/blog/2018-09-26_deploy-angular-and.net-core-2.1-to-the-azure-cloud-part-four/images/3.png" 
 - "/blog/2018-09-26_deploy-angular-and.net-core-2.1-to-the-azure-cloud-part-four/images/4.png" 
 - "/blog/2018-09-26_deploy-angular-and.net-core-2.1-to-the-azure-cloud-part-four/images/5.png" 
 - "/blog/2018-09-26_deploy-angular-and.net-core-2.1-to-the-azure-cloud-part-four/images/6.png" 
 - "/blog/2018-09-26_deploy-angular-and.net-core-2.1-to-the-azure-cloud-part-four/images/7.png" 
 - "/blog/2018-09-26_deploy-angular-and.net-core-2.1-to-the-azure-cloud-part-four/images/8.gif" 


aliases:
    - "/deploy-angular-and-net-core-2-1-to-the-azure-cloud-part-four-d68594807c7a"
---

Your Angular with .NET Core app is up and running on your laptop. That’s great, but your customers aren’t going to connect to your laptop, are they? It’s time to deploy your app to the cloud. Azure has several options available that we’ll look at in this final article in the series.

This is a four-part series. You can navigate to the parts below (links will become active as articles are available:

1. [Get Started with Angular on .NET Core 2.1](/get-started-with-angular-on-net-core-2-1-part-one-2effcfe8fae9)
2. [The Angular .NET Core 2.1 Template](/the-angular-net-core-2-1-template-part-two-d4db52550764)
3. [Server-side Rendering (SSR) with Angular in .NET Core 2.1](/server-side-rendering-ssr-with-angular-in-net-core-2-1-part-three-481cb42d1ed2)
4. **Deploy Angular and .NET Core 2.1 to the Azure Cloud (you are here)**

How you deploy your application depends on a variety of factors, including the approach you used to build your app and the technologies your team is comfortable using.

## Strategy One: Static Website

If your Angular app is separate and you are using .NET Core only for the back-end, one way to publish the client code is to run a production build:

`ng build --prod`

This will produce static assets in the `dist` directory by default. You can then leverage the new [static website feature](https://docs.microsoft.com/en-us/azure/storage/blobs/storage-blob-static-website?utm_source=jeliknes&utm_medium=blog&utm_campaign=medium&WT.mc_id=medium-blog-jeliknes) of [Azure Storage](https://docs.microsoft.com/en-us/azure/storage/?utm_source=jeliknes&utm_medium=blog&utm_campaign=medium&WT.mc_id=medium-blog-jeliknes) for amazingly inexpensive hosting of your assets. The quick start in the previous link demonstrates how to set it up using the command line interface (CLI) but you can easily create, upload, and host the files through the portal as well.

Create a storage account and be sure to select `v2` for the current version.

![Create a storage account](/blog/2018-09-26_deploy-angular-and.net-core-2.1-to-the-azure-cloud-part-four/images/1.png)
<figcaption>Create a Storage Account</figcaption>

Navigate to the “Static Website (preview)” option and enable it. Enter a default document name and optional error document.

![Set up Static Website](/blog/2018-09-26_deploy-angular-and.net-core-2.1-to-the-azure-cloud-part-four/images/2.png)
<figcaption>Set up Static Website</figcaption>

After you click “Save” you are shown the special container you can upload your assets to named `$web` and the path to your website.

![Blob container name and URL for Static Website](/blog/2018-09-26_deploy-angular-and.net-core-2.1-to-the-azure-cloud-part-four/images/3.png)
<figcaption>Blob container name and URL for Static Website</figcaption>

Navigate to “Blobs” and select the special web container, then upload your static assets.

![Static Website Assets](/blog/2018-09-26_deploy-angular-and.net-core-2.1-to-the-azure-cloud-part-four/images/4.png)
<figcaption>Static Website Assets</figcaption>

Now you can open your favorite browser, navigate to your URL and run your live web app!

![Statically hosted Angular app](/blog/2018-09-26_deploy-angular-and.net-core-2.1-to-the-azure-cloud-part-four/images/5.png)
<figcaption>Statically hosted Angular app</figcaption>

The feature is in preview, and there are a few dragons. My colleague Anthony Chu had a few caveats to share as of this publication:

{{<customtwitter 1036023917633142785>}}

I run a [link shortening service](/build-a-serverless-link-shortener-with-analytics-faster-than-finishing-your-latte-8c094bb1df2c) that leverages an Azure Storage account for storing the URLs, and over the course of a month my storage charges for [locally redundant storage](https://docs.microsoft.com/en-us/azure/storage/common/storage-redundancy?utm_source=jeliknes&utm_medium=blog&utm_campaign=medium&WT.mc_id=medium-blog-jeliknes) never exceeded $0.10 (that’s right, I stop on a dime). Recently I upgraded for [geo-replicated storage](https://docs.microsoft.com/en-us/azure/storage/common/storage-redundancy?utm_source=jeliknes&utm_medium=blog&utm_campaign=medium&WT.mc_id=medium-blog-jeliknes) so I have a fail-over option in the event of an outage. That brings me to just under $1 per month.

## Strategy Two “A”: API with Serverless Functions

I’m a big fan of [serverless](https://docs.microsoft.com/en-us/dotnet/architecture/serverless/) and use it for many of my own projects. The two features I love the most is automatic scaling to accommodate requests and micro-billing (I only pay when the functions are actually invoked). The Azure solution for serverless code is called [Azure Functions](https://docs.microsoft.com/en-us/dotnet/architecture/serverless/azure-functions).

I have a few tweets that provide my TL;DR; (too long, don’t read — it means “here be a summary”) for serverless:

{{<customtwitter 997106697171857408>}}

{{<customtwitter 991291457809108994>}}

You can use the [Azure pricing calculator](https://azure.microsoft.com/en-us/pricing/calculator/?WT.mc_id=medium-blog-jeliknes) to get a sense of the potential cost (and in many cases, savings) from leveraging this service .There are two components to billing: **invocations** (how many times the function is called) and **Gigabyte/seconds (GB/s)**. The first is easy to understand and you get 1,000,000 (yes, that’s a _million_) calls for free. The second requires a bit of explanation. If you plot the time it takes for your function to run on a horizontal (x) axis, then plot the amount of memory it uses along the vertical (y) axis, you’ll get something like this:

![Gigabyte seconds](/blog/2018-09-26_deploy-angular-and.net-core-2.1-to-the-azure-cloud-part-four/images/6.png)
<figcaption>Gigabyte seconds</figcaption>

The area under the plot (the solid blue) represents the total Gigabytes/second used. You get 400,000 free and then are billed for overages. Let’s assume you have a function that consumes around 128 megabytes of memory on average and takes a whopping second to run (that’s eons in Internet time). Let’s also assume it is called 100,000 times per day (3,000,000 times in a 30-day month). For that hypothetical month, the pricing calculator shows the total cost will be … are you ready? I’ll let the calculator speak for itself.

![Sample functions pricing](/blog/2018-09-26_deploy-angular-and.net-core-2.1-to-the-azure-cloud-part-four/images/7.png)
<figcaption>Sample functions pricing</figcaption>

The code for an endpoint in functions is very similar to what you’d write for a Web API controller.

{{<highlight CSharp>}}
[FunctionName("Bifurc")]
public static IActionResult Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "Bifurc/{rValue}")]HttpRequest req,
      float rValue, ILogger log)
{
    log.LogInformation("C# HTTP trigger function processed a request.");

    string skip = req.Query["skip"];
    string iterations = req.Query["iterations"];
    string badRequest = string.Empty;

    log.LogInformation($"r={rValue},skip={skip},iterations={iterations}");

    if (!int.TryParse(skip, out int s))
    {
        return new BadRequestObjectResult("Skip parameter is required.");
    }

    if (!int.TryParse(iterations, out int i))
    {
        return new BadRequestObjectResult("Iterations parameter is required.");
    }

    if (s > i)
    {
        return new BadRequestObjectResult("Skip cannot exceed iterations.");
    }

    var x = 0.5f;
    var result = new List<float>();
    for (var iter = 0; iter < i; iter += 1)
    {
        x = rValue * x * (1.0f - x);
        if (iter >= s)
        {
            result.Add(x);
        }
    }
    return new OkObjectResult(result.ToArray());
  }
}
{{</highlight>}}

Most of the code is simply verifying the correct parameters have been passed. Built-in helper methods are leveraged to return the appropriate type of response. A static website with a functions-based back end may be the least expensive hosting option that is also low overhead and maintenance.

## Strategy Two “B”: API with Azure Web App

If you opt to use a full .NET Core Web API app to stand up your REST APIs, you can leverage _Platform-as-a-Service (PaaS)_ and publish using [Azure App Service](https://docs.microsoft.com/en-us/azure/app-service/?WT.mc_id=medium-blog-jeliknes). Everything you need from the host operating system, the .NET Core runtime and a web server is provided so you can focus on your project as the unit of configuration and deployment. You can create resources and publish directly from Visual Studio and Visual Studio Code or deploy from the command line.

I would walk through the steps here, but they are already covered with two great quick start documents (after all, it _is_ cross-platform). Check out:

* [Publish your ASP.NET Core app to Azure (Windows)](https://docs.microsoft.com/en-us/azure/app-service/quickstart-dotnetcore?WT.mc_id=medium-blog-jeliknes)
* [Publish your ASP.NET Core app to Azure (Linux)](https://docs.microsoft.com/en-us/azure/app-service/quickstart-dotnetcore?pivots=platform-linux&WT.mc_id=medium-blog-jeliknes)

The deployment is straightforward regardless of your tool of choice and you have full control over scale out (number of instances) and scale up (size of machines).

## Strategy Three: Full Project with Azure Web App

What if you’ve configured the Angular app as part of your project, using the .NET Core Angular template? No problem! The same steps from Strategy One “B” will work for your combined Angular and .NET Core app. The build will automatically produce the correct assets for the publish to deploy to the Azure site.

## Conclusion

My goal with this series was to introduce you to Angular on .NET and share the various ways the two web app technologies can work together on Azure.

To recap, you can learn more about:

* [The Angular .NET Core 2.1 template](https://docs.microsoft.com/en-us/aspnet/core/client-side/spa/angular?view=aspnetcore-2.1&tabs=visual-studio&utm_source=jeliknes&utm_medium=blog&utm_campaign=medium&WT.mc_id=medium-blog-jeliknes)
* [Static websites](https://docs.microsoft.com/en-us/azure/storage/blobs/storage-blob-static-website?utm_source=jeliknes&utm_medium=blog&utm_campaign=medium&WT.mc_id=medium-blog-jeliknes)
* [Azure Functions](https://docs.microsoft.com/en-us/azure/azure-functions/?utm_source=jeliknes&utm_medium=blog&utm_campaign=medium&WT.mc_id=medium-blog-jeliknes)
* [Azure Web Apps](https://docs.microsoft.com/en-us/azure/app-service/overview?utm_source=jeliknes&utm_medium=blog&utm_campaign=medium&WT.mc_id=medium-blog-jeliknes)

Happy Angular coding!

Regards,

![Jeremy Likness](/blog/2018-09-26_deploy-angular-and.net-core-2.1-to-the-azure-cloud-part-four/images/8.gif)

Previous: [Server-side Rendering (SSR) with Angular in .NET Core 2.1](/server-side-rendering-ssr-with-angular-in-net-core-2-1-part-three-481cb42d1ed2)

This is a four-part series. You can navigate to the parts below (links will become active as articles are available:

1. [Get Started with Angular on .NET Core 2.1](/get-started-with-angular-on-net-core-2-1-part-one-2effcfe8fae9)
2. [The Angular .NET Core 2.1 Template](/the-angular-net-core-2-1-template-part-two-d4db52550764)
3. [Server-side Rendering (SSR) with Angular in .NET Core 2.1](/server-side-rendering-ssr-with-angular-in-net-core-2-1-part-three-481cb42d1ed2)
4. **Deploy Angular and .NET Core 2.1 to the Azure Cloud (you are here)**
