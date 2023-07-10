package com.getcapacitor;

import android.content.Context;
import android.content.Intent;
import android.content.res.Configuration;
import android.net.Uri;
import android.os.Bundle;
import androidx.activity.result.ActivityResult;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;
import com.getcapacitor.util.PermissionHelper;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.CopyOnWriteArrayList;
import org.json.JSONException;

public class Plugin {
    private static final String BUNDLE_PERSISTED_OPTIONS_JSON_KEY = "_json";
    private final Map<String, ActivityResultLauncher<Intent>> activityLaunchers = new HashMap();
    /* access modifiers changed from: protected */
    public Bridge bridge;
    private final Map<String, List<PluginCall>> eventListeners = new HashMap();
    protected PluginHandle handle;
    private String lastPluginCallId;
    private final Map<String, ActivityResultLauncher<String[]>> permissionLaunchers = new HashMap();
    private final Map<String, JSObject> retainedEventArguments = new HashMap();
    @Deprecated
    protected PluginCall savedLastCall;

    /* access modifiers changed from: protected */
    @Deprecated
    public void handleOnActivityResult(int i, int i2, Intent intent) {
    }

    /* access modifiers changed from: protected */
    public void handleOnConfigurationChanged(Configuration configuration) {
    }

    /* access modifiers changed from: protected */
    public void handleOnDestroy() {
    }

    /* access modifiers changed from: protected */
    public void handleOnNewIntent(Intent intent) {
    }

    /* access modifiers changed from: protected */
    public void handleOnPause() {
    }

    /* access modifiers changed from: protected */
    public void handleOnRestart() {
    }

    /* access modifiers changed from: protected */
    public void handleOnResume() {
    }

    /* access modifiers changed from: protected */
    public void handleOnStart() {
    }

    /* access modifiers changed from: protected */
    public void handleOnStop() {
    }

    public void load() {
    }

    /* access modifiers changed from: protected */
    public void restoreState(Bundle bundle) {
    }

    public Boolean shouldOverrideLoad(Uri uri) {
        return null;
    }

    /* access modifiers changed from: package-private */
    public void initializeActivityLaunchers() {
        ArrayList<Method> arrayList = new ArrayList<>();
        for (Class cls = getClass(); !cls.getName().equals(Object.class.getName()); cls = cls.getSuperclass()) {
            arrayList.addAll(Arrays.asList(cls.getDeclaredMethods()));
        }
        for (Method method : arrayList) {
            if (method.isAnnotationPresent(ActivityCallback.class)) {
                this.activityLaunchers.put(method.getName(), this.bridge.registerForActivityResult(new ActivityResultContracts.StartActivityForResult(), new Plugin$$ExternalSyntheticLambda0(this, method)));
            } else if (method.isAnnotationPresent(PermissionCallback.class)) {
                this.permissionLaunchers.put(method.getName(), this.bridge.registerForActivityResult(new ActivityResultContracts.RequestMultiplePermissions(), new Plugin$$ExternalSyntheticLambda1(this, method)));
            }
        }
    }

    /* access modifiers changed from: private */
    /* renamed from: triggerPermissionCallback */
    public void m98lambda$initializeActivityLaunchers$1$comgetcapacitorPlugin(Method method, Map<String, Boolean> map) {
        PluginCall permissionCall = this.bridge.getPermissionCall(this.handle.getId());
        if (this.bridge.validatePermissions(this, permissionCall, map)) {
            try {
                method.setAccessible(true);
                method.invoke(this, new Object[]{permissionCall});
            } catch (IllegalAccessException | InvocationTargetException e) {
                e.printStackTrace();
            }
        }
    }

    /* access modifiers changed from: private */
    /* renamed from: triggerActivityCallback */
    public void m97lambda$initializeActivityLaunchers$0$comgetcapacitorPlugin(Method method, ActivityResult activityResult) {
        PluginCall savedCall = this.bridge.getSavedCall(this.lastPluginCallId);
        if (savedCall == null) {
            savedCall = this.bridge.getPluginCallForLastActivity();
        }
        try {
            method.setAccessible(true);
            method.invoke(this, new Object[]{savedCall, activityResult});
        } catch (IllegalAccessException | InvocationTargetException e) {
            e.printStackTrace();
        }
    }

    public void startActivityForResult(PluginCall pluginCall, Intent intent, String str) {
        ActivityResultLauncher<Intent> activityLauncherOrReject = getActivityLauncherOrReject(pluginCall, str);
        if (activityLauncherOrReject != null) {
            this.bridge.setPluginCallForLastActivity(pluginCall);
            this.lastPluginCallId = pluginCall.getCallbackId();
            this.bridge.saveCall(pluginCall);
            activityLauncherOrReject.launch(intent);
        }
    }

