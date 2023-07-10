package com.getcapacitor;

import android.webkit.GeolocationPermissions;
import com.getcapacitor.BridgeWebChromeClient;

/* compiled from: D8$$SyntheticClass */
public final /* synthetic */ class BridgeWebChromeClient$$ExternalSyntheticLambda5 implements BridgeWebChromeClient.PermissionListener {
    public final /* synthetic */ BridgeWebChromeClient f$0;
    public final /* synthetic */ GeolocationPermissions.Callback f$1;
    public final /* synthetic */ String f$2;

    public /* synthetic */ BridgeWebChromeClient$$ExternalSyntheticLambda5(BridgeWebChromeClient bridgeWebChromeClient, GeolocationPermissions.Callback callback, String str) {
        this.f$0 = bridgeWebChromeClient;
        this.f$1 = callback;
        this.f$2 = str;
    }

    public final void onPermissionSelect(Boolean bool) {
        this.f$0.m74lambda$onGeolocationPermissionsShowPrompt$11$comgetcapacitorBridgeWebChromeClient(this.f$1, this.f$2, bool);
    }
}
