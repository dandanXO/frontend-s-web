package org.apache.cordova;

import android.net.Uri;
import androidx.webkit.ProxyConfig;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class AllowList {
    public static final String TAG = "CordovaAllowList";
    private ArrayList<URLPattern> allowList = new ArrayList<>();

    private static class URLPattern {
        public Pattern host;
        public Pattern path;
        public Integer port;
        public Pattern scheme;

        private String regexFromPattern(String str, boolean z) {
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < str.length(); i++) {
                char charAt = str.charAt(i);
                if (charAt == '*' && z) {
                    sb.append(".");
                } else if ("\\.[]{}()^$?+|".indexOf(charAt) > -1) {
                    sb.append('\\');
                }
                sb.append(charAt);
            }
            return sb.toString();
        }

        /* JADX WARNING: Removed duplicated region for block: B:10:0x0024 A[Catch:{ NumberFormatException -> 0x008b }] */
        /* JADX WARNING: Removed duplicated region for block: B:11:0x0027 A[Catch:{ NumberFormatException -> 0x008b }] */
        /* JADX WARNING: Removed duplicated region for block: B:16:0x005b A[Catch:{ NumberFormatException -> 0x008b }] */
        /* JADX WARNING: Removed duplicated region for block: B:22:0x0073 A[Catch:{ NumberFormatException -> 0x008b }] */
        /* Code decompiled incorrectly, please refer to instructions dump. */
        public URLPattern(java.lang.String r6, java.lang.String r7, java.lang.String r8, java.lang.String r9) throws java.net.MalformedURLException {
            /*
                r5 = this;
                r5.<init>()
                r0 = 0
                java.lang.String r1 = "*"
                r2 = 2
                r3 = 0
                if (r6 == 0) goto L_0x001c
                boolean r4 = r1.equals(r6)     // Catch:{ NumberFormatException -> 0x008b }
                if (r4 == 0) goto L_0x0011
                goto L_0x001c
            L_0x0011:
                java.lang.String r6 = r5.regexFromPattern(r6, r0)     // Catch:{ NumberFormatException -> 0x008b }
                java.util.regex.Pattern r6 = java.util.regex.Pattern.compile(r6, r2)     // Catch:{ NumberFormatException -> 0x008b }
                r5.scheme = r6     // Catch:{ NumberFormatException -> 0x008b }
                goto L_0x001e
            L_0x001c:
                r5.scheme = r3     // Catch:{ NumberFormatException -> 0x008b }
            L_0x001e:
                boolean r6 = r1.equals(r7)     // Catch:{ NumberFormatException -> 0x008b }
                if (r6 == 0) goto L_0x0027
                r5.host = r3     // Catch:{ NumberFormatException -> 0x008b }
                goto L_0x0059
            L_0x0027:
                java.lang.String r6 = "*."
                boolean r6 = r7.startsWith(r6)     // Catch:{ NumberFormatException -> 0x008b }
                if (r6 == 0) goto L_0x004f
                java.lang.StringBuilder r6 = new java.lang.StringBuilder     // Catch:{ NumberFormatException -> 0x008b }
                r6.<init>()     // Catch:{ NumberFormatException -> 0x008b }
                java.lang.String r4 = "([a-z0-9.-]*\\.)?"
                r6.append(r4)     // Catch:{ NumberFormatException -> 0x008b }
                java.lang.String r7 = r7.substring(r2)     // Catch:{ NumberFormatException -> 0x008b }
                java.lang.String r7 = r5.regexFromPattern(r7, r0)     // Catch:{ NumberFormatException -> 0x008b }
                r6.append(r7)     // Catch:{ NumberFormatException -> 0x008b }
                java.lang.String r6 = r6.toString()     // Catch:{ NumberFormatException -> 0x008b }
                java.util.regex.Pattern r6 = java.util.regex.Pattern.compile(r6, r2)     // Catch:{ NumberFormatException -> 0x008b }
                r5.host = r6     // Catch:{ NumberFormatException -> 0x008b }
                goto L_0x0059
            L_0x004f:
                java.lang.String r6 = r5.regexFromPattern(r7, r0)     // Catch:{ NumberFormatException -> 0x008b }
                java.util.regex.Pattern r6 = java.util.regex.Pattern.compile(r6, r2)     // Catch:{ NumberFormatException -> 0x008b }
                r5.host = r6     // Catch:{ NumberFormatException -> 0x008b }
            L_0x0059:
                if (r8 == 0) goto L_0x006f
                boolean r6 = r1.equals(r8)     // Catch:{ NumberFormatException -> 0x008b }
                if (r6 == 0) goto L_0x0062
                goto L_0x006f
            L_0x0062:
                r6 = 10
                int r6 = java.lang.Integer.parseInt(r8, r6)     // Catch:{ NumberFormatException -> 0x008b }
                java.lang.Integer r6 = java.lang.Integer.valueOf(r6)     // Catch:{ NumberFormatException -> 0x008b }
                r5.port = r6     // Catch:{ NumberFormatException -> 0x008b }
                goto L_0x0071
            L_0x006f:
                r5.port = r3     // Catch:{ NumberFormatException -> 0x008b }
            L_0x0071:
                if (r9 == 0) goto L_0x0088
                java.lang.String r6 = "/*"
                boolean r6 = r6.equals(r9)     // Catch:{ NumberFormatException -> 0x008b }
                if (r6 == 0) goto L_0x007c
                goto L_0x0088
            L_0x007c:
                r6 = 1
                java.lang.String r6 = r5.regexFromPattern(r9, r6)     // Catch:{ NumberFormatException -> 0x008b }
                java.util.regex.Pattern r6 = java.util.regex.Pattern.compile(r6)     // Catch:{ NumberFormatException -> 0x008b }
                r5.path = r6     // Catch:{ NumberFormatException -> 0x008b }
                goto L_0x008a
            L_0x0088:
                r5.path = r3     // Catch:{ NumberFormatException -> 0x008b }
            L_0x008a:
                return
            L_0x008b:
                java.net.MalformedURLException r6 = new java.net.MalformedURLException
                java.lang.String r7 = "Port must be a number"
                r6.<init>(r7)
                throw r6
            */
            throw new UnsupportedOperationException("Method not decompiled: org.apache.cordova.AllowList.URLPattern.<init>(java.lang.String, java.lang.String, java.lang.String, java.lang.String):void");
        }

        public boolean matches(Uri uri) {
            try {
                Pattern pattern = this.scheme;
                if (pattern != null && !pattern.matcher(uri.getScheme()).matches()) {
                    return false;
                }
                Pattern pattern2 = this.host;
                if (pattern2 != null && !pattern2.matcher(uri.getHost()).matches()) {
                    return false;
                }
                Integer num = this.port;
                if (num != null && !num.equals(Integer.valueOf(uri.getPort()))) {
                    return false;
                }
                Pattern pattern3 = this.path;
                if (pattern3 == null || pattern3.matcher(uri.getPath()).matches()) {
                    return true;
                }
                return false;
            } catch (Exception e) {
                LOG.d(AllowList.TAG, e.toString());
                return false;
            }
        }
    }

    public void addAllowListEntry(String str, boolean z) {
        String str2 = ProxyConfig.MATCH_ALL_SCHEMES;
        if (this.allowList != null) {
            try {
                if (str.compareTo(str2) == 0) {
                    LOG.d(TAG, "Unlimited access to network resources");
                    this.allowList = null;
                    return;
                }
                Matcher matcher = Pattern.compile("^((\\*|[A-Za-z-]+):(//)?)?(\\*|((\\*\\.)?[^*/:]+))?(:(\\d+))?(/.*)?").matcher(str);
                if (matcher.matches()) {
                    String group = matcher.group(2);
                    String group2 = matcher.group(4);
                    if ((!"file".equals(group) && !"content".equals(group)) || group2 != null) {
                        str2 = group2;
                    }
                    String group3 = matcher.group(8);
                    String group4 = matcher.group(9);
                    if (group == null) {
                        this.allowList.add(new URLPattern("http", str2, group3, group4));
                        this.allowList.add(new URLPattern("https", str2, group3, group4));
                        return;
                    }
                    this.allowList.add(new URLPattern(group, str2, group3, group4));
                }
            } catch (Exception unused) {
                LOG.d(TAG, "Failed to add origin %s", str);
            }
        }
    }

    public boolean isUrlAllowListed(String str) {
        if (this.allowList == null) {
            return true;
        }
        Uri parse = Uri.parse(str);
        Iterator<URLPattern> it = this.allowList.iterator();
        while (it.hasNext()) {
            if (it.next().matches(parse)) {
                return true;
            }
        }
        return false;
    }
}
