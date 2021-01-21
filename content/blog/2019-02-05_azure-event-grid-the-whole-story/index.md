---
title: "Azure Event Grid: The Whole Story"
author: "Jeremy Likness"
date: 2019-02-05T16:31:02.515Z
years: "2019"
lastmod: 2019-06-13T10:45:32-07:00
toc: true
canonicalUrl: "https://medium.com/microsoftazure/azure-event-grid-the-whole-story-4b7b4ec4ad23"

description: "Learn about Azure Event Grid for event-driven cloud computing with massive scale and high availability. See how to send and consume messages both inside and outside of Azure, including custom code."

subtitle: "A thorough look at the serverless backbone for all of your event-driven computing needs."
tags:
 - Azure 
 - Cloud 
 - Messaging 
 - Azure Event Grid 
 - Pub Sub 

image: "/blog/2019-02-05_azure-event-grid-the-whole-story/images/1.png" 
images:
 - "/blog/2019-02-05_azure-event-grid-the-whole-story/images/1.png" 
 - "/blog/2019-02-05_azure-event-grid-the-whole-story/images/2.png" 
 - "/blog/2019-02-05_azure-event-grid-the-whole-story/images/3.gif" 
 - "/blog/2019-02-05_azure-event-grid-the-whole-story/images/4.png" 


aliases:
    - "/azure-event-grid-the-whole-story-4b7b4ec4ad23"
---

