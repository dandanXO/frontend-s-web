package com.getcapacitor.plugin.util;

import android.text.TextUtils;
import android.util.Base64;
import androidx.browser.trusted.sharing.ShareTarget;
import androidx.core.app.NotificationCompat;
import com.getcapacitor.Bridge;
import com.getcapacitor.JSObject;
import com.getcapacitor.JSValue;
import com.getcapacitor.PluginCall;
import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.Iterator;
import java.util.Locale;
import java.util.Map;
import org.json.JSONArray;
import org.json.JSONException;

public class HttpRequestHandler {

    @FunctionalInterface
    public interface ProgressEmitter {
        void emit(Integer num, Integer num2);
    }

    public enum ResponseType {
        ARRAY_BUFFER("arraybuffer"),
        BLOB("blob"),
        DOCUMENT("document"),
        JSON("json"),
        TEXT("text");
        
        static final ResponseType DEFAULT = null;
        private final String name;

        static {
            ResponseType responseType;
            DEFAULT = responseType;
        }

        private ResponseType(String str) {
            this.name = str;
        }

        public static ResponseType parse(String str) {
            for (ResponseType responseType : values()) {
                if (responseType.name.equalsIgnoreCase(str)) {
                    return responseType;
                }
            }
            return DEFAULT;
        }
    }

    public static class HttpURLConnectionBuilder {
        public Integer connectTimeout;
        public CapacitorHttpUrlConnection connection;
        public Boolean disableRedirects;
        public JSObject headers;
        public String method;
        public Integer readTimeout;
        public URL url;

        public HttpURLConnectionBuilder setConnectTimeout(Integer num) {
            this.connectTimeout = num;
            return this;
        }

        public HttpURLConnectionBuilder setReadTimeout(Integer num) {
            this.readTimeout = num;
            return this;
        }

        public HttpURLConnectionBuilder setDisableRedirects(Boolean bool) {
            this.disableRedirects = bool;
            return this;
        }

        public HttpURLConnectionBuilder setHeaders(JSObject jSObject) {
            this.headers = jSObject;
            return this;
        }

        public HttpURLConnectionBuilder setMethod(String str) {
            this.method = str;
            return this;
        }

        public HttpURLConnectionBuilder setUrl(URL url2) {
            this.url = url2;
            return this;
        }

        public HttpURLConnectionBuilder openConnection() throws IOException {
            CapacitorHttpUrlConnection capacitorHttpUrlConnection = new CapacitorHttpUrlConnection((HttpURLConnection) this.url.openConnection());
            this.connection = capacitorHttpUrlConnection;
            capacitorHttpUrlConnection.setAllowUserInteraction(false);
            this.connection.setRequestMethod(this.method);
            Integer num = this.connectTimeout;
            if (num != null) {
                this.connection.setConnectTimeout(num.intValue());
            }
            Integer num2 = this.readTimeout;
            if (num2 != null) {
                this.connection.setReadTimeout(num2.intValue());
            }
            Boolean bool = this.disableRedirects;
            if (bool != null) {
                this.connection.setDisableRedirects(bool.booleanValue());
            }
            this.connection.setRequestHeaders(this.headers);
            return this;
        }

        public HttpURLConnectionBuilder setUrlParams(JSObject jSObject) throws MalformedURLException, URISyntaxException, JSONException {
            return setUrlParams(jSObject, true);
        }

