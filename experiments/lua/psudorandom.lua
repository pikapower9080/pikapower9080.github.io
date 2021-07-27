io.write("Min number?\n")
local min = io.read()
io.write("Max number?\n")
local max = io.read()
io.write("How many numbers?\n")
local numRepeat = io.read()

function gen()
  return math.random(min, max)
end
function wait(n)
  local t = os.clock()
  while os.clock() - t <= n do
    -- nothing
  end
end

os.execute("clear")
for i = 1, numRepeat, 1 do
  print(gen())
end
os.exit()
