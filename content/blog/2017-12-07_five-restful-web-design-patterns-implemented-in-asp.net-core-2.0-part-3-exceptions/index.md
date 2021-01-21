---
title: "Five RESTFul Web Design Patterns Implemented in ASP.NET Core 2.0 Part 3: Exceptions"
author: "Jeremy Likness"
date: 2017-12-07T12:36:24.161Z
years: "2017"
lastmod: 2019-06-13T10:44:23-07:00
series: "Five RESTFul Web Design Patterns Implemented in ASP.NET Core 2.0"
comments: true

description: "How to consistently manage server-side exceptions in ASP. NET Core Web API apps to return a standard response that can be easily processed by clients."

subtitle: "Setting Expectations for Exceptions"
tags:
 - Aspnet 
 - Webap 
 - API 
 -  .NET 
 - Api Design 

image: "/blog/2017-12-07_five-restful-web-design-patterns-implemented-in-asp.net-core-2.0-part-3-exceptions/images/3.jpeg" 
images:
 - "/blog/2017-12-07_five-restful-web-design-patterns-implemented-in-asp.net-core-2.0-part-3-exceptions/images/1.png" 
 - "/blog/2017-12-07_five-restful-web-design-patterns-implemented-in-asp.net-core-2.0-part-3-exceptions/images/2.png" 
 - "/blog/2017-12-07_five-restful-web-design-patterns-implemented-in-asp.net-core-2.0-part-3-exceptions/images/3.jpeg" 
 - "/blog/2017-12-07_five-restful-web-design-patterns-implemented-in-asp.net-core-2.0-part-3-exceptions/images/4.gif" 


aliases:
    - "/5-rest-api-designs-in-dot-net-core-3-91ebff38393d"
---

This is the third part in a multi-part series on Web API design. Here is the full list for easy navigation:

1. [Intro and Content Negotiation](/5-rest-api-designs-in-dot-net-core-1-29a8527e999c)
2. [HATEOAS](/5-rest-api-designs-in-dot-net-core-2-ad2f204c2d11)
3. Exceptions (“x” marks the spot)
4. [Concurrency](/5-rest-api-designs-in-dot-net-core-4-8ac863e961e4)
5. [Security](/5-rest-api-designs-in-dot-net-core-5-3ee2cf16713e)
6. [Bonus (because I said it would be five): Swagger](/5-rest-api-designs-in-dot-net-core-6-9e87cf562241)

Without exception, you should handle exceptions consistently. Chew on that one for a minute. If you’ve been a programmer for more than a few seconds, you know the rule of thumb is to expect the unexpected. Exceptions are those nasty faults that happen when things don’t go as expected, but fortunately there are ways to deal with them and, in the case of APIs, handle them gracefully at the client.

Take, for instance, our example set of APIs that provide a “to do” list. ASP.NET Core is kind enough to keep your website and APIs up and running even after your code falls down, but the response it provides is about as useful as an 8-minute workout.

![A Typical Exception](/blog/2017-12-07_five-restful-web-design-patterns-implemented-in-asp.net-core-2.0-part-3-exceptions/images/1.png)
<figcaption>A Typical Exception</figcaption>

Fortunately, there’s a standard for dealing with this. Take a look at Microsoft’s [REST API Guidelines](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md?utm_source=jeliknes&utm_medium=blog&utm_campaign=webapi&WT.mc_id=webapi-blog-jeliknes#710-response-formats). The section for response codes provides some detail around a standard way to send errors back to the client. Although you can handle these globally by leveraging the various [error handling features](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/error-handling?utm_source=jeliknes&utm_medium=blog&utm_campaign=webapi&WT.mc_id=webapi-blog-jeliknes&view=aspnetcore-5.0) available to ASP.NET Core apps, sometimes you may want fine-grained control over exceptions to return custom information and massage the data to avoid leaking sensitive information.

The <i class="fab fa-github"></i> [example app](https://github.com/JeremyLikness/PASS-2017/tree/master/04-REST-Fundamentals/Slide18-TodoApi-Exceptions) handles exceptions by providing a generic `ExceptionHelper` class to assist with processing errors (because “help with exceptions” seemed redundant). Although the example does this is in a generic fashion to keep the demo simple, a production app might inspect the type of the exception and format the response differently based on known exception types such as data exceptions, security exceptions, etc.

{{<highlight CSharp>}}
public static class ExceptionHelper
{
    public static object ProcessError(Exception ex)
    {
        return new {
            error = new {
                code = ex.HResult,
                message = ex.Message
            }
        };
    }
}
{{</highlight>}}

For some reason I tend to write perfect code all of the time (if you believe that, DM me on Twitter about the timeshare I have for sale), so I had to “force an error” to get my app to crash. For this demo, I plucked a <i class="fab fa-youtube"></i> [completely random number](https://www.youtube.com/watch?v=6WTdTwcmxyo) right out of the air to throw an exception when it’s referenced.

{{<highlight CSharp>}}
if (id == 8675309) 
{
    throw new Exception("Bad digits.");
}
{{</highlight>}}

This, of course, is in a `try ... catch` block. When the exception is caught, it uses the standard “bad request” status code to return an error object.

{{<highlight CSharp>}}
catch(Exception ex)
{
    return new BadRequestObjectResult(ExceptionHelper.ProcessError(ex));
}
{{</highlight>}}

> Remember, this is a simple demonstration. The link I shared earlier in the article explains how to handle uncaught exceptions globally in case you always use the same strategy and don’t want to pepper your code with tries and catches.

The next time our server takes exception to what we ask of it, instead of an unhelpful 500 error (that should only get thrown for truly unanticipated server mishaps) we get a more refined 400 error along with details.

![An Exceptional Exception](/blog/2017-12-07_five-restful-web-design-patterns-implemented-in-asp.net-core-2.0-part-3-exceptions/images/2.png)
<figcaption>An Exceptional Exception</figcaption>

Even better news: if you’re held in the thrall of one of today’s myriad JavaScript front end frameworks like [Angular](https://angular.io/), [React](https://reactjs.org/), or [Vue](https://vuejs.org/) (I had to list those for SEO), most of them have the concept of a global _interceptor_ that can handle response codes from HTTP requests. That allows you to build a standard error handling component that deals with requests in a consistent fashion. Now you have something more exciting to do than figure out modal dialogues and spinners.

![I mentioned spinners, right?](/blog/2017-12-07_five-restful-web-design-patterns-implemented-in-asp.net-core-2.0-part-3-exceptions/images/3.jpeg)
<figcaption>I mentioned spinners, right?</figcaption>

That’s not all, folks … there’s more to this series!

Easy navigation:

1. [Intro and Content Negotiation](/5-rest-api-designs-in-dot-net-core-1-29a8527e999c)
2. [HATEOAS](/5-rest-api-designs-in-dot-net-core-2-ad2f204c2d11)
3. Exceptions (“x” marks the spot)
4. [Concurrency](/5-rest-api-designs-in-dot-net-core-4-8ac863e961e4)
5. [Security](/5-rest-api-designs-in-dot-net-core-5-3ee2cf16713e)
6. [Bonus (because I said it would be five): Swagger](/5-rest-api-designs-in-dot-net-core-6-9e87cf562241)

Regards,

![Jeremy Likness](/blog/2017-12-07_five-restful-web-design-patterns-implemented-in-asp.net-core-2.0-part-3-exceptions/images/4.gif)
