---
title: "Technical Presentation Tips and Tricks"
author: "Jeremy Likness"
date: 2014-09-01T00:00:00.000Z
years: "2014"
lastmod: 2019-06-13T10:43:07-07:00

description: ""

subtitle: "The very first technical presentation I gave was in the mid-nineties for a supply chain management company. Prior to that presentation my…"
tags:
 - Presentations 
 - Speakers 

image: "/blog/2014-09-01_technical-presentation-tips-and-tricks/images/1." 
images:
 - "/blog/2014-09-01_technical-presentation-tips-and-tricks/images/1.png" 
 - "/blog/2014-09-01_technical-presentation-tips-and-tricks/images/2.png" 
 - "/blog/2014-09-01_technical-presentation-tips-and-tricks/images/3.png" 
 - "/blog/2014-09-01_technical-presentation-tips-and-tricks/images/4.png" 

aliases:
    - "/technical-presentation-tips-and-tricks-11189a1c9d09"

canonicalUrl: "https://csharperimage.jeremylikness.com/2014/09/technical-presentation-tips-and-tricks.html"

---

The very first technical presentation I gave was in the mid-nineties for a supply chain management company. Prior to that presentation my only experience had been giving an instructional talk about hacky-sack to fellow students for a speech class. I still remember standing in front of the room and completely forgetting everything I was about to say. Some of the people in the front row actually had looks of concern and pity on their faces as they saw me mumble and stumble through my introduction. I eventually was able to get moving and pull it off but it wasn’t exactly a stellar experience for anyone involved.

![Image of audience watching presentation](/blog/2014-09-01_technical-presentation-tips-and-tricks/images/1.png)

**Warning: Long Post Ahead! This is a large collection of thoughts so my intention is to gather them all here so you have a post you can come back to reference as needed. I encourage other presenters to share their own thoughts, feedback, tips, and tricks in the comments so this can evolve as a resource for aspiring presenters.**

