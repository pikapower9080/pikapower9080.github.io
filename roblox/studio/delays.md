# Quick lesson: Delays

Ever wanted to add a delay to your script? I’ll show you how!

The easiest way is with the wait() function. It’s super simple, here’s an example:

```other
-- Wait function example

print("Start")
wait(3)
print("Finish")
```

This will print “Start”, wait 3 seconds and then print “Finish”.

You can also just do wait() with no arguments for it to wait just a fraction of a second to stop your loops from crashing.

## Delay function

The delay function will run a function asynchronously, after a set amount of time. Asynchronous, meaning that the rest of the script won’t wait for it to finish, it will kind of just be doing it’s own thing along side the rest of the code. It’s used like this:

```other
-- Delay function usage

delay(<delay time in seconds>, callback)

-- Example:

delay(10, function()
	print("Done!")
end)
```

That’s it!

