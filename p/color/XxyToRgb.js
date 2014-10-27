///////// PUT IN YOUR MONITOR-SPECIFIC VALUES IN THE FOLLOWING SECTION /////////
// the constant and slope was taken from the linear equation fit to log
//    luminance as a function of log voltage log voltage
var constantR = 1.5245,
    slopeR =  0.4792,

    constantG = 1.3179,
    slopeG = 0.4834,

    constantB = 1.7755,
    slopeB = 0.5365;

// Monitor gun chromaticiites (x and y are from CIE 1931 xyY space)
var xR  = 0.696,
    yR  = 0.317,

    xG = 0.202,
    yG = 0.685,

    xB = 0.148,
    yB = 0.0515;