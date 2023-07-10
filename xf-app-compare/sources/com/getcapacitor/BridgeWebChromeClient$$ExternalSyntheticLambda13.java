package com.getcapacitor;

import android.content.DialogInterface;
import android.webkit.JsPromptResult;
import android.widget.EditText;

/* compiled from: D8$$SyntheticClass */
public final /* synthetic */ class BridgeWebChromeClient$$ExternalSyntheticLambda13 implements DialogInterface.OnClickListener {
    public final /* synthetic */ EditText f$0;
    public final /* synthetic */ JsPromptResult f$1;

    public /* synthetic */ BridgeWebChromeClient$$ExternalSyntheticLambda13(EditText editText, JsPromptResult jsPromptResult) {
        this.f$0 = editText;
        this.f$1 = jsPromptResult;
    }

    public final void onClick(DialogInterface dialogInterface, int i) {
        BridgeWebChromeClient.lambda$onJsPrompt$8(this.f$0, this.f$1, dialogInterface, i);
    }
}
