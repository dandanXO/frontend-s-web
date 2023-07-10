package com.getcapacitor;

import android.webkit.ValueCallback;
import android.webkit.WebView;

/* compiled from: D8$$SyntheticClass */
public final /* synthetic */ class MessageHandler$$ExternalSyntheticLambda1 implements Runnable {
    public final /* synthetic */ WebView f$0;
    public final /* synthetic */ String f$1;

    public /* synthetic */ MessageHandler$$ExternalSyntheticLambda1(WebView webView, String str) {
        this.f$0 = webView;
        this.f$1 = str;
    }

    public final void run() {
        this.f$0.evaluateJavascript(this.f$1, (ValueCallback) null);
    }
}
