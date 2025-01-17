costumes "files/blank.svg";

onkey "1" {
    add "1" to keypad;
    wait_until not key_pressed("1");
    delete keypad[1 in keypad];
}

onkey "2" {
    add "2" to keypad;
    wait_until not key_pressed("2");
    delete keypad[2 in keypad];
}

onkey "3" {
    add "3" to keypad;
    wait_until not key_pressed("3");
    delete keypad[3 in keypad];
}

onkey "4" {
    add "12" to keypad;
    wait_until not key_pressed("4");
    delete keypad[12 in keypad];
}

onkey "q" {
    add "4" to keypad;
    wait_until not key_pressed("q");
    delete keypad[4 in keypad];
}

onkey "w" {
    add "5" to keypad;
    wait_until not key_pressed("w");
    delete keypad[5 in keypad];
}

onkey "e" {
    add "6" to keypad;
    wait_until not key_pressed("e");
    delete keypad[6 in keypad];
}

onkey "r" {
    add "13" to keypad;
    wait_until not key_pressed("r");
    delete keypad[13 in keypad];
}

onkey "a" {
    add "7" to keypad;
    wait_until not key_pressed("a");
    delete keypad[7 in keypad];
}

onkey "s" {
    add "8" to keypad;
    wait_until not key_pressed("s");
    delete keypad[8 in keypad];
}

onkey "d" {
    add "9" to keypad;
    wait_until not key_pressed("d");
    delete keypad[9 in keypad];
}

onkey "f" {
    add "14" to keypad;
    wait_until not key_pressed("f");
    delete keypad[14 in keypad];
}

onkey "z" {
    add "10" to keypad;
    wait_until not key_pressed("z");
    delete keypad[10 in keypad];
}

onkey "x" {
    add "0" to keypad;
    wait_until not key_pressed("x");
    delete keypad[0 in keypad];
}

onkey "c" {
    add "11" to keypad;
    wait_until not key_pressed("c");
    delete keypad[11 in keypad];
}

onkey "v" {
    add 15 to keypad;
    wait_until not key_pressed("v");
    delete keypad[15 in keypad];
}