---
title: "{{ replace .Name "-" " " | title }}"
author: "Jeremy Likness"
date: {{ .Date }}
years: "{{ .Date.Format "2014"}}"
lastmod: {{ .Date }}

draft: true
comments: false
toc: false

subtitle: "The very first technical presentation I gave was in the mid-nineties for a supply chain management company. Prior to that presentation my…"

description: ""

tags:
 - Azure 
 - Technology 

image: "/blog/{{.Date.Format "2014-09-01"}}_{{.Name}}/images/1.png" 
images:
 - "/blog/{{.Date.Format "2014-09-01"}}_{{.Name}}/images/1.png" 
---