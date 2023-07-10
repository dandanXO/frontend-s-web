package com.getcapacitor;

import android.content.DialogInterface;
import android.webkit.JsPromptResult;

/* compiled from: D8$$SyntheticClass */
public final /* synthetic */ class BridgeWebChromeClient$$ExternalSyntheticLambda9 implements DialogInterface.OnClickListener {
    public final /* synthetic */ JsPromptResult f$0;

    public /* synthetic */ BridgeWebChromeClient$$ExternalSyntheticLambda9(JsPromptResult jsPromptResult) {
        this.f$0 = jsPromptResult;
    }

    public final void onClick(DialogInterface dialogInterface, int i) {
        BridgeWebChromeClient.lambda$onJsPrompt$9(this.f$0, dialogInterface, i);
    }
}
