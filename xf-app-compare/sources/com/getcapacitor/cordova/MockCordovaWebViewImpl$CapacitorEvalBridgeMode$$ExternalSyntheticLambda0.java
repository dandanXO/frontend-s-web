package com.getcapacitor.cordova;

import com.getcapacitor.cordova.MockCordovaWebViewImpl;
import org.apache.cordova.NativeToJsMessageQueue;

/* compiled from: D8$$SyntheticClass */
public final /* synthetic */ class MockCordovaWebViewImpl$CapacitorEvalBridgeMode$$ExternalSyntheticLambda0 implements Runnable {
    public final /* synthetic */ MockCordovaWebViewImpl.CapacitorEvalBridgeMode f$0;
    public final /* synthetic */ NativeToJsMessageQueue f$1;

    public /* synthetic */ MockCordovaWebViewImpl$CapacitorEvalBridgeMode$$ExternalSyntheticLambda0(MockCordovaWebViewImpl.CapacitorEvalBridgeMode capacitorEvalBridgeMode, NativeToJsMessageQueue nativeToJsMessageQueue) {
        this.f$0 = capacitorEvalBridgeMode;
        this.f$1 = nativeToJsMessageQueue;
    }

    public final void run() {
        this.f$0.m105lambda$onNativeToJsMessageAvailable$0$comgetcapacitorcordovaMockCordovaWebViewImpl$CapacitorEvalBridgeMode(this.f$1);
    }
}