        public HttpURLConnectionBuilder setUrlParams(JSObject jSObject, boolean z) throws URISyntaxException, MalformedURLException {
            String str;
            String query = this.url.getQuery();
            String str2 = "";
            if (query == null) {
                query = str2;
            }
            Iterator keys = jSObject.keys();
            if (!keys.hasNext()) {
                return this;
            }
            StringBuilder sb = new StringBuilder(query);
            while (keys.hasNext()) {
                String str3 = (String) keys.next();
                try {
                    StringBuilder sb2 = new StringBuilder();
                    JSONArray jSONArray = jSObject.getJSONArray(str3);
                    for (int i = 0; i < jSONArray.length(); i++) {
                        sb2.append(str3);
                        sb2.append("=");
                        sb2.append(jSONArray.getString(i));
                        if (i != jSONArray.length() - 1) {
                            sb2.append("&");
                        }
                    }
                    if (sb.length() > 0) {
                        sb.append("&");
                    }
                    sb.append(sb2);
                } catch (JSONException unused) {
                    if (sb.length() > 0) {
                        sb.append("&");
                    }
                    sb.append(str3);
                    sb.append("=");
                    sb.append(jSObject.getString(str3));
                }
            }
            String sb3 = sb.toString();
            URI uri = this.url.toURI();
            if (z) {
                this.url = new URI(uri.getScheme(), uri.getAuthority(), uri.getPath(), sb3, uri.getFragment()).toURL();
            } else {
                StringBuilder sb4 = new StringBuilder();
                sb4.append(uri.getScheme());
                sb4.append("://");
                sb4.append(uri.getAuthority());
                sb4.append(uri.getPath());
                if (!sb3.equals(str2)) {
                    str = "?" + sb3;
                } else {
                    str = str2;
                }
                sb4.append(str);
                if (uri.getFragment() != null) {
                    str2 = uri.getFragment();
                }
                sb4.append(str2);
                this.url = new URL(sb4.toString());
            }
            return this;
        }

        public CapacitorHttpUrlConnection build() {
            return this.connection;
        }
    }

    public static JSObject buildResponse(CapacitorHttpUrlConnection capacitorHttpUrlConnection) throws IOException, JSONException {
        return buildResponse(capacitorHttpUrlConnection, ResponseType.DEFAULT);
    }

    public static JSObject buildResponse(CapacitorHttpUrlConnection capacitorHttpUrlConnection, ResponseType responseType) throws IOException, JSONException {
        int responseCode = capacitorHttpUrlConnection.getResponseCode();
        JSObject jSObject = new JSObject();
        jSObject.put(NotificationCompat.CATEGORY_STATUS, responseCode);
        jSObject.put("headers", (Object) buildResponseHeaders(capacitorHttpUrlConnection));
        jSObject.put("url", (Object) capacitorHttpUrlConnection.getURL());
        jSObject.put("data", readData(capacitorHttpUrlConnection, responseType));
        if (capacitorHttpUrlConnection.getErrorStream() != null) {
            jSObject.put("error", true);
        }
        return jSObject;
    }

    public static Object readData(ICapacitorHttpUrlConnection iCapacitorHttpUrlConnection, ResponseType responseType) throws IOException, JSONException {
        InputStream errorStream = iCapacitorHttpUrlConnection.getErrorStream();
        String headerField = iCapacitorHttpUrlConnection.getHeaderField("Content-Type");
        if (errorStream != null) {
            if (isOneOf(headerField, MimeType.APPLICATION_JSON, MimeType.APPLICATION_VND_API_JSON)) {
                return parseJSON(readStreamAsString(errorStream));
            }
            return readStreamAsString(errorStream);
        } else if (headerField != null && headerField.contains(MimeType.APPLICATION_JSON.getValue())) {
            return parseJSON(readStreamAsString(iCapacitorHttpUrlConnection.getInputStream()));
        } else {
            InputStream inputStream = iCapacitorHttpUrlConnection.getInputStream();
            int i = AnonymousClass1.$SwitchMap$com$getcapacitor$plugin$util$HttpRequestHandler$ResponseType[responseType.ordinal()];
            if (i == 1 || i == 2) {
                return readStreamAsBase64(inputStream);
            }
            if (i != 3) {
                return readStreamAsString(inputStream);
            }
            return parseJSON(readStreamAsString(inputStream));
        }
    }

