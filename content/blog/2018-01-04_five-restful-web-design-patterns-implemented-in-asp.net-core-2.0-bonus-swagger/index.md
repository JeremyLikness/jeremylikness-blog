---
title: "Five RESTFul Web Design Patterns Implemented in ASP.NET Core 2.0 Bonus: Swagger"
author: "Jeremy Likness"
date: 2018-01-04T14:59:18.395Z
years: "2018"
lastmod: 2019-06-13T10:44:33-07:00
comments: true
series: "Five RESTFul Web Design Patterns Implemented in ASP.NET Core 2.0"

description: "Learn how to document your ASP. NET Core 2.0 Web API endpoints using the OpenAPI specification with Swagger tools like Swashbuckle."

subtitle: "Swashbuckle your API to OpenAPI goodness with a little Swagger"
tags:
 - API 
 - Swagger 
 - Openapi 
 - Api Development 
 -  .NET Core 

image: "/blog/2018-01-04_five-restful-web-design-patterns-implemented-in-asp.net-core-2.0-bonus-swagger/images/2.png" 
images:
 - "/blog/2018-01-04_five-restful-web-design-patterns-implemented-in-asp.net-core-2.0-bonus-swagger/images/1.png" 
 - "/blog/2018-01-04_five-restful-web-design-patterns-implemented-in-asp.net-core-2.0-bonus-swagger/images/2.png" 
 - "/blog/2018-01-04_five-restful-web-design-patterns-implemented-in-asp.net-core-2.0-bonus-swagger/images/3.png" 
 - "/blog/2018-01-04_five-restful-web-design-patterns-implemented-in-asp.net-core-2.0-bonus-swagger/images/4.png" 
 - "/blog/2018-01-04_five-restful-web-design-patterns-implemented-in-asp.net-core-2.0-bonus-swagger/images/5.png" 
 - "/blog/2018-01-04_five-restful-web-design-patterns-implemented-in-asp.net-core-2.0-bonus-swagger/images/6.png" 
 - "/blog/2018-01-04_five-restful-web-design-patterns-implemented-in-asp.net-core-2.0-bonus-swagger/images/7.gif" 


aliases:
    - "/5-rest-api-designs-in-dot-net-core-6-9e87cf562241"
---

Alas, all things must come to an end. This is it: the bonus round of this Web API design series on ASP. NET Core. In case you missed any of the previous artfully crafted stories in this series, I present the full list for easy navigation:

1. [Intro and Content Negotiation](/5-rest-api-designs-in-dot-net-core-1-29a8527e999c)
2. [HATEOAS](/5-rest-api-designs-in-dot-net-core-2-ad2f204c2d11)
3. [Exceptions](/5-rest-api-designs-in-dot-net-core-3-91ebff38393d)
4. [Concurrency](/5-rest-api-designs-in-dot-net-core-4-8ac863e961e4)
5. [Security](/5-rest-api-designs-in-dot-net-core-5-3ee2cf16713e)
6. Bonus (I told you we’d make it here eventually)

