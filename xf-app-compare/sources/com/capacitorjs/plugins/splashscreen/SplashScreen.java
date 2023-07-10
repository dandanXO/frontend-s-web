package com.capacitorjs.plugins.splashscreen;

import android.animation.Animator;
import android.animation.AnimatorListenerAdapter;
import android.animation.ObjectAnimator;
import android.app.Activity;
import android.app.Dialog;
import android.content.Context;
import android.content.res.ColorStateList;
import android.content.res.Resources;
import android.graphics.Paint;
import android.graphics.drawable.Animatable;
import android.graphics.drawable.Drawable;
import android.graphics.drawable.LayerDrawable;
import android.os.Build;
import android.os.Handler;
import android.util.AttributeSet;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewTreeObserver;
import android.view.WindowInsetsController;
import android.view.WindowManager;
import android.view.animation.LinearInterpolator;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.splashscreen.SplashScreenViewProvider;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import com.getcapacitor.Logger;

public class SplashScreen {
    private SplashScreenConfig config;
    /* access modifiers changed from: private */
    public View content;
    /* access modifiers changed from: private */
    public Context context;
    private Dialog dialog;
    /* access modifiers changed from: private */
    public boolean isHiding = false;
    /* access modifiers changed from: private */
    public boolean isVisible = false;
    /* access modifiers changed from: private */
    public ViewTreeObserver.OnPreDrawListener onPreDrawListener;
    private ProgressBar spinnerBar;
    private View splashImage;
    private WindowManager windowManager;

    SplashScreen(Context context2, SplashScreenConfig splashScreenConfig) {
        this.context = context2;
        this.config = splashScreenConfig;
    }

    public void showOnLaunch(AppCompatActivity appCompatActivity) {
        if (this.config.getLaunchShowDuration().intValue() != 0) {
            SplashScreenSettings splashScreenSettings = new SplashScreenSettings();
            splashScreenSettings.setShowDuration(this.config.getLaunchShowDuration());
            splashScreenSettings.setAutoHide(this.config.isLaunchAutoHide());
            try {
                showWithAndroid12API(appCompatActivity, splashScreenSettings);
            } catch (Exception unused) {
                Logger.warn("Android 12 Splash API failed... using previous method.");
                this.onPreDrawListener = null;
                splashScreenSettings.setFadeInDuration(this.config.getLaunchFadeInDuration());
                if (this.config.isUsingDialog()) {
                    showDialog(appCompatActivity, splashScreenSettings, (SplashListener) null, true);
                } else {
                    show(appCompatActivity, splashScreenSettings, (SplashListener) null, true);
                }
            }
        }
    }

    private void showWithAndroid12API(AppCompatActivity appCompatActivity, SplashScreenSettings splashScreenSettings) {
        if (appCompatActivity != null && !appCompatActivity.isFinishing()) {
            appCompatActivity.runOnUiThread(new SplashScreen$$ExternalSyntheticLambda8(this, appCompatActivity, splashScreenSettings));
        }
    }

