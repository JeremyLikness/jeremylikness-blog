---
title: "Create a Serverless Angular App with Azure Functions and Blob Storage"
author: "Jeremy Likness"
date: 2017-04-07T00:00:00.000Z
years: "2017"
lastmod: 2019-06-13T10:43:21-07:00

description: "Learn how to create a fully serverless Angular TypeScript and Node.js app using Azure Functions and Azure Blob Storage."

subtitle: "Learn how to create a fully serverless Angular TypeScript and Node.js app using Azure Functions and Azure Blob Storage."
tags:
 - Angular2 
 - Azure 
 - Azure Functions 
 - Nodejs 
 - Typescript 

image: "/blog/2017-04-07_create-a-serverless-angular-app-with-azure-functions-and-blob-storage/images/11." 
images:
 - "/blog/2017-04-07_create-a-serverless-angular-app-with-azure-functions-and-blob-storage/images/1." 
 - "/blog/2017-04-07_create-a-serverless-angular-app-with-azure-functions-and-blob-storage/images/2." 
 - "/blog/2017-04-07_create-a-serverless-angular-app-with-azure-functions-and-blob-storage/images/3." 
 - "/blog/2017-04-07_create-a-serverless-angular-app-with-azure-functions-and-blob-storage/images/4." 
 - "/blog/2017-04-07_create-a-serverless-angular-app-with-azure-functions-and-blob-storage/images/5." 
 - "/blog/2017-04-07_create-a-serverless-angular-app-with-azure-functions-and-blob-storage/images/6." 
 - "/blog/2017-04-07_create-a-serverless-angular-app-with-azure-functions-and-blob-storage/images/7." 
 - "/blog/2017-04-07_create-a-serverless-angular-app-with-azure-functions-and-blob-storage/images/8." 
 - "/blog/2017-04-07_create-a-serverless-angular-app-with-azure-functions-and-blob-storage/images/9." 
 - "/blog/2017-04-07_create-a-serverless-angular-app-with-azure-functions-and-blob-storage/images/10." 
 - "/blog/2017-04-07_create-a-serverless-angular-app-with-azure-functions-and-blob-storage/images/11." 
 - "/blog/2017-04-07_create-a-serverless-angular-app-with-azure-functions-and-blob-storage/images/12." 
 - "/blog/2017-04-07_create-a-serverless-angular-app-with-azure-functions-and-blob-storage/images/13." 
 - "/blog/2017-04-07_create-a-serverless-angular-app-with-azure-functions-and-blob-storage/images/14." 
 - "/blog/2017-04-07_create-a-serverless-angular-app-with-azure-functions-and-blob-storage/images/15." 
 - "/blog/2017-04-07_create-a-serverless-angular-app-with-azure-functions-and-blob-storage/images/16.gif" 


aliases:
    - "/create-a-serverless-angular-app-with-azure-functions-and-blob-storage-20164c083c88"
---

