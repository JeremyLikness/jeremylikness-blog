---
title: "Vanilla.js — Getting Started"
author: "Jeremy Likness"
date: 2019-04-09T23:23:09.674Z
lastmod: 2019-06-13T10:45:41-07:00

description: "Build a fully functional dynamic and interactive web app that loads data from a Web API using nothing but pure HTML, CSS, and JavaScript."

subtitle: "Build web code with a zero-footprint web framework"
tags:
 - JavaScript 
 - Vanillajs 
 - Angular 
 - React 
 - Vuejs 

image: "/blog/2019-04-09_vanilla.jsgetting-started/images/1.png" 
images:
 - "/blog/2019-04-09_vanilla.jsgetting-started/images/1.png" 
 - "/blog/2019-04-09_vanilla.jsgetting-started/images/2.png" 
 - "/blog/2019-04-09_vanilla.jsgetting-started/images/3.gif" 
 - "/blog/2019-04-09_vanilla.jsgetting-started/images/4.gif" 
 - "/blog/2019-04-09_vanilla.jsgetting-started/images/5.gif" 


aliases:
    - "/vanilla-js-getting-started-5df2553df0f0"
---

#### Build web code with a zero-footprint web framework

Welcome to Vanilla.js, a zero-footprint framework powered by JavaScript! Vanilla.js helps you build modern applications for the web, mobile, or desktop.




![image](/blog/2019-04-09_vanilla.jsgetting-started/images/1.png)

Wait, WHAT?! No LIBRARY or FRAMEWORK? Are you KIDDING me?!



This guide shows you how to build and run a simple Vanilla.js app. You’ll use a text editor to develop your app and use the JavaScript language features that benefit _every_ Vanilla.js project.

This guide takes less than 10 minutes to complete. At the end of this guide — as part of final code review — there is a link to see the final application code. (If you don’t execute the steps in this guide, you can still access the final application code.)

### Prerequisites

Before you begin, make sure your development environment includes a text editor (your choice) and a web browser (again, your choice).

### JavaScript Engine

Vanilla.js requires a browser that runs JavaScript. Oh, wait, that’s _every modern browser_! (You should be good to go).

### Package Manager and Build Tools

Vanilla.js depends on _no_ packages and requires _zero_ build tools.

