costumes "files/pixel.svg";

onflag {
    hide;
}

on "render" {
    render;
}

proc render {
    local i = 1;
    erase_all;
    repeat length display {
        local x = ((display[i] % cpu.cols) * 7.5) - 236;
        local y = -1 * ((floor(display[i] / cpu.cols) * 7.5) - 120);
        goto x, y;
        stamp; 
        i++;
    }
}