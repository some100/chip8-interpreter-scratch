costumes "files/blank.svg";

%define addkey(key, real)                                                              \
    add key to keypad;                                                                 \
    add real to realkeypad;                                                            \
    wait_until not key_pressed(real);                                                  \
    delete keypad[key in keypad];                                                      \
    delete realkeypad[real in realkeypad];                                             \

onkey "1" {
    addkey(1, "1");
}

onkey "2" {
    addkey(2, "2");
}

onkey "3" {
    addkey(3, "3");
}

onkey "4" {
    addkey(12, "4");
}

onkey "q" {
    addkey(4, "q");
}

onkey "w" {
    addkey(5, "w");
}

onkey "e" {
    addkey(6, "e");
}

onkey "r" {
    addkey(13, "r");
}

onkey "a" {
    addkey(7, "a");
}

onkey "s" {
    addkey(8, "s");
}

onkey "d" {
    addkey(9, "d");
}

onkey "f" {
    addkey(14, "f");
}

onkey "z" {
    addkey(10, "z");
}

onkey "x" {
    addkey(0, "x");
}

onkey "c" {
    addkey(11, "c");
}

onkey "v" {
    addkey(15, "v");
}