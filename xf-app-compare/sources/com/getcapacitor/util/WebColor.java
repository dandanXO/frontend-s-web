package com.getcapacitor.util;

import android.graphics.Color;

public class WebColor {
    public static int parseColor(String str) {
        if (str.charAt(0) != '#') {
            str = "#" + str;
        }
        if (str.length() != 7 && str.length() != 9) {
            throw new IllegalArgumentException("The encoded color space is invalid or unknown");
        } else if (str.length() == 7) {
            return Color.parseColor(str);
        } else {
            return Color.parseColor("#" + str.substring(7) + str.substring(1, 7));
        }
    }
}
