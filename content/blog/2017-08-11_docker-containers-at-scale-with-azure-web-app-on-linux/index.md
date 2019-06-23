---
title: "Docker Containers at Scale with Azure Web App on Linux"
author: "Jeremy Likness"
date: 2017-08-11T00:00:00.000Z
years: "2017"
lastmod: 2019-06-13T10:43:28-07:00

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

The Azure team recently announced a new feature that is currently in preview called [Azure Web App on Linux](https://docs.microsoft.com/azure/app-service-web/app-service-linux-intro?utm_source=jeliknes&amp;utm_medium=blog). This feature enables you to host web apps natively on Linux. The service enables you to choose an initial size and number of instances for your hosts, then manually scale up and out or add automatic rules to respond to load.




![image](/blog/2017-08-11_docker-containers-at-scale-with-azure-web-app-on-linux/images/1.png)



It comes out of the box with support for several application stacks including [Node.js](https://docs.microsoft.com/azure/app-service-web/app-service-linux-using-nodejs-pm2?utm_source=jeliknes&amp;utm_medium=blog), PHP, [.NET Core](https://docs.microsoft.com/azure/app-service-web/app-service-linux-using-dotnetcore?utm_source=jeliknes&amp;utm_medium=blog), and [Ruby](https://docs.microsoft.com/azure/app-service-web/app-service-linux-ruby-get-started?utm_source=jeliknes&amp;utm_medium=blog).
> _Pssst. Lean a little closer. I have a little secret for you: it’s all based on_ [_Docker_](https://docs.microsoft.com/azure/app-service-web/app-service-linux-using-custom-docker-image?utm_source=jeliknes&amp;utm_medium=blog) _containers._

That’s right! What that means is even if your platform and language of choice aren’t listed in the “supported stacks,” you can publish anything you can containerize. To prove it, I’ve made a short five minute video. I demonstrate taking my [little go app](https://github.com/JeremyLikness/docker-we-rise/tree/master/03-Hello-Small-Go-Small?utm_source=jeliknes&amp;utm_medium=blog) that is available as a public [Docker Hub image](https://hub.docker.com/r/jlikness/gosmall/?utm_source=jeliknes&amp;utm_medium=blog) and deploying it to Azure, then scaling it out. Check it out:






If you’re thinking, “Not another orchestrator” … think again. The goal is not to compete with mature orchestrators like [Kubernetes](https://docs.microsoft.com/azure/container-service/kubernetes/container-service-kubernetes-walkthrough?utm_source=jeliknes&amp;utm_medium=blog). Instead, the web app provides a ton of features that make your life easier and streamline the DevOps experience, such as:

*   [Kudu](https://github.com/projectkudu/kudu?utm_source=jeliknes&amp;utm_medium=blog), the deployment engine that will manage deployments for you from sources ranging from GitHub and Visual Studio Team Services to local git repositories
*   Shared storage to aggregate log files
*   SSH access to your containers
*   Auto-scaling

You can even set up separate instances in different regions around the globe and load balance them using Azure’s [Traffic Manager](https://docs.microsoft.com/azure/traffic-manager/traffic-manager-overview?utm_source=jeliknes&amp;utm_medium=blog). There are many more features to review that you can learn more about by reading the [Azure Web App on Linux](https://docs.microsoft.com/azure/app-service-web/app-service-linux-using-custom-docker-image?utm_source=jeliknes&amp;utm_medium=blog) documentation. If you have questions, comments, feedback, or corrections, don’t forget that the documentation is _open source_ and _accepting pull requests!_

Thanks,




![image](/blog/2017-08-11_docker-containers-at-scale-with-azure-web-app-on-linux/images/2.gif)

_Originally published at_ [_csharperimage.jeremylikness.com_](http://csharperimage.jeremylikness.com/2017/08/docker-images-at-scale-with-azure-web.html) _on August 11, 2017._
