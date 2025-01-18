costumes "files/blank.svg";

%include include/bitwise.gs

%include include/misc.gs

# this file does literally everything

on "main" {
    forever {
        fetch;
        decode;
    }
}

proc fetch {
    # Get opcode from ROM in memory starting from pc, then increment pc by 2 to next opcode
    cpu.opcode = memory[cpu.pc] & memory[cpu.pc + 1];
    cpu.pc += 2;
}

proc decode {
    # Extract "nibbles" from opcode
    local instruction = cpu.opcode[1];
    local N = ("0x" & cpu.opcode[4]) + 0; # Add 0 to convert from hex to decimal
    local NN = ("0x" & (cpu.opcode[3] & cpu.opcode[4])) + 0;
    local NNN = ("0x" & (cpu.opcode[2] & cpu.opcode[3] & cpu.opcode[4])) + 0;
    local X = cpu.opcode[2];
    local Y = cpu.opcode[3];
    # Big if else statement since Scratch (and by extension goboscript) doesn't have switch statements
    if instruction == 0 {
        decode0 NN; # 0x0 opcode is moved to a separate proc
    } elif instruction == 1 { # Sets pc to NNN, or last 3 digits of opcode in hex (1NNN)
        cpu.pc = NNN;
    } elif instruction == 2 { # Pushes current value of pc into stack, then sets pc to NNN (2NNN)
        add cpu.pc to stack;
        cpu.pc = NNN;
    } elif instruction == 3 { # Check if v[x] == NN, and if true, skip an instruction by increasing pc by 2 (3XNN)
        if getregister(X) == NN {
            cpu.pc += 2;
        }
    } elif instruction == 4 { # Check if v[x] != NN, and if true, skip an instruction by increasing pc by 2 (4XNN)
        if getregister(X) != NN {
            cpu.pc += 2;
        }
    } elif instruction == 5 { # Check if v[x] == v[y], and if true, skip an instruction by increasing pc by 2 (5XY0)
        if getregister(X) == getregister(Y) {
            cpu.pc += 2;
        }
    } elif instruction == 6 { # Set v[x] to NN (6XNN)
        setregister(X, NN);
    } elif instruction == 7 { # Add NN to v[x] (255 as max, otherwise overflow) (7XNN)
        setregister(X, (getregister(X) + (NN)) % 256);
    } elif instruction == 8 {
        decode8 X, Y, N; # 0x8 opcode is moved to a separate proc
    } elif instruction == 9 { # Check if v[x] != v[y], and if true, skip an instruction by increasing pc by 2 (9XY0)
        if getregister(X) != getregister(Y) {
            cpu.pc += 2;
        }
    } elif instruction == "A" { # Set the index register to NNN (ANNN)
        cpu.index = NNN;
    } elif instruction == "B" { # Set pc to NNN + v[x] (BNNN)
        cpu.pc = NNN + getregister(X);
    } elif instruction == "C" { # Set v[x] to a some random number that is ANDed with NN (CXNN)
        setregister(X, bwAND(random(0, 255), NN));
    } elif instruction == "D" { # Draw... (DXYN)
        local xpos = getregister(X) % cpu.cols;
        local ypos = getregister(Y) % cpu.rows;
        local row = 0;
        setregister("F", 0);
        repeat N {
            local col = 0;
            repeat 8 {
                local spritepixel = bwAND(getmemory(cpu.index + row), rshift(128, col));
                local screenpixel = ((ypos + row) % 32) * cpu.cols + ((xpos + col) % 64);
                if spritepixel > 0 {
                    if (screenpixel in display) > 0 {
                        setregister("F", 1);
                        delete display[screenpixel in display];
                    } else {
                        add screenpixel to display;
                    }
                }
                col += 1;
            }
            row += 1;
        }
        broadcast "render";
    } elif instruction == "E" {
        decodeE X, NN; # 0xE opcode is moved to a separate proc
    } elif instruction == "F" {
        decodeF X, NN; # 0xF opcode is moved to a separate proc
    } else { 
        panic;
    }
}

proc decode0 NN {
    local NN = $NN;
    if NN == 224 { # Clears the display, what this does is delete all of the display list, then render to make changes (00E0)
        delete display;
        broadcast "render";
    } elif NN == 238 { # Returns from subroutine by popping from stack (00EE)
        cpu.pc = stack[length stack];
        delete stack[length stack];
    } else {
        panic;
    }
}

