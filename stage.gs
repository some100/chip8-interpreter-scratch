costumes "files/blank.svg";

# Global variables

struct cpu {
    pc,
    index,
    opcode,
    cols,
    rows,
    delaytimer,
    soundtimer,
    speed
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
        memory[511 + i] = result[j] & result[j + 1];
        j += 2;
        i++;
    }
    cpu cpu = cpu {
        pc: 512,
        index: 0,
        opcode: 0x0000,
        cols: 64,
        rows: 32,
        delaytimer: 0,
        soundtimer: 0,
        speed: 24
    };
}

proc initlists {
    local i = 1;
    delete registers;
    delete memory;
    delete display;
    delete stack;
    repeat 16 {
        add "00" to registers;
    }
    repeat 4096 {
        add "00" to memory;
    }
    repeat 80 {
        memory[i] = font[i];
        i++;
    }
}

list registers;
list stack;
list display;
list keypad;
list realkeypad;
list memory;
list font = file ```files/font.txt```;