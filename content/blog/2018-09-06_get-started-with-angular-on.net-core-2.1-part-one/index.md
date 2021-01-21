---
title: "Get Started with Angular on .NET Core 2.1 (Part One)"
author: "Jeremy Likness"
date: 2018-09-06T01:04:49.997Z
years: "2018"
lastmod: 2019-06-13T10:45:07-07:00
comments: true
series: "Angular and .NET Core"

description: "Learn how Angular and .NET Core provide everything you need to deliver modern single page web applications. Set up a static web app with a dynamic REST API back-end."

subtitle: "Cross-platform client-side JavaScript SPA framework, meet cross-platform server-side .NET Core framework."
tags:
 - JavaScript 
 - Typescript 
 - Angular 
 -  .NET 
 - Azure 

image: "/blog/2018-09-06_get-started-with-angular-on.net-core-2.1-part-one/images/3.png" 
images:
 - "/blog/2018-09-06_get-started-with-angular-on.net-core-2.1-part-one/images/1.png" 
 - "/blog/2018-09-06_get-started-with-angular-on.net-core-2.1-part-one/images/2.png" 
 - "/blog/2018-09-06_get-started-with-angular-on.net-core-2.1-part-one/images/3.png" 
 - "/blog/2018-09-06_get-started-with-angular-on.net-core-2.1-part-one/images/4.gif" 


aliases:
    - "/get-started-with-angular-on-net-core-2-1-part-one-2effcfe8fae9"
---

