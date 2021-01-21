---
title: "What the Shard?"
author: "Jeremy Likness"
date: 2018-07-23T02:03:19.242Z
years: "2018"
lastmod: 2019-06-13T10:45:04-07:00
comments: true

description: "Learn how to leverage the MongoDB C# driver to set up sharding with partition key from code for your Azure Cosmos DB database."

subtitle: "Partition collections using the C# MongoDB driver with Azure Cosmos DB."
tags:
 - Programming 
 - Azure 
 - Cosmosdb 
 - Mongodb 
 - Sharding 

image: "/blog/2018-07-23_what-the-shard/images/1.png" 
images:
 - "/blog/2018-07-23_what-the-shard/images/1.png" 
 - "/blog/2018-07-23_what-the-shard/images/2.png" 
 - "/blog/2018-07-23_what-the-shard/images/3.png" 
 - "/blog/2018-07-23_what-the-shard/images/4.png" 
 - "/blog/2018-07-23_what-the-shard/images/5.png" 
 - "/blog/2018-07-23_what-the-shard/images/6.png" 
 - "/blog/2018-07-23_what-the-shard/images/7.png" 
 - "/blog/2018-07-23_what-the-shard/images/8.gif" 


aliases:
    - "/what-the-shard-cc29623503ad"
---

