package com.capacitorjs.plugins.browser;

import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import androidx.browser.customtabs.CustomTabColorSchemeParams;
import androidx.browser.customtabs.CustomTabsCallback;
import androidx.browser.customtabs.CustomTabsClient;
import androidx.browser.customtabs.CustomTabsIntent;
import androidx.browser.customtabs.CustomTabsServiceConnection;
import androidx.browser.customtabs.CustomTabsSession;

public class Browser {
    public static final int BROWSER_FINISHED = 2;
    public static final int BROWSER_LOADED = 1;
    private static final String CUSTOM_TAB_PACKAGE_NAME = "com.android.chrome";
    private BrowserEventListener browserEventListener;
    private CustomTabsSession browserSession;
    private CustomTabsServiceConnection connection = new CustomTabsServiceConnection() {
        public void onServiceDisconnected(ComponentName componentName) {
        }

        public void onCustomTabsServiceConnected(ComponentName componentName, CustomTabsClient customTabsClient) {
            Browser.this.customTabsClient = customTabsClient;
            customTabsClient.warmup(0);
        }
    };
    private Context context;
    /* access modifiers changed from: private */
    public CustomTabsClient customTabsClient;
    private EventGroup group;
    private boolean isInitialLoad = false;

    interface BrowserEventListener {
        void onBrowserEvent(int i);
    }

    public Browser(Context context2) {
        this.context = context2;
        this.group = new EventGroup(new Browser$$ExternalSyntheticLambda0(this));
    }

    public void setBrowserEventListener(BrowserEventListener browserEventListener2) {
        this.browserEventListener = browserEventListener2;
    }

    public BrowserEventListener getBrowserEventListenerListener() {
        return this.browserEventListener;
    }

    public void open(Uri uri) {
        open(uri, (Integer) null);
    }

    public void open(Uri uri, Integer num) {
        CustomTabsIntent.Builder builder = new CustomTabsIntent.Builder(getCustomTabsSession());
        builder.setShareState(1);
        if (num != null) {
            builder.setDefaultColorSchemeParams(new CustomTabColorSchemeParams.Builder().setToolbarColor(num.intValue()).build());
        }
        CustomTabsIntent build = builder.build();
        Intent intent = build.intent;
        intent.putExtra("android.intent.extra.REFERRER", Uri.parse("2//" + this.context.getPackageName()));
        this.isInitialLoad = true;
        this.group.reset();
        build.launchUrl(this.context, uri);
    }

    public boolean bindService() {
        boolean bindCustomTabsService = CustomTabsClient.bindCustomTabsService(this.context, CUSTOM_TAB_PACKAGE_NAME, this.connection);
        this.group.leave();
        return bindCustomTabsService;
    }

    public void unbindService() {
        this.context.unbindService(this.connection);
        this.group.enter();
    }

    /* access modifiers changed from: private */
    public void handledNavigationEvent(int i) {
        if (i != 2) {
            if (i == 5) {
                this.group.enter();
            } else if (i == 6) {
                this.group.leave();
            }
        } else if (this.isInitialLoad) {
            BrowserEventListener browserEventListener2 = this.browserEventListener;
            if (browserEventListener2 != null) {
                browserEventListener2.onBrowserEvent(1);
            }
            this.isInitialLoad = false;
        }
    }

    /* access modifiers changed from: private */
    public void handleGroupCompletion() {
        BrowserEventListener browserEventListener2 = this.browserEventListener;
        if (browserEventListener2 != null) {
            browserEventListener2.onBrowserEvent(2);
        }
    }

    private CustomTabsSession getCustomTabsSession() {
        CustomTabsClient customTabsClient2 = this.customTabsClient;
        if (customTabsClient2 == null) {
            return null;
        }
        if (this.browserSession == null) {
            this.browserSession = customTabsClient2.newSession(new CustomTabsCallback() {
                public void onNavigationEvent(int i, Bundle bundle) {
                    Browser.this.handledNavigationEvent(i);
                }
            });
        }
        return this.browserSession;
    }
}
