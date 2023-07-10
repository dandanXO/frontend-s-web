package com.capacitorjs.plugins.preferences;

public class PreferencesConfiguration implements Cloneable {
    static final PreferencesConfiguration DEFAULTS;
    String group;

    static {
        PreferencesConfiguration preferencesConfiguration = new PreferencesConfiguration();
        DEFAULTS = preferencesConfiguration;
        preferencesConfiguration.group = "CapacitorStorage";
    }

    public PreferencesConfiguration clone() throws CloneNotSupportedException {
        return (PreferencesConfiguration) super.clone();
    }
}
