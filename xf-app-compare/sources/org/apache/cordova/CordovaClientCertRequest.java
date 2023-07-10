package org.apache.cordova;

import android.webkit.ClientCertRequest;
import java.security.Principal;
import java.security.PrivateKey;
import java.security.cert.X509Certificate;

public class CordovaClientCertRequest implements ICordovaClientCertRequest {
    private final ClientCertRequest request;

    public CordovaClientCertRequest(ClientCertRequest clientCertRequest) {
        this.request = clientCertRequest;
    }

    public void cancel() {
        this.request.cancel();
    }

    public String getHost() {
        return this.request.getHost();
    }

    public String[] getKeyTypes() {
        return this.request.getKeyTypes();
    }

    public int getPort() {
        return this.request.getPort();
    }

    public Principal[] getPrincipals() {
        return this.request.getPrincipals();
    }

    public void ignore() {
        this.request.ignore();
    }

    public void proceed(PrivateKey privateKey, X509Certificate[] x509CertificateArr) {
        this.request.proceed(privateKey, x509CertificateArr);
    }
}