I believe an easy way to understand [Swagger](https://swagger.io/)is to begin with a little history. In the dim recesses of the past, back in the days when JavaScript was considered annoying and didn’t run on servers, and everyone believed that Extensible Markup Language (XML) would change the world, there existed a complicated protocol named the Simple Object Access Protocol, or [SOAP](https://www.w3.org/TR/soap12-part1/) for short. Although there really wasn’t anything simple about SOAP, it paired well with the Web Services Description Language, or [WSDL](https://www.w3.org/TR/wsdl20/) (we pronounce it _wizz-dull_).

The WSDL empowered tools to understand what SOAP services looked like, enabling what .NET developers refer to as the _right-click experience_. It works on all platforms (albeit, not by the same mechanism, as we know some people have those funny mouses with only one button): you simply point the right tool at the WSDL interface and it auto-generates the client code needed to connect to and interact with the service, including any data and models that are part of the definition. Pretty nifty!

![Presenting Exhibit A: discovery of the “Dilbert” service](/blog/2018-01-04_five-restful-web-design-patterns-implemented-in-asp.net-core-2.0-bonus-swagger/images/1.png)
<figcaption>Presenting Exhibit A: discovery of the “Dilbert” service</figcaption>

The rise of smartphones and open source software completely transformed the landscape of web services. I imagine the first mobile phone tried to parse the XML returned by a WSDL call and threw up it’s antennae in exasperation while crying, “Enough!” Every phone has a web browser, and that means every phone has the ability to make HTTP/HTTPS requests and run JavaScript. That made it a simple choice to move to REST. Mobile trumped everything and soon developers all over the world tossed XML to the curb and increased their cool factor by hanging out with JSON.

Unfortunately, unless REST is implemented with [HATEOAS](/5-rest-api-designs-in-dot-net-core-2-ad2f204c2d11), it doesn’t offer metadata or discovery services.

Enter the [OpenAPI](https://github.com/OAI/OpenAPI-Specification)specification. In a nutshell, and I quote directly from the repository:

> The OpenAPI Specification (OAS) defines a standard, programming language-agnostic interface description for [REST APIs](https://en.wikipedia.org/wiki/Representational_state_transfer), which allows both humans and computers to discover and understand the capabilities of a service without requiring access to source code, additional documentation, or inspection of network traffic. When properly defined via OpenAPI, a consumer can understand and interact with the remote service with a minimal amount of implementation logic. Similar to what interface descriptions have done for lower-level programming, the OpenAPI Specification removes guesswork in calling a service.

This is great, but what it doesn’t do is remove guesswork from implementing the specification itself. That’s when Swagger enters the picture:

> Swagger is the world’s largest framework of API developer tools for the OpenAPI Specification(OAS), enabling development across the entire API lifecycle, from design and documentation, to test and deployment.

So there you have it: OpenAPI is the _specification_, and Swagger is a set of tools that facilitate the _implementation_. The tools turn out to be quite powerful. I’ve found there are fundamentally two approaches to implementing the specification via the tools. The first, like Test-Driven Development (TDD), involves designing the API first. You use a site like [SwaggerHub](https://swaggerhub.com/) to design your API, include your data models, expected return values, potential exceptions, authentication definitions, and more. Then you use additional tools that read the specification (which, coincidentally, is in a JSON format) and generate boilerplate server-side and client-side code.

I’ll leave that experience for you to try out.

Then there’s the developers who write their code first and throw in tests as an afterthought. You can do the same thing with Swagger, only the analogy breaks down because it’s actually a valuable workflow to design your API in code and generate the specification dynamically. In other words, what I’m about to show is generally accepted in elite circles, whatever those might be. The good news is that it is incredibly easy to add these specifications to your legacy code.

You can dig into the specification yourself, but to summarize here are some simple pictures I created. I picked the color palette myself. Later I’ll show you the actual JSON and you will see the correlation between these images and the document. You might even slap your palm on your forehead and go, “Wow!”

![OpenAPI specification part 1](/blog/2018-01-04_five-restful-web-design-patterns-implemented-in-asp.net-core-2.0-bonus-swagger/images/2.png)
<figcaption>OpenAPI specification part 1</figcaption>

![OpenAPI specification part 2](/blog/2018-01-04_five-restful-web-design-patterns-implemented-in-asp.net-core-2.0-bonus-swagger/images/3.png)
<figcaption>OpenAPI specification part 2</figcaption>

![OpenAPI specification part 3](/blog/2018-01-04_five-restful-web-design-patterns-implemented-in-asp.net-core-2.0-bonus-swagger/images/4.png)
<figcaption>OpenAPI specification part 3</figcaption>

OK, enough talk. Let’s see some code! Starting with our simple <i class="fab fa-github"></i> [“todo” application](https://github.com/JeremyLikness/PASS-2017/tree/master/04-REST-Fundamentals/Src-TodoApi), first I add the Swagger tool for ASP. NET Core, <i class="fab fa-github"></i> [Swashbuckle](https://github.com/domaindrivendev/Swashbuckle.AspNetCore).

`dotnet add package Swashbuckle.AspNetCore`

Next, add a using statement at the top of the `Startup.cs` to bring in the new library:

`using Swashbuckle.AspNetCore.Swagger;`

Finally, add the generator to the services and configure the application to use Swagger and activate the Swagger UI (that will provide an interactive browser-based explorer).

{{<highlight CSharp>}}
public void ConfigureServices(IServiceCollection services)
{
    services.AddDbContext<TodoContext>(opt => opt.UseInMemoryDatabase("TodoList"));
    services.AddMvc();
    services.AddSwaggerGen(c =>
    {
        c.SwaggerDoc("v1", new Info { Title = "My API", Version = "v1" });
    });
}

public void Configure(IApplicationBuilder app)
{
    // Enable middleware to serve generated Swagger as a JSON endpoint.
    app.UseSwagger();

    // Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.), specifying the Swagger JSON endpoint.
    app.UseSwaggerUI(c =>
    {
      c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
    });
    app.UseMvc();
}
{{</highlight>}}

That’s really all there is to it! Running the application performs exactly as before, with a few exceptions. First, you can access the Swagger UI by navigating to `[http://localhost:5000/swagger](http://localhost:5000/swagger)`

![Such a pretty list of operations](/blog/2018-01-04_five-restful-web-design-patterns-implemented-in-asp.net-core-2.0-bonus-swagger/images/5.png)
<figcaption>Such a pretty list of operations</figcaption>

Not only do you get the list of API endpoints, you can expand individual ones and even test the API right from your browser! (Sorry, Postman).

![Look, I just fetched a “todo” item right from the browser!](/blog/2018-01-04_five-restful-web-design-patterns-implemented-in-asp.net-core-2.0-bonus-swagger/images/6.png)
<figcaption>Look, I just fetched a “todo” item right from the browser!</figcaption>

If you navigate to the definition endpoint: `[http://localhost:5000/swagger/v1/swagger.json](http://localhost:5000/swagger/v1/swagger.json)`

…you get the specification. This can be loaded to other Swagger tools that may then generate clients in multiple languages on various platforms. Pretty cool, no? Here’s what is generated by default from the “todo” app. Uh, yeah. It’s a bit wordy.

{{<highlight json>}}
{
    "swagger": "2.0",
    "info": {
        "version": "v1",
        "title": "My API"
    },
    "basePath": "/",
    "paths": {
        "/api/Todo": {
            "get": {
                "tags": [
                    "Todo"
                ],
                "operationId": "ApiTodoGet",
                "consumes": [],
                "produces": [
                    "text/plain",
                    "application/json",
                    "text/json"
                ],
                "responses": {
                    "200": {
                        "description": "Success",
                        "schema": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/TodoItem"
                            }
                        }
                    }
                }
            },
            "post": {
                "tags": [
                    "Todo"
                ],
                "operationId": "ApiTodoPost",
                "consumes": [
                    "application/json-patch+json",
                    "application/json",
                    "text/json",
                    "application/*+json"
                ],
                "produces": [],
                "parameters": [
                    {
                        "name": "item",
                        "in": "body",
                        "required": false,
                        "schema": {
                            "$ref": "#/definitions/TodoItem"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Success"
                    }
                }
            }
        },
        "/api/Todo/{id}": {
            "get": {
                "tags": [
                    "Todo"
                ],
                "operationId": "ApiTodoByIdGet",
                "consumes": [],
                "produces": [],
                "parameters": [
                    {
                        "name": "id",
                        "in": "path",
                        "required": true,
                        "type": "integer",
                        "format": "int64"
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Success"
                    }
                }
            },
            "put": {
                "tags": [
                    "Todo"
                ],
                "operationId": "ApiTodoByIdPut",
                "consumes": [
                    "application/json-patch+json",
                    "application/json",
                    "text/json",
                    "application/*+json"
                ],
                "produces": [],
                "parameters": [
                    {
                        "name": "id",
                        "in": "path",
                        "required": true,
                        "type": "integer",
                        "format": "int64"
                    },
                    {
                        "name": "item",
                        "in": "body",
                        "required": false,
                        "schema": {
                            "$ref": "#/definitions/TodoItem"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Success"
                    }
                }
            },
            "delete": {
                "tags": [
                    "Todo"
                ],
                "operationId": "ApiTodoByIdDelete",
                "consumes": [],
                "produces": [],
                "parameters": [
                    {
                        "name": "id",
                        "in": "path",
                        "required": true,
                        "type": "integer",
                        "format": "int64"
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Success"
                    }
                }
            }
        }
    },
    "definitions": {
        "TodoItem": {
            "type": "object",
            "properties": {
                "id": {
                    "format": "int64",
                    "type": "integer"
                },
                "name": {
                    "type": "string"
                },
                "isComplete": {
                    "type": "boolean"
                }
            }
        }
    },
    "securityDefinitions": {}
}
{{</highlight>}}

You can enhance your API definitions by providing attributes that describe more information such as additional response codes, and you can edit the auto-generated definition to improve its fidelity. Either way, I think you’ll agree that Swagger is a great way to document your REST APIs and make them easier to discover and consume by clients. If “clients” means internal applications, you can simply turn off the Swagger definition in production and use it during development.

And that, as they say, is a wrap.

In case you didn’t catch the rest of the series, here’s your easy navigation:

1. [Intro and Content Negotiation](/5-rest-api-designs-in-dot-net-core-1-29a8527e999c)
2. [HATEOAS](/5-rest-api-designs-in-dot-net-core-2-ad2f204c2d11)
3. [Exceptions](/5-rest-api-designs-in-dot-net-core-3-91ebff38393d)
4. [Concurrency](https://medium.com/@jeremylikness/5-rest-api-designs-in-dot-net-core-4-8ac863e961e4)
5. [Security](/5-rest-api-designs-in-dot-net-core-5-3ee2cf16713e)
6. Bonus (what do you expect? This is it — there is no more!)

Regards,

![Jeremy Likness](/blog/2018-01-04_five-restful-web-design-patterns-implemented-in-asp.net-core-2.0-bonus-swagger/images/7.gif)
