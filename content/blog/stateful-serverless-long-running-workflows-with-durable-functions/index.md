---
title: "Stateful Serverless: Long-Running Workflows with Durable Functions"
author: "Jeremy Likness"
date: 2019-07-02T00:00:00.000Z
years: "2019"
lastmod: 2019-07-02T00:00:00.000Z
canonicalUrl: https://medium.com/microsoftazure/stateful-serverless-long-running-workflows-with-durable-functions-39ef5c96440b
toc: true
draft: false

description: "Learn how to implement long running stateful workflows in a serverless architecture using Durable Functions, the combination of the open source Durable Task Framework and Azure Functions."

subtitle: "The Durable Task Framework makes it easier to address various workflow patterns implemented with Azure Functions."

tags:
 - Azure 
 - Azure Functions 
 - Serverless 
 - Durable Functions
 - Workflow

image: "/blog/stateful-serverless-long-running-workflows-with-durable-functions/images/dungeon.jpeg" 
images:
 - "/blog/stateful-serverless-long-running-workflows-with-durable-functions/images/dungeon.jpeg" 
 - "/blog/stateful-serverless-long-running-workflows-with-durable-functions/images/billingmodel.jpg"
 - "/blog/stateful-serverless-long-running-workflows-with-durable-functions/images/gameexample.jpg"
 - "/blog/stateful-serverless-long-running-workflows-with-durable-functions/images/newuserflow.jpg"
 - "/blog/stateful-serverless-long-running-workflows-with-durable-functions/images/durableconsole.jpg"
 - "/blog/stateful-serverless-long-running-workflows-with-durable-functions/images/durableoverview.jpg"
 - "/blog/stateful-serverless-long-running-workflows-with-durable-functions/images/fanoutin.png"
 - "/blog/stateful-serverless-long-running-workflows-with-durable-functions/images/userconfirmation.jpg"
 - "/blog/stateful-serverless-long-running-workflows-with-durable-functions/images/humaninteraction.png"
 - "/blog/stateful-serverless-long-running-workflows-with-durable-functions/images/usermonitor.jpg"
 - "/blog/stateful-serverless-long-running-workflows-with-durable-functions/images/longrunningprocess.png"
 - "/blog/stateful-serverless-long-running-workflows-with-durable-functions/images/longrunningapi.png"
 - "/blog/stateful-serverless-long-running-workflows-with-durable-functions/images/sequencing.png"
 - "/blog/stateful-serverless-long-running-workflows-with-durable-functions/images/gamesetup.jpg"
 - "/blog/stateful-serverless-long-running-workflows-with-durable-functions/images/gameloop.jpg"
 - "/blog/stateful-serverless-long-running-workflows-with-durable-functions/images/eventscorrelation.png"
 - "/blog/stateful-serverless-long-running-workflows-with-durable-functions/images/durablefrontend.jpg"  

