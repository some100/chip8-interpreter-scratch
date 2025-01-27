costumes "files/pixel.svg" as "pixel", "files/pixelsmall.svg" as "pixelsmall";

%include include/display.gs

onflag {
    switch_costume "pixel";
    hide;
}

on "render" {
    erase_all;
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
    setcolorhb 0, -100;
    renderdisplay(display);
    if quirks.xochip {
        setcolorhb 180, 200;
        renderdisplay(display1);
        setcolorhb -360, -54;
        blendpixel(display, display1);
    }
}

proc setcolorhb hue, bright { # Set color in Hue and Brightness (no saturation because Scratch is dumb)
    set_color_effect ($hue / 3.6);
    set_brightness_effect $bright;
}