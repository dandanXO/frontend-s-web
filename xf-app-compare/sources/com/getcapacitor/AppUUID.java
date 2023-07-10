package com.getcapacitor;

import android.content.SharedPreferences;
import androidx.appcompat.app.AppCompatActivity;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.UUID;
import kotlin.UByte;

public final class AppUUID {
    private static final String KEY = "CapacitorAppUUID";

    public static String getAppUUID(AppCompatActivity appCompatActivity) throws Exception {
        assertAppUUID(appCompatActivity);
        return readUUID(appCompatActivity);
    }

    public static void regenerateAppUUID(AppCompatActivity appCompatActivity) throws Exception {
        try {
            writeUUID(appCompatActivity, generateUUID());
        } catch (NoSuchAlgorithmException unused) {
            throw new Exception("Capacitor App UUID could not be generated.");
        }
    }

    private static void assertAppUUID(AppCompatActivity appCompatActivity) throws Exception {
        if (readUUID(appCompatActivity).equals("")) {
            regenerateAppUUID(appCompatActivity);
        }
    }

    private static String generateUUID() throws NoSuchAlgorithmException {
        MessageDigest instance = MessageDigest.getInstance("SHA-256");
        instance.update(UUID.randomUUID().toString().getBytes(StandardCharsets.UTF_8));
        return bytesToHex(instance.digest());
    }

    private static String readUUID(AppCompatActivity appCompatActivity) {
        return appCompatActivity.getPreferences(0).getString(KEY, "");
    }

    private static void writeUUID(AppCompatActivity appCompatActivity, String str) {
        SharedPreferences.Editor edit = appCompatActivity.getPreferences(0).edit();
        edit.putString(KEY, str);
        edit.apply();
    }

    private static String bytesToHex(byte[] bArr) {
        byte[] bytes = "0123456789ABCDEF".getBytes(StandardCharsets.US_ASCII);
        byte[] bArr2 = new byte[(bArr.length * 2)];
        for (int i = 0; i < bArr.length; i++) {
            byte b = bArr[i] & UByte.MAX_VALUE;
            int i2 = i * 2;
            bArr2[i2] = bytes[b >>> 4];
            bArr2[i2 + 1] = bytes[b & 15];
        }
        return new String(bArr2, StandardCharsets.UTF_8);
    }
}
