---
title: "The Amazing Secret to Crafting Conference Submissions that Don't Suck"
author: "Jeremy Likness"
date: 2019-04-23T13:46:00-07:00
years: "2019"
lastmod: 2019-06-24T13:46:00-07:00

draft: false
comments: true
toc: true

canonicalUrl: "https://dev.to/azure/the-amazing-secret-to-crafting-conference-submissions-that-don-t-suck-hgf"

subtitle: "The essential guide to CFPs"

description: "Create an attention-grabbing title and mind-blowing abstract that hit the right details so your submission stands out when you apply to present a talk."

series: "Comprehensive and Practical Guide to Technical Presentations"

tags:
 - Presentation 
 - Productivity
 - Learning
 - CFP

image: "/blog/presenting-4-amazing-secret-to-conference-submissions-that-do-not-suck/images/abstract.jpg" 
images:
 - "/blog/presenting-4-amazing-secret-to-conference-submissions-that-do-not-suck/images/abstract.jpg" 
 - "/blog/presenting-4-amazing-secret-to-conference-submissions-that-do-not-suck/images/cosmosdb.jpg" 
---

## 👉🏻 "Call for Presentations" (CFP): Create a Great Abstract

Shhhh. Don't tell anyone, but the *secret* is that, well, there really isn't a secret. Most conferences are transparent about what they are looking for in a quality submission. I've got good news and bad news. The bad news first: there is no proven formula to never get rejected at a talk. It happens all the time for different reasons. Some conferences have thousands of submissions to review to accept as few as 90 sessions, and it can be tough to stand out. You may be competing against a dozen other submissions for the same topic. Sometimes organizers pass over veteran speakers in favor of encouraging newer speakers to have a platform (which I personally think is awesome).

When I started my first home-based business, a mentor of mine pointed out that something like 8 out of 10 first time ventures fail the first year. Some people hit that failure and decide, "This isn't for me." Serious entrepreneurs, on the other hand, embrace the failure by declaring, "One down. Only seven left to go!" Think about it! Don't let rejections discourage you. If possible, ask for feedback and see if you can uncover why your abstract wasn't accepted, and move on.

{{<customtwitter 1059868844292886528>}}

Now for the good news: there are some techniques you can use that will increase your chances of getting noticed and, ultimately, accepted. As someone who has received more acceptance letters than rejection letters in my career, I'll outline what I believe has worked well for me.

## The Title

I probably spend most of my effort on the title. A good title is easy to read and understand, maybe a little clever, and accurately conveys what can be expected from the talk. Although there are always exceptions to the rule, better titles provide a sense of "what's in it for me" when I'm scanning the schedule, compared to titles that just list technologies.

{{<customtwitter 765680937132621824>}}

For a case study, let's take a presentation I built and modified several times to deliver multiple versions of at different venues. The talk focused on a fully managed NoSQL service called [Cosmos DB](https://docs.microsoft.com/azure/cosmos-db/introduction?WT.mc_id=link-blog-jeliknes). My initial audience was a conference of .NET developers who I assumed knew the name of the technology, but not necessarily its details. All the titles I share below are from accepted sessions. My first title was simply:

> **Explore the (Azure) Cosmos (DB)**

![Explore Azure CosmosDB](/blog/presenting-4-amazing-secret-to-conference-submissions-that-do-not-suck/images/cosmosdb.jpg)
<figcaption>Presenting at Microsoft //build</figcaption>

