%define getregister(x) registers[("0x" & x) + 1]
%define setregister(x, y) getregister(x) = y
%define getmemory(x) ("0x" & memory[x]) + 0