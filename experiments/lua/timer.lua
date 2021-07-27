function run()
  io.write("How many seconds?\n")
  local waitNum = io.read()
  if waitNum == nil or waitNum == "" then
    print("Invalid number!")
    os.exit()
  else
    waitNum = string.gsub(waitNum, "%W", "")
  end
  print("Started timer for ".. waitNum.. " seconds")
  function wait(n)
      local t = os.clock()
      while os.clock() - t <= n do
        -- nothing
      end
  end
  for i = 1, waitNum, 1 do
    os.execute("clear")
    print("Timer for ".. waitNum.. " seconds:")
    print("Elapsed: ".. i.. " Remaining: ".. waitNum - i)
    wait(1)
  end
  print("Done!")
  io.write("\nType q to quit or r to restart the timer, then press enter\n")
  local input = io.read()
  if input == "" or input == nil then
    print("Invalid input! Terminating program...")
    os.exit()
  elseif input == "q" then
    print("See you later! Run the script again to run again.")
  elseif input == "r" then
    run()
  else
    print("Invalid input!")
    os.exit()
  end
end
run()