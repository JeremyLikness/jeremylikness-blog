---
title: "MongoDB on Windows in Minutes with Docker"
author: "Jeremy Likness"
date: 2018-12-27T17:54:30.939Z
years: "2018"
lastmod: 2019-06-13T10:45:22-07:00
comments: true

description: "Learn how to quickly and easily get up and running with MongoDB on your local machine using Docker and persisted volumes. Includes how to set up authentication."

subtitle: "A fast, easy way to get up and running with NoSQL on your local machine."
tags:
 - Docker 
 - Mongodb 
 - NoSQL 
 - Cosmosdb 
 - Windows 

image: "/blog/2018-12-27_mongodb-on-windows-in-minutes-with-docker/images/2.png" 
images:
 - "/blog/2018-12-27_mongodb-on-windows-in-minutes-with-docker/images/1.png" 
 - "/blog/2018-12-27_mongodb-on-windows-in-minutes-with-docker/images/2.png" 
 - "/blog/2018-12-27_mongodb-on-windows-in-minutes-with-docker/images/3.png" 
 - "/blog/2018-12-27_mongodb-on-windows-in-minutes-with-docker/images/4.gif" 


aliases:
    - "/mongodb-on-windows-in-minutes-with-docker-3e412f076762"
---

Recently, I was working on a demo for an upcoming series of talks that required a (preferably local) instance of [MongoDB](https://www.mongodb.com/). If you aren’t familiar with MongoDB, it’s a very popular and mature document database. The API for MongoDB is supported by [Azure Cosmos DB](https://azure.microsoft.com/en-us/services/cosmos-db/?utm_source=jeliknes&utm_medium=blog&utm_campaign=medium&WT.mc_id=medium-blog-jeliknes) and the demo illustrates how to migrate from a local instance of MongoDB for development purposes to a cloud-based production instance of Cosmos DB. There was just one catch: I had no desire to install MongoDB on my Windows 10 machine!

> **Note**: although I’m focusing on Windows-based steps, the same steps should work fine on macOS and Linux.

Fortunately, this is precisely the type of scenario [Docker](https://www.docker.com/) was designed to address. Using containers, you can quickly get up and running with any number of predefined images and services. Mongo maintains a set of official Docker images.

![Official Mongo Docker Image](/blog/2018-12-27_mongodb-on-windows-in-minutes-with-docker/images/1.png)

I assume you have Docker installed and are using Linux (not Windows) containers. I am running a Windows-specific version of desktop for community.

![Docker desktop dialog](/blog/2018-12-27_mongodb-on-windows-in-minutes-with-docker/images/2.png)

Now that the prerequisites are out of the way, there are two steps to getting MongoDB up and running. First, create a volume to persist data between runs. If you skip this step, any changes you make will disappear when the container stops running.

`docker volume create --name=mongodata`

The name can be anything you like. The next step will pull the database image if it doesn’t already exist, then launch a running instance using the mounted volume.

`docker run --name mongodb -v mongodata:/data/db -d -p 27017:27017 mongo`

You can give the running container any name you like. The first time may feel like `npm install` as multiple layers are downloaded, but subsequent runs should go quite fast.

That’s it. You’re done. You have a fully functional version of MongoDB running on your machine! (Here’s mine running, mapped to a different port).

![Screenshot of Docker process list](/blog/2018-12-27_mongodb-on-windows-in-minutes-with-docker/images/3.png)

Of course, you probably want to tweak it a bit. By default, it’s running without authentication. To set up authentication, you need to create a login and then restart the service with the “authentication” switch.

First, log into the running (non-authenticated) version.

`winpty docker exec -it mongodb bash`

(`winpty` is needed from a typical Windows command line. You can omit it to run from other terminals. There is nothing special about `mongodb` other than it’s the name I gave the container in the previous step).

Open the MongoDB terminal:

`mongo`

Let’s assume your database is called “mydatabase” and you want to set up a user named “myuser” with password “secret”. These two steps will take care of it for you (the database does _not_ have to exist yet):

`use mydatabase`

`db.createUser({user:"myuser", pwd:"secret", roles:[{role:"readWrite", db: "mydatabase"}]});`

After that, you can exit out of the MongoDB terminal and the bash shell that’s running. Next, stop and remove the existing instance and launch a new one with authentication active:

`docker stop mongodb`

`docker rm mongodb`

`docker run --name mongodb -v mongodata:/data/db -d -p 27017:27017 mongo --auth`

Now you can authenticate with the connection string:

`mongodb://myuser:secret@localhost:27017/mydatabase`

That’s it! Hopefully this simple set of steps is helpful for you to get up and running with MongoDB on your machine.

Regards,

![Jeremy Likness](/blog/2018-12-27_mongodb-on-windows-in-minutes-with-docker/images/4.gif)
