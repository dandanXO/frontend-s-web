package org.apache.cordova;

import android.content.Context;
import androidx.webkit.ProxyConfig;
import org.xmlpull.v1.XmlPullParser;

public class AllowListPlugin extends CordovaPlugin {
    protected static final String LOG_TAG = "CordovaAllowListPlugin";
    public static final String PLUGIN_NAME = "CordovaAllowListPlugin";
    /* access modifiers changed from: private */
    public AllowList allowedIntents;
    /* access modifiers changed from: private */
    public AllowList allowedNavigations;
    /* access modifiers changed from: private */
    public AllowList allowedRequests;

    public AllowListPlugin() {
    }

    public AllowListPlugin(Context context) {
        this(new AllowList(), new AllowList(), (AllowList) null);
        new CustomConfigXmlParser().parse(context);
    }

    public AllowListPlugin(XmlPullParser xmlPullParser) {
        this(new AllowList(), new AllowList(), (AllowList) null);
        new CustomConfigXmlParser().parse(xmlPullParser);
    }

    public AllowListPlugin(AllowList allowList, AllowList allowList2, AllowList allowList3) {
        if (allowList3 == null) {
            allowList3 = new AllowList();
            allowList3.addAllowListEntry("file:///*", false);
            allowList3.addAllowListEntry("data:*", false);
        }
        this.allowedNavigations = allowList;
        this.allowedIntents = allowList2;
        this.allowedRequests = allowList3;
    }

    public void pluginInitialize() {
        if (this.allowedNavigations == null) {
            this.allowedNavigations = new AllowList();
            this.allowedIntents = new AllowList();
            this.allowedRequests = new AllowList();
            new CustomConfigXmlParser().parse(this.webView.getContext());
        }
    }

    private class CustomConfigXmlParser extends ConfigXmlParser {
        private CordovaPreferences prefs;

        public void handleEndTag(XmlPullParser xmlPullParser) {
        }

        private CustomConfigXmlParser() {
            this.prefs = new CordovaPreferences();
        }

        public void handleStartTag(XmlPullParser xmlPullParser) {
            String attributeValue;
            String name = xmlPullParser.getName();
            boolean z = false;
            if (name.equals("content")) {
                AllowListPlugin.this.allowedNavigations.addAllowListEntry(xmlPullParser.getAttributeValue((String) null, "src"), false);
            } else if (name.equals("allow-navigation")) {
                String attributeValue2 = xmlPullParser.getAttributeValue((String) null, "href");
                if (ProxyConfig.MATCH_ALL_SCHEMES.equals(attributeValue2)) {
                    AllowListPlugin.this.allowedNavigations.addAllowListEntry("http://*/*", false);
                    AllowListPlugin.this.allowedNavigations.addAllowListEntry("https://*/*", false);
                    AllowListPlugin.this.allowedNavigations.addAllowListEntry("data:*", false);
                    return;
                }
                AllowListPlugin.this.allowedNavigations.addAllowListEntry(attributeValue2, false);
            } else if (name.equals("allow-intent")) {
                AllowListPlugin.this.allowedIntents.addAllowListEntry(xmlPullParser.getAttributeValue((String) null, "href"), false);
            } else if (name.equals("access") && (attributeValue = xmlPullParser.getAttributeValue((String) null, "origin")) != null) {
                if (ProxyConfig.MATCH_ALL_SCHEMES.equals(attributeValue)) {
                    AllowListPlugin.this.allowedRequests.addAllowListEntry("http://*/*", false);
                    AllowListPlugin.this.allowedRequests.addAllowListEntry("https://*/*", false);
                    return;
                }
                String attributeValue3 = xmlPullParser.getAttributeValue((String) null, "subdomains");
                AllowList access$300 = AllowListPlugin.this.allowedRequests;
                if (attributeValue3 != null && attributeValue3.compareToIgnoreCase("true") == 0) {
                    z = true;
                }
                access$300.addAllowListEntry(attributeValue, z);
            }
        }
    }

    public Boolean shouldAllowNavigation(String str) {
        return this.allowedNavigations.isUrlAllowListed(str) ? true : null;
    }

    public Boolean shouldAllowRequest(String str) {
        if (Boolean.TRUE.equals(shouldAllowNavigation(str)) || this.allowedRequests.isUrlAllowListed(str)) {
            return true;
        }
        return null;
    }

    public Boolean shouldOpenExternalUrl(String str) {
        return this.allowedIntents.isUrlAllowListed(str) ? true : null;
    }

    public AllowList getAllowedNavigations() {
        return this.allowedNavigations;
    }

    public void setAllowedNavigations(AllowList allowList) {
        this.allowedNavigations = allowList;
    }

    public AllowList getAllowedIntents() {
        return this.allowedIntents;
    }

    public void setAllowedIntents(AllowList allowList) {
        this.allowedIntents = allowList;
    }

    public AllowList getAllowedRequests() {
        return this.allowedRequests;
    }

    public void setAllowedRequests(AllowList allowList) {
        this.allowedRequests = allowList;
    }
}