    /* access modifiers changed from: package-private */
    /* renamed from: lambda$showWithAndroid12API$3$com-capacitorjs-plugins-splashscreen-SplashScreen  reason: not valid java name */
    public /* synthetic */ void m64lambda$showWithAndroid12API$3$comcapacitorjspluginssplashscreenSplashScreen(AppCompatActivity appCompatActivity, final SplashScreenSettings splashScreenSettings) {
        androidx.core.splashscreen.SplashScreen installSplashScreen = androidx.core.splashscreen.SplashScreen.installSplashScreen(appCompatActivity);
        installSplashScreen.setKeepOnScreenCondition(new SplashScreen$$ExternalSyntheticLambda0(this));
        if (this.config.getLaunchFadeOutDuration().intValue() > 0) {
            installSplashScreen.setOnExitAnimationListener(new SplashScreen$$ExternalSyntheticLambda2(this));
        } else {
            installSplashScreen.setOnExitAnimationListener(new SplashScreen$$ExternalSyntheticLambda3(this));
        }
        this.content = appCompatActivity.findViewById(16908290);
        this.onPreDrawListener = new ViewTreeObserver.OnPreDrawListener() {
            public boolean onPreDraw() {
                if (SplashScreen.this.isVisible || SplashScreen.this.isHiding) {
                    return false;
                }
                SplashScreen.this.isVisible = true;
                new Handler(SplashScreen.this.context.getMainLooper()).postDelayed(new SplashScreen$2$$ExternalSyntheticLambda0(this, splashScreenSettings), (long) splashScreenSettings.getShowDuration().intValue());
                return false;
            }

            /* access modifiers changed from: package-private */
            /* renamed from: lambda$onPreDraw$0$com-capacitorjs-plugins-splashscreen-SplashScreen$2  reason: not valid java name */
            public /* synthetic */ void m65lambda$onPreDraw$0$comcapacitorjspluginssplashscreenSplashScreen$2(SplashScreenSettings splashScreenSettings) {
                if (splashScreenSettings.isAutoHide()) {
                    SplashScreen.this.isVisible = false;
                    SplashScreen.this.onPreDrawListener = null;
                    SplashScreen.this.content.getViewTreeObserver().removeOnPreDrawListener(this);
                }
            }
        };
        this.content.getViewTreeObserver().addOnPreDrawListener(this.onPreDrawListener);
    }

    /* access modifiers changed from: package-private */
    /* renamed from: lambda$showWithAndroid12API$0$com-capacitorjs-plugins-splashscreen-SplashScreen  reason: not valid java name */
    public /* synthetic */ boolean m61lambda$showWithAndroid12API$0$comcapacitorjspluginssplashscreenSplashScreen() {
        return this.isVisible || this.isHiding;
    }

    /* access modifiers changed from: package-private */
    /* renamed from: lambda$showWithAndroid12API$1$com-capacitorjs-plugins-splashscreen-SplashScreen  reason: not valid java name */
    public /* synthetic */ void m62lambda$showWithAndroid12API$1$comcapacitorjspluginssplashscreenSplashScreen(final SplashScreenViewProvider splashScreenViewProvider) {
        ObjectAnimator ofFloat = ObjectAnimator.ofFloat(splashScreenViewProvider.getView(), View.ALPHA, new float[]{1.0f, 0.0f});
        ofFloat.setInterpolator(new LinearInterpolator());
        ofFloat.setDuration((long) this.config.getLaunchFadeOutDuration().intValue());
        ofFloat.addListener(new AnimatorListenerAdapter() {
            public void onAnimationEnd(Animator animator) {
                SplashScreen.this.isHiding = false;
                splashScreenViewProvider.remove();
            }
        });
        ofFloat.start();
        this.isHiding = true;
        this.isVisible = false;
    }

    /* access modifiers changed from: package-private */
    /* renamed from: lambda$showWithAndroid12API$2$com-capacitorjs-plugins-splashscreen-SplashScreen  reason: not valid java name */
    public /* synthetic */ void m63lambda$showWithAndroid12API$2$comcapacitorjspluginssplashscreenSplashScreen(SplashScreenViewProvider splashScreenViewProvider) {
        this.isHiding = false;
        this.isVisible = false;
        splashScreenViewProvider.remove();
    }

    public void show(AppCompatActivity appCompatActivity, SplashScreenSettings splashScreenSettings, SplashListener splashListener) {
        if (this.config.isUsingDialog()) {
            showDialog(appCompatActivity, splashScreenSettings, splashListener, false);
        } else {
            show(appCompatActivity, splashScreenSettings, splashListener, false);
        }
    }

    private void showDialog(AppCompatActivity appCompatActivity, SplashScreenSettings splashScreenSettings, SplashListener splashListener, boolean z) {
        if (appCompatActivity != null && !appCompatActivity.isFinishing()) {
            if (this.isVisible) {
                splashListener.completed();
            } else {
                appCompatActivity.runOnUiThread(new SplashScreen$$ExternalSyntheticLambda10(this, appCompatActivity, splashScreenSettings, z, splashListener));
            }
        }
    }

