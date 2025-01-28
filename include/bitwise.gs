func bwAND(x, y) {
    local result = 0;
    local i = 1;
    local j = $x;
    local k = $y;
    until j == 0 or k == 0 {
        if (j % 2 == 1) and (k % 2 == 1) {
            result += i;
        }
        j //= 2;
        k //= 2;
        i *= 2;
    }
    return result;
}

func bwOR(x, y) {
    local result = 0;
    local i = 1;
    local j = $x;
    local k = $y;
    until j == 0 and k == 0 {
        if (j % 2 == 1) or (k % 2 == 1) {
            result += i;
        }
        j //= 2;
        k //= 2;
        i *= 2;
    }
    return result;
}

func bwXOR(x, y) {
    local result = 0;
    local i = 1;
    local j = $x;
    local k = $y;
    until j == 0 and k == 0 {
        if ((j % 2 == 1) and (k % 2 == 0)) or ((j % 2 == 0) and (k % 2 == 1)) {
            result += i;
        }
        j //= 2;
        k //= 2;
        i *= 2;
    }
    return result;
}

func lshift(x, y) { # Simulate bit shifting (multiply number by power of 2)
    return $x * antiln(ln 2 * $y);
}

func rshift(x, y) { # Simulate bit shifting (divide number by power of 2)
    return floor($x / antiln(ln 2 * $y));
}

func dec2hex(x) {
    local i = "";
    local j = $x;
    local k = "0123456789ABCDEF";
    until j == 0 {
        i &= k[(j % 16) + 1];
        j = floor((j - (j % 16)) / 16);
    }
    until length i >= 2 {
        i &= "0";
    }
    return i[2]&i[1]; # This is really bad but our inputs are at most 255 in our scenario so it'll do
}