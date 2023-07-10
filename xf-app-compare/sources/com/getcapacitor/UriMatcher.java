package com.getcapacitor;

import androidx.webkit.ProxyConfig;
import java.util.ArrayList;
import java.util.regex.Pattern;

public class UriMatcher {
    private static final int EXACT = 0;
    private static final int MASK = 3;
    static final Pattern PATH_SPLIT_PATTERN = Pattern.compile("/");
    private static final int REST = 2;
    private static final int TEXT = 1;
    private ArrayList<UriMatcher> mChildren;
    private Object mCode;
    private String mText;
    private int mWhich;

    public UriMatcher(Object obj) {
        this.mCode = obj;
        this.mWhich = -1;
        this.mChildren = new ArrayList<>();
        this.mText = null;
    }

    private UriMatcher() {
        this.mCode = null;
        this.mWhich = -1;
        this.mChildren = new ArrayList<>();
        this.mText = null;
    }

    public void addURI(String str, String str2, String str3, Object obj) {
        String str4 = str3;
        Object obj2 = obj;
        if (obj2 != null) {
            String[] strArr = null;
            if (str4 != null) {
                if (!str3.isEmpty() && str4.charAt(0) == '/') {
                    str4 = str4.substring(1);
                }
                strArr = PATH_SPLIT_PATTERN.split(str4);
            }
            int length = strArr != null ? strArr.length : 0;
            UriMatcher uriMatcher = this;
            int i = -2;
            while (i < length) {
                String str5 = i == -2 ? str : i == -1 ? str2 : strArr[i];
                ArrayList<UriMatcher> arrayList = uriMatcher.mChildren;
                int size = arrayList.size();
                int i2 = 0;
                while (true) {
                    if (i2 >= size) {
                        break;
                    }
                    UriMatcher uriMatcher2 = arrayList.get(i2);
                    if (str5.equals(uriMatcher2.mText)) {
                        uriMatcher = uriMatcher2;
                        break;
                    }
                    i2++;
                }
                if (i2 == size) {
                    UriMatcher uriMatcher3 = new UriMatcher();
                    if (i == -1 && str5.contains(ProxyConfig.MATCH_ALL_SCHEMES)) {
                        uriMatcher3.mWhich = 3;
                    } else if (str5.equals("**")) {
                        uriMatcher3.mWhich = 2;
                    } else if (str5.equals(ProxyConfig.MATCH_ALL_SCHEMES)) {
                        uriMatcher3.mWhich = 1;
                    } else {
                        uriMatcher3.mWhich = 0;
                    }
                    uriMatcher3.mText = str5;
                    uriMatcher.mChildren.add(uriMatcher3);
                    uriMatcher = uriMatcher3;
                }
                i++;
            }
            uriMatcher.mCode = obj2;
            return;
        }
        throw new IllegalArgumentException("Code can't be null");
    }

    /* JADX WARNING: Code restructure failed: missing block: B:27:0x0059, code lost:
        if (com.getcapacitor.util.HostMask.Parser.parse(r10.mText).matches(r5) == false) goto L_0x0068;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:31:0x0065, code lost:
        if (r10.mText.equals(r5) != false) goto L_0x0067;
     */
    /* JADX WARNING: Removed duplicated region for block: B:34:0x006b A[LOOP:1: B:17:0x0039->B:34:0x006b, LOOP_END] */
    /* JADX WARNING: Removed duplicated region for block: B:45:0x006e A[EDGE_INSN: B:45:0x006e->B:35:0x006e ?: BREAK  , SYNTHETIC] */
    /* Code decompiled incorrectly, please refer to instructions dump. */
    public java.lang.Object match(android.net.Uri r14) {
        /*
            r13 = this;
            java.util.List r0 = r14.getPathSegments()
            int r1 = r0.size()
            if (r1 != 0) goto L_0x0013
            java.lang.String r2 = r14.getAuthority()
            if (r2 != 0) goto L_0x0013
            java.lang.Object r14 = r13.mCode
            return r14
        L_0x0013:
            r2 = -2
            r4 = r13
            r3 = -2
        L_0x0016:
            if (r3 >= r1) goto L_0x0075
            if (r3 != r2) goto L_0x001f
            java.lang.String r5 = r14.getScheme()
            goto L_0x002d
        L_0x001f:
            r5 = -1
            if (r3 != r5) goto L_0x0027
            java.lang.String r5 = r14.getAuthority()
            goto L_0x002d
        L_0x0027:
            java.lang.Object r5 = r0.get(r3)
            java.lang.String r5 = (java.lang.String) r5
        L_0x002d:
            java.util.ArrayList<com.getcapacitor.UriMatcher> r6 = r4.mChildren
            if (r6 != 0) goto L_0x0032
            goto L_0x0075
        L_0x0032:
            int r4 = r6.size()
            r7 = 0
            r8 = 0
            r9 = r8
        L_0x0039:
            if (r7 >= r4) goto L_0x006e
            java.lang.Object r10 = r6.get(r7)
            com.getcapacitor.UriMatcher r10 = (com.getcapacitor.UriMatcher) r10
            int r11 = r10.mWhich
            if (r11 == 0) goto L_0x005f
            r12 = 1
            if (r11 == r12) goto L_0x0067
            r12 = 2
            if (r11 == r12) goto L_0x005c
            r12 = 3
            if (r11 == r12) goto L_0x004f
            goto L_0x0068
        L_0x004f:
            java.lang.String r11 = r10.mText
            com.getcapacitor.util.HostMask r11 = com.getcapacitor.util.HostMask.Parser.parse((java.lang.String) r11)
            boolean r11 = r11.matches(r5)
            if (r11 == 0) goto L_0x0068
            goto L_0x0067
        L_0x005c:
            java.lang.Object r14 = r10.mCode
            return r14
        L_0x005f:
            java.lang.String r11 = r10.mText
            boolean r11 = r11.equals(r5)
            if (r11 == 0) goto L_0x0068
        L_0x0067:
            r9 = r10
        L_0x0068:
            if (r9 == 0) goto L_0x006b
            goto L_0x006e
        L_0x006b:
            int r7 = r7 + 1
            goto L_0x0039
        L_0x006e:
            r4 = r9
            if (r4 != 0) goto L_0x0072
            return r8
        L_0x0072:
            int r3 = r3 + 1
            goto L_0x0016
        L_0x0075:
            java.lang.Object r14 = r4.mCode
            return r14
        */
        throw new UnsupportedOperationException("Method not decompiled: com.getcapacitor.UriMatcher.match(android.net.Uri):java.lang.Object");
    }
}