    private void permissionActivityResult(PluginCall pluginCall, String[] strArr, String str) {
        ActivityResultLauncher<String[]> permissionLauncherOrReject = getPermissionLauncherOrReject(pluginCall, str);
        if (permissionLauncherOrReject != null) {
            this.bridge.savePermissionCall(pluginCall);
            permissionLauncherOrReject.launch(strArr);
        }
    }

    public Context getContext() {
        return this.bridge.getContext();
    }

    public AppCompatActivity getActivity() {
        return this.bridge.getActivity();
    }

    public void setBridge(Bridge bridge2) {
        this.bridge = bridge2;
    }

    public Bridge getBridge() {
        return this.bridge;
    }

    public void setPluginHandle(PluginHandle pluginHandle) {
        this.handle = pluginHandle;
    }

    public PluginHandle getPluginHandle() {
        return this.handle;
    }

    public String getAppId() {
        return getContext().getPackageName();
    }

    @Deprecated
    public void saveCall(PluginCall pluginCall) {
        this.savedLastCall = pluginCall;
    }

    @Deprecated
    public void freeSavedCall() {
        this.savedLastCall.release(this.bridge);
        this.savedLastCall = null;
    }

    @Deprecated
    public PluginCall getSavedCall() {
        return this.savedLastCall;
    }

    public PluginConfig getConfig() {
        return this.bridge.getConfig().getPluginConfiguration(this.handle.getId());
    }

    @Deprecated
    public Object getConfigValue(String str) {
        try {
            return getConfig().getConfigJSON().get(str);
        } catch (JSONException unused) {
            return null;
        }
    }

    @Deprecated
    public boolean hasDefinedPermissions(String[] strArr) {
        for (String hasDefinedPermission : strArr) {
            if (!PermissionHelper.hasDefinedPermission(getContext(), hasDefinedPermission)) {
                return false;
            }
        }
        return true;
    }

    @Deprecated
    public boolean hasDefinedRequiredPermissions() {
        CapacitorPlugin pluginAnnotation = this.handle.getPluginAnnotation();
        if (pluginAnnotation == null) {
            return hasDefinedPermissions(this.handle.getLegacyPluginAnnotation().permissions());
        }
        for (Permission strings : pluginAnnotation.permissions()) {
            for (String hasDefinedPermission : strings.strings()) {
                if (!PermissionHelper.hasDefinedPermission(getContext(), hasDefinedPermission)) {
                    return false;
                }
            }
        }
        return true;
    }

    public boolean isPermissionDeclared(String str) {
        CapacitorPlugin pluginAnnotation = this.handle.getPluginAnnotation();
        if (pluginAnnotation != null) {
            for (Permission permission : pluginAnnotation.permissions()) {
                if (str.equalsIgnoreCase(permission.alias())) {
                    boolean z = true;
                    for (String hasDefinedPermission : permission.strings()) {
                        z = z && PermissionHelper.hasDefinedPermission(getContext(), hasDefinedPermission);
                    }
                    return z;
                }
            }
        }
        Logger.error(String.format("isPermissionDeclared: No alias defined for %s or missing @CapacitorPlugin annotation.", new Object[]{str}));
        return false;
    }

    @Deprecated
    public boolean hasPermission(String str) {
        return ActivityCompat.checkSelfPermission(getContext(), str) == 0;
    }

    @Deprecated
    public boolean hasRequiredPermissions() {
        CapacitorPlugin pluginAnnotation = this.handle.getPluginAnnotation();
        if (pluginAnnotation == null) {
            for (String checkSelfPermission : this.handle.getLegacyPluginAnnotation().permissions()) {
                if (ActivityCompat.checkSelfPermission(getContext(), checkSelfPermission) != 0) {
                    return false;
                }
            }
            return true;
        }
        for (Permission strings : pluginAnnotation.permissions()) {
            for (String checkSelfPermission2 : strings.strings()) {
                if (ActivityCompat.checkSelfPermission(getContext(), checkSelfPermission2) != 0) {
                    return false;
                }
            }
        }
        return true;
    }

    /* access modifiers changed from: protected */
    public void requestAllPermissions(PluginCall pluginCall, String str) {
        CapacitorPlugin pluginAnnotation = this.handle.getPluginAnnotation();
        if (pluginAnnotation != null) {
            HashSet hashSet = new HashSet();
            for (Permission strings : pluginAnnotation.permissions()) {
                hashSet.addAll(Arrays.asList(strings.strings()));
            }
            permissionActivityResult(pluginCall, (String[]) hashSet.toArray(new String[0]), str);
        }
    }

