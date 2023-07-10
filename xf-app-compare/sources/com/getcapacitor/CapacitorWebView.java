package com.getcapacitor;

import android.content.Context;
import android.util.AttributeSet;
import android.view.KeyEvent;
import android.view.inputmethod.BaseInputConnection;
import android.view.inputmethod.EditorInfo;
import android.view.inputmethod.InputConnection;
import android.webkit.ValueCallback;
import android.webkit.WebView;

public class CapacitorWebView extends WebView {
    private Bridge bridge;
    private BaseInputConnection capInputConnection;

    public CapacitorWebView(Context context, AttributeSet attributeSet) {
        super(context, attributeSet);
    }

    public void setBridge(Bridge bridge2) {
        this.bridge = bridge2;
    }

    public InputConnection onCreateInputConnection(EditorInfo editorInfo) {
        CapConfig capConfig;
        Bridge bridge2 = this.bridge;
        if (bridge2 != null) {
            capConfig = bridge2.getConfig();
        } else {
            capConfig = CapConfig.loadDefault(getContext());
        }
        if (!capConfig.isInputCaptured()) {
            return super.onCreateInputConnection(editorInfo);
        }
        if (this.capInputConnection == null) {
            this.capInputConnection = new BaseInputConnection(this, false);
        }
        return this.capInputConnection;
    }

    public boolean dispatchKeyEvent(KeyEvent keyEvent) {
        if (keyEvent.getAction() != 2) {
            return super.dispatchKeyEvent(keyEvent);
        }
        evaluateJavascript("document.activeElement.value = document.activeElement.value + '" + keyEvent.getCharacters() + "';", (ValueCallback) null);
        return false;
    }
}