It was a little pun playing on an interest in science, and simple. When I gave the talk in Russia, I was informed the audience just wanted to know, "What are the goods?" without too much cleverness. The examples in my talk used the [.NET Core platform](https://docs.microsoft.com/dotnet/core/?WT.mc_id=link-blog-jeliknes), so I tweaked the title to read:

> **Explore the Azure CosmosDB with .NET Core 2.0**

This is not what I consider my best work, but it is at least descriptive of what to expect. After giving the talk a few times, I realized many of the developers didn't understand the details of what the database does. So, I integrated a few benefits into the title. The service was built in the cloud for cloud applications, making it *cloud native*, and is designed to provide highly scalable NoSQL instances. The next iteration, therefore, was:

> **Cloud Native Azure CosmosDB for NoSQL at Scale**

At another conference I knew the developers were mostly familiar with relational databases. I wanted to make sure they understood this isn't a "talk that you won't be interested in because it is about different technology" but in fact "a talk tailored to you to help you understand something new." So, I added a call out to the audience in the title:

> **Managed NoSQL with Azure CosmosDB for SQL Developers**

That approach was so successful, I took it further on the next iteration and made it:

> **Say "Yes" to NoSQL for the .NET SQL Developer**

Notice how the title evolved from *what* to *who it is for*.

The next conference I submitted to featured a hiking/outdoor theme. I specifically tailored the titles of my talks to that theme. The talk title became:

> **(Hitch) Hiker's Guide to the Cosmos (DB)**

{{<customtwitter 1040803735302111237>}}

Here are a few other titles of talks I gave. Do you get a sense for what the talk will cover? Do the titles properly convey, "What's in it for you?" I purposefully grouped titles of similar talks (based on the same content) together to show how I tweaked them over time. Which do you prefer, and why?

A fully managed messaging service for cloud applications and services:

> **Event Grid: Glue for the Internet**
> **Connect Anything to Everything: Serverless Routing and Messaging with Event Grid**

The Azure serverless platform:

> **Code First in the Cloud: Going Serverless with Azure**
> **Real-world Microservices in the Serverless Cloud**
> **Enterprise Serverless: the Ghost isn't *in* the Machine, it *is* the Machine!**

Docker and managed Kubernetes via Azure Kubernetes Service (AKS):

> **Docker Management and Orchestration in Azure**
> **Intro to Docker Containers and Orchestration in the Cloud**

Career growth tips and tricks:

> **Hacking Your Career** (not hacking *as* your career!)

Cloud storage options (files, blobs, table storage and queues):

> **A Lap Around Azure Cloud Storage**

Dependency injection, declarative syntax for templates, and data-binding in modern JavaScript apps:

> **The 3 "D's" of Modern Web Development**

Learning TypeScript by starting with JavaScript and re-factoring it:

> **TypeScript from JavaScript by Transformation**

If you're curious about other titles, you can browse my presentations archive with links to decks and repos:

{{<relativelink "/blog/2017-08-17_presentations-archive">}}

> **Tip** Most conferences have websites with session titles and abstracts posted online, even after the event is complete. Take some time to browse the titles and get inspired. These are the titles that were accepted, so they must have done something right! Eventually, you'll see several patterns, like "building something with something," "creating apps using something," "introduction to something new," "what is something and why should I know it?" and the ever-popular "how to do something with something."

The title gets your foot in the door, but the abstract is what can bust the door down.

## The Abstract

The abstract serves a dual purpose. First, it is what the organizers ultimately will use to narrow down submissions. A poor title may result in early elimination, but if you make the initial cut your abstract is where you can deliver the final punch. It should be very concise and, like the title, focus less on *what is it* and more on *what's in it for me?*

Second, it is usually what is provided to attendees of the event. It is the only piece of information they have to decide if they are willing to invest their time and attention in your session. If I am unable to decipher what a session is truly about or don't see any value, why would I be willing to attend?

Let's take an example from a talk I gave in 2018 called "Connect Anything to Everything: Serverless Messaging and Routing with Event Grid". The title, albeit a bit long, already states the value proposition (connecting things together) and then describes a bit of the "what." Let's look at examples of a poor, mediocre, and good abstract. 

> This talk is about Azure Event Grid, a service for sending messages between applications and services.

👎🏻 The description is severely lacking in ... well, just about everything. I know *what* is going on, but I have no clue why I should care. There is no value proposition for me. Will this make my life easier? I don't know. Will the talk deliver value, or could I save myself some time and just browse the docs? Let's try again:

> Azure Event Grid is a fully managed intelligent event routing service that allows for uniform event consumption using a publish-subscribe model. Use Azure Event Grid to react to relevant events across both Azure and non-Azure services in near-real time fashion. Learn how to use Azure Event Grid in this presentation.

🤞🏻 I'd have to cross my fingers that this one makes it through. It does a better job of explaining what Event Grid is, and even makes an attempt to describe the value proposition that you will learn how to use it, but it still falls short. It's great that I'll learn how to use it, but *why* do I even care? Is this even something I want to learn about?

![Abstract](/blog/presenting-4-amazing-secret-to-conference-submissions-that-do-not-suck/images/abstract.jpg)
<figcaption>Just another abstract</figcaption>

Here's the abstract that I submitted, with help and feedback from co-workers, and was accepted.

> In this hands-on presentation, learn about the true value of Event Grid by seeing an example in action. You'll be able to understand what sets Event Grid apart from other services like Service Bus and messaging queues. Event Grid is an Azure service that routes events between endpoints. It provides support for virtually any existing Azure service from storage activity to serverless Azure Function calls. It also has support for custom end points. Instead of taking on the costly overhead of continuous polling in your applications, Event Grid will manage the events for you and publish them to your app when ready.

👍🏻 This abstract assures me I'll understand the value and shares a bit about what that value is (avoiding the overhead of continuous polling). It promises that it will also help clarify why I would use this compared to other services. The abstract could probably be improved even further (for example, I could haved mentioned saving the cost of standing up servers on your own and avoiding being the one on the hook for 24/7 support) but this was sufficient to make the cut.

Here's another abstract that was accepted at the same conference:

> Learn how to harness the power of Azure Cosmos DB, a NoSQL document-based database that offers a true "server-less data" experience. In this session, Jeremy Likness will show you how to scale globally with point-and-click geo-replication and guaranteed single-digit latency. You'll learn how to "choose your own API" and be able to interact with Azure Cosmos DB using the SQL API, MongoDB, Gremlin (graph-based), Table Storage, and Cassandra APIs. You'll learn how to set up Azure Cosmos DB and build applications with demonstrations in .NET and .NET Core.

By reading this, you should know you'll learn how to set it up, how to scale it, and how to use one of several APIs from the .NET platform of your choice.

> **Tip** That thing I mentioned earlier, about getting inspired by titles? You can do the same thing with abstracts.

You'll notice one popular format is what I call "challenge/response." Start by declaring the problem and finish by providing the solution." Taking my earlier abstract about CosmosDB, it could have been framed like this:

> Have you been burned rolling out the latest schema change to your database? Is your database administrator frustrated by frantic requests to optimize poorly crafted SQL queries auto generated by your favorite ORM tool? Did your DBA laugh when you asked for globally geo-replicated data to reduce latency in your international markets? There is a better way! NoSQL is uniquely designed to handle variable data. Azure CosmosDB, a fully managed database service built for the cloud, provides guaranteed throughput with global replication that you can set up as easily as clicking a point on a map. Learn for yourself the advantages to losing your relationships and integrity (database relationships and referential integrity, that is) and how easy it is to build with CosmosDB!

Before submitting, I would probably trim down the size and perhaps tone down the tongue-in-cheek a bit, but hopefully you get the point.

## The Second Set of Eyes 👀

Once you have your title and abstract drafted, don't stop there! Grab a group of friends and/or colleagues, share it and get their feedback. The more, the better. I've learned I am often so close to the topic I want to present that my bias keeps me from noticing obvious flaws in the title and/or abstract. My colleagues are happy to weigh-in and give me advice, and often what I submit is something I've iterated on multiple times based on valuable feedback.

Not sure who can help? No problem. Please reach out to me directly here, or direct message me on Twitter <i class="fab fa-twitter"></i> ([@JeremyLikness](https://twitter.com/jeremylikness)) and I'm more than willing to review your proposals and provide feedback. I'm happy to be your virtual mentor ... after all, that's why I wrote this series! Now there is no excuse not to get feedback.

## Internal Notes

Some conferences provide a section for internal notes. They may specifically request you to share links to previous talks (if you've done any) or other information. I look at this as a great opportunity to share why my talk will be unique. No matter how many times a topic has been covered, no one else will cover it the same as you. It's your job to figure out what is unique about that and help inform the organizers. Did you run into a specific problem in your work that provides a unique insight into the solution? Is there a special story behind your project? Don't hesitate to share additional information to help with the decision process.

In fact, if you are a first-time presenter, I highly encourage you to share this, along with the reasons why you feel you are ready. Describe your passion, or the desire to overcome a fear of public speaking, or the fact that you solved a problem so important you feel it must be shared. All these additional facts may help move the decision in your favor.

## The Network

Many conferences practice a "blind submission" format that removes names from sessions for more impartial voting (sometimes the title or abstract can give away the identity of the speaker). Many others factor the speaker into consideration. The bottom line is that networking can help you. I'm not talking about playing a political game (although some speakers may approach it this way).

When I attend a conference, I am always genuinely thankful for the opportunity. I make it a point to meet and thank the organizers and sponsors and network with speakers and attendees, even if I'm not speaking. If you speak often, you'll find the global network of technical speakers is small. I know many people solely through conferences and social media. Building your network has numerous advantages, and one of them is opportunities to speak.

I wonder if this invitation is still valid 7 years later?

{{<customtwitter 237916409307467776>}}

In one case, I knew a developer local to Atlanta who started a new company. He invited me to speak at the coding academy he started. He ran an introduction to web development boot camp. I presented an introduction to TypeScript session. It was a unique experience for me because the material was far more introductory level than I typically provide, and I got to interact with an audience of mostly junior developers. 

One of the audience members happened to be on the committee for an upcoming conference, and she met me after the session and asked me if I'd like to submit to their event. This was an event focused on women in technology, so I was honored to participate as an ally to the cause. I was invited to speak again the subsequent year and focused on a talk outside of my comfort zone, one focused entirely on career development. It went very well, and I met many amazing developers. Just that one connection a few years ago opened opportunities to speak and grow my network.

## Submit

These are the techniques I use to craft my submissions. I'm constantly updating and tweaking titles and abstracts, and still have plenty of room for improvement on my own. As with most things in life, practice and consistency help tremendously. Remember: don't hesitate to reach out for help. Many conferences offer coaching and feedback to presenters as part of the submission process, and if not you're always welcome to reach out to me. I wish you the best of success and encourage you to submit where you are comfortable. It can be a long, tense process waiting for acceptance (or rejection letters) but persist and eventually you *will* get accepted. Then it will be time to build your presentation!

🗣 **Let's discuss** What are some of your favorite presentation titles you've seen? Do you have any additional tips you recommend for crafting a quality submission? Please share your thoughts in the comments below!

> The example presentation for this installment is a session that was built to be delivered at scale by various presenters as part of a flagship Microsoft event called "Microsoft Ignite | The Tour." It is a breakout session and has a repository with step-by-step instructions to build out and execute the demos (you can explore it [here](https://github.com/Microsoft/IgniteTheTour/tree/master/DEV%20-%20Building%20your%20Applications%20for%20the%20Cloud/DEV50)). I delivered the talk several times around the world. This particular session was recorded in Amsterdam.

{{<youtube NZYSID8snjI>}}

Regards,

![Jeremy Likness](/images/jeremylikness.gif)
