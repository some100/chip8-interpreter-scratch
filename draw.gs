costumes "files/pixel.svg", "files/pixelsmall.svg";

onflag {
    switch_costume "pixel";
    hide;
}

on "render" {
    render;
}

on "changeres" {
    if cpu.hires { # Scale is half in high resolution due to the 2x resolution screen
        cpu.scale = 3.75;
        switch_costume "pixelsmall"; # Also use a 4x4 pixel sprite instead of 2x2
    } else {
        cpu.scale = 7.5;
        switch_costume "pixel";
    }
}

proc render { # Render
    local i = 1;
    erase_all;
    repeat length display {
        local x = ((display[i] % cpu.cols) * cpu.scale) - 236.5; # Get the x coordinate from the display element with modulo of cpu.cols, multiply by 7.5 (scale), then subtract 236.5 because our pixel sprite touches the edge of the stage at x=236
        local y = -1 * ((floor(display[i] / cpu.cols) * cpu.scale) - 120); # Isolate our y coordinate from the display element by dividing it by cpu.cols (floor of that to remove leftover decimal), multiply by 7.5 (scale), then subtract 120 to roughly center it on stage
        goto x, y;
        stamp; 
        i++;
    }
}