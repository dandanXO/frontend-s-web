package com.ind.appbr1;

import android.app.Application;

import com.cloudwise.agent.app.CWSDK;

public class MyApplication extends Application {
    @Override
    public void onCreate() {
        CWSDK.withAppKey("wS0n2SF8WRCb0fAkjFLvksRizrsrej3Y0FOM8Sp6P01DanA1l**6SYq82La6Npb6K", "https://apm-int.cloudwise.com")
                .enableLogging(true) //打开logcat日志开关
                .start(getApplicationContext());
        super.onCreate();
    }
}
