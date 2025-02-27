package com.ind.appb9mega1;

import android.app.Application;

import com.cloudwise.agent.app.CWSDK;

public class MyApplication extends Application {
    @Override
    public void onCreate() {
        CWSDK.withAppKey("wS0n2SF8WRCb0fAkjFLvksRizrsrej3Y4XuCglHI0M9oZME**mvyF3eC**5bskBqMp", "https://apm-int.cloudwise.com")
                .enableLogging(true) //打开logcat日志开关
                .start(getApplicationContext());
        super.onCreate();
    }
}
