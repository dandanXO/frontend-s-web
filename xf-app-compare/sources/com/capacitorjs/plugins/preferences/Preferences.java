package com.capacitorjs.plugins.preferences;

import android.content.Context;
import android.content.SharedPreferences;
import java.util.Set;

public class Preferences {
    private SharedPreferences preferences;

    private interface PreferencesOperation {
        void execute(SharedPreferences.Editor editor);
    }

    Preferences(Context context, PreferencesConfiguration preferencesConfiguration) {
        this.preferences = context.getSharedPreferences(preferencesConfiguration.group, 0);
    }

    public String get(String str) {
        return this.preferences.getString(str, (String) null);
    }

    public void set(String str, String str2) {
        executeOperation(new Preferences$$ExternalSyntheticLambda1(str, str2));
    }

    public void remove(String str) {
        executeOperation(new Preferences$$ExternalSyntheticLambda0(str));
    }

    public Set<String> keys() {
        return this.preferences.getAll().keySet();
    }

    public void clear() {
        executeOperation(Preferences$$ExternalSyntheticLambda2.INSTANCE);
    }

    private void executeOperation(PreferencesOperation preferencesOperation) {
        SharedPreferences.Editor edit = this.preferences.edit();
        preferencesOperation.execute(edit);
        edit.apply();
    }
}