    /* renamed from: com.getcapacitor.plugin.util.HttpRequestHandler$1  reason: invalid class name */
    static /* synthetic */ class AnonymousClass1 {
        static final /* synthetic */ int[] $SwitchMap$com$getcapacitor$plugin$util$HttpRequestHandler$ResponseType;

        /* JADX WARNING: Can't wrap try/catch for region: R(12:0|1|2|3|4|5|6|7|8|9|10|12) */
        /* JADX WARNING: Code restructure failed: missing block: B:13:?, code lost:
            return;
         */
        /* JADX WARNING: Failed to process nested try/catch */
        /* JADX WARNING: Missing exception handler attribute for start block: B:3:0x0012 */
        /* JADX WARNING: Missing exception handler attribute for start block: B:5:0x001d */
        /* JADX WARNING: Missing exception handler attribute for start block: B:7:0x0028 */
        /* JADX WARNING: Missing exception handler attribute for start block: B:9:0x0033 */
        static {
            /*
                com.getcapacitor.plugin.util.HttpRequestHandler$ResponseType[] r0 = com.getcapacitor.plugin.util.HttpRequestHandler.ResponseType.values()
                int r0 = r0.length
                int[] r0 = new int[r0]
                $SwitchMap$com$getcapacitor$plugin$util$HttpRequestHandler$ResponseType = r0
                com.getcapacitor.plugin.util.HttpRequestHandler$ResponseType r1 = com.getcapacitor.plugin.util.HttpRequestHandler.ResponseType.ARRAY_BUFFER     // Catch:{ NoSuchFieldError -> 0x0012 }
                int r1 = r1.ordinal()     // Catch:{ NoSuchFieldError -> 0x0012 }
                r2 = 1
                r0[r1] = r2     // Catch:{ NoSuchFieldError -> 0x0012 }
            L_0x0012:
                int[] r0 = $SwitchMap$com$getcapacitor$plugin$util$HttpRequestHandler$ResponseType     // Catch:{ NoSuchFieldError -> 0x001d }
                com.getcapacitor.plugin.util.HttpRequestHandler$ResponseType r1 = com.getcapacitor.plugin.util.HttpRequestHandler.ResponseType.BLOB     // Catch:{ NoSuchFieldError -> 0x001d }
                int r1 = r1.ordinal()     // Catch:{ NoSuchFieldError -> 0x001d }
                r2 = 2
                r0[r1] = r2     // Catch:{ NoSuchFieldError -> 0x001d }
            L_0x001d:
                int[] r0 = $SwitchMap$com$getcapacitor$plugin$util$HttpRequestHandler$ResponseType     // Catch:{ NoSuchFieldError -> 0x0028 }
                com.getcapacitor.plugin.util.HttpRequestHandler$ResponseType r1 = com.getcapacitor.plugin.util.HttpRequestHandler.ResponseType.JSON     // Catch:{ NoSuchFieldError -> 0x0028 }
                int r1 = r1.ordinal()     // Catch:{ NoSuchFieldError -> 0x0028 }
                r2 = 3
                r0[r1] = r2     // Catch:{ NoSuchFieldError -> 0x0028 }
            L_0x0028:
                int[] r0 = $SwitchMap$com$getcapacitor$plugin$util$HttpRequestHandler$ResponseType     // Catch:{ NoSuchFieldError -> 0x0033 }
                com.getcapacitor.plugin.util.HttpRequestHandler$ResponseType r1 = com.getcapacitor.plugin.util.HttpRequestHandler.ResponseType.DOCUMENT     // Catch:{ NoSuchFieldError -> 0x0033 }
                int r1 = r1.ordinal()     // Catch:{ NoSuchFieldError -> 0x0033 }
                r2 = 4
                r0[r1] = r2     // Catch:{ NoSuchFieldError -> 0x0033 }
            L_0x0033:
                int[] r0 = $SwitchMap$com$getcapacitor$plugin$util$HttpRequestHandler$ResponseType     // Catch:{ NoSuchFieldError -> 0x003e }
                com.getcapacitor.plugin.util.HttpRequestHandler$ResponseType r1 = com.getcapacitor.plugin.util.HttpRequestHandler.ResponseType.TEXT     // Catch:{ NoSuchFieldError -> 0x003e }
                int r1 = r1.ordinal()     // Catch:{ NoSuchFieldError -> 0x003e }
                r2 = 5
                r0[r1] = r2     // Catch:{ NoSuchFieldError -> 0x003e }
            L_0x003e:
                return
            */
            throw new UnsupportedOperationException("Method not decompiled: com.getcapacitor.plugin.util.HttpRequestHandler.AnonymousClass1.<clinit>():void");
        }
    }

