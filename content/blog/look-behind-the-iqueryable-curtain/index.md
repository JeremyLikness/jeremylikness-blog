---
title: "Look Behind the IQueryable Curtain"
author: "Jeremy Likness"
date: 2020-07-19T00:47:29-07:00
years: "2020"
lastmod: 2020-10-20T00:47:29-07:00

draft: false
comments: true
toc: true

subtitle: "The expression behind it all..."

series: "LINQ and Expressions"

description: "Learn how to parse the expressions behind queries using the built-in ExpressionVisitor class. After successfully parsing an expression tree, discover how to modify the tree and apply your own rules by implementing your own queryable host."

tags:
 - LINQ
 - EF Core
 - Data
 - .NET Core

image: "/blog/look-behind-the-iqueryable-curtain/images/nestedcalls.jpg" 
images:
 - "/blog/look-behind-the-iqueryable-curtain/images/nestedcalls.jpg" 
---

In a [previous blog post](/blog/dynamically-build-linq-expressions/), I explored the power of expressions and used them to dynamically build a rules engine based on a JSON payload. In this post I flip everything upside down and start with the expression. Given the variety of possible expression types and complexity of expression trees, what is the best way to decompose the tree? And, while we're at it, can we mutate the expression to make it behave differently? I'll explain why that's important.

First, if you haven't read the first article, take a few minutes to check it out:

{{<relativelink "/blog/dynamically-build-linq-expressions">}}

Ready to chop down the expression tree? Let's get started.