    /* access modifiers changed from: package-private */
    /* renamed from: lambda$showDialog$5$com-capacitorjs-plugins-splashscreen-SplashScreen  reason: not valid java name */
    public /* synthetic */ void m60lambda$showDialog$5$comcapacitorjspluginssplashscreenSplashScreen(AppCompatActivity appCompatActivity, SplashScreenSettings splashScreenSettings, boolean z, SplashListener splashListener) {
        int i;
        if (this.config.isImmersive()) {
            this.dialog = new Dialog(appCompatActivity, R.style.capacitor_immersive_style);
        } else if (this.config.isFullScreen()) {
            this.dialog = new Dialog(appCompatActivity, R.style.capacitor_full_screen_style);
        } else {
            this.dialog = new Dialog(appCompatActivity, R.style.capacitor_default_style);
        }
        if (this.config.getLayoutName() != null) {
            i = this.context.getResources().getIdentifier(this.config.getLayoutName(), "layout", this.context.getPackageName());
            if (i == 0) {
                Logger.warn("Layout not found, using default");
            }
        } else {
            i = 0;
        }
        if (i != 0) {
            this.dialog.setContentView(i);
        } else {
            Drawable splashDrawable = getSplashDrawable();
            LinearLayout linearLayout = new LinearLayout(this.context);
            linearLayout.setLayoutParams(new LinearLayout.LayoutParams(-1, -2));
            linearLayout.setOrientation(1);
            if (splashDrawable != null) {
                linearLayout.setBackground(splashDrawable);
            }
            this.dialog.setContentView(linearLayout);
        }
        this.dialog.setCancelable(false);
        if (!this.dialog.isShowing()) {
            this.dialog.show();
        }
        this.isVisible = true;
        if (splashScreenSettings.isAutoHide()) {
            new Handler(this.context.getMainLooper()).postDelayed(new SplashScreen$$ExternalSyntheticLambda1(this, appCompatActivity, z, splashListener), (long) splashScreenSettings.getShowDuration().intValue());
        } else if (splashListener != null) {
            splashListener.completed();
        }
    }

    /* access modifiers changed from: package-private */
    /* renamed from: lambda$showDialog$4$com-capacitorjs-plugins-splashscreen-SplashScreen  reason: not valid java name */
    public /* synthetic */ void m59lambda$showDialog$4$comcapacitorjspluginssplashscreenSplashScreen(AppCompatActivity appCompatActivity, boolean z, SplashListener splashListener) {
        hideDialog(appCompatActivity, z);
        if (splashListener != null) {
            splashListener.completed();
        }
    }

    public void hide(SplashScreenSettings splashScreenSettings) {
        hide(splashScreenSettings.getFadeOutDuration().intValue(), false);
    }

    public void hideDialog(AppCompatActivity appCompatActivity) {
        hideDialog(appCompatActivity, false);
    }

    public void onPause() {
        tearDown(true);
    }

    public void onDestroy() {
        tearDown(true);
    }

