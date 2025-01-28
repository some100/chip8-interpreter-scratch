%define getregister(x) registers[("0x" & x) + 1]
%define setregister(x, y) getregister(x) = y
%define getmemory(x) ("0x" & memory[x]) + 0
%define skipinstructionif(x)                                                           \
    if x {                                                                             \ 
        cpu.pc += 2;                                                                   \
    }                                                                                  \
    if memory[cpu.pc - 2] & memory[cpu.pc - 1] == "F000" {                             \
            cpu.pc += 2;                                                               \
    }                                                                                  \

%define setflagregisterif(x)                                                           \
    if x {                                                                             \
        setregister("F", 1);                                                           \
    } else {                                                                           \
        setregister("F", 0);                                                           \
    }                                                                                  \