---
[Azure Functions](https://docs.microsoft.com/en-us/azure/azure-functions/functions-overview?utm_source=jeliknes&utm_medium=blog&utm_campaign=azuremedium&WT.mc_id=azuremedium-blog-jeliknes) allows you to easily build, deploy, run, and maintain small pieces of code, or functions, in the cloud. You write the code in your language/platform of choice and don't worry about building an application or configuring infrastructure. The functions runtime handles hosting and scaling your code in response to events or triggers that range from HTTP requests to timers, messages, database updates and more. The consumption-based billing model tracks how often your code is run, and how much memory it consumes while running.

In this example, memory use fluctuates over time as the function is running. The "area under the curve" is what determines billing.

![Serverless billing model](/blog/stateful-serverless-long-running-workflows-with-durable-functions/images/billingmodel.jpg)
<figcaption>Serverless billing model</figcaption>

## The Problem

It stands to reason that the least expensive serverless examples execute quickly and don't consume much memory. Although this is perfect for many scenarios, some workflows may run for a long duration based on time passed but take up very little compute time. For example, a bot interface spends most of its time waiting for user input. To make things interesting, consider a turn-based text adventure game. The user sees the state of the game, types a command to interact with the game, then waits for output and repeats the process. In the following example, almost 30 seconds of game time passes but only 13 milliseconds of compute time is consumed.

![Game time vs. compute time](/blog/stateful-serverless-long-running-workflows-with-durable-functions/images/gameexample.jpg)
<figcaption>Game time vs. compute time</figcaption>

There are a few reasons the workload doesn't appear to be a good fit for Azure Functions at first glance. It runs relatively long (the example was just part of the game; an entire game may take hours or days). In addition, it requires state to keep track of the game in progress. Azure Functions by nature are stateless. They are designed to be quickly run self-contained transactions. Any concept of state must be managed using cache, storage, or database.

If only the function could be suspended while waiting for asynchronous actions to complete and maintain its state when resumed.

_If only..._

## Introducing Durable Functions

The [Durable Task Framework](https://github.com/Azure/durabletask?utm_source=jeliknes&utm_medium=blog&utm_campaign=azuremedium&WT.mc_id=azuremedium-blog-jeliknes) is an open source library that was written to manage state and control flow for long-running workflows. [Durable Functions](https://docs.microsoft.com/en-us/azure/azure-functions/durable/durable-functions-overview?utm_source=jeliknes&utm_medium=blog&utm_campaign=azuremedium&WT.mc_id=azuremedium-blog-jeliknes) builds on the framework to provide the same support for serverless functions. In addition to facilitating potential cost savings for longer running workflows, it opens a new set of [patterns and possibilities](https://docs.microsoft.com/en-us/azure/azure-functions/durable/durable-functions-overview?utm_source=jeliknes&utm_medium=blog&utm_campaign=azuremedium&WT.mc_id=azuremedium-blog-jeliknes) for serverless applications. To illustrate these patterns, I created the Durable Dungeon.

This article is based on a presentation I first gave at [NDC Oslo](https://ndcoslo.com). You can watch the full presentation here:

{{<youtube QvaPka0lmdU>}}

I also tweeted a link to the PowerPoint presentation.

{{<customtwitter 1141390186250739717>}}

This is your official adventurer’s guide to the Durable Dungeon.

## The Durable Dungeon

![Catacombs Paris, France (c) 2019 Jeremy Likness](/blog/stateful-serverless-long-running-workflows-with-durable-functions/images/dungeon.jpeg)
<figcaption>Catacombs Paris, France &copy; 2019 Jeremy Likness</figcaption>

The Durable Dungeon is a serverless adventure game designed to illustrate how Durable Functions work. The game flow looks like this at a high level:

* A new user enters the game
* A random monster, room, weapon, and treasure are created
* The user has 2 minutes to confirm their commitment to play
* If the user doesn’t confirm in 2 minutes, they die
* If the user does confirm, a game loop starts that monitors the status of the game for up to one hour
* The user must pick up the weapon, slay the monster, then retrieve the treasure to win the game

The entire game is implemented with a combination of Azure Functions and [Azure Storage](https://docs.microsoft.com/en-us/azure/storage/?utm_source=jeliknes&utm_medium=blog&utm_campaign=azuremedium&WT.mc_id=azuremedium-blog-jeliknes), with a [Vanilla.js](/blog/2019-04-09_vanilla.jsgetting-started) front-end to monitor and play if direct HTTP calls aren’t your thing. If you’re curious about why this is implemented using a serverless architecture, the reasons are explained in the presentation deck.

You can access the GitHub repository that contains step-by-step instructions to run the entire demo here:

{{<github "JeremyLikness/DurableDungeon">}}

### Enter the Dungeon

The new user workflow is kicked off when a username is posted to an endpoint.

> For my demos, I use the global [HTTPREPL](https://www.hanselman.com/blog/ACommandlineREPLForRESTfulHTTPServices.aspx) tool to interact with the endpoints. Instructions for this are contained in the repository. You can use any tool you prefer, including the popular PostMan.

The flow looks like this:

![New user workflow](/blog/stateful-serverless-long-running-workflows-with-durable-functions/images/newuserflow.jpg)
<figcaption>New user workflow</figcaption>

The sample code is set up to send messages to a queue named _console_. The queue is useful for querying game state. In the repository you will find a standalone .NET Core console project named <i class="fab fa-github"></i> [`DungeonConsole`](https://github.com/JeremyLikness/DurableDungeon/tree/master/DungeonConsole). By default it connects to the [Azure Storage Emulator](https://docs.microsoft.com/en-us/azure/storage/common/storage-use-emulator?utm_source=jeliknes&utm_medium=github&utm_campaign=durabledungeon&WT.mc_id=durabledungeon-github-jeliknes). You can provide a connection string to monitor a different storage account if you are not running it locally.

![The dungeon console](/blog/stateful-serverless-long-running-workflows-with-durable-functions/images/durableconsole.jpg)
<figcaption>The dungeon console</figcaption>

Kick off the console by typing `dotnet run` in the root folder of the project and you are ready to begin!

A quick durable functions primer: ordinary functions or _clients_ can kick off workflows (called _orchestrations_) using a special binding. This is the code for the new user endpoint (using an ordinary Azure Function) that uses the `DurableOrchestrationClient` to kick off two different workflows: one to create the universe, and one to monitor the user’s status in the game.

{{<highlight CSharp>}}
[FunctionName(nameof(NewUser))]
        public static async Task<IActionResult> NewUser(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = null)]
                HttpRequest req,
            ...
            [OrchestrationClient]DurableOrchestrationClient starter,
            ILogger log)
{
    log.LogInformation("NewUser called.");

    // do stuff

    await starter.StartNewAsync(nameof(NewUserParallelFunctions.RunUserParallelWorkflow), name);
    log.LogInformation("Started new parallel workflow for user {user}", name);

    await starter.StartNewAsync(nameof(MonitorFunctions.UserMonitorWorkflow), name);
    log.LogInformation("Started new monitor workflow for user {user}", name);

    return new OkResult();
}
{{</highlight>}}

An orchestration is responsible for coordinating work. Durable Functions use the concept of _checkpoints_ and _replays_ to manage the state and lifetime of the workflow. To learn more about these concepts, read:

{{<iconlink "https://docs.microsoft.com/azure/azure-functions/durable/durable-functions-orchestrations?utm_source=jeliknes&utm_medium=blog&utm_campaign=azuremedium&WT.mc_id=azuremedium-blog-jeliknes&tabs=csharp" "Checkpoints and replay in Durable Functions">}}

The orchestration manages the workflow itself, such as how and when tasks are performed. The tasks themselves are encapsulated in special units called _activities_. As a rule of thumb, anything with side effects should be contained within an activity.

![Orchestration concepts](/blog/stateful-serverless-long-running-workflows-with-durable-functions/images/durableoverview.jpg)
<figcaption>Orchestration concepts</figcaption>

After a new user enters the game, the workflow for the universe creates the user, monster, room, and inventory in parallel, following the “fan-out/fan-in” pattern (the confirmation workflow is only kicked off once all of the universe has been created).

![Fan out/in](/blog/stateful-serverless-long-running-workflows-with-durable-functions/images/fanoutin.png)
<figcaption>Fan out/in</figcaption>

The orchestration implements the pattern like this:

{{<highlight CSharp>}}
var parallelTasks = new List<Task>
{
    context.CallActivityAsync(nameof(CreateUser), username),
    context.CallActivityAsync(nameof(CreateMonster), username),
    context.CallActivityAsync(nameof(CreateRoom), username),
    context.CallActivityAsync(nameof(CreateInventory), username)
};

await Task.WhenAll(parallelTasks);
{{</highlight>}}

Notice that the username is the way workflows are uniquely identified in this implementation. An activity acts in the user context like this:

{{<highlight CSharp>}}
[FunctionName(nameof(CreateMonster))]
public static async Task CreateMonster(
    [ActivityTrigger]string username,
    [Table(nameof(Monster))]CloudTable table,
    [Queue(Global.QUEUE)]IAsyncCollector<string> console,
    ILogger logger)
{
    logger.LogInformation("Create monster for user {user}", username);
    var client = table.AsClientFor<Monster>();
    var monster = _monsterMaker.GetNewMonster(username);
    await client.InsertAsync(monster);
    await console.AddAsync($"Look out! {monster.Name} is now stalking {username}!");
    logger.LogInformation("Created monster {monster} for user {user} successful", monster.Name, username);
}
{{</highlight>}}

### A Question of Commitment

After the universe is created, a workflow kicks off that waits for the user to confirm before beginning the game. If the user does not confirm inside of a two-minute window, the character is “killed” and the game ends.

![User confirmation](/blog/stateful-serverless-long-running-workflows-with-durable-functions/images/userconfirmation.jpg)
<figcaption>User confirmation</figcaption>

This implements the “human interaction” pattern.

![Human interaction](/blog/stateful-serverless-long-running-workflows-with-durable-functions/images/humaninteraction.png)
<figcaption>Human interaction</figcaption>

The implementation sets a timer for two minutes, then waits for either the timer to fire or the confirmation event to occur. The workflow ends after the user confirms or the timer fires, whichever happens first.

{{<highlight CSharp>}}
[FunctionName(nameof(UserConfirmationWorkflow))]
        public static async Task UserConfirmationWorkflow(
            [OrchestrationTrigger]DurableOrchestrationContext context,
            ILogger logger)
{
    var username = context.GetInput<string>();
    using (var timeoutCts = new CancellationTokenSource())
    {
        var dueTime = context.CurrentUtcDateTime
            .Add(TimeSpan.FromMinutes(Global.ExpirationMinutes));
        var approvalEvent = context.WaitForExternalEvent<bool>(APPROVAL_TASK);
        var durableTimeout = context.CreateTimer(dueTime, timeoutCts.Token);
        var winner = await Task.WhenAny(approvalEvent, durableTimeout);
        if (winner == approvalEvent && approvalEvent.Result)
        {
            timeoutCts.Cancel();
            logger.LogInformation("User {user} confirmed.", username);
            await context.CallActivityAsync(nameof(Global.StartNewWorkflow),
                ((nameof(NewUserSequentialFunctions.RunUserSequentialWorkflow), 
                username)));
        }
        else
        {
            await context.CallActivityAsync(nameof(ConsoleFunctions.AddToQueue),
                $"User {username} failed to confirm in time.");
            await context.CallActivityAsync(nameof(KillUser), username);
        }
    }
}
{{</highlight>}}

How does the workflow receive the confirmation? An ordinary function endpoint waits for a POST with the username. It searches for an active instance of the confirmation workflow that matches the user, then raises the approval event.

{{<highlight CSharp>}}
[FunctionName(nameof(ConfirmUser))]
        public static async Task<IActionResult> ConfirmUser(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = null)]
                HttpRequest req,
            [Queue(Global.QUEUE)]IAsyncCollector<string> console,
            [Table(nameof(User))]CloudTable table,
            [OrchestrationClient]DurableOrchestrationClient durableClient,
            ILogger log)
{
    ...
    var instance = await durableClient.FindJob(
        DateTime.UtcNow,
        nameof(UserConfirmationWorkflow), 
        name);
    ...
    await durableClient.RaiseEventAsync(instance.InstanceId, APPROVAL_TASK, true);
    return new OkResult();
}
{{</highlight>}}

After the user is created, a second workflow is also kicked off.

### Somebody's Watching You

The user monitor workflow is an example of a long running API. In this example it is set to only run for an hour, but it could run indefinitely if needed. The workflow “wakes up” every several seconds and checks to see if the user either died or won the game. The firing of either event signals the end of the user’s interactions and terminates the workflow.

![User monitor](/blog/stateful-serverless-long-running-workflows-with-durable-functions/images/usermonitor.jpg)
<figcaption>User monitor</figcaption>

This is a long-running process.

![Long-running process](/blog/stateful-serverless-long-running-workflows-with-durable-functions/images/longrunningprocess.png)
<figcaption>Long-running process</figcaption>

It is implemented like this:

{{<highlight CSharp>}}
[FunctionName(nameof(UserMonitorWorkflow))]
        public static async Task UserMonitorWorkflow(
            [OrchestrationTrigger]DurableOrchestrationContext context,
            ILogger logger)
{
    var username = context.GetInput<string>();
    var expiryTime = context.CurrentUtcDateTime.AddHours(Global.MonitorTimeoutHours);
    var timeout = false;
    while (context.CurrentUtcDateTime < expiryTime)
    {
        timeout = false;
        var done = await context.CallActivityAsync<bool>(nameof(MonitorUser), username);
        if (done)
        {
            break;
        }
        var nextCheck = context.CurrentUtcDateTime.AddSeconds(CheckIntervalSeconds);
        await context.CreateTimer(nextCheck, CancellationToken.None);
        timeout = true;
    }
    if (timeout)
    {
        // timed out in 1 hour
    }
    // ended due to user dying or winning the game
}
{{</highlight>}}

The `MonitorUser` activity simply inspects the user’s status and returns true if the user is either dead or has won the game. For a working implementation of the game, it is useful to be able to monitor the status of long running workflows. In this case, an HTTP endpoint kicked off a long-running process that is possible to monitor via HTTP as well.

![Async long-running API](/blog/stateful-serverless-long-running-workflows-with-durable-functions/images/longrunningapi.png)
<figcaption>Async long-running API</figcaption>

The `CheckStatus` API is set up to receive a user and the name of the workflow being monitored. It searches for existing instances and returns the status of the workflow.

{{<highlight CSharp>}}
[FunctionName(nameof(CheckStatus))]
        public static async Task<IActionResult> CheckStatus(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "CheckStatus/{username}/{workflow}")]
                HttpRequest req,
            string username,
            string workflow,
            [OrchestrationClient]DurableOrchestrationClient query,
            ILogger log)
{
    log.LogInformation($"CheckStatus called for {username} and {workflow}.");
    var job = await Global.FindJob(query,
        DateTime.UtcNow,
        workflow,
        username,
        false,
        false);
    if (job == null)
    {
        return new NotFoundResult();
    }
    return new OkObjectResult(new
    {
        Created = job.CreatedTime,
        Status = job.RuntimeStatus.ToString()
    });
}
{{</highlight>}}

