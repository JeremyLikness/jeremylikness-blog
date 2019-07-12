---
title: "Create an Article Preview in Hugo"
author: "Jeremy Likness"
date: 2019-07-12T11:08:28-07:00
years: "2019"
lastmod: 2019-07-12T11:08:28-07:00

draft: false
comments: true
toc: false

series: "From Medium to Hugo"
subtitle: "Generate thumbnails on the fly and pull page metadata for a proper preview."

description: "Generate a thumbnail for your Hugo posts on the fly, then create a custom short code that uses thumbnails and page data like title and description to embed a post preview to interlink documents."

tags:
 - Hugo
 - Static website 
 - Go

image: "/blog/create-article-preview-in-hugo/images/durabledungeonpreview.jpg" 
images:
 - "/blog/create-article-preview-in-hugo/images/durabledungeonpreview.jpg" 
---

One of my favorite Medium features is the ability to link any site and embed a preview with a thumbnail, title, and summary. For example, pasting a link to my _Durable Dungeon_ GitHub repo:

{{<github "JeremyLikness/DurableDungeon">}}

Generates a preview like this:

![Durable Dungeon Preview](/blog/create-article-preview-in-hugo/images/durabledungeonpreview.jpg)
<figcaption>Durable Dungeon Preview</figcaption>

I've since migrated to Hugo, so now what?

Hugo is extremely customizable and it is most likely possible to build the code to fetch a website and crawl metadata, but I decided to start with something a little more approachable and create previews for links internal to the blog. I know I can easily access the data through Hugo. The idea began when I implemented Google Search the first time. I noticed that some search results had thumbnails, but others didn't. Upon researching this I discovered you can provide a thumbnail as metadata for a web page:

{{<highlight HTML>}}
<meta name="thumbnail" content="thumbnail.jpg">
{{</highlight>}}

I always tag the main image for blog posts in my front matter using the `image` tag: 

{{<highlight YAML>}}
image: "/blog/myarticle/images/mainimage.jpg" 
images:
 - "/blog/myarticle/images/mainimage.jpg"
 - "/blog/myarticle/images/anotherimage.jpg" 
{{</highlight>}}

Instead of pointing to a full-size image, I wanted to create a true thumbnail. I spent some time reading the docs for [Hugo image processing](https://gohugo.io/content-management/image-processing/) and realized it wouldn't be difficult at all. Hugo will process images inline and provide a link for the generated image. They are also placed in a `resources` folder, so they can be checked into source control and do not have to be regenerated each time.

> **⭐ Tip**: Make sure you include your top-level `resources` folder in source control! I mistakenly included it my `.gitignore` and this was forcing Hugo to regenerate the images every time. Checking them in ensures they are only generated once and reused on subsequent passes. This makes the builds go faster and uses less storage.

The logic for my thumbnail generation looks like this, unrolled for visibility (in the template I have this in one line to save space in the generated content, but I also use the `--minify` option so that may be redundant). I removed redundant braces to make the logic easier to read but each statement is wrapped in double braces.

{{<highlight Go>}}
if .Params.image
    $original := print "images/" (path.Base .Params.image)
    $originalImg := .Resources.GetMatch $original
    if $originalImg 
        $thumbnailImg := $originalImg.Resize "90x"
        printf `<meta name="thumbnail" content="%s">`
            $thumbnailImg.RelPermalink | safeHTML
    end
end
{{</highlight>}}

I first check that I'm on a page with image metadata. If so, I construct a path to the images based on how they are stored in the resources collection for the page. I parse the page resources for a match. If I get a match, I resize to 90 pixels wide, extract the link and print the meta tag.

After building this functionality I realized I could create a short code to do a similar thing with relative page links. I created a short code named `relativelink.html`:

{{<highlight html>}}
{{$page := .Site.GetPage (.Get 0)}}
<div class="container alert alert-secondary">
    <div><a href="{{$page.RelPermalink}}" alt="{{$page.Title}}">
        <strong>{{ $page.Title }}</strong>
    </a></div>
    <div class="float-left m-2">
    {{ if $page.Params.image }}
        {{ $original := print "images/" (path.Base $page.Params.image) }}
        {{ $originalImg := $page.Resources.GetMatch $original }}
        {{ if $originalImg }}
            {{ $thumbnailImg := $originalImg.Fit "200x100" }}
            {{ printf `<img src="%s" alt="%s">` 
                $thumbnailImg.RelPermalink $page.Title | safeHTML }}
        {{end}}
    {{end}}
    </div>
    <p><small>{{$page.Description}}</small></p>
    <div class="clearfix"></div>
</div>
{{</highlight>}}

The `.Site.GetPage` allows me to fetch a page based on its URL. I then extract the title, image, and description to create my preview. The thumbnail generation produces a slightly wider image and constrains the height as well. The result is that this short code:

{{<highlight html>}}
{{</*relativelink "/blog/migrate-from-medium-to-hugo" */>}}
{{</highlight>}}

Generates this preview:

{{<relativelink "/blog/migrate-from-medium-to-hugo">}}

This is a lot more interesting than a plain hyperlink and makes it easy for me to interlink blog posts.

What are your thoughts?

Regards,

![Jeremy Likness](/images/jeremylikness.gif)
