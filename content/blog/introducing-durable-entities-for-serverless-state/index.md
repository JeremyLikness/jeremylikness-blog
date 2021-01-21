---
title: "Introducing Durable Entities for Serverless State"
author: "Jeremy Likness"
date: 2019-07-24T00:37:18-07:00
years: "2019"
lastmod: 2019-07-24T00:37:18-07:00

draft: false
comments: false
toc: true
canonicalUrl: "https://medium.com/microsoftazure/introducing-durable-entities-for-serverless-state-3484e63fe0ae"

subtitle: "The dungeon does not forget."

description: "Learn how durable entities provide explicit management of state in serverless applications and guarantee operations are safe to execute without concurrency conflicts."

tags:
 - Software architecture 
 - Concurrency
 - Serverless
 - Distributed transactions
 - Azure Functions

image: "/blog/introducing-durable-entities-for-serverless-state/images/durabledungeon.jpeg" 
images:
 - "/blog/introducing-durable-entities-for-serverless-state/images/durabledungeon.jpeg"
 - "/blog/introducing-durable-entities-for-serverless-state/images/inventory.jpeg"

---

The combination of [Azure Functions](https://docs.microsoft.com/en-us/azure/azure-functions/functions-overview?utm_source=jeliknes&utm_medium=blog&utm_campaign=link&WT.mc_id=link-blog-jeliknes) <⚡> and [Durable Functions](https://docs.microsoft.com/en-us/azure/azure-functions/durable/durable-functions-overview?utm_source=jeliknes&utm_medium=blog&utm_campaign=link&WT.mc_id=link-blog-jeliknes) enable long running workflows and the implementation of multiple patterns that I wrote about in a [previous blog post](/blog/stateful-serverless-long-running-workflows-with-durable-functions/). Although it is possible to associate metadata with workflows, referred to as orchestrations, it is limited in scope and usually used for identification. Tracking more complex data and state still required interaction with a back-end data store or database. With [Durable Functions v2](https://docs.microsoft.com/en-us/azure/azure-functions/durable/durable-functions-versions?utm_source=jeliknes&utm_medium=blog&utm_campaign=link&WT.mc_id=link-blog-jeliknes), this changes and now data related to state can be encapsulated in [Durable Entities](https://docs.microsoft.com/en-us/azure/azure-functions/durable/durable-functions-versions?utm_source=jeliknes&utm_medium=blog&utm_campaign=link&WT.mc_id=link-blog-jeliknes#entity-functions).

> The code and functionality in this post is preview code and subject to change.

![Durable dungeon screenshot](/blog/introducing-durable-entities-for-serverless-state/images/durabledungeon.jpeg)
<figcaption>Durable dungeon screenshot</figcaption>

I recently introduced the concept of managing state and complex workflows in [serverless](/tags/serverless) applications using a simple game called the [Durable Dungeon](https://github.com/JeremyLikness/DurableDungeon). If you haven’t already, I recommend looking at the original article before continuing. It’s available here:

{{<relativelink "/blog/stateful-serverless-long-running-workflows-with-durable-functions">}}

In the example application, I tracked four entities in a “game”:

* The user 👤 who is playing
* A monster 👹 to challenge the user
* Inventory, including a weapon 🔪 and a treasure 💎
* A room 🏠 where the action all happens

The application used Durable Functions to track game state and enable various workflows, but the entities were all manually tracked using [Azure Table Storage](https://docs.microsoft.com/en-us/azure/storage/tables/table-storage-overview?utm_source=jeliknes&utm_medium=blog&utm_campaign=link&WT.mc_id=link-blog-jeliknes). The following (simplified) code illustrates the steps to check for an existing user (other non-related code has been removed for clarity).

{{<highlight CSharp>}}
[FunctionName(nameof(NewUser))]
public static async Task<IActionResult> NewUser(
  [Table(nameof(User))]CloudTable table)
{
  var client = table.AsClientFor<User>();
  var tempUser = new User { Name = name };
  var userCheck = await client.GetAsync(tempUser.PartitionKey, name);
  if (userCheck != null)
  {
      // user already exists
  }
}
{{</highlight>}}

The user entity is defined as a `TableEntity` to accommodate the requirements of Table Storage.

{{<highlight CSharp>}}
public class User : BaseHasInventory 
{
    [IgnoreProperty]
    public string Name
    {
        get
        {
            return RowKey;
        }
        set
        {
            RowKey = value;
            ConfigureKeys();
        }
    }

    public string CurrentRoom { get; set; }
    public bool IsAlive { get; set; }

    private void ConfigureKeys()
    {
        if (string.IsNullOrWhiteSpace(RowKey))
        {
            throw new System.Exception($"User requires a name.");
        }
        PartitionKey = RowKey.Substring(0, 1).ToUpperInvariant();            
    }
}
{{</highlight>}}

(The `BaseHasInventory` class contains properties and methods to convert between a single string to serialize the inventory list and an actual searchable list of individual strings). Here is the code to insert a new entry:

{{<highlight CSharp>}}
var client = table.AsClientFor<User>();
var user = new User { Name = username, IsAlive = true };
await client.InsertAsync(user);
{{</highlight>}}

Although this approach works fine for a game demo, it has some inherent problems. First, the state has an affinity to the storage, so regardless of how the application scales, the storage could become a bottleneck. Second, the code doesn’t address concurrency. If `NewUser` is called simultaneously for the username, a race condition could occur that would result in one of the insert operations failing.

Durable entities solves these problems. I updated the repo to include a new project, [DungeonEntities](https://github.com/JeremyLikness/DurableDungeon/tree/master/DungeonEntities), that removes any dependency on storage and instead uses durable entities.

## Introducing Durable Entities

Durable entities provide a mechanism to track state explicitly within orchestrations rather than implicitly as part of the control flow. They are managed by Durable Functions and will work with whatever storage option you choose. One advantage with Durable Entities over managing your own data is that concurrency is handled for you. Instead of manipulating an entity and storing it to a database, Durable Entities are managed via operations that are dispatched with the guarantee only a single operation is run at any given time for a given entity. This prevents race conditions from occurring.
The new functionality is available via a NuGet package:

[Microsoft.Azure.WebJobs.Extensions.DurableTask](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.DurableTask/2.0.0-beta1)

This post was written with `2.0.0-beta1`.

The new package doesn’t default all the host settings, so at a minimum you want to specify a hub name and a storage provider, like this:

{{<highlight JSON>}}
{
  "version": "2.0",
  "extensions": {
    "durableTask": {
      "hubName": "localdungeon",
      "storageProvider": {
        "emulator": {}
      }
    }
  }
}
{{</highlight>}}

There are two approaches to defining your entities. You can use a functional approach, like this:

{{<highlight CSharp>}}
[FunctionName("Counter")]
public static void Counter([EntityTrigger] IDurableEntityContext ctx)
{
    int currentValue = ctx.GetState<int>();

    switch (ctx.OperationName.ToLowerInvariant())
    {
        case "add":
            int amount = ctx.GetInput<int>();
            currentValue += operand;
            break;
        case "reset":
            currentValue = 0;
            break;
        case "get":
            ctx.Return(currentValue);
            break;
    }

    ctx.SetState(currentValue);
}
{{</highlight>}}

…or a class-based approach. I was already using multiple entities, so I chose to go with the latter.

> It is important to note that even if you choose the class-based approach, you are essentially signaling and reading entity state. Instead of obtaining an object, mutating it, then updating it as you might be used to in a database-driven approach, durable entities are message-based and every operation that mutates state should be wrapped in a method call.

Here is the definition for the user:

{{<highlight CSharp>}}
public class User : BaseHasInventory, IUserOperations
{
    public string Name { get; set; }
    public string CurrentRoom { get; set; }
    public bool IsAlive { get; set; }

    public void New(string user)
    {
        Name = user;
        IsAlive = true;
    }

    public void Kill()
    {
        IsAlive = false;
    }

    public void SetRoom(string room)
    {
        CurrentRoom = room;
    }

    public void AddInventory(string inventory)
    {
        RestoreLists();
        InventoryList.Add(inventory);
        SaveLists();
    }

    [FunctionName(nameof(User))]
    public static Task Run([EntityTrigger] IDurableEntityContext ctx)
        => ctx.DispatchAsync<User>();
}
{{</highlight>}}

The data being tracked is the user’s name, the room the user is in and the user’s state of health (either alive or dead). The possible operations are `New`, `Kill`, `SetRoom`, and `AddInventory`. The `Run` method is the key to defining User as a durable entity and dispatches a context able to interact with the methods on the class. Notice that it is a [trigger](https://docs.microsoft.com/en-us/azure/azure-functions/functions-triggers-bindings?utm_source=jeliknes&utm_medium=blog&utm_campaign=link&WT.mc_id=link-blog-jeliknes) like anything else that signals code to execute in the Azure Functions serverless environment. I’ll cover the `IUserOperations` interface soon.

## Reading and Creating State

Now that the entity is defined, it is possible to interact with the entity to read and manipulate state. These operations are performed using the `OrchestrationClient` that is passed in as `IDurableOrchestrationClient`. This is the code to check if the user exists:

{{<highlight CSharp>}}
var key = new EntityId(nameof(User), username);
var result = await client.ReadEntityStateAsync<User>(key);
if (result.EntityExists)
{
    // user is defined
}
{{</highlight>}}

Every entity is accessed with a unique identifier that is the name of the entity and a key. In this case, the key is the username. If the user state has already been created, `EntityExists` returns as `true`. The state itself is available as the property `EntityState` that is of type `User`.

Any signal to an entity will result in it being created. I can call any operation on the entity, but I chose `New` to set the name and flag the user as “alive.”

`await client.SignalEntityAsync(id, nameof(User.New), username);`

That’s it! Behind the scenes, the entity is stored as an instance in the same table that tracks other orchestrations. For my user, it created a key of `@User@Jeremy` (type and key) with a serialized JSON payload that looks like this:

{{<highlight JSON>}}
{
  "exists":true,
  "state": {
    "Name":"Jeremy",
    "CurrentRoom":"A large room",
    "IsAlive":true,
    "InventoryItems":"Hefty Mace,Sparkling Fortune Cookie wrapper"
  },
  "sorter":{}
}
{{</highlight>}}

It may seem a little odd to use `nameof` to grab a function name and call it without validation or strong types. Fortunately, it is possible to use a proxy to call methods directly on the target class. The proxy only supports methods, not properties, so the first thing to do is create an interface with the available operations:

{{<highlight CSharp>}}
public interface IUserOperations
{
    void New(string user);
    void Kill();
    void SetRoom(string room);
    void AddInventory(string inventory);
}
{{</highlight>}}

The `User` entity implements the `IUserOperations` interface, so they are always in sync. The new interface will then allow you to call via proxy like this:

{{<highlight CSharp>}}
var id = name.AsEntityIdFor<User>();
await starter.SignalEntityAsync<IUserOperations>(
    id, user => user.New(name));
{{</highlight>}}

Notice I create the identifier based on the entity, and signal using the interface. I also created an extension method to make it easier to create identifiers. The extension method looks like this:

{{<highlight CSharp>}}
public static EntityId AsEntityIdFor<T>(this string user, string treasureName = null)
{
    var key = string.IsNullOrWhiteSpace(treasureName) ?
          user : $"{user}:{treasureName}";
    return new EntityId(typeof(T).Name, key);
}
{{</highlight>}}

There is an optional parameter for “treasure name” that I’ll explain later.

## Making Room for the Monster: Updating Entities

I always try to make my code simple and easy to read. If I find I’m duplicating code, I wrap it in an API or extension method. The first pattern I identified was loading an entity and calling `RestoreLists` to build the inventory list. This is a carry-over from table storage that doesn’t serialize lists (something durable entities is capable of, but it was easier for me to use the existing code). Every entity except for individual inventory items is identified by the user, so this method:

{{<highlight CSharp>}}
public static async Task<EntityStateResponse<T>> ReadUserEntityAsync<T>(
  this IDurableOrchestrationClient client, string user)
{
    var id = user.AsEntityIdFor<T>();
    var result = await client.ReadEntityStateAsync<T>(id);
    if (result.EntityState is IHaveLists)
    {
        ((IHaveLists)result.EntityState).RestoreLists();
    }
    return result;
}
{{</highlight>}}

Makes it possible to execute this code:

`var check = await user.ReadUserEntityAsync<Room>(client);`

In many cases the state should already exist, so I want to either throw an exception or return the state object itself. To make life easier, I created this extension method:

{{<highlight CSharp>}}
public static async Task<T> GetEntityForUserOrThrow<T>(
  this string username, IDurableOrchestrationClient client)
{
    var check = await client.ReadUserEntityAsync<T>(username);
    if (!check.EntityExists)
    {
        throw new Exception($"No {typeof(T)} found for user {username}");
    }
    return check.EntityState;
}
{{</highlight>}}

Now placing a monster in a room and updating each entity to reference the other looks like this:

{{<highlight CSharp>}}
var room = await username.GetEntityForUserOrThrow<Room>(client);
var monster = await username.GetEntityForUserOrThrow<Monster>(client);
await client.SignalEntityAsync<IMonsterOperations>(
  username.AsEntityIdFor<Monster>(),
  operation => operation.SetRoom(room.Name));
await client.SignalEntityAsync<IRoomOperations>(
  username.AsEntityIdFor<Room>(),
  operation => operation.SetMonster(monster.Name));
{{</highlight>}}

For the most part, all operations are a combination of fetching the state to inspect it, then dispatching an operation. Inventory works a little differently.

## Weapons and Loot: Dealing with Lists

The inventory entity has multiple instances (a weapon and a treasure) so a user key won’t work (it would be duplicated). If I use the name of the inventory as the key, I end up with a problem because I must know the inventory name to fetch it, but I don’t know what weapon or treasure was generated without inspecting it. See the catch-22? Although I only have two inventory items, I decided to implement it as a list to illustrate the solution for 1..N. Inventory works like this:

1. Save the list of inventory names with the key _user_
2. Save each inventory item with the key _user:item-name_

Using the [storage explorer](https://docs.microsoft.com/en-us/azure/vs-azure-tools-storage-manage-with-storage-explorer?utm_source=jeliknes&utm_medium=blog&utm_campaign=link&WT.mc_id=link-blog-jeliknes), this is what inventory looks like for user “Flint”:

![Inventory entries](/blog/introducing-durable-entities-for-serverless-state/images/inventory.jpeg)
<figcaption>Inventory entries</figcaption>

This is the logic to place the treasure on a monster:

1. Read the inventory list (just a list of names)
2. Read each inventory item on the list
3. Find the item that is the treasure
4. Set the monster property on the treasure
5. Add the inventory item to the monster’s inventory

…and the code:

{{<highlight CSharp>}}
var inventoryNames = await username.GetEntityForUserOrThrow<InventoryList>(client);
var inventoryList = new List<Inventory>();
foreach(var item in inventoryNames.InventoryList)
{
    var id = user.AsEntityIdFor<Inventory>(item);
    var inventory = await client.ReadEntityStateAsync<Inventory>(id);
    if (inventory.EntityExists)
    {
        inventoryList.Add(inventory.EntityState);
    }
}
var treasure = inventoryList.Where(i => i.IsTreasure).Select(i => i).First();
var monster = await username.GetEntityForUserOrThrow<Monster>(client);
await client.SignalEntityAsync<IInventoryOperations>(
    username.AsEntityIdFor<Inventory>(treasure.Name),
    operation => operation.SetMonster(monster.Name));
await client.SignalEntityAsync<IMonsterOperations>(
    username.AsEntityIdFor<Monster>(),
    operation => operation.AddInventory(treasure.Name));
{{</highlight>}}

Notice that the name of the item is passed to the extension method for the id, so it is created as _user:item-name_ as opposed to just _user_.

## Return on Aggregation

So far, I’ve demonstrated the narrow use case of tracking state for individual sessions. The power of durable entities truly shines when implementing the aggregation pattern. Imagine you have an Internet of Things solution and you are tracking metrics for devices. In a traditional approach, concurrency is a major concern with multiple updates happening simultaneously. Durable entities ensure you can perform aggregate operations safely due to the guarantee that operations on state are completely atomic.

In the `UserCounter` definition, I used the functional approach rather than the class-based approach. I declared the operations and a static key because there is just one state (“total active users”) for the entire application. This creates the literal key `@UserName@User`.

{{<highlight CSharp>}}
public const string NewUser = "newuser";
public const string UserDone = "done";
public static EntityId Id
{
    get
    {
        return new EntityId(nameof(UserCounter), nameof(User));
    }
}
{{</highlight>}}

The entity keeps track of active users. The operations are defined like this:

{{<highlight CSharp>}}
[FunctionName(nameof(UserCounter))]
public static void Counter([EntityTrigger]IDurableEntityContext ctx)
{
    int currentValue = ctx.GetState<int>();
    switch (ctx.OperationName)
    {
        case NewUser:
            currentValue += 1;
            break;
        case UserDone:
            currentValue -= 1;
            break;
    }
    ctx.SetState(currentValue);
}
{{</highlight>}}

If the entity hasn’t been created yet, `currentValue` defaults to 0. After a user is added, the entity is signaled to increment.

`await starter.SignalEntityAsync(UserCounter.Id, UserCounter.NewUser);`

Conversely, when a user finds the treasure or is “killed” for not confirming in time, a signal is raised to decrease the aggregate count.

`await client.SignalEntityAsync(UserCounter.Id, UserCounter.UserDone);`

The `GameStatus` API returns the total count of active users:

{{<highlight CSharp>}}
var userCount = await client.ReadEntityStateAsync<int>(
    UserCounter.Id);
return new OkObjectResult(new
{
    ...
    activeUsers = userCount.EntityState,
    ...
});
{{</highlight>}}

This will handle any number of users simultaneously accessing the system and will aggregate across all the distributed nodes used to scale the application. Welcome to the “easy button” for distributed transactions!

## Summary

That concludes my lap around the new durable entities. You’ve seen how to define them as both functions and classes. I covered strategy for defining unique identifiers and dealing with things like scoped lists. I demonstrated how to check for the existence of an entity, read state and dispatch operations. Finally, the project uses the aggregation pattern to track active users.

Access the repository here:

{{<github "JeremyLikness/DurableDungeon">}}

Are you intrigued by durable functions? Jump right in with a hands-on tutorial that walks you step-by-step through creating and managing durable functions. No Azure subscription is required: [Create a long-running serverless workflow with Durable Functions](https://docs.microsoft.com/en-us/learn/modules/create-long-running-serverless-workflow-with-durable-functions/?utm_source=jeliknes&utm_medium=blog&utm_campaign=link&WT.mc_id=link-blog-jeliknes).

Regards,

![Jeremy Likness](/images/jeremylikness.gif)
