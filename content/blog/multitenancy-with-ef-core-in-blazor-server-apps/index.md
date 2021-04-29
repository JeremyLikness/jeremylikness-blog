---
title: "Multi-tenancy with EF Core in Blazor Server Apps"
author: "Jeremy Likness"
date: 2021-04-29T00:32:27-07:00
years: "2021"
lastmod: 2021-04-29T00:32:27-07:00

draft: false
comments: true
toc: true

subtitle: "A tale of lifetimes, scopes, connection strings and query filters."

description: "Learn several ways to implement multi-tenant databases in Blazor Server apps using Entity Framework Core."

tags:
 - ASP.NET Core 
 - Blazor
 - EF Core
 - Entity Framework 

image: "/blog/multitenancy-with-ef-core-in-blazor-server-apps/images/multitenant.png" 
images:
 - "/blog/multitenancy-with-ef-core-in-blazor-server-apps/images/multitenant.png" 
---

Many line of business applications are designed to work with multiple customers. It is important to secure the data so that customer data isn't leaked and seen by other customers and potential competitors. These applications are classified as "multi-tenant" because each customer is considered a tenant of the application with their own set of data.

> This article provides examples and solutions "as is." These are not intended to be "best practices" but rather "working practices" for your consideration.

There are many approaches to implementing multi-tenancy in applications. One common approach (that is sometimes a requirement) is to keep data for each customer in a separate database. The schema is the same but the data is customer-specific. Another approach is to partition the data in an existing database by customer.

Both approaches are supported by EF Core.

