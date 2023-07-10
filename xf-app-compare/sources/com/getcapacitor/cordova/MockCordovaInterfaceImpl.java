package com.getcapacitor.cordova;

import android.util.Pair;
import androidx.appcompat.app.AppCompatActivity;
import java.util.concurrent.Executors;
import org.apache.cordova.CordovaInterfaceImpl;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONException;

public class MockCordovaInterfaceImpl extends CordovaInterfaceImpl {
    public MockCordovaInterfaceImpl(AppCompatActivity appCompatActivity) {
        super(appCompatActivity, Executors.newCachedThreadPool());
    }

    public CordovaPlugin getActivityResultCallback() {
        return this.activityResultCallback;
    }

    public boolean handlePermissionResult(int i, String[] strArr, int[] iArr) throws JSONException {
        Pair<CordovaPlugin, Integer> andRemoveCallback = this.permissionResultCallbacks.getAndRemoveCallback(i);
        if (andRemoveCallback == null) {
            return false;
        }
        ((CordovaPlugin) andRemoveCallback.first).onRequestPermissionResult(((Integer) andRemoveCallback.second).intValue(), strArr, iArr);
        return true;
    }
}
