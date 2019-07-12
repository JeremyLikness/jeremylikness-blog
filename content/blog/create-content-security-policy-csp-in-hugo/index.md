---
title: "Create a Content Security Policy (CSP) in Hugo"
author: "Jeremy Likness"
date: 2019-07-12T00:21:55-07:00
years: "2019"
lastmod: 2019-07-12T00:21:55-07:00

draft: false
comments: true
toc: false

subtitle: "A configurable approach based on least privilege."

description: "A Content Security Policy (CSP) helps prevent a variety of attacks on your site. This article describes how to implement one for a static website when you don't control the headers."

tags:
 - Hugo 
 - Content Security Policy
 - CSP
 - XSS
 - Security

series: "From Medium to Hugo"

image: "/blog/create-content-security-policy-csp-in-hugo/images/cspviolation.jpg" 
images:
 - "/blog/create-content-security-policy-csp-in-hugo/images/cspviolation.jpg" 
---

A [Content Security Policy (CSP)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) helps prevent attacks like Cross Site Scripting (XSS) and data-injection. A typical attack can occur when you include JavaScript from a third-party site. If the JavaScript from `trusteddomain.com` is somehow compromised, the script may be altered to load data from (or send data to) `untrusteddomain.com`. A CSP will prevent that by explicitly blocking actions from domains you don't trust.

Below is an example of a violation that I captured from my console. I trust Google to serve ads, but don't allow `eval` to run (this allows dynamic code from strings to be evaluated and executed, as opposed to static code that is included in files). Certain ads try to use this feature and are stopped cold by the CSP. If all ads tried to do this, I would simply remove them altogether or switch to another provider.

![CSP violation](/blog/create-content-security-policy-csp-in-hugo/images/cspviolation.jpg)
<figcaption>CSP violation</figcaption>

