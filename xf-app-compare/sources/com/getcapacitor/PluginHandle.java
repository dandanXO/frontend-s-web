package com.getcapacitor;

import com.getcapacitor.annotation.CapacitorPlugin;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

public class PluginHandle {
    private final Bridge bridge;
    private Plugin instance;
    private NativePlugin legacyPluginAnnotation;
    private CapacitorPlugin pluginAnnotation;
    private final Class<? extends Plugin> pluginClass;
    private final String pluginId;
    private final Map<String, PluginMethodHandle> pluginMethods;

    private PluginHandle(Class<? extends Plugin> cls, Bridge bridge2) throws InvalidPluginException {
        this.pluginMethods = new HashMap();
        this.bridge = bridge2;
        this.pluginClass = cls;
        CapacitorPlugin capacitorPlugin = (CapacitorPlugin) cls.getAnnotation(CapacitorPlugin.class);
        if (capacitorPlugin == null) {
            NativePlugin nativePlugin = (NativePlugin) cls.getAnnotation(NativePlugin.class);
            if (nativePlugin != null) {
                if (!nativePlugin.name().equals("")) {
                    this.pluginId = nativePlugin.name();
                } else {
                    this.pluginId = cls.getSimpleName();
                }
                this.legacyPluginAnnotation = nativePlugin;
            } else {
                throw new InvalidPluginException("No @CapacitorPlugin annotation found for plugin " + cls.getName());
            }
        } else {
            if (!capacitorPlugin.name().equals("")) {
                this.pluginId = capacitorPlugin.name();
            } else {
                this.pluginId = cls.getSimpleName();
            }
            this.pluginAnnotation = capacitorPlugin;
        }
        indexMethods(cls);
    }

    public PluginHandle(Bridge bridge2, Class<? extends Plugin> cls) throws InvalidPluginException, PluginLoadException {
        this(cls, bridge2);
        load();
    }

    public PluginHandle(Bridge bridge2, Plugin plugin) throws InvalidPluginException {
        this((Class<? extends Plugin>) plugin.getClass(), bridge2);
        loadInstance(plugin);
    }

    public Class<? extends Plugin> getPluginClass() {
        return this.pluginClass;
    }

    public String getId() {
        return this.pluginId;
    }

    public NativePlugin getLegacyPluginAnnotation() {
        return this.legacyPluginAnnotation;
    }

    public CapacitorPlugin getPluginAnnotation() {
        return this.pluginAnnotation;
    }

    public Plugin getInstance() {
        return this.instance;
    }

    public Collection<PluginMethodHandle> getMethods() {
        return this.pluginMethods.values();
    }

    public Plugin load() throws PluginLoadException {
        Plugin plugin = this.instance;
        if (plugin != null) {
            return plugin;
        }
        try {
            Plugin plugin2 = (Plugin) this.pluginClass.newInstance();
            this.instance = plugin2;
            return loadInstance(plugin2);
        } catch (IllegalAccessException | InstantiationException unused) {
            throw new PluginLoadException("Unable to load plugin instance. Ensure plugin is publicly accessible");
        }
    }

    public Plugin loadInstance(Plugin plugin) {
        this.instance = plugin;
        plugin.setPluginHandle(this);
        this.instance.setBridge(this.bridge);
        this.instance.load();
        this.instance.initializeActivityLaunchers();
        return this.instance;
    }

    public void invoke(String str, PluginCall pluginCall) throws PluginLoadException, InvalidPluginMethodException, InvocationTargetException, IllegalAccessException {
        if (this.instance == null) {
            load();
        }
        PluginMethodHandle pluginMethodHandle = this.pluginMethods.get(str);
        if (pluginMethodHandle != null) {
            pluginMethodHandle.getMethod().invoke(this.instance, new Object[]{pluginCall});
            return;
        }
        throw new InvalidPluginMethodException("No method " + str + " found for plugin " + this.pluginClass.getName());
    }

    private void indexMethods(Class<? extends Plugin> cls) {
        for (Method method : this.pluginClass.getMethods()) {
            PluginMethod pluginMethod = (PluginMethod) method.getAnnotation(PluginMethod.class);
            if (pluginMethod != null) {
                this.pluginMethods.put(method.getName(), new PluginMethodHandle(method, pluginMethod));
            }
        }
    }
}
