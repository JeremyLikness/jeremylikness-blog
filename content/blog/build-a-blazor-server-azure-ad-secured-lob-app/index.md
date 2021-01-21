---
title: "Build an Azure AD Secured Blazor Server Line of Business App"
author: "Jeremy Likness"
date: 2020-06-20T00:17:06-07:00
years: "2020"
lastmod: 2020-06-20T00:17:06-07:00

draft: false
comments: true
toc: true

series: Blazor and EF Core

subtitle: "Look, Ma, it's easy with shared libraries!"

description: "Build a Blazor Server line of business app on top of an existing set of libraries with Azure Active Directory authentication. Features sorting, filtering, auditing, optimistic concurrency and more, with a control UI that is shared between client and server projects."

tags:
 - WebAssembly 
 - EF Core
 - Blazor
 - .NET Core

image: "/blog/build-a-blazor-server-azure-ad-secured-lob-app/images/appsnap.jpg" 
images:
 - "/blog/build-a-blazor-server-azure-ad-secured-lob-app/images/appsnap.jpg" 
 - "/blog/build-a-blazor-server-azure-ad-secured-lob-app/images/createserver.jpg" 
 - "/blog/build-a-blazor-server-azure-ad-secured-lob-app/images/useraudit.jpg" 
---
I built the [Blazor Server EF Core Example](https://github.com/JeremyLikness/BlazorServerEFCoreExample) application on top of my existing work on Blazor WebAssembly as a learning tool and starting point for line of business applications. This project implements many features often found in line of business apps, like filtering and sorting, auditing and concurrency resolution. To get started with the application, visit the repo then follow the instructions. The rest of this blog post will explain the functionality and how it was implemented.

{{<github "JeremyLikness/BlazorServerEFCoreExample">}}

Much of the groundwork for this project was already laid in client example. If you haven't read that series yet, you can start here:

{{<relativelink "/blog/build-a-blazor-webassembly-line-of-business-app">}}

## Prior Art

The server solution relies on the libraries already built for the client solution. These include:

* A **model** project
* A **basic repository** project
* A **data access** layer that uses [Entity Framework Core](https://docs.microsoft.com/en-us/ef/?utm_source=jeliknes&utm_medium=blog&utm_campaign=blazorserverefcore&WT.mc_id=blazorserverefcore-blog-jeliknes)
* A **repository** implementation that uses the data access layer
* A **Razor class library** that hosts UI and UI logic

To get started, I created an empty solution file and initialized a [git submodule](https://git-scm.com/book/en/v2/Git-Tools-Submodules?utm_source=jeliknes&utm_medium=blog&utm_campaign=blazorserverefcore&WT.mc_id=blazorserverefcore-blog-jeliknes) to reference the previous project.

```
git submodule add https://github.com/jeremylikness/blazorwasmefcoreexample
git submodule init
git submodule update
git pull
```

This links my current repo to the other. The submodule links at a certain commit level unless you manually refresh it, so you can "opt-in" to changes. After loading the source from the other project, I added all the projects to the current solution by using "add existing project" and navigating to the `.csproj` files:

```
BlazorWasmEFCoreExample\ContactsApp.Model\ContactsApp.Model.csproj
BlazorWasmEFCoreExample\ContactsApp.DataAccess\ContactsApp.DataAccess.csproj
BlazorWasmEFCoreExample\ContactsApp.BaseRepository\ContactsApp.BaseRepository.csproj
BlazorWasmEFCoreExample\ContactsApp.Repository\ContactsApp.Repository.csproj
BlazorWasmEFCoreExample\ContactsApp.Controls\ContactsApp.Controls.csproj
```

## Secure Blazor Server

Next, I created a new Blazor Server project and chose the option for "Work or School Accounts" and set up my active directory domain.

![Create new project](/blog/build-a-blazor-server-azure-ad-secured-lob-app/images/createserver.jpg)

I ran the project to make sure it was working fine and was immediately authenticated. I did a little code cleanup from the default template:

* Deleted the data folder
* Deleted the `FetchData.razor` and `Counter.razor` pages
* Deleted the `SurveyPrompt.razor` component
* Removed the `WeatherForecastService` registration in the `Startup.cs`

I added the connection string for the database to `appsettings.json`. Then I went into the NuGet package manager and added a package reference to `Microsoft.EntityFrameworkCore.SqlServer` for the server project. This pulls in the SQL Server provider. To plug into the existing libraries, I added references to the `ContactsApp.Repository` and `ContactsApp.Controls` project. These references indirectly pull in the other projects necessary.

## Dependencies

In `Startup.cs` I registered the necessary dependencies.

```csharp
services.AddDbContextFactory<ContactContext>(opt =>
    opt.UseSqlServer(
        Configuration.GetConnectionString(ContactContext.BlazorContactsDb))
    .EnableSensitiveDataLogging());
services.AddScoped<IRepository<Contact, ContactContext>,
    ContactRepository>();
services.AddScoped<IBasicRepository<Contact>>(sp =>
    sp.GetService<IRepository<Contact, ContactContext>>());
services.AddScoped<IUnitOfWork<Contact>, UnitOfWork<ContactContext, Contact>>();
services.AddScoped<SeedContacts>();
ervices.AddScoped<IPageHelper, PageHelper>();
services.AddScoped<IContactFilters, ContactFilters>();
services.AddScoped<GridQueryAdapter>();
services.AddScoped<EditService>();
services.AddScoped(sp =>
{
    var provider = sp.GetService<AuthenticationStateProvider>();
    var state = provider.GetAuthenticationStateAsync().Result;
    return state.User.Identity.IsAuthenticated ?
        state.User : null;
});
```

The only interesting thing to note here is the last registration. The app depends on an instance of `ClaimsPrincipal` for user audit, so I use the `AuthenticationStateProvider` to retrieve the logged-in user. This will work for most authentication scenarios; it just happens to be Azure Active Directory for this app. The first time it is requested, the user will resolve, then the same user will be present for the rest of that session. If I used "transient" it would make an expensive call every time I load a new page or component that depends on identity, and if I used "singleton" it would register the first user for _all_ users of the application, which is definitely _not_ desired.

## A Question of Style

For maximum reuse, the main stylesheet is embedded in the `ContactsApp.Controls` project. The same reference from `index.html` in the WebAssembly project is placed in `_Host.cshtml` for the server project:

```html
<link href="_content/ContactsApp.Controls/contacts.css" rel="stylesheet" />
```

To make life easy with referencing controls, I added these using statements to `_Imports.razor` which makes them global:

```csharp
@using ContactsApp.Controls;
@using ContactsApp.Controls.Grid;
```

By this time, I was eager to see if things were working, so I updated `Index.cshtml` to look like this:

```html
@page "/"
@page "/{Page:int}"

@using Microsoft.AspNetCore.Authorization
@using ContactsApp.BaseRepository
@using ContactsApp.Model
@using ContactsApp.DataAccess
@using System.Security.Claims

@inject SeedContacts Seed
@inject ClaimsPrincipal User
@inject IContactFilters Filters

@attribute [Authorize]

<ListControl Page="Page"
             FetchContactsAsync="(repo, contacts) => FetchAsync(repo, contacts)" />
```
```csharp
@code {
    [Parameter]
    public int Page { get; set; }

    public async Task FetchAsync(IBasicRepository<Contact> repo,
        Action<ICollection<Contact>> contacts)
    {
        ICollection<Contact> contactList = null;
        var adapter = new GridQueryAdapter(Filters);
        await repo.QueryAsync(
            async query => contactList = await adapter.FetchAsync(query));
        contacts(contactList);
    }

    protected override async Task OnInitializedAsync()
    {
        await Seed.CheckAndSeedDatabaseAsync(User);
        await base.OnInitializedAsync();
    }
}
```

This is essentially the same as the client app, with one key difference. Instead of wiring the `ListControl` to the client service that used Web API to fetch the contacts page from the server, I can wire it directly to the repository. I simply copied the code from the controller to the code-behind for the index page. I ran the app, and everything worked as planned. I was even able to delete a contact. I also use this control to seed the database the first time so you can "fetch and run" without dealing with migrations.

I noticed the navigation menu was incorrect (leftover from the template), so I updated the shared `NavMenu.razor` component for the app:

```html
<li class="nav-item px-3">
    <NavLink class="nav-link" href="" Match="NavLinkMatch.All">
        <span class="oi oi-people" aria-hidden="true"></span> Contacts
    </NavLink>
</li>
<li class="nav-item px-3">
    <NavLink class="nav-link" href="add">
        <span class="oi oi-plus" aria-hidden="true"></span> Add New Contact
    </NavLink>
</li>
```

The `ViewContact.razor` component/page came next. This was one of the easiest to wire up:

```html
@page "/View/{ContactId:int}"

@using Microsoft.AspNetCore.Authorization

@attribute [Authorize]

<ViewContactControl ContactId="ContactId"/>
```
```csharp
@code {
    [Parameter]
    public int ContactId { get; set; }
}
```

I also built `EditContact.razor` from the client template, with a slight change: the unit of work expects the user to be set rather than having it injected as a dependency (probably a refactoring opportunity for later). This was easy enough to fix: I injected it into the controller and set the user on the unit of work during initialization: 

```html
@page "/edit/{ContactId:int}"

@inherits OwningComponentBase<IUnitOfWork<Contact>>

@inject ClaimsPrincipal User

@using System.Security.Claims
@using ContactsApp.Model
@using ContactsApp.BaseRepository
@using Microsoft.AspNetCore.Authorization

@attribute [Authorize]

<EditContactControl ContactId="@ContactId" Service="Service" />
```
```csharp
@code {
    protected override void OnInitialized()
    {
        Service.SetUser(User);
        base.OnInitialized();
    }
    [Parameter]
    public int ContactId { get; set; }
}
```

## Component Scope

Wait, what? Notice the component inherits from `OwningComponentBase<T>`. Why is that? ASP.NET Core has three [service lifetimes](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/dependency-injection?utm_source=jeliknes&utm_medium=blog&utm_campaign=blazorserverefcore&WT.mc_id=blazorserverefcore-blog-jeliknes&view=aspnetcore-5.0#service-lifetimes) by default:

* **Transient** provides a copy per request
* **Scoped** provides a copy per connection. In ASP.NET Core Web API apps, that is simply a call to the controller. For Blazor Server apps, it will last the duration of a user session.
* **Singleton** is shared across all application instances

The unit of work is unique because we want it to last the duration of the component. The way the edit component works is by capturing the contact and allowing EF Core's change tracking to manage state. When the update is submitted, EF Core can determine if the record has changed and throw a concurrency exception if it has. This was handled using a disconnected entity pattern in the WebAssembly app (the client held onto the concurrency token, then passed it on update). Here, we're keeping it simple and letting EF Core do the work. `OwningComponentBase<T>` provides a special scope that overrides the default behavior and provides the instance for the duration of the component. This means the same user will get a new copy when they return to that component, and the service is properly disposed of when the component goes out of scope. Learn more about it here: [utility base component classes in Blazor](https://docs.microsoft.com/en-us/aspnet/core/blazor/fundamentals/dependency-injection?utm_source=jeliknes&utm_medium=blog&utm_campaign=blazorserverefcore&WT.mc_id=blazorserverefcore-blog-jeliknes&view=aspnetcore-5.0#utility-base-component-classes-to-manage-a-di-scope).

Finally, another simple component/page for `AddContact.razor`:
 
```html
@using Microsoft.AspNetCore.Authorization

@page "/add"

@attribute [Authorize]

<AddContactControl />
```

Look, no code!

## Audits

After testing the application and verifying that it successfully adds, updates, deletes, validates, etc. I headed over to the database to check on audits. This is what I saw:

![Audit rows](/blog/build-a-blazor-server-azure-ad-secured-lob-app/images/useraudit.jpg)

The "user" here is based on the `NameIdentifier` claim from Azure Active Directory. This claim will be unique _per user per app_. If you set up a different application, the same user will have a different unique identifier. It is enough to show uniqueness by users, but not enough to tie the user back to their Active Directory account. If you need to trace the user back to the account, you can choose other claims or configure the application to use a different name identifier. Learn more by reading: [How to customize Azure AD claims](https://blog.jeremylikness.com/?utm_source=jeliknes&utm_medium=redirect&utm_campaign=jlik_me). The logic for determining the "name" is in the `ContactAuditAdapter` class.

## Summary

I had several goals behind this set of projects. First, I wanted to provide a solid reference example with features frequently used in enterprise line of business apps. Second, I wanted to demonstrate the appropriate use of EF Core in Blazor apps. The guidance that will be coming soon to the official documentation is this:

* Use a single context per operation, unless
* You are using change tracking or concurrency, then use a context per component with `OwningComponentBase`, or 
* Use the disconnected entities pattern to save concurrency tokens (as I do in the client WebAssembly app).

The last thing I wanted to show was an approach to maximize code reuse. The project will allow you to reuse the model across any .NET projects (including edge devices and mobile), data access and repositories across _most_ .NET Core projects (including Xamarin, WPF, and WinForms), and a set of UI components that are reusable between the client and server versions of Blazor.

As always, your feedback is both desired and welcomed.

Regards,

![Jeremy Likness](/images/jeremylikness.gif)