    private void buildViews() {
        int i;
        if (this.splashImage == null) {
            if (this.config.getLayoutName() != null) {
                i = this.context.getResources().getIdentifier(this.config.getLayoutName(), "layout", this.context.getPackageName());
                if (i == 0) {
                    Logger.warn("Layout not found, defaulting to ImageView");
                }
            } else {
                i = 0;
            }
            if (i != 0) {
                LayoutInflater layoutInflater = ((Activity) this.context).getLayoutInflater();
                FrameLayout frameLayout = new FrameLayout(this.context);
                frameLayout.setLayoutParams(new FrameLayout.LayoutParams(-1, -1));
                this.splashImage = layoutInflater.inflate(i, frameLayout, false);
            } else {
                Drawable splashDrawable = getSplashDrawable();
                if (splashDrawable != null) {
                    if (splashDrawable instanceof Animatable) {
                        ((Animatable) splashDrawable).start();
                    }
                    if (splashDrawable instanceof LayerDrawable) {
                        LayerDrawable layerDrawable = (LayerDrawable) splashDrawable;
                        for (int i2 = 0; i2 < layerDrawable.getNumberOfLayers(); i2++) {
                            Drawable drawable = layerDrawable.getDrawable(i2);
                            if (drawable instanceof Animatable) {
                                ((Animatable) drawable).start();
                            }
                        }
                    }
                    ImageView imageView = new ImageView(this.context);
                    this.splashImage = imageView;
                    ImageView imageView2 = imageView;
                    if (Build.VERSION.SDK_INT >= 28) {
                        imageView.setLayerType(1, (Paint) null);
                    } else {
                        legacyStopFlickers(imageView);
                    }
                    imageView.setScaleType(this.config.getScaleType());
                    imageView.setImageDrawable(splashDrawable);
                }
            }
            this.splashImage.setFitsSystemWindows(true);
            if (this.config.getBackgroundColor() != null) {
                this.splashImage.setBackgroundColor(this.config.getBackgroundColor().intValue());
            }
        }
        if (this.spinnerBar == null) {
            if (this.config.getSpinnerStyle() != null) {
                this.spinnerBar = new ProgressBar(this.context, (AttributeSet) null, this.config.getSpinnerStyle().intValue());
            } else {
                this.spinnerBar = new ProgressBar(this.context);
            }
            this.spinnerBar.setIndeterminate(true);
            Integer spinnerColor = this.config.getSpinnerColor();
            if (spinnerColor != null) {
                this.spinnerBar.setIndeterminateTintList(new ColorStateList(new int[][]{new int[]{16842910}, new int[]{-16842910}, new int[]{-16842912}, new int[]{16842919}}, new int[]{spinnerColor.intValue(), spinnerColor.intValue(), spinnerColor.intValue(), spinnerColor.intValue()}));
            }
        }
    }

    private void legacyStopFlickers(ImageView imageView) {
        imageView.setDrawingCacheEnabled(true);
    }

    private Drawable getSplashDrawable() {
        try {
            return this.context.getResources().getDrawable(this.context.getResources().getIdentifier(this.config.getResourceName(), "drawable", this.context.getPackageName()), this.context.getTheme());
        } catch (Resources.NotFoundException unused) {
            Logger.warn("No splash screen found, not displaying");
            return null;
        }
    }

    private void show(AppCompatActivity appCompatActivity, final SplashScreenSettings splashScreenSettings, final SplashListener splashListener, final boolean z) {
        this.windowManager = (WindowManager) appCompatActivity.getSystemService("window");
        if (!appCompatActivity.isFinishing()) {
            buildViews();
            if (this.isVisible) {
                splashListener.completed();
                return;
            }
            new Handler(this.context.getMainLooper()).post(new SplashScreen$$ExternalSyntheticLambda9(this, appCompatActivity, splashScreenSettings, new Animator.AnimatorListener() {
                public void onAnimationCancel(Animator animator) {
                }

                public void onAnimationRepeat(Animator animator) {
                }

                public void onAnimationStart(Animator animator) {
                }

                public void onAnimationEnd(Animator animator) {
                    SplashScreen.this.isVisible = true;
                    if (splashScreenSettings.isAutoHide()) {
                        new Handler(SplashScreen.this.context.getMainLooper()).postDelayed(new SplashScreen$3$$ExternalSyntheticLambda0(this, splashScreenSettings, z, splashListener), (long) splashScreenSettings.getShowDuration().intValue());
                        return;
                    }
                    SplashListener splashListener = splashListener;
                    if (splashListener != null) {
                        splashListener.completed();
                    }
                }

                /* access modifiers changed from: package-private */
                /* renamed from: lambda$onAnimationEnd$0$com-capacitorjs-plugins-splashscreen-SplashScreen$3  reason: not valid java name */
                public /* synthetic */ void m66lambda$onAnimationEnd$0$comcapacitorjspluginssplashscreenSplashScreen$3(SplashScreenSettings splashScreenSettings, boolean z, SplashListener splashListener) {
                    SplashScreen.this.hide(splashScreenSettings.getFadeOutDuration().intValue(), z);
                    if (splashListener != null) {
                        splashListener.completed();
                    }
                }
            }));
        }
    }