    /* access modifiers changed from: protected */
    public void requestPermissionForAlias(String str, PluginCall pluginCall, String str2) {
        requestPermissionForAliases(new String[]{str}, pluginCall, str2);
    }

    /* access modifiers changed from: protected */
    public void requestPermissionForAliases(String[] strArr, PluginCall pluginCall, String str) {
        if (strArr.length == 0) {
            Logger.error("No permission alias was provided");
            return;
        }
        String[] permissionStringsForAliases = getPermissionStringsForAliases(strArr);
        if (permissionStringsForAliases.length > 0) {
            permissionActivityResult(pluginCall, permissionStringsForAliases, str);
        }
    }

    private String[] getPermissionStringsForAliases(String[] strArr) {
        CapacitorPlugin pluginAnnotation = this.handle.getPluginAnnotation();
        HashSet hashSet = new HashSet();
        for (Permission permission : pluginAnnotation.permissions()) {
            if (Arrays.asList(strArr).contains(permission.alias())) {
                hashSet.addAll(Arrays.asList(permission.strings()));
            }
        }
        return (String[]) hashSet.toArray(new String[0]);
    }

    private ActivityResultLauncher<Intent> getActivityLauncherOrReject(PluginCall pluginCall, String str) {
        ActivityResultLauncher<Intent> activityResultLauncher = this.activityLaunchers.get(str);
        if (activityResultLauncher != null) {
            return activityResultLauncher;
        }
        String format = String.format(Locale.US, "There is no ActivityCallback method registered for the name: %s. Please define a callback method annotated with @ActivityCallback that receives arguments: (PluginCall, ActivityResult)", new Object[]{str});
        Logger.error(format);
        pluginCall.reject(format);
        return null;
    }

    private ActivityResultLauncher<String[]> getPermissionLauncherOrReject(PluginCall pluginCall, String str) {
        ActivityResultLauncher<String[]> activityResultLauncher = this.permissionLaunchers.get(str);
        if (activityResultLauncher != null) {
            return activityResultLauncher;
        }
        String format = String.format(Locale.US, "There is no PermissionCallback method registered for the name: %s. Please define a callback method annotated with @PermissionCallback that receives arguments: (PluginCall)", new Object[]{str});
        Logger.error(format);
        pluginCall.reject(format);
        return null;
    }

    @Deprecated
    public void pluginRequestAllPermissions() {
        NativePlugin legacyPluginAnnotation = this.handle.getLegacyPluginAnnotation();
        ActivityCompat.requestPermissions(getActivity(), legacyPluginAnnotation.permissions(), legacyPluginAnnotation.permissionRequestCode());
    }

    @Deprecated
    public void pluginRequestPermission(String str, int i) {
        ActivityCompat.requestPermissions(getActivity(), new String[]{str}, i);
    }

    @Deprecated
    public void pluginRequestPermissions(String[] strArr, int i) {
        ActivityCompat.requestPermissions(getActivity(), strArr, i);
    }

    public PermissionState getPermissionState(String str) {
        return getPermissionStates().get(str);
    }

    public Map<String, PermissionState> getPermissionStates() {
        return this.bridge.getPermissionStates(this);
    }

    private void addEventListener(String str, PluginCall pluginCall) {
        List list = this.eventListeners.get(str);
        if (list == null || list.isEmpty()) {
            ArrayList arrayList = new ArrayList();
            this.eventListeners.put(str, arrayList);
            arrayList.add(pluginCall);
            sendRetainedArgumentsForEvent(str);
            return;
        }
        list.add(pluginCall);
    }

    private void removeEventListener(String str, PluginCall pluginCall) {
        List list = this.eventListeners.get(str);
        if (list != null) {
            list.remove(pluginCall);
        }
    }

    /* access modifiers changed from: protected */
    public void notifyListeners(String str, JSObject jSObject, boolean z) {
        String logTag = getLogTag();
        Logger.verbose(logTag, "Notifying listeners for event " + str);
        List list = this.eventListeners.get(str);
        if (list == null || list.isEmpty()) {
            String logTag2 = getLogTag();
            Logger.debug(logTag2, "No listeners found for event " + str);
            if (z) {
                this.retainedEventArguments.put(str, jSObject);
                return;
            }
            return;
        }
        Iterator it = new CopyOnWriteArrayList(list).iterator();
        while (it.hasNext()) {
            ((PluginCall) it.next()).resolve(jSObject);
        }
    }

