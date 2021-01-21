---
title: "Managing Data 📈 in the Cloud ☁"
author: "Jeremy Likness"
date: 2019-05-16T20:13:51.155Z
years: "2019"
lastmod: 2019-06-13T10:45:49-07:00
comments: true

description: "Learn how to classify your data (structured, semi-structured and unstructured) and use Azure storage, managed NoSQL  and hosted relational databases to manage your data in the cloud."

subtitle: "Learn how to classify and host your data using cloud services."
tags:
 - Azure 
 - Azure Storage 
 - NoSQL 
 - Mongodb 
 - Sql
 - Presentation

image: "/blog/2019-05-16_managing-data-in-the-cloud/images/1.png" 
images:
 - "/blog/2019-05-16_managing-data-in-the-cloud/images/1.png" 
 - "/blog/2019-05-16_managing-data-in-the-cloud/images/2.gif" 

aliases:
    - "/managing-data-in-the-cloud-82c5fa0be9d1"
---

Monday, May 13th, 2019 was the date we kicked off the inaugural [.NET South conference](https://dotnetsouth.tech). It was also the date I delivered a new talk, “Managing Data in the Cloud.”

![Image of clouds](/blog/2019-05-16_managing-data-in-the-cloud/images/1.png)

[<i class="fab fa-vimeo"></i> Watch the full presentation](https://www.recallact.com/presentation/managing-data-cloud?WT.mc_id=medium-blog-jeliknes)

The presentation features three case studies that illustrate different approaches to managing and accessing data. There is a flights database that traverses a graph of nodes and vertices to compute possible flight paths between two airports. The link shortening example highlights the entirely serverless application I run in production to create, use, and report on URLs. Finally, the Tailwind Traders application leverages microservices that include a Node.js app with a MongoDB backend and a .NET Core API on top of Azure SQL.

{{<tweet 1127987856130101253>}}

The presentation contains all the relevant links and walks through how to classify data, how each class of data translates to cloud services, and how apps are built to use the various options. The deck concludes with a look at a service designed to migrate your data from existing on-premises solutions to the cloud.

💾 [Download the presentation](https://jlikme.blob.core.windows.net/presentations/Likness-ManagingCloudData-DotNetSouth.pptx)

The repository dives even deeper. It contains links for the prerequisites to run the presentation. It includes step-by-step instructions for every demo. Finally, there are links to the hands-on learning modules and documentation for all the services covered.

[<i class="fab fa-github"></i> GitHub: JeremyLikness/managing-cloud-data](https://github.com/JeremyLikness/managing-cloud-data?WT.mc_id=medium-blog-jeliknes)

If you are exploring moving your data to the cloud or building a new solution and curious about what options are available, you may find these resources helpful. Enjoy!

Regards,

![image](/blog/2019-05-16_managing-data-in-the-cloud/images/2.gif)
