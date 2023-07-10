package com.getcapacitor;

import android.webkit.ValueCallback;
import androidx.activity.result.ActivityResult;
import com.getcapacitor.BridgeWebChromeClient;

/* compiled from: D8$$SyntheticClass */
public final /* synthetic */ class BridgeWebChromeClient$$ExternalSyntheticLambda3 implements BridgeWebChromeClient.ActivityResultListener {
    public final /* synthetic */ ValueCallback f$0;

    public /* synthetic */ BridgeWebChromeClient$$ExternalSyntheticLambda3(ValueCallback valueCallback) {
        this.f$0 = valueCallback;
    }

    public final void onActivityResult(ActivityResult activityResult) {
        BridgeWebChromeClient.lambda$showVideoCapturePicker$14(this.f$0, activityResult);
    }
}
