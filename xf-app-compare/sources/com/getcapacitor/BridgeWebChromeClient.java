package com.getcapacitor;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.ActivityNotFoundException;
import android.content.DialogInterface;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.view.View;
import android.webkit.ConsoleMessage;
import android.webkit.GeolocationPermissions;
import android.webkit.JsPromptResult;
import android.webkit.JsResult;
import android.webkit.MimeTypeMap;
import android.webkit.PermissionRequest;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.widget.EditText;
import androidx.activity.result.ActivityResult;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.FileProvider;
import com.getcapacitor.util.PermissionHelper;
import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Map;

public class BridgeWebChromeClient extends WebChromeClient {
    private ActivityResultLauncher activityLauncher;
    private ActivityResultListener activityListener;
    private Bridge bridge;
    private ActivityResultLauncher permissionLauncher;
    private PermissionListener permissionListener;

    private interface ActivityResultListener {
        void onActivityResult(ActivityResult activityResult);
    }

    private interface PermissionListener {
        void onPermissionSelect(Boolean bool);
    }

    public BridgeWebChromeClient(Bridge bridge2) {
        this.bridge = bridge2;
        this.permissionLauncher = bridge2.registerForActivityResult(new ActivityResultContracts.RequestMultiplePermissions(), new BridgeWebChromeClient$$ExternalSyntheticLambda15(this));
        this.activityLauncher = bridge2.registerForActivityResult(new ActivityResultContracts.StartActivityForResult(), new BridgeWebChromeClient$$ExternalSyntheticLambda14(this));
    }

    /* access modifiers changed from: package-private */
    /* renamed from: lambda$new$0$com-getcapacitor-BridgeWebChromeClient  reason: not valid java name */
    public /* synthetic */ void m72lambda$new$0$comgetcapacitorBridgeWebChromeClient(Map map) {
        if (this.permissionListener != null) {
            boolean z = true;
            for (Map.Entry value : map.entrySet()) {
                if (!((Boolean) value.getValue()).booleanValue()) {
                    z = false;
                }
            }
            this.permissionListener.onPermissionSelect(Boolean.valueOf(z));
        }
    }

    /* access modifiers changed from: package-private */
    /* renamed from: lambda$new$1$com-getcapacitor-BridgeWebChromeClient  reason: not valid java name */
    public /* synthetic */ void m73lambda$new$1$comgetcapacitorBridgeWebChromeClient(ActivityResult activityResult) {
        ActivityResultListener activityResultListener = this.activityListener;
        if (activityResultListener != null) {
            activityResultListener.onActivityResult(activityResult);
        }
    }

    public void onShowCustomView(View view, WebChromeClient.CustomViewCallback customViewCallback) {
        customViewCallback.onCustomViewHidden();
        super.onShowCustomView(view, customViewCallback);
    }

    public void onHideCustomView() {
        super.onHideCustomView();
    }

    public void onPermissionRequest(PermissionRequest permissionRequest) {
        boolean z = Build.VERSION.SDK_INT >= 23;
        ArrayList arrayList = new ArrayList();
        if (Arrays.asList(permissionRequest.getResources()).contains("android.webkit.resource.VIDEO_CAPTURE")) {
            arrayList.add("android.permission.CAMERA");
        }
        if (Arrays.asList(permissionRequest.getResources()).contains("android.webkit.resource.AUDIO_CAPTURE")) {
            arrayList.add("android.permission.MODIFY_AUDIO_SETTINGS");
            arrayList.add("android.permission.RECORD_AUDIO");
        }
        if (arrayList.isEmpty() || !z) {
            permissionRequest.grant(permissionRequest.getResources());
            return;
        }
        this.permissionListener = new BridgeWebChromeClient$$ExternalSyntheticLambda4(permissionRequest);
        this.permissionLauncher.launch((String[]) arrayList.toArray(new String[0]));
    }

    static /* synthetic */ void lambda$onPermissionRequest$2(PermissionRequest permissionRequest, Boolean bool) {
        if (bool.booleanValue()) {
            permissionRequest.grant(permissionRequest.getResources());
        } else {
            permissionRequest.deny();
        }
    }

    public boolean onJsAlert(WebView webView, String str, String str2, JsResult jsResult) {
        if (this.bridge.getActivity().isFinishing()) {
            return true;
        }
        AlertDialog.Builder builder = new AlertDialog.Builder(webView.getContext());
        builder.setMessage(str2).setPositiveButton("OK", new BridgeWebChromeClient$$ExternalSyntheticLambda10(jsResult)).setOnCancelListener(new BridgeWebChromeClient$$ExternalSyntheticLambda7(jsResult));
        builder.create().show();
        return true;
    }

