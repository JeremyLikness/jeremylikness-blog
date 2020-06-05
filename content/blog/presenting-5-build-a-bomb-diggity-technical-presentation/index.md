---
title: "Build a 💣 Bomb-Diggity Technical Presentation (🎤 Mic Drop Optional)"
author: "Jeremy Likness"
date: 2019-05-01T13:46:00-07:00
years: "2019"
lastmod: 2019-06-24T13:46:00-07:00

draft: false
comments: true
toc: true

canonicalUrl: "https://dev.to/azure/build-a-bomb-diggity-technical-presentation-mic-drop-optional-1fhb"

subtitle: "Make your presentation pop"

description: "Discover the key elements to creating a technical presentation that delivers impact, leaves an impression and achieves your goal of reaching other developers to learn something new."

series: "Comprehensive and Practical Guide to Technical Presentations"

tags:
 - Presentation 
 - Productivity
 - Learning

image: "/blog/presenting-5-build-a-bomb-diggity-technical-presentation/images/dotnext.jpg" 
images:
 - "/blog/presenting-5-build-a-bomb-diggity-technical-presentation/images/stairway.jpg"
 - "/blog/presenting-5-build-a-bomb-diggity-technical-presentation/images/chaos.gif"
 - "/blog/presenting-5-build-a-bomb-diggity-technical-presentation/images/dotnext.jpg"
---

## 👉🏻 Build Your Presentation

You received your acceptance letter ✅ and now it's time to get building 🏗! How you approach your presentation depends on a number of factors, including the [talk format](/blog/presenting-3-many-flavors-of-technical-presentations). I always start with the [abstract and title](/blog/presenting-4-amazing-secret-to-conference-submissions-that-do-not-suck). What is my commitment to deliver? What are the key takeaways I described in my session submission? What is my definition of success? Obviously, I want the audience to receive value. This is usually accomplished through a combination of storytelling and show-and-tell (otherwise referred to as "demos"). Let's break those down.  

## The Story

Every presentation has a story. You control how predictable the plot is. A presentation that covers all the latest JavaScript language features may simply tackle a bullet list of items to share. "Here is feature one: what it does, what it looks like, how and when it is used, and onto the next one." A more compelling story, however, will contain some very specific elements.

![Stairway to the unknown](/blog/presenting-5-build-a-bomb-diggity-technical-presentation/images/stairway.jpg)
<figcaption>I wonder what stories lie ahead?</figcaption>

Fortunately, there is a massive body of knowledge surrounding what makes a good story. So, what makes a good story? You'll find different formulas, but I like to keep things simple and focus on the Power of Three, from my article about Signal-to-Noise:

{{<relativelink "/blog/2018-02-22_raise-your-signaltonoise-ratio">}}

Here are the three parts I focus on:

1. An *amazing, mind-blowing introduction* to capture interest quickly and up front. Think about the opening paragraphs from some of your favorite books and how that relates to the message you are trying to convey.
2. A *serious conflict* encountered by the main character.
3. A *realistic but surprising resolution* that ultimately solves the problem, often with an unexpected twist.

> ⭐ **Tip** If you really want to get better at presentations, there are a few non-technical places you can look. Books that focus on better storytelling are a good start. Sales is also about relating to your audience and telling a good story, and it just so happens that some good sales books can also help you improve your presentations. Think of it as "selling your idea." Take some time to check out non-technical books that can help you work on your soft skills.
  
To illustrate, I'll give two examples.

One presentation I deliver that consistently receives positive reviews is about [serverless technology](/blog/2018-10-08_enterprise-serverless).

{{<customtwitter 1047582372785532929>}} 

In the beginning, I briefly introduce the concept of serverless and jump right into a demo showing how servers auto-scale when I run a load test against an API. This creates an initial reaction and provides some "wow factor."

The conflict is a combination of how hard and expensive it can be to build, host, maintain, and scale web applications.

The resolution I offer is a set of demos and solutions using serverless.

Another [presentation I deliver](/blog/2019-04-16_presentation-webassembly-c-sharp-and-blazor-at-codestock-2019) is about a newer technology called WebAssembly and a framework built on top of it named Blazor.

{{<customtwitter 1117068673003544577>}}

For this presentation, I pose the challenge right away: it doesn't matter if you are a C, Ruby, PHP, C#, Rust, Go, or other developer, if you are writing client-side web code you are forced to use JavaScript or TypeScript. Or are you? The "wow" is that you *can* use the language of your choice with WebAsssembly.

The solution is demonstrating how easy it is to build Single Page Applications using the framework. 

Coming back to the power of three, I find it helpful to focus on these points when building a presentation:

