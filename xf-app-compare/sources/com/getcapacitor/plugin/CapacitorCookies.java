package com.getcapacitor.plugin;

import android.webkit.JavascriptInterface;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.net.CookieHandler;
import java.net.CookiePolicy;
import java.net.CookieStore;
import java.net.HttpCookie;
import java.net.URI;

@CapacitorPlugin
public class CapacitorCookies extends Plugin {
    CapacitorCookieManager cookieManager;

    public void load() {
        this.bridge.getWebView().addJavascriptInterface(this, "CapacitorCookiesAndroidInterface");
        CapacitorCookieManager capacitorCookieManager = new CapacitorCookieManager((CookieStore) null, CookiePolicy.ACCEPT_ALL, this.bridge);
        this.cookieManager = capacitorCookieManager;
        CookieHandler.setDefault(capacitorCookieManager);
        super.load();
    }

    @JavascriptInterface
    public boolean isEnabled() {
        return getBridge().getConfig().getPluginConfiguration("CapacitorCookies").getBoolean("enabled", false);
    }

    private String getServerUrl(PluginCall pluginCall) {
        String serverUrl = this.bridge.getServerUrl();
        if (pluginCall != null) {
            serverUrl = pluginCall.getString("url", serverUrl);
        }
        if (serverUrl == null || serverUrl.isEmpty()) {
            serverUrl = this.bridge.getLocalUrl();
        }
        if (getUri(serverUrl) != null) {
            return serverUrl;
        }
        if (pluginCall == null) {
            return "";
        }
        pluginCall.reject("Invalid URL. Check that \"server\" is passed in correctly");
        return "";
    }

    private URI getUri(String str) {
        try {
            return new URI(str);
        } catch (Exception unused) {
            return null;
        }
    }

    @JavascriptInterface
    public String getCookies() {
        String cookieString;
        try {
            String serverUrl = getServerUrl((PluginCall) null);
            if (serverUrl.isEmpty() || (cookieString = this.cookieManager.getCookieString(serverUrl)) == null) {
                return "";
            }
            return cookieString;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "";
    }

    @JavascriptInterface
    public void setCookie(String str, String str2) {
        String sanitizedDomain = this.cookieManager.getSanitizedDomain(str);
        if (!sanitizedDomain.isEmpty()) {
            this.cookieManager.setCookie(sanitizedDomain, str2);
        }
    }

    @PluginMethod
    public void getCookies(PluginCall pluginCall) {
        String serverUrl = getServerUrl(pluginCall);
        if (!serverUrl.isEmpty()) {
            JSObject jSObject = new JSObject();
            for (HttpCookie httpCookie : this.cookieManager.getCookies(serverUrl)) {
                jSObject.put(httpCookie.getName(), httpCookie.getValue());
            }
            pluginCall.resolve(jSObject);
        }
    }

    @PluginMethod
    public void setCookie(PluginCall pluginCall) {
        String string = pluginCall.getString("key");
        String string2 = pluginCall.getString("value");
        String serverUrl = getServerUrl(pluginCall);
        String string3 = pluginCall.getString("expires", "");
        String string4 = pluginCall.getString("path", "/");
        if (!serverUrl.isEmpty()) {
            this.cookieManager.setCookie(serverUrl, string, string2, string3, string4);
            pluginCall.resolve();
        }
    }

    @PluginMethod
    public void deleteCookie(PluginCall pluginCall) {
        String string = pluginCall.getString("key");
        String serverUrl = getServerUrl(pluginCall);
        if (!serverUrl.isEmpty()) {
            CapacitorCookieManager capacitorCookieManager = this.cookieManager;
            capacitorCookieManager.setCookie(serverUrl, string + "=; Expires=Wed, 31 Dec 2000 23:59:59 GMT");
            pluginCall.resolve();
        }
    }

    @PluginMethod
    public void clearCookies(PluginCall pluginCall) {
        String serverUrl = getServerUrl(pluginCall);
        if (!serverUrl.isEmpty()) {
            for (HttpCookie httpCookie : this.cookieManager.getCookies(serverUrl)) {
                this.cookieManager.setCookie(serverUrl, httpCookie.getName() + "=; Expires=Wed, 31 Dec 2000 23:59:59 GMT");
            }
            pluginCall.resolve();
        }
    }

    @PluginMethod
    public void clearAllCookies(PluginCall pluginCall) {
        this.cookieManager.removeAllCookies();
        pluginCall.resolve();
    }
}
