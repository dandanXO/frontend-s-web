package com.getcapacitor;

import android.content.res.AssetManager;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import org.json.JSONArray;
import org.json.JSONException;

public class PluginManager {
    private final AssetManager assetManager;

    public PluginManager(AssetManager assetManager2) {
        this.assetManager = assetManager2;
    }

    public List<Class<? extends Plugin>> loadPluginClasses() throws PluginLoadException {
        JSONArray parsePluginsJSON = parsePluginsJSON();
        ArrayList arrayList = new ArrayList();
        try {
            int length = parsePluginsJSON.length();
            for (int i = 0; i < length; i++) {
                arrayList.add(Class.forName(parsePluginsJSON.getJSONObject(i).getString("classpath")).asSubclass(Plugin.class));
            }
            return arrayList;
        } catch (JSONException unused) {
            throw new PluginLoadException("Could not parse capacitor.plugins.json as JSON");
        } catch (ClassNotFoundException e) {
            throw new PluginLoadException("Could not find class by class path: " + e.getMessage());
        }
    }

    private JSONArray parsePluginsJSON() throws PluginLoadException {
        BufferedReader bufferedReader;
        try {
            bufferedReader = new BufferedReader(new InputStreamReader(this.assetManager.open("capacitor.plugins.json")));
            StringBuilder sb = new StringBuilder();
            while (true) {
                String readLine = bufferedReader.readLine();
                if (readLine != null) {
                    sb.append(readLine);
                } else {
                    JSONArray jSONArray = new JSONArray(sb.toString());
                    bufferedReader.close();
                    return jSONArray;
                }
            }
        } catch (IOException unused) {
            throw new PluginLoadException("Could not load capacitor.plugins.json");
        } catch (JSONException unused2) {
            throw new PluginLoadException("Could not parse capacitor.plugins.json as JSON");
        } catch (Throwable th) {
            th.addSuppressed(th);
        }
        throw th;
    }
}
