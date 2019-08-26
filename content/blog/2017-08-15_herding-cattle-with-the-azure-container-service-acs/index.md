---
title: "Herding Cattle with the Azure Container Service (ACS)"
author: "Jeremy Likness"
date: 2017-08-15T00:00:00.000Z
years: "2017"
lastmod: 2019-06-13T10:43:30-07:00
comments: true

description: "Deck and video focuses on Azure Container Service, a tool that enables creation and management of Kubernetes, Docker Swarm, and Mesos DC/OS clusters with ease."

subtitle: "Presentation that demonstrates how Azure Container Service (ACS) makes it easy to configure, deploy, and manage Kubernetes, Swarm, and DCOS…"
tags:
 - Docker 
 - Azure 
 - Kubernetes 
 - Presentation

image: "/blog/2017-08-15_herding-cattle-with-the-azure-container-service-acs/images/1.png" 
images:
 - "/blog/2017-08-15_herding-cattle-with-the-azure-container-service-acs/images/1.png" 
 - "/blog/2017-08-15_herding-cattle-with-the-azure-container-service-acs/images/2.gif" 


aliases:
    - "/herding-cattle-with-the-azure-container-service-acs-e329e7def93e"
---

Docker is an amazing tool that transforms how DevOps teams build software at scale. Containers can’t be treated like pets for Docker to effectively meet enterprise demands. The care, attention, and feeding simply doesn’t make sense when dealing with hundreds or even thousands of interconnected microservices. The herd of containers needs to be wrangled, or orchestrated, by a tool.

![Docker](/blog/2017-08-15_herding-cattle-with-the-azure-container-service-acs/images/1.png)

Although several tools exist, [Azure Container Service](https://docs.microsoft.com/azure/container-service/WT.mc_id=link-blog-jeliknes) provides a single interface to set up complex orchestration clusters regardless of whether you prefer Mesos DC/OS, Docker Swarm, or Kubernetes. I recently [presented this talk](https://www.meetup.com/Docker-Atlanta/events/241833081/?utm_source=jeliknes&amp;utm_medium=blog) at the [Docker Atlanta Meetup](https://www.meetup.com/Docker-Atlanta/?utm_source=jeliknes&amp;utm_medium=blog) group. I covered what ACS is, walked through creating clusters for DCOS, Swarm, and Kubernetes, and demonstrated deploying Docker containers and scaling them out.

View the deck below, and check out the accompanying walkthrough video:

{{<youtube POZYM_S8uzg>}}

{{<slideshare "LJVlqF9Jb8rk9O" "jeremylikness/herding-cattle-with-azure-container-service-acs">}}

To learn more about Azure Container Service, read the [official documentation](https://docs.microsoft.com/azure/container-service/?WT.mc_id=link-blog-jeliknes).

Are you running containers in production? I’d love to hear about your experience and tips in the comments below!

Regards,

![Jeremy Likness](/blog/2017-08-15_herding-cattle-with-the-azure-container-service-acs/images/2.gif)

