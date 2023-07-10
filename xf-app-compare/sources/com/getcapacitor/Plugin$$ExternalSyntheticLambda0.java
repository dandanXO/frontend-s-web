package com.getcapacitor;

import androidx.activity.result.ActivityResult;
import androidx.activity.result.ActivityResultCallback;
import java.lang.reflect.Method;

/* compiled from: D8$$SyntheticClass */
public final /* synthetic */ class Plugin$$ExternalSyntheticLambda0 implements ActivityResultCallback {
    public final /* synthetic */ Plugin f$0;
    public final /* synthetic */ Method f$1;

    public /* synthetic */ Plugin$$ExternalSyntheticLambda0(Plugin plugin, Method method) {
        this.f$0 = plugin;
        this.f$1 = method;
    }

    public final void onActivityResult(Object obj) {
        this.f$0.m97lambda$initializeActivityLaunchers$0$comgetcapacitorPlugin(this.f$1, (ActivityResult) obj);
    }
}
