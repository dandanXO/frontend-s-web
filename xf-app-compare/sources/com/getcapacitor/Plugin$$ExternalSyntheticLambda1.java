package com.getcapacitor;

import androidx.activity.result.ActivityResultCallback;
import java.lang.reflect.Method;
import java.util.Map;

/* compiled from: D8$$SyntheticClass */
public final /* synthetic */ class Plugin$$ExternalSyntheticLambda1 implements ActivityResultCallback {
    public final /* synthetic */ Plugin f$0;
    public final /* synthetic */ Method f$1;

    public /* synthetic */ Plugin$$ExternalSyntheticLambda1(Plugin plugin, Method method) {
        this.f$0 = plugin;
        this.f$1 = method;
    }

    public final void onActivityResult(Object obj) {
        this.f$0.m98lambda$initializeActivityLaunchers$1$comgetcapacitorPlugin(this.f$1, (Map) obj);
    }
}
