package com.capacitorjs.plugins.splashscreen;

import android.widget.ImageView;

public class SplashScreenConfig {
    private Integer backgroundColor;
    private boolean fullScreen = false;
    private boolean immersive = false;
    private boolean launchAutoHide = true;
    private Integer launchFadeInDuration = 0;
    private Integer launchFadeOutDuration = 200;
    private Integer launchShowDuration = 500;
    private String layoutName;
    private String resourceName = "splash";
    private ImageView.ScaleType scaleType = ImageView.ScaleType.FIT_XY;
    private boolean showSpinner = false;
    private Integer spinnerColor;
    private Integer spinnerStyle;
    private boolean usingDialog = false;

    public Integer getBackgroundColor() {
        return this.backgroundColor;
    }

    public void setBackgroundColor(Integer num) {
        this.backgroundColor = num;
    }

    public Integer getSpinnerStyle() {
        return this.spinnerStyle;
    }

    public void setSpinnerStyle(Integer num) {
        this.spinnerStyle = num;
    }

    public Integer getSpinnerColor() {
        return this.spinnerColor;
    }

    public void setSpinnerColor(Integer num) {
        this.spinnerColor = num;
    }

    public boolean isShowSpinner() {
        return this.showSpinner;
    }

    public void setShowSpinner(boolean z) {
        this.showSpinner = z;
    }

    public Integer getLaunchShowDuration() {
        return this.launchShowDuration;
    }

    public void setLaunchShowDuration(Integer num) {
        this.launchShowDuration = num;
    }

    public boolean isLaunchAutoHide() {
        return this.launchAutoHide;
    }

    public void setLaunchAutoHide(boolean z) {
        this.launchAutoHide = z;
    }

    public Integer getLaunchFadeInDuration() {
        return this.launchFadeInDuration;
    }

    public String getResourceName() {
        return this.resourceName;
    }

    public void setResourceName(String str) {
        this.resourceName = str;
    }

    public boolean isImmersive() {
        return this.immersive;
    }

    public void setImmersive(boolean z) {
        this.immersive = z;
    }

    public boolean isFullScreen() {
        return this.fullScreen;
    }

    public void setFullScreen(boolean z) {
        this.fullScreen = z;
    }

    public ImageView.ScaleType getScaleType() {
        return this.scaleType;
    }

    public void setScaleType(ImageView.ScaleType scaleType2) {
        this.scaleType = scaleType2;
    }

    public boolean isUsingDialog() {
        return this.usingDialog;
    }

    public void setUsingDialog(boolean z) {
        this.usingDialog = z;
    }

    public String getLayoutName() {
        return this.layoutName;
    }

    public void setLayoutName(String str) {
        this.layoutName = str;
    }

    public Integer getLaunchFadeOutDuration() {
        return this.launchFadeOutDuration;
    }

    public void setLaunchFadeOutDuration(Integer num) {
        this.launchFadeOutDuration = num;
    }
}
