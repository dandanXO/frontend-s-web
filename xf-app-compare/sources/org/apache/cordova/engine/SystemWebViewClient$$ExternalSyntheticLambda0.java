package org.apache.cordova.engine;

import android.webkit.WebResourceResponse;
import androidx.webkit.WebViewAssetLoader;

/* compiled from: D8$$SyntheticClass */
public final /* synthetic */ class SystemWebViewClient$$ExternalSyntheticLambda0 implements WebViewAssetLoader.PathHandler {
    public final /* synthetic */ SystemWebViewClient f$0;
    public final /* synthetic */ SystemWebViewEngine f$1;

    public /* synthetic */ SystemWebViewClient$$ExternalSyntheticLambda0(SystemWebViewClient systemWebViewClient, SystemWebViewEngine systemWebViewEngine) {
        this.f$0 = systemWebViewClient;
        this.f$1 = systemWebViewEngine;
    }

    public final WebResourceResponse handle(String str) {
        return this.f$0.m1530lambda$new$0$orgapachecordovaengineSystemWebViewClient(this.f$1, str);
    }
}
