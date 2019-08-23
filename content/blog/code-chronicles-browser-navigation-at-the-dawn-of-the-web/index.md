---
title: "Browser Navigation at the Dawn of the Web: Code Chronicles"
author: "Jeremy Likness"
date: 2019-08-22T14:28:12-07:00
years: "2019"
lastmod: 2019-08-22T14:28:12-07:00

draft: true
comments: true
toc: true
series: "The Code Chronicles"
subtitle: "There was a time that XML ruled them all."

description: "Retrospective of a project built in the late 1990s that had to deal with the complexities of building a business application for the web."

tags:
 - Web Development 
 - Browser
 - Navigation

image: "/blog/code-chronicles-browser-navigation-at-the-dawn-of-the-web/images/code-chronicles-header.jpg" 
images:
 - "/blog/code-chronicles-browser-navigation-at-the-dawn-of-the-web/images/code-chronicles-header.jpg" 
---
After 36 hours of nonstop programming, I triggered a new build of [RPG/ILE](https://en.wikipedia.org/wiki/IBM_RPG#RPG_IV) code on the [AS/400 machine](https://en.wikipedia.org/wiki/IBM_System_i) and checked my changes into [StarTeam](https://en.wikipedia.org/wiki/StarTeam). The door burst open and the IT manager staggered in with a tray full of 64oz "Big Gulp sized" cups of coffee and a huge bag of donuts. "It's been a long night and this should help us all recharge" he declared as he deposited the items on a table next to greasy pizza boxes with half eaten slices and crumbs. After swallowing two donuts and gulping down some coffee, I announced that the fix was ready.

"We told the shift to go home. We're going to have to test it ourselves" was his reply.

A few minutes later I was riding on a fork-lift in a massive warehouse. A tiny Windows CE device told us which aisle, bay, and slot to pick from and waited patiently for us to scan the item. Next, the bright green characters on the monochrome display directed use to drop the small box into a chute. It slid down the chute and landed on a tilt-tray conveyor system that quickly spun into action, carrying the box around a massive loop then tilting to deposit it into another chute. It landed in an larger packing box and a small printer spit out a shipping label. We sealed the box, affixed the label and slid it onto another belt. The test was complete. Success!

![The Code Chronicles: Examining a quarter century of enterprise software development](/blog/code-chronicles-browser-navigation-at-the-dawn-of-the-web/images/code-chronicles-header.jpg)

When I realized that programming is my passion and what I want to do for a living, I had no idea what I signed up for. My career flew me around the world, deposited me on massive warehouse floors, led me to don a hard hat and tour an aluminum extrusion site and connected me with brilliant scientists to collaborate on three-dimensional cubing algorithms and threat detection intelligence systems. Many cloud services available today exist to solve the problems we encountered decades ago, sometimes for the very first time. To capture those moments in history and share a journey of creative troubleshooting and problem-solving, I am kicking off "The Code Chronicles."

{{<twitter 1149778555464605696>}}

In this series, I'll do my best to capture major projects I was a part of during my career. The goal is threefold: first, to capture what I feel are interesting moments in my personal history of software development; second, to share ways teams over time have been successfully solved unique problems; and finally to reflect on what is available today and celebrate the progress software development has made as an industry.

Let's get started with a story about building a web-based business application in the mid-90s when most other companies were using it to as an online brochure or business card!

## The Problem: Web-Based Business App

In 1997 I asked to transfer from my job working as a development team leader for AS/400 software to a new department that was recently created. They were tasked with building a web app, and at the time few people even knew the Internet existed. I learned about the web a few years earlier in my failed attempt at college, and immediately recognized this would be the future. The company was concerned I would be upset about losing my management role (I had no professional web experience, but then again, very few people did) but I assured them as long as they didn't cut my pay I'd be fine. It was one of the best decisions I've made in my life.

The application we were tasked to build would provide unique real-time insights between suppliers and retailers. The appeal of the web was straightforward: we wouldn't have to manage a software installation (*cough* lies *cough* [ActiveX](https://en.wikipedia.org/wiki/ActiveX) *cough*) and our customers would be able to access the system regardless if they were running on AS/400s like a major part of our business was, or Linux, or Windows. The project began without us knowing whether the web was even a viable solution for an enterprise app, but we were confident, optimistic, and had a brilliant architect on our team.

The challenge with inventory at the time was that there wasn't a standard system for retailers to connect to view available stock and submit orders. Each supplier had a different ordering system, inventory was often updated by batch processes and it was common to order an item only to find out too late that it was out of stock. Furthermore, the suppliers had complex relationships with their retailers. For example, one supplier might want to always reserve inventory for larger customers and report "out of stock" to smaller retailers. Another supplier didn't want to divulge inventory numbers but only show "in stock" or "out of stock." Yet another only showed it in units of 1,000.



## The Solution: XML to the Rescue

## Retrospective: MVC, SPA, and Routes



