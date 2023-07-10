package com.capacitorjs.plugins.clipboard;

import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import androidx.webkit.internal.AssetHelper;
import com.getcapacitor.Logger;

public class Clipboard {
    private static final String TAG = "Clipboard";
    private ClipboardManager clipboard;
    private Context context;

    public Clipboard(Context context2) {
        this.context = context2;
        this.clipboard = (ClipboardManager) context2.getSystemService("clipboard");
    }

    public ClipboardWriteResponse write(String str, String str2) {
        ClipboardManager clipboardManager;
        ClipData newPlainText = ClipData.newPlainText(str, str2);
        if (newPlainText != null && (clipboardManager = this.clipboard) != null) {
            try {
                clipboardManager.setPrimaryClip(newPlainText);
                return new ClipboardWriteResponse(true);
            } catch (Exception e) {
                Logger.error(TAG, e);
                return new ClipboardWriteResponse(false, "Writing to the clipboard failed");
            }
        } else if (this.clipboard == null) {
            return new ClipboardWriteResponse(false, "Problem getting a reference to the system clipboard");
        } else {
            return new ClipboardWriteResponse(false, "Problem formatting data");
        }
    }

    public ClipboardData read() {
        ClipboardManager clipboardManager = this.clipboard;
        CharSequence charSequence = null;
        if (clipboardManager == null) {
            return null;
        }
        boolean hasPrimaryClip = clipboardManager.hasPrimaryClip();
        String str = AssetHelper.DEFAULT_MIME_TYPE;
        if (hasPrimaryClip) {
            if (this.clipboard.getPrimaryClipDescription().hasMimeType(str)) {
                Logger.debug(TAG, "Got plaintxt");
                charSequence = this.clipboard.getPrimaryClip().getItemAt(0).getText();
            } else {
                Logger.debug(TAG, "Not plaintext!");
                charSequence = this.clipboard.getPrimaryClip().getItemAt(0).coerceToText(this.context).toString();
            }
        }
        ClipboardData clipboardData = new ClipboardData();
        if (charSequence != null) {
            clipboardData.setValue(charSequence.toString());
        }
        if (charSequence != null && charSequence.toString().startsWith("data:")) {
            str = charSequence.toString().split(";")[0].split(":")[1];
        }
        clipboardData.setType(str);
        return clipboardData;
    }
}