(Eager to jump into code? Here's the repo ...):

{{<github "JeremyLikness/ExpressionExplorer">}}

## Setting the Stage

First, let's start with a few assumptions. I'm working with a thing. It's just a plain old Common Language Runtime (CLR) entity (you may have heard it referred to as _POCO_) named `Thing`. Here's the definition:

```csharp
public class Thing
{
    public Thing()
    {
        Id = Guid.NewGuid().ToString();
        Created = DateTimeOffset.Now;
        Name = Guid.NewGuid().ToString().Split("-")[0];
    }

    public string Id { get; set; }
    public string Name { get; set; }
    public DateTimeOffset Created { get; private set; }

    public string GetId() => Id;

    public override string ToString() =>
        $"({Id}: {Name}@{Created})";
}
```

To cheat, I added a static method that makes it easy to generate _N_ number of things:

```csharp
public static IList<Thing> Things(int count)
{
    var things = new List<Thing>();
    while (count-- > 0)
    {
        things.Add(new Thing());
    }
    return things;
}
```

Now I can generate a source and query it. Here's a LINQ expression that generates 500 things and queries them:

```csharp
var query = Thing.Things(500).AsQueryable()
    .Where(t => 
        t.Name.Contains("a", StringComparison.InvariantCultureIgnoreCase) &&
        t.Created > DateTimeOffset.Now.AddDays(-1))
    .Skip(2)
    .Take(50)
    .OrderBy(t => t.Created);
```

If you call `ToString()` on `query` you get this:

```text
System.Collections.Generic.List`1[ExpressionExplorer.Thing]
    .Where(t => 
        (t.Name.Contains("a", InvariantCultureIgnoreCase) 
            AndAlso 
        (t.Created > DateTimeOffset.Now.AddDays(-1))))
    .Skip(2)
    .Take(50)
    .OrderBy(t => t.Created)
```

The formatting was added by me. One thing you may not have noticed is that `query` has a property named `Expression`.

> Behind every good `IQueryable` is a proper `Expression`. &mdash; Me

The way the expression is built shouldn't be too mysterious. Starting with the list, the `Enumerable.Where` method is called. The first parameter is an enumerable source (our list of things) and the second is a _predicate_ that takes an item and returns `true` if it will be included. Inside the predicate, `string.Contains` is called, some comparisons happen, then two results are skipped. The `Enumerable.Skip` method takes an enumerable list and an integer representing the count. Although the syntax to build the query looks straightforward, you can visualize it as a series of progressive filters. The `Skip` call is an extension method of enumerable that is taking the result from the `Where` call and so forth. 

Just for you, and exclusive to this post, I used my award-winning illustration skills to diagram the concept:

![Anatomy of a query](/blog/look-behind-the-iqueryable-curtain/images/nestedcalls.jpg)

If you wanted to parse the expression tree, however, you may be in for a surprise. There are many different expression types, and each one is parsed a different way. For example, a `BinaryExpression` has a `Left` and a `Right`, but a `MethodCallExpression` has a list of `Arguments` that are expressions. That's a lot of type checks and casting just to walk the tree!

## Another Visitor

"Stay awhile. Stay ... forever!" &mdash; _[Mission Impossible, Commodore 64 Edition](https://www.youtube.com/watch?v=i1_fDwX1VVY)_

To make life easier, LINQ provides a special class named `ExpressionVisitor`. It contains all the logic necessary to recursively parse an expression tree. You simply pass an `Expression` into the `Visit` method and it will visit every node and return the expression back (more on that later). It contains methods specific to node types that can be overridden to intercept the process. Here's a basic implementation that simply overrides certain methods to write information to the console and then passes the ball back to the base class.

```csharp
public class BasicExpressionConsoleWriter : ExpressionVisitor
{
    protected override Expression VisitBinary(BinaryExpression node)
    {
        Console.Write($" binary:{node.NodeType} ");
        return base.VisitBinary(node);
    }

    protected override Expression VisitUnary(UnaryExpression node)
    {
        if (node.Method != null)
        {
            Console.Write($" unary:{node.Method.Name} ");
        }
        Console.Write($" unary:{node.Operand.NodeType} ");
        return base.VisitUnary(node);
    }

    protected override Expression VisitConstant(ConstantExpression node)
    {
        Console.Write($" constant:{node.Value} ");
        return base.VisitConstant(node);
    }

    protected override Expression VisitMember(MemberExpression node)
    {
        Console.Write($" member:{node.Member.Name} ");
        return base.VisitMember(node);
    }

    protected override Expression VisitMethodCall(MethodCallExpression node)
    {
        Console.Write($" call:{node.Method.Name} ");
        return base.VisitMethodCall(node);
    }

    protected override Expression VisitParameter(ParameterExpression node)
    {
        Console.Write($" p:{node.Name} ");
        return base.VisitParameter(node);
    }
}
```

To use it, simply create an instance and pass it an expression. Here, we'll pass it the expression behind our query:

```csharp
new BasicExpressionConsoleWriter().Visit(query.Expression);
```

Running it yields the following uninspiring output:

```text
call:OrderBy  call:Take  call:Skip  call:Where  
constant:System.Collections.Generic.List`1[ExpressionExplorer.Thing]  unary:Lambda  
binary:AndAlso  call:Contains  member:Name  p:t  constant:a  
constant:InvariantCultureIgnoreCase  binary:GreaterThan  member:Created  p:t  
call:AddDays  member:Now  constant:-1  p:t  constant:2  constant:50  
unary:Lambda  member:Created  p:t  p:t
```

Notice the order things are visited. It may take a minute, but the logic makes sense:

1. `OrderBy` is the outermost call (last in, first out), and it takes a list and a field...
1. The first parameter to `OrderBy` is the list, which is provided by `Take`...
1. `Take` needs a list, which is provided by `Skip`...
1. `Skip` needs a list, which is provided by `Where`...
1. `Where` needs a list, which is provided by the `Thing` list...
1. The second parameter to `Where` is a predicate _lambda expression_...
1. ...which is a binary `AndAlso`...
1. The left side of the binary is a `Contains` call...
1. (skipping a bunch of logic)
1. The second parameter to `Take` is 50...
1. The second parameter to `Skip` is 2...
1. The `OrderBy` property is `Created`...

You get the point? Of course, knowing how the tree is parsed is the key to making our visitor more readable. Here's a more informed pass:

```csharp
public class ExpressionConsoleWriter
    : ExpressionVisitor
{
    int indent;

    private string Indent => 
        $"\r\n{new string('\t', indent)}";

    public void Parse(Expression expression)
    {
        indent = 0;
        Visit(expression);
    }

    protected override Expression VisitConstant(ConstantExpression node)
    {
        if (node.Value is Expression value)
        {
            Visit(value);
        }
        else
        {
            Console.Write($"{node.Value}");
        }
        return node;
    }

    protected override Expression VisitParameter(ParameterExpression node)
    {
        Console.Write(node.Name);
        return node;
    }

    protected override Expression VisitMember(MemberExpression node)
    {
        if (node.Expression != null)
        {
            Visit(node.Expression);
        }
        Console.Write($".{node.Member?.Name}.");
        return node;
    }

    protected override Expression VisitMethodCall(MethodCallExpression node)
    {
        if (node.Object != null)
        {
            Visit(node.Object);
        }
        Console.Write($"{Indent}{node.Method.Name}( ");
        var first = true;
        indent++;
        foreach (var arg in node.Arguments)
        {
            if (first)
            {
                first = false;
            }
            else
            {
                indent--;
                Console.Write($"{Indent},");
                indent++;
            }
            Visit(arg);
        }
        indent--;
        Console.Write(") ");
        return node;
    }

    protected override Expression VisitBinary(BinaryExpression node)
    {
        Console.Write($"{Indent}<");
        indent++;
        Visit(node.Left);
        indent--;
        Console.Write($"{Indent}{node.NodeType}");
        indent++;
        Visit(node.Right);
        indent--;
        Console.Write(">");
        return node;
    }
}
```

The new entry method, `Parse`, is introduced to set the indent to 0 and kick off the visits. The `Indent` property emits a newline and the right number of tabs based on the current `indent` value. It's called by various methods to format the output.

The `VisitMethodCall` and `VisitBinary` methods should shed some insight into how this works. In `VisitMethodCall` the method name is printed with an open parenthesis representing the parameters, or arguments. These are then visited in turn, and the logic will continue recursively for each argument until done. Then the closing parenthesis is printed. Because the method explicitly visited the child nodes, instead of calling the base class, the node is simply returned. This is because the base class would _also_ recursively visit the arguments and result in duplicates. For the binary expression, an opening angle is printed, then the left node visited, followed by the type of binary operation, then the right node, and finally the closure. Again, the base method is not called because the nodes were already visited.

Running this new visitor:

```csharp
new ExpressionConsoleWriter().Visit(query.Expression);
```

Results in something a little more readable (formatting via the tool, not me):

```text
OrderBy(
    Take(
        Skip(
            Where( System.Collections.Generic.List`1[ExpressionExplorer.Thing]
            ,
                <t.Name.
                    Contains( a
                    ,InvariantCultureIgnoreCase)
                AndAlso
                    <t.Created.
                    GreaterThan.Now.
                        AddDays( -1) >>t)
        ,2)
    ,50)
