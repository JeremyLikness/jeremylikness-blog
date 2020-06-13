---
title: "Build a Blazor WebAssembly Line of Business App Part 3: Query, Delete and Concurrency"
author: "Jeremy Likness"
date: 2020-06-13T02:06:56-07:00
years: "2020"
lastmod: 2020-06-13T02:06:56-07:00

draft: false
comments: true
toc: true

series: Blazor and EF Core

subtitle: "File, New, Enterprise Web App"

description: "Part 3 of the series that describes a fully functional real-world project built in Blazor WebAssembly with EF Core. Part 3 focuses on querying, delete, update and optimistic concurrency."

tags:
 - WebAssembly 
 - EF Core
 - Blazor
 - .NET Core

image: "/blog/build-a-blazor-webassembly-line-of-business-app-part-3/images/concurrency.jpg" 
images:
 - "/blog/build-a-blazor-webassembly-line-of-business-app-part-3/images/deleteconfirmation.jpg" 
 - "/blog/build-a-blazor-webassembly-line-of-business-app-part-3/images/paging.jpg" 
 - "/blog/build-a-blazor-webassembly-line-of-business-app-part-3/images/concurrency.jpg" 
---
I built the [Blazor WebAssembly EF Core Example](https://github.com/JeremyLikness/BlazorWasmEFCoreExample) application as a learning tool and starting point for line of business applications. I wanted to go beyond a simple "[Hello, World](/blog/2016-02-28_30-years-of-hello-world/)" demo and create an application that implements many features often found in line of business apps, like filtering and sorting, auditing and concurrency resolution. To get started with the application, visit the repo then follow the instructions. The rest of this blog post will explain the functionality and how it was implemented.

{{<github "JeremyLikness/BlazorWasmEFCoreExample">}}

This is the final part (part 3) of the series that explores the project and how it was built. In this blog post I will cover querying, delete, update and optimistic concurrency. If you haven't read the previous parts, they are available here:

{{<relativelink "/blog/build-a-blazor-webassembly-line-of-business-app">}}

{{<relativelink "/blog/build-a-blazor-webassembly-line-of-business-app-part-2">}}

## Filter with Debounce

I previously shared how the contact filters are built into the components that inherit from the custom base class. The `TextFilter` component allows the user to type in a filter that will refresh the main query page. It listens for and updates two properties: the column being filtered and the filter text. To avoid making unnecessary calls to the server while the user types, it implements a timer to "debounce" input. The user must pause for at least 300 milliseconds before the component updates the filter.

The component inherits from the `GridControlBase` class and overrides the predicate to fire a refresh only when the filter text or filter column changes.

```csharp
protected override Predicate<string> PropertyFilter =>
    str => str == nameof(Controls.FilterColumn)
    || str == nameof(Controls.FilterText);
```

To properly populate the `<select>` dropdown for columns, the `Selected` method emits the `selected` attribute for the current column. It is constructed like this:

```html
<select @bind="SelectedColumn">
    @foreach (ContactFilterColumns column in
        (ContactFilterColumns[])Enum.GetValues(typeof(ContactFilterColumns)))
    {
        <option @attributes="Selected(column)" value="@((int)column)">
            @(column.ToString())
        </option>
    }
</select>
```

The implementation of `Selected`:

```csharp
private IEnumerable<KeyValuePair<string, object>> Selected(ContactFilterColumns column)
{
    if ((int)column == selectedColumn)
    {
        return new[] { new KeyValuePair<string, object>("selected", (object)"selected") };
    }
    return Enumerable.Empty<KeyValuePair<string, object>>();
}
```

To debounce the filter, a local copy of the filter text is kept that is set on the shared filter only after the timer fires. The code disposes of any existing timers and restarts the clock anytime the filter changes. That means if the user types "a" then waits 200ms before typing "b", they will have another 300ms left before the filter is updated.

```csharp
private string filterText;

public string FilterText
{
    get => filterText;
    set
    {
        if (value != filterText)
        {
            filterText = value;
            if (timer != null)
            {
                timer.Dispose();
            }
            timer = new Timer(DebounceMs);
            timer.Elapsed += NotifyTimerElapsed;
            timer.Enabled = true;
        }
    }
}

private void NotifyTimerElapsed(object sender, ElapsedEventArgs e)
{
    timer.Dispose();
    timer = null;
    if (Controls.FilterText != filterText)
    {
        Controls.FilterText = filterText.Trim();
    }
}
```

The control implements `IDisposable` to discard any timers "in play" when the user navigates away.

The user has typed in their filter text and the controls are updated. What's next? This time we'll work our way from the client to the server.

## Query Across the Wire

The `Index.razor` page is the main component for the app. It takes a dependency on `ListControl` like this:

```html
<ListControl Page="Page"
             FetchControlsAsync="(repo, contacts) => FetchAsync(repo, contacts)" />
```

`ListControl` inherits `GridControlsBase`, so when the filter text is updated, it fires a refresh on the `ListControl`. The `Index` implementation simply tracks the current page as part of the route and provides the "glue" to wire a page fetch to the collection.

```csharp
@page "/"
@page "/{Page:int}"

[Parameter]
public int Page { get; set; }

public async Task FetchAsync(IBasicRepository<Contact> repo,
    Action<ICollection<Contact>> contacts)
{
    contacts((await repo.GetListAsync()).ToList());
}
```

Notice it simply refers to the repo `GetListAsync` method. This was not implemented on the server. On the client, it looks like this:

```csharp
public async Task<ICollection<Contact>> GetListAsync()
{
    var result = await _apiClient.PostAsJsonAsync(
        ApiQuery, _controls);
    var queryInfo = await result.Content
        .ReadFromJsonAsync<QueryResult>();

    _controls.PageHelper.Refresh(queryInfo.PageInfo);
    return queryInfo.Contacts;
}
```

The `_controls` property is a reference to the instance of `GridControls` shared by all of the components. It contains a `PageHelper` property with information about current page, page size, etc. All of the information needed to make a request is there, so the client simply posts the information to the server. The result has two parts: the updated page information (the filter may have affected the page count) and the collection of `Contact` results that match the filter. The `Refresh` extension method moves the updated page properties from the result to the instance of `PageHelper` that is shared in the application as part of the `GridControls` instance.

The `ApiQuery` prefix maps to the `QueryController` on the server. The controller method takes in the `ContactFilter` instance (same shape of data as `GridControls` on the client) and performs the work. First, it checks to see if the database is created and, if not, creates and seeds it. This is not something you would do in production, but it hopefully makes the demo sample easier to set up. After running the commands to update the identity database, you simply run the app and the first time experience a longer delay as random contacts are generated.

```csharp
[HttpPost]
public async Task<IActionResult> PostAsync(
    [FromBody] ContactFilter filter)
{
    var seed = _serviceProvider.GetService<SeedContacts>();
    await seed.CheckAndSeedDatabaseAsync(User);
    // do stuff
}
```

Next, an adapter is used to build and apply the filter. The resulting query is called to update the collection. The adapter populates the updated count and page information in the result that is returned.

```csharp
var adapter = new GridQueryAdapter(filter);
ICollection<Contact> contacts = null;
await _repo.QueryAsync(
    async query => contacts = await adapter.FetchAsync(query));
return new OkObjectResult(new
{
    PageInfo = filter.PageHelper,
    Contacts = contacts
});
```

The query adapter is in the `DataAccess` project. It uses [LINQ expressions](http://localhost:1313/blog/dynamically-build-linq-expressions/) to dynamically apply sorting, filtering, and paging. The main entry point is `FetchAsync`. Fetch builds the query, then makes a call to `CountAsync` followed by `FetchPageQuery`. The `FilterAndQuery` method builds the query.

There are two helper dictionaries. One, named `_expressions`, is indexed by a column that resolves to an instance of `Expression<Func<Contact, string>>`. It turns out all of the sortable and filterable columns are strings, so they all fall into the same expression signature. Note we are not calling the function but using it's "shape" as an expression to build the query.

```csharp
{ ContactFilterColumns.City, c => c.City }
```

The city column references and expression that retrieves the value of city. The `_filterQueries` dictionary defines the strategy to filter columns. It is also indexed by the column being filtered on, and references a `Func<IQueryable<Contact>, IQueryable<Contact>>`. This takes a queryable, builds on it and returns the updated queryable.

Here's the entry for the name column. Notice that it filters on both first name and last name.

```csharp
{ ContactFilterColumns.Name,
    cs => cs.Where(c => c.FirstName.Contains(_controls.FilterText) ||
    c.LastName.Contains(_controls.FilterText)) }
```

Now we can make sense of the `FilterAndQuery` method. Starting with an `IQueryable<Contact>`, let's assume that the filter column is "name" and the sort is "city" with "descending." First, the filter is applied:

```csharp
var filter = _filterQueries[_controls.FilterColumn];
root = filter(root);
```

This turns our query into:

```csharp
contacts.Where(c =>
    c.FirstName.Contains(_controls.FilterText) ||
    c.LastName.Contains(_controls.FilterText));
```

Next, the sort expression is applied. A different method is used based on ascending or descending, but this is what the code essentially translates to:

```csharp
var expression = _expressions[_controls.SortColumn];
root = root.OrderByDescending(expression);
```

Now our query looks like:

```csharp
contacts.Where(c =>
    c.FirstName.Contains(_controls.FilterText) ||
    c.LastName.Contains(_controls.FilterText))
    .OrderByDescending(c => c.City);
```

The "root" query is ready. The `CountAsync` method grabs a count of filtered contacts:

```csharp
_controls.PageHelper.TotalItemCount = await query.CountAsync();
```

Translates to:

```csharp
var totalCount = await contacts.Where(c =>
    c.FirstName.Contains(_controls.FilterText) ||
    c.LastName.Contains(_controls.FilterText))
    .OrderByDescending(c => c.City)
    .CountAsync();
```

Next, `FetchPageQuery` is called with the same query root:

```csharp
return query
    .Skip(_controls.PageHelper.Skip)
    .Take(_controls.PageHelper.PageSize)
    .AsNoTracking();
```

Assuming the client is on page three, it translates to:

```csharp
return contacts.Where(c =>
    c.FirstName.Contains(_controls.FilterText) ||
    c.LastName.Contains(_controls.FilterText))
    .OrderByDescending(c => c.City)
    .Skip(40)
    .Take(20)
    .AsNoTracking();
```

The value that EF Core provides here is the ability to parse the LINQ query, translate it to SQL and execute the query on the database. The compound payload of page count information and the page that was fetched is returned to the client, which then assigns the collection in the `ContactList` control. That control iterates each contact to produce a `ContactListRow` entry. In addition to displaying the row details, the control contains logic to delete the row. Delete is covered in the next section.

The `ListControl` includes a reference to `Pager` that shows the paging information and controls.

![Paging](/blog/build-a-blazor-webassembly-line-of-business-app-part-3/images/paging.jpg)

The component responds to changes to the grid controls (filters) by refreshing the page information and enabling or disabling the "previous" and "next" buttons. Because the page is part of the route, clicking on the buttons results in a navigation to that route. The paging component invokes a callback with the requested page, so the parent (`ListControl`) can determine the appropriate route. For this app, "page 2" translates to the route "/2".

```csharp
public void NavigateTo(int page)
{
    Nav.NavigateTo($"/{page}");
}
```

`ListControl` inherits from `GridControlsBase` but doesn't refresh automatically when properties in the filter change. This is suppressed by overriding the predicate to always return `false`.

```csharp
protected override Predicate<string> PropertyFilter => str => false;
```

To avoid multiple calls being triggered, a local `_loaded` flag is used to track loading whenever the filter changes. The `OnGridChangedAsync` method is overridden to ensure that a refresh isn't triggered by setting or resetting the `Loading` flag. This flag is used to prevent multiple calls from firing simultaneously, as the component is designed to just need one call to populate the grid. It also resets to the first page when the filter criteria change. Then it calls the main method, `ReloadAsync`.

```csharp
protected override async Task OnGridChangedAsync(string property)
{
    if (property == nameof(Controls.Loading))
    {
        return;
    }
    if (Page != 1)
    {
        NavigateTo(1);
        return;
    }
    _loaded = false;
    await ReloadAsync();
}
```

The `ReloadAsync` method performs its own checks. If `Loading` is set, it returns to let the current request complete. If the current page is invalid, it redirects to a valid page. If the current filter has already loaded, it returns. Then it invokes the following logic:

```csharp
Contacts = null;
await InvokeAsync(() => StateHasChanged());
Controls.Loading = true;
await FetchControlsAsync(Repo, result => Contacts = result);
Controls.Loading = false;
_loaded = true;
await InvokeAsync(() => StateHasChanged());
```

The first step is to erase the current list. This allows the controls to properly dispose and avoids some side-effects that can happen from the refresh. Blazor is notified to re-render by calling `StateHasChanged`. This normally happens automatically after UI events are fired but is called here to explicitly clear the current grid. Next, the `Loading` flag is set, and the callback provided by the parent `Index` page is called to assign the collection that represents the new page. Finally, the `Loading` flag is reset, and a render update is forced because as far as Blazor is concerned, the previous request took care of things.

## Delete

One thing I love about Razor components is how well they communicate with each other. In the grid, I wanted to make it possible to delete a contact with a few clicks. To allow for confirmation, I only enable one delete request at a time. The parent control, `ContactList`, maintains the current `DeleteRequestId` and sets `DeleteRequested` on the control to `true` when the ids match.

In a given row, a delete can be requested if it hasn't already been requested (that will put the control into confirmation mode) and if the `DeleteRequestId` is 0 (meaning no other row has requested it).

```csharp
public bool CanDelete => !DeleteConfirmation &&
    (DeleteRequestId == 0 || DeleteRequestId == CurrentContact?.Id);
```

When delete is allowed, an icon is exposed for issuing a "delete request."

```html
<span @onclick="async () => await DeleteRequestAsync()"
    title="Delete" class="clickable red">❌</span>
```

The implementation sets the confirmation flag to true and informs the parent control of the request via a callback. This will change the current id to the id being requested and disable the check boxes for all other rows.

```csharp
public async Task DeleteRequestAsync()
{
    DeleteConfirmation = true;
    await DeleteRequested.InvokeAsync(CurrentContact.Id);
}
```

![Delete confirmation](/blog/build-a-blazor-webassembly-line-of-business-app-part-3/images/deleteconfirmation.jpg)

The flag overlays the columns in the grid with the confirmation panel. If the user cancels, the confirmation flag is reset, and the request id is set to 0. If they confirm, the callback requesting the delete is invoked, the request id is set to 0 and the current contact is cleared.

```csharp
private async Task DeleteAsync()
{
    await DeleteContact.InvokeAsync(CurrentContact);
    await DeleteRequested.InvokeAsync(0);
    CurrentContact = null;
}
```

The callback goes to `ContactList` which in turn passes it up to `ListControl`. The list control uses the repo to delete the contact, then refreshes the current page.

```csharp
public async Task DeleteContactAsync(Contact contact)
{
    Controls.Loading = true;
    await Repo.DeleteAsync(contact.Id, User);
    Controls.Loading = false;
    _loaded = false;
    await ReloadAsync();
}
```

The repo calls the server, which in turn calls the server repository code:

```csharp
var item = await context.Contacts.SingleOrDefaultAsync(c => c.Id == id);
if (item == null)
{
    result = false;
}
else
{
    context.Contacts.Remove(item);
}
```

When `SaveChangesAsync` is called, the SQL is issued to delete the contact and an audit record is inserted with the final snapshot.

## Update and Optimistic Concurrency

EF Core is popular for its built-in change tracking and concurrency detection. The `ContactContext` configures the row version column in `OnModelCreating` and specifies it as a row version column so that EF Core knows to use it for concurrency.

```csharp
contact.Property<byte[]>(RowVersion).IsRowVersion();
```

The `ContactRepository` has a `forUpdate` flag that, when set, loads the contact with tracking turned on (this is the default). The `ContactsController` also takes the flag. When it is set, instead of returning just the `Contact`, the controller wraps the request in a unit of work so the context is persisted beyond the `LoadAsync` call (otherwise it is disposed of immediately.) The controller registers the unit of work to be disposed when the request ends, then loads the contact. Using the special `GetPropertyValueAsync` method on the repository, it retrieves the `RowVersion` shadow property. It then returns a `ContactConcurrencyResolver` entity that holds the `Contact` and the `RowVersion`.

```csharp
var unitOfWork = _serviceProvider.GetService<IUnitOfWork<Contact>>();
HttpContext.Response.RegisterForDispose(unitOfWork);
var result = await unitOfWork.Repo.LoadAsync(id, User, true);
var concurrencyResult = new ContactConcurrencyResolver
{
    OriginalContact = result,
    RowVersion = result == null ? null :
    await unitOfWork.Repo.GetPropertyValueAsync<byte[]>(
        result, ContactContext.RowVersion)
};
return new OkObjectResult(concurrencyResult);
```

The client repository has references to the original contact, the database version of the contact, and the row version. If the contact is loaded for update, the special `ContactConcurrencyResolver` is used to unroll the `Contact` instance and `RowVersion` property.

```csharp
public async Task<Contact> LoadAsync(int id)
{
    OriginalContact = null;
    DatabaseContact = null;
    RowVersion = null;
   var result = await SafeGetFromJsonAsync<ContactConcurrencyResolver>
            ($"{ApiContacts}{id}{ForUpdate}");
    if (result == null)
    {
        return null;
    }
    OriginalContact = result.OriginalContact;
    RowVersion = result.RowVersion;
    return result.OriginalContact;
}
```

The client version of the unit of work maintains a reference to the repo and therefore the row version from the load.

> **Note**: this pattern assumes a single edit at a time. If I wanted to implement a grid-based edit with multiple rows, I'd create a special `ContactWithRowVersion` that extends each entity to track the row version at an entity level, rather than at the repository level.

When the user submits their update, the `UpdateAsync` implementation on the client uses an extension method to pass both the `Contact` _and_ the `RowVersion` to the server.

```csharp
var result = await _apiClient.PutAsJsonAsync(
    $"{ApiContacts}{item.Id}",
    item.ToConcurrencyResolver(this));
```

Here is the extension method:

```csharp
public static ContactConcurrencyResolver ToConcurrencyResolver(
            this Contact contact, WasmRepository repo)
{
    return new ContactConcurrencyResolver()
    {
        OriginalContact = contact,
        RowVersion = repo.RowVersion
    };
}
```

The `ContactsController` endpoint for the update generates another unit of work. Instead of loading the old contact, it attaches the updated contact and explicitly sets the original row version. This implements the _disconnected entity_ pattern. The entity is attached to start change tracking in EF Core. The original row version is set to reflect what the contact looked like when it was initially retrieved. This allows EF Core to detect if the contact has been updated since then.

The unit of work is then committed. The repository will throw a `RepoConcurrencyException` if a concurrency conflict is detected. The controller detects this and returns a conflict status code with a payload that contains the snapshot of the contact that was modified (as fetched from the database) and the _new_ row version for that contact. The `value` property is the `ContactConcurrencyResolver` instance passed to the `PutAsync` method.

```csharp
var unitOfWork = _serviceProvider.GetService<IUnitOfWork<Contact>>();
HttpContext.Response.RegisterForDispose(unitOfWork);
unitOfWork.SetUser(User);
unitOfWork.Repo.Attach(value.OriginalContact);
await unitOfWork.Repo.SetOriginalValueForConcurrencyAsync(
    value.OriginalContact, ContactContext.RowVersion, value.RowVersion);
try
{
    await unitOfWork.CommitAsync();
    return new OkResult();
}
catch (RepoConcurrencyException<Contact> dbex)
{
    value.DatabaseContact = dbex.DbEntity;
    value.RowVersion = dbex.RowVersion;
    return new ConflictObjectResult(value);
}
```

The repository simply issues a save request to Entity Framework Core. If a concurrency conflict exists, EF Core throws a `DbUpdateConcurrencyException`. The repo captures this exception. It calls `GetDatabaseValues` on the entity to get a snapshot of what changed, then populates and throws the `RepoConcurrencyException`.

```csharp
catch (DbUpdateConcurrencyException ex)
{
    var newex = new RepoConcurrencyException<TEntity>(
        (TEntity)ex.Entries[0].Entity, ex);
    var dbValues = ex.Entries[0].GetDatabaseValues();

    if (dbValues == null)
    {
        newex.DbEntity = default;
    }
    else
    {
        newex.RowVersion = dbValues
            .GetValue<byte[]>(ContactContext.RowVersion);
        newex.DbEntity = (TEntity)dbValues.ToObject();
        ex.Entries[0].OriginalValues.SetValues(dbValues);
    }
    throw newex;
}
```

The client repository takes the payload from the controller and turns it into the same exception in the client:

```csharp
if (result.StatusCode == HttpStatusCode.Conflict)
{
    // concurrency issue, so extract what the updated information is
    var resolver = await
        result.Content.ReadFromJsonAsync<ContactConcurrencyResolver>();
    DatabaseContact = resolver.DatabaseContact;
    var ex = new RepoConcurrencyException<Contact>(item, new Exception())
    {
        DbEntity = resolver.DatabaseContact
    };
    RowVersion = resolver.RowVersion; // for override
    throw ex;
}
```

The `EditContact` page component inherits `OwningComponentBase<IUnitOfWork<Contact>>`. This will inject the unit of work and related repository based on the scoped registration in `Program.cs`:

```csharp
builder.Services.AddScoped<IBasicRepository<Contact>, WasmRepository>();
builder.Services.AddScoped<IUnitOfWork<Contact>, WasmUnitOfWork>();
```

The base component exposes a property named `Service` that resolves to the configured instance of the unit of work. The unit of work was registered as "scoped", meaning one copy for the lifetime of the app in the case of Blazor WebAssembly. The `OwningComponentBase` base class overrides the lifetime scope of the injected unit of work to the lifetime of the component. This means the unit of work is available as long as the component exists. When the component is disposed, so is the unit of work. `EditContact` simply passes a reference of the unit of work to `EditContactControl`.

`EditContactControl` captures the exception and uses it to populate the concurrency resolution properties. If the database entity is `null` it means the contact was deleted, so the user is navigated to show the "contact doesn't exist" message. Here is the code:

```csharp
try
{
    await Service.CommitAsync();
    Nav.NavigateTo($"/view/{Contact.Id}/true");
}
catch (RepoConcurrencyException<Contact> dbex)
{
    ConcurrencyError = true;

    if (dbex.DbEntity == null)
    {
        Nav.NavigateTo($"/view/{Contact.Id}");
        return;
    }

    DbContact = dbex.DbEntity;

    Error = false;
    Busy = false;
}
```

The `DbContact` property is passed to `ContactUpdate`. Each property on the form has an instance of the `ConcurrencyField` control. Here's the declaration for "first name":

```html
<ConcurrencyField Model="@Contact" DbModel="@DbContact"
     Property="obj => obj?.FirstName" />
```

This control is generic so it can be used for types other than `Contact`. Generic components define a `typeparam`:

```csharp
@typeparam TModel
```

Then the type can be used to define properties. Setting the model will automatically set the generic type for the component:

```csharp
[Parameter]
public TModel Model {get; set;}
```

This control only renders when a concurrency conflict exists, as indicated by the presence of the `DbModel` property.

```csharp
private bool Show => Model != null && DbModel != null;
```

The `obj => obj?.FirstName` lambda expression is passed to a property defined as `Func<TModel, IComparable>`. The function takes a model and returns something that can be compared. In other words, it allows the control to resolve and compare the property on the model passed in. A special flag is set when the edited property doesn't match the property in the database:

```csharp
private bool IsDelta => !Property(Model).Equals(Property(DbModel));
```

If the properties differ, they are highlighted in the UI. The lambda expression is also used to display the differences:

```html
<span class="alert alert-warning"><strong>@Property(DbModel)</strong></span>
```

Here is an example of me correcting the Microsoft headquarters address. Between the time I loaded the contact and clicked "submit" to post my updates, someone else (OK, I admit it - it was me, in another browser tab) modified the same contact. I'm presented with the fields that were updated:

![Concurrency conflicts](/blog/build-a-blazor-webassembly-line-of-business-app-part-3/images/concurrency.jpg)

Now I can inspect what changed and choose to force an update by clicking submit or cancel the update operation. When I force an update, the latest row version is sent back. As long as no further changes happened, the update will go through because the row version passed matches the latest row version in the database. If someone else makes yet another edit, the resolution cycle starts over with the new differences.

## Conclusion

That's the end of the code walk through. Feel free to share your thoughts in the discussion below. If you have any issues with the code, please [file them here](https://github.com/JeremyLikness/BlazorWasmEFCoreExample/issues/new). I'm also open to ways to simplify and/or improve the code.

I plan to show another implementation that uses Blazor Server. It will reuse all of the existing libraries, including the controls, with the exception of the Blazor client. I also will publish an MVVM example that is either standalone or a refactoring of this project.

Regards,

![Jeremy Likness](/images/jeremylikness.gif)