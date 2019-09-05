---
title: "Moving From Lambda ƛ to Azure Functions <⚡>"
author: "Jeremy Likness"
date: 2019-09-05T07:32:13-07:00
years: "2019"
lastmod: 2019-09-05T07:32:13-07:00

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

Maybe the decision to switch cloud providers came “down from above.” Maybe the decision was yours. Perhaps your original solution was merely a spike to “kick the tires” of one cloud, and now it’s time to try another. Whatever your reasons, if you are considering moving your serverless functions from AWS Lambda to [Azure Functions](https://jlik.me/jkm), you’re in the right place to learn how!

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

## Create an Azure Functions App

The next video walks through how to create an Azure Functions app: the solution for hosting serverless functions in Azure.

{{<youtube YgcUqPzk63c>}}

## Integrate Code and Implement Cache

Learn how to migrate the code and move from using Amazon DynamoDB to Azure’s inexpensive and easy-to-use Azure Table Storage for the application cache.

{{<youtube kdG0r12RU0U>}}

## Azure Overview

After the app is migrated and deployed, review how Azure resources are organized and accessed compared to Amazon AWS.

{{<youtube HD3iwH1Q64s>}}

## Build, Test, Run and Deploy from your Local Machine

(coming soon)

## Review Advanced Features: Security, CI/CD (DevOps) and More

(coming soon)

## Summary

This is a short series designed to ease your understanding of how to migrate from AWS Lambda to Azure. As always, we welcome your feedback, comments, and suggestions. If you have experienced a similar migration, please share your thoughts and tips in the comments below!

What's next? Check out an [Overview of Azure Functions](https://jlik.me/gkm).

Regards,

![Jeremy Likness](/images/jeremylikness.gif)