This is useful to monitor what phase/stage of the game the user is in.

### The Dungeon Master

After the user commits to the game, the dungeon is prepared for play. Although the monster, rooms, and inventory were created, they are not yet associated with each other. To avoid unnecessary concurrency issues, the setup is an asynchronous sequential workflow that sets up each step in order: placing the user in the room, placing the weapon in the room, placing the monster in the room and moving the treasure to the monster’s inventory.

![Setting up the dungeon](/blog/stateful-serverless-long-running-workflows-with-durable-functions/images/gamesetup.jpg)
<figcaption>Setting up the dungeon</figcaption>

The pattern looks like this:

![Asynchronous sequential workflow](/blog/stateful-serverless-long-running-workflows-with-durable-functions/images/sequencing.png)
<figcaption>Asynchronous sequential workflow</figcaption>

In the code, this is implemented as a series of awaits:

{{<highlight CSharp>}}
[FunctionName(nameof(RunUserSequentialWorkflow))]
public static async Task RunUserSequentialWorkflow(
    [OrchestrationTrigger]DurableOrchestrationContext context,
    ILogger logger)
{
    var username = context.GetInput<string>();
    
    await context.CallActivityAsync(nameof(PlaceUserInRoom), username);
    await context.CallActivityAsync(nameof(PlaceInventoryInRoom), username);
    await context.CallActivityAsync(nameof(PlaceMonsterInRoom), username);
    await context.CallActivityAsync(nameof(PlaceInventoryOnMonster), username);
    await context.CallActivityAsync(nameof(Global.StartNewWorkflow),
        (nameof(MonitorFunctions.GameMonitorWorkflow), username));
}
{{</highlight>}}