proc decode8 X, Y, N {
    local X = $X;
    local Y = $Y;
    local N = $N;
    if N == 0 { # Set v[x] to v[y] (8XY0)
        setregister(X, getregister(Y));
    } elif N == 1 { # Set v[x] to v[x] | v[y] (bitwise OR) (8XY1)
        setregister(X, bwOR(getregister(X), getregister(Y)));
    } elif N == 2 { # Set v[x] to v[x] & v[y] (bitwise AND) (8XY2)
        setregister(X, bwAND(getregister(X), getregister(Y)));
    } elif N == 3 { # Set v[x] to v[x] ^ v[y] (bitwise XOR) (8XY3)
        setregister(X, bwXOR(getregister(X), getregister(Y)));
    } elif N == 4 { # Add v[y] to v[x] (255 as max, otherwise overflow and set v[F] to 1) (8XY4)
        local i = getregister(X) + getregister(Y); # store comparison in advance to set v[F]
        setregister(X, i % 256);
        if i > 255 {
            setregister("F", 1);
        } else {
            setregister("F", 0);
        }
    } elif N == 5 { # Subtract v[y] from v[x] (0 as min and v[F] = 1, otherwise underflow and set v[F] to 0) (8XY5)
        local i = getregister(X) - getregister(Y);
        setregister(X, i % 256);
        if i < 0 {
            setregister("F", 0);
        } else {
            setregister("F", 1);
        }
    } elif N == 6 { # Set v[F] to the least significant bit (or the bit that will be shifted out), then bit shift v[x] to the right by 1 (8XY6)
        local i = bwAND(getregister(X), 1); # store v[x] in advance to set v[F] using previous v[x] value
        setregister(X, rshift(getregister(X), 1));
        setregister("F", i);
    } elif N == 7 { # Set v[x] to v[y] - v[x] (subtract v[x] from v[y] and set v[x] to that result) (0 as min and v[F] = 1, otherwise underflow and set v[F] to 0) (8XY7)
        local i = getregister(Y) - getregister(X);
        setregister(X, i % 256);
        if i < 0 {
            setregister("F", 0);
        } else {
            setregister("F", 1);
        }
    } elif N == 14 { # Set v[F] to the least significant bit (or the bit that will be shifted out), then bit shift v[x] to the left by 1 (255 as max, otherwise overflow) (8XYE)
        local i = bwAND(getregister(X), 128);
        setregister(X, lshift(getregister(X), 1) % 256);
        setregister("F", 0);
        if i > 0 {
            setregister("F", 1);
        }
    } else {
        panic;
    }
}

proc decodeE X, NN {
    local X = $X;
    local NN = $NN;
    if NN == 158 { # Check if v[x] is in keys pressed, and if true, skip an instruction by increasing pc by 2 (EX9E)
        if (getregister(X) in keypad) > 0 {
            cpu.pc += 2;
        }
    } elif NN == 161 { # Check if v[x] is NOT in keys pressed, and if true, skip an instruction by increasing pc by 2 (EXA1)
        if not ((getregister(X) in keypad) > 0) {
            cpu.pc += 2;
        }
    } else {
        panic;
    }
}

proc decodeF X, NN {
    local X = $X;
    local NN = $NN;
    if NN == 7 { # Set v[x] to delaytimer (FX07)
        setregister(X, cpu.delaytimer);
    } elif NN == 10 { # Blocks execution until a key is pressed, then waits for that key to be released and records it in v[x] (FX0A)
        # TBD (seems working but this looks like a possible race condition)
        if key_pressed(realkeypad[1]) {
            registers[X + 1] = keypad[1];
            cpu.pc -= 2;
        } elif registers[X + 1] != keypad[1] {
            cpu.pc -= 2;
        }
    } elif NN == 21 { # Set delaytimer to v[x] (FX15)
        cpu.delaytimer = getregister(X);
    } elif NN == 24 { # Set soundtimer to v[x] (FX18)
        cpu.soundtimer = getregister(X);
    } elif NN == 30 { # Add v[x] to index (FX1E)
        cpu.index += getregister(X);
    } elif NN == 41 { # Set index to v[x] * 5 (contains address of hexadecimal character in memory) (FX29)
        cpu.index = (getregister(X) * 5) + 1; # Add 1 due to the index starting at 1.
    } elif NN == 51 { # Break up v[x] into 3 digits (hundreds, tens, ones) then store them in memory starting from index register (FX33)
        memory[cpu.index] = "0" & (floor (getregister(X) / 100) % 10); # Append 0 at start to prevent mismatched lengths
        memory[cpu.index + 1] = "0" & (floor (getregister(X) / 10)) % 10;
        memory[cpu.index + 2] = "0" & getregister(X) % 10;
    } elif NN == 85 { # Store values of registers v[0] to v[x] (inclusive) into memory starting from index (FX55)
        local i = 0;
        repeat (("0x" & X) + 1) {
            memory[cpu.index + i] = dec2hex(registers[i + 1]);
            i++;
        }
    } elif NN == 101 { # Load values of memory[i] starting from index into registers v[0] to v[x] (inclusive) (FX65)
        local i = 0;
        repeat (("0x" & X) + 1) {
            registers[i + 1] = getmemory(cpu.index + i);
            i++;
        }
    } else {
        panic;
    }
}

proc panic {
    say "Instruction " & cpu.opcode & " at pc " & cpu.pc & " does not exist!";
}