    public static boolean isOneOf(String str, MimeType... mimeTypeArr) {
        if (str != null) {
            for (MimeType value : mimeTypeArr) {
                if (str.contains(value.getValue())) {
                    return true;
                }
            }
        }
        return false;
    }

    public static JSObject buildResponseHeaders(CapacitorHttpUrlConnection capacitorHttpUrlConnection) {
        JSObject jSObject = new JSObject();
        for (Map.Entry next : capacitorHttpUrlConnection.getHeaderFields().entrySet()) {
            jSObject.put((String) next.getKey(), TextUtils.join(", ", (Iterable) next.getValue()));
        }
        return jSObject;
    }

    /* JADX WARNING: Can't wrap try/catch for region: R(3:22|23|24) */
    /* JADX WARNING: Code restructure failed: missing block: B:24:0x005a, code lost:
        return new com.getcapacitor.JSArray(r4);
     */
    /* JADX WARNING: Missing exception handler attribute for start block: B:22:0x0055 */
    /* Code decompiled incorrectly, please refer to instructions dump. */
    public static java.lang.Object parseJSON(java.lang.String r4) throws org.json.JSONException {
        /*
            java.lang.String r0 = "false"
            java.lang.String r1 = "true"
            org.json.JSONObject r2 = new org.json.JSONObject
            r2.<init>()
            java.lang.String r2 = "null"
            java.lang.String r3 = r4.trim()     // Catch:{ JSONException -> 0x005b }
            boolean r2 = r2.equals(r3)     // Catch:{ JSONException -> 0x005b }
            if (r2 == 0) goto L_0x0018
            java.lang.Object r4 = org.json.JSONObject.NULL     // Catch:{ JSONException -> 0x005b }
            return r4
        L_0x0018:
            java.lang.String r2 = r4.trim()     // Catch:{ JSONException -> 0x005b }
            boolean r2 = r1.equals(r2)     // Catch:{ JSONException -> 0x005b }
            java.lang.String r3 = "flag"
            if (r2 == 0) goto L_0x002e
            org.json.JSONObject r0 = new org.json.JSONObject     // Catch:{ JSONException -> 0x005b }
            r0.<init>()     // Catch:{ JSONException -> 0x005b }
            org.json.JSONObject r4 = r0.put(r3, r1)     // Catch:{ JSONException -> 0x005b }
            return r4
        L_0x002e:
            java.lang.String r1 = r4.trim()     // Catch:{ JSONException -> 0x005b }
            boolean r1 = r0.equals(r1)     // Catch:{ JSONException -> 0x005b }
            if (r1 == 0) goto L_0x0042
            org.json.JSONObject r1 = new org.json.JSONObject     // Catch:{ JSONException -> 0x005b }
            r1.<init>()     // Catch:{ JSONException -> 0x005b }
            org.json.JSONObject r4 = r1.put(r3, r0)     // Catch:{ JSONException -> 0x005b }
            return r4
        L_0x0042:
            java.lang.String r0 = r4.trim()     // Catch:{ JSONException -> 0x005b }
            int r0 = r0.length()     // Catch:{ JSONException -> 0x005b }
            if (r0 > 0) goto L_0x004f
            java.lang.String r4 = ""
            return r4
        L_0x004f:
            com.getcapacitor.JSObject r0 = new com.getcapacitor.JSObject     // Catch:{ JSONException -> 0x0055 }
            r0.<init>(r4)     // Catch:{ JSONException -> 0x0055 }
            return r0
        L_0x0055:
            com.getcapacitor.JSArray r0 = new com.getcapacitor.JSArray     // Catch:{ JSONException -> 0x005b }
            r0.<init>((java.lang.String) r4)     // Catch:{ JSONException -> 0x005b }
            return r0
        L_0x005b:
            com.getcapacitor.JSArray r0 = new com.getcapacitor.JSArray
            r0.<init>((java.lang.String) r4)
            return r0
        */
        throw new UnsupportedOperationException("Method not decompiled: com.getcapacitor.plugin.util.HttpRequestHandler.parseJSON(java.lang.String):java.lang.Object");
    }