,t.Created.t)
```

For a full implementation, look no further than LINQ itself. The `ExpressionStringBuilder` contains everything needed to print an expression tree in a friendly format. You can view the source code here: [ExpressionStringBuilder](https://github.com/dotnet/runtime/blob/master/src/libraries/System.Linq.Expressions/src/System/Linq/Expressions/ExpressionStringBuilder.cs). 

The ability to parse expression trees is quite powerful. I'll dig deeper into what's possible in another blog post. Before I go, I want to address the elephant in the room: aside from helping parse the expression tree, what is the point of the main `Visit` method returning an expression? It turns out that `ExpressionVisitor` can do more than just inspect your query!

## Invasion of the Query Snatchers

A magical quality of the `ExpressionVisitor` is the ability to shape a query on-the-fly. To understand why, consider this scenario: you're tasked with standing up an order entry system that has powerful query capabilities and you must finish it _fast_. You read my articles and decide to use Blazor WebAssembly and write LINQ queries on the client. You use a custom visitor to cleverly serialize the query and pass it to the server, where you deserialize and run it. Everything works splendidly until the security audit. There, it's determined that the query engine is too wide open. A malicious client could issue extremely complex queries that return massive result sets to bring down the system. What do you do?

One benefit of using the visitor approach is that you don't have to reconstruct the entire expression tree just to modify a leaf node. Expression trees are immutable, but the visitor can return an entirely new expression tree! You write the logic that mutates the tree and receive the full tree complete with modifications at the end. To illustrate how this works, let's make a special visitor named `ExpressionTakeRestrainer.` 

```csharp
public class ExpressionTakeRestrainer : ExpressionVisitor
{
    private int maxTake;
    public bool ExpressionHasTake { get; private set; }

    public Expression ParseAndConstrainTake(
        Expression expression, int maxTake)
    {
        this.maxTake = maxTake;
        ExpressionHasTake = false;
        return Visit(expression);
    }
}
```

The special `ParseAndConstrainTake` method will kick off a visit and return the expression. Notice that it sets `ExpressionHasTake` to `false`. Presumably, if an `Enumerable.Take` is encountered, this will be set to `true`. This allows you to append a `Take` to the end of queries that don't have it to constrain results. Let's assume we're very paranoid and only ever want to return five results. Theoretically, you could just _always_ add the take to the end of the query:

```csharp
var myQuery = theirQuery.Take(5);
return myQuery.ToList();
```

But where's the fun in that? Let's modify an expression tree. We'll only override one method, and that's the `VisitMethodCall`:

```csharp
protected override Expression VisitMethodCall(MethodCallExpression node)
{
    if (node.Method.Name == nameof(Enumerable.Take))
    {
        ExpressionHasTake = true;
        if (node.Arguments.Count == 2 && 
            node.Arguments[1] is ConstantExpression constant)
        {
            var takeCount = (int)constant.Value;
            if (takeCount > maxTake)
            {
                var arg1 = Visit(node.Arguments[0]);
                var arg2 = Expression.Constant(maxTake);
                var methodCall = Expression.Call(
                    node.Object, 
                    node.Method, 
                    new[] { arg1, arg2 } );
                return methodCall;
            }
        }
    }
    return base.VisitMethodCall(node);
}
```

The logic checks to see if the method call is to `Enumerable.Take`. If it is, it sets the `ExpressionHasTake` flag. The second argument is the number to take, so the value is inspected and compared against the max. If it exceeds the maximum allowed, a new node is built that constrains it to the maximum value. This new node is returned instead of the original one. If the method is not `Enumerable.Take` then the base class is called, and everything is parsed "as usual."

We can test it by running this:

```csharp
new ExpressionConsoleWriter().Parse(
    new ExpressionTakeRestrainer()
        .ParseAndConstrainTake(query.Expression, 5));
