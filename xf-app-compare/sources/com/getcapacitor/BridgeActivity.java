package com.getcapacitor;

import android.content.Intent;
import android.content.res.Configuration;
import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;
import com.getcapacitor.Bridge;
import com.getcapacitor.android.R;
import java.util.ArrayList;
import java.util.List;

public class BridgeActivity extends AppCompatActivity {
    protected int activityDepth = 0;
    protected Bridge bridge;
    protected final Bridge.Builder bridgeBuilder = new Bridge.Builder((AppCompatActivity) this);
    protected CapConfig config;
    protected List<Class<? extends Plugin>> initialPlugins = new ArrayList();
    protected boolean keepRunning = true;

    /* access modifiers changed from: protected */
    public void onCreate(Bundle bundle) {
        super.onCreate(bundle);
        this.bridgeBuilder.setInstanceState(bundle);
        getApplication().setTheme(getResources().getIdentifier("AppTheme_NoActionBar", "style", getPackageName()));
        setTheme(getResources().getIdentifier("AppTheme_NoActionBar", "style", getPackageName()));
        setTheme(R.style.AppTheme_NoActionBar);
        setContentView(R.layout.bridge_layout_main);
        try {
            this.bridgeBuilder.addPlugins(new PluginManager(getAssets()).loadPluginClasses());
        } catch (PluginLoadException e) {
            Logger.error("Error loading plugins.", e);
        }
        load();
    }

    /* access modifiers changed from: protected */
    public void load() {
        Logger.debug("Starting BridgeActivity");
        Bridge create = this.bridgeBuilder.addPlugins(this.initialPlugins).setConfig(this.config).create();
        this.bridge = create;
        this.keepRunning = create.shouldKeepRunning();
        onNewIntent(getIntent());
    }

    public void registerPlugin(Class<? extends Plugin> cls) {
        this.bridgeBuilder.addPlugin(cls);
    }

    public void registerPlugins(List<Class<? extends Plugin>> list) {
        this.bridgeBuilder.addPlugins(list);
    }

    public Bridge getBridge() {
        return this.bridge;
    }

    public void onSaveInstanceState(Bundle bundle) {
        super.onSaveInstanceState(bundle);
        this.bridge.saveInstanceState(bundle);
    }

    public void onStart() {
        super.onStart();
        this.activityDepth++;
        this.bridge.onStart();
        Logger.debug("App started");
    }

    public void onRestart() {
        super.onRestart();
        this.bridge.onRestart();
        Logger.debug("App restarted");
    }

    public void onResume() {
        super.onResume();
        this.bridge.getApp().fireStatusChange(true);
        this.bridge.onResume();
        Logger.debug("App resumed");
    }

    public void onPause() {
        super.onPause();
        this.bridge.onPause();
        Logger.debug("App paused");
    }

    public void onStop() {
        super.onStop();
        int max = Math.max(0, this.activityDepth - 1);
        this.activityDepth = max;
        if (max == 0) {
            this.bridge.getApp().fireStatusChange(false);
        }
        this.bridge.onStop();
        Logger.debug("App stopped");
    }

    public void onDestroy() {
        super.onDestroy();
        this.bridge.onDestroy();
        Logger.debug("App destroyed");
    }

    public void onDetachedFromWindow() {
        super.onDetachedFromWindow();
        this.bridge.onDetachedFromWindow();
    }

    public void onRequestPermissionsResult(int i, String[] strArr, int[] iArr) {
        Bridge bridge2 = this.bridge;
        if (bridge2 != null && !bridge2.onRequestPermissionsResult(i, strArr, iArr)) {
            super.onRequestPermissionsResult(i, strArr, iArr);
        }
    }

    /* access modifiers changed from: protected */
    public void onActivityResult(int i, int i2, Intent intent) {
        Bridge bridge2 = this.bridge;
        if (bridge2 != null && !bridge2.onActivityResult(i, i2, intent)) {
            super.onActivityResult(i, i2, intent);
        }
    }

    /* access modifiers changed from: protected */
    public void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        Bridge bridge2 = this.bridge;
        if (bridge2 != null && intent != null) {
            bridge2.onNewIntent(intent);
        }
    }

    public void onConfigurationChanged(Configuration configuration) {
        super.onConfigurationChanged(configuration);
        Bridge bridge2 = this.bridge;
        if (bridge2 != null) {
            bridge2.onConfigurationChanged(configuration);
        }
    }
}
