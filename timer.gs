costumes "files/blank.svg";
# sounds "files/440.wav"; So far there doesn't seem to be a way to include sounds if I'm reading the documentation correctly. So until that feature gets added, this won't have sound immediately OOB. 

onflag {
    initdelaytimer = 0;
    broadcast "soundwait"; # Broadcast these events in order to handle them all at once in the same file
    broadcast "delaywait";
}

on "soundwait" {
    forever {
        set_volume 0;
        wait_until cpu.soundtimer > 0; # Wait for a change in soundtimer variable.
        set_volume 100;
        wait cpu.soundtimer / 60; # Sound timer counts down at 60 hz. Scratch runs at 30 FPS, so we can't totally accurately track that without doing something with timer variable. Instead, we simulate a wait by dividing by 60 and waiting for that many seconds. Programs can't read sound timer, so it doesn't matter if we actually count down or not
        cpu.soundtimer = 0; # Set sound timer to 0, and loop back to wait again after
    }
}

on "delaywait" {
    forever {
        wait_until cpu.delaytimer > 0;
        initdelaytimer = cpu.delaytimer;
        inittimer = timer();
        until cpu.delaytimer <= 0 { # For delaytimer we create a variable that tracks the time that it first started. Because delaytimer ticks down at 60 hz, we get the difference between current time and the initial time (that's the time elapsed), then multiply by 60. Then subtract that number from delaytimer to get our new delaytimer
            timer = (timer() - inittimer) * 60;
            cpu.delaytimer = floor (initdelaytimer - timer);
        }
        cpu.delaytimer = 0; # Set it back to 0 when we get below or equal to 0
    }
}
