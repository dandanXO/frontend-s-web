package com.getcapacitor;

import android.net.Uri;
import android.webkit.WebView;
import androidx.webkit.JavaScriptReplyProxy;
import androidx.webkit.WebMessageCompat;
import androidx.webkit.WebViewCompat;

/* compiled from: D8$$SyntheticClass */
public final /* synthetic */ class MessageHandler$$ExternalSyntheticLambda0 implements WebViewCompat.WebMessageListener {
    public final /* synthetic */ MessageHandler f$0;

    public /* synthetic */ MessageHandler$$ExternalSyntheticLambda0(MessageHandler messageHandler) {
        this.f$0 = messageHandler;
    }

    public final void onPostMessage(WebView webView, WebMessageCompat webMessageCompat, Uri uri, boolean z, JavaScriptReplyProxy javaScriptReplyProxy) {
        this.f$0.m96lambda$new$0$comgetcapacitorMessageHandler(webView, webMessageCompat, uri, z, javaScriptReplyProxy);
    }
}