For the approach that uses multiple databases, switching to the right database is as simple as providing the correct connection string. If the data is stored in a single database, a [global query filter](https://docs.microsoft.com/ef/core/querying/filters) makes sense to ensure that developers don't accidentally write code that can access data from other customers. For a great article about how to secure a single multi-tenant database using SQL Server [row-level security](https://docs.microsoft.com/sql/relational-databases/security/row-level-security), check out "[Secure data in a single multi-tenant database in just 3 steps](https://lukaszcoding.com/secure-data-in-a-single-multi-tenant-database-in-just-3-steps/)."

## Life of the factory

The recommended pattern for [using Entity Framework Core in Blazor apps](https://docs.microsoft.com/aspnet/core/blazor/blazor-server-ef-core) is to register the [DbContextFactory](https://docs.microsoft.com/ef/core/dbcontext-configuration/#using-a-dbcontext-factory-eg-for-blazor), then call it to create a new instance of the `DbContext` each operation. By default, the factory is a _singleton_ so only one copy exists for all users of the application. This is usually fine because although the factory is shared, the individual `DbContext` instances are not. For multi-tenancy, however, the connection string may change per user. Because the factory caches the configuration with the same lifetime, this means all users must share the same configuration.

This issue doesn't occur in Blazor WebAssembly apps because the singleton is scoped to the user. Blazor Server apps, on the other hand, present a unique challenge. Although the app is a web app, it is "kept alive" by real-time communication using SignalR. A session is created per user and lasts beyond the initial request. A new factory should be provided per user to allow new settings. The lifetime for this special factory is called `Scoped` and creates a new instance per user session.

## A type of method

To demonstrate multi-tenancy in a Blazor Server app, I built:

{{<github "JeremyLikness/BlazorEFCoreMultitenant">}}

![Blazor multi-tenant app](/blog/multitenancy-with-ef-core-in-blazor-server-apps/images/multitenant.png)

The database contains tables to store method names and parameters that are populated via reflection. The data model for a parameter is:

```csharp
public class DataParameter
{
    public DataParameter() { }

    public DataParameter(ParameterInfo parameter)
    {
        Name = parameter.Name;
        Type = parameter.ParameterType.FullName;
    }

    public int Id { get; set; }
    public string Name { get; set; }
    public string Type { get; set; }
    public DataMethod Method { get; set; }
}
```

Parameters are owned by the methods that define them. The method class looks like:

```csharp
public class DataMethod
{
    public DataMethod() { }

    public DataMethod(MethodInfo method)
    {
        Name = method.Name;
        ReturnType = method.ReturnType.FullName;
        ParentType = method.DeclaringType.FullName;
        
        Parameters = method.GetParameters()
            .Select(p => new DataParameter(p))
            .ToList();

        foreach (var parameter in Parameters)
        {
            parameter.Method = this;
        }
    }

    public int Id { get; set; }

    public string Name { get; set; }

    public string ReturnType { get; set; }

    public string ParentType { get; set; }

    public IList<DataParameter> Parameters { get; set; } =
        new List<DataParameter>();
}
```

The `ParentType` property is the tenant for the sake of this demo. The application ships with pre-loaded SQLite databases. There is an option in the app to regenerate the databases. You can then navigate to the individual examples and see them in action.

## Putting things in context

A simple `TenantProvider` class handles setting the user's current tenant. It provides callbacks so code is notified when the tenant changes. The implementation (with the callbacks omitted for clarity) looks like this:

```csharp
public class TenantProvider
{
    private string tenant = TypeProvider.GetTypes().First().FullName;

    public void SetTenant(string tenant)
    {
        this.tenant = tenant;
        // notify changes
    }

    public string GetTenant() => tenant;

    public string GetTenantShortName() => tenant.Split('.')[^1];
}
```

The `DbContext` can then manage the multi-tenancy. The approach depends on your database strategy. If you are storing all tenants in a single database, you are likely going to use a query filter. The `TenantProvider` is passed to the constructor via dependency injection and used to resolve and store the tenant identifier.

```csharp
private readonly string tenant = string.Empty;

public SingleDbContext(
    DbContextOptions<SingleDbContext> options,
    TenantProvider tenantProvider)
    : base(options) 
{
    tenant = tenantProvider.GetTenant();
}
```

The `OnModelCreating` method is overridden to specify the query filter:

```csharp
 modelBuilder.Entity<DataMethod>()
    .HasQueryFilter(dm => dm.ParentType == tenant);
```

This ensures that every query is filtered to the tenant on every request. There is no need to filter in application code because the global filter will be automatically applied.

## A lifetime of dependencies

The tenant provider and `DbContextFactory` are configured in the application startup like this:

```csharp
services.AddScoped<TenantProvider>();

services.AddDbContextFactory<SingleDbContext>(
    opts => opts.UseSqlite("Data Source=alltenants.sqlite"),
    ServiceLifetime.Scoped);
```

Notice that the [service lifetime](https://docs.microsoft.com/dotnet/core/extensions/dependency-injection#service-lifetimes) is configured with `ServiceLifetime.Scoped`. This enables it to take a dependency on the tenant provider.

> Dependencies must always flow towards the singleton. That means a `Scoped` service can depend on another `Scoped` service or a `Singleton` service, but a `Singleton` service can only depend on other `Singleton` services: `Transient => Scoped => Singleton`.

The `MultipleDbContext` version is implemented by passing a different connection string for each tenant. This can be configured at startup by resolving the service provider and using it to build the connection string:

```csharp
services.AddDbContextFactory<MultipleDbContext>((sp, opts) =>
{
    var tenantProvider = sp.GetRequiredService<TenantProvider>();
    opts.UseSqlite($"Data Source={tenantProvider.GetTenantShortName()}.sqlite");
}, ServiceLifetime.Scoped);
```

This works fine for most scenarios, but what about when the user can change their tenant "on the fly"?

## A transient affair

In the previous configuration for multiple databases, the options are cached at the `Scoped` level. This means that if the user changes the tenant, the options are _not_ reevaluated and so the tenant change isn't reflected in queries.

The easy solution for this is to set the lifetime to `Transient.` This ensures the tenant is re-evaluated along with the connection string each time a `DbContext` is requested. The user can switch tenants as often as they like. The following table can help you choose which lifetime makes the most sense for your factory.

{{<table "table table-striped">}}
||**Single database**|**Multiple databases**|
|:--|:--|:--|
|_User stays in a single tenant_|`Scoped`|`Scoped`|
|_User can switch tenants_|`Scoped`|`Transient`|
{{</table>}}

The default of `Singleton` still makes sense if your database does not take on user-scoped dependencies.

## Performance notes

A valid question when changing scopes is: "How much will this impact performance." The answer is "pretty much not at all." It is highly unlikely that a single user session will require hundreds or thousands of `DbContext` instances during a given session. The GitHub repo includes a benchmark project that shows the `Transient` scoped factory only takes 3 microseconds (on my laptop) to go from requesting the factory to creating a usable `DbContext`. That translates to over 300,000 requests per second.

As always, I'm open to feedback and suggestions. I hope this example provides a template you can use to help address the multi-tenant requirements of _your_ Blazor business app.

Reminder: the example app is available at:

{{<github "JeremyLikness/BlazorEFCoreMultitenant">}}

Regards,

![Jeremy Likness](/images/jeremylikness.gif)