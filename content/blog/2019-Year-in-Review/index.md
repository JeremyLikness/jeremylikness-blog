---
title: "The Year of Angular on .NET Core, WebAssembly, and Blazor: 2019 in Review"
author: "Jeremy Likness"
date: 2019-12-19T00:40:52-08:00
years: "2019"
lastmod: 2019-12-19T00:40:52-08:00
series: "Year End Summaries"

draft: false
comments: true
toc: true

subtitle: "The JavaScript monopoly is broken"

description: "An in-depth analysis of goals (personal and professional) for 2019, along with statistics across social media, blogs, and my link tracker."

tags:
 - Azure 
 - Technology
 - WebAssembly
 - Blazor 

image: "/blog/2019-year-in-review/images/github2019.png" 
images:
 - "/blog/2019-year-in-review/images/github2019.png" 
 - "/blog/2019-year-in-review/images/twitterwin.jpg" 
 - "/blog/2019-year-in-review/images/twitterinterests.png" 
 - "/blog/2019-year-in-review/images/dev4lifeacquisition.png" 
 - "/blog/2019-year-in-review/images/top10.png" 
 - "/blog/2019-year-in-review/images/redirectbymedium.png" 
---

What an awesome year! 2019 had lots of great milestones. Every year of my professional career has been exciting, and 2019 was no different. It was my first full year living in the Pacific Northwest and my second full year employed at Microsoft. I continued to travel the world.

{{<custominstagram BtGzqF8gTX1>}}

