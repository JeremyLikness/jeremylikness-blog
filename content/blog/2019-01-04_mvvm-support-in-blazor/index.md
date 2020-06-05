---
title: "MVVM Support in Blazor"
author: "Jeremy Likness"
date: 2019-01-04T17:54:22.777Z
years: "2019"
lastmod: 2019-09-12T10:45:25-07:00
comments: true

description: "Simple solution for change detection across Blazor components by supporting the MVVM pattern and INotifiyPropertyChanged."

subtitle: "A solution for property change notification across components"
tags:
 - JavaScript 
 - Blazor 
 - WebAssembly 
 - Single Page Applications 
 - Web Development 

image: "/blog/2019-01-04_mvvm-support-in-blazor/images/1.png" 
images:
 - "/blog/2019-01-04_mvvm-support-in-blazor/images/1.png" 
 - "/blog/2019-01-04_mvvm-support-in-blazor/images/2.gif" 


aliases:
    - "/mvvm-support-in-blazor-dbc38060a4a0"
---

I recently ported an Angular app to Blazor and wrote about it here:

{{<relativelink "blog/2019-01-03_from-angular-to-blazor-the-health-app">}}

I noticed immediately that Blazor’s built in change detection works great inside of components (i.e. if you mutate a property on the model, dependent HTML will re-render). You don’t have to do anything special with your model. Updates simply refresh the component! The catch is that other components don’t automatically refresh, so you need to implement a mechanism for change detection across components.

> Examples in this post/repo are for version `3.2.0-preview1.20073.1`

I did some initial research, and the team is adamant this won’t be baked into the framework. Here is the relevant quote from [this issue](https://github.com/aspnet/Blazor/issues/374):

> Our goal with Blazor is target a broad audience with Web developers, so we’re specifically not targeting compatibility with WPF/UWP/Xamarin.Forms. We are also trying to give the you the flexibility to use the patterns you want without baking too much in the framework. So you should be able to implement MVVM patterns on top of Blazor’s core concepts (much like you are doing already). It doesn’t sound like you are blocked with this, and we don’t plan to do more in this direction.

There are certainly other frameworks available, some that even support XAML. For example, take a look at [Uno](https://platform.uno/) that is supported by [MVVMLight](http://www.mvvmlight.net/). But what if you want to use HTML and expect change detection in your underlying models? I investigated a few solutions. In the issue thread, one suggestion was to make a base component. That felt like extra work to tag everything to inherit the component and then override a method to set the model that might change.

Blazor is brand new and it might make sense, as suggested by Tim Heuer and Oren Novotny, to take a different approach:

{{<customtwitter 1081233514094182400>}}

{{<customtwitter 1081242926703882241>}}

However, an `[Observable]` attribute would simplify change detection on the model but wouldn’t necessarily address communication between components. I wanted something that leverages the time-tested, baked in interface for change detection: `INotifyPropertyChanged`. Then I can create a view model that simply raises an event when properties change:

{{<highlight CSharp>}}
public class NumberViewModel : INotifyPropertyChanged
{
    public event PropertyChangedEventHandler PropertyChanged;

    private int _number = 42;

    public int Number
    {
        get => _number;
        set
        {
            if (value != _number)
            {
                _number = value;
                PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(nameof(Number)));
            }
        }
    }
}
{{</highlight>}}

In XAML, you can specify a `DataSource` and it is scoped to the child elements until it is overridden later in the hierarchy. What if we could do something similar, only instead of providing scope for data-binding (this is already handled in Blazor and even supports having multiple models to reference in the same component, which is quite alright with me), it provides a scope for change detection?

From my Angular experience I immediately thought of interpolation. This the ability of a component to encapsulate child components. For example, instead of this:

`<Component/>`

You can do this:

`<Component><ChildComponent/></Component>`

It is important functionality and therefore no surprise that it is supported by Blazor. The easiest way to handle interpolation is to use the `RenderFragment` type and expose a property named `ChildComponent` by convention. In Blazor, state change detection is hierarchical so if a parent is notified of state changes, its children are notified as well. So, I simply need a component that

1. Provides interpolation so I can embed child components
2. Has a property I can use to set the view model we are watching
3. Calls `StateHasChanged` whenever a property on the model changes

I decided to name this `ViewModelRegion` because it indicates a region that watches for changes. Here is the full implementation (it was so simple I didn’t believe it would work the first time I tried it):

{{<highlight CSharp>}}
@ChildContent
@using System.ComponentModel

@code {
    [Parameter]
    public RenderFragment ChildContent { get; set; }

    [Parameter]
    public INotifyPropertyChanged ViewModel { get; set; }

    protected override void OnInitialized()
    {
        base.OnInitialized();
        ViewModel.PropertyChanged += (o, e) => StateHasChanged();
    }
}
{{</highlight>}}

Given a component that binds to the number model:

{{<highlight HTML>}}
@inject BlazorMVVM.Models.NumberViewModel Model

<div>
    <p>Enter a number:</p>
    <input type="number" @bind="Model.Number"/>
</div>
{{</highlight>}}

…and another component that binds to it for display:

{{<highlight HTML>}}
@inject BlazorMVVM.Models.NumberViewModel NumberModel

<div>
    <h3>No VM Wrapper</h3>
    <p>Number: @NumberModel.Number</p>
</div>
{{</highlight>}}

Without any changes, updates to the first component don’t reflect in the second component. However, wrapping it in the `ViewModelRegion` fixes that.

{{<highlight HTML>}}
@inject BlazorMVVM.Models.NumberViewModel NumberModel

<div>
    <h3>Number Wrapper</h3>
    <ViewModelRegion ViewModel="@NumberModel">
        <p>Number: @NumberModel.Number</p>
    </ViewModelRegion>
</div>
{{</highlight>}}

This solution also fully supports multiple models and regions:

{{<highlight HTML>}}
@inject BlazorMVVM.Models.NumberViewModel NumberModel
@inject BlazorMVVM.Models.ToggleViewModel ToggleModel 

<div>
    <h3>Two Wrappers</h3>
    <ViewModelRegion ViewModel="@NumberModel">
        <p>Number: @NumberModel.Number</p>
    </ViewModelRegion>
    <ViewModelRegion ViewModel="@ToggleModel">
        <p>Toggle: @ToggleModel.Toggle</p>
    </ViewModelRegion>
</div>
{{</highlight>}}

And, yes, you can even nest them if you prefer.

This solution comes with a lot of caveats. I haven’t tested performance, there may be better ways to notify on property changes, and we might be able to extend the framework to automatically detect view models and register for changes. I haven’t explored support for `ICommand` yet and may not dig much deeper because Blazor is still in such an early state. However, it works and was a fun experiment to try.

I created a very simple project to demonstrate this solution:

{{<figure src="/blog/2019-01-04_mvvm-support-in-blazor/images/1.png" caption="Blazor MVVM App" alt="Screenshot of MVVM App">}}

You can clone it and/or fork it from this repository:

{{<github "JeremyLikness/BlazorMVVM">}}

Are you using Blazor? I look forward to your thoughts and feedback!

Regards,

![Jeremy Likness](/blog/2019-01-04_mvvm-support-in-blazor/images/2.gif)
