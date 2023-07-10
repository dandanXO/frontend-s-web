package com.getcapacitor.plugin.util;

enum MimeType {
    APPLICATION_JSON("application/json"),
    APPLICATION_VND_API_JSON("application/vnd.api+json"),
    TEXT_HTML("text/html");
    
    private final String value;

    private MimeType(String str) {
        this.value = str;
    }

    /* access modifiers changed from: package-private */
    public String getValue() {
        return this.value;
    }
}
