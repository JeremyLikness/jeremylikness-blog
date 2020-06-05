---
title: "Docker Management and Kubernetes Orchestration"
author: "Jeremy Likness"
date: 2018-02-23T21:25:59.292Z
years: "2018"
lastmod: 2019-06-13T10:44:46-07:00
comments: true

description: "Learn about Docker containers and orchestration with Kubernetes. Includes live video examples using Azure Container Registry, Azure Container Instances, and Azure Kubernetes Service."

subtitle: "Navigate the container world with Azure examples"
tags:
 - Docker 
 - Kubernetes 
 - Container 
 - Azure 
 - Cloud 

image: "/blog/2018-02-23_docker-management-and-kubernetes-orchestration/images/6.png" 
images:
 - "/blog/2018-02-23_docker-management-and-kubernetes-orchestration/images/1.jpeg" 
 - "/blog/2018-02-23_docker-management-and-kubernetes-orchestration/images/2.png" 
 - "/blog/2018-02-23_docker-management-and-kubernetes-orchestration/images/3.png" 
 - "/blog/2018-02-23_docker-management-and-kubernetes-orchestration/images/4.png" 
 - "/blog/2018-02-23_docker-management-and-kubernetes-orchestration/images/5.png" 
 - "/blog/2018-02-23_docker-management-and-kubernetes-orchestration/images/6.png" 
 - "/blog/2018-02-23_docker-management-and-kubernetes-orchestration/images/7.gif" 


aliases:
    - "/docker-management-and-kubernetes-orchestration-2b7baf60a704"
---