```

Check out the following result: the query has been modified to only take five!

```text
OrderBy(
    Take(
        Skip(
            Where( System.Collections.Generic.List`1[ExpressionExplorer.Thing]
            ,
                <t.Name.
                    Contains( a
                    ,InvariantCultureIgnoreCase)
                AndAlso
                    <t.Created.
                    GreaterThan.Now.
                        AddDays( -1) >>t)
        ,2)
    ,5)
,t.Created.t)
```

But wait... _has it?!_ Try running this:

```csharp
var list = query.ToList();
Console.WriteLine($"\r\n---\r\nQuery results: {list.Count}");
```

And, unfortunately, what you'll see is `50`... the original "take" amount. The problem is that we generated a new expression, but we didn't replace it on the query. In fact, we can't... it's a read-only property and expressions are immutable. So now what?

## And Now, Your Host

We host it! We can make our own query host simply by implementing `IOrderedQueryable<T>`. The interface is a collection of other interfaces. Here's a breakdown of what the interface requires:

1. `ElementType` - this is simply the type of element being queried.
1. `Expression` - the backing expression behind the query.
1. `Provider` - this is the query provider. It does the actual work of applying the query. We won't write our own provider, but will use the one built-in, which in this case is LINQ-to-Objects.
1. `GetEnumerator` - this is called when it's time to run the query. You can build, extend, and modify all you like, but once this is called the query is materialized.

Here's an implementation of `TranslatingHost` because it translates the provided query.

```csharp
public class TranslatingHost<T> : IOrderedQueryable<T>, IOrderedQueryable
{
    private readonly IQueryable<T> query;

    public Type ElementType => typeof(T);

    private Expression TranslatedExpression { get; set; }

    public TranslatingHost(IQueryable<T> query, int maxTake)
    {
        this.query = query;
        var translator = new ExpressionTakeRestrainer();
        TranslatedExpression = translator
            .ParseAndConstrainTake(query.Expression, maxTake);
    }

    public Expression Expression => TranslatedExpression;

    public IQueryProvider Provider => query.Provider;

    public IEnumerator<T> GetEnumerator()
        => Provider.CreateQuery<T>(TranslatedExpression)
        .GetEnumerator();

    IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();
}
```

It's fairly simple. It takes in an existing query, then uses the `ExpressionTakeRestrainer` to generate a new expression. It uses the existing provider (so, for example, if this is a query from a `DbSet<T>` using EF Core on SQL Server, it will translate to a SQL statement). When the enumerator is requested, instead of passing the original expression, it passes the translated one.

Let's use it!

```csharp
var transformedQuery = 
    new TranslatingHost<Thing>(query, 5);
var list2 = transformedQuery.ToList();
Console.WriteLine($"\r\n---\r\nModified query results: {list2.Count}");
```

This time the result is what we want... only five records are returned.

So far, I've covered inspecting an existing query and swapping it out. This is helpful when you execute the query. If your code is what executes `query.ToList()` then you can modify the query to your heart's content. But what about when your code _isn't_ responsible for materializing the query? What if you expose a library, like a repository, that has this interface?

```csharp
public IQueryable<Thing> QueryThings { get; }
```

Or, in the case of EF Core:

```csharp
public DbSet<Thing> Things { get; set; }
```

How do you "intercept" the query when someone downstream calls `ToList()`? That requires a provider and is something I'll cover in more detail in the next post for this series.

Until then, happy expression hunting!

Repo:

{{<github "JeremyLikness/ExpressionExplorer">}}

Regards,

![Jeremy Likness](/images/jeremylikness.gif)