(For error handling and compensation, refer to the presentation deck). After the dungeon is prepared, a game loop is kicked off that terminates when the user wins the game.

### The End Game

The game loop is like the user monitor in that it is a long-running workflow. It differs, however, because instead of polling status on a timer, the game loop waits for two events to occur. To win the game, the user must kill the monster and pick up the treasure.

![Game loop](/blog/stateful-serverless-long-running-workflows-with-durable-functions/images/gameloop.jpg)
<figcaption>Game loop</figcaption>

The workflow is essentially correlating several events and implements this pattern:

![External events correlation](/blog/stateful-serverless-long-running-workflows-with-durable-functions/images/eventscorrelation.png)
<figcaption>External events correlation</figcaption>

The entire pattern can be implemented with just a few lines of code in durable functions.

{{<highlight CSharp>}}
[FunctionName(nameof(GameMonitorWorkflow))]
        public static async Task GameMonitorWorkflow(
            [OrchestrationTrigger]DurableOrchestrationContext context,
            ILogger logger)
{
    var username = context.GetInput<string>();

    var monsterKilled = context.WaitForExternalEvent(KILLMONSTER);
    var treasureFound = context.WaitForExternalEvent(GOTTREASURE);

    await Task.WhenAll(monsterKilled, treasureFound);

    await context.CallActivityAsync(nameof(ConsoleFunctions.AddToQueue),
        $"{username} has won the game!");
}
{{</highlight>}}

