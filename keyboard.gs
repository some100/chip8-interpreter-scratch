costumes "files/blank.svg";

onkey "1" {
    add "1" to keypad;
    add "1" to realkeypad;
    wait_until not key_pressed("1");
    delete keypad[1 in keypad];
    delete realkeypad[1 in realkeypad];
}

onkey "2" {
    add "2" to keypad;
    add "2" to realkeypad;
    wait_until not key_pressed("2");
    delete keypad[2 in keypad];
    delete realkeypad[2 in realkeypad];
}

onkey "3" {
    add "3" to keypad;
    add "3" to realkeypad;
    wait_until not key_pressed("3");
    delete keypad[3 in keypad];
    delete realkeypad[3 in realkeypad];
}

onkey "4" {
    add "12" to keypad;
    add "4" to realkeypad;
    wait_until not key_pressed("4");
    delete keypad[12 in keypad];
    delete realkeypad[4 in realkeypad];
}

onkey "q" {
    add "4" to keypad;
    add "q" to realkeypad;
    wait_until not key_pressed("q");
    delete keypad[4 in keypad];
    delete realkeypad["q" in realkeypad];
}

onkey "w" {
    add "5" to keypad;
    add "w" to realkeypad;
    wait_until not key_pressed("w");
    delete keypad[5 in keypad];
    delete realkeypad["w" in realkeypad];
}

onkey "e" {
    add "6" to keypad;
    add "e" to realkeypad;
    wait_until not key_pressed("e");
    delete keypad[6 in keypad];
    delete realkeypad["e" in realkeypad];
}

onkey "r" {
    add "13" to keypad;
    add "r" to realkeypad;
    wait_until not key_pressed("r");
    delete keypad[13 in keypad];
    delete realkeypad["r" in realkeypad];
}

onkey "a" {
    add "7" to keypad;
    add "a" to realkeypad;
    wait_until not key_pressed("a");
    delete keypad[7 in keypad];
    delete realkeypad["a" in realkeypad];
}

onkey "s" {
    add "8" to keypad;
    add "s" to realkeypad;
    wait_until not key_pressed("s");
    delete keypad[8 in keypad];
    delete realkeypad["s" in realkeypad];
}

onkey "d" {
    add "9" to keypad;
    add "d" to realkeypad;
    wait_until not key_pressed("d");
    delete keypad[9 in keypad];
    delete realkeypad["d" in realkeypad];
}

onkey "f" {
    add "14" to keypad;
    add "f" to realkeypad;
    wait_until not key_pressed("f");
    delete keypad[14 in keypad];
    delete realkeypad["f" in realkeypad];
}

onkey "z" {
    add "10" to keypad;
    add "z" to realkeypad;
    wait_until not key_pressed("z");
    delete keypad[10 in keypad];
    delete realkeypad["z" in realkeypad];
}

onkey "x" {
    add "0" to keypad;
    add "x" to realkeypad;
    wait_until not key_pressed("x");
    delete keypad[0 in keypad];
    delete realkeypad["x" in realkeypad];
}

onkey "c" {
    add "11" to keypad;
    add "c" to realkeypad;
    wait_until not key_pressed("c");
    delete keypad[11 in keypad];
    delete realkeypad["c" in realkeypad];
}

onkey "v" {
    add 15 to keypad;
    add "v" to realkeypad;
    wait_until not key_pressed("v");
    delete keypad[15 in keypad];
    delete realkeypad["v" in realkeypad];
}