1. For longer presentations, break the presentation into three distinct phases.
2. Always think about the three key parts of a good story (wow, conflict, resolution). 
3. Remember that you are *not* the protagonist of the story! The hero should always be the audience, and the antagonist something that may keep them from doing her or his job.

As a quick exercise, think about one of your favorite presentations. Does it include these elements? If not, how is it different and can you apply that to your own presentation?

## The Demo

The centerpiece of a good technical presentation is the demo. It is one thing to talk about technology, and another to demonstrate it working. Although it may be tempting to put together a demo that highlights all the latest, "cool" features, this is another opportunity to connect with your storyline. How does the demo illustrate the conflict and its resolution? Does it help the audience solve *their* problem and make them the hero?

![Fractal demo](/blog/presenting-5-build-a-bomb-diggity-technical-presentation/images/chaos.gif)
<figcaption>A live demo can be chaos!</figcaption>

My most common approach to a presentation is to build the demo(s) first, then create a narrative around those demos. That way I can highlight the features specifically addressed by the demo. In other cases, I'll create the narrative first and determine what demo supports the story arc best.

### One Large or Multiple Small

There are a few approaches to the demo. In my serverless talk, mentioned earlier, I have several independent demos that illustrate a specific part of the serverless stack. I build each from the ground up because the goal is to show how easy it is to start from scratch and reap benefits like elastic scale and resiliency. For other presentations, I may build a comprehensive application and the "demo" focuses on running the finished product and walking through the various components that make it successful.

You can also build a "skeleton" project that you refactor to demonstrate how the new technology improves the final product.

### Snippets and Commits

Snippets are your friend. Live coding has a lot of moving pieces, so minimizing typos to focus on the main storyline is paramount. You can break your process into steps and store the code as snippets (how varies based on your development environment) or macros that you execute to produce a code block. In some cases, I create a step-by-step set of instructions with code blocks that I can easily copy and paste. As I'm copying code to paste (I explain this is to avoid making the audience watch me type and avoid typos) I can scan the notes and make sure I'm not missing any explanation points.

Here is another approach:

{{<github "JeremyLikness/typescript-from-javascript">}}

This repo documents each commit and explains step-by-step how to achieve the end result. When demoing this, I can checkout individual commits and show how the code changes with each step.

### Live Coding

One of the first pieces of advice about speaking that I never followed was this: "Never code live. Too much can go wrong." Although it is true there is a lot that can happen, in my experience the audience appreciates seeing live code and prefers to be part of the process rather than starting with the finished product. I typically run two or three practice sessions before delivering a talk for the first time, but if I'm live coding I'll practice dozens of times. I want to know the material inside and out so I can deal with any unexpected roadblocks.

> ⭐⭐ **Pro Tip** You are going to practice your demos anyway, so why not record them? This serves a dual purpose. First, if you run into technical difficulties, you have the video to fall back on. If I'm doing a demo that depends on the web and am not sure how good the Internet connection will be, I record a video. When I play it back, I don't use sound but narrate it live and often make a joke like, "I've practiced this so many times, I don't even need to have my hands on the keyboard." After, I can caption the video and post it online as a resource.

## The Deck

The deck is an important part of the presentation but you want to make sure it doesn't become your crutch. I use a deck to capture main points and illustrations, and to provide links and context for the audience to refer to. Again, I find a great way to break down the presentation is "Power of Three." Just a few examples:

* For my **Azure Cosmos DB** presentation, I break it into three phases: what is NoSQL, what is Azure Cosmos DB, and demos to drive home the points.
* For my **serverless platform** presentation I start with answering the question, "What is serverless?" then enumerate the various components of the platform and end by tying them together.
* For my **Blazor** presentation, I start with the background by explaining WebAssembly, move into what Blazor does and conclude with demos.

Each section can be broken down into its own themes as well.

A few overall pointers:

* Keep introductions light. People can learn about you by reading your bio or speaking with you afterwards. I used to spend far too much time building myself up as if I had to prove why the audience should listen to me. I've learned a few blurbs to highlight who I am on a single slide is enough; it's the presentation that provides the credibility.
* Avoid walls of text. If I must read, I stop paying attention to you, and then I wonder why you're there at all - just give me the slide! The exception to this is when I want to provide reference material. In that case, I explain the slide is there for reference and move on (or even better, hide the slide so it's in the deck but not part of the presentation). 
* Images are fun but don't try to make them the centerpiece. Use them to amplify your message. Be sure to understand and adhere to copyright law when using images and especially animated GIFs. I've started using exclusively my own photographs to avoid any concerns. 
* Include links. This is a great way for your audience to look up materials after the fact.
* I always look at each slide and ask myself, "If I didn't see me present, would this make sense?" If the answer is "no" then I tweak it so the presentation can live on as a resource after the talk.
* Keep font sizes consistent! If possible, use the built-in layouts of the template or a stylesheet if you're using a programmatic solution.
* NO SMALL IMAGES OR TEXT! Make sure the people at the back of the room will be just as comfortable as those at the front.
* Skip videos unless they are important and relevant to driving home a point.