    /* access modifiers changed from: package-private */
    /* renamed from: lambda$show$8$com-capacitorjs-plugins-splashscreen-SplashScreen  reason: not valid java name */
    public /* synthetic */ void m58lambda$show$8$comcapacitorjspluginssplashscreenSplashScreen(AppCompatActivity appCompatActivity, SplashScreenSettings splashScreenSettings, Animator.AnimatorListener animatorListener) {
        WindowManager.LayoutParams layoutParams = new WindowManager.LayoutParams();
        layoutParams.gravity = 17;
        layoutParams.flags = appCompatActivity.getWindow().getAttributes().flags;
        layoutParams.format = -3;
        try {
            this.windowManager.addView(this.splashImage, layoutParams);
            if (this.config.isImmersive()) {
                if (Build.VERSION.SDK_INT >= 30) {
                    appCompatActivity.runOnUiThread(new SplashScreen$$ExternalSyntheticLambda6(this, appCompatActivity));
                } else {
                    legacyImmersive();
                }
            } else if (this.config.isFullScreen()) {
                if (Build.VERSION.SDK_INT >= 30) {
                    appCompatActivity.runOnUiThread(new SplashScreen$$ExternalSyntheticLambda7(this, appCompatActivity));
                } else {
                    legacyFullscreen();
                }
            }
            this.splashImage.setAlpha(0.0f);
            this.splashImage.animate().alpha(1.0f).setInterpolator(new LinearInterpolator()).setDuration((long) splashScreenSettings.getFadeInDuration().intValue()).setListener(animatorListener).start();
            this.splashImage.setVisibility(0);
            ProgressBar progressBar = this.spinnerBar;
            if (progressBar != null) {
                progressBar.setVisibility(4);
                if (this.spinnerBar.getParent() != null) {
                    this.windowManager.removeView(this.spinnerBar);
                }
                layoutParams.height = -2;
                layoutParams.width = -2;
                this.windowManager.addView(this.spinnerBar, layoutParams);
                if (this.config.isShowSpinner()) {
                    this.spinnerBar.setAlpha(0.0f);
                    this.spinnerBar.animate().alpha(1.0f).setInterpolator(new LinearInterpolator()).setDuration((long) splashScreenSettings.getFadeInDuration().intValue()).start();
                    this.spinnerBar.setVisibility(0);
                }
            }
        } catch (IllegalArgumentException | IllegalStateException unused) {
            Logger.debug("Could not add splash view");
        }
    }

    /* access modifiers changed from: package-private */
    /* renamed from: lambda$show$6$com-capacitorjs-plugins-splashscreen-SplashScreen  reason: not valid java name */
    public /* synthetic */ void m56lambda$show$6$comcapacitorjspluginssplashscreenSplashScreen(AppCompatActivity appCompatActivity) {
        WindowCompat.setDecorFitsSystemWindows(appCompatActivity.getWindow(), false);
        WindowInsetsController windowInsetsController = this.splashImage.getWindowInsetsController();
        windowInsetsController.hide(WindowInsetsCompat.Type.systemBars());
        windowInsetsController.setSystemBarsBehavior(2);
    }

    /* access modifiers changed from: package-private */
    /* renamed from: lambda$show$7$com-capacitorjs-plugins-splashscreen-SplashScreen  reason: not valid java name */
    public /* synthetic */ void m57lambda$show$7$comcapacitorjspluginssplashscreenSplashScreen(AppCompatActivity appCompatActivity) {
        WindowCompat.setDecorFitsSystemWindows(appCompatActivity.getWindow(), false);
        this.splashImage.getWindowInsetsController().hide(WindowInsetsCompat.Type.statusBars());
    }

    private void legacyImmersive() {
        this.splashImage.setSystemUiVisibility(5894);
    }

    private void legacyFullscreen() {
        this.splashImage.setSystemUiVisibility(4);
    }

