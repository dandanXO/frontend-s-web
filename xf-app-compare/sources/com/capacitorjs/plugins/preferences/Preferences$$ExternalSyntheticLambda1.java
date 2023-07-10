package com.capacitorjs.plugins.preferences;

import android.content.SharedPreferences;
import com.capacitorjs.plugins.preferences.Preferences;

/* compiled from: D8$$SyntheticClass */
public final /* synthetic */ class Preferences$$ExternalSyntheticLambda1 implements Preferences.PreferencesOperation {
    public final /* synthetic */ String f$0;
    public final /* synthetic */ String f$1;

    public /* synthetic */ Preferences$$ExternalSyntheticLambda1(String str, String str2) {
        this.f$0 = str;
        this.f$1 = str2;
    }

    public final void execute(SharedPreferences.Editor editor) {
        editor.putString(this.f$0, this.f$1);
    }
}
