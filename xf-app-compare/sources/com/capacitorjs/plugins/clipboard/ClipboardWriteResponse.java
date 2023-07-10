package com.capacitorjs.plugins.clipboard;

public class ClipboardWriteResponse {
    private String errorMessage;
    private boolean success;

    public ClipboardWriteResponse(boolean z) {
        this(z, "");
    }

    public ClipboardWriteResponse(boolean z, String str) {
        this.success = z;
        this.errorMessage = str;
    }

    public boolean isSuccess() {
        return this.success;
    }

    public String getErrorMessage() {
        return this.errorMessage;
    }
}