    /* access modifiers changed from: protected */
    public void notifyListeners(String str, JSObject jSObject) {
        notifyListeners(str, jSObject, false);
    }

    /* access modifiers changed from: protected */
    public boolean hasListeners(String str) {
        List list = this.eventListeners.get(str);
        if (list == null) {
            return false;
        }
        return !list.isEmpty();
    }

    private void sendRetainedArgumentsForEvent(String str) {
        JSObject jSObject = this.retainedEventArguments.get(str);
        if (jSObject != null) {
            notifyListeners(str, jSObject);
            this.retainedEventArguments.remove(str);
        }
    }

    @PluginMethod(returnType = "none")
    public void addListener(PluginCall pluginCall) {
        String string = pluginCall.getString("eventName");
        pluginCall.setKeepAlive(true);
        addEventListener(string, pluginCall);
    }

    @PluginMethod(returnType = "none")
    public void removeListener(PluginCall pluginCall) {
        String string = pluginCall.getString("eventName");
        PluginCall savedCall = this.bridge.getSavedCall(pluginCall.getString("callbackId"));
        if (savedCall != null) {
            removeEventListener(string, savedCall);
            this.bridge.releaseCall(savedCall);
        }
    }

    @PluginMethod(returnType = "promise")
    public void removeAllListeners(PluginCall pluginCall) {
        this.eventListeners.clear();
        pluginCall.resolve();
    }

    @PluginMethod
    @PermissionCallback
    public void checkPermissions(PluginCall pluginCall) {
        Map<String, PermissionState> permissionStates = getPermissionStates();
        if (permissionStates.size() == 0) {
            pluginCall.resolve();
            return;
        }
        JSObject jSObject = new JSObject();
        for (Map.Entry next : permissionStates.entrySet()) {
            jSObject.put((String) next.getKey(), next.getValue());
        }
        pluginCall.resolve(jSObject);
    }

    /* JADX WARNING: type inference failed for: r0v8, types: [java.lang.Object[]] */
    /* JADX WARNING: type inference failed for: r0v12, types: [java.lang.Object[]] */
    /* JADX WARNING: Multi-variable type inference failed */
    @com.getcapacitor.PluginMethod
    /* Code decompiled incorrectly, please refer to instructions dump. */
    public void requestPermissions(com.getcapacitor.PluginCall r11) {
        /*
            r10 = this;
            com.getcapacitor.PluginHandle r0 = r10.handle
            com.getcapacitor.annotation.CapacitorPlugin r0 = r0.getPluginAnnotation()
            if (r0 != 0) goto L_0x000d
            r10.handleLegacyPermission(r11)
            goto L_0x00e4
        L_0x000d:
            java.util.HashSet r1 = new java.util.HashSet
            r1.<init>()
            java.lang.String r2 = "permissions"
            com.getcapacitor.JSArray r2 = r11.getArray(r2)
            r3 = 0
            java.util.List r2 = r2.toList()     // Catch:{ JSONException -> 0x001e }
            goto L_0x001f
        L_0x001e:
            r2 = r3
        L_0x001f:
            java.util.HashSet r4 = new java.util.HashSet
            r4.<init>()
            r5 = 0
            if (r2 == 0) goto L_0x0062
            boolean r6 = r2.isEmpty()
            if (r6 == 0) goto L_0x002e
            goto L_0x0062
        L_0x002e:
            com.getcapacitor.annotation.Permission[] r0 = r0.permissions()
            int r6 = r0.length
            r7 = 0
        L_0x0034:
            if (r7 >= r6) goto L_0x004c
            r8 = r0[r7]
            java.lang.String r9 = r8.alias()
            boolean r9 = r2.contains(r9)
            if (r9 == 0) goto L_0x0049
            java.lang.String r8 = r8.alias()
            r4.add(r8)
        L_0x0049:
            int r7 = r7 + 1
            goto L_0x0034
        L_0x004c:
            boolean r0 = r4.isEmpty()
            if (r0 == 0) goto L_0x0058
            java.lang.String r0 = "No valid permission alias was requested of this plugin."
            r11.reject(r0)
            goto L_0x00ad
        L_0x0058:
            java.lang.String[] r0 = new java.lang.String[r5]
            java.lang.Object[] r0 = r4.toArray(r0)
            r3 = r0
            java.lang.String[] r3 = (java.lang.String[]) r3
            goto L_0x00ad
        L_0x0062:
            com.getcapacitor.annotation.Permission[] r0 = r0.permissions()
            int r2 = r0.length
            r3 = 0
        L_0x0068:
            if (r3 >= r2) goto L_0x00a4
            r6 = r0[r3]
            java.lang.String[] r7 = r6.strings()
            int r7 = r7.length
            if (r7 == 0) goto L_0x0090
            java.lang.String[] r7 = r6.strings()
            int r7 = r7.length
            r8 = 1
            if (r7 != r8) goto L_0x0088
            java.lang.String[] r7 = r6.strings()
            r7 = r7[r5]
            boolean r7 = r7.isEmpty()
            if (r7 == 0) goto L_0x0088
            goto L_0x0090
        L_0x0088:
            java.lang.String r6 = r6.alias()
            r4.add(r6)
            goto L_0x00a1
        L_0x0090:
            java.lang.String r7 = r6.alias()
            boolean r7 = r7.isEmpty()
            if (r7 != 0) goto L_0x00a1
            java.lang.String r6 = r6.alias()
            r1.add(r6)
        L_0x00a1:
            int r3 = r3 + 1
            goto L_0x0068
        L_0x00a4:
            java.lang.String[] r0 = new java.lang.String[r5]
            java.lang.Object[] r0 = r4.toArray(r0)
            r3 = r0
            java.lang.String[] r3 = (java.lang.String[]) r3
        L_0x00ad:
            if (r3 == 0) goto L_0x00b8
            int r0 = r3.length
            if (r0 <= 0) goto L_0x00b8
            java.lang.String r0 = "checkPermissions"
            r10.requestPermissionForAliases(r3, r11, r0)
            goto L_0x00e4
        L_0x00b8:
            boolean r0 = r1.isEmpty()
            if (r0 != 0) goto L_0x00e1
            com.getcapacitor.JSObject r0 = new com.getcapacitor.JSObject
            r0.<init>()
            java.util.Iterator r1 = r1.iterator()
        L_0x00c7:
            boolean r2 = r1.hasNext()
            if (r2 == 0) goto L_0x00dd
            java.lang.Object r2 = r1.next()
            java.lang.String r2 = (java.lang.String) r2
            com.getcapacitor.PermissionState r3 = com.getcapacitor.PermissionState.GRANTED
            java.lang.String r3 = r3.toString()
            r0.put((java.lang.String) r2, (java.lang.String) r3)
            goto L_0x00c7
        L_0x00dd:
            r11.resolve(r0)
            goto L_0x00e4
        L_0x00e1:
            r11.resolve()
        L_0x00e4:
            return
        */
        throw new UnsupportedOperationException("Method not decompiled: com.getcapacitor.Plugin.requestPermissions(com.getcapacitor.PluginCall):void");
    }