    static /* synthetic */ void lambda$onJsAlert$3(JsResult jsResult, DialogInterface dialogInterface, int i) {
        dialogInterface.dismiss();
        jsResult.confirm();
    }

    static /* synthetic */ void lambda$onJsAlert$4(JsResult jsResult, DialogInterface dialogInterface) {
        dialogInterface.dismiss();
        jsResult.cancel();
    }

    public boolean onJsConfirm(WebView webView, String str, String str2, JsResult jsResult) {
        if (this.bridge.getActivity().isFinishing()) {
            return true;
        }
        AlertDialog.Builder builder = new AlertDialog.Builder(webView.getContext());
        builder.setMessage(str2).setPositiveButton("OK", new BridgeWebChromeClient$$ExternalSyntheticLambda11(jsResult)).setNegativeButton("Cancel", new BridgeWebChromeClient$$ExternalSyntheticLambda12(jsResult)).setOnCancelListener(new BridgeWebChromeClient$$ExternalSyntheticLambda8(jsResult));
        builder.create().show();
        return true;
    }

    static /* synthetic */ void lambda$onJsConfirm$5(JsResult jsResult, DialogInterface dialogInterface, int i) {
        dialogInterface.dismiss();
        jsResult.confirm();
    }

    static /* synthetic */ void lambda$onJsConfirm$6(JsResult jsResult, DialogInterface dialogInterface, int i) {
        dialogInterface.dismiss();
        jsResult.cancel();
    }

    static /* synthetic */ void lambda$onJsConfirm$7(JsResult jsResult, DialogInterface dialogInterface) {
        dialogInterface.dismiss();
        jsResult.cancel();
    }

    public boolean onJsPrompt(WebView webView, String str, String str2, String str3, JsPromptResult jsPromptResult) {
        if (this.bridge.getActivity().isFinishing()) {
            return true;
        }
        AlertDialog.Builder builder = new AlertDialog.Builder(webView.getContext());
        EditText editText = new EditText(webView.getContext());
        builder.setMessage(str2).setView(editText).setPositiveButton("OK", new BridgeWebChromeClient$$ExternalSyntheticLambda13(editText, jsPromptResult)).setNegativeButton("Cancel", new BridgeWebChromeClient$$ExternalSyntheticLambda9(jsPromptResult)).setOnCancelListener(new BridgeWebChromeClient$$ExternalSyntheticLambda0(jsPromptResult));
        builder.create().show();
        return true;
    }

    static /* synthetic */ void lambda$onJsPrompt$8(EditText editText, JsPromptResult jsPromptResult, DialogInterface dialogInterface, int i) {
        dialogInterface.dismiss();
        jsPromptResult.confirm(editText.getText().toString().trim());
    }

    static /* synthetic */ void lambda$onJsPrompt$9(JsPromptResult jsPromptResult, DialogInterface dialogInterface, int i) {
        dialogInterface.dismiss();
        jsPromptResult.cancel();
    }

    static /* synthetic */ void lambda$onJsPrompt$10(JsPromptResult jsPromptResult, DialogInterface dialogInterface) {
        dialogInterface.dismiss();
        jsPromptResult.cancel();
    }

    public void onGeolocationPermissionsShowPrompt(String str, GeolocationPermissions.Callback callback) {
        super.onGeolocationPermissionsShowPrompt(str, callback);
        Logger.debug("onGeolocationPermissionsShowPrompt: DOING IT HERE FOR ORIGIN: " + str);
        String[] strArr = {"android.permission.ACCESS_COARSE_LOCATION", "android.permission.ACCESS_FINE_LOCATION"};
        if (!PermissionHelper.hasPermissions(this.bridge.getContext(), strArr)) {
            this.permissionListener = new BridgeWebChromeClient$$ExternalSyntheticLambda5(this, callback, str);
            this.permissionLauncher.launch(strArr);
            return;
        }
        callback.invoke(str, true, false);
        Logger.debug("onGeolocationPermissionsShowPrompt: has required permission");
    }

