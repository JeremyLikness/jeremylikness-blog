---
title: "Five RESTFul Web Design Patterns Implemented in ASP.NET Core 2.0 Part 1: Content Negotiation"
author: "Jeremy Likness"
date: 2017-12-01T14:44:03.851Z
years: "2017"
lastmod: 2019-06-13T10:44:19-07:00
series: "Five RESTFul Web Design Patterns Implemented in ASP.NET Core 2.0"
comments: true

description: "Learn how to implement several popular RESTful Web API design patterns like content negotation, HATEOAS, exception handling, and more using ASP .NET Core 2.0."

subtitle: "Leveraging cross-platform C# and .NET to build consumer-friendly Web APIs."
tags:
 - Rest Api 
 - Webapi 
 -  .NET Core 
 - API 
 - Api Development 

image: "/blog/2017-12-01_five-restful-web-design-patterns-implemented-in-asp.net-core-2.0-part-1-content-negotiation/images/2.png" 
images:
 - "/blog/2017-12-01_five-restful-web-design-patterns-implemented-in-asp.net-core-2.0-part-1-content-negotiation/images/1.jpeg" 
 - "/blog/2017-12-01_five-restful-web-design-patterns-implemented-in-asp.net-core-2.0-part-1-content-negotiation/images/2.png" 
 - "/blog/2017-12-01_five-restful-web-design-patterns-implemented-in-asp.net-core-2.0-part-1-content-negotiation/images/3.png" 
 - "/blog/2017-12-01_five-restful-web-design-patterns-implemented-in-asp.net-core-2.0-part-1-content-negotiation/images/4.png" 
 - "/blog/2017-12-01_five-restful-web-design-patterns-implemented-in-asp.net-core-2.0-part-1-content-negotiation/images/5.gif" 


aliases:
    - "/5-rest-api-designs-in-dot-net-core-1-29a8527e999c"
---

