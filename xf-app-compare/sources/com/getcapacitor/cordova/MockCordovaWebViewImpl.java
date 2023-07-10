package com.getcapacitor.cordova;

import android.content.Context;
import android.content.Intent;
import android.os.Handler;
import android.view.View;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import java.util.List;
import java.util.Map;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPreferences;
import org.apache.cordova.CordovaResourceApi;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.CordovaWebViewEngine;
import org.apache.cordova.ICordovaCookieManager;
import org.apache.cordova.NativeToJsMessageQueue;
import org.apache.cordova.PluginEntry;
import org.apache.cordova.PluginManager;
import org.apache.cordova.PluginResult;

public class MockCordovaWebViewImpl implements CordovaWebView {
    private Context context;
    private CapacitorCordovaCookieManager cookieManager;
    private CordovaInterface cordova;
    private boolean hasPausedEver;
    private NativeToJsMessageQueue nativeToJsMessageQueue;
    private PluginManager pluginManager;
    private CordovaPreferences preferences;
    private CordovaResourceApi resourceApi;
    private WebView webView;

    static /* synthetic */ void lambda$triggerDocumentEvent$1(String str) {
    }

    public boolean backHistory() {
        return false;
    }

    public boolean canGoBack() {
        return false;
    }

    public void clearCache() {
    }

    @Deprecated
    public void clearCache(boolean z) {
    }

    public void clearHistory() {
    }

    public CordovaWebViewEngine getEngine() {
        return null;
    }

    @Deprecated
    public void hideCustomView() {
    }

    public boolean isButtonPlumbedToJs(int i) {
        return false;
    }

    @Deprecated
    public boolean isCustomViewShowing() {
        return false;
    }

    public void setButtonPlumbedToJs(int i, boolean z) {
    }

    @Deprecated
    public void showCustomView(View view, WebChromeClient.CustomViewCallback customViewCallback) {
    }

    public void showWebPage(String str, boolean z, boolean z2, Map<String, Object> map) {
    }

    public void stopLoading() {
    }

    public MockCordovaWebViewImpl(Context context2) {
        this.context = context2;
    }

    public void init(CordovaInterface cordovaInterface, List<PluginEntry> list, CordovaPreferences cordovaPreferences) {
        this.cordova = cordovaInterface;
        this.preferences = cordovaPreferences;
        this.pluginManager = new PluginManager(this, this.cordova, list);
        this.resourceApi = new CordovaResourceApi(this.context, this.pluginManager);
        this.pluginManager.init();
    }

    public void init(CordovaInterface cordovaInterface, List<PluginEntry> list, CordovaPreferences cordovaPreferences, WebView webView2) {
        this.cordova = cordovaInterface;
        this.webView = webView2;
        this.preferences = cordovaPreferences;
        this.pluginManager = new PluginManager(this, this.cordova, list);
        this.resourceApi = new CordovaResourceApi(this.context, this.pluginManager);
        NativeToJsMessageQueue nativeToJsMessageQueue2 = new NativeToJsMessageQueue();
        this.nativeToJsMessageQueue = nativeToJsMessageQueue2;
        nativeToJsMessageQueue2.addBridgeMode(new CapacitorEvalBridgeMode(webView2, this.cordova));
        this.nativeToJsMessageQueue.setBridgeMode(0);
        this.cookieManager = new CapacitorCordovaCookieManager(webView2);
        this.pluginManager.init();
    }

    public static class CapacitorEvalBridgeMode extends NativeToJsMessageQueue.BridgeMode {
        private final CordovaInterface cordova;
        private final WebView webView;

        public CapacitorEvalBridgeMode(WebView webView2, CordovaInterface cordovaInterface) {
            this.webView = webView2;
            this.cordova = cordovaInterface;
        }

        public void onNativeToJsMessageAvailable(NativeToJsMessageQueue nativeToJsMessageQueue) {
            this.cordova.getActivity().runOnUiThread(new MockCordovaWebViewImpl$CapacitorEvalBridgeMode$$ExternalSyntheticLambda0(this, nativeToJsMessageQueue));
        }

