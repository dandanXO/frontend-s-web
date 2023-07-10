package com.capacitorjs.plugins.preferences;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.util.ArrayList;
import java.util.Collection;
import org.json.JSONException;

@CapacitorPlugin(name = "Preferences")
public class PreferencesPlugin extends Plugin {
    private Preferences preferences;

    public void load() {
        this.preferences = new Preferences(getContext(), PreferencesConfiguration.DEFAULTS);
    }

    @PluginMethod
    public void configure(PluginCall pluginCall) {
        try {
            PreferencesConfiguration clone = PreferencesConfiguration.DEFAULTS.clone();
            clone.group = pluginCall.getString("group", PreferencesConfiguration.DEFAULTS.group);
            this.preferences = new Preferences(getContext(), clone);
            pluginCall.resolve();
        } catch (CloneNotSupportedException e) {
            pluginCall.reject("Error while configuring", (Exception) e);
        }
    }

    @PluginMethod
    public void get(PluginCall pluginCall) {
        String string = pluginCall.getString("key");
        if (string == null) {
            pluginCall.reject("Must provide key");
            return;
        }
        Object obj = this.preferences.get(string);
        JSObject jSObject = new JSObject();
        if (obj == null) {
            obj = JSObject.NULL;
        }
        jSObject.put("value", obj);
        pluginCall.resolve(jSObject);
    }

    @PluginMethod
    public void set(PluginCall pluginCall) {
        String string = pluginCall.getString("key");
        if (string == null) {
            pluginCall.reject("Must provide key");
            return;
        }
        this.preferences.set(string, pluginCall.getString("value"));
        pluginCall.resolve();
    }

    @PluginMethod
    public void remove(PluginCall pluginCall) {
        String string = pluginCall.getString("key");
        if (string == null) {
            pluginCall.reject("Must provide key");
            return;
        }
        this.preferences.remove(string);
        pluginCall.resolve();
    }

    @PluginMethod
    public void keys(PluginCall pluginCall) {
        String[] strArr = (String[]) this.preferences.keys().toArray(new String[0]);
        JSObject jSObject = new JSObject();
        try {
            jSObject.put("keys", (Object) new JSArray((Object) strArr));
            pluginCall.resolve(jSObject);
        } catch (JSONException e) {
            pluginCall.reject("Unable to serialize response.", (Exception) e);
        }
    }

    @PluginMethod
    public void clear(PluginCall pluginCall) {
        this.preferences.clear();
        pluginCall.resolve();
    }

    @PluginMethod
    public void migrate(PluginCall pluginCall) {
        ArrayList arrayList = new ArrayList();
        ArrayList arrayList2 = new ArrayList();
        Preferences preferences2 = new Preferences(getContext(), PreferencesConfiguration.DEFAULTS);
        for (String next : preferences2.keys()) {
            String str = preferences2.get(next);
            if (this.preferences.get(next) == null) {
                this.preferences.set(next, str);
                arrayList.add(next);
            } else {
                arrayList2.add(next);
            }
        }
        JSObject jSObject = new JSObject();
        jSObject.put("migrated", (Object) new JSArray((Collection) arrayList));
        jSObject.put("existing", (Object) new JSArray((Collection) arrayList2));
        pluginCall.resolve(jSObject);
    }

    @PluginMethod
    public void removeOld(PluginCall pluginCall) {
        pluginCall.resolve();
    }
}
