package com.getcapacitor;

public class App {
    private AppRestoredListener appRestoredListener;
    private boolean isActive = false;
    private AppStatusChangeListener statusChangeListener;

    public interface AppRestoredListener {
        void onAppRestored(PluginResult pluginResult);
    }

    public interface AppStatusChangeListener {
        void onAppStatusChanged(Boolean bool);
    }

    public boolean isActive() {
        return this.isActive;
    }

    public void setStatusChangeListener(AppStatusChangeListener appStatusChangeListener) {
        this.statusChangeListener = appStatusChangeListener;
    }

    public void setAppRestoredListener(AppRestoredListener appRestoredListener2) {
        this.appRestoredListener = appRestoredListener2;
    }

    /* access modifiers changed from: protected */
    public void fireRestoredResult(PluginResult pluginResult) {
        AppRestoredListener appRestoredListener2 = this.appRestoredListener;
        if (appRestoredListener2 != null) {
            appRestoredListener2.onAppRestored(pluginResult);
        }
    }

    public void fireStatusChange(boolean z) {
        this.isActive = z;
        AppStatusChangeListener appStatusChangeListener = this.statusChangeListener;
        if (appStatusChangeListener != null) {
            appStatusChangeListener.onAppStatusChanged(Boolean.valueOf(z));
        }
    }
}
