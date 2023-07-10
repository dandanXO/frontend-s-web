package org.apache.cordova.engine;

import android.webkit.CookieManager;
import android.webkit.ValueCallback;
import android.webkit.WebView;
import org.apache.cordova.ICordovaCookieManager;

class SystemCookieManager implements ICordovaCookieManager {
    private final CookieManager cookieManager;
    protected final WebView webView;

    public SystemCookieManager(WebView webView2) {
        this.webView = webView2;
        CookieManager instance = CookieManager.getInstance();
        this.cookieManager = instance;
        CookieManager.setAcceptFileSchemeCookies(true);
        instance.setAcceptThirdPartyCookies(webView2, true);
    }

    public void setCookiesEnabled(boolean z) {
        this.cookieManager.setAcceptCookie(z);
    }

    public void setCookie(String str, String str2) {
        this.cookieManager.setCookie(str, str2);
    }

    public String getCookie(String str) {
        return this.cookieManager.getCookie(str);
    }

    public void clearCookies() {
        this.cookieManager.removeAllCookies((ValueCallback) null);
    }

    public void flush() {
        this.cookieManager.flush();
    }
}
