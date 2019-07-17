---
title: "An Adventure in Redux: Building redux-adventure"
author: "Jeremy Likness"
date: 2016-07-30T00:00:00.000Z
years: "2016"
lastmod: 2019-06-13T10:43:13-07:00
toc: true
comments: true

description: "Learn about the JavaScript Redux library for state machines by building an adventure game with TypeScript and Angular."

subtitle: "Learn about the JavaScript Redux library for state machines by building an adventure game with TypeScript and Angular."
tags:
 - JavaScript 
 - Typescript 
 - Redux 
 - Angular 
 - Web Development 

image: "/blog/2016-07-30_an-adventure-in-redux-building-reduxadventure/images/1.png" 
images:
 - "/blog/2016-07-30_an-adventure-in-redux-building-reduxadventure/images/1.png" 
 - "/blog/2016-07-30_an-adventure-in-redux-building-reduxadventure/images/2.gif" 


aliases:
    - "/an-adventure-in-redux-building-redux-adventure-c29c647493c0"
---

[Redux](http://redux.js.org/) is a “predictable state container for JavaScript apps.” If you’re like me, reading about a new technology is nice but it takes a good project to really understand it. For some reason, when I hear “state machine” I immediately think of the [Z-machine](http://inform-fiction.org/zmachine/standards/z1point1/index.html) that was created “on a coffee table in Pittsburgh in 1979” that revolutionized computer games in the early 80s by bringing text-based adventure games to myriad platforms.

![Game Screenshot](/blog/2016-07-30_an-adventure-in-redux-building-reduxadventure/images/1.png)

I originally thought of re-factoring my <i class="fab fa-github"></i> [6502 emulator](https://github.com/JeremyLikness/6502emulator) to use Redux, but realized it would be a far bigger task to take on so I decided to build something from scratch instead. Borrowing from an app I wrote for a book I published a few years ago, I built <i class="fab fa-github"></i> [redux-adventure](https://github.com/JeremyLikness/redux-adventure) using [Angular 2](https://angular.io/) and [TypeScript](http://www.typescriptlang.org/) with the [Angular-CLI](http://developer.telerik.com/featured/rapid-cross-platform-development-angular-2-cli/).

## Redux Concepts

There are numerous tutorials online that cover Redux. One problem I find is that a lot tend to over-complicate the description and throw graphs that make it look far more involved than it really is. Rather than re-inventing the wheel, I’ll share a simple description here and then walk through the app that uses it.

Redux is a simple state management tool. Your application may transition through multiple states. At any given time you may raise an event, or create an action, that results in a new state. State is immutable, so actions will never modify the existing model that represents your state but instead will generate a new model. This is the concept that is sometimes difficult to understand.

Redux keeps track of state for you, and offers three key services (there are other APIs, but I’m keeping this simple).

* The ability to _dispatch_ an action, indicating a transition in state
* A set of _reducers_ that respond to an action by providing the new state
* A _subscription_ that receives a notification any time the state changes

## The game

The [redux-adventure](https://jeremylikness.github.io/redux-adventure/) game is fairly straightforward. You are dropped in a random room in a dungeon and must explore the dungeon to find various artifacts. You can look or travel in the four compass directions, and if there is an item you can get it to put it into your inventory. You win the game by retrieving all of the available items.

## State

The state itself is really just a domain model represented by a plain-old JavaScript object (POJO). A “thing” or artifact has a name and a description. Then there are rooms that look like this:

{{<highlight typescript>}}
import { Directions } from './directions';
import { Thing } from './thing';

export class Room {

    public directions: Room[] = [null, null, null, null];
    public walls: Directions[] = [];
    public name: string = '';
    public description: string = '';
    public idx: number = -1;
    public visited: boolean = false;

    public static setIds(rooms: Room[]): void {
        for (let idx = 0; idx < rooms.length; idx += 1) {
            rooms[idx].idx = idx;
        }
    }

    public get longDescription(): string {
        let text = this.name + ': ' + this.description + '\r\n';
        // ... etc.
        return text;
    }

    public setDirection(dir: Directions, room: Room): void {
        this.directions[dir] = room;
    }

    public getDirection(dir): Room {
        return this.directions[dir];
    }
    
    public get north(): Room {
        return this.directions[Directions.North];
    }

    // ... etc.

    public things: Thing[] = []; 
}
{{</highlight>}}

Notice that a room may contain more than one inventory item. It also keeps track of other rooms based on compass direction and walls where there are no rooms to navigate to.

The world itself is represented by a _dungeon_ class that contains rooms, the player’s inventory, the count of total items they must obtain, the current room, a console that contains the text displayed to the user, and a flag indicating whether or not the player has won.

{{<highlight typescript>}}
import { Room } from './room';
import { Thing } from './thing';

export class Dungeon {
    rooms: Room[] = [];
    inventory: Thing[] = [];
    trophyCount: number = 0;
    currentRoomIdx: number = -1;
    public get currentRoom(): Room {
        if (this.currentRoomIdx < 0 || this.currentRoomIdx >= this.rooms.length) {
            return null;
        }
        return this.rooms[this.currentRoomIdx];
    }
    public console: string [] = [];
    public won: boolean = false;
}
{{</highlight>}}

There is also a <i class="fab fa-github"></i> [dungeonMaster](https://github.com/JeremyLikness/redux-adventure/blob/master/src/app/world/dungeonMaster.ts) that generates the world from some seed information and randomly generates walls. Any classes or services with behavior have their own <i class="fab fa-github"></i> [tests](https://github.com/JeremyLikness/redux-adventure/blob/master/src/app/world/dungeonMaster.spec.ts). Now that we have the world defined, what can we do?

## Actions

The user can type in any number of commands that are represented by the [action list](https://github.com/JeremyLikness/redux-adventure/blob/master/src/app/actions/ActionList.ts). Although an action may start as these commands, based on the current state they end up being translated into four key actions:

* _Move_: updates the current room to the room the user has navigated to, and updates the console to indicate the movement and display the description of the new room
* _Get_: transfers inventory from the current room to the user
* _Text_: adds a line of text to the console
* _Won_: transfers the final item of inventory to the user, sets the won flag, and updates the console to indicate the user has won

The <i class="fab fa-github"></i> [createAction](https://github.com/JeremyLikness/redux-adventure/blob/master/src/app/actions/createAction.ts) method is responsible for this logic. TypeScript allows me to write interfaces to make it more clear what an action inspects. Here is the “get” action’s interface:

{{<highlight typescript>}}
export interface IInventoryAction extends IAction {
    type: string;
    item: Thing;
    room: Room;
}
{{</highlight>}}

And here is the code that takes the original action and transforms it into an internal one:

{{<highlight typescript>}}
const checkGet: (dungeon: Dungeon) => IAction = (dungeon: Dungeon) => {
    if (dungeon.currentRoom.things.length < 1) {
        return {
            type: ACTION_TEXT,
            text: 'You get down.'
        } as ITextAction;
    }

    let invCount = dungeon.inventory.length + 1; 
    if (dungeon.trophyCount === invCount) {
        return {
            type: ACTION_WON,
            item: dungeon.currentRoom.things[0],
            room: dungeon.currentRoom
        } as IWonAction;
    }
    return {
        type: ACTION_GET,
        item: dungeon.currentRoom.things[0],
        room: dungeon.currentRoom
    } as IInventoryAction; 
}
{{</highlight>}}

Notice that one “incoming” action can translate to three “internal” actions: text with a snarky comment when there is nothing to get, an action to transfer the inventory to the user, and an action to indicate the user has won.

The translation of actions is fully <i class="fab fa-github"></i> [testable](https://github.com/JeremyLikness/redux-adventure/blob/master/src/app/actions/creationAction.spec.ts). Note that to this point we’ve been working in pure TypeScript/JavaScript — none of this code depends on any external framework yet.

## Reducers

Reducers may take awhile to get used to, but in essence they simply return a new state based on an action and ensure the existing state isn’t mutated. The easiest way to tackle reducers is from the “bottom up” meaning take the lower level properties or nested objects and handle their state, then compose them into higher levels.

As an example, a room contains a set of inventory items. The “get” action transfers inventory to the user, so the `things` property of the room is updated with a new array that no longer contains the item. Here is the TypeScript code:

{{<highlight typescript>}}
import { Thing } from '../world/thing';
import { IAction, IInventoryAction } from '../actions/createAction';
import { ACTION_GET } from '../actions/ActionList';

export const things = (state: Thing[] = [], action: IAction) => {

    if (action.type === ACTION_GET) {
        let inventoryAction = action as IInventoryAction;
        let idx = state.indexOf(inventoryAction.item);
        return [...state.slice(0, idx), ...state.slice(idx+1)];
    }

    return state;
    
}
{{</highlight>}}


If the ellipses notation is confusing, it’s part of a newer spec that allows for composition of items. It essentially represents a portion of the array. What is returned is a new array that no longer has the item. Here is the JavaScript:

{{<highlight typescript>}}
use strict";
var ActionList_1 = require('../actions/ActionList');
exports.things = function (state, action) {
    if (state === void 0) { state = []; }
    if (action.type === ActionList_1.ACTION_GET) {
        var inventoryAction = action;
        var idx = state.indexOf(inventoryAction.item);
        return state.slice(0, idx).concat(state.slice(idx + 1));
    }
    return state;
};
{{</highlight>}}

You can view the corresponding tests written in TypeScript <i class="fab fa-github"></i> [here](https://github.com/JeremyLikness/redux-adventure/blob/master/src/app/reducers/reducer.things.spec.ts). Notice that in the tests, I use `Object.freeze` to ensure that the original instances are not mutated. I freeze both the individual items and the list, and then test that the item is successfully removed.

Another reducer will operate on the array of inventory items for the player. Instead of removing the item as it does from the room, it will return a new array that adds the item to the player’s inventory.

The reducer for the room calls the reducer for the things property and returns a new room with properties copied over (and, in the case of navigating to the room, sets the `visited` flag).

{{<highlight typescript>}}
import { Thing } from '../world/thing';
import { things } from './reducer.things';
import { Room } from '../world/room';
import { IAction, IInventoryAction, IRoomAction } from '../actions/createAction';
import { ACTION_GET, ACTION_MOVE } from '../actions/ActionList';

export const room = (state: Room = new Room(), action: IAction) => {

    let room = new Room();
    room.idx = state.idx;
    room.directions = [...state.directions];
    room.walls = [...state.walls];
    room.name = state.name; 
    room.description = state.description; 
    room.visited = state.visited;
    room.things = action.type === ACTION_GET ? things(state.things, action) : [...state.things]; 
    
    if (action.type === ACTION_MOVE && (<IRoomAction>action).newRoom.visited === false) {
        room.visited = true;
    }

    return room;
}
{{</highlight>}}

You can view the <i class="fab fa-github"></i> [main reducer](https://github.com/JeremyLikness/redux-adventure/blob/master/src/app/reducers/reducer.main.ts) code to see the logic of handling various actions, and calling other reducers as well (i.e. main calls the reducer for the rooms list, and rooms calls the reducer for the individual room).

In the end, the <i class="fab fa-github"></i> [tests](https://github.com/JeremyLikness/redux-adventure/blob/master/src/app/reducers/reducer.main.spec.ts) simply validate that the state changes appropriately based on an action and doesn’t mutate the existing state.

At this stage the entire game logic is complete — all state transitions through to a win are there, and we could write some simple AI to have a robot play the game and output its results. Everything is testable and we have no dependencies on any frameworks (including Redux) yet.

This is a powerful way to build software, because now whether you decide to use Angular, React, plain JavaScript or any other framework, the main business logic and domain remains the same. The code doesn’t change, the tests are all valid and framework agnostic, and the only decision is how you render it.

## The Redux Store

The purpose of Redux is to maintain the state in a store that handles the actions and applies the reducers. We’ve already done all of the legwork, all that’s left is to create the store, respond to changes in state, and dispatch actions as they occur.

The root component of the Angular application handles all of this:

{{<highlight typescript>}}
export class ReduxAdventureAppComponent {
  
  private _store: Store<Dungeon>; 

  public dungeon: Dungeon;
  
  constructor() {
    this._store = createStore(mainReducer);
    this.dungeon = this._store.getState();
    this._store.subscribe(() => this.dungeon = this._store.getState());
  }
  title = 'Welcome to the Redux Adventure!';

  public handleAction(action: string): void {
    this._store.dispatch(createAction(this._store.getState(), action));
  }
}
{{</highlight>}}

Notice how simple the component is! It doesn’t have to handle any business logic. It just creates the store, refreshes a property when the state changes, and dispatches actions.

The template is simple as well. It lists the console, provides a parser to receive user input if the game hasn’t been won yet, and renders a map of the rooms.

{{<highlight html>}}
<h1>
  {{title}}
</h1>
<console [list]="dungeon.console"></console>
<parser *ngIf="!dungeon.won" 
        (action)="handleAction($event)"></parser>
<map [rooms]="dungeon.rooms" 
     [currentRoom]="dungeon.currentRoom"></map>
{{</highlight>}}

With this approach, the components themselves have no business logic at all, but simply respond to the bound data. Let’s dig a little deeper to see.

## Components

Approaching the application in this fashion makes it very easy to build components. For example, this is the console component. It does just two things: exposes a list of text, and responds to changes by setting properties on the div element so that it always scrolls the latest information into view:

{{<highlight typescript>}}
import { Component, Input, ElementRef, OnChanges, ViewChild } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'console',
  templateUrl: 'console.component.html',
  styleUrls: ['console.component.css']
})
export class ConsoleComponent implements OnChanges {

  private div: HTMLDivElement;

  @ViewChild('consoleDiv')
  public set consoleDiv(elem: ElementRef) {
    this.div = elem.nativeElement;
  }

  @Input('list')
  public list: string[];

  constructor() { }

  ngOnChanges(): void {
    if (this.div) {
      setTimeout(() => this.div.scrollTop = this.div.scrollHeight, 0);
    }
  }

}
{{</highlight>}}

If you’re nervous about seeing HTML elements mixed in with the component, don’t worry! They are completely testable without the browser:

{{<highlight typescript>}}
describe('Component: Console', () => {
  it('should create an instance', () => {
    let component = new ConsoleComponent();
    expect(component).toBeTruthy();
  });

  it('should set the scrollTop to the scrollHeight on changes', (done) => {

    let component = new ConsoleComponent();
    let div = {
      scrollTop: 20,
      scrollHeight: 100
    };
    let element: ElementRef = {
      nativeElement: div
    };
    component.consoleDiv = element; 
    component.ngOnChanges();
    setTimeout(() => {
      expect(div.scrollTop).toEqual(div.scrollHeight);
      done();
    },0);
  });
});
{{</highlight>}}

The parser component solely exists to take input and dispatch actions. The main component listens to the parser and uses the event emitter to dispatch actions to the Redux store (that code was listed earlier). The parser itself has an action to emit the input, and another action that auto-submits when the user hits ENTER from within the input box:

{{<highlight typescript>}}
export class ParserComponent {

  @Output('action')
  public action: EventEmitter<string> = new EventEmitter<string>();

  public text: string = '';

  constructor() { }

  public parseInput($event: any) {
    if ($event && $event.keyCode === KEY_ENTER) {
      this.enterText();
    }
  }

  public enterText(): void {
    let command = this.text.toLowerCase().trim();
    if (command) {
      this.action.emit(command);
    }
    this.text = '';
  }

}
{{</highlight>}}

After playing the game I realized it would be a lot easier to test if I had a map, so I created the map component to render the grid and track progress. The <i class="fab fa-github"></i> [map component](https://github.com/JeremyLikness/redux-adventure/blob/master/src/app/map/map.component.spec.ts) itself simply translates the list of rooms into a matrix for rendering cells. For each <i class="fab fa-github"></i> [cell](https://github.com/JeremyLikness/redux-adventure/blob/master/src/app/cell/cell.component.ts), a green square indicates where the user is, a white square is a visited cell (with walls indicated) and a black cell is a place on the map that hasn’t been explored yet.

Despite the heavy manipulation of styles to indicate background colors and walls, this component is also <i class="fab fa-github"></i> [completely testable](https://github.com/JeremyLikness/redux-adventure/blob/master/src/app/cell/cell.component.spec.ts) without relying on the browser.

## Conclusion

You can view the <i class="fab fa-github"></i> [full source code](https://github.com/JeremyLikness/redux-adventure/tree/master/src) on GitHub and play the game [here](https://jeremylikness.github.io/redux-adventure/). Overall, building this was a great learning experience for me. Many of the articles I read had me slightly confused and left me with the feeling it was overcomplicating things, but having gone through the process I can clearly see the benefits of leveraging Redux for apps.

In general, it enables me to build a domain using vanilla TypeScript/JavaScript and declare any logic necessary on the client in a consistent way by addressing actions and reducers. These are all completely testable, so I was able to design and validate the game logic without relying on any third party framework.

Linking Redux was an easy step, and it made the logic for my components even easier. Instead of encapsulating services to drive the application, I was able to create a store, respond to changes to state within the store, and build every component as a completely testable, independent unit.

What do you think? Are you using Redux in your apps? If you are, please use the comments below to share your thoughts.

![Jeremy Likness](/blog/2016-07-30_an-adventure-in-redux-building-reduxadventure/images/2.gif)