![Me presenting in St. Petersburg, Russia](/blog/presenting-5-build-a-bomb-diggity-technical-presentation/images/dotnext.jpg)
<figcaption>Presenting with PowerPoint in St. Petersburg, Russia</figcaption>

Depending on the software you use, I have a few other suggestions.

### PowerPoint

PowerPoint is my favorite software to use. There are other flavors of presentation software, including open source ones, that have similar capabilities, but I don't have tips for those because I'm not as familiar. Feel free to add yours in the discussion below!

* **Fonts** in a presentation should be consistent (including size) but more important, the font needs to be installed on the host machine. If you don't embed your fonts or use standard fonts that are pre-installed, you run the risk of your presentation looking completely different if you have to present from someone else's machine. [Here are Windows fonts](https://en.wikipedia.org/wiki/List_of_typefaces_included_with_Microsoft_Windows) and [here are macOS fonts](https://en.wikipedia.org/wiki/List_of_typefaces_included_with_macOS). 
* **Design mode** is a new feature that helps aesthetically challenged developers like me create reasonably clean and pretty slides. To see if you have it available in your copy and learn how to use it, check out [this article](https://support.office.com/en-us/article/create-professional-slide-layouts-with-powerpoint-designer-53c77d7b-dc40-45c2-b684-81415eac0617?WT.mc_id=link-blog-jeliknes).  
* **Smart Art** is your friend. I try to not have *any* bullets on *any* slide, and instead use a SmartArt list. This keeps the points short and concise and is a more visually appealing way to show them than a wall of text.
* **The Morph effect** is awesome if you have it available. You can use it to transition between slides. If you want a list that animates or shapes to move around, you can basically duplicate the slides, tweak them for each "frame" of your animation and then use morph to animate fluidly between them.
* **Closed Captioning** is available now in PowerPoint! Make your presentation more accessible by turning this on to get live captions. It will even translate to another language! Check out the details [here](https://www.microsoft.com/translator/help/presentation-translator/?WT.mc_id=link-blog-jeliknes).

### Reveal.js

I enjoy [Reveal.js](https://revealjs.com/#/) for JavaScript and web-based presentations. It creates a nice, shareable project.

* **Fonts** should be "web safe" to run consistently on everyone's machine. Remember if you are using emoticons to set `<meta charset="UTF-8">`.
* **Live code** is awesome to demo with this framework. For example, when I am showing some JavaScript, I might build the code right into the deck and show how it runs. Have fun and be creative!

## Your Mileage May Vary

Everyone is different. I've spent a decade learning how to craft a great presentation and still fall short on my first attempt. This post just touches the surface and hopefully provides food for thought. My favorite tool for building good presentations is people. Before I present, I always run my presentations by my peers who are willing to invest their time and attention and often receive pages of valuable feedback. It's also OK to give the same talk multiple times, especially if it's at geographically separated venues. Some of my best talks were the result of giving a presentation multiple times and modifying the talk, demo, even story arc based on feedback from the audience. More on that later in this series, but for now hopefully you have a foundation to build your presentation. Next, we'll talk about practice and feedback before you get on stage!

> ⭐ **Tip:** consider creating a comprehensive, "Train the Trainer" document that includes step-by-step instructions and videos for your talk. At a minimum it will allow attendees to easily pull down and follow along with your demos. I consider it success when someone adopts my talk, even grabs my deck and modifies it a little to make it their own and delivers it to an audience. It is a way of empowering other developers, both the speaker and the attendees, and reaches channels I might not be aware of. Also, everyone's delivery is unique, and the same talk may connect differently when someone else presents it.

🗣 **Let's discuss** What do you feel are the crucial elements of an amazing presentation? What techniques do you use to build effective talks? What is your favorite presentation software or framework? Please share your thoughts in the comments below!

> Earlier in this post I mentioned a repository that documents individual commits. The presentation is about TypeScript, and the demo *is* the story. I take an existing JavaScript app and refactor it to TypeScript. There are plenty of talks that describe the benefits of TypeScript; I wanted to *show the benefits* and let the tools speak for themselves. Each snippet is a step in my presentation, and I carved them into little segments of a few minutes each. The full list is available here: [TypeScript from JavaScript](/series/typescript-for-javascript-developers/).

{{<youtube 6FEakIehnls>}}

Regards,

![Jeremy Likness](/images/jeremylikness.gif)
