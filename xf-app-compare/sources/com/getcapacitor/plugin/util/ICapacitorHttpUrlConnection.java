package com.getcapacitor.plugin.util;

import java.io.IOException;
import java.io.InputStream;

public interface ICapacitorHttpUrlConnection {
    InputStream getErrorStream();

    String getHeaderField(String str);

    InputStream getInputStream() throws IOException;
}