        /* access modifiers changed from: package-private */
        /* renamed from: lambda$onNativeToJsMessageAvailable$0$com-getcapacitor-cordova-MockCordovaWebViewImpl$CapacitorEvalBridgeMode  reason: not valid java name */
        public /* synthetic */ void m105lambda$onNativeToJsMessageAvailable$0$comgetcapacitorcordovaMockCordovaWebViewImpl$CapacitorEvalBridgeMode(NativeToJsMessageQueue nativeToJsMessageQueue) {
            String popAndEncodeAsJs = nativeToJsMessageQueue.popAndEncodeAsJs();
            if (popAndEncodeAsJs != null) {
                this.webView.evaluateJavascript(popAndEncodeAsJs, (ValueCallback) null);
            }
        }
    }

    public boolean isInitialized() {
        return this.cordova != null;
    }

    public View getView() {
        return this.webView;
    }

    public void loadUrlIntoView(String str, boolean z) {
        if (str.equals("about:blank") || str.startsWith("javascript:")) {
            this.webView.loadUrl(str);
        }
    }

    public void handlePause(boolean z) {
        if (isInitialized()) {
            this.hasPausedEver = true;
            this.pluginManager.onPause(z);
            triggerDocumentEvent("pause");
            if (!z) {
                setPaused(true);
            }
        }
    }

    public void onNewIntent(Intent intent) {
        PluginManager pluginManager2 = this.pluginManager;
        if (pluginManager2 != null) {
            pluginManager2.onNewIntent(intent);
        }
    }

    public void handleResume(boolean z) {
        if (isInitialized()) {
            setPaused(false);
            this.pluginManager.onResume(z);
            if (this.hasPausedEver) {
                triggerDocumentEvent("resume");
            }
        }
    }

    public void handleStart() {
        if (isInitialized()) {
            this.pluginManager.onStart();
        }
    }

    public void handleStop() {
        if (isInitialized()) {
            this.pluginManager.onStop();
        }
    }

    public void handleDestroy() {
        if (isInitialized()) {
            this.pluginManager.onDestroy();
        }
    }

    @Deprecated
    public void sendJavascript(String str) {
        this.nativeToJsMessageQueue.addJavaScript(str);
    }

    public void eval(String str, ValueCallback<String> valueCallback) {
        new Handler(this.context.getMainLooper()).post(new MockCordovaWebViewImpl$$ExternalSyntheticLambda1(this, str, valueCallback));
    }

    /* access modifiers changed from: package-private */
    /* renamed from: lambda$eval$0$com-getcapacitor-cordova-MockCordovaWebViewImpl  reason: not valid java name */
    public /* synthetic */ void m104lambda$eval$0$comgetcapacitorcordovaMockCordovaWebViewImpl(String str, ValueCallback valueCallback) {
        this.webView.evaluateJavascript(str, valueCallback);
    }

    public void triggerDocumentEvent(String str) {
        eval("window.Capacitor.triggerEvent('" + str + "', 'document');", MockCordovaWebViewImpl$$ExternalSyntheticLambda0.INSTANCE);
    }

    public CordovaResourceApi getResourceApi() {
        return this.resourceApi;
    }

    public void sendPluginResult(PluginResult pluginResult, String str) {
        this.nativeToJsMessageQueue.addPluginResult(pluginResult, str);
    }

    public PluginManager getPluginManager() {
        return this.pluginManager;
    }

    public CordovaPreferences getPreferences() {
        return this.preferences;
    }

    public ICordovaCookieManager getCookieManager() {
        return this.cookieManager;
    }

    public String getUrl() {
        return this.webView.getUrl();
    }

    public Context getContext() {
        return this.webView.getContext();
    }

    public void loadUrl(String str) {
        loadUrlIntoView(str, true);
    }

    public Object postMessage(String str, Object obj) {
        return this.pluginManager.postMessage(str, obj);
    }

    public void setPaused(boolean z) {
        if (z) {
            this.webView.onPause();
            this.webView.pauseTimers();
            return;
        }
        this.webView.onResume();
        this.webView.resumeTimers();
    }
}