[Azure Event Grid](https://docs.microsoft.com/en-us/azure/event-grid/overview?WT.mc_id=azuremedium-blog-jeliknes) is a cloud service that provides infrastructure for event-driven computing. Event Grid focuses on **events** or messages that declare, “something happened.” It is not designed for **commands** that imply “something will happen.” The service allows you to send messages, route them to endpoints, and consume them with custom code. It enables near real-time delivery (typically less than one second) at scale (thousands of events per second).

Most Azure services automatically send messages through Event Grid and many can directly consume messages “out of the box.” Event Grid also supports posting to secure web API endpoints to deliver messages and uses the [WebHook](https://docs.microsoft.com/en-us/azure/event-grid/event-handlers?WT.mc_id=azuremedium-blog-jeliknes#webhooks) standard for delivering messages. Therefore, any language or platform that supports posting to a web endpoint and consuming an HTTP payload is capable of working with Event Grid.

![Event Grid Logo](/blog/2019-02-05_azure-event-grid-the-whole-story/images/1.png)
<figcaption>Azure Event Grid</figcaption>

Azure Event Grid supports a “push model.” Your application will never have to ask or “poll” for events. Instead, events are delivered immediately to an endpoint that you specify. This means your code can respond to events as they happen. In many cases it can also lead to cost savings because it removes the overhead of polling on a regular basis and instead triggers code only when it is needed to consume an event.

The infrastructure is fully managed through a serverless model: it automatically scales to meet your demands and only bills when you are actively using the service. To illustrate the billing model, consider that five million events are published during the month to two active subscriptions. One of the subscriptions has a filter for “[advanced match](https://docs.microsoft.com/en-us/azure/event-grid/event-filtering?WT.mc_id=azuremedium-blog-jeliknes)” of messages coming in, resulting in one million messages passing the filter. One service handler goes down for a period, missing one million messages (so the delivery attempt fails). Event Grid is built to redeliver all of those messages after the service comes back up. The cost comes out to $10.14 USD for the month.

![Screenshot of SLAs](/blog/2019-02-05_azure-event-grid-the-whole-story/images/2.png)
<figcaption>Example serverless pricing for Azure Event Grid</figcaption>

You can explore pricing further by using the 💰[Azure Pricing Calculator](https://azure.microsoft.com/en-us/pricing/calculator/?WT.mc_id=azuremedium-blog-jeliknes). For the cost, Event Grid provides guaranteed delivery in a 24-hour window (with option to save undelivered messages) and 99.99% availability.

Now that we’ve introduced what Event Grid is, let’s dig into some examples of how you would use it in practice. After an application updates a status, it may raise a message “status was changed.” This then allows you to consume the message to integrate with other systems, kick off workflows and synchronize data.

The following diagram represents an example of a serverless application that uses Event Grid, taken from a session in [Microsoft Ignite | The Tour](https://github.com/Microsoft/IgniteTheTour?WT.mc_id=azuremedium-blog-jeliknes). We will use this example to explore Event Grid concepts and terminology.

![Chart of components of application](/blog/2019-02-05_azure-event-grid-the-whole-story/images/3.gif)
<figcaption>Reference application</figcaption>

In this example application, the command line interface (CLI) tool is responsible for uploading images and updating a table of SKUs. A SKU is a stock-keeping unit and represents a unit of inventory. The CLI raises several events related to the lifecycle of a SKU:

* **Added** — a new SKU is added to the system
* **ImageSet** — an image of the SKU is uploaded
* **PriceSet** — the price of the SKU is established
* **DescriptionSet** — the description of the SKU has been verified

In response to the events, three workflows are kicked off:

* A SKU workflow that tracks various messages until it can be marked “complete”
* An email workflow that sends a message to the operations manager to ensure the SKU is handled properly
* A machine learning workflow that provides a machine-generated description when the image is uploaded

The important thing to note is that all these processes are built independently of the main application. After it sends the appropriate messages, the rest of the application can be built independently with multiple workflows kicked off by the same messages. This enables not only application scale, but the ability to scale development teams as the product grows.

<i class="fab fa-github"></i>  [Access the GitHub repository for the Tailwind Traders example](https://github.com/Microsoft/IgniteTheTour/tree/master/DEV - Building your Applications for the Cloud/DEV50?WT.mc_id=azuremedium-blog-jeliknes)

## Terminology

There are several concepts that are useful to understand when working with Event Grid.

* **Events** — what happened (i.e. “file was uploaded” or “SKU was added”)
* **Event Publishers** — where the event happened (i.e. “web app” or “blob storage” or “CLI tool”)
* **Topics** — a channel for related events (i.e. “storage events” or “inventory events”)

    ![Screenshot of topics dropdown](/blog/2019-02-05_azure-event-grid-the-whole-story/images/4.png)
    <figcaption>Available topics for Event Grid</figcaption>

* **Event Subscriptions** — how to receive events. A subscription informs Event Grid that an event should be routed to a handler. A single event can have multiple subscriptions, and subscriptions are named so they can be unsubscribed later if need be.
* **Event Handlers** — the app or service that receives and responds to the event (i.e. “Azure Function” or “Azure Logic App” or “my custom Ruby on Rails app”)

Native Azure services have predefined topics and already publish messages. These messages are available for you to subscribe to from the appropriate source. For custom topics, you simply create your Event Grid topic and then begin publishing and setting up subscriptions. The topic has an endpoint to publish messages and a set of keys for secure access. There are many other features and available options for configuring Event Grid to meet your specific needs.

## Walk Through

The following section provides video to illustrate the various features available with Azure Event Grid.

> Note: all the following videos have no audio.

### Consume Azure-sourced events with Azure Functions

In this video, an [Azure Function](https://docs.microsoft.com/en-us/azure/azure-functions/?WT.mc_id=azuremedium-blog-jeliknes) is created with an Event Grid trigger (it is called by Event Grid for a subscription). The subscription is added to Azure Storage, so that whenever a file is uploaded to blob storage, the function is triggered.

{{<youtube NXwoLZdSogk>}}

### Consume Azure-sourced events with Azure Storage Queues

As another example of how Azure services are built ready to consume Event Grid events, this video shows how to consume events using [Azure Storage Queues](https://docs.microsoft.com/en-us/azure/storage/queues/storage-queues-introduction?WT.mc_id=azuremedium-blog-jeliknes).

{{<youtube J1VtvSL48A8>}}

### Create a Custom Topic

This video shows how to create a custom Event Grid topic.

{{<youtube evrrD9vZINA>}}

The [Event Grid SDK](https://docs.microsoft.com/en-us/azure/event-grid/sdk-overview?WT.mc_id=azuremedium-blog-jeliknes) is available for many popular languages and platforms. The library makes it easy to authenticate and publish messages. In this .NET Core example, a payload with information about a SKU event is wrapped in a message and published.

{{<highlight CSharp>}}
public async Task RaiseEvent(SkuMessageType type, IInventoryItem item)
{
    var eventPayload = SkuNotification.Create(type, item);

    var events = new List<EventGridEvent>()
    {
        new EventGridEvent
        {
            Id = Guid.NewGuid().ToString(),
            EventType = type.ToString(),
            Data = eventPayload,
            EventTime = DateTime.Now,
            Subject = item.Sku,
            DataVersion = "2.0"
        }
    };
    var topicHostname = new Uri(endPoint).Host;
    var topicCredentials = new TopicCredentials(key);
    var client = new EventGridClient(topicCredentials);

    await client.PublishEventsAsync(topicHostname, events);
    Console.WriteLine($"Raised successfully.");
}
{{</highlight>}}

It is not necessary to use the SDK. Any language or platform that supports setting an authentication header and issuing an HTTP POST is capable of publishing to Event Grid. This is the .NET Core code to publish without using the SDK.

<i class="fab fa-github"></i> [Access the GitHub repository for the “//build Event Grid” example](https://github.com/JeremyLikness/build-event-grid?WT.mc_id=azuremedium-blog-jeliknes)

{{<highlight CSharp>}}
private static async Task SendEvent(string msg)
{
    List<object> events = new List<object>();
    dynamic payload = new JObject();
    payload.Id = Guid.NewGuid().ToString();
    payload.EventType = "BuildMessage";
    payload.Subject = msg;
    payload.EventTime = DateTimeOffset.Now.ToString("o");
    payload.Data = new JObject();
    payload.Data.message = msg;
    events.Add(payload);
    var content = JsonConvert.SerializeObject(events);
    Console.WriteLine(content);
    var client = new HttpClient();
    client.DefaultRequestHeaders.Add("aeg-sas-key", Key);
    var httpContent = new StringContent(content, Encoding.UTF8, "application/json");
    var result = await client.PostAsync(Endpoint, httpContent);
    var resultText = await result.Content.ReadAsStringAsync();
    Console.WriteLine($"Response: {result.StatusCode} - {resultText}.");
}
{{</highlight>}}

The code for the handler has two responsibilities. The first is to honor a validation handshake. To avoid spamming endpoints with messages, Event Grid requires a handler to “opt-in” to a subscription. It will post a special validation request with a unique token that must be echoed back. If this doesn’t happen, no further messages will be sent to the handler. The second responsibility is to simply parse messages as they come in.

The following code is part of an ASP.NET Core MVC app. The controller exposes an endpoint to receive the messages. It will echo back the validation token for subscriptions and write the contents of the payload to the application logs for incoming messages.

{{<highlight CSharp>}}
[HttpPost]
public IActionResult Post([FromBody]EventGridEvent[] value)
{
    if (value == null || value.Length != 1 || value[0].Data == null)
    {
        _logger.LogError("Bad event.");
        return BadRequest();
    }

    _logger.LogInformation($"Received event with type {value[0].EventType}");

    if (value[0].EventType == "Microsoft.EventGrid.SubscriptionValidationEvent")
    {
        var subscriptionValidation = value[0].Data.ToObject<SubscriptionValidationEvent>();
        _logger.LogInformation($"Validating subscription with token {subscriptionValidation.ValidationCode}");

        return Ok(new SubscriptionValidationResponse
        {
            ValidationResponse = subscriptionValidation.ValidationCode   
        });
    }

    _logger.LogInformation($"Parsing payload {value[0].Data}...");
    var msg = value[0].Data["message"].ToString();
    _logger.LogInformation($"Received message: {msg}");

    return Ok();
}
{{</highlight>}}

These examples in .NET Core can easily be implemented in Go, Node.js, Ruby, Python, or any other language.

### Manually Validate a Subscription

Sometimes it may not be possible to modify the handler to echo a validation request back. When requesting validation, Event Grid sends an optional validation URL that can be used instead. It expires after several minutes. The URL can be accessed using the GET method, so it is suitable for either automatically validating in code (for example, by a third-party process that examines the application logs and issues the request) or manually by pasting it into the browser. This video demonstrates manual validation.

{{<youtube h2Xlwpw_7eM>}}

### Configure and Verify Delivery Retries

Event Grid guarantees delivery within a 24-hour window. If a handler goes down for any reason, Event Grid will continue to retry until the delivery window expires. This video shows how to configure the delivery time frame and retry count and verify that guaranteed delivery works by bringing a handler down, issuing a message, then bringing it back up to confirm delivery.

{{<youtube -7PMI2S39X8>}}

### Configure Event Grid to Save Undelivered Messages in Azure Storage

If a handler is not able to recover in a 24-hour window, Event Grid will stop trying to deliver those messages. It is possible to configure Event Grid to store “dead letters” (messages that could not be delivered) in storage. This way you can parse the missed messages and event replay them once the handler is back up and running. This video shows how to configure and confirm dead letter delivery.

{{<youtube SDCSqzBJVqc>}}

### Configure Event Grid to Use the Open CloudEvents Message Schema

Event Grid uses a proprietary schema to wrap messages. The Event Grid team worked with the [Cloud Native Computing Foundation (CNCF)](https://www.cncf.io/?WT_mc_id=azuremedium-blog-jeliknes) to create an open standard for cloud messaging called [CloudEvents](https://cloudevents.io/?WT.mc_id=azuremedium-blog-jeliknes). The following video shows how to configure Event Grid to use the CloudEvents schema instead of the proprietary one.

{{<youtube YtleFM0tZxk>}}

### Consume Event Grid Messages from Azure Logic Apps

The final video shows an alternate way to consume events via [Azure Logic Apps](https://docs.microsoft.com/en-us/azure/logic-apps/?WT.mc_id=azuremedium-blog-jeliknes) to kick of integrations and workflows.

> Tip: the example uses the Event Grid schema to parse information from the header. The `Data` portion (payload) can contain custom properties depending on the event, so it’s not available to parse automatically. Logic Apps provides a [Parse JSON connector](https://docs.microsoft.com/en-us/azure/logic-apps/logic-apps-content-type?WT.mc_id=azuremedium-blog-jeliknes#applicationjson) that allows you to specify the schema of the payload and parse its information in later steps.

{{<youtube dy0HMl9RnVg>}}

## Summary

In this article you learned about Azure Event Grid, one component of the [Azure serverless platform](https://docs.microsoft.com/en-us/dotnet/architecture/serverless/) that provides the infrastructure for event-based applications. You calculated how Event Grid bills per operation, explored terminology and concepts behind Event Grid, and studied an example serverless application that uses Event Grid. The walk through demonstrated how to use various features from publishing and subscribing to configuring delivery retries and capturing undelivered messages in storage.

A major benefit of Event Grid is the ability to manage all of your events in one place. It was also built to reliably handle massive scale. You get the benefits of publishing and subscribing to messages without the overhead of setting up the necessary infrastructure yourself.

👍🏻 You can learn more about Azure Event Grid and get started by visiting the comprehensive [Event Grid documentation](https://docs.microsoft.com/en-us/azure/event-grid/overview?WT.mc_id=azuremedium-blog-jeliknes).

<i class="fab fa-github"></i> [Access the GitHub repository for the Tailwind Traders example](https://github.com/Microsoft/IgniteTheTour/tree/master/DEV - Building your Applications for the Cloud/DEV50?WT.mc_id=azuremedium-blog-jeliknes)

<i class="fab fa-github"></i> [Access the GitHub repository for the “//build Event Grid” example](https://github.com/JeremyLikness/build-event-grid?WT.mc_id=azuremedium-blog-jeliknes)
