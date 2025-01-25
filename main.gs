costumes "files/blank.svg";

%include include/bitwise.gs

%include include/misc.gs

# this file does literally everything

on "main" {
    forever {
        main;
    }
}

proc main {
    repeat cpu.speed {
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
    } elif instruction == 3 { # Check if vX == NN, and if true, skip an instruction by increasing pc by 2 (3XNN)
        skipinstructionif getregister(X) == NN;
    } elif instruction == 4 { # Check if vX != NN, and if true, skip an instruction by increasing pc by 2 (4XNN)
        skipinstructionif getregister(X) != NN;
    } elif instruction == 5 { # Check if vX == vY, and if true, skip an instruction by increasing pc by 2 (5XY0)
        skipinstructionif getregister(X) == getregister(Y);
    } elif instruction == 6 { # Set vX to NN (6XNN)
        setregister(X, NN);
    } elif instruction == 7 { # Add NN to vX (255 as max, otherwise overflow) (7XNN)
        setregister(X, (getregister(X) + (NN)) % 256);
    } elif instruction == 8 {
        decode8 X, Y, N; # 0x8 opcode is moved to a separate proc
    } elif instruction == 9 { # Check if vX != vY, and if true, skip an instruction by increasing pc by 2 (9XY0)
        skipinstructionif getregister(X) != getregister(Y);
    } elif instruction == "A" { # Set the index register to NNN (ANNN)
        cpu.index = NNN;
    } elif instruction == "B" { # Set pc to NNN + v0 or vX depending on behavior (BNNN)
        if quirks.jumpwithoffsetvX {
            local i = getregister(X); # Set i to vX if quirk is set
        } else {
            local i = getregister(0);
        }
        cpu.pc = NNN + i;
    } elif instruction == "C" { # Set vX to some random number that is ANDed with NN (CXNN)
        setregister(X, bwAND(random(0, 255), NN));
    } elif instruction == "D" { # Draw... (DXYN)
        local xpos = getregister(X) % cpu.cols;
        local ypos = getregister(Y) % cpu.rows;
        local row = 0;
        setregister("F", 0);
        if N != 0 { # Check if N equals zero, this is equal to drawing a zero height sprite.
            repeat N {
                local col = 0;
                repeat 8 {
                     if quirks.wrapping or (((ypos + row) < cpu.rows) and ((xpos + col) < cpu.cols)) { # Check if wrapping is enabled, otherwise check if the expected pixel falls within the screen. If it doesn't don't draw the pixel entirely (clipping)
                        local spritepixel = bwAND(getmemory(cpu.index + row), rshift(128, col)); # Get sprite from cpu.index, then add row since we're iterating through each row of the sprite. Then AND with 128 << col since we're going through each col of the sprite row
                        local screenpixel = ((ypos + row) % cpu.rows) * cpu.cols + ((xpos + col) % cpu.cols); # Add the row of the sprite to vY and modulo cpu.rows (in case wrapping is needed), then multiply by cpu.cols to separate from our X coordinate. Then do basically the same for vX
                        if spritepixel > 0 { # Check if there is a pixel in that area of the sprite before drawing/erasing
                            if (screenpixel in display) > 0 { # Check if the screen pixel already exists in display, and erase if so
                                setregister("F", 1);
                                delete display[screenpixel in display];
                            } else {
                                add screenpixel to display;
                            }
                        }
                    }
                    col += 1;
                }
                row += 1;
            }
        } elif quirks.schipinstructions { # SUPERCHIP repurposes a 0-height sprite to draw a 16x16 sprite, so check if it's enabled. If not, don't do anything.
            repeat 16 { # I don't even know how to explain the below. Thanks ajor for the implementation
                local col = 0;
                local i = cpu.index + row*2;
                local addr = "0x" & memory[i] & memory[i + 1];
                repeat 16 {
                    if quirks.wrapping or (((ypos + row) < cpu.rows) and ((xpos + col) < cpu.cols)) {
                        local spritepixel = bwAND(addr, rshift(32768, col));
                        local screenpixel = ((ypos + row) % cpu.rows) * cpu.cols + ((xpos + col) % cpu.cols);
                        if spritepixel > 0 {
                            if (screenpixel in display) > 0 {
                                setregister("F", 1);
                                delete display[screenpixel in display];
                            } else {
                                add screenpixel to display;
                            }
                        }
                    }
                    col += 1;
                }
                row += 1;
            }
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
    } elif quirks.schipinstructions {
        decode0SCHIP NN;
    } else {
        panic;
    }
}

proc decode0SCHIP NN {
    local NN = $NN;
    if NN == 251 { # Scroll display right by 4 pixels (00FB) (SCHIP)
        local i = 1;
        repeat length display {
            if floor(display[i] / cpu.cols) == floor((display[i] + 4) / cpu.cols) and ((display[i] + 4) < (cpu.cols * cpu.rows)) { # Check whether floor of display element by columns will be the same as floor of scrolled display element by columns, or determine whether it wraps or not. Additionally check for if its greater than number of pixels that can be on screen
                display[i] = display[i] + 4; # If the pixel won't wrap, scroll right
                i++; # Increment i (local variable) only when the pixel can be wrapped 
            } else {
                delete display[i]; # We don't want to wrap the display so just delete the element entirely
            }
        }
        broadcast "render";
    } elif NN == 252 { # Scroll display left by 4 pixels (00FC) (SCHIP)
        local i = 1;
        repeat length display {
            if floor(display[i] / cpu.cols) == floor((display[i] - 4) / cpu.cols) and ((display[i] - 4) > 0) {
                display[i] -= 4; # If the pixel won't wrap, scroll left
                i++;
            } else {
                delete display[i];
            }
        }
        broadcast "render";
    } elif NN == 253 { # Stop VM immediately (00FD) (SCHIP)
        stop_all;
    } elif NN == 254 { # Enable low resolution mode, or disable high resolution mode (00FE) (SCHIP)
        cpu.cols = 64;
        cpu.rows = 32;
        cpu.hires = 0;
        broadcast "changeres";
    } elif NN == 255 { # Disable low resolution mode, or enable high resolution mode (00FF) (SCHIP)
        cpu.cols = 128;
        cpu.rows = 64;
        cpu.hires = 1;
        broadcast "changeres";
    } elif cpu.opcode[3] == "C" { # Special case, scroll display down by N pixels (00CN) (SCHIP)
        local N = ("0x" & cpu.opcode[4]) + 0;
        local i = 1;
        repeat length display {
            if (display[i] + (cpu.cols * N)) < (cpu.cols * cpu.rows) {
                display[i] += cpu.cols * N;
                i++;
            } else {
                delete display[i];
            }
        }
        broadcast "render";
    } else {
        panic;
    } 
}

proc decode8 X, Y, N {
    local X = $X;
    local Y = $Y;
    local N = $N;
    if N == 0 { # Set vX to vY (8XY0)
        setregister(X, getregister(Y));
    } elif N == 1 { # Set vX to vX | vY (bitwise OR) (8XY1)
        setregister(X, bwOR(getregister(X), getregister(Y)));
        resetvF; # Reset vF if quirk resetvF is enabled to replicate old COSMAC VIP behavior
    } elif N == 2 { # Set vX to vX & vY (bitwise AND) (8XY2)
        setregister(X, bwAND(getregister(X), getregister(Y)));
        resetvF;
    } elif N == 3 { # Set vX to vX ^ vY (bitwise XOR) (8XY3)
        setregister(X, bwXOR(getregister(X), getregister(Y)));
        resetvF;
    } elif N == 4 { # Add vY to vX (255 as max, otherwise overflow and set vF to 1) (8XY4)
        local i = getregister(X) + getregister(Y); # store comparison in advance to set vF
        setregister(X, i % 256);
        setflagregisterif i > 255;
    } elif N == 5 { # Subtract vY from vX (0 as min and vF = 1, otherwise underflow and set vF to 0) (8XY5)
        local i = getregister(X) - getregister(Y);
        setregister(X, i % 256);
        setflagregisterif i > 0;
    } elif N == 6 { # Set vF to the least significant bit (or the bit that will be shifted out), then bit shift vX to the right by 1 (8XY6)
        if quirks.shiftY {
            setregister(X, getregister(Y));
        }
        local i = bwAND(getregister(X), 1); # store vX in advance to set vF using previous vX value
        setregister(X, rshift(getregister(X), 1));
        setregister("F", i);
    } elif N == 7 { # Set vX to vY - vX (subtract vX from vY and set vX to that result) (0 as min and vF = 1, otherwise underflow and set vF to 0) (8XY7)
        local i = getregister(Y) - getregister(X);
        setregister(X, i % 256);
        setflagregisterif i > 0;
    } elif N == 14 { # Set vF to the least significant bit (or the bit that will be shifted out), then bit shift vX to the left by 1 (255 as max, otherwise overflow) (8XYE)
        if quirks.shiftY {
            setregister(X, getregister(Y));
        }
        local i = bwAND(getregister(X), 128);
        setregister(X, lshift(getregister(X), 1) % 256);
        setflagregisterif i > 0;
    } else {
        panic;
    }
}

proc decodeE X, NN {
    local X = $X;
    local NN = $NN;
    if NN == 158 { # Check if vX is in keys pressed, and if true, skip an instruction by increasing pc by 2 (EX9E)
        skipinstructionif (getregister(X) in keypad) > 0;
    } elif NN == 161 { # Check if vX is NOT in keys pressed, and if true, skip an instruction by increasing pc by 2 (EXA1)
        skipinstructionif not ((getregister(X) in keypad) > 0);
    } else {
        panic;
    }
}

proc decodeF X, NN {
    local X = $X;
    local NN = $NN;
    if NN == 7 { # Set vX to delaytimer (FX07)
        setregister(X, cpu.delaytimer);
    } elif NN == 10 { # Blocks execution until a key is pressed, then waits for that key to be released and records it in vX (FX0A)
        # TBD (seems working but this looks like a possible race condition)
        if key_pressed(realkeypad[1]) {
            registers[X + 1] = keypad[1];
            cpu.pc -= 2;
        } elif registers[X + 1] != keypad[1] {
            cpu.pc -= 2;
        }
    } elif NN == 21 { # Set delaytimer to vX (FX15)
        cpu.delaytimer = getregister(X);
    } elif NN == 24 { # Set soundtimer to vX (FX18)
        cpu.soundtimer = getregister(X);
    } elif NN == 30 { # Add vX to index (FX1E)
        cpu.index += getregister(X);
    } elif NN == 41 { # Set index to vX * 5 (contains address of hexadecimal character in memory) (FX29)
        cpu.index = (getregister(X) * 5) + 1; # Add 1 due to the index starting at 1.
    } elif NN == 51 { # Break up vX into 3 digits (hundreds, tens, ones) then store them in memory starting from index register (FX33)
        memory[cpu.index] = "0" & (floor (getregister(X) / 100) % 10); # Append 0 at start to prevent mismatched lengths
        memory[cpu.index + 1] = "0" & (floor (getregister(X) / 10)) % 10;
        memory[cpu.index + 2] = "0" & getregister(X) % 10;
    } elif NN == 85 { # Store values of registers v0 to vX (inclusive) into memory starting from index (FX55)
        local i = 0;
        repeat (("0x" & X) + 1) {
            memory[cpu.index + i] = dec2hex(registers[i + 1]);
            i++;
        }
        if quirks.incrementindex {
            cpu.index += X + 1;
        }
    } elif NN == 101 { # Load values of memory[i] starting from index into registers v0 to vX (inclusive) (FX65)
        local i = 0;
        repeat (("0x" & X) + 1) {
            registers[i + 1] = getmemory(cpu.index + i);
            i++;
        }
        if quirks.incrementindex {
            cpu.index += X + 1;
        }
    } elif quirks.schipinstructions {
        decodeFSCHIP X, NN;  
    } else {
        panic;
    }
}

proc decodeFSCHIP X, NN {
    local X = $X;
    local NN = $NN;
    if NN == 48 { # Set index to vX * 10 + 80 (contains address of large hexadecimal character in memory) (FX30) (SCHIP)
        cpu.index = (getregister(X) * 10) + 81; # Small character fonts are stored from 0x00 to 0x50. In decimal that's 0 to 80. Our large font is stored just beyond that, so we multiply the value in vX by 10 for the character length, then set it at 80
    } elif NN == 117 { # Store values of registers v0 to vX (inclusive) into RPL persistent storage (FX75) (SCHIP)
        local i = 1;
        repeat (("0x" & X) + 1) { # According to reference X must be between 0 and 7. I decided not to limit it in my implementation because that was a hardware limitation from the HP48.
            RPL[i] = registers[i];
            i++;
        }
        updateRPL;
    } elif NN == 133 { # Load values of RPL into registers v0 to vX (inclusive) (FX85) (SCHIP)
        local i = 0;
        repeat (("0x" & X) + 1) {
            setregister(i, RPL[i + 1]);
            i++;
        }
    }
}

proc resetvF {
    if quirks.resetvF {
        setregister("F", 0);
    }
}

proc skipinstructionif x {
    if $x == true {
        cpu.pc += 2;
    }
}

proc setflagregisterif x {
    if $x == true {
        setregister("F", 1);
    } else {
        setregister("F", 0);
    }
}

proc updateRPL {
    RPLpersist = "";
    if length RPL > 0 {
        local i = 1;
        repeat length RPL {
            RPLpersist &= (RPL[i] & " ");
            i++;
        }
    }
}

proc panic {
    say "Instruction " & cpu.opcode & " at pc " & cpu.pc & " does not exist!";
}
