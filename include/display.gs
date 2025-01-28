%define setpixel(spritepixel, screenpixel, plane)                                      \
    if spritepixel > 0 {                                                               \
        if (screenpixel in plane) > 0 {                                                \
            setregister("F", 1);                                                       \
            delete plane[screenpixel in plane];                                        \
        } else {                                                                       \
            add screenpixel to plane;                                                  \
        }                                                                              \
    }                                                                                  \

%define renderdisplay(disp)                                                            \
    i = 1;                                                                             \
    repeat length disp {                                                               \
        x = ((disp[i] % cpu.cols) * cpu.scale) - 236.5;                                \
        y = -1 * ((floor(disp[i] / cpu.cols) * cpu.scale) - 120);                      \
        goto x, y;                                                                     \
        stamp;                                                                         \
        i++;                                                                           \
    }                                                                                  \

%define blendpixel(disp, disp2)                                                        \
    i = 1;                                                                             \
    repeat length disp {                                                               \
        if (disp[i] in disp2) > 0 {                                                    \
            x = ((disp[i] % cpu.cols) * cpu.scale) - 236.5;                            \
            y = -1 * ((floor(disp[i] / cpu.cols) * cpu.scale) - 120);                  \
            goto x, y;                                                                 \
            stamp;                                                                     \
        }                                                                              \
        i++;                                                                           \
    }                                                                                  \

%define scrolldisplayright(disp)                                                       \
    i = 1;                                                                             \
    repeat length disp {                                                               \
        if floor(disp[i] / cpu.cols) == floor((disp[i] + 4) / cpu.cols) and ((disp[i] + 4) < (cpu.cols * cpu.rows)) { \
            disp[i] = disp[i] + 4;                                                     \
            i++;                                                                       \
        } else {                                                                       \
            delete disp[i];                                                            \
        }                                                                              \
    }                                                                                  \

%define scrolldisplayleft(disp)                                                        \
    i = 1;                                                                             \
    repeat length disp {                                                               \
        if floor(disp[i] / cpu.cols) == floor((disp[i] - 4) / cpu.cols) and ((disp[i] - 4) > 0) { \
            disp[i] -= 4;                                                              \
            i++;                                                                       \
        } else {                                                                       \
            delete disp[i];                                                            \
        }                                                                              \
    }                                                                                  \

%define scrolldisplaydown(disp, pixels)                                                \
        i = 1;                                                                         \
        repeat length disp {                                                           \
            if (disp[i] + (cpu.cols * pixels)) < (cpu.cols * cpu.rows) {               \
                disp[i] += cpu.cols * N;                                               \
                i++;                                                                   \
            } else {                                                                   \
                delete disp[i];                                                        \
            }                                                                          \
        }                                                                              \

%define scrolldisplayup(disp, pixels)                                                  \
        i = 1;                                                                         \
        repeat length disp {                                                           \
            if (disp[i] - (cpu.cols * pixels)) > 0 {                                   \
                disp[i] -= cpu.cols * N;                                               \
                i++;                                                                   \
            } else {                                                                   \
                delete disp[i];                                                        \
            }                                                                          \
        }                                                                              \

%define drawtoplanes(spritepixel, screenpixel, disp, disp2)                            \
    if (cpu.plane == 1) or (cpu.plane == 3) {                                          \
        setpixel(spritepixel, screenpixel, disp);                                      \
    }                                                                                  \
    if (cpu.plane == 2) or (cpu.plane == 3) {                                          \
        setpixel(spritepixel, screenpixel, disp2);                                     \
    }                                                                                  \

%define scrolltoplanes(funct, disp, disp2)                                             \
    if (cpu.plane == 1) or (cpu.plane == 3) {                                          \
        funct(disp);                                                                   \
    }                                                                                  \
    if (cpu.plane == 2) or (cpu.plane == 3) {                                          \
        funct(disp2);                                                                  \
    }                                                                                  \

%define scrollplanesvertically(funct, disp, disp2, N)                                  \
    if (cpu.plane == 1) or (cpu.plane == 3) {                                          \
        funct(disp, N);                                                                \
    }                                                                                  \
    if (cpu.plane == 2) or (cpu.plane == 3) {                                          \
        funct(disp2, N);                                                               \
    }                                                                                  \
