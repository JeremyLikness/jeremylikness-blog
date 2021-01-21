---
title: "Introduction to Cloud Storage for Developers"
author: "Jeremy Likness"
date: 2018-12-12T21:36:29.418Z
years: "2018"
lastmod: 2019-06-13T10:45:18-07:00
comments: false
canonicalUrl: "https://dev.to/azure/introduction-to-cloud-storage-for-developers-2hig"
toc: true

description: "For certain types of data there is an option that can provide incredible benefits at a relatively low cost. Cloud storage is often orders of magnitude less expensive than managed databases and can accommodate a variety of application architectures."

subtitle: "A look at cloud storage and how developers can use it."
tags:
 - Cloud 
 - Storage 
 - Azure 
 
image: "/blog/2018-12-12_introduction-to-cloud-storage-for-developers/images/azurestorage.png" 
images:
 - "/blog/2018-12-12_introduction-to-cloud-storage-for-developers/images/azurestorage.png" 
 - "/blog/2018-12-12_introduction-to-cloud-storage-for-developers/images/storagemetrics.png"

---

Most developers immediately think of databases as the solution when presented with the challenge of where to store application data. Relational (SQL) and non-relational, document-based (NoSQL) databases are proven solutions in the enterprise. For certain types of data, however, there is another option that can provide incredible benefits at a relatively low cost. Cloud storage is often orders of magnitude less expensive than managed databases and can accommodate a variety of application architectures.

![Azure storage options](/blog/2018-12-12_introduction-to-cloud-storage-for-developers/images/azurestorage.png)
<figcaption>Azure storage options</figcaption>

