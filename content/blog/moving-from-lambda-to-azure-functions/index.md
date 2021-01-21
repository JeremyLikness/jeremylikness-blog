---
title: "Moving From Lambda ƛ to Azure Functions <⚡>"
author: "Jeremy Likness"
date: 2019-09-05T07:32:13-07:00
years: "2019"
lastmod: 2019-10-28T07:32:13-07:00

draft: false
comments: false
toc: true
canonicalUrl: https://medium.com/microsoftazure/moving-from-lambda-%C6%9B-to-azure-functions-b6d5ed5ca007

subtitle: "Migrate a JavaScript Node.js function from cloud to cloud"

description: "Six part video series walks through migration of a JavaScript Node.js AWS Lambda serverless function that uses DynamoDB for cache to Azure Functions."

tags:
 - AWS Lambda 
 - Azure Functions
 - Serverless
 - Cloud
 - Migration 

image: "/blog/moving-from-lambda-to-azure-functions/images/lambdatofunctions.jpeg" 
images:
 - "/blog/moving-from-lambda-to-azure-functions/images/lambdatofunctions.jpeg" 
 - "/blog/moving-from-lambda-to-azure-functions/images/lambda.jpeg"
---

“It’s time to migrate.”

Maybe the decision to switch cloud providers came “down from above.” Maybe the decision was yours. Perhaps your original solution was merely a spike to “kick the tires” of one cloud, and now it’s time to try another. Whatever your reasons, if you are considering moving your serverless functions from AWS Lambda to [Azure Functions](https://blog.jeremylikness.com/?utm_source=jeliknes&utm_medium=redirect&utm_campaign=jlik_me), you’re in the right place to learn how!

![Lambda to Azure Functions](/blog/moving-from-lambda-to-azure-functions/images/lambdatofunctions.jpeg)
<figcaption>Lambda to Azure Functions</figcaption>

“<i class="fab fa-youtube"></i> [Moving from Lambda to Azure Functions](https://www.youtube.com/playlist?list=PL1VfiVM16kp8U5E7U2tfJdskXJg8DPPKL)” is a six-part videos series that covers what you need to know to make the transition between cloud providers. You’ll learn how to migrate your app, explore how resources in Azure relate to Amazon AWS, build a function locally, deploy it manually and learn how to push it automatically as part of a CI/CD pipeline.

## The Sample App

The sample app is simple but does more than just echo text or print, “Hello, world.” It computes whether or not a number is a prime and uses a cache to store the results to serve them quickly on subsequent calls. The AWS Lambda implementation uses JavaScript (Node.js) and Amazon DynamoDB.

![The sample function](/blog/moving-from-lambda-to-azure-functions/images/lambda.jpeg)
<figcaption>The sample function</figcaption>

You can view the source code for the sample app and deploy the migrated code directly to Azure with a single-click in the “AWSMigration” GitHub repository.

{{<github "JeremyLikness/AWSMigration">}}

The first video provides and overview of the sample application and shows how to test and access it from the portal and the command line.

{{<youtube iflBlF9JEIY>}}

* [AWS to Azure Services Comparison](https://docs.microsoft.com/azure/architecture/aws-professional/services?WT.mc_id=awsmigration-blog-jeliknes)

## Create an Azure Functions App

The Azure Functions app serves as the host for serverless functions. It is a unit of deployment and scale that defines features for your app such as your language and runtime, security settings, and root URL endpoint.

This video is designed for anyone new to Azure Functions, even if you're not migrating from AWS Lambda. It walks through how to create the host, write simple code using JavaScript and Node.js, and test the function from your browser and the command line.

{{<youtube YgcUqPzk63c>}}

* [Create your free Azure account](https://azure.com/free?WT.mc_id=awsmigration-blog-jeliknes)
* [JavaScript Developer Reference for Azure Functions](https://docs.microsoft.com/azure/azure-functions/functions-reference-node?WT.mc_id=awsmigration-blog-jeliknes)
* [How to Use Azure Table Storage from Node.js](https://docs.microsoft.com/azure/cosmos-db/table-storage-how-to-use-nodejs?WT.mc_id=awsmigration-blog-jeliknes)

## Integrate Code and Implement Cache

The Azure Functions app is created (see previous article) and ready to host our _real_ code.

In this episode, a new HTTP endpoint is implemented using an existing Azure Functions app to compute primes. Watch how easy it is to migrate the code to Azure then install a Node.js package for Azure Storage. Finally, use [Azure Table Storage](https://docs.microsoft.com/azure/cosmos-db/table-storage-overview?WT.mc_id=awsmigration-blog-jeliknes) to cache the results.

{{<youtube kdG0r12RU0U>}}

* [Azure Table Storage](https://docs.microsoft.com/azure/cosmos-db/table-storage-overview?WT.mc_id=awsmigration-blog-jeliknes)

## Azure Overview

The previous episodes in this series reviewed how to migrate an existing AWS Lambda JavaScript Node.js function to Azure Functions. This episode takes a step back to review general concepts.

* Organize related assets using _resource groups_
* Manage infrastructure using _Azure Resource Management (ARM) templates_ and the single-click _deploy to Azure_ capability
* Customize your at-a-glance experience using _Azure dashboards_
* Drill into configuration settings for resources
* Explore data with the web-based _storage explorer_

{{<youtube HD3iwH1Q64s>}}

* [Azure Portal Overview](https://docs.microsoft.com/azure/azure-portal/azure-portal-overview?WT.mc_id=awsmigration-blog-jeliknes)
* [ARM Templates](https://docs.microsoft.com/azure/azure-resource-manager/template-deployment-overview?WT.mc_id=awsmigration-blog-jeliknes)
* [Fundamentals of Azure (free hands-on course)](https://docs.microsoft.com/learn/paths/azure-fundamentals/?WT.mc_id=awsmigration-blog-jeliknes)

## Build, Test, Run and Deploy from your Local Machine

This episode shows how to use the cross-platform [Azure Functions core tools](https://docs.microsoft.com/azure/azure-functions/functions-run-local?WT.mc_id=awsmigration-blog-jeliknes) to create and run a local serverless project. Use the command or an editor like [Visual Studio Code](https://code.visualstudio.com?WT.mc_id=awsmigration-blog-jeliknes). See how to set a breakpoint, debug, and even modify local variables. Interact with storage using the cross-platform [storage emulator](https://docs.microsoft.com/azure/storage/common/storage-use-emulator?WT.mc_id=awsmigration-blog-jeliknes). Finally, deploy your app to the cloud with just a few clicks.

{{<youtube 3keA9GXYQDc>}}

* [Azure Functions core tools](https://docs.microsoft.com/azure/azure-functions/functions-run-local?WT.mc_id=awsmigration-blog-jeliknes)
* [Visual Studio Code](https://code.visualstudio.com?WT.mc_id=awsmigration-blog-jeliknes)
* [Azure Storage Emulator](https://docs.microsoft.com/azure/storage/common/storage-use-emulator?WT.mc_id=awsmigration-blog-jeliknes)
* [Azure Storage Explorer](https://docs.microsoft.com/azure/vs-azure-tools-storage-manage-with-storage-explorer?tabs=windows&WT.mc_id=awsmigration-blog-jeliknes)

## Review Advanced Features: Security, CI/CD (DevOps) and More

Friends don’t let friends right-click publish. That’s why in this final video we’ll make your DevOps team proud by implementing continuous deployment. The function will also get a security lift in two areas: first, it will require authentication for access. Second, it will get assigned a managed identity to securely access other resources and assets.

{{<youtube TOLplqari7g>}}

* Check out a [full day of free, hands-on serverless training](https://aka.ms/learnazfuncs) (no account or credit card required)

## Summary

This is a short series designed to ease your understanding of how to migrate from AWS Lambda to Azure. As always, we welcome your feedback, comments, and suggestions. If you have experienced a similar migration, please share your thoughts and tips in the comments below!

What's next? Check out an [Overview of Azure Functions](https://docs.microsoft.com/en-us/azure/azure-functions/functions-overview?utm_source=jeliknes&utm_medium=blog&utm_campaign=awsmigration&WT.mc_id=awsmigration-blog-jeliknes).

Regards,

![Jeremy Likness](/images/jeremylikness.gif)