I recently presented a full day workshop on Web API design at [PASS Summit 2017](http://www.pass.org/summit/2017/Live.aspx). If I was a betting man, I’d gamble that I was invited as the result of my work on the [Web API Design jump start](https://mva.microsoft.com/en-US/training-courses/web-api-design-jump-start-8689) that I did for [Microsoft Virtual Academy (MVA)](https://mva.microsoft.com/). I built the workshop from the ground up and presented to about 40 attendees in Seattle. I chose to leverage [.NET Core 2.0](https://docs.microsoft.com/en-us/aspnet/core/?utm_source=jeliknes&utm_medium=blog&utm_campaign=webdesign&WT.mc_id=webdesign-blog-jeliknes&view=aspnetcore-5.0) for implementation examples because it is cross-platform and I can demo entirely in the cross-platform [Visual Studio Code](https://code.visualstudio.com/?utm_source=jeliknes&utm_medium=blog&utm_campaign=webdesign&WT.mc_id=webdesign-blog-jeliknes).

![Web API Session](/blog/2017-12-01_five-restful-web-design-patterns-implemented-in-asp.net-core-2.0-part-1-content-negotiation/images/1.jpeg)
<figcaption>Web API Session</figcaption>

You can access the decks for the talk and the code for the examples in the GitHub repository.

{{<github "JeremyLikness/PASS-2017">}}

Every example leveraged a simple set of APIs for an in-memory “to do” application. The “starter project” is named `Src-TodoApi` (it can be accessed <i class="fab fa-github"></i> [here](https://github.com/JeremyLikness/PASS-2017/tree/master/04-REST-Fundamentals/Src-TodoApi).) If you’re interested in learning about some of the more conceptual topics like _idempotency,_ you can <i class="fab fa-github"></i> [read the deck](https://github.com/JeremyLikness/PASS-2017/tree/master/Decks); this post covers several design ideas that are implemented in code.

## Content Negotiation

Properly implemented REST end points _may_ support content negotiation. The purpose is to provide a framework for determining the media format of the response. The most common example is to forego the ubiquitous JavaScript Object Notation (JSON) format and instead support the more seasoned Extensible Markup Language (XML). That means getting something like this:

{{<highlight xml>}}
<user id="1">
   <name>Jeremy Likness</name>
   <blog>https://blog.jeremylikness.com/</blog>
</user>
{{</highlight>}}

Instead of the more popular version that looks like this:

{{<highlight json>}}
{
  "user": {
    "id": 1,
    "name": "Jeremy Likness",
    "blog": "https://blog.jeremylikness.com"
  }
}
{{</highlight>}}

There are several ways to implement content negotiation. One is for the server to return a set of links for a request, each representing a different media type. A far more common approach is for the client to provide a list of acceptable formats in the request, leveraging the `Accept` header. It is then up to the server to detect which format is acceptable and format the result accordingly.

.NET Core 2.0 Web API supports JSON out of the box. To test this, use a tool like [PostMan](https://www.getpostman.com/) to `GET` a “to do” item. In the request headers, add:

`Accept: text/xml`

Despite the request for angle brackets, the response comes back with curly braces.

![Non-negotiation](/blog/2017-12-01_five-restful-web-design-patterns-implemented-in-asp.net-core-2.0-part-1-content-negotiation/images/2.png)
<figcaption>Non-negotiation</figcaption>

To properly support XML, first add the NuGet package:

`dotnet add package Microsoft.AspNetCore.Mvc.Formatters.Xml`

Then configure the MVC engine to “respect mah authori-tah” and match the media requests with the _formatter_ implementations.

{{<highlight CSharp>}}
services.AddMvc(options =>
{
    options.RespectBrowserAcceptHeader = true;
    options.FormatterMappings.SetMediaTypeMappingForFormat(
        "xml", MediaTypeHeaderValue.Parse("text/xml"));
    options.FormatterMappings.SetMediaTypeMappingForFormat(
        "json", MediaTypeHeaderValue.Parse("application/json"));
})
.AddXmlSerializerFormatters();
{{</highlight>}}

Build and run the project now, and you’ll see your request for `text/xml` is now honored.

![XML](/blog/2017-12-01_five-restful-web-design-patterns-implemented-in-asp.net-core-2.0-part-1-content-negotiation/images/3.png)
<figcaption>XML</figcaption>

You don’t have to stick with what’s in the box, either. You can create your own formatters so that “anyway you want it, that’s the way you need it …” I’m getting a little choked up right now. Is my age showing? If the formatter is text-based you can inherit from `TextOutputFormatter` and build your own parser. This one turns “to do” items into a comma-separated values.

Don’t forget to match the formatter to the media type and add an instance to the list of available formatters.

Future negotiations should go quite well!

![Command Separated Values](/blog/2017-12-01_five-restful-web-design-patterns-implemented-in-asp.net-core-2.0-part-1-content-negotiation/images/4.png)
<figcaption>Command Separated Values</figcaption>

If you’re lazy and didn’t want to follow along, the finished project is available <i class="fab fa-github"></i> [here](https://github.com/JeremyLikness/PASS-2017/tree/master/04-REST-Fundamentals/Slide10-TodoApi-CSV). I also made this short video to show you how to get started:

{{<youtube h6kWq6AyBsU>}}
<figcaption>Getting Started</figcaption>

This is the first article in a multi-part series. For easy navigation:

1. Intro and Content Negotiation (“you are here”)
2. [HATEOAS](/5-rest-api-designs-in-dot-net-core-2-ad2f204c2d11)
3. [Exceptions](/5-rest-api-designs-in-dot-net-core-3-91ebff38393d)
4. [Concurrency](/5-rest-api-designs-in-dot-net-core-4-8ac863e961e4)
5. [Security](/5-rest-api-designs-in-dot-net-core-5-3ee2cf16713e)
6. [Bonus (because I said it would be five): Swagger](/5-rest-api-designs-in-dot-net-core-6-9e87cf562241)

Regards,

![Jeremy Likness](/blog/2017-12-01_five-restful-web-design-patterns-implemented-in-asp.net-core-2.0-part-1-content-negotiation/images/5.gif)