As DevOps continues to blur the lines between traditional IT operations and development, platforms and tools are rapidly evolving to embrace the new paradigm. While the use of containers explodes throughout global enterprises, another technology has been rapidly gaining momentum. On Amazon AWS it’s referred to as [AWS Lambda](https://aws.amazon.com/lambda/), on Azure it’s name is [Azure Functions](https://goo.gl/xnsnHD) and in the Node.js world a popular option is [webtask.io](https://webtask.io/).
> Read my new series about [Angular with .NET] (https://blog.jeremylikness.com/get-started-with-angular-on-net-core-2-1-part-one-2effcfe8fae9)that includes the new static website hosting from blob storage that doesn’t require a full path to launch the app!

The technology is referred to as “serverless” and is the ultimate abstraction of concerns like scale, elasticity and resiliency that empowers the developer to focus on one thing: code. It’s often easier to understand when you see it in action, so this post will focus on creating a completely functional Angular app with absolutely no provisioning of servers.

To follow along you’ll need an [Azure subscription](https://goo.gl/QyuunA). If you don’t have one there is a free $200 credit available (in the U.S.) as of this writing. After you have your account, create a new resource group and give it a name. This example uses “ServerlessAngular.”




![image](/blog/2017-04-07_create-a-serverless-angular-app-with-azure-functions-and-blob-storage/images/1.)



A resource group is simply a container for related resources. Groups make it easy to see aggregate cost of services, can be created and destroyed in a single step and are a common security boundary in the Azure world. Once the resource group is provisioned, add a resource to it. Use the add button, type “function” in the search box and choose “Function App.”




![image](/blog/2017-04-07_create-a-serverless-angular-app-with-azure-functions-and-blob-storage/images/2.)



Now you can pick what the name of your function app is, choose the subscription it will bill against, assign it to a resource group, pick a location and associate it with a storage account. Here are some of the options I chose to create the app with the name “angularsvc.”




![image](/blog/2017-04-07_create-a-serverless-angular-app-with-azure-functions-and-blob-storage/images/3.)



Function apps need storage, so tap the “Storage Account” option and use an existing account or create a new one. In this example I create one called “angularsvcstorage” to make it clear what the storage is for.




![image](/blog/2017-04-07_create-a-serverless-angular-app-with-azure-functions-and-blob-storage/images/4.)



After you hit the create button, it may take a few seconds to several minutes to provision the assets for the function app. These include a service plan for the app, the storage, and the app itself. After everything is created, click on the function app itself to begin coding.




![image](/blog/2017-04-07_create-a-serverless-angular-app-with-azure-functions-and-blob-storage/images/5.)



There are a few starter examples to choose from, but for this demo you’ll select, “Create your own custom function.” You can choose a language, scenario, and template to start with. I picked “JavaScript” for “Core” and selected “HttpTrigger-JavaScript.”




![image](/blog/2017-04-07_create-a-serverless-angular-app-with-azure-functions-and-blob-storage/images/6.)



A function app may have multiple functions. For this example we’ll name the function “xIterate” and open it for anonymous consumption.




![image](/blog/2017-04-07_create-a-serverless-angular-app-with-azure-functions-and-blob-storage/images/7.)



The app I’m using for this example is based on an [Angular and TypeScript](https://github.com/JeremyLikness/ng2ts-workshop-v2) workshop I gave at DevNexus. The module “[55-Docker](https://github.com/JeremyLikness/ng2ts-workshop-v2/tree/master/55-Docker)” contains a sample app with an Angular project and a Node.js service that I adapted from containers for this serverless example. The app generates a [bifurcation diagram](https://en.wikipedia.org/wiki/Bifurcation_diagram). Here is the code for the function:




Now you can click “save and run” to test it. The script expects a parameter to be passed, so expand the right pane, choose the “Test” tab and add a parameter for “r.”




![image](/blog/2017-04-07_create-a-serverless-angular-app-with-azure-functions-and-blob-storage/images/8.)



The screen capture shows the result of successfully running the function. You can see it returned a status code “200 OK” and an array of values.

To further test it, click the “get function URL” link in the upper right, and call it directly from your browser like this:

[https://angularsvc.azurewebsites.net/api/xIterate?r=2.7](https://angularsvc.azurewebsites.net/api/xIterate?r=2.7)

Now the function is ready to go. On a system with [Node](https://nodejs.org/en/), NPM, and the latest [Angular-CLI](https://github.com/angular/angular-cli) installed, execute this command to create a new Angular project:

ng new ng-serverless

After the project is created, navigate to its folder:

cd ng-serverless

Then generate a service to call our function:

ng g service iterations

Using your favorite code editor (mine is [Visual Studio Code](https://code.visualstudio.com/)), open app.module.ts and add the import and edit the provider line to import the service:




Next, edit the iterations.service.ts file to implement the service. Use the function URL you created earlier. The service generates several values for “r”, calls the API to get the “x” iteration values, then publishes them as tuples back to the subscriber. Be sure to update the URL for the service to match your own.




Edit the app.component.html template to add a canvas that will host the diagram:




Finally, edit app.component.ts to call the service and populate the diagram.




Now, the app is ready to run. Use the Angular-CLI to launch a local server:

ng serve

And, if it doesn’t open for you automatically, navigate to the local port in your web browser:

[http://localhost:4200](http://localhost:4200/)

You’ll see the app loads but then nothing happens. If you open the console, it will be riddled with errors like this:




![image](/blog/2017-04-07_create-a-serverless-angular-app-with-azure-functions-and-blob-storage/images/9.)



The problem is that Cross Origin Resource Sharing (CORS) hasn’t been configured for the function, so for security reasons the browser is blocking requests to the Azure app function from the localhost domain. To fix this, open the function app back up in the Azure Portal, tap “Function app settings” in the lower left and choose “Configure CORS.”




![image](/blog/2017-04-07_create-a-serverless-angular-app-with-azure-functions-and-blob-storage/images/10.)



Add [http://localhost:4200](http://localhost:4200/) to the list of allowed domains, save it, then refresh your browser. If all goes well, you should see something like this:




![image](/blog/2017-04-07_create-a-serverless-angular-app-with-azure-functions-and-blob-storage/images/11.)



That’s great — now you have a serverless API, but what about the website itself? Fortunately the Angular app itself is completely clientside so it can be exported as a static site. Let’s configure Azure Blob Storage to host the website assets. Add a new resource to the existing resource group. Search for “blob” and choose the “Storage account” option.




![image](/blog/2017-04-07_create-a-serverless-angular-app-with-azure-functions-and-blob-storage/images/12.)



Give it a name like “ngweb”, choose “Standard”, pick a replication level (I chose the default), and pick a region.




![image](/blog/2017-04-07_create-a-serverless-angular-app-with-azure-functions-and-blob-storage/images/13.)



Once this storage is provisioned, tap on “Blobs” for the blob service. The blob service is segmented into named containers, so create a container to host the assets. I named mine “bifurc” for the app. The access type is “Blob.”




![image](/blog/2017-04-07_create-a-serverless-angular-app-with-azure-functions-and-blob-storage/images/14.)



After the container is provisioned, you can choose “container properties” to get the URL of the container. Copy that down. In your Angular project, generate an optimized production build:

ng build — prod — aot

This will build the static assets for your application in the “dist” folder. Open dist/index.html and edit the file to update the base URL. This should point to your container (the final slash is important):&lt;base href=”https://ngweb.blob.core.windows.net/bifurc/&#34;&gt;

Back in the Azure portal, the container provides an “upload” option to upload assets. Upload all of the files in “dist” as “block blob” until your container looks something like this:




![image](/blog/2017-04-07_create-a-serverless-angular-app-with-azure-functions-and-blob-storage/images/15.)



You can either navigate to the container URL you saved earlier or click on index.html and copy its URL. You should see the app try to load, but it will fail. CORS strikes again! Head back over to the function service and add the blob storage domain (just the domain, the path is not necessary) to the list of allowed servers. For this example, I added [https://ngweb.blob.core.windows.net/](https://ngweb.blob.core.windows.net/).

Eureka!

At this point you should have a working application. If you want to host this for production and give it a more user-friendly name, you can use a CNAME entry in DNS to [point a custom domain name](https://goo.gl/EkuagQ) to blob storage.

Of course, this demonstration only scratched the surface of what is possible. You can build authentication and authorization into Azure Functions, securely store secrets like database credentials, trigger functions based on resource changes (such as running one when a SQL table is updated or a file is uploaded into blob storage) and much more.

In just minutes developers can now provision a highly elastic, scalable, and resilient web application without having to worry about how it is load-balanced. Your boss will give you extra points for saving cash because the functions and blobs are charged based on usage — no more ongoing costs to keep a VM running when it isn’t being used. All of these resources support deployment from a continuous deployment pipeline and in Azure you can create an automation script to generate a template for building out multiple environments like Dev, QA, Staging, and Production.

Intrigued? [Learn more about Azure Functions here](https://goo.gl/rF6dVK).

Enjoy your new super powers!




![image](/blog/2017-04-07_create-a-serverless-angular-app-with-azure-functions-and-blob-storage/images/16.gif)

_Originally published at_ [_csharperimage.jeremylikness.com_](http://csharperimage.jeremylikness.com//2017/04/create-serverless-angular-app-with.html) _on April 7, 2017._
