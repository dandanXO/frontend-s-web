package com.ind.appb9bgd;

import android.app.Application;

import com.cloudwise.agent.app.CWSDK;

public class MyApplication extends Application {
    @Override
    public void onCreate() {
        CWSDK.withAppKey("wS0n2SF8WRCb0fAkjFLvksRizrsrej3Yngz6**ZXXZDQyCd7Ro1G1qeicr17zKAn6", "https://apm-int.cloudwise.com")
                .enableLogging(true) //打开logcat日志开关
                .start(getApplicationContext());
        super.onCreate();
    }
}
