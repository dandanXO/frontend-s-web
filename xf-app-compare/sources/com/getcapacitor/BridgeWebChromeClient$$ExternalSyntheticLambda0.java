package com.getcapacitor;

import android.content.DialogInterface;
import android.webkit.JsPromptResult;

/* compiled from: D8$$SyntheticClass */
public final /* synthetic */ class BridgeWebChromeClient$$ExternalSyntheticLambda0 implements DialogInterface.OnCancelListener {
    public final /* synthetic */ JsPromptResult f$0;

    public /* synthetic */ BridgeWebChromeClient$$ExternalSyntheticLambda0(JsPromptResult jsPromptResult) {
        this.f$0 = jsPromptResult;
    }

    public final void onCancel(DialogInterface dialogInterface) {
        BridgeWebChromeClient.lambda$onJsPrompt$10(this.f$0, dialogInterface);
    }
}