    public static String readStreamAsBase64(InputStream inputStream) throws IOException {
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        try {
            byte[] bArr = new byte[1024];
            while (true) {
                int read = inputStream.read(bArr);
                if (read != -1) {
                    byteArrayOutputStream.write(bArr, 0, read);
                } else {
                    byte[] byteArray = byteArrayOutputStream.toByteArray();
                    String encodeToString = Base64.encodeToString(byteArray, 0, byteArray.length, 0);
                    byteArrayOutputStream.close();
                    return encodeToString;
                }
            }
        } catch (Throwable th) {
            th.addSuppressed(th);
        }
        throw th;
    }

    public static String readStreamAsString(InputStream inputStream) throws IOException {
        BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(inputStream));
        try {
            StringBuilder sb = new StringBuilder();
            String readLine = bufferedReader.readLine();
            while (readLine != null) {
                sb.append(readLine);
                readLine = bufferedReader.readLine();
                if (readLine != null) {
                    sb.append(System.getProperty("line.separator"));
                }
            }
            String sb2 = sb.toString();
            bufferedReader.close();
            return sb2;
        } catch (Throwable th) {
            th.addSuppressed(th);
        }
        throw th;
    }

    public static JSObject request(PluginCall pluginCall, String str, Bridge bridge) throws IOException, URISyntaxException, JSONException {
        String string = pluginCall.getString("url", "");
        JSObject object = pluginCall.getObject("headers", new JSObject());
        JSObject object2 = pluginCall.getObject("params", new JSObject());
        Integer num = pluginCall.getInt("connectTimeout");
        Integer num2 = pluginCall.getInt("readTimeout");
        Boolean bool = pluginCall.getBoolean("disableRedirects");
        Boolean bool2 = pluginCall.getBoolean("shouldEncodeUrlParams", true);
        ResponseType parse = ResponseType.parse(pluginCall.getString("responseType"));
        String string2 = pluginCall.getString("dataType");
        if (str == null) {
            str = pluginCall.getString("method", ShareTarget.METHOD_GET);
        }
        String upperCase = str.toUpperCase(Locale.ROOT);
        boolean z = upperCase.equals("DELETE") || upperCase.equals("PATCH") || upperCase.equals(ShareTarget.METHOD_POST) || upperCase.equals("PUT");
        CapacitorHttpUrlConnection build = new HttpURLConnectionBuilder().setUrl(new URL(string)).setMethod(upperCase).setHeaders(object).setUrlParams(object2, bool2.booleanValue()).setConnectTimeout(num).setReadTimeout(num2).setDisableRedirects(bool).openConnection().build();
        if (bridge != null) {
            build.setSSLSocketFactory(bridge);
        }
        if (z) {
            JSValue jSValue = new JSValue(pluginCall, "data");
            if (jSValue.getValue() != null) {
                build.setDoOutput(true);
                build.setRequestBody(pluginCall, jSValue, string2);
            }
        }
        build.connect();
        return buildResponse(build, parse);
    }
}
