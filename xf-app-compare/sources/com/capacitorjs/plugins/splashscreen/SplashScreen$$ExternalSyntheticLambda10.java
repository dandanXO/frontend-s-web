package com.capacitorjs.plugins.splashscreen;

import androidx.appcompat.app.AppCompatActivity;

/* compiled from: D8$$SyntheticClass */
public final /* synthetic */ class SplashScreen$$ExternalSyntheticLambda10 implements Runnable {
    public final /* synthetic */ SplashScreen f$0;
    public final /* synthetic */ AppCompatActivity f$1;
    public final /* synthetic */ SplashScreenSettings f$2;
    public final /* synthetic */ boolean f$3;
    public final /* synthetic */ SplashListener f$4;

    public /* synthetic */ SplashScreen$$ExternalSyntheticLambda10(SplashScreen splashScreen, AppCompatActivity appCompatActivity, SplashScreenSettings splashScreenSettings, boolean z, SplashListener splashListener) {
        this.f$0 = splashScreen;
        this.f$1 = appCompatActivity;
        this.f$2 = splashScreenSettings;
        this.f$3 = z;
        this.f$4 = splashListener;
    }

    public final void run() {
        this.f$0.m60lambda$showDialog$5$comcapacitorjspluginssplashscreenSplashScreen(this.f$1, this.f$2, this.f$3, this.f$4);
    }
}
