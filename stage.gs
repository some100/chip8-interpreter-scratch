costumes "files/background.svg";

# Global variables

struct cpu {
    pc,
    index,
    opcode,
    cols,
    rows,
    delaytimer,
    soundtimer,
    speed,
    scale,
    hires,
    plane
}

struct quirks {
    shift,
    memoryIncrementByX,
    memoryLeaveIUnchanged,
    wrap,
    jump,
    logic,
    limitrpl,
    schip,
    xochip
}

onflag {
    initlists;
    init;
    broadcast "main";
}

proc init {
    local i = 1;
    local j = 1;
    ask "Please input a program";
    local result = answer();
    repeat ((length result) / 2) {
        memory[511 + i] = result[j] & result[j + 1]; # Replace each item of memory starting from 512 with the first and second character of the program starting from j
        j += 2; # Increment local variable j by 2 to move to next half of instruction (opcode)
        i++; # Increment local variable i by 1 to move to next item of memory
    }
    cpu cpu = cpu {
        pc: 512,
        index: 0,
        opcode: 0x0000,
        cols: 64,
        rows: 32,
        delaytimer: 0,
        soundtimer: 0,
        speed: 24,
        scale: 7.5,
        hires: 0,
        plane: 1
    };
    quirks quirks = quirks {
        shift: 0,
        memoryIncrementByX: 0,
        memoryLeaveIUnchanged: 0,
        wrap: 1,
        jump: 0,
        logic: 0,
        limitrpl: 0,
        schip: 1,
        xochip: 1
    };
    # If xochip is enabled then schip should also be enabled
    # By default the XO-CHIP quirks set is enabled
}

proc initlists {
    if quirks.xochip {
        local memsize = 65536;
    } else {
        local memsize = 4096;
    }
    local i = 1;
    delete registers;
    delete memory;
    delete display;
    delete display1;
    delete stack;
    delete RPL;
    repeat 16 {
        add "00" to registers;
    }
    repeat memsize {
        add "00" to memory;
    }
    repeat length font {
        memory[i] = font[i];
        i++;
    }
    restoreRPL;
}

proc restoreRPL {
    if length RPLpersist > 0 { # Check if RPLpersist exists or isn't empty
        local i = 1;
        local line = "";
        until i == (length RPLpersist) + 1 { # Loop until i is the length of RPLpersist (iterate through every character of variable RPLpersist)
            if RPLpersist[i] == " " { # RPLpersist is basically a space delimited list, so when a space is encountered add the current line (which is 2 chars) to the RPL list
                add line to RPL;
                line = "";
            } else { # If a space is not encountered add i character of RPLpersist to the line local variable
                line &= RPLpersist[i];
            }
            i++;
        }
    } else { # If RPLpersist doesn't exist or is empty initalize it as empty
        cloud RPLpersist = "";
    }
    if length RPL < 16 {
        until length RPL >= 16 { # Fill in missing items of RPL list
            add "00" to RPL;
        }
    }
}

# Global lists

list registers;
list stack;
list display;
list display1;
list keypad;
list realkeypad;
list memory;
list RPL;
list font = file ```files/font.txt```;