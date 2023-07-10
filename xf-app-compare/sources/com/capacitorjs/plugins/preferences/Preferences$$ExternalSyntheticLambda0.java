package com.capacitorjs.plugins.preferences;

import android.content.SharedPreferences;
import com.capacitorjs.plugins.preferences.Preferences;

/* compiled from: D8$$SyntheticClass */
public final /* synthetic */ class Preferences$$ExternalSyntheticLambda0 implements Preferences.PreferencesOperation {
    public final /* synthetic */ String f$0;

    public /* synthetic */ Preferences$$ExternalSyntheticLambda0(String str) {
        this.f$0 = str;
    }

    public final void execute(SharedPreferences.Editor editor) {
        editor.remove(this.f$0);
    }
}
