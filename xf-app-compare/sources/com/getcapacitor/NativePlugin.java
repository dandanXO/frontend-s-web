package com.getcapacitor;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

@Deprecated
@Retention(RetentionPolicy.RUNTIME)
public @interface NativePlugin {
    String name() default "";

    int permissionRequestCode() default 9000;

    String[] permissions() default {};

    int[] requestCodes() default {};
}
