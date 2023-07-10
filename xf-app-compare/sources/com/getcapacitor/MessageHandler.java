package com.getcapacitor;

import android.net.Uri;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import androidx.core.app.NotificationCompat;
import androidx.webkit.JavaScriptReplyProxy;
import androidx.webkit.WebMessageCompat;
import androidx.webkit.WebViewCompat;
import androidx.webkit.WebViewFeature;
import org.apache.cordova.PluginManager;

public class MessageHandler {
    private Bridge bridge;
    private PluginManager cordovaPluginManager;
    private JavaScriptReplyProxy javaScriptReplyProxy;
    private WebView webView;

    public MessageHandler(Bridge bridge2, WebView webView2, PluginManager pluginManager) {
        this.bridge = bridge2;
        this.webView = webView2;
        this.cordovaPluginManager = pluginManager;
        if (!WebViewFeature.isFeatureSupported("WEB_MESSAGE_LISTENER") || bridge2.getConfig().isUsingLegacyBridge()) {
            webView2.addJavascriptInterface(this, "androidBridge");
            return;
        }
        try {
            WebViewCompat.addWebMessageListener(webView2, "androidBridge", bridge2.getAllowedOriginRules(), new MessageHandler$$ExternalSyntheticLambda0(this));
        } catch (Exception unused) {
            webView2.addJavascriptInterface(this, "androidBridge");
        }
    }

    /* access modifiers changed from: package-private */
    /* renamed from: lambda$new$0$com-getcapacitor-MessageHandler  reason: not valid java name */
    public /* synthetic */ void m96lambda$new$0$comgetcapacitorMessageHandler(WebView webView2, WebMessageCompat webMessageCompat, Uri uri, boolean z, JavaScriptReplyProxy javaScriptReplyProxy2) {
        if (z) {
            postMessage(webMessageCompat.getData());
            this.javaScriptReplyProxy = javaScriptReplyProxy2;
            return;
        }
        Logger.warn("Plugin execution is allowed in Main Frame only");
    }

    @JavascriptInterface
    public void postMessage(String str) {
        try {
            JSObject jSObject = new JSObject(str);
            String string = jSObject.getString("type");
            boolean z = true;
            boolean z2 = string != null;
            boolean z3 = z2 && string.equals("cordova");
            if (!z2 || !string.equals("js.error")) {
                z = false;
            }
            String string2 = jSObject.getString("callbackId");
            if (z3) {
                String string3 = jSObject.getString(NotificationCompat.CATEGORY_SERVICE);
                String string4 = jSObject.getString("action");
                String string5 = jSObject.getString("actionArgs");
                String tags = Logger.tags("Plugin");
                Logger.verbose(tags, "To native (Cordova plugin): callbackId: " + string2 + ", service: " + string3 + ", action: " + string4 + ", actionArgs: " + string5);
                callCordovaPluginMethod(string2, string3, string4, string5);
            } else if (z) {
                Logger.error("JavaScript Error: " + str);
            } else {
                String string6 = jSObject.getString("pluginId");
                String string7 = jSObject.getString("methodName");
                JSObject jSObject2 = jSObject.getJSObject("options", new JSObject());
                String tags2 = Logger.tags("Plugin");
                Logger.verbose(tags2, "To native (Capacitor plugin): callbackId: " + string2 + ", pluginId: " + string6 + ", methodName: " + string7);
                callPluginMethod(string2, string6, string7, jSObject2);
            }
        } catch (Exception e) {
            Logger.error("Post message error:", e);
        }
    }

    public void sendResponseMessage(PluginCall pluginCall, PluginResult pluginResult, PluginResult pluginResult2) {
        JavaScriptReplyProxy javaScriptReplyProxy2;
        try {
            PluginResult pluginResult3 = new PluginResult();
            pluginResult3.put("save", pluginCall.isKeptAlive());
            pluginResult3.put("callbackId", (Object) pluginCall.getCallbackId());
            pluginResult3.put("pluginId", (Object) pluginCall.getPluginId());
            pluginResult3.put("methodName", (Object) pluginCall.getMethodName());
            if (pluginResult2 != null) {
                pluginResult3.put("success", false);
                pluginResult3.put("error", pluginResult2);
                Logger.debug("Sending plugin error: " + pluginResult3.toString());
            } else {
                pluginResult3.put("success", true);
                if (pluginResult != null) {
                    pluginResult3.put("data", pluginResult);
                }
            }
            if (!(!pluginCall.getCallbackId().equals(PluginCall.CALLBACK_ID_DANGLING))) {
                this.bridge.getApp().fireRestoredResult(pluginResult3);
            } else if (this.bridge.getConfig().isUsingLegacyBridge()) {
                legacySendResponseMessage(pluginResult3);
            } else if (!WebViewFeature.isFeatureSupported("WEB_MESSAGE_LISTENER") || (javaScriptReplyProxy2 = this.javaScriptReplyProxy) == null) {
                legacySendResponseMessage(pluginResult3);
            } else {
                javaScriptReplyProxy2.postMessage(pluginResult3.toString());
            }
        } catch (Exception e) {
            Logger.error("sendResponseMessage: error: " + e);
        }
        if (!pluginCall.isKeptAlive()) {
            pluginCall.release(this.bridge);
        }
    }

    private void legacySendResponseMessage(PluginResult pluginResult) {
        WebView webView2 = this.webView;
        webView2.post(new MessageHandler$$ExternalSyntheticLambda1(webView2, "window.Capacitor.fromNative(" + pluginResult.toString() + ")"));
    }

    private void callPluginMethod(String str, String str2, String str3, JSObject jSObject) {
        this.bridge.callPluginMethod(str2, str3, new PluginCall(this, str2, str, str3, jSObject));
    }

    private void callCordovaPluginMethod(String str, String str2, String str3, String str4) {
        this.bridge.execute(new MessageHandler$$ExternalSyntheticLambda2(this, str2, str3, str, str4));
    }

    /* access modifiers changed from: package-private */
    /* renamed from: lambda$callCordovaPluginMethod$2$com-getcapacitor-MessageHandler  reason: not valid java name */
    public /* synthetic */ void m95lambda$callCordovaPluginMethod$2$comgetcapacitorMessageHandler(String str, String str2, String str3, String str4) {
        this.cordovaPluginManager.exec(str, str2, str3, str4);
    }
}