[Angular](https://angular.io/) is one of the top “go to” frameworks for developing client-side Single Page Applications (SPA). It supports the “[3 D’s of Modern Web Development](/the-three-ds-of-modern-web-development-55d69fe048da)” out of the box with built-in declarative templates that support data-binding and a highly configurable dependency injection (DI) framework. I’ve worked with Angular since it was “[AngularJS](https://angularjs.org/).” I have no ambition to compare it with other frameworks (like [ReactJs] (https://reactjs.org/)or [Vuejs](https://vuejs.org/)) in this post; the goal is to illustrate how Angular works with [.NET Core](https://docs.microsoft.com/en-us/dotnet/core/introduction?utm_source=jeliknes&utm_medium=blog&utm_campaign=medium&WT.mc_id=medium-blog-jeliknes).

![.NET Core and Angular Logos](/blog/2018-09-06_get-started-with-angular-on.net-core-2.1-part-one/images/1.png)

.NET Core is a cross-platform and open source implementation of the APIs defined by the [.NET Standard](https://docs.microsoft.com/en-us/dotnet/standard/net-standard?utm_source=jeliknes&utm_medium=blog&utm_campaign=medium&WT.mc_id=medium-blog-jeliknes). Apps written for .NET Core are capable of running on Windows machines (as far back as Windows 7), Mac OS and several flavors of Linux. Apps are authored in several languages; [C#](https://docs.microsoft.com/en-us/dotnet/csharp/?utm_source=jeliknes&utm_medium=blog&utm_campaign=medium&WT.mc_id=medium-blog-jeliknes) and [F#](https://docs.microsoft.com/en-us/dotnet/fsharp/?utm_source=jeliknes&utm_medium=blog&utm_campaign=medium&WT.mc_id=medium-blog-jeliknes) are the most popular. Write everything from back-end APIs to dynamic websites, and as a bonus there is a [template to integrate Angular with .NET Core](https://docs.microsoft.com/en-us/aspnet/core/client-side/spa/angular?view=aspnetcore-2.1&tabs=visual-studio&utm_source=jeliknes&utm_medium=blog&utm_campaign=medium&WT.mc_id=medium-blog-jeliknes). There are many options to deploy and host the apps in the Azure cloud.

Recently, I presented a session about Angular and .NET Core. This series is based on the content and demos of the session. Click or tap to download the presentation: [Angular in the .NET World](https://jlikme.blob.core.windows.net/presentations/angularandnet.pptx?WT.mc_id=medium-blog-jeliknes). The code is all contained in the <i class="fab fa-github"></i> [Angular and .NET GitHub repo](https://github.com/JeremyLikness/angular-net).

You can watch the full presentation here:

{{<youtube xrzpYMstTvc>}}

This is a four-part series. You can navigate to the parts below (links will become active as articles are available):

1. **Get Started with Angular on .NET Core 2.1 (you are here)**
2. [The Angular .NET Core 2.1 Template](/the-angular-net-core-2-1-template-part-two-d4db52550764)
3. [Server-side Rendering (SSR) with Angular in .NET Core 2.1](/server-side-rendering-ssr-with-angular-in-net-core-2-1-part-three-481cb42d1ed2)
4. [Deploy Angular and .NET Core 2.1 to the Azure Cloud](/deploy-angular-and-net-core-2-1-to-the-azure-cloud-part-four-d68594807c7a)

In this post I’ll share three specific ways Angular and .NET Core can work together, along with a few pointers for hosting the finished apps. I assume you have some familiarity with both frameworks. If not, follow the links earlier in this article because the documentation for both technologies is very thorough with easy-to-follow tutorials.

## Approach One: “Gotta Keep ’em Separated”

A common approach to building SPA applications is to package the website as a set of static assets and host as static web pages, then stand up a separate set of back-end services that the application communicates with. .NET Core supports [building REST APIs](https://docs.microsoft.com/en-us/aspnet/core/web-api/?view=aspnetcore-2.1&utm_source=jeliknes&utm_medium=blog&utm_campaign=medium&WT.mc_id=medium-blog-jeliknes) out of the box, with integrated [support for various authentication and authorization schemes](https://docs.microsoft.com/en-us/aspnet/core/security/authentication/identity?view=aspnetcore-2.1&tabs=visual-studio&utm_source=jeliknes&utm_medium=blog&utm_campaign=medium&WT.mc_id=medium-blog-jeliknes) as well as [Swagger](https://docs.microsoft.com/en-us/aspnet/core/tutorials/web-api-help-pages-using-swagger?view=aspnetcore-2.1&utm_source=jeliknes&utm_medium=blog&utm_campaign=medium&WT.mc_id=medium-blog-jeliknes)to document the end points.

In this approach, you take the [standard steps to stand up your Angular app](https://angular.io/start?utm_source=jeliknes&utm_medium=blog&utm_campaign=medium&WT.mc_id=medium-blog-jeliknes) as a separate project. For the <i class="fab fa-github"></i> [sample app](https://github.com/JeremyLikness/angular-net) we’ll make a few tweaks, but first I want to walk through the .NET Core back-end. After you [install .NET Core](https://dotnet.microsoft.com/learn/get-started-with-dotnet-tutorial?utm_source=jeliknes&utm_medium=blog&utm_campaign=medium&WT.mc_id=medium-blog-jeliknes), create a directory and run the command to create a new Web API project:

`dotnet new webapi`

Rename the `ValuesController` to `BifurcController` and populate it with the following code:

{{<highlight CSharp>}}
[Route("api/[controller]")]
[ApiController]
public class BifurcController : ControllerBase
{
    private static readonly Random generator = new Random();

    // GET api/values/3.5?skip=10&iterations=100
    [HttpGet("{r}")]
    public ActionResult<float[]> Get(
        float r,
        [FromQuery] 
        int skip,
        [FromQuery] 
        int iterations)
    {
        Console.WriteLine($"{r}, {skip}, {iterations}");
        if (iterations <= 0)
        {
            return BadRequest("Iterations must be a positive integer.");
        }
        if (skip > iterations)
        {
            return BadRequest("Skip must be less than iterations.");
        }
        var x = 0.5f;
        var result = new List<float>();
        for (var i = 0; i < iterations; i += 1) {
            x = r * x * (1.0f - x);
            if (i >= skip) 
            {
                result.Add(x);
            }
        }
        return Ok(result.ToArray());
    }
}
{{</highlight>}}

The `HttpGet` attribute defines the verbs this endpoint can take and includes a route designation that expects a variable called `r`. This will automatically get parsed and passed to the method. The method also takes query parameters (flagged by `FromQuery`) that indicate how many iterations to run (`iterations`) and how many results to ignore (`skip`). It then recursively runs:

`r(x) = x *n*(1.0-x)`

The results are stored in an array and returned. At this point you can launch the app with:

`dotnet run`

Then navigate to a properly constructed URL to see the results:

![A sample API run](/blog/2018-09-06_get-started-with-angular-on.net-core-2.1-part-one/images/2.png)
<figcaption>A sample API run</figcaption>

On the Angular side, this is a simple service that fetches results based on a passed in `r` value:

{{<highlight TypeScript>}}
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

const BIFURC_URI: string = "https://localhost:5001/api/Bifurc";

@Injectable({
  providedIn: 'root'
})
export class BifurcationService {

  constructor(private http: HttpClient) {

   }

   getPoints(r: number, skip: number, iterations: number) {
     let params = new HttpParams()
      .set('skip', `${skip}`)
      .set('iterations', `${iterations}`);
     return this.http.get<number[]>(`${BIFURC_URI}/${r}/`, { params });
   }
}
{{</highlight>}}

Add a `canvas` declaration to the main `app.component.html` page:

`<canvas id="mainCanvas" #mainCanvas></canvas>`

Then add the code to call the service and render the results:

{{<highlight TypeScript>}}
@ViewChild('mainCanvas') mainCanvasRef: ElementRef;
context: CanvasRenderingContext2D = null;
title = 'static-app';

constructor(private service: BifurcationService) {

}

ngAfterViewInit() {
  let canvas = <HTMLCanvasElement>this.mainCanvasRef.nativeElement;
  this.context = canvas.getContext("2d");
  canvas.width = 800;
  canvas.height = 600;
  this.context.fillStyle = "rgba(0, 0, 0, 0.2)";
  this.render();
}

render() {
  for (let x = 0; x < 800; x += 1) {
    this.iterate_r(x);
  }
}

iterate_r(x: number) {
  let r = (x/800.0)*4.0;
  this.service.getPoints(r, 10, 100).subscribe(result => {
    result.forEach(x1 => {
      let y = 600 - (x1 * 600);
      this.context.fillRect(x, y, 2, 2);
    });
  });
}
{{</highlight>}}

This is when I add a simple disclaimer:

> I’m cutting corners to keep the demo simple. Ordinarily you’d inject the base URL from a service and build the graph as it’s own component. We’re keeping it simple here!

If all goes well you’ll see something like this:

![Static app with .NET Core backend](/blog/2018-09-06_get-started-with-angular-on.net-core-2.1-part-one/images/3.png)
<figcaption>Static app with .NET Core backend</figcaption>

… and that’s how we use fractals to teach code!

[**Learn more about .NET Core here.**](https://docs.microsoft.com/en-us/dotnet/core/introduction?utm_source=jeliknes&utm_medium=blog&utm_campaign=medium&WT.mc_id=medium-blog-jeliknes)

Although this approach works perfectly fine, there are a few drawbacks. You have to manage two separate projects and debug them separately as well. In the [next article](/the-angular-net-core-2-1-template-part-two-d4db52550764), you will learn how to leverage a built-in .NET Core template to manage the client and server components of your web app in a single project.

Regards,

![Jeremy Likness](/blog/2018-09-06_get-started-with-angular-on.net-core-2.1-part-one/images/4.gif)

Next: [The Angular .NET Core 2.1 Template](/the-angular-net-core-2-1-template-part-two-d4db52550764)

This is a four-part series. You can navigate to the parts below (links will become active as articles are available:

1. **Get Started with Angular on .NET Core 2.1 (you are here)**
2. [The Angular .NET Core 2.1 Template](/the-angular-net-core-2-1-template-part-two-d4db52550764)
3. [Server-side Rendering (SSR) with Angular in .NET Core 2.1](/server-side-rendering-ssr-with-angular-in-net-core-2-1-part-three-481cb42d1ed2)
4. [Deploy Angular and .NET Core 2.1 to the Azure Cloud](/deploy-angular-and-net-core-2-1-to-the-azure-cloud-part-four-d68594807c7a)