The typical way to implement a CSP is by serving an HTTP header named `Content-Security-Policy`. Most web servers can be configured to provide this, and some static hosting services like [Netlify](https://www.netlify.com) allow you to specify a special file that is parsed to include custom headers. If these options aren't available, you can implement your CSP with a meta tag. This is the CSP policy for my blog as of this writing.

{{<highlight HTML>}}
<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests; block-all-mixed-content; default-src 'self'; child-src 'self'; font-src 'self' https://use.fontawesome.com https://fonts.gstatic.com https://public.slidesharecdn.com disqus.com disquscdn.com *.disqus.com *.disquscdn.com; form-action 'self' https://syndication.twitter.com/ https://platform.twitter.com disqus.com disquscdn.com *.disqus.com *.disquscdn.com; frame-src 'self' https://cse.google.com https://player.vimeo.com www.youtube.com www.youtube-nocookie.com https://platform.twitter.com https://syndication.twitter.com jsfiddle.net www.instagram.com https://kuula.co https://www.slideshare.net https://www.google.com https://googleads.g.doubleclick.net disqus.com disquscdn.com *.disqus.com *.disquscdn.com; img-src 'self' https://jeremylikness.visualstudio.com https://www.google-analytics.com https://stats.g.doubleclick.net https://pagead2.googlesyndication.com *.google.com *.gstatic.com *.amazon-adsystem.com https://www.googleapis.com https://images-na.ssl-images-amazon.com https://platform.twitter.com *.twimg.com https://syndication.twitter.com data: https://files.kuula.io disqus.com disquscdn.com *.disqus.com *.disquscdn.com; object-src 'none'; style-src 'self' 'unsafe-inline' https://use.fontawesome.com https://fonts.googleapis.com https://www.google.com https://platform.twitter.com *.twimg.com disqus.com disquscdn.com *.disqus.com *.disquscdn.com; script-src 'self' 'unsafe-inline' https://platform.twitter.com https://cdn.syndication.twimg.com *.amazon-adsystem.com https://www.google-analytics.com cse.google.com https://www.google.com https://pagead2.googlesyndication.com https://adservice.google.com https://www.googletagservices.com jsfiddle.net www.instagram.com disqus.com disquscdn.com *.disqus.com *.disquscdn.com;">
{{</highlight>}}

As you can see, there is a lot of content. I initially tried to maintain it by hand, but that quickly became unwieldy. So, I decided on a different approach: configuration. In my `config.toml` for the site I added a special section for my CSP.

{{<highlight TOML>}}
[params.csp]
  childsrc = ["'self'"]
  fontsrc = ["'self'"]
  formaction = ["'self'"]
  framesrc = ["'self'"]
  imgsrc = ["'self'"]
  objectsrc = ["'none'"]
  stylesrc = ["'self'"]
  scriptsrc = ["'self'"]
{{</highlight>}}

This is what I started with and almost nothing worked because I rely on content front third-party sites (for example, I need access to <i class="fab fa-twitter"></i> Twitter if I want to embed tweets).

First, let's break down the categories:

* **child-src** configures behavior for web workers and nested scripts (i.e. in an `iframe` tag)
* **font-src** configures where fonts can be loaded from
* **form-action** restricts where form data can be submitted to
* **frame-src** configures what domains can serve content to `iframe` tags
* **img-src** configures image sources
* **object-src** configures plug-ins
* **style-src**  configures stylesheets
* **script-src** configures JavaScript behavior

The value `none` prohibits anything from happening. I won't allow plug-ins anywhere on my site. The value `self` only allows resources to be served from the domain the CSP is hosted on. After turning on the CSP, you have a few options to monitor it. Exceptions will display in the console. You can also configure a [Reporting Endpoint](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/report-to) that instructs the browser to send information to an HTTPS endpoint. This is useful for gathering and tracking information from your deployed website.

I simply accessed various pages and corrected violations as they appeared. For example, to embed YouTube videos I need to allow `frame-src` access to the _youtube.com_ or _youtube-nocookie.com_ domains (the latter allows me to show videos without tracking your user data). I use Disqus for comments and that requires script, form, and other access. Eventually I built up a list of domains. Here's the full list for JavaScript:

{{<highlight toml>}}
[params.csp]
  scriptsrc = ["'self'",
    "'unsafe-inline'",
    "https://platform.twitter.com",
    "https://cdn.syndication.twimg.com",
    "*.amazon-adsystem.com",
    "https://www.google-analytics.com",
    "cse.google.com",
    "https://www.google.com",
    "https://pagead2.googlesyndication.com",
    "https://adservice.google.com",
    "https://www.googletagservices.com",
    "jsfiddle.net",
    "www.instagram.com",
    "disqus.com",
    "disquscdn.com",
    "*.disqus.com",
    "*.disquscdn.com"]

{{</highlight>}}

The `unsafe-inline` allows using JavaScript embedded in `<script>` tags (as opposed to being loaded from external files). The fact that I _don't_ include `unsafe-eval` means no execution of JavaScript from dynamic strings is allowed. An alternative to `unsafe-inline` is to use a special `sha256-hash` approach. The violation will show a hash for the inline script, then you can add that hash to the CSP and as long as the inline script doesn't change, it will be allowed.

To render the CSP from the configuration file, I created a partial template under `/partials/shared` named `CSP.html`. The code looks like this:

{{<highlight Go>}}
printf `<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests; block-all-mixed-content; default-src 'self'; ...` 
{{</highlight>}}

This is the first part. I upgrade any HTTP requests to HTTPS, so if a third-party vendor tries to fetch something without SSL it is automatically translated to a secure request. Although redundant, I'm also clear I don't support mixed content (HTTP and HTTPS in the same page). By default, any item can be served from my domain. The individual policies are printed inline like this:

{{<highlight Go>}}
printf `... child-src %s; font-src %s ...`
    (delimit .Site.Params.csp.childsrc " ")
    (delimit .Site.Params.csp.fontsrc " ")
    | safeHTML
{{</highlight>}}

The `%s` is a placeholder. For each policy, I take the list from the configuration (`.Site.Params.csp`) and collapse it into a string using a space as the delimiter. This turns `["'self'", "'unsafe-inline'", "www.google.com"]` into `"'self' 'unsafe-inline' www.google.com"`. By default, the generated string is HTML encoded. The `| safeHTML` indicates that I trust the HTML and it doesn't have to be encoded/escaped before rendering. 

The last step was to include the partial template at the top of my header. In `partials/_shared` I added it to the top:

{{<highlight HTML>}}
<head>
	<meta charset="utf-8">
	{{ partialCached "_shared/csp.html" . }}
{{</highlight>}}

I use `partialCached` to speed up rendering. It only must be evaluated once for the entire site, then every page is generated with it.

Now whenever I need to make a change, I simply tweak the configuration and I'm done. With a CSP in place, I feel a little more secure, and you should, too.

Regards,

![Jeremy Likness](/images/jeremylikness.gif)
