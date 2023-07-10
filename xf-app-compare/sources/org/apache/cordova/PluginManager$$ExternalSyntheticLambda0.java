package org.apache.cordova;

import java.util.function.BiConsumer;

/* compiled from: D8$$SyntheticClass */
public final /* synthetic */ class PluginManager$$ExternalSyntheticLambda0 implements BiConsumer {
    public final /* synthetic */ String f$0;
    public final /* synthetic */ Object f$1;

    public /* synthetic */ PluginManager$$ExternalSyntheticLambda0(String str, Object obj) {
        this.f$0 = str;
        this.f$1 = obj;
    }

    public final void accept(Object obj, Object obj2) {
        PluginManager.lambda$postMessage$0(this.f$0, this.f$1, (String) obj, (CordovaPlugin) obj2);
    }
}
