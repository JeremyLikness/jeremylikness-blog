---
title: "Use the Serverless Cloud for ETL Scenarios"
author: "Jeremy Likness"
date: 2018-03-13T14:07:40.886Z
years: "2018"
lastmod: 2019-06-13T10:44:50-07:00
comments: true

description: "Detailed walk through demonstrates how to build and test serverless solutions that process data into a SQL server locally, then migrate the entire solution to the Azure cloud."

subtitle: "A real world scenario that leverages Azure Functions"
tags:
 - Serverless 
 - Azure 
 - Azure Functions 
 - Sql Server 
 - Cloud Migration 

image: "/blog/2018-03-13_use-the-serverless-cloud-for-etl-scenarios/images/1.png" 
images:
 - "/blog/2018-03-13_use-the-serverless-cloud-for-etl-scenarios/images/1.png" 
 - "/blog/2018-03-13_use-the-serverless-cloud-for-etl-scenarios/images/2.gif" 


aliases:
    - "/use-the-serverless-cloud-for-etl-scenarios-bb7f967edde5"
---

The essence of _serverless_ is _less server_. The details of the server are abstracted away and the developer is able to focus on code without getting bogged down in infrastructure concerns. Extract, Transform, and Load (ETL) is a common scenario in enterprise applications that serverless applications are uniquely positioned to address. Developers are able to handle file uploads, set timers and schedules, and run transformations using serverless without touching hardware, installing third-party services or writing custom polling software.

![Common ETL scenario addressed by this walkthrough](/blog/2018-03-13_use-the-serverless-cloud-for-etl-scenarios/images/1.png)
<figcaption>Common ETL scenario addressed by this walkthrough</figcaption>

There is a better way! As much as I love to speak and write about serverless, I still believe the best way to learn what it is, and understand its value, is to go hands-on. To give you a full end-to-end scenario, I wrote a walk through and published it to GitHub.

<i class="fab fa-github"></i> [JeremyLikness/azure-fn-file-process-hol](https://github.com/JeremyLikness/azure-fn-file-process-hol)

This lab exposes you to the full spectrum of capabilities and workflows associated with serverless application development. You will:

1. Create a [serverless Azure function](https://docs.microsoft.com/en-us/azure/azure-functions/functions-overview?utm_source=jeliknes&utm_medium=github&utm_campaign=handsonlab&WT.mc_id=handsonlab-github-jeliknes) locally and debug it on your machine (no Internet required) using the cross-platform functions host
2. Set up a trigger to automatically detect when a file is uploaded to file storage — no polling required (and you’ll also test this locally using the Azure Storage Emulator)
3. Create a local SQL database that represents a common scenario: the _legacy on-premises database_
4. Learn how to use [Entity Framework](https://docs.microsoft.com/en-us/aspnet/entity-framework?utm_source=jeliknes&utm_medium=github&utm_campaign=handsonlab&WT.mc_id=handsonlab-github-jeliknes) in Azure Functions by parsing a CSV file and inserting new records into the database
5. Create a cloud-hosted Azure SQL Database and migrate your local database to the cloud
6. Deploy your local code to Azure
7. Run the full process entirely from the cloud without configuring a single piece of hardware or consulting with a DBA

If the previous list includes scenarios you are interested in and would like to learn more about, carve out an hour on your schedule and head on over to the <i class="fab fa-github"></i> [hands-on walk through](https://github.com/JeremyLikness/azure-fn-file-process-hol)!

![Jeremy Likness](/blog/2018-03-13_use-the-serverless-cloud-for-etl-scenarios/images/2.gif)
