package com.getcapacitor;

public class ProcessedRoute {
    private boolean ignoreAssetPath;
    private boolean isAsset;
    private String path;

    public String getPath() {
        return this.path;
    }

    public void setPath(String str) {
        this.path = str;
    }

    public boolean isAsset() {
        return this.isAsset;
    }

    public void setAsset(boolean z) {
        this.isAsset = z;
    }

    public boolean isIgnoreAssetPath() {
        return this.ignoreAssetPath;
    }

    public void setIgnoreAssetPath(boolean z) {
        this.ignoreAssetPath = z;
    }
}
