package com.getcapacitor;

import android.webkit.PermissionRequest;
import com.getcapacitor.BridgeWebChromeClient;

/* compiled from: D8$$SyntheticClass */
public final /* synthetic */ class BridgeWebChromeClient$$ExternalSyntheticLambda4 implements BridgeWebChromeClient.PermissionListener {
    public final /* synthetic */ PermissionRequest f$0;

    public /* synthetic */ BridgeWebChromeClient$$ExternalSyntheticLambda4(PermissionRequest permissionRequest) {
        this.f$0 = permissionRequest;
    }

    public final void onPermissionSelect(Boolean bool) {
        BridgeWebChromeClient.lambda$onPermissionRequest$2(this.f$0, bool);
    }
}
