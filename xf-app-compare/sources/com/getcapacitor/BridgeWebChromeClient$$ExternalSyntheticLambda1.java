package com.getcapacitor;

import android.net.Uri;
import android.webkit.ValueCallback;
import androidx.activity.result.ActivityResult;
import com.getcapacitor.BridgeWebChromeClient;

/* compiled from: D8$$SyntheticClass */
public final /* synthetic */ class BridgeWebChromeClient$$ExternalSyntheticLambda1 implements BridgeWebChromeClient.ActivityResultListener {
    public final /* synthetic */ Uri f$0;
    public final /* synthetic */ ValueCallback f$1;

    public /* synthetic */ BridgeWebChromeClient$$ExternalSyntheticLambda1(Uri uri, ValueCallback valueCallback) {
        this.f$0 = uri;
        this.f$1 = valueCallback;
    }

    public final void onActivityResult(ActivityResult activityResult) {
        BridgeWebChromeClient.lambda$showImageCapturePicker$13(this.f$0, this.f$1, activityResult);
    }
}