    /* access modifiers changed from: private */
    public void hide(int i, boolean z) {
        if (z && this.isVisible) {
            Logger.debug("SplashScreen was automatically hidden after the launch timeout. You should call `SplashScreen.hide()` as soon as your web app is loaded (or increase the timeout).Read more at https://capacitorjs.com/docs/apis/splash-screen#hiding-the-splash-screen");
        }
        if (!this.isHiding) {
            if (this.onPreDrawListener != null) {
                if (i != 200) {
                    Logger.warn("fadeOutDuration parameter doesn't work on initial splash screen, use launchFadeOutDuration configuration option");
                }
                this.isVisible = false;
                View view = this.content;
                if (view != null) {
                    view.getViewTreeObserver().removeOnPreDrawListener(this.onPreDrawListener);
                }
                this.onPreDrawListener = null;
                return;
            }
            View view2 = this.splashImage;
            if (view2 != null && view2.getParent() != null) {
                this.isHiding = true;
                new Handler(this.context.getMainLooper()).post(new SplashScreen$$ExternalSyntheticLambda4(this, i, new Animator.AnimatorListener() {
                    public void onAnimationRepeat(Animator animator) {
                    }

                    public void onAnimationStart(Animator animator) {
                    }

                    public void onAnimationEnd(Animator animator) {
                        SplashScreen.this.tearDown(false);
                    }

                    public void onAnimationCancel(Animator animator) {
                        SplashScreen.this.tearDown(false);
                    }
                }));
            }
        }
    }

    /* access modifiers changed from: package-private */
    /* renamed from: lambda$hide$9$com-capacitorjs-plugins-splashscreen-SplashScreen  reason: not valid java name */
    public /* synthetic */ void m54lambda$hide$9$comcapacitorjspluginssplashscreenSplashScreen(int i, Animator.AnimatorListener animatorListener) {
        ProgressBar progressBar = this.spinnerBar;
        if (progressBar != null) {
            progressBar.setAlpha(1.0f);
            this.spinnerBar.animate().alpha(0.0f).setInterpolator(new LinearInterpolator()).setDuration((long) i).start();
        }
        this.splashImage.setAlpha(1.0f);
        this.splashImage.animate().alpha(0.0f).setInterpolator(new LinearInterpolator()).setDuration((long) i).setListener(animatorListener).start();
    }

    private void hideDialog(AppCompatActivity appCompatActivity, boolean z) {
        if (z && this.isVisible) {
            Logger.debug("SplashScreen was automatically hidden after the launch timeout. You should call `SplashScreen.hide()` as soon as your web app is loaded (or increase the timeout).Read more at https://capacitorjs.com/docs/apis/splash-screen#hiding-the-splash-screen");
        }
        if (!this.isHiding) {
            if (this.onPreDrawListener != null) {
                this.isVisible = false;
                View view = this.content;
                if (view != null) {
                    view.getViewTreeObserver().removeOnPreDrawListener(this.onPreDrawListener);
                }
                this.onPreDrawListener = null;
                return;
            }
            this.isHiding = true;
            appCompatActivity.runOnUiThread(new SplashScreen$$ExternalSyntheticLambda5(this, appCompatActivity));
        }
    }

    /* access modifiers changed from: package-private */
    /* renamed from: lambda$hideDialog$10$com-capacitorjs-plugins-splashscreen-SplashScreen  reason: not valid java name */
    public /* synthetic */ void m55lambda$hideDialog$10$comcapacitorjspluginssplashscreenSplashScreen(AppCompatActivity appCompatActivity) {
        Dialog dialog2 = this.dialog;
        if (dialog2 != null && dialog2.isShowing()) {
            if (!appCompatActivity.isFinishing() && !appCompatActivity.isDestroyed()) {
                this.dialog.dismiss();
            }
            this.dialog = null;
            this.isHiding = false;
            this.isVisible = false;
        }
    }

    /* access modifiers changed from: private */
    public void tearDown(boolean z) {
        ProgressBar progressBar = this.spinnerBar;
        if (!(progressBar == null || progressBar.getParent() == null)) {
            this.spinnerBar.setVisibility(4);
            if (z) {
                this.windowManager.removeView(this.spinnerBar);
            }
        }
        View view = this.splashImage;
        if (!(view == null || view.getParent() == null)) {
            this.splashImage.setVisibility(4);
            this.windowManager.removeView(this.splashImage);
        }
        if ((Build.VERSION.SDK_INT >= 30 && this.config.isFullScreen()) || this.config.isImmersive()) {
            WindowCompat.setDecorFitsSystemWindows(((Activity) this.context).getWindow(), true);
        }
        this.isHiding = false;
        this.isVisible = false;
    }
}
