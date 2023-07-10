package com.capacitorjs.plugins.clipboard;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "Clipboard")
public class ClipboardPlugin extends Plugin {
    private Clipboard implementation;

    public void load() {
        this.implementation = new Clipboard(getContext());
    }

    @PluginMethod
    public void write(PluginCall pluginCall) {
        ClipboardWriteResponse clipboardWriteResponse;
        String string = pluginCall.getString("string");
        String string2 = pluginCall.getString("image");
        String string3 = pluginCall.getString("url");
        String string4 = pluginCall.getString("label");
        if (string != null) {
            clipboardWriteResponse = this.implementation.write(string4, string);
        } else if (string2 != null) {
            clipboardWriteResponse = this.implementation.write(string4, string2);
        } else if (string3 != null) {
            clipboardWriteResponse = this.implementation.write(string4, string3);
        } else {
            pluginCall.reject("No data provided");
            return;
        }
        if (clipboardWriteResponse.isSuccess()) {
            pluginCall.resolve();
        } else {
            pluginCall.reject(clipboardWriteResponse.getErrorMessage());
        }
    }

    @PluginMethod
    public void read(PluginCall pluginCall) {
        ClipboardData read = this.implementation.read();
        if (read == null) {
            pluginCall.reject("Unable to read clipboard from the given Context");
        } else if (read.getValue() == null) {
            pluginCall.reject("There is no data on the clipboard");
        } else {
            JSObject jSObject = new JSObject();
            jSObject.put("value", read.getValue());
            jSObject.put("type", read.getType());
            pluginCall.resolve(jSObject);
        }
    }
}
