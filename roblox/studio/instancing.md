# Instancing

So we've done all the boring "hello world" printing stuff let's get into some stuff you might actually use in a game!

## What is an instance?
An instance just means anything that you can find in the game explorer. So that could mean any parts, scripts, models, or anything else.

## How do I create an instance?
Instances can be created using `Instance.new("<Instance Name>")`. For example, if you wanted to create a part you could use:

```lua
local myPart = Instance.new("Part")
```

If you do that, it won't do anything though. Well, it will do something but you won't be able to see the part anywhere. 

So why is that? Well, this is because it's being created with a parent of `nil` (meaning it pretty much doesn't exist), meaning it's not in the workspace. Anything that's not in the workspace won't show up in your game. So... you want it to show up in the workspace right? Well, all we have to do now is parent this new part we've made into the workspace!

```lua
local myPart = Instance.new("Part")
myPart.Parent = workspace
```

But that's annoying! It takes up *two whole lines of code* Also, it means that you need to make a variable for everything you create. That's a problem sometimes, so I'll show you how to parent it directly without setting a variable and using another line of code.

```lua
Instance.new("Part", workspace)
```

The second argument is the parent so if you wanted to parent it to something other than workspace you can.

So that's all about creating instances. Right now, if you play the game with that code the part will just spawn in unanchored at the world spawn with nothing special about it.

So, what if you wanted to change that? What if you wanted it to be positioned somewhere else, or be anchored, or maybe even have a custom color!

We'll be covering changing properties in the next section. See you there!

