package com.ind.apppk3;

import android.app.Application;

import com.cloudwise.agent.app.CWSDK;

public class MyApplication extends Application {
    @Override
    public void onCreate() {
        CWSDK.withAppKey("wS0n2SF8WRCb0fAkjFLvksRizrsrej3Y9n**06KQsv5F2HvD5zOUJku4TDHc**JDZZ", "https://apm-int.cloudwise.com")
                .enableLogging(true) //打开logcat日志开关
                .start(getApplicationContext());
        super.onCreate();
    }
}