Today I had the extreme pleasure of presenting at an Atlanta-based Java conference called [DevNexus](https://devnexus.com) and again at the [Google Developer User Group in Atlanta](https://www.meetup.com/gdg-atlanta/) on [June 19th, 2018](https://www.meetup.com/gdg-atlanta/events/250791821/). The DevNexus conference regularly sells out and had 1,800 attendees this year.

![DevNexus banner for 2018](/blog/2018-02-23_docker-management-and-kubernetes-orchestration/images/1.jpeg)
<figcaption>DevNexus banner for 2018</figcaption>

Although my two live presentations weren’t recorded, I did have the opportunity to stop by Channel 9 studios in Warsaw, Poland.

{{<customtwitter 989493283142422528>}}

To view the deck, scroll down later in this article or download the full PowerPoint presentation ⬇ [here](https://jlikme.blob.core.windows.net/presentations/Docker%20Management%20and%20Orchestration.pptx).

The Dockerfile definitions and full source code from the presentation are available on GitHub <i class="fab fa-github"></i> [here](https://github.com/JeremyLikness/devnexus-containers). I was really amazed at the energy of the audience and the size of the crowd. I captured my trademark 360 degree picture about 5 minutes before the talk started, and it was standing room only by the time I finished. My loosely conducted survey revealed most of the audience was new to using Docker in production and not very familiar with Kubernetes.

{{<kuula 7lxDM>}}
<figcaption>Docker management and orchestration audience at DevNexus</figcaption>

I started with a gentle introduction to Docker’s capabilities by highlighting a browser I used when I discovered the Internet in 1994. The browser, named [Lynx](http://lynx.invisible-island.net/lynx2.8.8/lynx_help/about_lynx.html), was text-only. It is still maintained today and easy to run in a Docker container. After you [install Docker](https://docs.docker.com/install/), simply type:

`docker run -it --name lynx jess/lynx`

This will download the image and launch the browser. Take a look at an accessible site like DevNexus.com, then see what a Single Page Application looks like by navigating to angular.io. We got a good laugh at the, shall we say, “minimalist” result. (Sorry, you’ll have to try it yourself).

Next, I talked about a revolutionary virtual machine that was created almost 40 years ago (yes, you read that right) in 1979 called the [Z-machine](https://en.wikipedia.org/wiki/Z-machine). This innovative machine was created by college graduates migrating a popular adventure game from a mainframe to personal computers. They created it so they could create a single implementation of the Z-machine for each of the non-compatible personal computers available at the time, ranging from TRS-80 and Commodore 64 to Spectrum, Apple and Atari. They could then write a game once to the Z-machine specification and run it everywhere. This is a perfect scenario to illustrate [multi-stage builds](https://docs.docker.com/develop/develop-images/multistage-build/).

The <i class="fab fa-github"></i> [Zork Dockerfile](https://github.com/JeremyLikness/devnexus-containers/blob/master/001-zork/Dockerfile) grabs a Z-machine implemented in Go, uses a <i class="fab fa-docker"></i> [Docker container](https://hub.docker.com/_/golang/) with the Go development environment pre-installed to compile it, then creates an image with the Zork game file that is playable.

{{<highlight Dockerfile>}}
FROM golang:alpine as build-env
RUN mkdir /src
ADD http://msinilo.pl/download/zmachine.go /src
RUN cd /src && go build -o goapp

FROM alpine
RUN mkdir /app
WORKDIR /app
COPY --from=build-env /src/goapp /app
ADD https://github.com/visnup/frotz/blob/master/lib/ZORK1.DAT?raw=true /app/zork1.dat
ENTRYPOINT ./goapp
{{</highlight>}}

We even played a few rounds.

![Zork gameplay](/blog/2018-02-23_docker-management-and-kubernetes-orchestration/images/2.png)
<figcaption>Zork gameplay</figcaption>

To put things in perspective, the Zork image ends up at around six megabytes in size. The game was originally able to run on machines with only 64 kilobytes of memory.

Of course, the ultimate goal is to create your own application. I wrote an HTML file on the fly, used a tiny [busybox](https://www.busybox.net/)image to host it on a web server, then built and ran this Dockerfile:

{{<highlight Dockerfile>}}
FROM busybox:latest
RUN mkdir /www
COPY index.html /www
EXPOSE 80
CMD ["httpd", "-f", "-p", "80", "-h", "/www"]
{{</highlight>}}

This created an extremely small image:

![Small Docker image](/blog/2018-02-23_docker-management-and-kubernetes-orchestration/images/3.png)
<figcaption>Small Docker image</figcaption>

Running it locally is fine, but the enterprise demands more. First, it is important to have a secured private registry to host custom images when proprietary software is involved. Second, the images need to be deployed somewhere that is accessible to end users. I demonstrated how to create a private [Azure Container Registry](https://aka.ms/S19cpz) from the command line:

{{<youtube xp3IifCRgFY>}}

Next, I deployed it to the web from the private repository with a single command using [Azure Container Instances](https://aka.ms/aci-docs):

{{<youtube s-Z06cJUREY>}}

I also shared how to leverage Azure App Service’s [Web App for Containers](https://aka.ms/Pg2i5f) to create a solution that scales both up and out:

{{<youtube jhMhscoO3X8>}}

Running single containers is interesting, but production applications usually involve multiple containers. I wrote a <i class="fab fa-github"></i> [simple application](https://github.com/JeremyLikness/devnexus-containers/tree/master/003-compose) to illustrate how to scale backend services using [Docker Compose](https://docs.docker.com/compose/).

![Multiple containers with Docker Compose](/blog/2018-02-23_docker-management-and-kubernetes-orchestration/images/4.png)
<figcaption>Multiple containers with Docker Compose</figcaption>

The service backplane is made up of containers that run a small Go application that serves one of three JavaScript snippets from [Dwitter](https://www.dwitter.net/). The front-end is a web app that executes the code on an interval. The result literally visualizes the scale operations. Here is the compose file:

{{<highlight Yaml>}}
version: '2'

networks:
    user-facing:
      driver: bridge
    service-facing:
      driver: bridge

services: 

    webserver: 
        image: webserver
        build: ./webserver
        ports:
            - 8000:80
        networks: 
            - user-facing

    goservice: 
        image: goservice
        build: ./goservice 
        ports:
            - 8080
        networks: 
            - service-facing

    proxy:
        image: dockercloud/haproxy
        volumes:
            - /var/run/docker.sock:/var/run/docker.sock
        ports:
            - 8080:80        
        links:
            - goservice
        networks:
            - user-facing
            - service-facing
{{</highlight>}}

Running a single backend instance results in this:

![Single backend JavaScript snippet](/blog/2018-02-23_docker-management-and-kubernetes-orchestration/images/5.png)
<figcaption>Single backend JavaScript snippet</figcaption>

Scaling out, however, results in multiple snippets running, and renders something like this:

![Superimposed results from multiple snippets](/blog/2018-02-23_docker-management-and-kubernetes-orchestration/images/6.png)
<figcaption>Superimposed results from multiple snippets</figcaption>

Running compose is fine, but doesn’t provide resiliency beyond a single host. This is where orchestration comes into play. Orchestration platforms provide features including:

* Resiliency
* Scale out
* Load-balancing
* Service discovery
* Roll-out and roll-back (canary and green/blue deployments)
* Secret and configuration management
* Storage management
* Batch job control

The _de facto_ orchestration platform today is [Kubernetes](https://kubernetes.io/). I ended the presentation by walking through deploying the application to the Azure cloud using [Azure Kubernetes Services](https://aka.ms/aks-docs).

{{<youtube A-w8MHlqyQU>}}

Here is the full deck I presented from.

{{<slideshare n5H41EnrBYAWhJ "jeremylikness/docker-management-and-kubernetes-orchestration">}}

You can access the Dockerfile definitions and source code <i class="fab fa-github"></i> [here](https://github.com/JeremyLikness/devnexus-containers).

According to Google’s [Kelsey Hightower](https://twitter.com/kelseyhightower) in his DevNexus keynote, containers are the future.

{{<customtwitter 967040036620390403>}}

He just may be right.

Regards,

![Jeremy Likness](/blog/2018-02-23_docker-management-and-kubernetes-orchestration/images/7.gif)
