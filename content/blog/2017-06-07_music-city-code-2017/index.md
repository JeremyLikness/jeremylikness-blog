---
title: "Music City Code 2017"
author: "Jeremy Likness"
date: 2017-06-07T00:00:00.000Z
years: "2017"
lastmod: 2019-06-13T10:43:27-07:00
comments: true

description: "This was my first year to attend the Music City Code conference in “the Music City” Nashville, Tennessee. It was held on the beautiful Vanderbilt University campus, where they advertise a 3-to-1…"

subtitle: "Recap of presentations at Music City Code 2017 (Rapid Development with Angular and Typescript and Contain Your Excitement: Docker)"
tags:
 - Docker 
 - Kubernetes 
 - Angularjs 
 - Typescript 
 - Presentation 

image: "/blog/2017-06-07_music-city-code-2017/images/1.png" 
images:
 - "/blog/2017-06-07_music-city-code-2017/images/1.png" 
 - "/blog/2017-06-07_music-city-code-2017/images/2.gif" 


aliases:
    - "/music-city-code-2017-e78e6279a60b"
---

This was my first year to attend the [Music City Code](https://www.musiccitycode.com/) conference in “the Music City” Nashville, Tennessee. It was held on the beautiful [Vanderbilt University](http://www.vanderbilt.edu/) campus, where they advertise a 3-to-1 squirrel to student ratio. I imagine it was about 5-to-1 squirrels to conference attendees.

![Vanderbilt Campus](/blog/2017-06-07_music-city-code-2017/images/1.png)

I presented two talks there, the last talk of the first day and the first talk of the last day.

## Rapid Development with Angular and TypeScript

{{<kuula 7lpzw>}}

This is a talk focused on demonstrating just how powerful 🅰 [Angular](https://angular.io/), [TypeScript](http://www.typescriptlang.org/), and the [Angular CLI](https://cli.angular.io/) are to rapidly build apps. Don’t be scared by this 360 photo, if you can’t see the audience just scroll it around.

The first half of the talk focused on the features Angular provides, as well as an overview of TypeScript. The second is a hands-on demo building an app using services, settings, rendering, data-binding, and a few other features.

You can access the deck and source code <i class="fab fa-github"></i> [here](https://github.com/JeremyLikness/ng2-ts-music-city-code).

## Contain Your Excitement

The next talk focused on containers. In true “[Inception](http://www.imdb.com/title/tt1375666/)” style, the container talk itself can be run from a container.

{{<kuula 7lpB0>}}

The talk briefly covers the difference between “metal” in your data center and <i class="fab fa-docker"></i> [Docker](https://www.docker.com/) containers, then walks through building simple containers and evolves to multi-stage containers, using Docker compose, and an overview of orchestrators like Kubernetes.

As part of the talk, I took a 360 degree picture with my [Samsung Gear 360](http://amzn.to/2sD1GTA) (I have the older model, there is a newer [2017 version](http://amzn.to/2sSD8VY)). I updated the source with the embed link, then synced my changes to GitHub. This triggered an [automated build](https://travis-ci.org/JeremyLikness/docker-contain-music-city) that prepared a Node.js environment, ran unit tests, then built and published the Docker image to demonstrate the continuous integration and deployment pipeline that is possible with containers.

You can access the source code <i class="fab fa-github"></i> [here](https://github.com/jeremylikness/docker-contain-music-city) and run the container from <i class="fab fa-docker"></i> [here](https://hub.docker.com/r/jlikness/docker-contain-mcc/).

## Parting Thoughts

As far as conferences go, this is one of my favorites. There were great people, terrific speakers, friendly and helpful volunteers, and a fun venue. The food was awesome and speakers were able to stay in the dormitories on campus which was a fun experience. I definitely look forward to coming back in future years!

![Jeremy Likness](/blog/2017-06-07_music-city-code-2017/images/2.gif)