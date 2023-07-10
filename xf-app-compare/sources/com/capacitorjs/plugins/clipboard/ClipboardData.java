package com.capacitorjs.plugins.clipboard;

public class ClipboardData {
    private String type;
    private String value;

    public ClipboardData() {
    }

    public ClipboardData(String str, String str2) {
        this.value = str;
        this.type = str2;
    }

    public String getValue() {
        return this.value;
    }

    public String getType() {
        return this.type;
    }

    public void setValue(String str) {
        this.value = str;
    }

    public void setType(String str) {
        this.type = str;
    }
}