Azure Cosmos DB is a fully managed NoSQL database. I’ve written about it extensively [on this blog](/tags/cosmosdb). An advanced and powerful feature is the ability to partition data. This is commonly referred to as _sharding_. Azure Cosmos DB manages this for you when you follow these [prerequisites for partitioning](https://docs.microsoft.com/en-us/azure/cosmos-db/partitioning-overview?utm_source=jeliknes&utm_medium=medium&utm_campaign=blog&WT.mc_id=blog-medium-jeliknes#prerequisites).

I won’t go into too much detail about partitioning here because it’s well-explained in the documentation. In a nutshell, a logical partition is a range of items that are grouped together. This is determined by a property on the documents that may be either hashed or specified as a range. Logically, items with the same partition key are kept together. Physically, a node may store one to many partitions or shards. This is handled transparently for you by Azure Cosmos DB based on demand.

> Read everything there is to know about partitioning here: [Partitioning and scale in Azure Cosmos DB](https://docs.microsoft.com/en-us/azure/cosmos-db/partitioning-overview?utm_source=jeliknes&utm_medium=medium&utm_campaign=blog&WT.mc_id=blog-medium-jeliknes)

Partition keys help with scale, especially when your database is geographically distributed. This is because when items are inserted or updated, replication can focus on that specific partition rather than the entire database. Reads can also be optimized by co-locating partitions for those reads. The replication behavior is optimized by setting a specific [consistency level](/cloud-nosql-azure-cosmosdb-consistency-levels-cfe8348686e6).

Although the documentation discusses how partitioning works across various APIs (for an overview of the different APIs and database “flavors” that are available, read this [overview of Azure Cosmos DB APIs](/getting-started-with-cosmosdb-sql-api-da52719f30de)), there wasn’t an explicit example of how to set the partition key through code.

I started with my existing <i class="fab fa-github"></i> [USDA Database example](https://github.com/JeremyLikness/explore-cosmos-db). This contains almost 9,000 food items that are assigned to a particular “food group.” There are many [best practices for choosing a partition key](https://docs.microsoft.com/en-us/azure/cosmos-db/partitioning-overview?utm_source=jeliknes&utm_medium=medium&utm_campaign=blog&WT.mc_id=blog-medium-jeliknes#best-practices-when-choosing-a-partition-key). To keep this example simple, I chose to partition on the `FoodGroupId `property.

The code to create a collection in MongoDB looks like this:

`await db.CreateCollectionAsync(collectionName);`

To specify a partition key, we have to create a sharded collection. This is done by passing a command to the database. MongoDB commands and queries are all JSON documents, so we can use the driver’s `BsonDocument` class to construct the command. This is the command to create a sharded collection:

{{<highlight CSharp>}}
var partition = new BsonDocument {
    {"shardCollection", $"{db.DatabaseNamespace.DatabaseName}.{collectionName}"},
    {"key", new BsonDocument {{"FoodGroupId", "hashed"}}}
};
var command = new BsonDocumentCommand<BsonDocument>(partition);
await db.RunCommandAsync(command);
{{</highlight>}}

The collection name is passed as a fully qualified database and collection name, followed by the key for the shard that points to a hash of `FoodGroupId`. The document is used to construct the command and is then passed to the database.

After the data is inserted, you can view the distribution of storage across partition keys in the portal.

![Partition keys for USDA database](/blog/2018-07-23_what-the-shard/images/1.png)
<figcaption>Partition keys for USDA database</figcaption>

You can see there are a few outliers with more storage but in general the storage is evenly distributed. You specify the partition key to create a _logical_ partition that guarantees to keep items with the same hash of the key together. Cosmos DB manages the _physical_ partitions based on needs. In the portal, you can see that although we have a few dozen partition keys, there are only a handful of partitions.

![Physical partitions](/blog/2018-07-23_what-the-shard/images/2.png)
<figcaption>Physical partitions</figcaption>

The partitions are sequenced. I highlighted “partition 3” that is holding 40 megabytes of data. Clicking on the partition reveals the logical keys that it contains.

![Logical partitions in physical partition 3](/blog/2018-07-23_what-the-shard/images/3.png)
<figcaption>Logical partitions in physical partition 3</figcaption>

Every document in the collection must have the partition key or an error is thrown when you try to insert or update it. To see how partitioning works from a performance and cost perspective, I first ran a search for the text “scrambled” across the entire database (multiple physical and logical partitions).

![A cross-partition query](/blog/2018-07-23_what-the-shard/images/4.png)
<figcaption>A cross-partition query</figcaption>

> If you are confused by the JSON syntax I use for MongoDB queries, you can read more about it and how it relates to SQL syntax here: [MongoDB query documents](https://docs.mongodb.com/manual/tutorial/query-documents/).

A request unit represents a fixed amount of memory, storage, and CPU required to complete an operation. Here, we are at almost 4,000 RUs for the query to run. The query had to scan every item and apply the regular expression. Let’s narrow it down to the two unique food groups that were returned. This query will span two logical partitions, and just happens to span two physical partitions (0100 is on a different partition than 2100).

![Narrowed to two partitions](/blog/2018-07-23_what-the-shard/images/5.png)
<figcaption>Narrowed to two partitions</figcaption>

The filter reduced the RUs significantly, but this is mainly because the query engine is taking advantage of built-in indexes to narrow the subset of items to scan. If we limit the query to a single partition (both logical and physical), performance again improves dramatically:

![Single partition](/blog/2018-07-23_what-the-shard/images/6.png)
<figcaption>Single partition</figcaption>

The performance advantage isn’t solely due to the limited records to scan. We can limit the records to the exact same subset using a different column that is _not_ the partition key (the group description, instead of it’s unique identifier), and the RUs will increase because it is not constrained to a single partition:

![Same filter _without using the partition key_](/blog/2018-07-23_what-the-shard/images/7.png)
<figcaption>Same filter _without using the partition key_</figcaption>

The increase is not as dramatic for megabytes of data but would be more evident when dealing with terabytes and petabytes of data.

If you are moving to Azure Cosmos DB from MongoDB or simply interested in using the MongoDB API, you now know how to take advantage of partition keys for replication at scale with Azure Cosmos DB. The concept is similar for other APIs but the implementations vary.

Ready to get started with the MongoDB API? Read the [introduction to Azure Cosmos DB with the MongoDB API](https://docs.microsoft.com/en-us/azure/cosmos-db/mongodb-introduction?utm_source=jeliknes&utm_medium=medium&utm_campaign=blog&WT.mc_id=blog-medium-jeliknes).

Regards,

![Jeremy Likness](/blog/2018-07-23_what-the-shard/images/8.gif)