According to [TripIt](https://tripit.com) I covered 124,570 miles (200,476 km) over 17 trips across 26 cities in 10 countries. I was away for 92 days of the year, which is _way too much_ (I'll be fixing that this coming year!). The places I visited include:

* Amsterdam, Netherlands (one of my favorite cities)
* Atlanta, GA (former home town!)
* Cabo San Lucas, Mexico (first time)
* Chicago, IL
* Hong Kong, China (first time and loved it)
* Johannesburg, South Africa (first time, awesome place)
* Mumbai, India (first time, amazing history there)
* Orlando, FL (hi, Mom and Dad!)
* Oslo, Norway (first time in the land of my ancestors)
* San Diego, CA (first time, incredible climate)
* Toronto, Canada (brrrrrr...)
* Wisconsin Dells, WI

## Quick Detour: 25 Years of Professional Development

I had to pause for a moment writing this blog post to celebrate 25 years (cough, yes, cough, a quarter century) of earning a living doing what I love: writing code and empowering developers to do the same. This is a quick, personal look back at the arc my career has taken. (Not interested? No problem - [click here for the next section](#retrospective-major-goals-for-2019)).

* **1994** Wrote RPG on an AS/400 (now iSeries) for an insurance company.
  * Learned SQL
  * Published my first technology articles
* **1996** Relocated to Atlanta, met my wife, joined a small company that I knew wouldn't last long.
  * My first exposure to "CASE" tools
  * Spent a lot of time building custom Quake mods
* **1997** Joined the supply chain software company where I acquired a large amount of my programming knowledge.
  * Worked on a very early line of business web app that featured a custom navigation journal, XSLT-based rendering engine, and XML-based web services
  * The company was private with about 100 employees when I joined, then went public and was international with thousands of employees when I left
* **2002** Lost weight and started a part-time fitness training company.
  * Changed jobs to apply my passion for health and fitness
  * Had no idea the role I would be given was Director of IT
  * Built the architecture and wrote most of the code for a multi-lingual, multi-tenant, white-labeled web platform
  * Negotiated my first online hosting contract
  * Negotiated my first business phone plan contract that saved us tens of thousands
  * Helped the company more than double in size
* **2004** Decided to "jump first, build the parachute on the way down"
  * Quit my job to start my own fitness company full time
  * Briefly relocated to South Dakota and quickly decided that blizzards in May are not cool (heh)
  * Relocated to a small house on St. Pete Beach in Florida
* **2006** After three years and almost $100k of debt, managed to turn my business around to earn almost six figures of revenue (compared to total revenue of ~$10k the first year ... ouch)
  * Received a phone call from a multimillionaire who asked me if I'd help him build a new software company (he was one of the co-founders of the company I joined in 1997) and I said "yes"
  * Joined as the third employee and Director of IT, moved back to Atlanta
  * Set up my first (professional, non-IPX) network (wasn't pretty) then hired a network admin
  * Built out my first data center rack (you don't want to know what that looked like) then hired a data center operations manager
  * Kept learning new technology areas then hiring out of them so I could keep my focus on development
  * Built my first apps to massive scale handing hundreds of thousands of concurrent connections
  * Built my first mobile apps
  * Deployed my first app to the cloud for elastic scale
  * Implemented a fully automated DevOps pipeline including database upgrades, entirely based on a custom tool chain because we didn't have the software available today
  * Started my technology blog to and write about problems I was solving day-today
  * My very first technology-focused blog post was on March 24, 2009: [NHibernate and Complex Types for Native Keys](https://csharperimage.jeremylikness.com/2009/03/nhibernate-and-complex-types-for-native.html)
  * Wrote one of my most read posts of all time, which ironically was a very short tip on how to use `setTimeout` to avoid a DOM issue specific to Internet Explorer 6: [JQuery, IE6, and 'Could not set the selected property. Unspecified error.'](https://csharperimage.jeremylikness.com/2009/05/jquery-ie6-and-could-not-set-selected.html)
* **2009** Ended five years of startup mode and working 100 hours/week by making a major lifestyle change.
  * Left the company with no vested stock to join a work-from-home consulting firm
  * Turned my life around because my wife retired in 2006 and my daughter was home schooled so we suddenly had tons of quality time together
  * Helped build some of the first large scale apps on the Silverlight platform
  * Began my public speaking career in technology
  * Recorded my first video series
  * Wrote and contributed to four [technology books](https://amazon.com/author/jeremylikness)
* **2014** I really enjoyed consulting but wanted to take on new challenges, so I left the company without a specific plan in mind.
  * Created my personal mission statement to _empower developers to be their best_ and began the process of forming a new company with that goal in mind
  * A former colleague saw that I was "on the market" and asked if I'd join his company to help build a new application development consulting practice. This was aligned to my mission and given the existing company infrastructure would make it easier to hit the ground running, so I joined
  * Became Practice Lead and owned/grew a multi-million dollar practice
  * The company was known for their managed services, so I allocated budget for sponsoring, speaking, and blogging to build the application development brand and connect with the Atlanta-centric community
* **2017** this was when a single tweet would change my life. I read this:

{{<customtwitter 832706103343341569>}}

...and immediately thought to myself, "Good for him." I knew it a had to be a great role for him to make the switch, and I enjoyed watching the updates coming from the team with envy. I wasn't unhappy and wasn't looking, but a random email would change everything. A recruiter from Microsoft reached out, and after overcoming my initial shock ("Why are they interested in _me_?") I went on to interview and, well, here I am today, a [Cloud Developer Advocate](/blog/2017-10-01_what-is-a-cloud-developer-advocate/). What will the _next_ 25 years bring?

## Retrospective: Major Goals for 2019

Let's get into some more interesting goals and stats. For reference, [this was my 2018 post](/blog/2018-12-23_year-of.net-core-angular-and-web-api-design-2018-in-review).

How did I do with my goals for 2019? Here are my retrospective comments.

**The Goal:** _get back into a regular fitness routine and closer to my “fighting weight” of 200 pounds_

**The Result:** ⚠ mixed ... although I'm not closer to 200, I've managed to keep a regular training routine throughout the year. I was mostly jogging and doing bodyweight calisthenics in the summer and fall and shifted to more weight training in my home gym for the cold, dark winter months.

**The Goal:** _summit a mountain I haven’t been on before (sound familiar?)_

**The Result:** ✅ success! I successfully reached the summit of several new mountains, including:

🗻 [Heybrook Lookout](https://www.wta.org/go-hiking/hikes/heybrook-lookout) 1700' (518m)
{{<custominstagram BvlCihpHnUS>}}

🗻 [Dragon's Back (Hong Kong)](https://en.wikipedia.org/wiki/Dragon%27s_Back) 931' (284m)
{{<custominstagram BuIYh_vnHYd>}}

🗻 [Beckler Peak](https://www.wta.org/go-hiking/hikes/beckler-peak) 5026' (1532m)
{{<custominstagram B0b64tnplrA>}}

🗻 [Mount Pilchuck](https://www.wta.org/go-hiking/hikes/mount-pilchuck) 5327' (1624m)
{{<custominstagram B1l1XhdJ0UK>}}

🗻 [Mount Dickerman](https://www.wta.org/go-hiking/hikes/mount-dickerman) 5760' (1756m)
{{<custominstagram B5gkVgPJo2F>}}

**The Goal:** _ski for the first time in years_

**The Result:** ✔ tentative success ... as of this writing I plan to ski the last week in December.

**The Goal:** _speak to an audience of more than 1,000 (quantity doesn’t matter, but it’s a bucket list item that makes it easier to speak to larger audiences moving forward)_

**The Result:** ✅ success! I achieved this goal multiple times the past year, thanks to Microsoft Ignite | The Tour and an invitation to keynote CodeStock.

**The Goal:** _vacation with my wife in a place we haven’t been before_

**The Result:** ✅ success! We had an amazing mini-vacation in Oregon.

{{<custominstagram ByJjXkXJ-8M>}}

...then, we took a longer trip down to Baja Mexico.

{{<custominstagram B2fIsz-JVeZ>}}

**The Goal:** _increase my giving (not just dollars, but mentoring, community service, etc.)_

**The Result:** ⚠ I can still do more here.

In other news, my daughter graduated college with her Bachelor of Political Science at 19 years old (with an _awesome_ GPA).

Sadly, my brother-in-law was diagnosed with cancer and died within the year. Rest in peace, Steve!

{{<custominstagram BxX0CewpzyL>}}

## My Goals for 2020

Here are my goals for 2020:

* Advance my career (promotion? change roles? we'll see!)
* Travel less
* Continue to exercise consistently
* Summit at least four (4) new mountains
* Volunteer at my church

## Health Stats

Health is a goal of mine and it's a topic not discussed enough in technology. For that reason, I'm going to start including health statistics in my year end summaries. Not interested? [Jump to Open Source](#open-source).

Last year I engaged in 174 activities. I walked, ran, and hiked 242 miles and spent 109 hours in training. I climbed 27,999 feet (8534m) elevation during the year. I climbed between 260 - 820 flights of stairs each month and took between 178,767 and 255,979 steps per month. I average around 7 hours of sleep per night. I almost always average closer to 8 hours at home and less than 6 on the road.

My average resting heart rate ♥ was 48 beats per minute. I've always had a low heart rate and it slows when I train consistently. My most recent blood pressure reading was 117/79. My most recent cholesterol reading was 193 (44 HDL, 113 LDL). In spite of following a 100% plant-based (vegan) diet for five years, my levels of B12, iron, Vitamin D and Calcium all remain normal.

I have hypothyroidism and take medication to regulate my thyroid hormone levels.

In the past year I developed a tremor in my left arm. Initially it was just an issue of my hand shaking randomly, but more recently I've lost dexterity in that hand and have trouble articulating my fingers. The main negative impact is that my typing speed has slowed. I've seen seven different doctors who inspected my wrist, elbow, shoulder, and neck, including taking MRIs of my neck and head, and still have no diagnosis. The next step is a special scan to rule out Parkinson's disease. It will be interesting looking back at the end of next year to see how my quest to diagnose and treat this tremor unfolds.

Let's move onto technical insights.

## Open Source

I had more open source contributions in 2019 than 2018 and 2017.

![GitHub 2019 Activity](/blog/2019-year-in-review/images/github2019.png)
_GitHub contributions in 2019_

I continued to work with docs, but a major difference was the result a focus on making my presentations more "open source" and not just publish the source code but include "train the trainer" content to make it easier for other presenters to reuse my work. I 100% support forking my presentations and code to either present to a new audience "as is" or customize/personalize and save time getting a new presentation done. This is all part of my personal mission to empower developers, and one way to scale is by enabling other presenters. This is why I also wrote a 9-part [Comprehensive and Practical Guide to Technical Presentations](/series/comprehensive-and-practical-guide-to-technical-presentations/).

## Twitter in Review

My followers grew from 11,524 in 2018 to 13,102 this year. That's a 14% increase and about equal to my growth in 2018 (about 4 followers per day). Followers don't mean much if they are bots or don't read and engage with content, so my one Twitter-focused goal was to increase engagement.

**The Result:** ✅ success! I had a record year of engagement. I also hit a personal record with one million tweet impressions in a single month! This wouldn't have been possible without an engaged network willing to retweet content.

![July engagement](/blog/2019-year-in-review/images/twitterwin.jpg)
_Twitter stats for July 2019_

As always, the following stats are based on the last 90 days.

### Demographics

The interests of my followers shifted slightly from previous years. The top five interests include:

* Science news (98%, down from 99%)
* Technology (98%, down from 99%)
* Tech news (97%, down from 98%)
* _Dogs_ (96%, up from 92%) ... interesting (see what I did there?)
* Space and astronomy (96%, down from 99%)

Although the percentage is "down" it really means my followers have more diverse interests, so I see the change as a net positive.

![Twitter interests 2019](/blog/2019-year-in-review/images/twitterinterests.png)

_Twitter interests in 2019_

I'm also seeing a positive trend in the diversity of followers. The main stat I have to go on for this is the binary gender tracked by Twitter. In 2017 I had 13% female followers. That increased to 20% (1 in 5) in 2018 and for 2019 is at 24% or 1 in 4. I hope this reflects open, welcoming, and supportive content for everyone in my feed.

I gained more international followers this year as the percentage from the United States dropped from 41% to 38%. The top five counties following me in order outside of the U.S. are:

1. United Kingdom
2. India
3. Canada
4. France
5. Australia

There are a lot of other stats that I don't pay too much attention to as they are more geared to marketing than having engaged and empowered followers.

### Top Tweets

The most impressions for any tweet this year was a reference to a [Microsoft Learn](https://docs.microsoft.com/learn?WT.mc_id=endofyear2019-blog-jeliknes) module with a hands-on lab to build a real-time app.

{{<customtwitter 1135983820673572865>}}

My top mention (don't @ me!) was a post by [Christian Nwamba](https://www.twitter.com/codebeast) that featured a picture with [Anders Hejlsberg](https://twitter.com/ahejlsberg), the creator/co-creator of C#, TypeScript, Turbo Pascal and lead architect of Delphi.

{{<customtwitter 1125510635695951872>}}

Finally, the top "media tweet" was a post showing how to build, edit, view, design, and deploy Azure Logic Apps.

{{<customtwitter 1113495385283223554>}}

Although Twitter is an important way for me to connect with developers, my focus last year was on authoring more original content and not simply curating other articles.

## The Practical Developer: A New Place

Last year I joined a new community called [dev.to](https://dev.to/). It is an open source project and incredibly welcoming community with daily posts, discussion, polls, and more. I authored some original content and began syndicating articles there. After my initial post in April 2019, I had:

* 50,640 readers of content
* 1,741 reactions to content
* 47 comments
* 5,020 followers

I'll continue to post both original and syndicated content there in 2020.

## Developer for Life in Review

Last year was flagship year for my blog. Although I moved it (again), this time I preserved the domain and links so I have a consistent view of traffic. I ported it [from Medium to Hugo](/series/from-medium-to-hugo/) and wrote a series of posts about the migration. This allowed me to take full control over the site, code, and templates. I was able to build a CI/CD pipeline that allows me to edit posts in markdown then commit to my [GitHub repo](https://github.com/JeremyLikness/jeremylikness-blog) to publish. In addition to open sourcing my blog, I also implemented it as a [Progressive Web App (PWA)](/blog/implement-progressive-web-app-hugo/). Over the year I received 96,047 visitors over 123,961 sessions, about a 30% increase from the previous year. Countries were similar with a little more traffic incoming from Germany and the Netherlands compared to the past.

Almost three-quarters of incoming traffic is from organic search.

![Acquisition breakdown](/blog/2019-year-in-review/images/dev4lifeacquisition.png)

_Acquisition for Developer for Life in 2019_

7 out of the top 10 search terms driving traffic to my blog included the word [Blazor](/tags/blazor). Other popular terms were [Mongo DB](/tags/mongodb), [Docker](/tags/docker), and [Angular](/tags/angular).

The top three third party referrals came from:

1. [The Morning Brew](http://blog.cwa.me.uk)
2. The [ASP.NET](https://dotnet.microsoft.com/?WT.mc_id=endofyear2019-blog-jeliknes) "Community Spotlight"
3. My site listed as [a JAMStack example](https://jamstack.org/examples/)

Here are the top 10 pages. The data is slightly skewed because the links under _root_ (no `/blog` prefix) are redirects to preserve the original URLs from Medium.

![Top 10 Pages](/blog/2019-year-in-review/images/top10.png)

As you can see, popular topics included Angular on .NET Core and Blazor.

## Links and Click Data

I've been running a custom serverless link tracker for a few years now and use it to understand what followers and readers are interested in. For 2019 I analyzed just under 200,000 clicks (down about 9% from last year, but I'm also writing this earlier). A few notable data points:

![Redirects by medium](/blog/2019-year-in-review/images/redirectbymedium.png)
_Redirects in 2019 by medium_

Twitter continues to dominate the source of clicks. Compared to last year, I saw increases in activity from GitHub, my blog, LinkedIn, and Facebook. In fact, although Facebook barely registered last year, it accounted for 3.5% of traffic this year. I have a dedicated [Facebook page for Jeremy Likness](https://facebook.com/cdaJeremyLikness) that I post data to. (No, I'm not suddenly referring to myself in the 3rd person, that was for the search engines.)

The top five clicked links (aside from my blog homepage) last year were:

1. My example [Blazor Health app](https://blazorhealthapp.z5.web.core.windows.net/)
2. An comprehensive article [about WebAssembly](https://www.netguru.com/codestories/webassembly)
3. The official documentation to [use the Angular project template with ASP.NET Core](https://docs.microsoft.com/aspnet/core/client-side/spa/angular?WT.mc_id=endofyear2019-blog-jeliknes)
4. [F# in the Browser](https://tryfsharp.fsbolero.io) with WebAssembly and Bolero
5. An article about [debugging your .NET Core on Docker apps with Visual Studio Code](https://dev.to/azure/debugging-your-net-core-in-docker-applications-with-vs-code-3g5d)

The most popular ongoing source of links included the [Blazor-related articles](/tags/blazor) on my blog and my GitHub repo with [a hands-on Blazor walkthrough](https://github.com/JeremyLikness/blazor-wasm).

The top three sites I sent traffic to were:

1. [Microsoft official docs](https://docs.microsoft.com?WT.mc_id=endofyear2019-blog-jeliknes)
2. [Channel 9 Videos](https://channel9.msdn.com?WT.mc_id=endofyear2019-blog-jeliknes)
3. [Microsoft blogs](https://devblogs.microsoft.com/?WT.mc_id=endofyear2019-blog-jeliknes)

The top three clicked tweets based on my own link tracker were:

**One 1️⃣ 🥇**
{{<customtwitter 1080857460557168640>}}

**Two 2️⃣ 🥈**
{{<customtwitter 1171861975741194240>}}

**Three 3️⃣ 🥉**
{{<customtwitter 1103777412108701697>}}

17% of clicks were from mobile devices.

## Closing Thoughts

If there is one word that sums up 2019 for me, it's **Blazor**. Many .NET developers around the world are embracing this new platform. WebAssembly has officially broken JavaScript's browser monopoly and is empowering C, C++, C#, Go, Rust, TypeScript and other developers to build full stack experiences without having to leave the language of their choice. When I look back at the past three years, I see this trend:

* **2017** Docker and Serverless - package and scale your code
* **2018** .NET Core - build your code for any platform
* **2019** WebAssembly - target one platform that runs everywhere

I'm often asked what I think the "next big thing" will be. I believe that 2020 will be the year that WebAssembly and modern JavaScript truly shine. We'll see WebAssembly appearing in places outside of the browser and tooling evolve to embrace building experiences that need only target a single platform to run everywhere. Developers are closer than ever to building experiences for _every_ platform, including servers, laptops, tablets, mobile phones, gaming consoles, edge devices and web browsers, with the language and tools of their choice. What an exciting time!

See you in 2020.

![Jeremy Likness](/images/jeremylikness.gif)