All major cloud providers have storage services available, and most of the features are similar. For this article, we'll focus on Azure storage because it's inexpensive, easy to get started and what I know best. You can also [get a free Azure account](https://azure.microsoft.com/en-us/free/?utm_source=jeliknes&utm_medium=devto&utm_campaign=azurestorage&WT.mc_id=azurestorage-devto-jeliknes) to follow along and learn how to use cloud storage for your own apps.

## Introduction to Azure Storage

Azure Storage is a cloud-based storage service. You can read the full documentation here: [Azure Storage Documentation](https://docs.microsoft.com/en-us/azure/storage/?utm_source=jeliknes&utm_medium=devto&utm_campaign=azurestorage&WT.mc_id=azurestorage-devto-jeliknes). Azure cloud storage accounts are designed to be:

1. Durable and available
2. Highly secure
3. Scalable to meet your demands
4. Fully managed 
5. Accessible from any platform or language

To get started with storage you create a storage account. 

## The Storage Account 

The storage account is the umbrella over various resources that are available to you. Think of it as a unit of scale for your resources. You determine the strategy for resiliency at the account level (i.e. whether data is stored locally or automatically replicated to regions that are far away to provide availability when a data center goes down). An account provides various resources, including:

* **Blob storage**: storage for unstructured data including documents, images, and videos 
* **File storage**: cloud-based file system that is Server Message Block (SMB) compatible and can be mounted on Windows, Linux, and macOS systems
* **Queue storage**: message storage that can handle millions of messages and supports peek (look at a message without removing it from the queue) and pop (look at a message and delete it from the queue to prevent other clients from accessing it) operations

These storage resources provide solutions for scenarios ranging from:

* Storing and retrieving files, documents, and videos for your applications 
* Maintaining version history for important documents 
* Enforcing immutability of documents (for example, documents related to legal cases that must not be modified or removed) 
* Hosting static web pages 
* Hosting legacy applications in the cloud that were designed to interact with local file systems
* Providing shared folders that contain common resources and tools for developers
* Handling messaging between applications at scale

The storage account is also where you determine the level of replication for your application. Each level is a trade-off between higher cost for higher availability and improved resiliency. The storage replication options available include:

* **Locally redundant (LRS)** with 99.9999999% (11 9's) availability spread across local replicas. Loss of the data center means loss of data.
* **Zone redundant (ZRS)** with 12 9's availability with multiple clusters in a region. Protects against data loss when a data center goes down but not if an entire region goes down.
* **Geo-redundant (GRS)** with 16 9's availability and a secondary region hundreds of miles away from the primary region. This is the highest availability for the highest cost. 

Confused or concerned about cost? Azure provides a [pricing calculator](https://azure.microsoft.com/en-us/pricing/calculator/?utm_source=jeliknes&utm_medium=devto&utm_campaign=azurestorage&WT.mc_id=azurestorage-devto-jeliknes) you can use to estimate the monthly cost of your account.

To see a practical "real world" example (I use a storage account to run a [link shortener](https://github.com/JeremyLikness/serverless-url-shortener?utm_source=jeliknes&utm_medium=devto&utm_campaign=azurestorage&WT.mc_id=azurestorage-devto-jeliknes) take a look at [this tweet](https://twitter.com/jeremylikness/status/1072534557193310209)

{{<customtwitter 1072534557193310209>}}

If you're ready to get started, here is a [quickstart: create an Azure storage account](https://docs.microsoft.com/en-us/azure/storage/common/storage-account-create?tabs=portal&utm_source=jeliknes&utm_medium=devto&utm_campaign=azurestorage&WT.mc_id=azurestorage-devto-jeliknes). I recommend creating a `V2` account.

## Blob Storage

Blob is an acronym for **B**inary **L**arge **OB**ject. Blob storage is designed to handle small to massive amounts of unstructured data. Examples of unstructured data include:

* Images or documents that can potentially be served directly to a browser
* Files that require distributed access
* Video and audio for streaming
* Log files
* Backup and restore (disaster recovery and/or archival) 
* Data to be used for later analysis

In Azure, blob storage is organized into *containers* that are like folders. You can control security parameters at a container level, along with default behaviors.

For example, in my storage account I created a `presentations` container that is publicly accessible. [This link](https://jlikme.blob.core.windows.net/presentations/lap-around-storage.pptx?utm_source=jeliknes&utm_medium=devto&utm_campaign=azurestorage&WT.mc_id=azurestorage-devto-jeliknes) will download the full slide deck (in PowerPoint format) of a storage presentation I uploaded to the container. I recommend you check it out because it's the presentation I based this article on.

There are three primary types of blob storage:

* **Block** blobs are for storing text or binary data up to several terabytes in size 
* **Append** blobs are optimized for append operations, i.e. writing out logs 
* **Page** blobs are used internally by Azure for disks

Blob storage gives you flexibility and control over how you store your data. There are three *access tiers* you can choose from by setting defaults or overriding when you store the blob:

* **Hot** storage is for frequently accessed data. It costs the most to store, but the least to access the data. Data frequently written to and/or read from will go here.
* **Cold** storage is for less frequently accessed data. It costs the least to store but the most to access the data. For example, preparing a large amount of data for later processing would be a candidate for this tier.
* **Archive** storage is intended for documents that must be preserved but are infrequently accessed. It is the lowest cost option to store data, but costs the most to access. Access is achieved by switching from **archive** to **hot** or **cold** storage and can take up to 15 hours to process. Medical records and tax documents are two examples that make sense for the archive tier.

You can further refine how blob storage works with access and storage policies. For example, you can specify that when blobs are overwritten, a copy of the older version is always kept. You can lock blobs to prevent modifications by other clients while you are updating them, and even place them on legal hold to prevent any changes for documents related to an ongoing case.

Azure storage comes with a Software Development Kit (SDK) that makes it easier to interact with storage from your code. There is support for .NET, Java, Python, and Node.js along with other popular languages and platforms. 

Here is example code that connects to a storage account and accesses a container. The code creates the container if it doesn't already exist.

{{<highlight CSharp>}}
if (container == null)
{
    blobClient = storageAccount.CreateCloudBlobClient();
    container = blobClient.GetContainerReference(Globals.CONTAINER);
    await container.CreateIfNotExistsAsync(
        BlobContainerPublicAccessType.Blob,
        null,
        null);
}
{{</highlight>}}

The next code snippet uploads a file (it is passed a `Stream` object that contains the bytes of the file on disk) to blob storage and retrieves the `Uri` to access it.

{{<highlight CSharp>}}
string fileName = $"{shortname}.jpg";
var blob = container.GetBlockBlobReference(fileName);
await blob.UploadFromStreamAsync(image);
var uri = blob.Uri.ToString();
{{</highlight>}}

All Azure storage options provide detailed usage metrics. Here are example Blob storage metrics:

![Blob storage metrics](/blog/2018-12-12_introduction-to-cloud-storage-for-developers/images/storagemetrics.png)
<figcaption>Blob storage metrics</figcaption>

## Static Websites

A unique feature of blob storage is the ability to host static websites. Many front-end frameworks generate files that are downloaded by the browser to run your Single Page Apps (SPA). Static assets include HTML files, CSS stylesheets, and images. By creating a special `$web` container, you can upload your static assets and access them over the web without having to configure (or pay for) a web server. This can lead to tremendous cost savings.

Here is a blog post by a colleague of mine that walks you through creating and hosting a SPA application using static websites: [Hosting a Blazor App in Azure Storage Static Websites](https://anthonychu.ca/post/blazor-azure-storage-static-websites/?utm_source=jeliknes&utm_medium=devto&utm_campaign=azurestorage&WT.mc_id=azurestorage-devto-jeliknes). Blazor uses WebAssembly to host .NET apps in the browser.

## Azure Files

Azure Files let you create mountable cloud-based file shares that can be accessed from Linux, macOS, and Windows. The most common use case for developers is to migrate legacy applications to the web even if they rely on file system access. You can create a file share and mount it from a virtual machine that is running your legacy application and it will run without even "knowing" it's in the cloud.

You can kick the tires yourself and [create your first Azure file share](https://docs.microsoft.com/en-us/azure/storage/files/storage-how-to-create-file-share?utm_source=jeliknes&utm_medium=devto&utm_campaign=azurestorage&WT.mc_id=azurestorage-devto-jeliknes).

## Azure Queues

Azure Queues provide a lightweight, inexpensive way to handle messages for your applications. Queues handle individual messages in any format you desire up 64 kilobytes in size and may contain millions of messages. Common approaches include storing messages as plain text strings or strings that contain JSON-formatted data. Messages by default auto-expire from the queue after 7 days.

Queues are useful for tracking backlogs of information that should be processed in a first-come, first-served basis. They are also useful for sending messaging between cloud-based clients.  

An example of how I've used queues is in my link shortener tool. When a user requests a short link, I want to redirect them as quickly as possible so they don't experience any delay. The application tracks clicks so I can run analytics to determine which topics are more popular and what links people generally don't click on because they're not interested. In the code that handles the redirect, I use a [serverless binding](https://docs.microsoft.com/en-us/azure/azure-functions/functions-triggers-bindings?utm_source=jeliknes&utm_medium=devto&utm_campaign=azurestorage&WT.mc_id=azurestorage-devto-jeliknes) to access the queue:

{{<highlight CSharp>}}
[Queue(queueName: Utility.QUEUE)]IAsyncCollector<string> queue
{{</highlight>}}

Adding an entry to the queue takes one line of code. In this example, I'm using a pipe (`|`) delimited string to store the short link, long link, timestamp, referring URL and user agent. 

{{<highlight CSharp>}}
await queue.AddAsync($"{shortUrl}|{redirectUrl}|{DateTime.UtcNow}|{referrer}|{userAgent}");
{{</highlight>}}

The item is added asynchronously and the user is redirected immediately. Another piece of code is then triggered by the entry in the queue:

{{<highlight CSharp>}}
 [FunctionName("ProcessQueue")]
 public static void ProcessQueue(
    [QueueTrigger(queueName: Utility.QUEUE)]string request,
    TraceWriter log)
{
    log.Info($"Received message from queue: {request}");
}
{{</highlight>}}

The code is called with the queue message and the message is automatically popped, or removed, from the queue so no other clients will access it. The code then processes the queue data on a separate thread without impacting the user's experience.

Browse the [link shortener code on GitHub](https://github.com/jeremylikness/shortlink?WT.mc_id=azurestorage-devto-jeliknes).

## Conclusion

Databases are not the only place to store data! Cloud storage solutions provide inexpensive storage that is easy to program using existing SDKs and/or REST APIs. You can create distributed clusters without touching a single piece of hardware or even having to understand how the replication works, and have full control over whether your data is redundant inside of a data center or across separate ends of the continent. Best of all, you get durability, resiliency, scalability and security out of the box. Consider using cloud storage for your next application.

[Learn more about Azure Storage](https://docs.microsoft.com/en-us/azure/storage/?utm_source=jeliknes&utm_medium=devto&utm_campaign=azurestorage&WT.mc_id=azurestorage-devto-jeliknes).

![by Jeremy Likness](/images/jeremylikness.gif)
