---
title: "Docker Containers at Scale with Azure Web App on Linux"
author: "Jeremy Likness"
date: 2017-08-11T00:00:00.000Z
years: "2017"
lastmod: 2019-06-13T10:43:28-07:00
comments: true

description: "The Azure team recently announced a new feature that is currently in preview called Azure Web App on Linux. This feature enables you to host web apps natively on Linux. The service enables you to…"

subtitle: "Learn how to deploy and scale Docker containers using Azure Web App on Linux."
tags:
 - Docker 
 - Containers 
 - Azure 
 - Linux 

image: "/blog/2017-08-11_docker-containers-at-scale-with-azure-web-app-on-linux/images/1.png" 
images:
 - "/blog/2017-08-11_docker-containers-at-scale-with-azure-web-app-on-linux/images/1.png" 
 - "/blog/2017-08-11_docker-containers-at-scale-with-azure-web-app-on-linux/images/2.gif" 


aliases:
    - "/docker-containers-at-scale-with-azure-web-app-on-linux-da22c03d4ad7"
---

The Azure team recently announced a new feature that is currently in preview called [Azure Web App on Linux](https://docs.microsoft.com/azure/app-service-web/app-service-linux-intro?WT.mc_id=link-blog-jeliknes). This feature enables you to host web apps natively on Linux. The service enables you to choose an initial size and number of instances for your hosts, then manually scale up and out or add automatic rules to respond to load.

![Web App](/blog/2017-08-11_docker-containers-at-scale-with-azure-web-app-on-linux/images/1.png)

It comes out of the box with support for several application stacks including [Node.js](https://docs.microsoft.com/azure/app-service-web/app-service-linux-using-nodejs-pm2?WT.mc_id=link-blog-jeliknes), PHP, [.NET Core](https://docs.microsoft.com/azure/app-service-web/app-service-linux-using-dotnetcore?WT.mc_id=link-blog-jeliknes), and [Ruby](https://docs.microsoft.com/azure/app-service-web/app-service-linux-ruby-get-started?WT.mc_id=link-blog-jeliknes).

> _Pssst. Lean a little closer. I have a little secret for you: it’s all based on_ [_Docker_](https://docs.microsoft.com/azure/app-service-web/app-service-linux-using-custom-docker-image?WT.mc_id=link-blog-jeliknes) _containers._

That’s right! What that means is even if your platform and language of choice aren’t listed in the “supported stacks,” you can publish anything you can containerize. To prove it, I’ve made a short five minute video. I demonstrate taking my <i class="fab fa-github"></i> [little go app](https://github.com/JeremyLikness/docker-we-rise/tree/master/03-Hello-Small-Go-Small) that is available as a public <i class="fab fa-docker"></i> [Docker Hub image](https://hub.docker.com/r/jlikness/gosmall/) and deploying it to Azure, then scaling it out. Check it out:

{{<youtube nWfpwgHRfqk>}}

If you’re thinking, “Not another orchestrator” … think again. The goal is not to compete with mature orchestrators like [Kubernetes](https://docs.microsoft.com/azure/container-service/kubernetes/container-service-kubernetes-walkthrough?WT.mc_id=link-blog-jeliknes). Instead, the web app provides a ton of features that make your life easier and streamline the DevOps experience, such as:

* <i class="fab fa-github"></i> [Kudu](https://github.com/projectkudu/kudu), the deployment engine that will manage deployments for you from sources ranging from GitHub and Visual Studio Team Services to local git repositories
* Shared storage to aggregate log files
* SSH access to your containers
* Auto-scaling

You can even set up separate instances in different regions around the globe and load balance them using Azure’s [Traffic Manager](https://docs.microsoft.com/azure/traffic-manager/traffic-manager-overview?WT.mc_id=link-blog-jeliknes). There are many more features to review that you can learn more about by reading the [Azure Web App on Linux](https://docs.microsoft.com/azure/app-service-web/app-service-linux-using-custom-docker-image?WT.mc_id=link-blog-jeliknes) documentation. If you have questions, comments, feedback, or corrections, don’t forget that the documentation is _open source_ and _accepting pull requests!_

Thanks,

![Jeremy Likness](/blog/2017-08-11_docker-containers-at-scale-with-azure-web-app-on-linux/images/2.gif)