Although I later started a fitness business that involved conducting workshops and speaking at large seminars, this still didn’t prepare me for technical speaking. The added complexity of writing and demoing code makes it a truly unique experience that I had to almost learn all over again. I’ve been [giving technology talks](http://csharperimage.jeremylikness.com/p/presentations.html) for over five years now. My last two talks were in Chattanooga at the [DevLink conference](http://www.devlink.net/). This is a great conference that I highly recommend.

The two talks I gave were [Advanced AngularJS Tips and Tricks](http://www.slideshare.net/jeremylikness/advanced-angularjs-tips-and-tricks) and [Learn ZoneJS](http://www.slideshare.net/jeremylikness/thread-local-storage-execution-contexts-in-javascript-with-zonejs). The links will take to you the slide decks and the last slide on each deck has links to the source code and live demos for the presentations.

This year I noticed I didn’t get very nervous and I had a lot of fun. I came to realize it’s because I’ve practiced so much there are a lot of little things that help me present more confidently. In this post I’ll cover what I think can be useful tips and tricks for setting up and delivering technical presentations.

## Projects First

The technical talks I typically give are developer-focused, so in my opinion they should focus on the code. One approach that has worked for me both in [writing books](http://bit.ly/winrtexample) and creating presentations is to focus on the projects first. My first step is to outline the broad topics of the presentation — the “agenda” if you will. Then I get to work on examples.

There are several approaches to presenting code. Here are the common ones I’ve seen:

### Snippets

Snippets are just what the name implies. If you have a talk that covers a broad range of topics, for example, a language overview, then snippets are probably the way to go. These are just short pieces of code that do something to illustrate your point. They may be combined into a larger project for context but often can simply stand alone. My [Enterprise TypeScript](http://www.slideshare.net/jeremylikness/lidnug-jeremy-likness-enterprise-type-script) talk is an example that [used snippets](https://github.com/JeremyLikness/LearnTypeScript).

### Small Projects

If you have different, broad topics to cover, then small projects fits the bill. These are a group of projects typically under the same solution that cover each aspect, but in a self-contained fashion. It’s an executable chunk of code (or web page, or web app) that covers the topic, but doesn’t depend on the other projects you are presenting to function. My [Advanced AngularJS Tips and Tricks](http://www.slideshare.net/jeremylikness/advanced-angularjs-tips-and-tricks) talk included several [small projects](https://github.com/JeremyLikness/AngularTipsAndTricks) (one per page).

### Large Projects

Sometimes you want to show a closer to “real world example” or something more comprehensive, in which case a larger project makes sense. This can have many aspects that you cover in your talk but is a self-contained, fully functional example. For discussing the capabilities of the WinJS library in the Windows Runtime, I wrote a Windows Store app called [re//build WinJS](https://github.com/JeremyLikness/RebuildWinJS). The app itself _was_ the presentation. I did a similar thing with my original [ZoneJS talk](http://jeremylikness.github.io/ZoneJS/).

### Live Coding

Live coding is always a lot of fun, but requires the most preparation. Live coding makes a lot of sense in several scenarios. When there is a strong “wow factor” with the technology, being able to show users can have a powerful impact. For example, I think it is pretty neat to learn you can [build an feed reader using AngularJS in under 10 minutes](https://www.youtube.com/watch?v=5r5RYlpZYPY).

Another approach for live coding is refactoring. When I designed the lesson for [AngularJS Dependency Injection](https://www.wintellectnow.com/videos/watch/angularjs-dependency-injection), I decided it would be easier to understand and appreciate the benefits if I started with a basic pure JavaScript application and then slowly refactored it to take advantage of the library.

I have two very important tips for live coding. First, always, always have back up snapshots in case the coding goes wrong. It can be tough to recover from a code fumble and you want to be able to pick up and keep on moving. You might have various projects at various stages of the code, or you can use a local source control repository like [git](http://www.git-scm.com/) to store change sets that you can roll back (or forward to). Second, this is the type of talk I spend the most prep time on. You want to go through the exercise again and again until it’s almost as easy as breathing.

## Don’t Lose It!

The last thing you want to do with your presentation is to lose the deck or the source. My strategy is simple: I save my presentations to some synchronized folder like [OneDrive](https://onedrive.live.com/?invref=e0964351db1cb296&amp;invsrc=90) (you can also use Google Drive or DropBox or any number of other free services). This not only gives me an automatic backup but makes it easy for me to access should I have to use a different machine. In fact, because of this strategy I could potentially present even if my main computer crashed because everything is available online.

For source code I like to use a repository like [GitHub](https://github.com/jeremylikness) or [CodePlex](http://www.codeplex.com/site/users/view/jeremylikness). With GitHub you have the added advantage of [GitHub Pages](https://pages.github.com/) which makes it really easy to host your demos as well.

All of these options allow you to synchronize locally, so you can …

## Plan For NO Internet

Believe it or not, technology conferences are notorious for failing at providing adequate Wi-Fi coverage. If you’re lucky you’ll have a venue that provides a dedicated speaker connection (although if you travel with an ultrabook, that means you need your Ethernet adapter).

![Image of warning sign not to hang clothes on fire sprinkler](/blog/2014-09-01_technical-presentation-tips-and-tricks/images/2.png)

Even that can fail, so here is another tip: assume there is NO Internet. The easiest way to do this is to turn on airplane mode and then run through your entire presentation. Consider Internet gravy if it exists. There is nothing more awkward than a speaker having to declare that his entire presentation was based on an Internet connection and therefore he won’t be able to share anything when it’s down.

While you’re at it, be sure to …

## Size to the Projector

If you are able to find out what resolution the projector will support, that is great. Otherwise, assume the worse. Believe it or not there are still many places that have 1024x768 resolutions. I always change my resolution to the lowest possible and run through my presentation to make sure it fits smaller screens. 1366 x 768 is doable with scrolling if you’re stuck with 1024, but beyond that I wouldn’t plan for larger sizes unless you absolutely know they will be available.

It’s up to you for aspect ratio but I tend to do more with a 16:9 (wide screen) aspect ratio than 4:3. If nothing else it makes it easier to record and playback on modern sites.

## Timing and Talking Points

There is a lot we could cover here so I will keep this section brief. I learned a few good lessons back when I had my fitness business. I knew I needed mentors so I had professional coaching from very successful public speakers. The two major lessons I learned:

### PowerPoint is a Pivot, not a Crutch

Use PowerPoint to capture your main talking points and illustrate the concepts, but that’s it. If your presentation is reading PowerPoint, you’re doing it wrong. In fact, I find the more general the points are, the better the presentation is. I am more likely to interact with the audience and be able to customize it, and I can also expand or contract detail based on the time available. For the most part I’ve learned how to build a presentation deck based on the time I have allotted, and if my presentation will fall short or long I know beforehand. I would err on the side of more content at first so you’re not caught with the awkward situation that you’re talk ends super early, but the more you practice the more you’ll learn how many slides and bullets map to a 20, 30, 45, or 120 minute presentation.

### You Know What You Know

This may sound strange but it has helped me more than you can imagine. Many presenters are surprised to learn I don’t stay up all night the evening before going through my talk several times and memorizing it. When I am doing live coding I’ll redo the project from scratch over and over but I typically only go through a deck twice.

Yes, that’s right … just twice. Why and how? First, no presentation ever goes perfectly so trying to memorize a perfect scenario I believe is a set up for failure. You need to learn how to be confident, comfortable, and adapt to the audience, your demos, and the environment. I go through one pass to get a feel for timing and a second pass to make sure any adjustments will stick, then I leave it alone.

There is no new information I am going to learn the night before a presentation, so why try to learn it? Instead, I know that I “know what I know.” This means I can step in comfortable that I’m covering a topic I can speak about. The PowerPoint is a guideline, but my knowledge is what I’m there to share so I try to speak from the heart as much as I can.

For timing, I either grab my wife or daughter as an audience or do it myself. I run through one time as if there is an audience. It may look goofy and feel uncomfortable at first (I literally stand up and walk and talk and pretend I’m answering questions even when I’m alone in my office) but it is how you can experience the timing for your talk. You will almost always run through it more quickly yourself based on how engaged you get with the crowd, so I always look to finish a little early in my test run. If I take 45 minutes for an hour talk I know I’m good, if I’m at a half hour then I need to add content and if I’m at 55 minutes I know I’m going to go over and should shave off some content or make it “optional.”

### Hardware

Hardware is largely a matter of personal preference so I’ll just share my rig and why it works.

![Image of laptop bag and open laptop](/blog/2014-09-01_technical-presentation-tips-and-tricks/images/3.png)

My laptop is a [Lenovo IdeaPad Yoga 13](http://csharperimage.jeremylikness.com/2013/02/review-of-lenovo-ideapad-yoga-13-for.html). I purchased this for testing apps for a Windows 8 book I wrote and fell in love with it. If you are able to I highly recommend picking up an ultrabook or a hybrid. Travel light. You’ll thank yourself.

In addition I bring along a [ThinkVision LT1421 monitor](http://www.amazon.com/gp/product/B005OEJFIK/ref=as_li_tl?ie=UTF8&camp=1789&creative=390957&creativeASIN=B005OEJFIK&linkCode=as2&tag=cei0e-20&linkId=2P2TGMYVMSKXLOLE). There is a newer version with higher resolution but it also weighs more. This keeps me productive in the hotel with a second screen but when presenting I can also use it to mirror the projected display and therefore project in extended mode. I can coordinate the presentation from my laptop screen but still see what I’m coding on the monitor by having it mirror the projection.

I’ve trained myself to use the track pad almost exclusively so I ditched a primary mouse, but I do use a [Lenovo dual mode touch mouse](http://www.amazon.com/gp/product/B00JR77A5K/ref=as_li_tl?ie=UTF8&amp;camp=1789&amp;creative=390957&amp;creativeASIN=B00JR77A5K&amp;linkCode=as2&amp;tag=cei0e-20&amp;linkId=ZZYQ62T4W5GB55X7) for presenting. It allows me to advance or revert the slides as I’m walking around and has a built-in laser pointer for highlighting areas of the screen.

Another alternative is the [Office Remote app](http://www.windowsphone.com/en-us/store/app/office-remote/01f53e5a-7870-49cb-8afc-d6fab6d7a3cd) for Windows Phone. This will synchronize with your presentation, show you your notes, and let you advance/revert slides from your phone. I don’t use this, instead I’ve installed the [Night Stand Clock Lite app](http://www.windowsphone.com/en-us/store/app/night-stand-clock-lite/1ece760c-452a-e011-854c-00237de2db9e). How many presentations have you found either went way over without the speaker noticing, or involved them stopping halfway through to ask, “How are we doing on time?” I prefer to avoid that by setting my phone next to my laptop with the clock showing. The app I mentioned shows a big, bold, bright digital clock so I can read it easily at a glance. I always make sure I know when the presentation is supposed to end and the clock keeps me on track — I can just glance at it casually and adjust where I’m at based on where I need to be.

It seems to be common that you find presenters asking if anyone has a particular adapter because they assumed VGA or HDMI or otherwise. It’s not too expensive to invest in a set of cables (DVI, VGA, and HDMI) to carry with you. Amazon sells perfectly usable [HDMI cables for $6](http://www.amazon.com/gp/product/B003L1ZYYM/ref=as_li_tl?ie=UTF8&amp;camp=1789&amp;creative=390957&amp;creativeASIN=B003L1ZYYM&amp;linkCode=as2&amp;tag=cei0e-20&amp;linkId=VLGB65J33NPYTVRM) and most monitors package multiple cables. I travel with a VGA, DVI, and HDMI cable, and even if I don’t need it to present it makes it easy to watch Netflix or Amazon Instant Video in the hotel if there is a modern flatscreen TV.

I also carry a set of adapters for every scenario, from VGA to HDMI, HDMI to DVI, and everything in between. You can pick up adapters for a few bucks each and chain them together, or go with an option like this [multi-adapter for Surface](http://www.amazon.com/gp/product/B00IKPOH6A/ref=as_li_tl?ie=UTF8&amp;camp=1789&amp;creative=390957&amp;creativeASIN=B00IKPOH6A&amp;linkCode=as2&amp;tag=cei0e-20&amp;linkId=FDW7UX3HBWYYWV6U) that features all of the various adapters.

Finally, if you are using a hybrid, tablet or ultrabook, be sure to have an Ethernet adapter. Many ultrabooks provide these but if there is a dedicated speaker cable it’s always wise to use it instead of the saturated Wi-Fi. Some speakers bring their own Wi-Fi hotspots that connect to their cellular, but I haven’t done this personally so I can’t speak to it directly. I’ve witnessed it save a few presentations.

## Presentation Day

So now you’ve prepared your preparation and gathered your hardware. It’s presentation day. What now?

![Image of granola, orange juice, coffee and lanyards](/blog/2014-09-01_technical-presentation-tips-and-tricks/images/4.png)

Here are a few tips for the actual day of the presentation.

* **Eat normally**. Don’t purposefully starve yourself or stuff yourself on conference food. Try not to deviate from your regular eating schedule, and just have an ordinary meal. If you overeat you may find yourself losing energy and hanging off the podium, while not eating can result in fainting.
* **Stay hydrated**. Water is best for this — if you hydrate with coffee and cola you’re likely to finish the presentation before it starts. Most venues provide water bottles for speakers but if not or you’re not sure, bring your own. There’s nothing worse than croaking like a frog in the middle of your well-rehearsed presentation.
* **Arrive early**. Sometimes it’s not practical due to a previous speaker, but it’s always good to get there early so you can test out the plugs, outlets, Internet, project, etc.
* **Test all scenarios**. It’s a common mistake to pull up your deck and think it’s all working. If you are going to show code, pull up some code and make sure it shows clearly. If not, you may need to tinker with your display settings. For example, although developers love to program with dark themes these often don’t project well. If you use Visual Studio, be sure to check out the Power Tools and [PRESENTON](http://www.sadev.co.za/content/visual-studio-presenton). If your code share is cut off, this gives you time to adjust margins or fonts or tinker with display settings to fix it before you get started.
* **Pre-load your screens**. Go into your Visual Studio, pull up your browser, and open up your deck so the screens are ready and you don’t have to fumble through them.
* **Shut it down**. Close Lync, Messenger, mail, and any other apps that could potentially launch notifications and distract you. Shut it all down. You’ll be freeing up clock cycles and memory for your presentation.
* **Window + I**. If you are running Windows 8, open the Start Menu then hold down the Windows Key and press I. Tap on the Tiles option, then tap the button to clear personal information from your tiles. Go ahead and clear your browser history too, no one needs to see any web sites in your history outside of ones you are presenting on.
* **Windows Mobility Center**. From the start menu do a search and launch Windows Mobility Center. This will let you [turn on Presentation Settings](http://windows.microsoft.com/en-gb/windows7/adjust-settings-before-giving-a-presentation). It keeps your screen from blanking and ensures your laptop stays awake as wells as turns off the screen saver and system notifications.

Now it’s time to start. Does your throat feel dry?

## Tips for Nervous Presenters

Remember, you know what you know. The irony of being nervous for a presentation is that it is a chicken/egg scenario. Why are you nervous? You might mess up. Why might you mess up? Probably because you’re nervous. I wish I had a simple way to make that go away, but in my experience it just takes a lot of practice. The more I’ve screwed up, the more comfortable I’ve gotten because I survived and learned it’s not the end of the world to make a mistake on stage. Sometimes I think good presenting is really just about being comfortable with messing up and being able to move on.

One of the hardest things to do can be just getting started, so practice your introduction. Try to start with something unique. “Hey, how’s it going?” isn’t necessarily the best way to get started. I like to start by either telling a story or understanding more about my audience by asking a few interactive questions. If you are uncomfortable talking about yourself, focus on the topic first and save the introduction for later. You don’t always have to lead with “My name is…” although it’s nice to at least establish who you are and why you are there.

For example, maybe I’ll start with, “I was working on a crazy project a few weeks ago and stumbled across an insane technology that saved my life. I knew I had to share this with other people. I’m Jeremy Likness …”

Here’s some other [tips to get started](http://www.dummies.com/how-to/content/how-to-write-an-introduction-for-a-presentation.html).

Probably the best tip I can give you is to think back to why you are presenting. I present because it is is exciting to share technology with others and help educate and mentor them. To me the ultimate reward is to have someone walk up after a presentation and share that they learned something new or were able to solve a problem. That’s exciting. So if I find myself feeling a little nervous, I remember it’s not about me. I’m there to serve, and it’s about the content. I’ll engage in conversation with members of the audience before the talk so I get to know them a little better. Often I’ll find it is very easy after those conversations because I feel more like I’m having a casual lunch conversation with friends, so it’s more like “Hey, check this thing out” rather than “I’d like to thank the academy …”

## Share Your Story

Hopefully this blog has given you some good ideas to get started with. I don’t believe anyone goes to a JavaScript talk just to learn about JavaScript. That is important, but ultimately that talk is part of a bigger story. The story may be a cool project the speaker worked on, an anecdote that you can relate to, or part of your story in learning a new technology to solve a critical business problem.

Don’t ever make the mistake of thinking you can’t speak on a topic because it has already been covered. No one can present it the exact way _you_ can or has the experience and background you do. That is what I love about conferences and user groups, it’s the ability for professionals to come together, share their stories and improve the industry as a result. If you are sitting on the fence I highly encourage you to step out of your comfort zone and into an experience that will definitely help you grow. Ultimately, you’ll help others grow at the same time.

Please share your thoughts and feedback in the comments and if you are a speaker, I’d love to hear your thoughts, tips, and tricks as well. 

_Originally published at_ [_csharperimage.jeremylikness.com_](https://csharperimage.jeremylikness.com/2014/09/technical-presentation-tips-and-tricks.html) _on September 1, 2014._
