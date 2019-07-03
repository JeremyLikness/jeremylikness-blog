---
title: "{{ replace .Name "-" " " | title }}"
author: "Jeremy Likness"
date: {{ .Date }}
years: "{{ now.Year }}"
lastmod: {{ .Date }}

draft: true
comments: true
toc: false

subtitle: "The very first technical presentation I gave was in the mid-nineties for a supply chain management company. Prior to that presentation my…"

description: "There will be blood."

tags:
 - Azure 
 - Technology 

image: "/blog/{{.Name}}/images/1.png" 
images:
 - "/blog/{{.Name}}/images/1.png" 
---