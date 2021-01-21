---
title: "Blazor State Management"
author: "Jeremy Likness"
date: 2020-01-14T06:03:07-08:00
years: "2020"
lastmod: 2020-01-14T06:03:07-08:00

draft: false
comments: true
toc: true

subtitle: "Don't forget to add memory to your Blazor apps"

description: "Blazor Server and Blazor WebAssembly (client) don't store state by default, resulting in a subpar user experience. Learn what makes up state in Blazor apps and discover solutions implemented in shared, easy to use libraries that take advantage of browser cache and server persistence to solve Blazor state management."

tags:
 - Blazor 
 - .NET
 - ASP.NET
 - State 

image: "/blog/blazor-state-management/images/blazor-architecture.png" 
images:
 - "/blog/blazor-state-management/images/blazor-architecture.png" 
 - "/blog/blazor-state-management/images/localstorage.png" 
---
Imagine for a moment you are filling out the world's longest form. You've spent 30 minutes entering detailed information from your address to your date of birth to a list of the last seven countries you visited. You click the "submit" button and are immediately rewarded with a "The connection has been lost" message. No worries, right? Simply click the back button and ... _oh, no!_ The form is **empty**. You sound your barbaric yalp and pledge never to revisit the site again.

This is _not_ the experience you want for your website visitors. Therefore, it is important to understand how to manage state in Blazor apps. Managing state while minimizing the amount of code you must write to manage state? "Yes, please!"

