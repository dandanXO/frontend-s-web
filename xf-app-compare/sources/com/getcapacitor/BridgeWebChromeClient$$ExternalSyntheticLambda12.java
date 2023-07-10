package com.getcapacitor;

import android.content.DialogInterface;
import android.webkit.JsResult;

/* compiled from: D8$$SyntheticClass */
public final /* synthetic */ class BridgeWebChromeClient$$ExternalSyntheticLambda12 implements DialogInterface.OnClickListener {
    public final /* synthetic */ JsResult f$0;

    public /* synthetic */ BridgeWebChromeClient$$ExternalSyntheticLambda12(JsResult jsResult) {
        this.f$0 = jsResult;
    }

    public final void onClick(DialogInterface dialogInterface, int i) {
        BridgeWebChromeClient.lambda$onJsConfirm$6(this.f$0, dialogInterface, i);
    }
}
