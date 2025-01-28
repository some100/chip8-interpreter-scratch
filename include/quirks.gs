%define quirkshift                                                                     \
    if not quirks.shift {                                                              \
        setregister(X, getregister(Y));                                                \
    }                                                                                  \

%define quirkmemoryIncrementByX                                                        \
    if quirks.memoryIncrementByX and not quirks.memoryLeaveIUnchanged {            \
        cpu.index += X;                                                                \
    }                                                                                  \

%define quirkmemoryLeaveIUnchanged                                                     \
    if not quirks.memoryLeaveIUnchanged and not quirks.memoryIncrementByX {            \
        cpu.index += X + 1;                                                            \
    }                                                                                  \

%define quirkjump                                                                      \
    if quirks.jump {                                                                   \
        i = getregister(X);                                                            \
    } else {                                                                           \
        i = getregister(0);                                                            \
    }                                                                                  \

%define quirklogic                                                                     \
    if quirks.logic {                                                                  \
        setregister("F", 0);                                                           \
    }                                                                                  \

%define quirklimitrpl                                                                  \
    if quirks.limitrpl {                                                               \
        if (("0x" & X) + 1) > 7 {                                                      \
            local j = 7;                                                               \
        }                                                                              \
    } else {                                                                           \
        local j = (("0x" & X) + 1);                                                    \
    }                                                                                  \
