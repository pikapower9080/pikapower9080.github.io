print("Welcome to the all numbers uhh thing. It's a script that i wrote as a proof of concept for another project and basically what it does is for x amount of times, it will pick a random number and keep picking a new number until all of the numbers in between 1 and x are picked. (Where x is the max number)")
local runTable = {}
io.write("Enter number of numbers\n")
local repeats = io.read()
print("Loading, please wait...")
for i = 1, repeats, 1 do
  local one = 0
  local two = 0
  local three = 0
  local four = 0
  local five = 0
  local six = 0
  local seven = 0
  local eight = 0
  local nine = 0
  local ten = 0
  local eleven = 0
  local twelve = 0
  local thirteen = 0
  local runs = 0

  function gen()
    local num = math.random(1, 13)
    if num == 1 then
      one = one + 1
    end
    if num == 2 then
      two = two + 1
    end
    if num == 3 then
      three = three + 1
    end
    if num == 4 then
      four = four + 1
    end
    if num == 5 then
      five = five + 1
    end
    if num == 6 then
      six = six + 1
    end
    if num == 7 then
      seven = seven + 1
    end
    if num == 8 then
      eight = eight + 1
    end
    if num == 9 then
      nine = nine + 1
    end
    if num == 10 then
      ten = ten + 1
    end
    if num == 11 then
      eleven = eleven + 1
    end
    if num == 12 then
      twelve = twelve + 1
    end
    if num == 13 then
      thirteen = thirteen + 1
    end
    --print(num)
    runs = runs + 1
    return num
  end

  repeat
    gen()
  until one >= 1 and two >= 1 and three >= 1 and four >= 1 and five >= 1 and six >= 1 and seven >= 1 and eight >= 1 and nine >= 1 and ten >= 1 and eleven >= 1 and twelve >= 1 and thirteen >= 1
  --print("Ran ".. runs.. " times")
  table.insert(runTable, 1, runs)
  print(i.. "/".. repeats)
  --print("1:".. one.. "\n2:".. two.. "\n3:".. three.. "\n4:".. four.. "\n5:".. five.. "\n6:".. six.. "\n7:".. seven.. "\n8:".. eight.. "\n9:".. nine.. "\n10:".. ten.. "\n11:".. eleven.. "\n12:".. twelve.. "\n13:".. thirteen)
--end
end

local key, max = 1, runTable[1]
for k, v in ipairs(runTable) do
    if runTable[k] > max then
        key, max = k, v
    end
end

local key, min = 1, runTable[1]
for k, v in ipairs(runTable) do
    if runTable[k] < min then
        key, min = k, v
    end
end

print("Min: ", min)
print("Max: ", max)
os.exit()