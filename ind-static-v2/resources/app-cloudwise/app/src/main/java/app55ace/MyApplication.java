package com.ind.appindwin7;

import android.app.Application;

import com.cloudwise.agent.app.CWSDK;

public class MyApplication extends Application {
    @Override
    public void onCreate() {
        CWSDK.withAppKey("wS0n2SF8WRCb0fAkjFLvksRizrsrej3Y0IvAwUH4o9t5kzvIslkyrWuCslA3sd7L", "https://apm-int.cloudwise.com")
                .enableLogging(true) //打开logcat日志开关
                .start(getApplicationContext());
        super.onCreate();
    }
}