The user interacts with the game via a POST to an “action” end point. This is a standard HTTP-triggered Azure function. When a game event such as killing the monster occurs, the code simply searches for the game monitor instance running for that user and raises the appropriate event.

{{<highlight CSharp>}}
var gameMonitor = await Global.FindJob(
            client,
            DateTime.UtcNow,
            nameof(MonitorFunctions.GameMonitorWorkflow),
            name,
            true,
            false);
if (gameMonitor != null)
{
    await client.RaiseEventAsync(gameMonitor.InstanceId,
        MonitorFunctions.KILLMONSTER);
}
{{</highlight>}}

The two events are correlated and when complete, the end of game is signaled. At this point all workflows will be marked “Completed”.

## Summary

After you’ve run through the dungeon a few times you may want to try the “easy button” and use the <i class="fab fa-github"></i> [test harness](https://github.com/JeremyLikness/DurableDungeon/tree/master/TestHarness). Any static website server will do, and the code is written entirely in modern JavaScript with no front-end framework dependencies.

![The durable dungeon front end](/blog/stateful-serverless-long-running-workflows-with-durable-functions/images/durablefrontend.jpg)
<figcaption>The durable dungeon front end</figcaption>

I wrote the front end to illustrate how an application might interact with durable functions, doing things like posting to endpoints, querying status and relaying the game state to the end user.

Although this example used a game concept for fun, the code demonstrates how to implement patterns that are common in the enterprise. For example, external events correlation may be just what is needed to track the status of inventory in a warehouse. You can explore that example in our <i class="fab fa-github"></i> [Tailwind Traders repository](https://github.com/microsoft/IgniteTheTour/tree/master/DEV%20-%20Building%20your%20Applications%20for%20the%20Cloud/DEV50).

Azure Functions don’t have to be constrained by external dependencies or avoided just because they implement long-running workflows. If the compute time is relatively low and the architecture makes sense for your solution, consider tapping into the power of durable functions to extend the capabilities of your serverless workflows.

Curious to learn more? Check out this interactive, hands-on walk through to build a workflow from scratch: [Create a long-running serverless workflow with Durable Functions](https://docs.microsoft.com/en-us/learn/modules/create-long-running-serverless-workflow-with-durable-functions/?utm_source=jeliknes&utm_medium=blog&utm_campaign=azuremedium&WT.mc_id=azuremedium-blog-jeliknes).

Regards,

![Jeremy Likness](/images/jeremylikness.gif)
