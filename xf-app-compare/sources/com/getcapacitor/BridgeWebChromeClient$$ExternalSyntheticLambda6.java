package com.getcapacitor;

import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import com.getcapacitor.BridgeWebChromeClient;

/* compiled from: D8$$SyntheticClass */
public final /* synthetic */ class BridgeWebChromeClient$$ExternalSyntheticLambda6 implements BridgeWebChromeClient.PermissionListener {
    public final /* synthetic */ BridgeWebChromeClient f$0;
    public final /* synthetic */ ValueCallback f$1;
    public final /* synthetic */ WebChromeClient.FileChooserParams f$2;
    public final /* synthetic */ boolean f$3;

    public /* synthetic */ BridgeWebChromeClient$$ExternalSyntheticLambda6(BridgeWebChromeClient bridgeWebChromeClient, ValueCallback valueCallback, WebChromeClient.FileChooserParams fileChooserParams, boolean z) {
        this.f$0 = bridgeWebChromeClient;
        this.f$1 = valueCallback;
        this.f$2 = fileChooserParams;
        this.f$3 = z;
    }

    public final void onPermissionSelect(Boolean bool) {
        this.f$0.m75lambda$onShowFileChooser$12$comgetcapacitorBridgeWebChromeClient(this.f$1, this.f$2, this.f$3, bool);
    }
}