    /* access modifiers changed from: package-private */
    /* renamed from: lambda$onGeolocationPermissionsShowPrompt$11$com-getcapacitor-BridgeWebChromeClient  reason: not valid java name */
    public /* synthetic */ void m74lambda$onGeolocationPermissionsShowPrompt$11$comgetcapacitorBridgeWebChromeClient(GeolocationPermissions.Callback callback, String str, Boolean bool) {
        if (bool.booleanValue()) {
            callback.invoke(str, true, false);
            return;
        }
        String[] strArr = {"android.permission.ACCESS_COARSE_LOCATION"};
        if (Build.VERSION.SDK_INT < 31 || !PermissionHelper.hasPermissions(this.bridge.getContext(), strArr)) {
            callback.invoke(str, false, false);
        } else {
            callback.invoke(str, true, false);
        }
    }

    public boolean onShowFileChooser(WebView webView, ValueCallback<Uri[]> valueCallback, WebChromeClient.FileChooserParams fileChooserParams) {
        List asList = Arrays.asList(fileChooserParams.getAcceptTypes());
        boolean isCaptureEnabled = fileChooserParams.isCaptureEnabled();
        boolean z = false;
        boolean z2 = isCaptureEnabled && asList.contains("image/*");
        if (isCaptureEnabled && asList.contains("video/*")) {
            z = true;
        }
        if (!z2 && !z) {
            showFilePicker(valueCallback, fileChooserParams);
        } else if (isMediaCaptureSupported()) {
            showMediaCaptureOrFilePicker(valueCallback, fileChooserParams, z);
        } else {
            this.permissionListener = new BridgeWebChromeClient$$ExternalSyntheticLambda6(this, valueCallback, fileChooserParams, z);
            this.permissionLauncher.launch(new String[]{"android.permission.CAMERA"});
        }
        return true;
    }

    /* access modifiers changed from: package-private */
    /* renamed from: lambda$onShowFileChooser$12$com-getcapacitor-BridgeWebChromeClient  reason: not valid java name */
    public /* synthetic */ void m75lambda$onShowFileChooser$12$comgetcapacitorBridgeWebChromeClient(ValueCallback valueCallback, WebChromeClient.FileChooserParams fileChooserParams, boolean z, Boolean bool) {
        if (bool.booleanValue()) {
            showMediaCaptureOrFilePicker(valueCallback, fileChooserParams, z);
            return;
        }
        Logger.warn(Logger.tags("FileChooser"), "Camera permission not granted");
        valueCallback.onReceiveValue((Object) null);
    }

    private boolean isMediaCaptureSupported() {
        return PermissionHelper.hasPermissions(this.bridge.getContext(), new String[]{"android.permission.CAMERA"}) || !PermissionHelper.hasDefinedPermission(this.bridge.getContext(), "android.permission.CAMERA");
    }

    private void showMediaCaptureOrFilePicker(ValueCallback<Uri[]> valueCallback, WebChromeClient.FileChooserParams fileChooserParams, boolean z) {
        boolean z2;
        boolean z3 = Build.VERSION.SDK_INT >= 24;
        if (!z || !z3) {
            z2 = showImageCapturePicker(valueCallback);
        } else {
            z2 = showVideoCapturePicker(valueCallback);
        }
        if (!z2) {
            Logger.warn(Logger.tags("FileChooser"), "Media capture intent could not be launched. Falling back to default file picker.");
            showFilePicker(valueCallback, fileChooserParams);
        }
    }

    private boolean showImageCapturePicker(ValueCallback<Uri[]> valueCallback) {
        Intent intent = new Intent("android.media.action.IMAGE_CAPTURE");
        if (intent.resolveActivity(this.bridge.getActivity().getPackageManager()) == null) {
            return false;
        }
        try {
            Uri createImageFileUri = createImageFileUri();
            intent.putExtra("output", createImageFileUri);
            this.activityListener = new BridgeWebChromeClient$$ExternalSyntheticLambda1(createImageFileUri, valueCallback);
            this.activityLauncher.launch(intent);
            return true;
        } catch (Exception e) {
            Logger.error("Unable to create temporary media capture file: " + e.getMessage());
            return false;
        }
    }

    static /* synthetic */ void lambda$showImageCapturePicker$13(Uri uri, ValueCallback valueCallback, ActivityResult activityResult) {
        valueCallback.onReceiveValue(activityResult.getResultCode() == -1 ? new Uri[]{uri} : null);
    }

    private boolean showVideoCapturePicker(ValueCallback<Uri[]> valueCallback) {
        Intent intent = new Intent("android.media.action.VIDEO_CAPTURE");
        if (intent.resolveActivity(this.bridge.getActivity().getPackageManager()) == null) {
            return false;
        }
        this.activityListener = new BridgeWebChromeClient$$ExternalSyntheticLambda3(valueCallback);
        this.activityLauncher.launch(intent);
        return true;
    }

