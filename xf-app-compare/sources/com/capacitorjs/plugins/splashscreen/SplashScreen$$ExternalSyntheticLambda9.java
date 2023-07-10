package com.capacitorjs.plugins.splashscreen;

import android.animation.Animator;
import androidx.appcompat.app.AppCompatActivity;

/* compiled from: D8$$SyntheticClass */
public final /* synthetic */ class SplashScreen$$ExternalSyntheticLambda9 implements Runnable {
    public final /* synthetic */ SplashScreen f$0;
    public final /* synthetic */ AppCompatActivity f$1;
    public final /* synthetic */ SplashScreenSettings f$2;
    public final /* synthetic */ Animator.AnimatorListener f$3;

    public /* synthetic */ SplashScreen$$ExternalSyntheticLambda9(SplashScreen splashScreen, AppCompatActivity appCompatActivity, SplashScreenSettings splashScreenSettings, Animator.AnimatorListener animatorListener) {
        this.f$0 = splashScreen;
        this.f$1 = appCompatActivity;
        this.f$2 = splashScreenSettings;
        this.f$3 = animatorListener;
    }

    public final void run() {
        this.f$0.m58lambda$show$8$comcapacitorjspluginssplashscreenSplashScreen(this.f$1, this.f$2, this.f$3);
    }
}