    private void handleLegacyPermission(PluginCall pluginCall) {
        NativePlugin legacyPluginAnnotation = this.handle.getLegacyPluginAnnotation();
        String[] permissions = legacyPluginAnnotation.permissions();
        if (permissions.length > 0) {
            saveCall(pluginCall);
            pluginRequestPermissions(permissions, legacyPluginAnnotation.permissionRequestCode());
            return;
        }
        pluginCall.resolve();
    }

    /* access modifiers changed from: protected */
    @Deprecated
    public void handleRequestPermissionsResult(int i, String[] strArr, int[] iArr) {
        if (!hasDefinedPermissions(strArr)) {
            StringBuilder sb = new StringBuilder();
            sb.append("Missing the following permissions in AndroidManifest.xml:\n");
            for (String str : PermissionHelper.getUndefinedPermissions(getContext(), strArr)) {
                sb.append(str + "\n");
            }
            this.savedLastCall.reject(sb.toString());
            this.savedLastCall = null;
        }
    }

    /* access modifiers changed from: protected */
    public Bundle saveInstanceState() {
        PluginCall savedCall = this.bridge.getSavedCall(this.lastPluginCallId);
        if (savedCall == null) {
            return null;
        }
        Bundle bundle = new Bundle();
        JSObject data = savedCall.getData();
        if (data != null) {
            bundle.putString(BUNDLE_PERSISTED_OPTIONS_JSON_KEY, data.toString());
        }
        return bundle;
    }

    /* access modifiers changed from: protected */
    @Deprecated
    public void startActivityForResult(PluginCall pluginCall, Intent intent, int i) {
        this.bridge.startActivityForPluginWithResult(pluginCall, intent, i);
    }

    public void execute(Runnable runnable) {
        this.bridge.execute(runnable);
    }

    /* access modifiers changed from: protected */
    public String getLogTag(String... strArr) {
        return Logger.tags(strArr);
    }

    /* access modifiers changed from: protected */
    public String getLogTag() {
        return Logger.tags(getClass().getSimpleName());
    }
}
