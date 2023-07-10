package com.capacitorjs.plugins.splashscreen;

import com.capacitorjs.plugins.splashscreen.SplashScreen;

/* compiled from: D8$$SyntheticClass */
public final /* synthetic */ class SplashScreen$3$$ExternalSyntheticLambda0 implements Runnable {
    public final /* synthetic */ SplashScreen.AnonymousClass3 f$0;
    public final /* synthetic */ SplashScreenSettings f$1;
    public final /* synthetic */ boolean f$2;
    public final /* synthetic */ SplashListener f$3;

    public /* synthetic */ SplashScreen$3$$ExternalSyntheticLambda0(SplashScreen.AnonymousClass3 r1, SplashScreenSettings splashScreenSettings, boolean z, SplashListener splashListener) {
        this.f$0 = r1;
        this.f$1 = splashScreenSettings;
        this.f$2 = z;
        this.f$3 = splashListener;
    }

    public final void run() {
        this.f$0.m66lambda$onAnimationEnd$0$comcapacitorjspluginssplashscreenSplashScreen$3(this.f$1, this.f$2, this.f$3);
    }
}