    static /* synthetic */ void lambda$showVideoCapturePicker$14(ValueCallback valueCallback, ActivityResult activityResult) {
        valueCallback.onReceiveValue(activityResult.getResultCode() == -1 ? new Uri[]{activityResult.getData().getData()} : null);
    }

    private void showFilePicker(ValueCallback<Uri[]> valueCallback, WebChromeClient.FileChooserParams fileChooserParams) {
        Intent createIntent = fileChooserParams.createIntent();
        if (fileChooserParams.getMode() == 1) {
            createIntent.putExtra("android.intent.extra.ALLOW_MULTIPLE", true);
        }
        if (fileChooserParams.getAcceptTypes().length > 1 || createIntent.getType().startsWith(".")) {
            String[] validTypes = getValidTypes(fileChooserParams.getAcceptTypes());
            createIntent.putExtra("android.intent.extra.MIME_TYPES", validTypes);
            if (createIntent.getType().startsWith(".")) {
                createIntent.setType(validTypes[0]);
            }
        }
        try {
            this.activityListener = new BridgeWebChromeClient$$ExternalSyntheticLambda2(valueCallback);
            this.activityLauncher.launch(createIntent);
        } catch (ActivityNotFoundException unused) {
            valueCallback.onReceiveValue((Object) null);
        }
    }

    static /* synthetic */ void lambda$showFilePicker$15(ValueCallback valueCallback, ActivityResult activityResult) {
        Uri[] uriArr;
        Intent data = activityResult.getData();
        if (activityResult.getResultCode() != -1 || data.getClipData() == null || data.getClipData().getItemCount() <= 1) {
            uriArr = WebChromeClient.FileChooserParams.parseResult(activityResult.getResultCode(), data);
        } else {
            int itemCount = data.getClipData().getItemCount();
            uriArr = new Uri[itemCount];
            for (int i = 0; i < itemCount; i++) {
                uriArr[i] = data.getClipData().getItemAt(i).getUri();
            }
        }
        valueCallback.onReceiveValue(uriArr);
    }

    private String[] getValidTypes(String[] strArr) {
        ArrayList arrayList = new ArrayList();
        MimeTypeMap singleton = MimeTypeMap.getSingleton();
        for (String str : strArr) {
            if (str.startsWith(".")) {
                String mimeTypeFromExtension = singleton.getMimeTypeFromExtension(str.substring(1));
                if (mimeTypeFromExtension != null && !arrayList.contains(mimeTypeFromExtension)) {
                    arrayList.add(mimeTypeFromExtension);
                }
            } else if (!arrayList.contains(str)) {
                arrayList.add(str);
            }
        }
        Object[] array = arrayList.toArray();
        return (String[]) Arrays.copyOf(array, array.length, String[].class);
    }

    public boolean onConsoleMessage(ConsoleMessage consoleMessage) {
        String tags = Logger.tags("Console");
        if (consoleMessage.message() != null && isValidMsg(consoleMessage.message())) {
            String format = String.format("File: %s - Line %d - Msg: %s", new Object[]{consoleMessage.sourceId(), Integer.valueOf(consoleMessage.lineNumber()), consoleMessage.message()});
            String name = consoleMessage.messageLevel().name();
            if ("ERROR".equalsIgnoreCase(name)) {
                Logger.error(tags, format, (Throwable) null);
            } else if ("WARNING".equalsIgnoreCase(name)) {
                Logger.warn(tags, format);
            } else if ("TIP".equalsIgnoreCase(name)) {
                Logger.debug(tags, format);
            } else {
                Logger.info(tags, format);
            }
        }
        return true;
    }

    public boolean isValidMsg(String str) {
        return !str.contains("%cresult %c") && !str.contains("%cnative %c") && !str.equalsIgnoreCase("[object Object]") && !str.equalsIgnoreCase("console.groupEnd");
    }

    private Uri createImageFileUri() throws IOException {
        AppCompatActivity activity = this.bridge.getActivity();
        File createImageFile = createImageFile(activity);
        return FileProvider.getUriForFile(activity, this.bridge.getContext().getPackageName() + ".fileprovider", createImageFile);
    }

    private File createImageFile(Activity activity) throws IOException {
        String format = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());
        return File.createTempFile("JPEG_" + format + "_", ".jpg", activity.getExternalFilesDir(Environment.DIRECTORY_PICTURES));
    }
}