Watch the related video <i class="fab fa-youtube"></i>: [State Management in Blazor Apps](https://youtu.be/zjlUstW7ISU)

{{<youtube zjlUstW7ISU>}}

## Definition of Blazor State

First, let's be clear on what we mean by "state" in a Blazor app. For the best possible user experience, it's important to provide a consistent experience to the end user when their connection is temporarily lost and when they refresh or navigate back to the page. The components of this experience include:

* The HTML Document Object Model (DOM) that represents the user interface (UI)
* The fields and properties representing the data being input and/or output on the page
* The state of registered services that are running as part of code for the page

In the absence of any special code, state is maintained in two places depending on the [Blazor hosting model](https://docs.microsoft.com/en-us/aspnet/core/blazor/hosting-models?utm_source=jeliknes&utm_medium=blog&utm_campaign=blazorstate&WT.mc_id=blazorstate-blog-jeliknes&view=aspnetcore-5.0). For Blazor WebAssembly (client-side) apps, state is held in browser memory until the user refreshes or navigates away from the page. In Blazor Server apps, state is held in special "buckets" allocated to each client session known as _circuits_. These circuits can lose state when they time out after a disconnection and may be obliterated even during an active connection when the server is under memory pressure.

## The Reference App

To illustrate the nuances of state, I started with the [Blazor Health App](/blog/2019-01-03_from-angular-to-blazor-the-health-app):

{{<relativelink "/blog/2019-01-03_from-angular-to-blazor-the-health-app">}}

I extended it to include two pages to illustrate some nuances of navigation. In the related GitHub repository:

{{<github "JeremyLikness/BlazorState">}}

There are several sample projects. The problem manifests differently in Blazor WebAssembly and Blazor Server projects.

### State in Blazor WebAssembly

In Blazor WebAssembly (client projects) the state is held in memory. This means a refresh or forced navigation will destroy state. To see this in action:

1. Set `BlazorState.Wasm` as the startup project and run it.
2. Update the form information.
3. Navigate to "results" and verify the same results exist.
4. Navigate back to "home" and force a refresh (usually `CTRL+F5`). Note the form reverts to defaults.
5. Update the form information, then manually navigate by adding `/results` to the URL bar in your browser and press `ENTER`. Note it also uses defaults.

Not a great experience! With Blazor Server, it's slightly different.

### State in Blazor Server

Change the startup project to `BlazorState.Server` and run that project. Try the same steps you did for the client version and note the state is maintained because it is held in the server memory. While the app is open, stop and restart the web server. You should see a disconnect message. After the server comes back up, click the "reload" option and note that although the app recovers, it loses all its state.

Now we have a problem. Let's work on the solution!

### Solutions Architecture

The following solutions uses an approach to architecture designed to maximize reuse. The `Blazor.ViewModel` project hosts an interface, properties and business logic for the app. It is a .NET Standard library implementation of the [Model-View-ViewModel (MVVM) pattern](/blog/model-view-viewmodel-mvvm-explained/) that can be comfortably referenced by any type of .NET Core project, from WPF to Xamarin and even Blazor. Maximum reuse!

For UI and user experience logic, as well as shareable assets such as images, stylesheets, JavaScript code and even Razor view components, `Blazor.Shared` takes advantage of [Razor Class Libraries](https://docs.microsoft.com/en-us/aspnet/core/razor-pages/ui-class?utm_source=jeliknes&utm_medium=blog&utm_campaign=blazorstate&WT.mc_id=blazorstate-blog-jeliknes&view=aspnetcore-5.0). The solution implements a `HealthModelBase` to avoid duplicate MVVM code. It also implements all the state management solutions described here as services and/or components that are easily applied to both Blazor WebAssembly and Blazor Server projects. This further maximizes code reuse, as the "host" projects simply provide some structure to reference the share components and resources.

![Blazor Architecture](/blog/blazor-state-management/images/blazor-architecture.png)

Now that I've covered the problem and the approach for solutions, let's move on to managing state in our Blazor app!

## Service Registration

The first step may not be so obvious, but for the sake of being thorough I want to address services. To see this in action, create a new Blazor client app and run it. The built-in template provides a few pages with simple navigation. Navigate to the `Counter` page and increment the counter. Now, navigate away from the page and come back. The counter resets to zero! This is because the state of the counter is held in the component, so it is reset each time the component is initialized:

{{<highlight HTML>}}
<h1>Counter</h1>
<p>Current count: @currentCount</p>
<button class="btn btn-primary" @onclick="IncrementCount">Click me</button>
{{</highlight>}}

{{<highlight CSharp>}}
private int currentCount = 0;
private void IncrementCount()
{
    currentCount++;
}
{{</highlight>}}

To maintain state "in memory" (or "in circuit" for Blazor Server) you can create a counter "service":

{{<highlight CSharp>}}
public class CounterService
{
    public int Count { get; private set; }
    public void Increment()
    {
        Count += 1;
    }
}
{{</highlight>}}

Register the service in `Program.cs`:

{{<highlight CSharp>}}
builder.Services.AddSingleton<CounterService, CounterService>();
{{</highlight>}}

...then remove the code-behind in the `@code` block in `Counter.razor`, inject the counter service and data-bind directly:

{{<highlight HTML>}}
@inject CounterService Svc
<h1>Counter</h1>
<p>Current count: @Svc.Count</p>
<button class="btn btn-primary" @onclick="Svc.Increment">Click me</button>
{{</highlight>}}

The service will persist in memory when the components are destroyed/recreated and maintain a consistent count even when you navigate. This is the first step to maintain state. The reference app registers the main viewmodel in this fashion.

## Browser Cache

One option to maintain state is to take advantage of the browser cache using [HTML5 Web Storage](https://www.w3schools.com/html/html5_webstorage.asp). The API is very simple. The `stateManagement.js` file in `BlazorState.Shared` defines a simple, globally accessible interface. It uses the `localStorage` JavaScript API, but you may choose to use `sessionStorage` instead.

{{<highlight JavaScript>}}
window.stateManager = {
    save: function (key, str) {
        localStorage[key] = str;
    },
    load: function (key) {
        return localStorage[key];
    }
};
{{</highlight>}}

This is included in the root `index.html` for Blazor WebAssembly projects and `_Host.cshtml` for Blazor Server projects. Including shared assets is as simple as using the path:

 `_content/{assembly}/path_to_file`:

{{<highlight HTML>}}
<script src="_content/BlazorState.Shared/stateManagement.js"></script>
{{</highlight>}}

Blazor's component model makes it simple to create a "wrapper" component that manages the state changes. This is implemented in `StorageHelper.razor`. First, the using statements reference the viewmodel, JavaScript interoperability, and the JSON serializer. The implementations are injected.

{{<highlight CSharp>}}
@using BlazorState.ViewModel;
@using Microsoft.JSInterop;
@using System.Text.Json;
@inject IJSRuntime JsRuntime
@inject IHealthModel Model
{{</highlight>}}

The template just wraps the child components and renders them when the state is loaded.

{{<highlight HTML>}}
@if (hasLoaded)
{
    @ChildContent
}
else
{
    <p>Loading...</p>
}
{{</highlight>}}

After the component is initialized, the code attempts to load the viewmodel from the cache:

{{<highlight CSharp>}}
string vm;
try
{
    vm = await JsRuntime.InvokeAsync<string>("stateManager.load", nameof(HealthModel));
}
catch(InvalidOperationException)
{
    return;
}
{{</highlight>}}

In Blazor Server, the components are pre-rendered on the server. JavaScript is not available, so the interop call will throw an `InvalidOperationException`. This is caught the first time. The second call happens from the client and will succeed if the viewmodel is cached. After the JSON for the viewmodel is loaded from cache, it is deserialized and the properties are moved to the global viewmodel instance.

{{<highlight CSharp>}}
var viewModel = JsonSerializer.Deserialize<HealthModel>(vm);
if (viewModel != null)
{
    isDeserializing = true;
    Model.AgeYears = viewModel.AgeYears;
    Model.HeightInches = viewModel.HeightInches;
    Model.IsFemale = viewModel.IsFemale;
    Model.IsImperial = viewModel.IsImperial;
    Model.WeightPounds = viewModel.WeightPounds;
    isDeserializing = false;
}
{{</highlight>}}

The `isDeserializing` flag is important to avoid an infinite loop, as you can see in the next code that registers for property change notifications:

{{<highlight CSharp>}}
Model.PropertyChanged += async (o, e) =>
{
    if (isDeserializing)
    {
        return;
    }
    var vmStr = JsonSerializer.Serialize(((HealthModel)Model));
    await JsRuntime.InvokeAsync<object>(
        "stateManager.save", nameof(HealthModel), vmStr);
};
hasLoaded = true;
{{</highlight>}}

If the properties on the viewmodel change, the viewmodel is serialized and stored in the cache. This is skipped when the property change was fired because of the initial load (hence the `isDeserializing` flag, otherwise it will serialize while trying to deserialize). Now the component is ready for use! Both `Blazor.ServerLocal` and `Blazor.WasmLocal` use the helper, and it is implemented the same way in `App.razor`:

{{<highlight XML>}}
<BlazorState.Shared.StorageHelper>
    <Router AppAssembly="@typeof(Program).Assembly">
        <Found Context="routeData">
            <RouteView RouteData="@routeData" DefaultLayout="@typeof(MainLayout)" />
        </Found>
        <NotFound>
            <LayoutView Layout="@typeof(MainLayout)">
                <p>Sorry, there's nothing at this address.</p>
            </LayoutView>
        </NotFound>
    </Router>
</BlazorState.Shared.StorageHelper>
{{</highlight>}}

By wrapping the router, the state management handles all pages and components in the app without having to write additional code. You can open the browser developer tools and navigate to the application "local storage" to watch the values change as you update the form.

![Serialized viewmodel](/blog/blazor-state-management/images/localstorage.png)

It is important to note that the user can access their local cache, so if you are storing sensitive values, they should be encrypted. An example of this is provided by the [Microsoft.ASpNetCore.ProtectedBrowserStorage](https://www.nuget.org/packages/Microsoft.AspNetCore.ProtectedBrowserStorage) package. 

## Server-side Management

Another way to handle state is by calling an API and persisting it on the server. How it is persisted is up to you: options range from SQL, NoSQL to simple caches like Redis. `BlazorState.WasmRemote.Server` is an ASP.NET hosted Blazor WebAssembly app. The `StateController` exposes an API that stores and retrieves the viewmodel using the remote IP address as a key. This is done to keep the demo simple; a production application with authentication would likely key to a user and/or session.

The `StateService` in `Blazor.Shared` handles making the API calls. The constructor takes in the global viewmodel instance, an instance of `IStateServiceConfig` that provides the URL of the API endpoint, and an instance of `HttpClient`. It is important to inject `HttpClient` rather than create a new instance because Blazor WebAssembly requires a version that is specifically configured to run in the browser sandbox. The constructor registers for property changed notifications from the viewmodel.

`InitAsync` is called by page components during initialization to load the viewmodel state.

{{<highlight CSharp>}}
public async Task InitAsync()
{
    _initializing = true;
    var vmJson = await _client.GetStringAsync(_config.Url);
    var vm = JsonSerializer.Deserialize<HealthModel>(vmJson, _options);
    _model.AgeYears = vm.AgeYears;
    _model.HeightInches = vm.HeightInches;
    _model.IsFemale = vm.IsFemale;
    _model.IsMetric = vm.IsMetric;
    _model.WeightPounds = vm.WeightPounds;
    _initializing = false;
}
{{</highlight>}}

The code is very similar to the client cache approach but retrieves the model from the API call rather than the local cache. The property change handler serializes and posts the model to the server:

{{<highlight CSharp>}}
private async void Model_PropertyChanged(object sender, 
    System.ComponentModel.PropertyChangedEventArgs e)
{
    if (_initializing || _config == null)
    {
        return;
    }
    var vm = JsonSerializer.Serialize(_model);
    var content = new StringContent(vm);
    content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
    await _client.PostAsync(_config.Url, content);
}
{{</highlight>}}

Set `BlazorState.WasmRemote.Server` as the startup project and run it to see this in action. You may need to update the correct URL (as the port may be different) in the `Startup.cs` implementation of `IStateServiceConfig` in the `.Client` project. With the solution running, open the network tab and note the calls as you update the form.

![Server calls](/blog/blazor-state-management/images/serverstorage.png)

The service is demonstrated for Blazor WebAssembly but will work the same for Blazor Server.

## Conclusion

Blazor is not opinionated about how you manage state. The services and component model make it easy to implement project-wide solutions. This post focused on an implementation of the Model-View-ViewModel pattern and registered for property changed notifications to handle serializing state either locally or over an API. The same approach will work if you are using a different approach such as [Redux](https://github.com/torhovland/blazor-redux). The important steps are to update your store when properties mutate and load from your state management solution when components initialize. The rest is browser history!

> <i class="fa fa-star"></i> Check out the official documentation for [ASP.NET Core Blazor state management](https://docs.microsoft.com/en-us/aspnet/core/blazor/state-management?utm_source=jeliknes&utm_medium=blog&utm_campaign=blazorstate&WT.mc_id=blazorstate-blog-jeliknes&view=aspnetcore-5.0).

Regards,

![Jeremy Likness](/images/jeremylikness.gif)
