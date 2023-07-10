package com.getcapacitor;

import android.content.DialogInterface;
import android.webkit.JsResult;

/* compiled from: D8$$SyntheticClass */
public final /* synthetic */ class BridgeWebChromeClient$$ExternalSyntheticLambda7 implements DialogInterface.OnCancelListener {
    public final /* synthetic */ JsResult f$0;

    public /* synthetic */ BridgeWebChromeClient$$ExternalSyntheticLambda7(JsResult jsResult) {
        this.f$0 = jsResult;
    }

    public final void onCancel(DialogInterface dialogInterface) {
        BridgeWebChromeClient.lambda$onJsAlert$4(this.f$0, dialogInterface);
    }
}