This Quick Start uses a simple text editor of your choice that should already exist on your system. If not, provided you have the browser requirement you can alternatively use [jsFiddle](https://jsfiddle.net). You might get a little spoiled with how easy it is.

To check that you have the Vanilla.js client installed, open your browser, launch your developer tools (typically accessible via `F12`), type `console.info(&#34;OK&#34;)` followed by `ENTER` and verify that you see `OK` echoed back.




![image](/blog/2019-04-09_vanilla.jsgetting-started/images/2.png)

Success!



### Step 1: Create an HTML File and Begin Editing

You will use your favorite text editor to create web pages and perform a variety of ongoing development tasks such as testing, bundling, and deployment.

Here’s some sample HTML to get you started:




Here’s some CSS. We need it so the application looks pretty. What the CSS actually does or how it was constructed is one of the great mysteries of modern web development.




You can include the CSS inside a `&lt;style&gt;&lt;/style&gt;` opening and closing tag, or save it in a file named `style.css` and include with this special line of code in the `head` section of your HTML document:

`&lt;link rel=&#34;stylesheet&#34; type=&#34;text/css&#34; href=&#34;style.css&#34;&gt;`

### Step 2: Create the initial application

You develop apps in the context of your text editor. Your file system contains the files for one or more pages.

To create the initial application, either make a file named `app.js` and reference it in the body of your page like this:

`&lt;script src=&#34;./app.js&#34;&gt;&lt;/script&gt;`

Or paste the code inside a `&lt;script&gt;&lt;/script&gt;` block. Here is the initial application code:




Yes, it’s a very simple application right now.

### Step 3: Serve the Application

On most systems you can simply double-click or tap on the `index.html` file and it will open in your browser and run. If you need a web server, that’s when you start doing crazy things like installing third-party tools. Sure, it’s possible.

Assuming you already have [node.js](https://nodejs.org/) configured on your system (and its partner-in-crime, `npm`), you can install a simple web server like this:

`npm install http-server -g`

After that, run it from the directory your files are stored in by typing:

`http-server .`

Then you can navigate to your file at [http://localhost:8080/index.html.](http://localhost:8080/index.html.)

Your app will greet you with a button that transforms when clicked:




![image](/blog/2019-04-09_vanilla.jsgetting-started/images/3.gif)



### Step 4: Create a Fully Functional RSS-Style Reader with Dynamic Collapsible Posts and Geo-Encoded User Information that Reveals on Hover

Really, it’s not as much work as it sounds. For data, we’ll make a live call to the sample information provided by “[JSON Placeholder](https://jsonplaceholder.typicode.com/).” There are several data sets, but we’ll just look at “[posts](https://jsonplaceholder.typicode.com/posts)” and “[users](https://jsonplaceholder.typicode.com/users)”.

What library or framework should we use to grab the data?

Did you know that JavaScript has a handy, built-in [fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)? Here’s generic code that will fetch data from our endpoint and store it on an object named `model`. For example, “users” will end up as an array you can reference via `model.users`. Notice it takes a callback that is executed when the loading is complete.




Next, we can rewrite the main app code to take advantage of this. Overwrite whatever was there, paste in the `get` method listed above, and add this:




The code grabs posts, then users, then maps the users by id on `userIdx` to make them easier to reference. Don’t try to run the code yet! A few things are missing. There is a `Wrapper` class that eventually will help us dynamically generate HTML elements, and a `renderPost` function that, well, renders each post. It looks like we’re on the hook to build these. Let’s create the `Wrapper`.




It’s a bit of code, but all very straightforward. Oh, and the great thing about classes is that they’re reusable, so we’ll only ever have to write it once. Here’s a quick tour of methods:

*   **Constructor —**generates an element and populates it with text. Also conditionally sets it to invisible or visible and wires up a toggle to make it easy to hide/show the element.
*   **Click —**wrapper to add a “click” listener and call a method.
*   **Show Selectable —**simply sets the style so the cursor turns into a hand indicating an action can be performed.
*   **Add Class —**is this the appropriate place to point out that most of the method names are self-documenting?
*   **Toggle Display —**ahem.
*   **Append Child —** nests an element inside the parent.
*   **Create Child —**a quick way to create and append a child.
*   **Generate —**generates a new instance so you don’t have to call `new` all the time.> **A few notes.** First, I didn’t trick you into using [TypeScript](https://blog.jeremylikness.com/typescript-for-javascript-developers-by-refactoring-part-1-of-2-1c3f97115b1f). All of this is valid, modern JavaScript. Second, there is a reason the methods all `return this`. No, not **this** that you’re reading, but the `Wrapper` itself. That’s because it makes it possible to chain function calls for a more fluent API. We’ll see more of that in a second.

Modern JavaScript not only supports classes, but classical inheritance (cough, I couldn’t resist) as well. We can leverage that to make it easier to generate anchor tags.




Now we can tie it all together. We already fetched the posts and users; we just need to use our handy helper classes to render it. Without further ado …




The code fluently generates the template, wiring in place everything needed for the dynamic interactions. Let’s look at the finished app.




![image](/blog/2019-04-09_vanilla.jsgetting-started/images/4.gif)

The final application



(Clicking on the location links will take you to an online map … you may find the destinations from the sample data to be quite interesting).

### Final code review

You can [browse the working example](https://jsfiddle.net/jeremylikness/q1tvzdrn/) of the app that you created in this Getting Started guide.
> **Tip**: jsFiddle is a great place to experiment with Vanilla.js.

_“But, wait! What if the browsers I’m targeting don’t support the latest JavaScript (ECMAScript 6)?”_

If it were me, I’d just rename that `.js` file to have a `.ts` extension and compile it to ES5.

### Next steps

Now that you’ve seen the essentials of a Vanilla.js app and your favorite text editor, continue with these other deep thoughts:

*   Do you _really_ need a JavaScript framework?
*   If you’re a long time JavaScript developer, were you aware of the power of the latest language implementations?
*   Isn’t `fetch` so much easier than (if not quite as fun as)`XmlHttpRequest`?

After reading this, you’ll be ready to continue exploring Vanilla.js on your own through the other guides and references available on the Internet, focusing on the features most important for your apps.

_“But wait — what if I have to support legacy browsers?”_

Read this!

[Convert Modern JavaScript to Legacy (ECMAScript 5) in Minutes](https://blog.jeremylikness.com/convert-modern-javascript-to-legacy-ecmascript-5-in-minutes-464b3d75f01f)


Regards,




![image](/blog/2019-04-09_vanilla.jsgetting-started/images/5.gif)
