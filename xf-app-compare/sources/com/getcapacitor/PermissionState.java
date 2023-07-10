package com.getcapacitor;

import java.util.Locale;

public enum PermissionState {
    GRANTED("granted"),
    DENIED("denied"),
    PROMPT("prompt"),
    PROMPT_WITH_RATIONALE("prompt-with-rationale");
    
    private String state;

    private PermissionState(String str) {
        this.state = str;
    }

    public String toString() {
        return this.state;
    }

    public static PermissionState byState(String str) {
        return valueOf(str.toUpperCase(Locale.ROOT).replace('-', '_'));
    }
}
