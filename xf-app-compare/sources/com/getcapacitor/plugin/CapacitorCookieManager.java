package com.getcapacitor.plugin;

import android.webkit.ValueCallback;
import com.getcapacitor.Bridge;
import java.net.CookieManager;
import java.net.CookiePolicy;
import java.net.CookieStore;
import java.net.HttpCookie;
import java.net.URI;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;

public class CapacitorCookieManager extends CookieManager {
    private final String localUrl;
    private final String serverUrl;
    private final android.webkit.CookieManager webkitCookieManager;

    public CapacitorCookieManager(Bridge bridge) {
        this((CookieStore) null, (CookiePolicy) null, bridge);
    }

    public CapacitorCookieManager(CookieStore cookieStore, CookiePolicy cookiePolicy, Bridge bridge) {
        super(cookieStore, cookiePolicy);
        this.webkitCookieManager = android.webkit.CookieManager.getInstance();
        this.localUrl = bridge.getLocalUrl();
        this.serverUrl = bridge.getServerUrl();
    }

    public String getSanitizedDomain(String str) {
        if (str == null || str.isEmpty()) {
            str = this.localUrl;
        }
        try {
            new URI(str);
            return str;
        } catch (Exception unused) {
            return this.serverUrl;
        }
    }

    private String getDomainFromCookieString(String str) {
        String[] split = str.toLowerCase(Locale.ROOT).split("domain=");
        return getSanitizedDomain(split.length <= 1 ? null : split[1].split(";")[0].trim());
    }

    public String getCookieString(String str) {
        return this.webkitCookieManager.getCookie(str);
    }

    public HttpCookie getCookie(String str, String str2) {
        for (HttpCookie httpCookie : getCookies(str)) {
            if (httpCookie.getName().equals(str2)) {
                return httpCookie;
            }
        }
        return null;
    }

    public HttpCookie[] getCookies(String str) {
        try {
            ArrayList arrayList = new ArrayList();
            String cookieString = getCookieString(str);
            if (cookieString != null) {
                for (String parse : cookieString.split(";")) {
                    HttpCookie httpCookie = HttpCookie.parse(parse).get(0);
                    httpCookie.setValue(httpCookie.getValue());
                    arrayList.add(httpCookie);
                }
            }
            return (HttpCookie[]) arrayList.toArray(new HttpCookie[arrayList.size()]);
        } catch (Exception unused) {
            return new HttpCookie[0];
        }
    }

    public void setCookie(String str, String str2) {
        this.webkitCookieManager.setCookie(str, str2);
        flush();
    }

    public void setCookie(String str, String str2, String str3) {
        setCookie(str, str2 + "=" + str3);
    }

    public void setCookie(String str, String str2, String str3, String str4, String str5) {
        setCookie(str, str2 + "=" + str3 + "; expires=" + str4 + "; path=" + str5);
    }

    public void removeAllCookies() {
        this.webkitCookieManager.removeAllCookies((ValueCallback) null);
        flush();
    }

    public void flush() {
        this.webkitCookieManager.flush();
    }

    public void put(URI uri, Map<String, List<String>> map) {
        if (uri != null && map != null) {
            for (String next : map.keySet()) {
                if (next != null && (next.equalsIgnoreCase("Set-Cookie2") || next.equalsIgnoreCase("Set-Cookie"))) {
                    List<String> list = map.get(next);
                    Objects.requireNonNull(list);
                    List list2 = list;
                    for (String str : list) {
                        setCookie(uri.toString(), str);
                        setCookie(getDomainFromCookieString(str), str);
                    }
                }
            }
        }
    }

    public Map<String, List<String>> get(URI uri, Map<String, List<String>> map) {
        if (uri == null || map == null) {
            throw new IllegalArgumentException("Argument is null");
        }
        String uri2 = uri.toString();
        HashMap hashMap = new HashMap();
        String cookieString = getCookieString(uri2);
        if (cookieString != null) {
            hashMap.put("Cookie", Collections.singletonList(cookieString));
        }
        return hashMap;
    }

    public CookieStore getCookieStore() {
        throw new UnsupportedOperationException();
    }
}
