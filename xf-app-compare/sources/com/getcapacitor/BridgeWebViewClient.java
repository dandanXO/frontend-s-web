package com.getcapacitor;

import android.graphics.Bitmap;
import android.net.Uri;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class BridgeWebViewClient extends WebViewClient {
    private Bridge bridge;

    public BridgeWebViewClient(Bridge bridge2) {
        this.bridge = bridge2;
    }

    public WebResourceResponse shouldInterceptRequest(WebView webView, WebResourceRequest webResourceRequest) {
        return this.bridge.getLocalServer().shouldInterceptRequest(webResourceRequest);
    }

    public boolean shouldOverrideUrlLoading(WebView webView, WebResourceRequest webResourceRequest) {
        return this.bridge.launchIntent(webResourceRequest.getUrl());
    }

    @Deprecated
    public boolean shouldOverrideUrlLoading(WebView webView, String str) {
        return this.bridge.launchIntent(Uri.parse(str));
    }

    public void onPageFinished(WebView webView, String str) {
        super.onPageFinished(webView, str);
        if (this.bridge.getWebViewListeners() != null && webView.getProgress() == 100) {
            for (WebViewListener onPageLoaded : this.bridge.getWebViewListeners()) {
                onPageLoaded.onPageLoaded(webView);
            }
        }
    }

    public void onReceivedError(WebView webView, WebResourceRequest webResourceRequest, WebResourceError webResourceError) {
        super.onReceivedError(webView, webResourceRequest, webResourceError);
        if (this.bridge.getWebViewListeners() != null) {
            for (WebViewListener onReceivedError : this.bridge.getWebViewListeners()) {
                onReceivedError.onReceivedError(webView);
            }
        }
        String errorUrl = this.bridge.getErrorUrl();
        if (errorUrl != null && webResourceRequest.isForMainFrame()) {
            webView.loadUrl(errorUrl);
        }
    }

    public void onPageStarted(WebView webView, String str, Bitmap bitmap) {
        super.onPageStarted(webView, str, bitmap);
        this.bridge.reset();
        if (this.bridge.getWebViewListeners() != null) {
            for (WebViewListener onPageStarted : this.bridge.getWebViewListeners()) {
                onPageStarted.onPageStarted(webView);
            }
        }
    }

    public void onReceivedHttpError(WebView webView, WebResourceRequest webResourceRequest, WebResourceResponse webResourceResponse) {
        super.onReceivedHttpError(webView, webResourceRequest, webResourceResponse);
        if (this.bridge.getWebViewListeners() != null) {
            for (WebViewListener onReceivedHttpError : this.bridge.getWebViewListeners()) {
                onReceivedHttpError.onReceivedHttpError(webView);
            }
        }
        String errorUrl = this.bridge.getErrorUrl();
        if (errorUrl != null && webResourceRequest.isForMainFrame()) {
            webView.loadUrl(errorUrl);
        }
    }
}
